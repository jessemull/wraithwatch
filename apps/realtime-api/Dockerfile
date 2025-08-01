# Multi-stage build for optimized production image.

FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files from root and apps/realtime-api.

COPY package*.json ./
COPY apps/realtime-api/package*.json ./apps/realtime-api/

# Install all dependencies (including dev dependencies for build).

RUN yarn install --frozen-lockfile

# Copy source code.

COPY . .

# Build TypeScript and bundle with Webpack from the correct directory.

WORKDIR /app/apps/realtime-api
RUN yarn build:prod

# Production stage.

FROM node:22-alpine AS production

WORKDIR /app

# Install only the runtime dependencies we actually use.

RUN yarn install --production --frozen-lockfile

# Copy bundled application from builder stage.

COPY --from=builder /app/apps/realtime-api/bundle/server.js ./server.js

# Create non-root user for security.

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Change ownership of the app directory.

RUN chown -R nodejs:nodejs /app
USER nodejs

# Set environment variables.

ENV PORT=8080

# Expose port.

EXPOSE 8080

# Start the server.

CMD ["node", "server.js"] 