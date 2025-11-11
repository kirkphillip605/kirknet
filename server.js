import express from 'express';
import cors from 'cors';
import Mailjet from 'node-mailjet';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.API_PORT || 9620;

// Determine __dirname (since using ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend files from dist/
app.use(express.static(path.join(__dirname, 'dist')));

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

// ====================
// Contact form endpoint
// ====================
app.post('/api/send-contact-email', async (req, res) => {
  try {
    const { name, businessName, phone, email, service, message } = req.body;

    // Validation
    if (!name || !phone || !email || !service || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (name.length < 2 || name.length > 100) {
      return res.status(400).json({ error: 'Name must be between 2 and 100 characters' });
    }

    if (message.length < 10 || message.length > 5000) {
      return res.status(400).json({ error: 'Message must be between 10 and 5000 characters' });
    }

    if (businessName && businessName.length > 100) {
      return res.status(400).json({ error: 'Business name must be less than 100 characters' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+$/;
    if (!emailRegex.test(email) || !email.includes('.')) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // Mailjet config
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
          From: { Email: fromEmail, Name: fromName },
          To: [{ Email: toEmail, Name: toName }],
          Subject: `🔔 New Kirknet Contact Inquiry - ${serviceName} - ${name}`,
          TextPart: `
New contact form inquiry:
Name: ${name}
Business: ${businessName || 'N/A'}
Email: ${email}
Phone: ${phone}
Service: ${serviceName}
Message: ${message}
          `,
        },
      ],
    });

    console.log(`Email sent successfully to ${toEmail}`);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ error: error?.message || 'Failed to send email' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => res.status(200).json({ status: 'healthy' }));

// Fallback for SPA routes (must come last)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
