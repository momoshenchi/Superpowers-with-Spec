# 1. Templates and schema contract

## Writer-facing vocabulary

- [x] 1.1 Update `schemas/spec-driven/templates/test-plan.md` status vocabulary, Dimension Summary placeholders, and Manual Coverage `ID` column
- [x] 1.2 Update `schemas/spec-driven/schema.yaml` test-plan instructions to match
- [x] 1.3 Update `src/commands/schema.ts` test-plan scaffold to match the template
- [x] 1.4 Rename remediations sample heading to `## RM-1` in `schemas/spec-driven/templates/remediations.md`

# 2. Workflow guidance and skill notes

## Apply / instructions / full-qa-test

- [x] 2.1 Update apply-change and related hardening guidance to normative `passed`/`failed`/`blocked` (keep alias note if useful)
- [x] 2.2 Update `instructions.ts` hardening instruction strings without changing `COMPLETE_TEST_PLAN_STATUSES`
- [x] 2.3 Document Manual IDs and status vocabulary in `skills/full-qa-test/SKILL.md`

# 3. Tests

## Parity and contract pins

- [x] 3.1 Update schema/instruction-loader/remediations/parity tests for new vocabulary and `RM-` / Manual `ID`
- [x] 3.2 Keep or add assertion that completeness aliases still include `covered`
- [x] 3.3 Run focused tests, build, and full suite
