# Welcome to your Dyad app

## Environment Variables Setup

This application requires the following environment variables to be configured:

### Required Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Mailjet Configuration (Server-side)
MAILJET_API_KEY=your_mailjet_api_key_here
MAILJET_SECRET_KEY=your_mailjet_secret_key_here
MAILJET_FROM_EMAIL=noreply@kirknetllc.com
MAILJET_FROM_NAME=Kirknet Message
MAILJET_TO_EMAIL=phillipkirk7@gmail.com
MAILJET_TO_NAME=Phillip Kirk

# hCaptcha Configuration (for form security)
HCAPTCHA_SITE_KEY=your_hcaptcha_site_key_here
HCAPTCHA_SECRET_KEY=your_hcaptcha_secret_key_here

# Frontend Environment Variables (must be prefixed with VITE_)
VITE_HCAPTCHA_SITE_KEY=your_hcaptcha_site_key_here
```

**Note**: 
- Replace the placeholder values with your actual credentials
- Get hCaptcha keys from https://www.hcaptcha.com/
- The `VITE_` prefix is required for frontend environment variables in Vite
- Never commit the `.env` file to version control

### Contact Form - Production Ready Features

The contact form is fully secured and production-ready with the following features:

**Security & Anti-Spam:**
- ✅ hCaptcha integration to prevent automated bot submissions
- ✅ Rate limiting (3 submissions per 5 minutes per IP address)
- ✅ Hidden honeypot field to catch bots
- ✅ Server-side input sanitization to prevent XSS attacks
- ✅ Security logging for suspicious activity and rate limit violations

**User Experience:**
- ✅ Real-time phone number formatting to US standard: (XXX) XXX-XXXX
- ✅ Enhanced email validation with robust regex pattern
- ✅ Professional HTML email formatting with responsive design
- ✅ Client-side and server-side validation
- ✅ Clear, accessible error messages
- ✅ Success confirmation page showing submission details
- ✅ Smooth loading states and user feedback

**Technical Implementation:**
- ✅ React Hook Form with Zod schema validation
- ✅ TypeScript for type safety
- ✅ Environment variables for all configuration
- ✅ CORS compliant for Vercel serverless deployment

### API Configuration

- **Email Service**: Mailjet (using node-mailjet package)
- **Sender Email**: noreply@kirknetllc.com
- **Recipient Email**: Configure via the API endpoint

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Docker Deployment

This application can be easily deployed to production using Docker. The Docker setup includes:
- A production-optimized build of the React application served with nginx
- An Express.js API server for handling contact form submissions
- Docker Compose for easy orchestration of both services

### Prerequisites

- Docker installed on your system
- Docker Compose installed on your system

### Quick Start with Docker

1. **Clone the repository**
   ```bash
   git clone https://github.com/kirkphillip605/kirknet.git
   cd kirknet
   ```

2. **Create a `.env` file with your configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your actual credentials
   ```

   Required environment variables:
   ```env
   # Mailjet Configuration
   MAILJET_API_KEY=your_mailjet_api_key_here
   MAILJET_SECRET_KEY=your_mailjet_secret_key_here
   MAILJET_FROM_EMAIL=noreply@kirknetllc.com
   MAILJET_FROM_NAME=Kirknet Message
   MAILJET_TO_EMAIL=phillipkirk7@gmail.com
   MAILJET_TO_NAME=Phillip Kirk
   
   # hCaptcha Configuration
   HCAPTCHA_SITE_KEY=your_hcaptcha_site_key_here
   HCAPTCHA_SECRET_KEY=your_hcaptcha_secret_key_here
   VITE_HCAPTCHA_SITE_KEY=your_hcaptcha_site_key_here
   ```

3. **Build and start the containers**
   ```bash
   docker-compose up -d
   ```

4. **Access the application**
   - The application will be available at `http://localhost`
   - The API will be available at `http://localhost:3001`

### Docker Commands

```bash
# Start the containers
docker-compose up -d

# Stop the containers
docker-compose down

# View logs
docker-compose logs -f

# View logs for a specific service
docker-compose logs -f frontend
docker-compose logs -f api

# Rebuild containers after code changes
docker-compose up -d --build

# Check container status
docker-compose ps
```

### Environment Variables

The following environment variables can be configured in your `.env` file:

| Variable | Description | Default |
|----------|-------------|---------|
| `MAILJET_API_KEY` | Your Mailjet API key (required) | - |
| `MAILJET_SECRET_KEY` | Your Mailjet secret key (required) | - |
| `MAILJET_FROM_EMAIL` | Email address to send from | noreply@kirknetllc.com |
| `MAILJET_FROM_NAME` | Name to display as sender | Kirknet Message |
| `MAILJET_TO_EMAIL` | Email address to receive contact form submissions | phillipkirk7@gmail.com |
| `MAILJET_TO_NAME` | Name of the recipient | Phillip Kirk |
| `HCAPTCHA_SITE_KEY` | Your hCaptcha site key (required) | - |
| `HCAPTCHA_SECRET_KEY` | Your hCaptcha secret key (required) | - |
| `VITE_HCAPTCHA_SITE_KEY` | Your hCaptcha site key for frontend (required) | - |
| `API_PORT` | Port for the API server | 3001 |
| `HOSTNAME` | Allowed hostname for CORS | kirknetllc.com |

### Production Deployment

For production deployment on a server:

1. **Set up environment variables**
   - Create a `.env` file with production credentials
   - Never commit the `.env` file to version control

2. **Configure your domain (optional)**
   - Update nginx configuration if using a custom domain
   - Set up SSL/TLS certificates (recommended: Let's Encrypt)

3. **Deploy**
   ```bash
   docker-compose up -d
   ```

4. **Monitor**
   ```bash
   docker-compose logs -f
   ```

### Troubleshooting

- **Containers won't start**: Check logs with `docker-compose logs`
- **Email not sending**: Verify Mailjet credentials in `.env` file
- **API connection issues**: Ensure both frontend and API containers are running with `docker-compose ps`

### Architecture

The Docker setup uses a multi-stage build approach:
- **Frontend**: Built with Vite and served by nginx on port 80
- **API**: Express.js server running on port 3001
- **Network**: Both services communicate via a Docker bridge network

The nginx configuration proxies `/api/*` requests to the API service, providing a single entry point for the application.

## Vercel Deployment

When deploying to Vercel, make sure to add these environment variables in your Vercel project settings:

**Backend Environment Variables (API):**
- `MAILJET_API_KEY` - Your Mailjet API key
- `MAILJET_SECRET_KEY` - Your Mailjet secret key
- `MAILJET_FROM_EMAIL` - Sender email address
- `MAILJET_FROM_NAME` - Sender name
- `MAILJET_TO_EMAIL` - Recipient email address
- `MAILJET_TO_NAME` - Recipient name
- `HCAPTCHA_SECRET_KEY` - Your hCaptcha secret key (server-side)
- `HOSTNAME` - Your domain for CORS (optional)

**Frontend Environment Variables:**
- `VITE_HCAPTCHA_SITE_KEY` - Your hCaptcha site key (must be prefixed with `VITE_`)

**Important Notes:**
- Get hCaptcha keys from https://www.hcaptcha.com/ (free tier available)
- The `VITE_` prefix is required for Vite to expose variables to the browser
- Never expose secret keys (like `HCAPTCHA_SECRET_KEY`) to the frontend
