## Why

The default Superpowers proposal workflow currently jumps from a compact `tasks.md` checklist straight into implementation. That checklist is useful for progress tracking, but it is too small to capture the detailed, TDD-oriented execution guidance from the `writing-plan` skill.

Adding a dedicated execution plan artifact gives agents a place to produce implementation-ready instructions without overloading `tasks.md` or breaking existing task tracking.

## What Changes

- Add an `execution-plan` artifact to the default `spec-driven` workflow.
- Generate `execution-plan.md` after `tasks.md`, using proposal, specs, design, and tasks as context.
- Base the new artifact's template and instructions on the existing `writing-plan/` guidance:
  - file structure map before task details
  - bite-sized TDD steps
  - exact file paths
  - exact commands with expected results
  - mandatory test-first sequencing
  - a comprehensive test code review gate before production code is written
  - no placeholders
  - self-review before handoff
- Keep `tasks.md` as the checkbox tracking file for apply/list/archive behavior.
- Require `execution-plan` before apply so implementation starts with both a trackable checklist and a detailed execution plan.
- Update generated Superpowers workflow skill/command text so proposal, fast-forward, continue, onboarding, and apply flows understand the extra artifact.
- Extend schema initialization defaults so custom schemas can include the same execution-plan artifact when appropriate.

## Capabilities

### New Capabilities

- `execution-plan-artifact`: Adds a detailed execution planning artifact to the Superpowers artifact workflow, including template content, generation guidance, dependencies, and apply-readiness semantics.

### Modified Capabilities

- `cli-artifact-workflow`: The default `spec-driven` artifact graph and apply requirements change to include `execution-plan` while preserving `tasks.md` as the progress tracking file.
- `schema-init-command`: Common schema scaffolding can include the execution-plan artifact and generate an appropriate default template.
- `cli-init`: Generated Superpowers skills and slash-command instructions describe and handle the execution-plan artifact in user-facing workflows.

## Impact

- Default schema and templates:
  - `schemas/spec-driven/schema.yaml`
  - `schemas/spec-driven/templates/execution-plan.md`
- Workflow skill and command template text:
  - `src/core/templates/workflows/propose.ts`
  - `src/core/templates/workflows/ff-change.ts`
  - `src/core/templates/workflows/continue-change.ts`
  - `src/core/templates/workflows/new-change.ts`
  - `src/core/templates/workflows/apply-change.ts`
  - `src/core/templates/workflows/onboard.ts`
- Schema scaffolding:
  - `src/commands/schema.ts`
- Tests and generated-output guardrails:
  - artifact workflow/status/apply tests
  - schema init tests
  - explicit test-review checkpoint before production implementation
  - skill template parity hashes or updated generated output assertions
