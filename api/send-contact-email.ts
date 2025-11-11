import 'dotenv/config';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import Mailjet from 'node-mailjet';
import validator from 'validator';

// Rate limiting storage (in-memory for serverless)
// In production, consider using Redis or a database
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Helper function to escape HTML
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

// Helper function to sanitize input
function sanitizeInput(text: string): string {
  if (typeof text !== 'string') return '';
  return validator.escape(text.trim()).slice(0, 10000);
}

// Helper function to check rate limit
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const key = `rate_${ip}`;
  const limit = rateLimitStore.get(key);

  // Clean up expired entries periodically
  if (limit && now > limit.resetTime) {
    rateLimitStore.delete(key);
  }

  if (!limit || now > limit.resetTime) {
    // New window: allow 3 requests per 5 minutes
    rateLimitStore.set(key, { count: 1, resetTime: now + 5 * 60 * 1000 });
    return true;
  }

  if (limit.count >= 3) {
    // Log suspicious activity
    console.warn(`Rate limit exceeded for IP: ${ip} at ${new Date().toISOString()}`);
    return false;
  }

  // Increment count
  limit.count += 1;
  rateLimitStore.set(key, limit);
  return true;
}

// Helper function to verify hCaptcha token
async function verifyHCaptcha(token: string, remoteip?: string): Promise<boolean> {
  const secretKey = process.env.HCAPTCHA_SECRET_KEY;
  
  if (!secretKey) {
    console.error('hCaptcha secret key not configured');
    return false;
  }

  try {
    const response = await fetch('https://hcaptcha.com/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: secretKey,
        response: token,
        ...(remoteip && { remoteip }),
      }),
    });

    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error('hCaptcha verification error:', error);
    return false;
  }
}

