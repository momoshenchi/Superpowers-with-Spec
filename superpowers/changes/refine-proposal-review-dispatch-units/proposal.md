## Why

Proposal review currently forces a full re-review after every repair, including non-blocking WARNINGs, which slows `/sp:propose` without improving implementability. At the same time, the coordination model still uses the awkward term `work package` and `agentN` headings, which obscure the real intent: a coherent unit that a coordinator may dispatch to a worker/subagent, combine, or execute inline. The execution-plan template also nests code-wrapped headings such as `### \`# 1. agent1 — [scope]\``, which is hard to read and couples formatting to `tasks.md` text.

## What Changes

- Change automatic proposal review so only unresolved **BLOCKER** findings require repair + re-review before readiness.
- Treat **WARNING** findings as recommended repairs that do not block readiness and do not trigger a second full proposal review after repair.
- Keep **SUGGESTION** findings visible and non-blocking.
- Rename the coordination unit from **work package** to **dispatch unit**, preserving assignable-worker semantics.
- Change default `tasks.md` headings from `# <n>. agent<logical-id> — <scope>` to pure scope form `# <n>. <scope>`.
- Move allocation guidance into the `execution-plan.md` **Dispatch Coordination** table via an **Assignee policy** column.
- Replace nested code-wrapped execution-plan headings with clean `### <n>. <scope>` headings.
- Update generated propose/apply/onboard/review guidance, root skills, schema instructions/templates, schema-init fallbacks, and contract tests to match.
- Accept legacy `# <n>. agent...` task lists during apply/review without forcing rewrite of historical changes.

## Capabilities

### New Capabilities

- `dispatch-unit-execution`: Defines dispatch units as the assignable implementation boundary, pure-scope task headings, coordination-table assignee policy, and clean execution-plan heading format.
- `sp-change-review-skill`: Defines schema-aware proposal review, the report-before-repair loop, blocker-gated re-review, ephemeral review behavior, and dispatch-unit-aware review criteria.

### Modified Capabilities

- `cli-artifact-workflow`: Default `tasks` / `execution-plan` generation and instructions use the dispatch-unit convention instead of work-package/`agentN` labels.
- `schema-init-command`: Scaffolded `tasks` and `execution-plan` templates match the dispatch-unit format.
- `sp-onboard-skill`: Onboarding language describes dispatch units and blocker-only proposal re-review.

## Impact

- Proposal review skill and generated workflow:
  - `skills/change-review/SKILL.md`
  - `src/core/templates/workflows/change-review.ts`
  - `src/core/templates/workflows/propose.ts`
- Subagent/dispatch guidance:
  - `skills/subagent-driven-development/**`
  - `skills/requesting-code-review/**`
- Default schema and templates:
  - `schemas/spec-driven/schema.yaml`
  - `schemas/spec-driven/templates/tasks.md`
  - `schemas/spec-driven/templates/execution-plan.md`
  - `schemas/spec-driven/templates/test-plan.md` (terminology only if present)
- Schema init fallbacks:
  - `src/commands/schema.ts`
- Apply/onboard generated text:
  - `src/core/templates/workflows/apply-change.ts`
  - `src/core/templates/workflows/onboard.ts`
- Contract/parity tests under `test/core/` and `test/commands/`
- No runtime CLI command surface change; this is guidance/template/spec behavior.
