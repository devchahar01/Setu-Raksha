# Changelog

All notable changes to the Setu Raksha project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - Phase 0 Foundation
### Added
- Monorepo structure with pnpm workspaces and uv workspace configuration.
- Part A Master Project Rules and Appendices A through F in `docs/spec/`.
- Architecture Decision Records: ADR-0001 (Stack), ADR-0002 (i18n), ADR-0003 (Risk Engine).
- C4 Architecture Context diagram in Mermaid.
- FastAPI backend skeleton with structured JSON logging, UUID request IDs, error handler returning `{code, params, request_id}`, `/health` and `/ready` endpoints.
- Next.js 15 App Router web skeleton with strict TypeScript, accessible institutional layout, design tokens, and language switcher placeholder.
- Multi-container `docker-compose.yml` with postgres+postgis, redis, minio, mailpit, api, worker, beat, simulator, and web.
- GitHub Actions CI workflow for linting, type-checking, testing, and container build checks.
