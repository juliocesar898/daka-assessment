# ==============================================================================
# Daka Technical Assessment — Comandos de Validación Local
# Ejecutar: make help
# ==============================================================================

.PHONY: help setup validate test build clean

help: ## Muestra esta ayuda
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

setup: ## Levanta el ambiente Docker completo
	docker compose -f docker-compose.dev.yml up -d --build

validate: ## Validación completa pre-entrega (lint + tests + build)
	@bash validate.sh

test: ## Ejecuta solo los seed tests
	@bash validate.sh --tests-only

build: ## Verifica compilación TypeScript
	@bash validate.sh --build-only

clean: ## Detiene y elimina contenedores y volúmenes
	docker compose -f docker-compose.dev.yml down -v

