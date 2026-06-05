## 1. Write Artifact And Schema Tests

- [ ] 1.1 Add artifact graph tests proving `test-plan` is blocked before `execution-plan.md`, ready after `execution-plan.md`, and done after `test-plan.md` exists.
- [ ] 1.2 Add status JSON tests proving default spec-driven `applyRequires` includes `test-plan`.
- [ ] 1.3 Add apply instruction tests proving apply is blocked when `test-plan.md` is missing.
- [ ] 1.4 Add apply instruction tests proving `test-plan.md` is included in context while task progress still comes from `tasks.md`.
- [ ] 1.5 Add templates command tests proving `test-plan` resolves to `schemas/spec-driven/templates/test-plan.md`.
- [ ] 1.6 Add instruction-loader/template-content tests proving `test-plan.md` includes the two-phase draft/hardening structure and explicit hardening completion checklist.
- [ ] 1.7 Add template-content tests proving the exact hardening marker starts as `- [ ] Test Hardening complete`.

## 2. Write Workflow And Schema Init Tests

- [ ] 2.1 Add generated apply workflow tests proving task completion transitions into Test Hardening before apply completion.
- [ ] 2.2 Add generated workflow tests proving apply instructions distinguish red tests in `execution-plan.md` from post-implementation Test Hardening in `test-plan.md`.
- [ ] 2.3 Add generated apply workflow tests proving `- [x] Test Hardening complete` is the only completion marker.
- [ ] 2.4 Add generated apply workflow tests proving failing hardening tests or unresolved defects block apply completion.
- [ ] 2.5 Add generated apply workflow tests proving hardening diff review scopes to relevant working-tree changes and pauses on ambiguous unrelated changes.
- [ ] 2.6 Add propose, continue, fast-forward, and onboarding generated-text tests for the `test-plan.md` artifact sequence.
- [ ] 2.7 Add schema init tests for selecting `test-plan`, generating dependencies, generating apply requirements, and creating `templates/test-plan.md`.
- [ ] 2.8 Add negative schema init coverage proving schemas without `test-plan` keep existing apply requirement behavior.

## 3. Implement Schema And Templates

- [ ] 3.1 Add `test-plan` artifact to `schemas/spec-driven/schema.yaml` after `execution-plan`.
- [ ] 3.2 Change default schema `apply.requires` from `execution-plan` to `test-plan` while keeping `apply.tracks` as `tasks.md`.
- [ ] 3.3 Create `schemas/spec-driven/templates/test-plan.md` with the requirement/scenario coverage matrix, risk sweep, command evidence, deferrals, and hardening completion checklist.
- [ ] 3.4 Update `schemas/spec-driven/templates/execution-plan.md` to clarify that red tests drive implementation and post-diff coverage hardening belongs in `test-plan.md`.
- [ ] 3.5 Ensure `test-plan.md` uses the exact completion marker `- [ ] Test Hardening complete` in its initial template.

## 4. Update Generated Workflow Instructions

- [ ] 4.1 Update `/sp:apply` skill and command templates to include the Test Hardening stage after implementation tasks are complete.
- [ ] 4.2 Update `/sp:apply` all-done handling so completed tasks still resume Test Hardening when `test-plan.md` does not mark hardening complete.
- [ ] 4.3 Update `/sp:apply` completion output to summarize implementation progress and Test Hardening separately.
- [ ] 4.4 Update `/sp:apply` hardening guidance to inspect relevant `git diff --stat` / `git diff`, ignore clearly unrelated changes, and pause when diff ownership is ambiguous.
- [ ] 4.5 Update `/sp:apply` hardening guidance to block completion on failing hardening tests or unresolved defects.
- [ ] 4.6 Update propose, continue, fast-forward, and onboarding templates to mention `test-plan.md` in the default spec-driven artifact sequence.
- [ ] 4.7 Update template parity tests or generated-output assertions after reviewing the intentional text changes.

## 5. Update Schema Init

- [ ] 5.1 Add `test-plan` to schema init's common artifact list.
- [ ] 5.2 Teach schema init dependencies that `test-plan` requires `execution-plan`.
- [ ] 5.3 Teach schema init apply generation to require `test-plan` when selected, `execution-plan` when selected without `test-plan`, and `tasks` otherwise.
- [ ] 5.4 Verify generated project-local schema template paths are created with platform-safe joins.

## 6. Validation

- [ ] 6.1 Run targeted artifact workflow and instruction-loader tests.
- [ ] 6.2 Run schema init tests.
- [ ] 6.3 Run generated workflow/template parity tests.
- [ ] 6.4 Run docs-related tests or documentation validation if available.
- [ ] 6.5 Run the full test suite.
- [ ] 6.6 Run or document cross-platform path validation coverage for the new template path behavior.
