# ADR-0004: Preservation of Free-Text Officer Remarks in Original Language

## Status
Accepted

## Context
During monthly 26-factor field audits, Project Officers frequently input qualitative engineering observations, site photos descriptions, and local damage nuances in their native language (e.g. Marathi or Hindi). 

Machine-translating free-text remarks in v1 poses safety and legal liability risks:
1. Nuanced technical descriptions (e.g. subtle crack patterns, localized scour whirlpools) can be mistranslated or distorted by runtime machine translation.
2. In legal or post-disaster inquiries, original notes recorded by the engineer on-site carry legal weight as primary evidence.

## Decision
1. **Preserve Original Language**: Free-text officer remarks are persisted strictly as a JSON object: `{ "text": string, "lang": "en" | "hi" | "mr" }`.
2. **Display Original Language with Visual Badge**: On all consoles (Engineer review, Admin analytics, audit histories), the remark is rendered in its original inputted language accompanied by a badge identifying the language (e.g. `[मराठी]`, `[हिन्दी]`, `[English]`).
3. **No Automatic Runtime Translation in v1**: Automatic machine translation of subjective remarks is deliberately omitted in v1. Official civil engineering translators may author certified translations in future versions.

## Consequences
- **Positive**:
  - Full evidentiary integrity and legal defensibility.
  - Zero risk of dangerous mistranslations altering structural defect assessments.
- **Negative / Trade-offs**:
  - Reviewers who do not speak the specific local language will require human assistance or manual translation.
