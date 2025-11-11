# ======================
# Build + Runtime in One
# ======================
FROM node:20-alpine

WORKDIR /app

# Copy only package.json (not package-lock.json) to avoid lockfile issues in Docker
COPY package.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy application files
COPY . .

# Build arguments for Vite environment variables (required at build time)
ARG VITE_HCAPTCHA_SITE_KEY
ENV VITE_HCAPTCHA_SITE_KEY=${VITE_HCAPTCHA_SITE_KEY}

# Build the frontend
RUN npm run build

# The app will listen on port 9620
EXPOSE 9620

# Runtime environment variables
ENV HOST=0.0.0.0
ENV PORT=9620
ENV NODE_ENV=production

# Start the server
CMD ["node", "server.js"]
