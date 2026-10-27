# Setu Rakshak (सेतु रक्षक / सेतू रक्षा)
### National Bridge Infrastructure Safety & Intelligence Grid

[![CI](https://github.com/devchahar01/Setu-Raksha/actions/workflows/ci.yml/badge.svg)](https://github.com/devchahar01/Setu-Raksha/actions/workflows/ci.yml)
[![Version](https://img.shields.io/badge/version-0.2.0-blue.svg)](CHANGELOG.md)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Status](https://img.shields.io/badge/status-Production%20Ready-emerald.svg)](CHANGELOG.md)

> **Department of Computer Engineering | Army Institute of Technology Pune**  
> *Dev Chahar (Comp-A) | Based on Problem Identification and Modification Report*

---

## 1. Mission & Overview
Setu Rakshak is a predictive decision-support system designed to empower civil engineers and public works departments to identify structural vulnerabilities in bridges **before disasters strike**.

Bridges and flyovers collapse during floods, cloudbursts, and seismic events when extreme environmental loads meet unaddressed structural weaknesses (scour, pier tilt, material fatigue, or deferred maintenance). Setu Rakshak bridges this gap by unifying:
1. **Physical Engineering Inspections**: Standardized monthly 26-factor field audits ([Appendix A](docs/spec/factors.md)).
2. **Live Telemetry Streams**: Real-time river water level, pier tilt, accelerometer vibration, and rainfall sensors.
3. **Computer Vision & AR Defect Localization**: Photogrammetric 3D point cloud pinpointing of concrete cracks, spalls, and bearing faults using SIFT keypoint matching, multi-view triangulation, and interactive Augmented Reality overlay (derived from CS543 research).
4. **Hybrid AI Predictive Risk Engine**: Deterministic Structural Vulnerability Index (SVI), live Dynamic Risk Index (DRI), 12-month ML deterioration advisories, and prescriptive engineering remediation.

> [!IMPORTANT]
> **Advisory Disclaimer & Honest Labelling**: Setu Rakshak supports engineering judgement and **never** replaces detailed structural analysis, physical testing, or certified engineer decisions. All sensor feeds and starter bridge datasets are explicitly labelled **SIMULATED**. The 90% disaster prevention figure is a **simulation evaluation target** to be validated in Phase 8, not an achieved real-world statistic.

---

## 2. Seven-Stage Lifecycle Coverage (L1–L7) & Computer Vision AR Twin
- **L1 Pre-construction & Design**: IRC loading class, seismic zone (IS 1893), design life, foundation depth, and design HFL.
- **L2 Construction & Quality Audits**: Concrete/steel material logs, cube test results, initial load-tests, and defect liability tracking.
- **L3 Live Monitoring & Telemetry**: Ultrasonic water levels, pier inclinometers, accelerometers, and rainfall feeds with anomaly detection.
- **AR 3D Defect Twin & Localization**: Photogrammetric 3D bridge point cloud with SIFT feature matching, camera projection matrices, triangulation, and live AR HUD overlay.
- **L4 Routine Audit Scheduling**: Celery Beat automation issuing reminders 7 days prior to month-end with escalation triggers.
- **L5 Officer Field Portal**: Mobile-responsive 26-factor inspection submission with photographic evidence and offline resilience.
- **L6 AI Predictive Risk Engine**: SVI, DRI, Markov-chain Remaining Useful Life (RUL), and ranked civil engineering remediation catalogue.
- **L7 Public Transparency Portal**: Citizen access to bridge age, design life consumed, and live health tiers with safe cryptographic redaction.

---

## 3. Technology Stack
| Component | Technology | Rationale |
|---|---|---|
| **Web App** | Next.js 15 (App Router), TypeScript, Tailwind CSS | High performance, accessible tokens, `next-intl` localization |
| **API** | Python 3.12+, FastAPI, Pydantic v2 | High-throughput async endpoints, OpenAPI 3.1, SSE streaming |
| **Database** | PostgreSQL 16 + PostGIS | Geospatial coordinate indexing and monthly partitioned telemetry |
| **Task Queue** | Celery + Redis | Idempotent background jobs and month-end reminder scheduling |
| **Storage** | MinIO (S3 Compatible) | Presigned URL uploads for field inspection photo logs |
| **Tooling** | `pnpm` & `uv` | Ultra-fast dependency resolution and monorepo management |

---

## 4. Quickstart Guide

### Prerequisites
- Node.js 20+ and `pnpm` (`npm install -g pnpm`)
- Python 3.12+ and `uv` (`pip install uv`)
- Docker & Docker Compose (optional, for full multi-service stack)

### Local Development Setup

#### 1. Clone & Configure Environment
```bash
git clone https://github.com/devchahar01/Setu-Raksha.git
cd Setu-Raksha
cp .env.example .env
```

#### 2. Backend (FastAPI) Setup
```bash
# Create virtual environment and install dependencies
uv venv
uv pip install -e "apps/api[dev]" greenlet

# Run backend unit tests
.venv\Scripts\pytest apps/api/tests

# Start FastAPI development server
uvicorn app.main:app --app-dir apps/api --reload --port 8000
```
- API Documentation: [http://localhost:8000/api/v1/docs](http://localhost:8000/api/v1/docs)
- Health Check: [http://localhost:8000/health](http://localhost:8000/health)

#### 3. Frontend (Next.js) Setup
```bash
# Install workspace packages
pnpm install

# Build shared package
pnpm --filter @setu-raksha/shared build

# Start Next.js development server
pnpm --filter @setu-raksha/web dev
```
- Web Application: [http://localhost:3000](http://localhost:3000)

#### 4. Running Full Stack with Docker Compose
```bash
make up         # Starts PostgreSQL+PostGIS, Redis, MinIO, Mailpit, API, Worker, Beat, Simulator, Web
make logs       # Follow logs across all containers
make test       # Run complete test suites
make down       # Stop all containers
```

---

## 5. Specifications & ADRs
- [Appendix A: 26-Factor Inspection Model](docs/spec/factors.md)
- [Appendix B: Database Entities](docs/spec/schema.md)
- [Appendix C: API Surface](docs/spec/api.md)
- [Appendix D: Risk Maths & Remediation Catalogue](docs/spec/risk_maths.md)
- [Appendix E: Definition of Done](docs/spec/definition_of_done.md)
- [Appendix F: Suggested Timeline & Risks](docs/spec/timeline_and_risks.md)
- [ADR-0001: Technology Stack](docs/adr/0001-technology-stack.md)
- [ADR-0002: Trilingual Localization Strategy](docs/adr/0002-i18n-strategy.md)
- [ADR-0003: Predictive Risk Engine Architecture](docs/adr/0003-risk-engine-rules-first-ml-advisor.md)
- [C4 Context Architecture Diagram](docs/architecture/c4-context.md)

---

## 6. Verification & Quality Gates
Setu Raksha enforces strict quality gates:
- **Python**: `ruff check .` and `mypy apps/api` (100% strict type safety)
- **TypeScript**: `tsc --noEmit` and `next build` (zero type errors)
- **Tests**: `pytest apps/api/tests` (100% pass on health, ready, and structured error handling)
- **Accessibility**: WCAG 2.1 AA compliant colors and multi-attribute tier indicators (icon + text + score).
