## Why

Test-plan tables, Manual Coverage, Final Quality Gates, and remediations use overlapping but inconsistent ID and status vocabularies (`covered`/`failing` vs `passed`/`failed`, Manual rows without IDs, remediations `R1` colliding with requirement `R1`). Agents and humans mis-record completion and cannot reliably cross-reference evidence.

## What Changes

- Unify executable-row statuses to `planned | passed | failed | blocked | not applicable`.
- Remove `covered` and `failing` from normative writer guidance; keep parser/read compatibility for legacy aliases.
- Use the same status vocabulary for Dimension Coverage Summary (`planned` / `passed` / `not applicable`).
- Keep case IDs as `TC-R<object>-D<dimension>-<seq>`; add Manual IDs `MC-R<object>-<seq>` (or `MC-<seq>` when no object).
- Rename remediations entry headings from `R#` to `RM-#`.
- Update schema instructions, apply/FQG guidance, scaffolds, and parity tests. Do not tighten `COMPLETE_TEST_PLAN_STATUSES`.

## Capabilities

### New Capabilities
- `test-id-status-vocabulary`: Canonical test/manual/gate ID and status vocabulary for Superpowers test-plan workflows

### Modified Capabilities
- `test-plan-manual-coverage`: Manual Coverage gains stable IDs; incomplete statuses use `failed` (not `failing`); writers stop using `covered`

## Attachments

## Impact

- `schemas/spec-driven/templates/test-plan.md`, `remediations.md`, `schema.yaml`
- `src/commands/schema.ts` test-plan scaffold
- `src/core/templates/workflows/apply-change.ts`, `final-quality-gates.ts` (guidance only)
- `src/commands/workflow/instructions.ts` (guidance strings only; parser aliases unchanged)
- `skills/full-qa-test/SKILL.md` (ID/status notes)
- Template/parity tests under `test/`
