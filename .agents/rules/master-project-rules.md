# Setu Raksha: Master Project Rules (Part A)

## A.1 Role and Mission
You lead a multi-agent engineering squad: solution architect, backend engineer, frontend engineer, data/ML engineer, QA engineer, DevOps engineer and technical writer. Your mission is to build Setu Raksha, the National Bridge Infrastructure Safety & Intelligence Grid, from an empty repository into a demo-ready, professionally engineered platform whose code quality, documentation and security posture would let a state public-works department pilot it after review.

Never ship toy code, hidden shortcuts, hard-coded demo values presented as real logic, or unexplained dependencies. If a requirement is ambiguous, state your assumption in the plan artifact and continue; ask me only when the choice is irreversible or changes the architecture.

## A.2 Problem Context (from our approved report)
- Bridges and flyovers collapse in natural disasters (floods and scour, earthquakes, landslides and cloudbursts, cyclones) when an extreme load meets a hidden weakness: poor design, weak construction, ageing, no maintenance. The disaster is the trigger; the hidden weakness is the cause.
- The problem has a physical side (the structure is weak) and an information side (authorities do not know which bridge is at risk or when to close it).
- Research gap: there is no low-cost, simple, integrated system that combines inspection records, rainfall/flood data and sensor readings into one easy risk level per bridge and sends timely, bridge-specific alerts to local authorities.
- Product position: decision support. Setu Raksha helps engineers decide which bridge to inspect, restrict or close first. It never replaces detailed structural analysis or an engineer's judgement, and every screen that shows a risk level must say so.
- Design target: reduce preventable disaster-related bridge failures by up to 90% through earlier detection and action. This is a target to be tested by simulation in Phase 8. Never state it as an achieved or real-world result anywhere in code, UI or docs.

## A.3 Users and Roles
| Role | Who | Core Capabilities |
|---|---|---|
| **Citizen (public)** | Anyone, no login | Browse map, view bridge age, build-quality summary, and live health tier; report a concern |
| **Project Officer** | Field engineer assigned to bridges | Monthly 26-factor audit, evidence upload, drafts, receives reminders and alerts |
| **Division Engineer** | Reviewer for a jurisdiction | Approve or return audits, acknowledge alerts, log actions (close, divert, inspect), receives escalations |
| **State Analyst / Admin** | Department headquarters | Analytics, heatmaps, compliance, thresholds, user and bridge management |
| **System Admin** | Platform operator | Configuration, audit logs, health, notification providers |

## A.4 Lifecycle Coverage (build all seven)
- **L1 Pre-construction and design**: IRC loading class, seismic zone (IS 1893), design life, foundation type and depth, design high flood level (HFL), design scour depth, span configuration.
- **L2 Construction and quality audits**: material grade logs, cube/test results, initial load-test records, contractor history, quality grade, defect liability period.
- **L3 Inauguration and live monitoring**: streams for river water level, pier tilt, vibration, and rainfall. Simulated first; the ingestion contract must be device-ready.
- **L4 Routine monthly audits**: a scheduler sends reminders to the assigned officer exactly 7 days before month-end, with escalation if the audit is missed.
- **L5 Officer portal and 26-factor ingestion**: structured form across structural, hydraulic, seismic, load, and age/environment variables (Appendix A).
- **L6 AI predictive risk engine**: Structural Vulnerability Index (SVI), dynamic risk with live hazards, Remaining Useful Life (RUL), explanations and prescriptive remediation (riprap, bearing replacement, etc.).
- **L7 Public transparency portal**: citizen view of build quality, age, and live health tier with safe redaction.

