FROM node:18-alpine AS builder

WORKDIR /app

# Upgrade Alpine packages before installing npm dependencies
RUN apk update && apk upgrade --no-cache

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

# Remove dev dependencies, keep only production deps
RUN npm prune --production


FROM node:18-alpine

WORKDIR /app

# Upgrade Alpine packages again in the final image
RUN apk update && apk upgrade --no-cache

COPY --from=builder /app ./

RUN addgroup -S appgroup && adduser -S appuser -G appgroup && chown -R appuser:appgroup /app

USER appuser

EXPOSE 3000

CMD ["node", "index.js"]


# FROM node:18-alpine AS builder

# WORKDIR /app

# COPY package.json package-lock.json ./

# RUN npm ci

# COPY . .


# RUN npm prune --production

# FROM node:18-alpine

# WORKDIR /app

# COPY --from=builder /app ./

# RUN addgroup -S appgroup && adduser -S appuser -G appgroup && chown -R appuser:appgroup /app

# USER appuser

# EXPOSE 3000

# CMD ["node", "index.js"]
