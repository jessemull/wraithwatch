# Multi-stage build for optimized production image
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Build TypeScript and bundle with Webpack
RUN yarn workspace @wraithwatch/realtime-api build:prod

# Production stage
FROM node:22-alpine AS production

WORKDIR /app

# Install only the runtime dependencies we actually use
RUN yarn add ws cors

# Copy bundled application from builder stage
COPY --from=builder /app/apps/realtime-api/bundle/ ./

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Change ownership of the app directory
RUN chown -R nodejs:nodejs /app
USER nodejs

# Set environment variables
ENV PORT=8080

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the server
CMD ["node", "server.js"] 