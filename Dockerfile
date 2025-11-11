# ======================
# Build + Runtime in One
# ======================
FROM node:20-alpine AS kirknet

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy the rest of the app
COPY . .

# Build arguments for Vite environment variables
ARG VITE_HCAPTCHA_SITE_KEY
ENV VITE_HCAPTCHA_SITE_KEY=${VITE_HCAPTCHA_SITE_KEY}

# Build the frontend with environment variables
RUN npm run build

# The app will listen on port 9620
EXPOSE 9620

# Ensure Node listens on all interfaces (not just localhost)
ENV HOST=0.0.0.0
ENV PORT=9620

# Start the server
CMD ["node", "server.js"]
