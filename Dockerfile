# Use Node 20 for both build & runtime
FROM node:20-alpine AS app

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy all source files
COPY . .

# Build the frontend (creates /app/dist)
RUN npm run build

# Expose your app's port
EXPOSE 9620

# Start your Node server (assumes server.js serves both API + static files)
CMD ["node", "server.js"]
