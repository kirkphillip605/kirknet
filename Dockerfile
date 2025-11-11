# ===========================
# Stage 1: Build Frontend
# ===========================
FROM node:20-alpine AS frontend-builder

WORKDIR /app

# Install dependencies first for caching
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy app source
COPY . .

# Build the frontend app (outputs to /app/dist)
RUN npm run build


# ===========================
# Stage 2: Frontend Runtime (Nginx)
# ===========================
FROM nginx:stable-alpine AS frontend

# Copy built frontend files from builder
COPY --from=frontend-builder /app/dist /usr/share/nginx/html

# Copy your Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]


# ===========================
# Stage 3: API Server
# ===========================
FROM node:20-alpine AS api

WORKDIR /app

# Copy only package files for caching
COPY package*.json ./

# Install production dependencies
RUN npm install --omit=dev --legacy-peer-deps

# Copy only backend files (keeps the image small)
COPY server.js ./

EXPOSE 3001
CMD ["node", "server.js"]
