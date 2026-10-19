# Appendix E: Definition of Done and Recovery Prompts

## E.1 Master Acceptance Checklist (run from a clean clone)

| Area | Must Be True |
|---|---|
| **Run** | `make up` healthy in under 5 minutes; seed creates synthetic bridges, users, and a Monsoon Night scenario |
| **Lifecycle** | L1 to L7 each demonstrable end to end in the UI |
| **Languages** | All screens, errors, emails, SMS, and recommendations work in English, Hindi, and Marathi; language switch preserves state (Playwright proof) |
| **Scheduler** | Reminder fires exactly 7 days before month-end, once, with correct escalation (frozen-time tests across a full year) |
| **Risk Engine** | Golden test reproduces report Table 7; property tests pass; assessments reproducible; critical flags override; ML cannot downgrade |
| **Telemetry** | Seeded simulator, device-ready ingestion, stale or faulty sensors never read as safe |
| **Security** | RBAC and jurisdiction tests, ZAP baseline clean, no secrets in repository, public redaction tested |
| **Quality** | CI green; coverage targets met; Lighthouse and axe thresholds met; p95 and throughput targets met |
| **Honesty** | SIMULATED labels present; advisory disclaimer on risk screens; evaluation report states limits; no real-world prevention claim |
| **Docs** | README, ADRs, C4 diagrams, API reference, data dictionary, model card, runbook, three-language user guides, demo script |

## E.2 Recovery Prompts (use when an agent drifts)

- **Re-plan**: Stop. Re-read `docs/spec/` and Part A rules. List where your current work deviates, propose a corrected plan as an artifact, and wait for approval before editing more files.
- **Verify honestly**: Run lint, type-check, and the full test suite now. Paste the real output. For every failure or skipped check, say why and fix it. Do not mark the task complete until everything is green.
- **i18n audit**: Search the codebase for user-facing strings outside message files and for any code path that stores translated text in the database. Fix each and add a test.
- **Scope guard**: You added features beyond this phase. Revert them into a separate branch, and list them as backlog items with rough effort.
- **Explain a decision**: Write an ADR for the choice you just made: context, options considered, decision, consequences. Link it from the README.
- **Security pass**: Review the diff as an attacker: authorization gaps, IDOR across jurisdictions, injection, unsafe uploads, secrets, verbose errors. List findings by severity and fix high and medium ones with tests.
