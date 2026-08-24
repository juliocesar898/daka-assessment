#!/usr/bin/env bash
# ==============================================================================
# validate.sh — Validación pre-entrega | NestJS + Next.js
# Ejecutar: bash validate.sh
# ==============================================================================
set -euo pipefail
GREEN='\033[0;32m'; RED='\033[0;31m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; RESET='\033[0m'
ok()   { echo -e "  ${GREEN}✔${RESET}  $1"; }
fail() { echo -e "\n  ${RED}✖ ERROR:${RESET}  $1\n"; exit 1; }
warn() { echo -e "  ${YELLOW}⚠${RESET}  $1"; }
step() { echo -e "\n${CYAN}▶ [$1]${RESET} $2"; }

echo -e "\n${CYAN}╔════════════════════════════════════════════════════╗"
echo -e "║   Daka Assessment — Validación Pre-Entrega         ║"
echo -e "╚════════════════════════════════════════════════════╝${RESET}\n"

# ── 1. Prerequisitos ──────────────────────────────────────────────────────────
step "1/5" "Verificando prerequisitos..."
command -v docker >/dev/null 2>&1 || fail "Docker no encontrado. Instala Docker Engine >= 24"
command -v docker compose >/dev/null 2>&1 || command -v docker-compose >/dev/null 2>&1 || fail "docker compose no encontrado"
ok "Docker disponible: $(docker --version | head -1)"

# ── 2. Variables de entorno ───────────────────────────────────────────────────
step "2/5" "Verificando configuración..."
[[ -f .env ]] || fail ".env no encontrado. Copia .env.example → .env y completa los valores"
grep -qE "^JWT_SECRET=.{8,}" .env 2>/dev/null || warn "JWT_SECRET parece vacío o muy corto en .env"
grep -qE "^(DB_PASSWORD|POSTGRES_PASSWORD)=.+" .env 2>/dev/null || warn "DB_PASSWORD parece vacío en .env"
ok ".env presente"

# ── 3. Build Docker ───────────────────────────────────────────────────────────
step "3/5" "Verificando build Docker..."
docker compose -f docker-compose.dev.yml build --quiet || fail "El build Docker falló. Revisa los Dockerfiles"
ok "Build exitoso"

# ── 4. Seed Tests ─────────────────────────────────────────────────────────────
step "4/5" "Ejecutando seed tests (backend)..."
docker compose -f docker-compose.dev.yml run --rm backend npm run test -- --testPathPattern="seed" --forceExit 2>&1 || \
docker compose -f docker-compose.dev.yml run --rm backend npm run test -- --forceExit 2>&1 || \
fail "Los seed tests fallaron. Implementa la lógica hasta que pasen."
ok "Seed tests pasaron ✅"

# ── 5. TypeScript lint/build ──────────────────────────────────────────────────
step "5/5" "Verificando calidad de código (TypeScript)..."
docker compose -f docker-compose.dev.yml run --rm backend npm run lint 2>&1 | tail -5 || warn "Lint reportó warnings — revisa antes de entregar"
docker compose -f docker-compose.dev.yml run --rm backend npm run build 2>&1 | tail -5 || fail "npm run build falló — el proyecto no compila"
ok "TypeScript compila sin errores"

echo -e "\n${GREEN}╔════════════════════════════════════════════════════╗"
echo -e "║   ✅  VALIDACIÓN EXITOSA — Listo para entregar     ║"
echo -e "╚════════════════════════════════════════════════════╝${RESET}\n"
