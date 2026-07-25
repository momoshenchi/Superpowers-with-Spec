# 1. agent1 — Proposal-review workflow contract and content

## Review behavior

- [x] 1.1 Add `test/core/templates/change-review.test.ts` with failing assertions that the generated review skill and `/sp:review` command perform schema-aware proposal review, use BLOCKER/WARNING/SUGGESTION findings, require BLOCKER/WARNING repair, and distinguish proposal readiness from implementation verification.
- [x] 1.2 Add `src/core/templates/workflows/change-review.ts` with the generated `superpowers-change-review` skill and `/sp:review` command, based on the existing review guidance and updated for work-package task blocks plus per-task Step 1–5 execution detail.
- [x] 1.3 Update `skills/change-review/SKILL.md` so the repository-local review guidance matches the generated workflow contract, removes retired micro-task timing/delegation criteria, and requires report-before-repair for automatic proposal review.
- [x] 1.4 Add `test/core/change-review-guidance.test.ts` contract coverage that prevents the root Markdown rendering and generated TypeScript source of truth from drifting on automatic-review timing, report-before-repair, BLOCKER/WARNING repair, ephemeral status, and separation from final integration review.

# 2. agent2 — Generate and distribute the review workflow

## Profile and installation registration

- [x] 2.1 Add failing assertions in `test/core/profiles.test.ts`, `test/core/shared/skill-generation.test.ts`, `test/core/shared/tool-detection.test.ts`, `test/core/profile-sync-drift.test.ts`, `test/core/init.test.ts`, `test/core/update.test.ts`, `test/commands/config.test.ts`, and `test/commands/config-profile.test.ts` for the `review` workflow, including core-profile inclusion and custom-profile exclusion.
- [x] 2.2 Register `review` in the core workflow profile, workflow prompt metadata, tool detection, profile synchronization, and generated skill/command template registries.
- [x] 2.3 Update init and update output/count expectations so supported tools receive `superpowers-change-review` and `/sp:review` when the selected profile includes `review`; verify generic command adapters require no source change, modifying an adapter only if a review-specific hardcoded workflow list is found.
- [x] 2.4 Run the focused profile/init/update/generation tests and resolve registration or cross-tool command-path failures.

# 3. agent3 — Proposal lifecycle and onboarding integration

## Automatic review sequence

- [x] 3.1 Add failing assertions in `test/core/templates/skill-templates-parity.test.ts` for `/sp:propose`: complete all `applyRequires` artifacts, emit the proposal review report, repair every resolvable BLOCKER and WARNING, re-review, and only then announce readiness; pause for user or external decisions while allowing reported SUGGESTION findings.
- [x] 3.2 Update `src/core/templates/workflows/propose.ts` and its command template to execute the automatic proposal-review sequence after artifact completion, with no review artifact or persisted approval state.
- [x] 3.3 Update `src/core/templates/workflows/apply-change.ts` so it explicitly does not auto-repeat proposal review, retains the separate final integration review/Test Hardening expectations, and directs voluntary re-review to `/sp:review`.
- [x] 3.4 Update `src/core/templates/workflows/onboard.ts` and related command text to teach proposal review before apply and distinguish it from the post-implementation integration review; do not make `/sp:continue` auto-run review.
- [x] 3.5 Update generated-template parity and workflow-instruction tests for the report-before-repair order, no-apply-rereview rule, and two distinct review contracts.

# 4. agent4 — Cross-package validation and final review

## Integrated evidence

- [x] 4.1 Run focused review-workflow, profile/init/update, and generated-template tests; record exact commands and outcomes in `test-plan.md`.
- [x] 4.2 Run `pnpm run build`, `pnpm run lint`, and `pnpm test`; resolve failures caused by the new workflow registration or changed generated files.
- [x] 4.3 Perform one final cross-package implementation review against the proposal, delta specs, design, tasks, execution plan, and test plan; verify that no `review.md`, review artifact, `applyRequires` change, or apply-time auto-review was introduced.
