.PHONY: help up up-lite down test lint seed migrate logs clean

help:
	@echo "Setu Raksha - National Bridge Infrastructure Safety Grid"
	@echo "Available commands:"
	@echo "  make up        - Start all services with docker-compose"
	@echo "  make up-lite   - Start core services only (DB, Redis, MinIO, Mailpit, API, Web)"
	@echo "  make down      - Stop and remove containers"
	@echo "  make test      - Run all backend and frontend tests"
	@echo "  make lint      - Run linters (ruff, mypy, eslint)"
	@echo "  make seed      - Populate database with synthetic bridge data"
	@echo "  make migrate   - Run Alembic database migrations"
	@echo "  make logs      - Follow container logs"
	@echo "  make clean     - Clean temporary build and cache artifacts"

up:
	docker compose up -d

up-lite:
	docker compose up -d postgres redis minio mailpit api web

down:
	docker compose down

test:
	@echo "Running backend tests..."
	uv run pytest apps/api/tests
	@echo "Running frontend tests..."
	pnpm --filter web test

lint:
	@echo "Running Python linters (ruff & mypy)..."
	uv run ruff check .
	uv run mypy apps/api
	@echo "Running TypeScript & ESLint..."
	pnpm -r lint
	pnpm -r typecheck

migrate:
	docker compose exec api alembic upgrade head

seed:
	docker compose exec api python -m app.db.seed

logs:
	docker compose logs -f

clean:
	rm -rf .pytest_cache .mypy_cache .ruff_cache apps/web/.next
