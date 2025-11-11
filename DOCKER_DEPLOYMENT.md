# Docker Deployment Guide

This guide provides step-by-step instructions for deploying the Kirknet application using Docker.

## Prerequisites

- Docker (version 20.10 or higher)
- Docker Compose (v2.0 or higher)
- Git
- Mailjet account with API credentials
- hCaptcha account with site and secret keys

## Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/kirkphillip605/kirknet.git
   cd kirknet
   ```

2. **Configure environment variables**
   
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your credentials:
   ```bash
   nano .env  # or use your preferred editor
   ```
   
   **Required variables:**
   - `MAILJET_API_KEY` - Your Mailjet API key (from https://app.mailjet.com/account/apikeys)
   - `MAILJET_SECRET_KEY` - Your Mailjet secret key
   - `VITE_HCAPTCHA_SITE_KEY` - Your hCaptcha site key (from https://dashboard.hcaptcha.com/)
   - `HCAPTCHA_SECRET_KEY` - Your hCaptcha secret key
   - `MAILJET_TO_EMAIL` - Email address to receive contact form submissions

3. **Start the application**
   ```bash
   docker compose up -d --build
   ```
   
   Note: The `--build` flag is important on first run to ensure environment variables are baked into the build.

4. **Verify deployment**
   ```bash
   docker compose ps
   docker compose logs -f kirknet
   ```

5. **Access the application**
   
   Open your browser and navigate to: `http://localhost:9620`

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MAILJET_API_KEY` | Mailjet API key for sending emails | `abc123...` |
| `MAILJET_SECRET_KEY` | Mailjet secret key | `xyz789...` |
| `VITE_HCAPTCHA_SITE_KEY` | hCaptcha site key (public, used at build time) | `10000000-ffff-ffff-ffff-000000000001` |
| `HCAPTCHA_SECRET_KEY` | hCaptcha secret key (private, server-side verification) | `0x0000000000000000000000000000000000000000` |
| `MAILJET_TO_EMAIL` | Email address to receive form submissions | `you@example.com` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `API_PORT` | Port for the application server | `9620` |
| `HOST` | Host binding for the server | `0.0.0.0` |
| `HOSTNAME` | Domain name for CORS | `kirknetllc.com` |
| `MAILJET_FROM_EMAIL` | Email address to send from | `noreply@kirknetllc.com` |
| `MAILJET_FROM_NAME` | Name to display as sender | `Kirknet Message` |
| `MAILJET_TO_NAME` | Name of the recipient | `Your Name` |

## Docker Commands

### Starting the Application

```bash
# Start in detached mode (recommended for production)
docker compose up -d --build

# Start with logs visible (good for debugging)
docker compose up --build

# Rebuild and start (use when code or env vars change)
docker compose up -d --build --force-recreate
```

### Stopping the Application

```bash
# Stop containers
docker compose stop

# Stop and remove containers
docker compose down

# Stop, remove containers, and delete volumes
docker compose down -v
```

### Viewing Logs

```bash
# View logs for the service
docker compose logs -f kirknet

# View last 100 lines of logs
docker compose logs --tail=100 kirknet

# View logs since a specific time
docker compose logs --since 30m kirknet
```

### Checking Status

```bash
# Check running containers
docker compose ps

# Check container health
docker inspect kirknet --format='{{.State.Health.Status}}'

# Test health endpoint
curl http://localhost:9620/health
```

### Updating the Application

```bash
# Pull latest changes
git pull

# Rebuild and restart
docker compose up -d --build

