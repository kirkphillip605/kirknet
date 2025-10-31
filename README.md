# Welcome to your Dyad app

## Environment Variables Setup

This application requires the following environment variables to be configured:

### Required Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Mailjet Configuration (Server-side)
MAILJET_API_KEY=your_mailjet_api_key_here
MAILJET_SECRET_KEY=your_mailjet_secret_key_here

# reCAPTCHA Configuration
VITE_RECAPTCHA_SITE_KEY=6Lf3LP0rAAAAAFHnqS2yz-gHwJI6jSzHhfV5mC6h
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key_here
```

### Getting Your API Keys

1. **Mailjet**: 
   - Sign up at [Mailjet](https://www.mailjet.com/)
   - Navigate to Account Settings > API Key Management
   - Copy your API Key and Secret Key

2. **reCAPTCHA**:
   - The site key is already configured: `6Lf3LP0rAAAAAFHnqS2yz-gHwJI6jSzHhfV5mC6h`
   - Get the secret key from [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)

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
