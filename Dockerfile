FROM node:20-alpine AS app

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy full source and build the frontend
COPY . .
RUN npm run build

# Expose your app port
EXPOSE 9620

CMD ["node", "server.js"]
