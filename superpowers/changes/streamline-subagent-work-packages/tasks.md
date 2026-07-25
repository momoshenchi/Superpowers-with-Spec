# 1. agent1 — Subagent dispatch and final review guidance

## Replace per-item delegation and review

- [x] 1.1 Add `test/core/subagent-work-package-guidance.test.ts` with contract assertions for complete-block dispatch, logical labels, inline execution, combined compatible blocks, legacy flat-list fallback, and one final review.
- [x] 1.2 Update `skills/subagent-driven-development/SKILL.md` so `# <number>. agent<logical-id> — <scope>` is the dispatch and handoff unit; clarify the legacy flat-list fallback, logical-label semantics, optional combined assignments, and main-agent sequential execution.
- [x] 1.3 Update `skills/subagent-driven-development/implementer-prompt.md` so an assignment carries a complete work-package block, its dependencies, ownership boundaries, verification expectations, and self-review responsibilities rather than one individual checkbox task.
- [x] 1.4 Replace the per-task two-stage review instructions and the current code-quality reviewer prompt with guidance for one cross-package integration review after all work packages are integrated; require targeted verification after fixes and prohibit a second complete review unless the reviewer explicitly requests confirmation of a specified finding.
- [x] 1.5 Update `skills/requesting-code-review/SKILL.md` and its reviewer prompt so subagent-driven development requests its formal review once for the integrated change, while preserving its general major-feature and pre-merge guidance.
- [x] 1.6 Run `pnpm exec vitest run test/core/subagent-work-package-guidance.test.ts` and confirm the guidance contract passes.

# 2. agent2 — Default schema and scaffolded artifact conventions

## Generate work-package task and coordination plans

- [x] 2.1 Add or update focused regression assertions for default-schema task instructions, execution-plan instructions, and schema-init fallback templates before changing their source text.
- [x] 2.2 Update `schemas/spec-driven/templates/tasks.md` and the `tasks` instructions in `schemas/spec-driven/schema.yaml` to show the exact `# <number>. agent<logical-id> — <scope>` heading and detailed checkbox syntax; state that headings are logical allocation boundaries.
- [x] 2.3 Update `schemas/spec-driven/templates/execution-plan.md`, `schemas/spec-driven/templates/test-plan.md`, and their schema instructions to capture ownership, dependency, safe parallelism, integration order, Step 1–5 execution detail for every fine-grained task, worker verification, one final cross-package review, and post-integration Test Hardening.
- [x] 2.4 Update the `tasks` and `execution-plan` fallback templates in `src/commands/schema.ts` so project-local schemas scaffold the same convention.
- [x] 2.5 Run the focused schema, artifact-instruction, and schema-init tests; ensure path-oriented assertions continue to use `path.join()` or `path.resolve()` where they construct filesystem paths.

# 3. agent3 — Generated workflow alignment and integrated validation

## Remove stale micro-step and review-gate wording

- [x] 3.1 Update `src/core/templates/workflows/propose.ts`, `src/core/templates/workflows/onboard.ts`, and `src/core/templates/workflows/apply-change.ts` so generated proposal/onboarding/apply text describes work packages, the retained per-task Step 1–5 execution detail, worker-level verification, coordination, and final integration validation without imposing 2–5 minute delegation units or a per-step test-review gate.
- [x] 3.2 Update generated-template parity assertions and any affected workflow-instruction tests so they prove the work-package, per-task Step 1–5, and final-review wording while retaining task progress and Test Hardening behavior.
- [x] 3.3 After work packages 1 and 2 are integrated, run `pnpm exec vitest run test/commands/schema.test.ts test/core/artifact-graph/instruction-loader.test.ts test/core/templates/skill-templates-parity.test.ts`, `pnpm run lint`, and `pnpm test`; record failures or intentional deferrals in `test-plan.md`.
- [x] 3.4 Perform the single final cross-package review of the integrated diff against the proposal, delta specs, design, `tasks.md`, and `execution-plan.md`; resolve blocking findings before marking the change ready.
