FROM node:18-alpine AS builder

WORKDIR /app

RUN apk update && apk upgrade --no-cache

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm prune --production


FROM node:18-alpine

WORKDIR /app

RUN apk update && apk upgrade --no-cache

COPY --from=builder /app ./

RUN addgroup -S appgroup && adduser -S appuser -G appgroup && chown -R appuser:appgroup /app

USER appuser

EXPOSE 3000

CMD ["node", "index.js"]

