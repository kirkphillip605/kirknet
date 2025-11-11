import express from 'express';
import cors from 'cors';
import Mailjet from 'node-mailjet';

const app = express();
const PORT = process.env.API_PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Helper function to escape HTML
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

// Contact form endpoint
app.post('/api/send-contact-email', async (req, res) => {
  try {
    const { name, businessName, phone, email, service, message, recaptchaToken } = req.body;

    // Validate required fields
    if (!name || !phone || !email || !service || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate field lengths
    if (name.length < 2 || name.length > 100) {
      return res.status(400).json({ error: 'Name must be between 2 and 100 characters' });
    }

    if (message.length < 10 || message.length > 5000) {
      return res.status(400).json({ error: 'Message must be between 10 and 5000 characters' });
    }

    if (businessName && businessName.length > 100) {
      return res.status(400).json({ error: 'Business name must be less than 100 characters' });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // Verify reCAPTCHA token
    if (!recaptchaToken) {
      return res.status(400).json({ error: 'reCAPTCHA token is required' });
    }

    const recaptchaResponse = await fetch(
      `https://www.google.com/recaptcha/api/siteverify`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
      }
    );

    const recaptchaData = await recaptchaResponse.json();

    if (!recaptchaData.success) {
      console.error('reCAPTCHA verification failed:', recaptchaData['error-codes']);
      return res.status(400).json({ 
        error: 'reCAPTCHA verification failed. Please try again.' 
      });
    }

    // Log successful verification for monitoring
    console.log('reCAPTCHA verification successful');

    // Validate environment variables
    const mailjetApiKey = process.env.MAILJET_API_KEY;
    const mailjetSecretKey = process.env.MAILJET_SECRET_KEY;
    const fromEmail = process.env.MAILJET_FROM_EMAIL || 'noreply@kirknetllc.com';
    const fromName = process.env.MAILJET_FROM_NAME || 'Kirknet Message';
    const toEmail = process.env.MAILJET_TO_EMAIL || 'phillipkirk7@gmail.com';
    const toName = process.env.MAILJET_TO_NAME || 'Phillip Kirk';
    
    if (!mailjetApiKey || !mailjetSecretKey) {
      console.error('Mailjet credentials not configured');
      return res.status(500).json({ error: 'Email service not configured' });
    }

    // Initialize Mailjet
    const mailjet = new Mailjet({
      apiKey: mailjetApiKey,
      apiSecret: mailjetSecretKey,
    });

    const serviceMap = {
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
            Email: fromEmail,
            Name: fromName,
          },
          To: [
            {
              Email: toEmail,
              Name: toName,
            },
          ],
          Subject: `🔔 New Kirknet Contact Inquiry - ${serviceName} - ${name}`,
          TextPart: `
═══════════════════════════════════════════════════════
NEW CONTACT FORM INQUIRY
═══════════════════════════════════════════════════════

CONTACT INFORMATION
-------------------
Name:     ${name}
Business: ${businessName || 'Not provided'}
Email:    ${email}
Phone:    ${phone}

SERVICE OF INTEREST
-------------------
${serviceName}

MESSAGE
-------
${message}

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
        <div class="info-value">${escapeHtml(name)}</div>
      </div>
      <div class="info-row">
        <div class="info-label">Business Name</div>
        <div class="info-value">${escapeHtml(businessName || 'Not provided')}</div>
      </div>
      <div class="info-row">
        <div class="info-label">Email Address</div>
        <div class="info-value">
          <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>
        </div>
      </div>
      <div class="info-row">
        <div class="info-label">Phone Number</div>
        <div class="info-value">
          <a href="tel:${escapeHtml(phone)}">${escapeHtml(phone)}</a>
        </div>
      </div>
      <div class="info-row">
        <div class="info-label">Service of Interest</div>
        <div class="info-value">${escapeHtml(serviceName)}</div>
      </div>
      <div class="divider"></div>
      <div class="message-section">
        <div class="message-label">📝 Message</div>
        <div class="message-content">${escapeHtml(message)}</div>
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

    console.log(`Email sent successfully to ${toEmail}`);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to send email',
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

app.listen(PORT, () => {
  console.log(`API server listening on port ${PORT}`);
});
