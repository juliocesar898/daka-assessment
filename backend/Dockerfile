# ============================================================
# Daka Technical Assessment — Backend Dockerfile
# NestJS + MikroORM + PostgreSQL
# ============================================================
#
# ⚠️  INSTRUCCIONES PARA EL CANDIDATO:
#   Este Dockerfile tiene un multi-stage build INCOMPLETO.
#   Tu tarea es completar el Stage 4 (production) y asegurarte
#   de que docker-compose.dev.yml use el stage correcto.
#
#   Comandos MikroORM disponibles en el contenedor:
#     docker-compose exec backend npx mikro-orm migration:create
#     docker-compose exec backend npx mikro-orm migration:up
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
# Usa este stage en tu docker-compose: target: development
# ─────────────────────────────────────────────────────────────
FROM dependencies AS development
COPY . .
EXPOSE 3000
# nest start --watch activa hot-reload
CMD ["npm", "run", "start:dev"]

# ─────────────────────────────────────────────────────────────
# Stage 4: builder — compila TypeScript a JavaScript
# ─────────────────────────────────────────────────────────────
FROM dependencies AS builder
COPY . .
RUN npm run build

# ─────────────────────────────────────────────────────────────
# Stage 5: production — imagen final optimizada
#
# ⚠️  TODO (Candidato): Completa este stage.
#
#   Requisitos:
#   - Usa una imagen base minimalista o distroless
#   - Copia SOLO los artefactos necesarios desde 'builder'
#   - Instala SOLO dependencias de producción (no devDependencies)
#   - No expone sourcemaps ni archivos de desarrollo
#
#   Hint — imagen distroless de Node.js:
#     gcr.io/distroless/nodejs20-debian12
# ─────────────────────────────────────────────────────────────
# FROM ??? AS production
# WORKDIR /app
# COPY --from=builder /app/dist ./dist
# COPY --from=builder /app/node_modules ./node_modules  # ¿O reinstalar --omit=dev?
# EXPOSE 3000
# CMD [???]

