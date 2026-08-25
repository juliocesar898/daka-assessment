# Multi-Stage Build para Frontend (Next.js)

# STAGE 1 - Base & Dependencies
FROM node:20-slim AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci

# STAGE 2 - Development (Usado por docker-compose.dev.yml)
FROM base AS development
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

# STAGE 3 - Builder
FROM base AS builder
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# STAGE 4 - Production Server (Runner)
FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Crear usuario no-root para OWASP Compliance
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

USER nextjs

EXPOSE 3000
ENV PORT 3000

CMD ["npm", "run", "start"]