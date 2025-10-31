import type { VercelRequest, VercelResponse } from '@vercel/node';
import Mailjet from 'node-mailjet';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).setHeader('Access-Control-Allow-Origin', '*')
      .setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
      .setHeader('Access-Control-Allow-Headers', 'Content-Type')
      .end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, businessName, phone, email, service, message, recaptchaToken } = req.body;

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
      return res.status(400).json({ error: 'reCAPTCHA verification failed' });
    }

    // Initialize Mailjet
    const mailjet = new Mailjet({
      apiKey: process.env.MAILJET_API_KEY || '',
      apiSecret: process.env.MAILJET_SECRET_KEY || '',
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
            Email: 'noreply@kirknetllc.com',
            Name: 'Kirknet Contact Form',
          },
          To: [
            {
              Email: 'phillip@kirknetllc.com',
              Name: 'Phillip Kirk',
            },
          ],
          Subject: `New Contact Form Inquiry: ${serviceName}`,
          TextPart: `
You have a new message from your website contact form.

Name: ${name}
Business: ${businessName || 'N/A'}
Email: ${email}
Phone: ${phone}
Service of Interest: ${serviceName}

Message:
${message}
          `,
          HTMLPart: `
<h3>New Contact Form Inquiry</h3>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Business:</strong> ${businessName || 'N/A'}</p>
<p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
<p><strong>Phone:</strong> <a href="tel:${phone}">${phone}</a></p>
<p><strong>Service of Interest:</strong> ${serviceName}</p>
<hr>
<p><strong>Message:</strong></p>
<p>${message.replace(/\n/g, '<br>')}</p>
          `,
        },
      ],
    });

    return res.status(200).setHeader('Access-Control-Allow-Origin', '*').json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).setHeader('Access-Control-Allow-Origin', '*').json({
      error: error instanceof Error ? error.message : 'Failed to send email',
    });
  }
}
