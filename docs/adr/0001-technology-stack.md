# ADR-0001: Technology Stack Selection

## Status
Accepted

## Context
Setu Raksha is designed as a national-grade predictive decision-support platform for bridge infrastructure resilience across state public-works departments and disaster management authorities. The platform must combine 26-factor physical inspection records, high-throughput time-series sensor feeds, machine learning risk assessment, and trilingual public and official access.

Key architectural drivers:
1. High development velocity with strict typing across frontend and backend.
2. Low latency, asynchronous API capabilities for telemetry streaming (SSE).
3. PostGIS spatial querying for bridges across river basins and administrative jurisdictions.
4. Reproducible local development using standard open-source tools without vendor lock-in.

## Decision
We select the following technology stack:
- **Frontend**: Next.js 15 (App Router), TypeScript strict mode, Tailwind CSS with customized institutional design tokens, Lucide icons, `next-intl` for trilingual localization, and Leaflet/OpenStreetMap for mapping.
- **Backend**: Python 3.12+, FastAPI, SQLAlchemy 2.0 (async), Alembic migrations, Pydantic v2 models, structured JSON logging with UUID request tracing.
- **Database**: PostgreSQL 16 with PostGIS extension for spatial queries and monthly partitioned tables for telemetry.
- **Cache & Asynchronous Tasks**: Redis 7 and Celery + Celery Beat for scheduled month-end inspection audits.
- **Object Storage**: MinIO (S3-compatible) with presigned URLs for client-side direct uploads of field inspection evidence and photo logs.
- **Developer Tooling & Package Management**: `pnpm` workspaces for frontend and shared contracts; `uv` for ultra-fast Python package resolution and virtual environment management; Docker Compose for multi-container orchestration.

## Consequences
- **Positive**:
  - Full end-to-end type safety from Pydantic models to TypeScript interfaces.
  - Containerized environment allows single-command spin-up via `make up`.
  - Scalable asynchronous foundation capable of handling 500+ telemetry readings per second.
- **Negative / Trade-offs**:
  - Requires maintaining both Node.js and Python toolchains in a monorepo setup.
  - Requires explicit PostGIS extensions in target deployment databases.