// Helper function to get allowed origin
function getAllowedOrigin(requestOrigin: string | undefined): string {
  const hostname = process.env.HOSTNAME || 'kirknetllc.com';
  
  // If no origin, allow (for server-side requests)
  if (!requestOrigin) return '*';
  
  // Allow localhost for development
  if (requestOrigin.includes('localhost') || requestOrigin.includes('127.0.0.1')) {
    return requestOrigin;
  }
  
  // Allow the configured hostname
  if (requestOrigin.includes(hostname)) {
    return requestOrigin;
  }
  
  // Default to the configured hostname with https
  return `https://${hostname}`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin;
  const allowedOrigin = getAllowedOrigin(origin);
  
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200)
      .setHeader('Access-Control-Allow-Origin', allowedOrigin)
      .setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
      .setHeader('Access-Control-Allow-Headers', 'Content-Type')
      .setHeader('Access-Control-Allow-Credentials', 'true')
      .end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, businessName, phone, email, service, message, captchaToken, honeypot } = req.body;

    // Get client IP for rate limiting and logging
    const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || 
                     (req.headers['x-real-ip'] as string) || 
                     'unknown';

    // Check honeypot field - if filled, silently reject (looks like success to bot)
    if (honeypot && honeypot.length > 0) {
      console.warn(`Honeypot triggered from IP: ${clientIp} at ${new Date().toISOString()}`);
      // Return success to avoid revealing the honeypot
      return res.status(200)
        .setHeader('Access-Control-Allow-Origin', getAllowedOrigin(req.headers.origin))
        .setHeader('Access-Control-Allow-Credentials', 'true')
        .json({ success: true });
    }

    // Check rate limit
    if (!checkRateLimit(clientIp)) {
      console.warn(`Rate limit exceeded from IP: ${clientIp} at ${new Date().toISOString()}`);
      return res.status(429)
        .setHeader('Access-Control-Allow-Origin', getAllowedOrigin(req.headers.origin))
        .setHeader('Access-Control-Allow-Credentials', 'true')
        .json({ error: 'Too many requests. Please try again later.' });
    }

    // Verify hCaptcha token
    if (!captchaToken) {
      return res.status(400).json({ error: 'CAPTCHA verification required' });
    }

    const captchaValid = await verifyHCaptcha(captchaToken, clientIp);
    if (!captchaValid) {
      console.warn(`Failed hCaptcha verification from IP: ${clientIp} at ${new Date().toISOString()}`);
      return res.status(400).json({ error: 'CAPTCHA verification failed. Please try again.' });
    }

    // Validate required fields
    if (!name || !phone || !email || !service || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Sanitize all inputs
    const sanitizedName = sanitizeInput(name);
    const sanitizedBusinessName = businessName ? sanitizeInput(businessName) : '';
    const sanitizedPhone = sanitizeInput(phone);
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedMessage = sanitizeInput(message);

    // Validate field lengths
    if (sanitizedName.length < 2 || sanitizedName.length > 100) {
      return res.status(400).json({ error: 'Name must be between 2 and 100 characters' });
    }

    if (sanitizedMessage.length < 10 || sanitizedMessage.length > 5000) {
      return res.status(400).json({ error: 'Message must be between 10 and 5000 characters' });
    }

    if (sanitizedBusinessName && sanitizedBusinessName.length > 100) {
      return res.status(400).json({ error: 'Business name must be less than 100 characters' });
    }

    // Enhanced email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(sanitizedEmail) || !validator.isEmail(sanitizedEmail)) {
      return res.status(400).json({ error: 'Please enter a valid email address' });
    }

    // Validate phone number format
    const phoneDigits = sanitizedPhone.replace(/\D/g, '');
    if (phoneDigits.length !== 10) {
      return res.status(400).json({ error: 'Please enter a valid 10-digit phone number' });
    }

    // Validate environment variables
    const mailjetApiKey = process.env.MAILJET_API_KEY;
    const mailjetSecretKey = process.env.MAILJET_SECRET_KEY;
    
    if (!mailjetApiKey || !mailjetSecretKey) {
      console.error('Mailjet credentials not configured');
      return res.status(500).json({ error: 'Email service not configured' });
    }

    // Initialize Mailjet
    const mailjet = new Mailjet({
      apiKey: mailjetApiKey,
      apiSecret: mailjetSecretKey,
    });

    const serviceMap: Record<string, string> = {
      msp: 'Managed Services (MSP)',
      'app-development': 'App Development',
      'web-development': 'Web Development',
      'software-development': 'Software Development',
      'it-consultation': 'IT Consultation',
      other: 'Other',
    };

    const serviceName = serviceMap[service] || 'Not specified';

    await mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: process.env.MAILJET_FROM_EMAIL || 'noreply@kirknetllc.com',
            Name: process.env.MAILJET_FROM_NAME || 'Kirknet Message',
          },
          To: [
            {
              Email: process.env.MAILJET_TO_EMAIL || 'phillipkirk7@gmail.com',
              Name: process.env.MAILJET_TO_NAME || 'Phillip Kirk',
            },
          ],
          Subject: `🔔 New Kirknet Contact Inquiry - ${serviceName} - ${sanitizedName}`,
          TextPart: `
═══════════════════════════════════════════════════════
NEW CONTACT FORM INQUIRY
═══════════════════════════════════════════════════════

CONTACT INFORMATION
-------------------
Name:     ${sanitizedName}
Business: ${sanitizedBusinessName || 'Not provided'}
Email:    ${sanitizedEmail}
Phone:    ${sanitizedPhone}

SERVICE OF INTEREST
-------------------
${serviceName}

MESSAGE
-------
${sanitizedMessage}

═══════════════════════════════════════════════════════
Received: ${new Date().toLocaleString('en-US', { 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric', 
  hour: '2-digit', 
  minute: '2-digit',
  timeZoneName: 'short'
})}
          `,
          HTMLPart: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .email-container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    .email-header {
      background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
      color: #ffffff;
      padding: 30px 20px;
      text-align: center;
    }
    .email-header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }
    .email-body {
      padding: 30px 20px;
    }
    .info-row {
      background-color: #f9fafb;
      padding: 15px;
      margin-bottom: 12px;
      border-radius: 6px;
      border-left: 4px solid #3b82f6;
    }
    .info-label {
      font-weight: 600;
      color: #1e40af;
      margin-bottom: 4px;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .info-value {
      color: #333;
      font-size: 16px;
      word-break: break-word;
    }
    .info-value a {
      color: #3b82f6;
      text-decoration: none;
    }
    .info-value a:hover {
      text-decoration: underline;
    }
    .message-section {
      background-color: #f9fafb;
      padding: 20px;
      margin-top: 20px;
      border-radius: 6px;
      border: 1px solid #e5e7eb;
    }
    .message-label {
      font-weight: 600;
      color: #1e40af;
      margin-bottom: 10px;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .message-content {
      color: #333;
      font-size: 15px;
      line-height: 1.7;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
    .email-footer {
      background-color: #f9fafb;
      padding: 20px;
      text-align: center;
      color: #6b7280;
      font-size: 12px;
      border-top: 1px solid #e5e7eb;
    }
    .divider {
      height: 1px;
      background: linear-gradient(to right, transparent, #e5e7eb, transparent);
      margin: 25px 0;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <h1>🔔 New Contact Form Inquiry</h1>
    </div>
    <div class="email-body">
      <div class="info-row">
        <div class="info-label">Full Name</div>
        <div class="info-value">${escapeHtml(sanitizedName)}</div>
      </div>
      <div class="info-row">
        <div class="info-label">Business Name</div>
        <div class="info-value">${escapeHtml(sanitizedBusinessName || 'Not provided')}</div>
      </div>
      <div class="info-row">
        <div class="info-label">Email Address</div>
        <div class="info-value">
          <a href="mailto:${escapeHtml(sanitizedEmail)}">${escapeHtml(sanitizedEmail)}</a>
        </div>
      </div>
      <div class="info-row">
        <div class="info-label">Phone Number</div>
        <div class="info-value">
          <a href="tel:${escapeHtml(sanitizedPhone)}">${escapeHtml(sanitizedPhone)}</a>
        </div>
      </div>
      <div class="info-row">
        <div class="info-label">Service of Interest</div>
        <div class="info-value">${escapeHtml(serviceName)}</div>
      </div>
      <div class="divider"></div>
      <div class="message-section">
        <div class="message-label">📝 Message</div>
        <div class="message-content">${escapeHtml(sanitizedMessage)}</div>
      </div>
    </div>
    <div class="email-footer">
      This message was sent from the Kirknet contact form at ${new Date().toLocaleString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit',
        timeZoneName: 'short'
      })}
    </div>
  </div>
</body>
</html>
          `,
        },
      ],
    });

    console.log(`Email sent successfully from IP: ${clientIp} at ${new Date().toISOString()}`);

    return res.status(200)
      .setHeader('Access-Control-Allow-Origin', allowedOrigin)
      .setHeader('Access-Control-Allow-Credentials', 'true')
      .json({ success: true });
  } catch (error) {
    // Log error details server-side but return generic error to client
    console.error('Error sending email:', error);
    return res.status(500)
      .setHeader('Access-Control-Allow-Origin', allowedOrigin)
      .setHeader('Access-Control-Allow-Credentials', 'true')
      .json({
        error: 'An error occurred while processing your request. Please try again later.',
      });
  }
}
