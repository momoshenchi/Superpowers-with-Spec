## Why

The current subagent-driven development workflow treats every individual task as an agent assignment and runs a specification-compliance review followed by a code-quality review after each one. In generated changes, however, `tasks.md` commonly decomposes work into small numbered items such as `1.3`. This makes agents and reviews operate at an unnecessarily fine grain, consuming time and effort without improving cross-component integration.

The workflow needs to distinguish detailed implementation items from independently owned work packages. A work package should be a substantial, coherent unit that may contain several numbered tasks, be assigned to one subagent, be combined with other packages for a single subagent, or be completed sequentially by the main agent. Review should happen once after all work packages are integrated, when interactions between packages can be assessed.

## What Changes

- Change the default `tasks.md` convention so each top-level agent/work-package block owns a coherent delivery area and contains its existing fine-grained numbered checkbox tasks.
- Define `# <number>. agent<id> — <scope>` headings as logical work-package labels, not mandatory one-to-one subagent assignments. The coordinating agent may assign one or more blocks to a subagent, or execute every block itself.
- Move subagent coordination guidance into `execution-plan.md`: package ownership, dependencies, safe parallelism, handoff/integration order, final verification, and the Step 1–5 execution sequence for every detailed task in each work package.
- Replace the per-task two-stage review process with worker self-review and verification during implementation, followed by one cross-package integration review and full validation after all work packages are complete.
- Remove generated guidance that forces every execution step to take 2–5 minutes or inserts an independent review gate between individual implementation actions; retain task-level Step 1–5 execution detail in `execution-plan.md`.
- Keep proposal and design artifacts focused on requirements and technical design; do not add coordination-specific sections to them.

## Capabilities

### New Capabilities

- `subagent-work-package-execution`: Defines how a change plan represents logical work packages, how a coordinator may allocate them to subagents or itself, and when integrated review occurs.

### Modified Capabilities

- `cli-artifact-workflow`: Default `tasks.md` and `execution-plan.md` generation guidance changes so progress remains itemized while coordination is based on work-package blocks.
- `schema-init-command`: Scaffolded task and execution-plan templates reflect the work-package convention.

## Impact

- Subagent workflow and review guidance:
  - `skills/subagent-driven-development/`
  - `skills/requesting-code-review/`
- Default schema instructions and templates:
  - `schemas/spec-driven/schema.yaml`
  - `schemas/spec-driven/templates/tasks.md`
  - `schemas/spec-driven/templates/execution-plan.md`
  - `schemas/spec-driven/templates/test-plan.md`
- Schema initialization fallback templates in `src/commands/schema.ts`.
- Generated proposal, onboarding, and apply workflow text in `src/core/templates/workflows/propose.ts`, `src/core/templates/workflows/onboard.ts`, and `src/core/templates/workflows/apply-change.ts`.
- Tests and generated-template assertions for the changed task and execution-plan instructions.
- The change applies to the default `spec-driven` change workflow and its subagent/review skills. `writing-plan/SKILL.md` is intentionally out of scope and may retain its separate handoff convention.
