# Appendix C: API Surface (REST, /api/v1)

Conventions:
- Cursor pagination
- ISO-8601 UTC timestamps
- SI units
- Standard error response: `{ "code": string, "params": dict, "request_id": string }` (never leak raw messages or tracebacks)
- Idempotency keys on audit submit and telemetry ingestion
- Rate limits on public and ingestion routes

| Method and Path | Purpose | Access |
|---|---|---|
| `POST /auth/login`, `/refresh`, `/logout` | Session management (argon2id, httpOnly cookies) | Any |
| `GET /public/bridges`, `/public/bridges/{id}` | Map list and safe bridge profile (redacted) | Public |
| `GET /public/bridges/{id}/trend` | 12-month tier trend | Public |
| `POST /public/reports` | Citizen concern (rate-limited, captcha stub) | Public |
| `GET, POST /bridges`; `GET, PATCH /bridges/{id}` | Bridge registry and L1 metadata | Scoped roles |
| `GET, POST /bridges/{id}/construction` | L2 records, material logs, load tests | Engineer, Admin |
| `POST /bridges/{id}/assignments` | Assign officers | Division Engineer, Admin |
| `GET /audits?status=&period=` | List audits | Scoped roles |
| `POST /audits`; `PUT /audits/{id}/draft` | Create audit, autosave draft | Officer |
| `POST /audits/{id}/submit`; `/amend` | Submit, correct audit | Officer |
| `POST /audits/{id}/approve`; `/return` | Audit review | Division Engineer |
| `POST /evidence/presign` | Presigned MinIO upload URL | Officer |
| `POST /telemetry/readings` | Batch ingestion with sensor key | Sensor key |
| `GET /bridges/{id}/telemetry?from=&to=&res=` | History and rollups | Scoped roles |
| `GET /bridges/{id}/telemetry/stream` | Live SSE stream | Scoped roles |
| `GET /bridges/{id}/risk/latest`, `/risk/history` | SVI, tier, RUL, explanation | Scoped roles |
| `POST /bridges/{id}/risk/recompute` | Manual recompute | Engineer, Admin |
| `GET /bridges/{id}/recommendations`; `PATCH /{rid}` | Ranked actions, status | Scoped roles |
| `GET /alerts`; `POST /alerts/{id}/ack`, `/snooze`, `/action` | Alert console | Engineer |
| `GET /notifications`; `PATCH /me/preferences` | In-app inbox, channels, locale | Authenticated |
| `GET /admin/analytics/*`; `GET /admin/jobs`; `GET /admin/dlq` | Analytics, scheduler, and queue health | Admin |
| `GET /meta/enums?locale=` | Enums with labels for forms | Any |
| `GET /health`, `/ready` | Liveness and readiness | Ops |
