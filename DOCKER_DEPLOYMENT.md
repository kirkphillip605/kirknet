# Docker Deployment Guide

This guide provides step-by-step instructions for deploying the Kirknet application using Docker.

## Prerequisites

- Docker (version 20.10 or higher)
- Docker Compose (v2.0 or higher)
- Git

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
   
   Required variables:
   - `MAILJET_API_KEY` - Your Mailjet API key
   - `MAILJET_SECRET_KEY` - Your Mailjet secret key

3. **Start the application**
   ```bash
   docker compose up -d
   ```

4. **Verify deployment**
   ```bash
   docker compose ps
   docker compose logs -f
   ```

5. **Access the application**
   
   Open your browser and navigate to: `http://localhost`

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MAILJET_API_KEY` | Mailjet API key for sending emails | `abc123...` |
| `MAILJET_SECRET_KEY` | Mailjet secret key | `xyz789...` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MAILJET_FROM_EMAIL` | Email address to send from | `noreply@kirknetllc.com` |
| `MAILJET_FROM_NAME` | Name to display as sender | `Kirknet Message` |
| `MAILJET_TO_EMAIL` | Recipient email address | `phillipkirk7@gmail.com` |
| `MAILJET_TO_NAME` | Name of the recipient | `Phillip Kirk` |
| `API_PORT` | Port for the API server | `3001` |

## Docker Commands

### Starting the Application

```bash
# Start in detached mode
docker compose up -d

# Start with logs visible
docker compose up

# Rebuild and start
docker compose up -d --build
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
# View logs for all services
docker compose logs -f

# View logs for frontend only
docker compose logs -f frontend

# View logs for API only
docker compose logs -f api

# View last 100 lines of logs
docker compose logs --tail=100
```

### Checking Status

```bash
# Check running containers
docker compose ps

# Check container health
docker inspect kirknet-frontend --format='{{.State.Health.Status}}'
docker inspect kirknet-api --format='{{.State.Health.Status}}'
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
- Ports 80 and 3001 open (or configure alternative ports)
- SSL/TLS certificates (recommended)

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
        proxy_pass http://localhost:80;
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
    reverse_proxy localhost:80
}
```

### 6. Configure Firewall

```bash
# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# If not using a reverse proxy, allow API port
sudo ufw allow 3001/tcp
```

## Troubleshooting

### Container Won't Start

**Check logs:**
```bash
docker compose logs frontend
docker compose logs api
```

**Common issues:**
- Missing environment variables
- Port conflicts (80 or 3001 already in use)
- Invalid credentials

### Email Not Sending

1. Verify Mailjet credentials in `.env`
2. Check API logs: `docker compose logs api`
3. Ensure Mailjet account is active and verified

### Frontend Not Loading

1. Check if container is running: `docker compose ps`
2. Verify nginx configuration: `docker compose logs frontend`
3. Check if port 80 is accessible from your browser
4. If using a reverse proxy, verify proxy configuration

### API Connection Issues

1. Verify both containers are on the same network:
   ```bash
   docker network inspect kirknet_kirknet-network
   ```
2. Check if API is healthy:
   ```bash
   curl http://localhost:3001/health
   ```
3. Review nginx configuration for proxy settings

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

Both services include health checks:

```bash
# Check frontend health
curl http://localhost

# Check API health
curl http://localhost:3001/health
```

### Resource Monitoring

```bash
# Monitor resource usage
docker stats

# Monitor specific container
docker stats kirknet-frontend
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
2. **Use strong passwords** - For Mailjet credentials
3. **Keep Docker updated** - Regularly update Docker and images
4. **Use SSL/TLS** - Always use HTTPS in production
5. **Limit CORS origins** - Configure CORS to allow only your domain
6. **Regular updates** - Keep the application and dependencies updated
7. **Monitor logs** - Regularly check logs for suspicious activity

## Support

For issues or questions:
- Check the [main README](README.md) for general information
- Review logs: `docker compose logs -f`
- Check [Docker documentation](https://docs.docker.com/)
- Open an issue on GitHub

## License

This project is licensed under the terms specified in the repository.