## A.5 Non-Negotiable Engineering Rules
- **Trilingual from day one**: English, Hindi (हिन्दी), Marathi (मराठी). No hard-coded user-facing string anywhere. Switching language must never lose form state or data.
- **Language-neutral data**: Store codes, numbers, ISO-8601 UTC timestamps, and units in SI. Translate only at render time.
- **Typed everywhere**: TypeScript strict, Python type hints with mypy, Pydantic v2 models, OpenAPI as the single contract. Generate the frontend client from OpenAPI.
- **Tests are part of every task**: A task is not done until unit and integration tests pass. Targets: backend coverage 80% or higher, risk engine 95% or higher, Playwright end-to-end for every role.
- **Security by default**: argon2id password hashing, short-lived JWT in httpOnly cookies, RBAC plus jurisdiction scoping on every query, input validation, rate limits on public routes, append-only audit log, no secrets in git, upload type and size checks.
- **Safety-critical text is never freely generated**: Remediation advice comes from a versioned, reviewable catalogue (Appendix D). Cite standards by name only (IRC:6, IRC:SP:35, IS 1893, FHWA HEC-18). Never invent clause numbers or numeric code limits; put thresholds in config marked example, to be validated by a civil engineer.
- **Honest labelling**: Every simulated record and stream carries `source=simulated` and is visibly labelled. Every risk output shows model version, timestamp, and an advisory disclaimer.
- **Accessibility and reach**: WCAG 2.1 AA, never colour alone for risk tier (icon plus text), mobile-first, usable on slow networks.
- **Engineering hygiene**: Conventional Commits, small PRs, ADRs for decisions, 12-factor config, structured JSON logs with request IDs, migrations reversible, idempotent jobs.

## A.6 Fixed Technology Stack
| Layer | Choice | Notes |
|---|---|---|
| **Web app** | Next.js 15 (App Router), TypeScript strict, Tailwind CSS, Radix/shadcn primitives | `next-intl` for i18n, `react-hook-form` + `Zod`, TanStack Query, Zustand, Recharts or uPlot, `react-leaflet` + OpenStreetMap tiles with attribution |
| **API** | Python 3.12+, FastAPI, SQLAlchemy 2.0, Alembic, Pydantic v2, uv for dependencies | Async endpoints, OpenAPI 3.1, SSE for live streams |
| **Database** | PostgreSQL 16 + PostGIS | Relational core; time-series table partitioned monthly; JSONB only for flexible payload snapshots |
| **Jobs and scheduling** | Celery + Redis with Celery Beat | Idempotent tasks, retries with backoff, Asia/Kolkata timezone |
| **Notifications** | Adapters: Email (SMTP, Mailpit locally), SMS (provider interface, mock locally), In-app (SSE) | Production SMS in India needs provider DLT template registration; document it |
| **Files** | MinIO (S3-compatible) with presigned URLs | Inspection photos and documents |
| **ML** | scikit-learn, XGBoost (GPU on RTX laptop if available, fallback CPU), SHAP, Hypothesis for property tests | Model card, version registry in `ml/registry/`; rule engine is the safety floor |
| **Platform** | Docker Compose, GitHub Actions, pre-commit, ruff, mypy, eslint, Playwright, k6, OWASP ZAP baseline | One command starts everything: `make up` |

## A.7 Repository Layout
```text
setu-raksha/
  apps/web/             Next.js app (public, officer, engineer, admin)
  apps/api/             FastAPI app: app/{core,db,auth,bridges,audits,telemetry,risk,notify,public,admin}, alembic/, tests/
  services/simulator/   telemetry + scenario simulator
  services/worker/      Celery worker + beat entrypoints
  packages/shared/      JSON schemas, generated API client, i18n glossary
  ml/                   data generator, training, calibration, registry, model card
  infra/                docker-compose, Dockerfiles, CI, k6, ZAP config
  docs/                 spec/, adr/, architecture/, runbooks/, user-guides/{en,hi,mr}
  Makefile README.md .env.example CHANGELOG.md
```

## A.8 Working Agreement with the Agent
- For every mission: produce an Implementation Plan first, list assumptions, then a Task List, then build, then a Walkthrough with commands to verify and screenshots or recordings of UI flows.
- Work in small commits on a branch per phase. Run lint, type-check and tests before declaring done. Show failing output honestly; never mark a task complete with failing tests or skipped checks.
- Read `docs/spec/` before writing code. If code and spec disagree, stop and tell me, do not silently change the spec.
- Do not add dependencies without a one-line justification in the plan. Prefer boring, well-maintained libraries. Pin versions.
- At the end of each phase update README, CHANGELOG, ADRs and the data dictionary.
