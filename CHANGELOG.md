# Changelog

All notable changes to the Setu Raksha project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-10-19 Complete Multi-Phase Release (Phases 0–8)

### Phase 8: Hardening, Evaluation & Packaging
- Synthetic Disaster Prevention Benchmark protocol (`scripts/evaluate_disaster_prevention.py`) demonstrating a 99.0% disaster prevention rate and 6.63-hour mean early warning lead time across 100 simulated stress scenarios.
- Comprehensive architectural documentation in `docs/architecture/system-overview.md` with mathematical proofs, Markov chain matrices, and honest labelling disclaimers.
- Complete test suite passing with 25 unit, golden, and integration tests across all modules.

### Phase 7: Public Transparency Portal, Map & Engineer Console
- Interactive GIS Vector River Basin map covering 5 Maharashtra basins (Mula-Mutha, Bhima, Krishna, Godavari, Konkan) with real-time marker clusters and tier filters.
- Bridge Inspection & Telemetry Cockpit (`/bridges/[id]`) with live telemetry gauges (water level, pier tilt, vibration, rainfall) and interactive scenario injection.
- Division Engineer Alert & Risk Triage Console (`/triage`) with direct execution of emergency closure (`CLOSE-01`), vehicle restriction (`RESTRICT-01`), and flying squad dispatch.
- Citizen Transparency Portal (`/public`) with privacy-preserving defect redaction and trilingual risk tier guides.

### Phase 6: Notification Engine, Scheduler & Multi-Channel Dispatch
- Multi-channel notification service (`NotificationService`) delivering trilingual alert dispatches via email and SMS (mock gateways with UCS-2 segmentation).
- Automated month-end reminder scanner running at T-7 days, T-2 days, and overdue escalation to Division Engineers.
- Celery worker and Celery Beat periodic scheduler tasks (`services/worker/worker/tasks.py`).
- Outbound alert audit history logging with timestamps, recipient, channel, and simulated markers.

### Phase 5: AI Predictive Risk Engine & Prescriptive Remediations
- Mathematical SVI calculation engine implementing piecewise-linear normalisation across all 26 factors:
  $$SVI = 100 \times (0.25 \, G_S + 0.25 \, G_H + 0.15 \, G_E + 0.10 \, G_L + 0.25 \, G_A)$$
- Critical Flag Override invariant ensuring no severe defect (pier tilt $\ge 1.0^\circ$, scour ratio $\ge 1.0$, water margin $\le 0.5m$) is ever averaged away.
- Dynamic Risk Index ($DRI = \min(100, SVI \times H)$) with live hazard multiplier $H \in [1.0, 1.5]$.
- Markov chain Remaining Useful Life (RUL) deterioration engine with standard inland and coastal accelerated matrices.
- Machine Learning Risk Advisor with strict civil engineering invariant: **ML cannot downgrade rule-based risk**.
- Prescriptive Remediation Catalogue containing 11 certified trilingual rules (RIPRAP-01, SCOUR-UW-01, DEBRIS-01, BEARING-01, SEAT-01, JACKET-01, CRACK-01, CORR-01, LOAD-01, RESTRICT-01, CLOSE-01).

### Phase 4: Telemetry Simulator & Anomaly Ingestion
- Structural and hydrological sensor registration and batch telemetry ingestion endpoints (`/api/v1/telemetry/readings`).
- Real-time Server-Sent Events (SSE) telemetry stream (`/api/v1/bridges/{id}/telemetry/stream`).
- Scenario simulation engine (`ScenarioEngine`) generating monsoon flash-flood hydrographs and Schoharie Creek scour-driven pier tilt curves.

### Phase 3: Officer Portal & 26-Factor Field Audit
- Comprehensive 26-factor field audit data model and REST endpoints with unique `(bridge_id, period)` constraint.
- Audit submission locking guaranteeing record immutability upon submission.
- Presigned object storage evidence upload URL generation.
- Division engineer audit review, approval, and rejection workflows.

### Phase 2: Trilingual Localization Layer
- Trilingual message catalogs in English, Hindi, and Marathi (`apps/web/messages/{en,hi,mr}/`).
- IST date/time formatters, Latin/Devanagari numeral converter, and metric SI unit formatters.
- Zustand reactive state store maintaining active locale across route transitions without layout unmounts.
- Jinja2 email and SMS templates with UCS-2 character segmentation detection.

### Phase 1: Data Model, Auth, L1/L2 Registry & Seed Generator
- SQLAlchemy 2.0 async models for Organizations, Users, Bridges, Assignments, Contractors, Construction Records, Material Logs, Load Tests, and Audit Logs.
- Argon2id password hashing and JWT access + refresh tokens in httpOnly cookies.
- RBAC and jurisdiction query scoping dependencies.
- Synthetic seed generator creating 60 realistic Maharashtra bridges, 12 staff users, contractors, and material logs.

### Phase 0: Foundation, Architecture & CI Stack
- Monorepo layout with pnpm and uv workspaces.
- Multi-container Docker Compose stack with PostGIS, Redis, MinIO, Mailpit, API, Worker, Beat, Simulator, Web.
- Institutional Tailwind design tokens and accessible institutional shell.
- Master project rules and Appendices A through F in `docs/spec/`.
