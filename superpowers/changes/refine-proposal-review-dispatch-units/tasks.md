# 1. Proposal review gate

## Review workflow text and contracts

- [x] 1.1 Update generated `change-review` workflow so automatic propose re-review is blocker-gated; WARNING repairs optional and non-blocking; readiness requires no unresolved BLOCKER
- [x] 1.2 Update generated `/sp:propose` workflow text to match blocker-gated re-review and residual WARNING/SUGGESTION notes
- [x] 1.3 Update root `skills/change-review/SKILL.md` to the same severity/re-review policy and dispatch-unit review criteria
- [x] 1.4 Update contract tests in `test/core/templates/change-review.test.ts` and `test/core/change-review-guidance.test.ts` for the new policy phrases

# 2. Dispatch unit model and templates

## Schema, skills, and fallbacks

- [x] 2.1 Rewrite `schemas/spec-driven/templates/tasks.md` to pure-scope `# <n>. <scope>` dispatch units
- [x] 2.2 Rewrite `schemas/spec-driven/templates/execution-plan.md` with Dispatch Coordination (incl. Assignee policy) and clean `### <n>. <scope>` headings
- [x] 2.3 Update `schemas/spec-driven/schema.yaml` tasks/execution-plan instructions for dispatch-unit terminology and formats
- [x] 2.4 Update `src/commands/schema.ts` fallback tasks/execution-plan templates to the same convention
- [x] 2.5 Update `skills/subagent-driven-development/**` and `skills/requesting-code-review/**` from work package to dispatch unit, preserving flexible assignment and legacy acceptance
- [x] 2.6 Update generated apply/onboard guidance (and only residual propose terminology after unit 1) that still says work package / agent labels
- [x] 2.7 Update `test/core/subagent-work-package-guidance.test.ts`, schema/template parity tests, and any fixture strings that assert the old heading form

# 3. Integrated verification

## Final checks

- [x] 3.1 Run focused contract tests for review + dispatch-unit guidance and fix failures
- [x] 3.2 Run broader test/build/lint checks needed for this change and record evidence in test-plan
- [x] 3.3 Perform one final integration review of the full guidance/template/test diff
