# ============================================================
# Daka Technical Assessment — Backend Dockerfile
# NestJS + MikroORM + PostgreSQL
# ============================================================

# ─────────────────────────────────────────────────────────────
# Stage 1: base — imagen base compartida
# ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./

# ─────────────────────────────────────────────────────────────
# Stage 2: dependencies — instala TODAS las deps (dev + prod)
# ─────────────────────────────────────────────────────────────
FROM base AS dependencies
RUN npm ci

# ─────────────────────────────────────────────────────────────
# Stage 3: development — hot-reload para docker-compose.dev.yml
# ─────────────────────────────────────────────────────────────
FROM dependencies AS development
COPY . .
EXPOSE 3000
CMD ["npm", "run", "start:dev"]

# ─────────────────────────────────────────────────────────────
# Stage 4: builder — compila TypeScript a JavaScript
# ─────────────────────────────────────────────────────────────
FROM dependencies AS builder
COPY . .
RUN npm run build
# Instala solo dependencias de producción para optimizar el artefacto final
RUN npm prune --production

# ─────────────────────────────────────────────────────────────
# Stage 5: production — imagen final optimizada (OWASP Compliant)
# ─────────────────────────────────────────────────────────────
FROM gcr.io/distroless/nodejs20-debian12 AS production
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["dist/main.js"]