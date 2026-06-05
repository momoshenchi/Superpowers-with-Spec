## Why

Completed Superpowers changes can still ship with many latent bugs because `/sp:apply` currently treats implementation checklist completion as the natural endpoint. Even when execution plans use red-green TDD, that first testing pass is optimized for driving implementation, not for attacking the finished diff across edge cases, failures, non-critical paths, and integration seams.

We need a first-class post-implementation Test Hardening stage inside `/sp:apply`, backed by a `test-plan.md` artifact, so agents distinguish "tests that guide coding" from "tests that try to break the completed change before handoff."

## What Changes

- Add `test-plan.md` as a first-class planning artifact created after `execution-plan.md` and before implementation begins.
- Keep `execution-plan.md` as the detailed implementation/TDD guide; large execution plans are acceptable when they improve coding accuracy.
- Define `test-plan.md` as a two-phase artifact:
  - **Pre-implementation draft:** maps requirements, scenarios, and known risks to intended unit, integration, E2E, boundary, and failure coverage.
  - **Post-implementation hardening record:** updated at the end of `/sp:apply` using the actual diff, observed implementation risks, added tests, verification commands, and any deferred manual checks.
- Update `/sp:apply` so completing all implementation tasks transitions into a mandatory Test Hardening phase instead of immediately suggesting archive.
- In the Test Hardening phase, require the agent to supplement coverage across:
  - boundary cases
  - abnormal/error cases
  - non-critical paths
  - empty/missing/invalid input states
  - permission and ownership failures where relevant
  - repeated actions, race-prone flows, and idempotency cases
  - integration points and E2E workflows when the change affects user-visible behavior
  - cross-platform path behavior when file paths are involved
- Clearly distinguish pre-production red tests from post-implementation Test Hardening:
  - Red tests in `execution-plan.md` drive the next implementation step.
  - Test Hardening in `test-plan.md` audits the completed implementation and fills coverage gaps discovered from the final code shape.
- Do not change `/sp:verify` behavior in this change.
- Do not change `/sp:archive` templates, instructions, or explicit archive gates in this change. Because `test-plan.md` becomes a schema artifact, existing archive readiness checks may naturally see the additional artifact through schema status.

## Capabilities

### New Capabilities

- `apply-test-hardening`: `/sp:apply` includes a post-implementation testing stage that updates `test-plan.md` and adds missing tests before declaring apply complete.
- `test-plan-artifact`: Superpowers changes include a dedicated test planning and hardening artifact distinct from `execution-plan.md`.

### Modified Capabilities

- `cli-artifact-workflow`: The spec-driven artifact sequence gains `test-plan.md` after `execution-plan.md`.
- `command-generation`: Generated apply workflow instructions describe the Test Hardening stage and the difference between TDD red tests and post-implementation hardening.
- `schema-init-command`: Custom schema scaffolding can opt into `test-plan` with the same dependency ordering.

## Impact

- `schemas/spec-driven/schema.yaml` - Add `test-plan` after `execution-plan`; make default apply readiness require `test-plan` while still tracking progress from `tasks.md`.
- `schemas/spec-driven/templates/test-plan.md` - Add the test matrix and hardening record template.
- `schemas/spec-driven/templates/execution-plan.md` - Clarify that red tests drive implementation and that broad post-diff hardening belongs in `test-plan.md`.
- `src/core/templates/workflows/apply-change.ts` - Add the post-task Test Hardening phase and update completion messaging.
- `src/core/templates/workflows/propose.ts`, `continue-change.ts`, `ff-change.ts`, and `onboard.ts` - Mention `test-plan.md` in schema-aware artifact flow where appropriate.
- `src/commands/schema.ts` - Support `test-plan` in schema init defaults and dependencies.
- `docs/workflows.md`, `docs/commands.md`, and `docs/getting-started.md` - Update user-facing workflow docs so apply completion includes Test Hardening, not only task completion.
- Tests under `test/commands/`, `test/core/artifact-graph/`, and `test/core/templates/` - Cover artifact ordering, apply readiness/context, template content, generated workflow text, and schema init support.
