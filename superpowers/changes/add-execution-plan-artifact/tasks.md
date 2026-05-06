## 1. Write Tests First

- [x] 1.1 Add status tests proving `execution-plan` is blocked before `tasks.md`, ready after `tasks.md`, and done after `execution-plan.md`
- [x] 1.2 Add JSON status tests proving `applyRequires` includes `execution-plan`
- [x] 1.3 Add apply instruction tests proving missing `execution-plan.md` blocks apply
- [x] 1.4 Add apply instruction tests proving `execution-plan.md` is included as context while task progress still comes from `tasks.md`
- [x] 1.5 Add schema init tests for selecting `execution-plan`, generating dependencies, generating apply requirements, and rejecting invalid artifact ids
- [x] 1.6 Add template-content tests proving `execution-plan.md` includes the test-first and test-review gate requirements
- [x] 1.7 Add generated workflow instruction tests or parity expectations for propose, fast-forward, continue, apply, and onboarding text
- [x] 1.8 Include cross-platform path expectations using `path.join()` or `path.resolve()` in all new path-related tests

## 2. Review Tests Before Production Code

- [x] 2.1 Perform a comprehensive code review of the test changes before modifying production code
- [x] 2.2 Verify tests cover every requirement in `specs/execution-plan-artifact/spec.md`
- [x] 2.3 Verify tests cover modified `cli-artifact-workflow`, `schema-init-command`, and `cli-init` behavior
- [x] 2.4 Verify tests include positive, negative, blocked, ready, and completed states where relevant
- [x] 2.5 Verify tests would fail for shallow implementations such as adding a template file without updating apply requirements
- [x] 2.6 Fix any gaps found during test review before starting production-code changes

## 3. Schema and Template Implementation

- [x] 3.1 Add `execution-plan` artifact to `schemas/spec-driven/schema.yaml` after `tasks`
- [x] 3.2 Change default schema `apply.requires` to `execution-plan` while keeping `apply.tracks` as `tasks.md`
- [x] 3.3 Create `schemas/spec-driven/templates/execution-plan.md` from the `writing-plan` guidance adapted for change-local artifacts
- [x] 3.4 Ensure the template explicitly requires test authoring and comprehensive test review before production-code steps
- [x] 3.5 Verify `superpowers templates --schema spec-driven` lists the new execution-plan template path

## 4. Schema Init Scaffolding

- [x] 4.1 Add `execution-plan` to schema init's common artifact list
- [x] 4.2 Teach schema init dependencies that `execution-plan` requires `tasks`
- [x] 4.3 Teach schema init apply generation to require `execution-plan` when selected and `tasks` otherwise
- [x] 4.4 Verify generated project-local schema template paths are created with platform-safe joins

## 5. Generated Workflow Instructions

- [x] 5.1 Update propose and fast-forward skill/command text to mention `execution-plan.md`
- [x] 5.2 Update continue workflow text to describe execution-plan as a schema-discovered artifact
- [x] 5.3 Update apply workflow text to treat execution-plan as context and `tasks.md` as progress tracking
- [x] 5.4 Update onboarding text to explain the proposal -> specs -> design -> tasks -> execution-plan sequence
- [x] 5.5 Update template parity hashes or generated-output assertions after reviewing the intentional text changes

## 6. Validation

- [x] 6.1 Run targeted artifact workflow and schema init tests
- [x] 6.2 Run skill template parity tests
- [x] 6.3 Run the full test suite
- [x] 6.4 Run or document Windows-relevant path validation coverage for the new file path behavior
