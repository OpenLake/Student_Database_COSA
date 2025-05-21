
# ---------------------
# Build stage with Bun (includes dev dependencies)
# ---------------------
    FROM oven/bun:1.2.9-alpine AS builder

    WORKDIR /app
    
    # Install system dependencies needed for build
    RUN apk add --no-cache git python3 make g++
    
    # Install all dependencies (including devDependencies)
    COPY package.json bun.lock ./
    RUN bun install --frozen-lockfile
    
    # Copy source files
    COPY . .
    
    # Build the application
    ENV NEXT_TELEMETRY_DISABLED=1
    RUN bun run build
    
    # ---------------------
    # Production stage with Node.js
    # ---------------------
    FROM node:current-alpine 
    
    WORKDIR /app
    
    # Create non-root user
    RUN addgroup -g 1001 -S nodejs && \
        adduser -S -u 1001 -G nodejs nodejs
    
    # Copy built assets from builder
    COPY --from=builder --chown=nodejs:nodejs /app/.next/standalone ./
    COPY --from=builder --chown=nodejs:nodejs /app/.next/static ./.next/static
    COPY --from=builder --chown=nodejs:nodejs /app/public ./public
    COPY --from=builder --chown=nodejs:nodejs /app/next.config.js ./
    
    # Environment variables
    ENV NODE_ENV=production
    ENV PORT=3000
    ENV HOSTNAME=0.0.0.0
    
    # Expose and run
    EXPOSE 3000
    USER nodejs
    CMD ["node", "server.js"]
# # ---------------------
# # Base dependencies
# # ---------------------
#     FROM oven/bun:1.2.9-alpine AS deps

#     WORKDIR /app
    
#     # Copy only lockfile and package.json to install deps
#     COPY bun.lock package.json ./
    
#     # Install only production dependencies
#     RUN bun i --frozen-lockfile
    
#     # ---------------------
#     # Build stage
#     # ---------------------
#     FROM oven/bun:1.2.9-alpine AS builder
    
#     WORKDIR /app
    
#     COPY --from=deps /app/node_modules ./node_modules
#     COPY . .
    
#     ENV NEXT_TELEMETRY_DISABLED=1
    
#     RUN bun run build
    
#     # ---------------------
#     # Final image with Node.js
#     # ---------------------
#     FROM node:current-alpine AS runner
    
#     WORKDIR /app
    
#     ENV NODE_ENV=production
    
#     # Copy output from the build stage
#     COPY --from=builder /app/.next/standalone ./
#     COPY --from=builder /app/.next/static ./.next/static
#     COPY --from=builder /app/public ./public
#     COPY --from=builder /app/next.config.js ./ 
#     COPY --from=builder /app/package.json ./
    
#     EXPOSE 3000
    
#     CMD ["node", "server.js"]
    