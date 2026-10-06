# Hardened Multi-Stage Dockerfile Patterns

## Node.js Multi-Stage Example

```dockerfile
# Stage 1: Build Dependencies
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production Runtime
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

COPY --from=builder --chown=appuser:appgroup /app/dist ./dist

USER appuser
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

## `.dockerignore` Essentials
```
.git
.env*
node_modules
dist
coverage
Dockerfile*
docker-compose*
README.md
```