# Alternatively, rebuild specific service
docker compose build frontend
docker compose up -d frontend
```

## Production Deployment

### 1. Server Setup

Ensure your server has:
- Docker and Docker Compose installed
- Port 9620 open (or configure alternative port in .env)
- SSL/TLS certificates (recommended for production)

### 2. Clone Repository

```bash
cd /opt
git clone https://github.com/kirkphillip605/kirknet.git
cd kirknet
```

### 3. Configure Environment

```bash
cp .env.example .env
nano .env
```

Add your production credentials to the `.env` file.

### 4. Deploy

```bash
docker compose up -d
```

### 5. Set Up SSL/TLS (Optional but Recommended)

You can use a reverse proxy like Nginx or Caddy in front of the Docker containers to handle SSL/TLS:

**Using Nginx as a reverse proxy:**

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:9620;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Using Caddy (automatic HTTPS):**

```
yourdomain.com {
    reverse_proxy localhost:9620
}
```

### 6. Configure Firewall

```bash
# Allow HTTP and HTTPS (for reverse proxy)
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# If not using a reverse proxy, allow application port directly
sudo ufw allow 9620/tcp
```

## Troubleshooting

### Container Won't Start

**Check logs:**
```bash
docker compose logs kirknet
```

**Common issues:**
- Missing required environment variables (especially `VITE_HCAPTCHA_SITE_KEY`)
- Port conflicts (9620 already in use)
- Invalid Mailjet or hCaptcha credentials
- npm install failures during build

### Email Not Sending

1. Verify Mailjet credentials in `.env`
2. Check server logs: `docker compose logs kirknet`
3. Ensure Mailjet account is active and verified
4. Check that `MAILJET_TO_EMAIL` is set correctly
5. Test the contact form and check browser console for errors

### hCaptcha Not Loading

1. Verify `VITE_HCAPTCHA_SITE_KEY` is set in `.env`
2. Rebuild the container: `docker compose up -d --build`
3. Check browser console for errors
4. Ensure the site key is valid and matches your domain

### Frontend Not Loading

1. Check if container is running: `docker compose ps`
2. Check server logs: `docker compose logs kirknet`
3. Check if port 9620 is accessible from your browser
4. If using a reverse proxy, verify proxy configuration

### API Connection Issues

1. Check if application is healthy:
   ```bash
   curl http://localhost:9620/health
   ```
2. Verify the container is running:
   ```bash
   docker compose ps
   ```
3. Check network connectivity:
   ```bash
   docker network inspect kirknet-network
   ```

### High CPU or Memory Usage

1. Check container resource usage:
   ```bash
   docker stats
   ```
2. Consider limiting resources in `docker-compose.yml`:
   ```yaml
   services:
     api:
       deploy:
         resources:
           limits:
             cpus: '0.5'
             memory: 512M
   ```

## Monitoring

### Health Checks

The service includes health checks:

```bash
# Check application health
curl http://localhost:9620/health

# Expected response:
# {"status":"healthy"}
```

### Resource Monitoring

```bash
# Monitor resource usage
docker stats

# Monitor the kirknet container
docker stats kirknet
```

## Backup and Restore

### Backup Configuration

```bash
# Backup environment configuration
cp .env .env.backup
```

### Container Data

The application doesn't persist data in containers. All configuration is in `.env`.

## Security Best Practices

1. **Never commit `.env` file** - It contains sensitive credentials
2. **Protect API keys** - Keep Mailjet and hCaptcha keys secure
3. **Keep Docker updated** - Regularly update Docker and images
4. **Use SSL/TLS** - Always use HTTPS in production
5. **Configure HOSTNAME** - Set correct domain in `.env` for CORS
6. **Regular updates** - Keep the application and dependencies updated
7. **Monitor logs** - Regularly check logs for suspicious activity
8. **Rebuild on env changes** - Always rebuild when changing `VITE_*` variables

## Important Notes

### Build-time vs Runtime Variables

- **VITE_HCAPTCHA_SITE_KEY**: This is a build-time variable. It must be set in `.env` BEFORE building the Docker image. If you change this value, you MUST rebuild: `docker compose up -d --build`
- **Other variables**: Runtime variables (MAILJET_*, HCAPTCHA_SECRET_KEY, etc.) can be changed in `.env` and applied with a simple restart: `docker compose restart kirknet`

## Support

For issues or questions:
- Check the [main README](README.md) for general information
- Review logs: `docker compose logs -f`
- Check [Docker documentation](https://docs.docker.com/)
- Open an issue on GitHub

## License

This project is licensed under the terms specified in the repository.
