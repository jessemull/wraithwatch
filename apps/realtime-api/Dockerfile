FROM node:20-alpine

WORKDIR /app

# Copy package files from root
COPY package*.json yarn.lock ./

# Copy the specific app's package.json
COPY apps/realtime-api/package.json ./apps/realtime-api/

# Install dependencies
RUN yarn install

# Copy source code
COPY . .

# Build TypeScript specifically for realtime-api
RUN yarn workspace @wraithwatch/realtime-api build

# Remove dev dependencies to reduce image size
RUN yarn install --production

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the server
CMD ["yarn", "workspace", "@wraithwatch/realtime-api", "start"] 