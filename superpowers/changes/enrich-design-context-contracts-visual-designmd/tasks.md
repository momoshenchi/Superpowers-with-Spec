# 1. Schema design template and instruction

## Package schema

- [x] 1.1 Update `schemas/spec-driven/templates/design.md` with `## Current system`, `### Relationship to existing tech`, `## Contracts`, and decision-comparison placeholders while keeping Context / Goals / Risks
- [x] 1.2 Update `schemas/spec-driven/schema.yaml` design artifact `instruction` for Current system, Relationship pointers, Contracts, scale-aware decisions, visual DESIGN.md rules, and attachments diagrams
- [x] 1.3 Align `src/commands/schema.ts` design fallback template string with the same section skeleton and brief alternatives guidance for major decisions

# 2. Explore and change-review conventions

## Workflows and repo skill

- [x] 2.1 Update `src/core/templates/workflows/explore.ts` so major-feature exploration diverges with ≥3 approaches and design records comparison + choice; minor work stays light
- [x] 2.2 Update `src/core/templates/workflows/change-review.ts` checklist/criteria for Current system, Contracts, reuse pointers, major vs minor comparisons, and visual DESIGN.md UI rules with scale-aware severities
- [x] 2.3 Update `skills/change-review/SKILL.md` to the same normative review criteria (parity with generated template)

# 3. Verification

## Tests and parity

- [x] 3.1 Update or add unit/parity tests for design template/instruction content, explore major-option handoff strings, and change-review criteria coverage (including skill-templates parity hashes if applicable)
- [x] 3.2 Run targeted template/schema/review tests and fix regressions from string/hash drift
