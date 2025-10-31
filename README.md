# Welcome to your Dyad app

## Environment Variables Setup

This application requires the following environment variables to be configured:

### Required Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Mailjet Configuration (Server-side)
MAILJET_API_KEY=6bfb3ee22d4701f523cf721ac4ee103e
MAILJET_SECRET_KEY=f4cd66bc579c44beb473412a365a0494
MAILJET_SMTP_HOST=in-v3.mailjet.com
MAILJET_SMTP_PORT=587
MAILJET_FROM_EMAIL=noreply@kirknetllc.com
MAILJET_FROM_NAME=Kirknet Message

# reCAPTCHA Configuration
VITE_RECAPTCHA_SITE_KEY=6LfXrv0rAAAAAOfqIzbviKa3IdCKWwonkt4s-PBV
RECAPTCHA_SECRET_KEY=6LfXrv0rAAAAAC0CxsszBb19jLexeuxNMgXaEFov
```

### Contact Form

The contact form sends notifications to `phillipkirk7@gmail.com` when visitors submit inquiries. The form includes:
- Google reCAPTCHA v2 (invisible) protection against spam
- Professional HTML email formatting with responsive design
- Field validation for name, email, phone, service selection, and message
- Real-time form validation using React Hook Form and Zod

### API Configuration

- **Email Service**: Mailjet (using node-mailjet package)
- **Sender Email**: noreply@kirknetllc.com
- **Recipient Email**: phillipkirk7@gmail.com
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
