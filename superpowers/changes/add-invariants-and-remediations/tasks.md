# 1. Design Invariants conventions

## Templates and schema instruction

- [x] 1.1 Add required `## Invariants` section (with N/A guidance) to `schemas/spec-driven/templates/design.md` after `## Contracts`, and mirror the same skeleton in `src/commands/schema.ts` design fallback template.
- [x] 1.2 Update `schemas/spec-driven/schema.yaml` design artifact `instruction` to require `## Invariants` (N/A allowed), define falsifiable ID/owner-check expectations, and stop listing Invariants among forbidden invented mandatory headings.

## Review and tests

- [x] 1.3 Update change-review design convention checks in `src/core/templates/workflows/change-review.ts` (and skill/command parity projections) so missing `## Invariants` is a BLOCKER and explicit N/A passes presence.
- [x] 1.4 Extend `test/core/templates/design-conventions.test.ts` (and related schema/instruction assertions) for Invariants section order, N/A phrase, and instruction wording.

# 2. Remediations artifact conventions

## Template and Apply repair ownership

- [x] 2.1 Add `schemas/spec-driven/templates/remediations.md` with required fields: Finding, Root cause, Solutions (≥2), Choice, Rationale, Fix, Guard, Evidence, Status.
- [x] 2.2 Update `src/core/templates/workflows/final-quality-gates.ts` (`getFinalQualityGateInstructions` Repair ownership / gate text) and any necessary `apply-change.ts` interpolation notes so accepted code-review or Verify P0/P1 create-or-append `remediations.md` (probe change-dir path) before implementation edits; allow omit or N/A when zero such repairs; exclude Design Verify-only and P2-only from requiring entries; require multi-solution selection; block P0 `resolved` without Guard; optionally link Final Gates rows to `R#`.
- [x] 2.3 Update `src/core/templates/workflows/verify-change.ts` (and skill/command parity) so Verify probes `superpowers/changes/<name>/remediations.md` on retry rounds (not only contextFiles), checks non-N/A design Invariants (owner-check failure → CRITICAL), and flags resolved P0 without Guard as incomplete evidence.
- [x] 2.4 Update SDD / when-to-dispatch-code-review guidance only as needed so Apply-owned repairs mention remediations without adding a new gate or per-task review.
- [x] 2.5 Add/extend focused tests for remediations template presence and Apply/Verify/Review instruction string contracts; run `pnpm run build`, `pnpm run lint`, and focused vitest, then record broader suite evidence in `test-plan.md`.
