# Build stage
FROM oven/bun:1.3.5-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json bun.lockb* ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN bun run build

# Production stage
FROM oven/bun:1.3.5-alpine AS production

WORKDIR /app

# Install serve to run the production build
RUN bun add -g serve

# Copy built assets from builder stage
COPY --from=builder /app/dist ./dist

# Expose the port
EXPOSE 6140

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD bun exec wget --no-verbose --tries=1 --spider http://localhost:6140 || exit 1

# Start the application
CMD ["serve", "-s", "dist", "-l", "6140"]