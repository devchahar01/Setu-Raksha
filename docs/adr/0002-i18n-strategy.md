# ADR-0002: Trilingual Localization Strategy (EN, HI, MR)

## Status
Accepted

## Context
Setu Raksha must serve public citizens, field project officers, and divisional engineers across India, specifically starting with Maharashtra river basins. The platform mandates full trilingual capability from day one in:
- English (en)
- Hindi (hi - हिन्दी)
- Marathi (mr - मराठी)

A common failure mode in localized public software is language drift, hardcoded strings, state loss during locale switching, and inaccurate machine translation of life-critical engineering recommendations.

## Decision
1. **Locale-Prefixed Routing**:
   - Web application routes will use `/en`, `/hi`, and `/mr` prefixes using `next-intl`.
2. **State-Preserving Locale Switching**:
   - Switching language must never reset in-progress inspection forms or filters. Form state is decoupled from rendering into client stores (react-hook-form + Zustand) and autosaved to IndexedDB.
   - Locale switches invoke `router.replace` maintaining path, search parameters, and form state without full network reloads.
3. **No Dynamic Machine Translation for Safety-Critical Guidance**:
   - Structural recommendations and emergency instructions (e.g. "Close bridge, divert traffic") will be drawn strictly from a pre-authored, reviewable catalogue with civil engineering approval (`reviewed_by` metadata).
4. **Engineering Terminology Glossary**:
   - A centralized glossary (`packages/shared/i18n-glossary.yaml`) standardizes technical vocabulary (e.g., पुल / पूल, जलक्षरण / पायाची झीज, रिपरैप / रिपरॅप).
5. **Language-Neutral Database Storage**:
   - The database stores canonical codes, metric SI values, and UTC timestamps. Translation occurs purely at render time or notification dispatch.

## Consequences
- **Positive**:
  - Seamless experience for field officers and citizens regardless of language.
  - Zero risk of dangerous hallucinations or mistranslations in disaster advisory notices.
  - Full auditability of localization keys.
- **Negative / Trade-offs**:
  - Higher upfront authoring cost for every UI namespace and message key across 3 languages.
