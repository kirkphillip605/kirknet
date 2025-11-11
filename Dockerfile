# ======================
# 1. Build Stage
# ======================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy only package manifests to install deps
COPY package.json package-lock.json* ./

# Install dependencies (no dev deps if not needed)
RUN npm ci --legacy-peer-deps

# Copy only source files (exclude hidden files, markdown, and docker files)
COPY . ./

# Set build-time environment variable
ARG VITE_HCAPTCHA_SITE_KEY
ENV VITE_HCAPTCHA_SITE_KEY=${VITE_HCAPTCHA_SITE_KEY}

# Build the Vite frontend
RUN npm run build

# ======================
# 2. Runtime Stage
# ======================
FROM node:20-alpine

WORKDIR /app

# Copy only the built app (and minimal server files)
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/server.js ./server.js

# Install only production dependencies (if any)
RUN npm install --omit=dev --legacy-peer-deps && npm cache clean --force

# Runtime environment
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=9620

EXPOSE 9620

# Start the server
CMD ["node", "server.js"]
