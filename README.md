# Welcome to your Dyad app

## Environment Variables Setup

This application requires the following environment variables to be configured:

### Required Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Mailjet Configuration (Server-side)
MAILJET_API_KEY=your_mailjet_api_key_here
MAILJET_SECRET_KEY=your_mailjet_secret_key_here
MAILJET_SMTP_HOST=in-v3.mailjet.com
MAILJET_SMTP_PORT=587
MAILJET_FROM_EMAIL=noreply@kirknetllc.com
MAILJET_FROM_NAME=Kirknet Message

# reCAPTCHA Configuration
VITE_RECAPTCHA_SITE_KEY=your_recaptcha_site_key_here
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key_here
```

**Note**: Replace the placeholder values with your actual credentials. Never commit the `.env` file to version control.

### Contact Form

The contact form sends notifications to the configured recipient email when visitors submit inquiries. The form includes:
- Google reCAPTCHA v2 (invisible) protection against spam
- Professional HTML email formatting with responsive design
- Field validation for name, email, phone, service selection, and message
- Real-time form validation using React Hook Form and Zod

### API Configuration

- **Email Service**: Mailjet (using node-mailjet package)
- **Sender Email**: noreply@kirknetllc.com
- **Recipient Email**: Configure via the API endpoint
- **reCAPTCHA**: Google reCAPTCHA v2 Invisible

### Deployment

When deploying to Vercel, make sure to add these environment variables in your Vercel project settings:
- `MAILJET_API_KEY`
- `MAILJET_SECRET_KEY`
- `VITE_RECAPTCHA_SITE_KEY`
- `RECAPTCHA_SECRET_KEY`

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
