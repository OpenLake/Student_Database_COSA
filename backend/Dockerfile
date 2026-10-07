FROM node:18-alpine AS builder

WORKDIR /app

RUN apk update && apk upgrade --no-cache

COPY package.json package-lock.json ./

# Puppeteer's Chrome is installed in the runtime stage via apk.
ENV PUPPETEER_SKIP_DOWNLOAD=true

RUN npm ci

COPY . .

RUN npm prune --production


FROM node:18-alpine

WORKDIR /app

RUN apk update && apk upgrade --no-cache \
    && apk add --no-cache chromium \
    && rm -rf /var/cache/apk/*

COPY --from=builder /app ./

RUN addgroup -S appgroup && adduser -S appuser -G appgroup && chown -R appuser:appgroup /app

USER appuser

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV PUPPETEER_NO_SANDBOX=true

EXPOSE 8000

CMD ["node", "index.js"]

