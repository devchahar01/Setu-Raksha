# Appendix F: Suggested Timeline and Risks

A realistic 12-week plan for one student working with an agentic IDE. Review every agent plan and walkthrough yourself: you must be able to explain every module in your viva.

| Weeks | Phase | Focus | Faculty Checkpoint |
|---|---|---|---|
| 1 | Phase 0 | Repo, Compose stack, CI, ADRs | |
| 2 to 3 | Phase 1 | Schema, auth, RBAC, bridge registry, L1 and L2 | |
| 3 to 4 | Phase 2 | Trilingual layer, state-preserving switch, glossary | Language demo |
| 4 to 5 | Phase 3 | Officer portal and 26-factor wizard | Officer workflow demo |
| 4 to 6 | Phase 4 | Simulator, ingestion, live dashboard | |
| 6 to 8 | Phase 5 | Rule engine, RUL, recommendations, ML advisor | Risk model review with a civil engineering faculty member |
| 8 to 9 | Phase 6 | Scheduler, alerts, trilingual notifications | Month-end reminder demo |
| 9 to 10 | Phase 7 | Public portal, engineer console, analytics | |
| 10 to 12 | Phase 8 | Evaluation study, security, performance, docs, demo rehearsal | Final demo: Monsoon Night |

## F.1 Hardware Notes for the RTX Laptop
- Everything except model training runs in Docker on CPU. The RTX GPU is used only for XGBoost GPU training and optional experiments; the training script must fall back to CPU automatically.
- Allocate at least 16 GB RAM to Docker for the full stack. Use `make up-lite` (no simulator, no ZAP) while developing the UI.

## F.2 Key Risks and Mitigations
| Risk | Mitigation built into the prompts |
|---|---|
| **Scope creep and an agent that drifts** | Phase-by-phase missions, plan approval, scope-guard and re-plan prompts (Appendix E) |
| **Unrealistic or unvalidated risk thresholds** | Config-driven thresholds labelled example, expert review checkpoint, golden test tied to approved report |
| **Overclaiming results in the viva** | Evaluation protocol with confidence intervals; SIMULATED labels; advisory disclaimers; 90% stated only as a target |
| **Poor Hindi or Marathi technical wording** | Glossary pending native-speaker review; `reviewed_by` field on every recommendation string |
| **Real SMS delivery blocked in India** | Provider interface with mock; DLT template registration documented as a production step |
| **Public portal exposing exploitable detail** | Redaction layer, `public_visibility` flag and tests; no raw defect data on public routes |
| **Silent errors in a safety context** | Sensor health states, confidence scores, missing data never treated as safe, ML cannot downgrade rule flags |
