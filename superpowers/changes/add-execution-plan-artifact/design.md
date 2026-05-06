## Context

The current `spec-driven` workflow has four artifacts: proposal, specs, design, and tasks. `tasks.md` is intentionally small and checkbox-oriented because several commands use it for progress tracking (`list`, `archive`, and apply instructions). The `writing-plan` skill, however, expects a much richer implementation plan with file mapping, exact commands, expected results, TDD sequencing, and self-review.

This change introduces that richer planning surface as a separate schema artifact instead of changing what `tasks.md` means.

## Goals / Non-Goals

**Goals:**
- Add `execution-plan.md` as a first-class artifact in the default `spec-driven` schema.
- Keep schema-driven artifact discovery as the source of truth for status, instructions, and apply readiness.
- Preserve `tasks.md` as the progress-tracking file.
- Adapt the `writing-plan` guidance into an artifact template that lives inside each Superpowers change.
- Require execution plans to sequence test authoring and test review before production-code implementation.
- Update generated workflow skills and slash commands so agents understand the extra artifact without hardcoding behavior beyond the schema loop.
- Extend schema init scaffolding so custom schemas can opt into `execution-plan`.

**Non-Goals:**
- Replacing `tasks.md` parsing or changing list/archive progress semantics.
- Introducing a new CLI command for execution plans.
- Moving standalone `writing-plan/` skill output into `docs/superpowers/plans/`.
- Implementing a full plan reviewer subagent workflow in this change.

## Decisions

### 1. Add `execution-plan` to the schema, not to ad-hoc workflow code

**Decision:** Add the artifact to `schemas/spec-driven/schema.yaml` with:

```yaml
- id: execution-plan
  generates: execution-plan.md
  description: Detailed implementation plan for executing the change
  template: execution-plan.md
  requires:
    - tasks
```

**Rationale:** The artifact workflow already uses schema metadata for status, dependency resolution, instructions, templates, and apply requirements. Adding the artifact at the schema layer lets existing graph behavior handle readiness and completion.

**Alternatives considered:**
- Add special-case handling to `/sp:apply`: rejected because it would bypass the schema graph and create another place for drift.
- Replace `tasks.md` with the detailed plan: rejected because existing progress tooling depends on checkbox parsing in `tasks.md`.

### 2. Require execution plan for apply while tracking tasks

**Decision:** Change the default schema apply block to:

```yaml
apply:
  requires: [execution-plan]
  tracks: tasks.md
```

**Rationale:** Apply should not begin until the detailed plan exists, but progress should continue to be tracked from the compact checklist. This separates "ready to implement" from "what checkboxes count as progress."

**Alternatives considered:**
- Set `tracks: execution-plan.md`: rejected because the execution plan will contain many nested checkboxes that could distort list/archive task progress.
- Require both `tasks` and `execution-plan` in `apply.requires`: unnecessary because `execution-plan` already depends on `tasks`.

### 3. Adapt `writing-plan` into a change-local template

**Decision:** Create `schemas/spec-driven/templates/execution-plan.md` using the structure and constraints from `writing-plan/SKILL.md`, adjusted so the output path is `superpowers/changes/<name>/execution-plan.md`.

**Rationale:** The standalone skill saves plans under `docs/superpowers/plans/`, but schema artifacts must live under the change directory so status and apply can discover them consistently.

**Alternatives considered:**
- Reference `writing-plan/SKILL.md` directly from schema instructions: rejected because package schemas should be self-contained and generated instructions should include the template content.
- Copy the plan reviewer prompt into the default artifact: rejected for now because it adds process weight without a first-class reviewer workflow.

### 4. Update workflow text but keep the loop schema-driven

**Decision:** Update generated skill/command templates to mention `execution-plan.md` in artifact descriptions and onboarding, while preserving the core loop that reads `superpowers status --json`, `applyRequires`, and artifact instructions.

**Rationale:** The user-facing docs should explain the new artifact, but behavior should continue to come from the schema. This keeps custom schemas viable.

**Alternatives considered:**
- Hardcode execution-plan creation in propose/ff/continue instructions: rejected because custom schemas may omit or rename artifacts.

### 5. Extend schema init defaults explicitly

**Decision:** Add `execution-plan` to `DEFAULT_ARTIFACTS` in `src/commands/schema.ts` and teach dependency/apply generation that it requires `tasks` and becomes the apply requirement when present.

**Rationale:** Schema init is the built-in way to scaffold custom workflows. If the default workflow supports execution plans, custom workflows should be able to opt into the same artifact without manual schema surgery.

**Alternatives considered:**
- Leave schema init unchanged: rejected because the command would advertise only the older common artifact set and make the new pattern harder to reuse.

### 6. Add a mandatory test-review gate before production code

**Decision:** The execution-plan template should require implementers to write the planned tests first, then perform a comprehensive code review of those tests before writing production code. The review should focus on whether tests are comprehensive and thorough: covered requirements, edge cases, negative paths, ordering/dependency behavior, cross-platform path handling, regression risk, and whether assertions would fail for the right reasons.

**Rationale:** This change is itself about making implementation plans more executable. A plan that says "write tests" is not enough; the tests must be reviewed before production code can accidentally conform to incomplete or shallow coverage. The gate preserves TDD pressure and catches missing scenarios while the cost of changing tests is still low.

**Alternatives considered:**
- Review tests after production code: rejected because production implementation can bias the review toward existing behavior instead of requirement coverage.
- Treat test review as an optional recommendation: rejected because the user explicitly wants it as a required step before formal code changes.

## Risks / Trade-offs

**Risk: Existing parity hash tests fail noisily.**
Mitigation: Update parity expectations only after inspecting generated skill and command content, so the hash changes reflect intentional text updates.

**Risk: Apply becomes blocked for existing in-progress changes after the default schema changes.**
Mitigation: This behavior follows the schema's `apply.requires`. Users can create the new artifact with `/sp:continue`, or use a project-local schema if they need the old flow. The implementation should make the missing artifact message explicit.

**Risk: Execution plan checkboxes confuse task progress if parsed accidentally.**
Mitigation: Keep `apply.tracks` as `tasks.md` and leave list/archive progress utilities unchanged.

**Risk: Template content becomes too verbose for agents.**
Mitigation: Keep `tasks.md` compact and put detailed guidance only in `execution-plan.md`. The template can be long because it is requested only when creating that artifact.

**Risk: Test review gate slows small changes.**
Mitigation: Keep the gate focused on test adequacy rather than style. The review should block only coverage gaps, weak assertions, missing negative paths, or tests that would not catch real regressions.

## Migration Plan

1. Add or update tests for schema resolution, status/apply behavior, schema init, generated template content, and generated workflow text.
2. Review the tests comprehensively before production-code changes, blocking on missing coverage or weak assertions.
3. Add schema artifact and template.
4. Update schema init scaffolding to recognize `execution-plan`.
5. Update workflow skill/command text and onboarding references.
6. Run targeted tests first, then the full suite.

Rollback is straightforward: remove the schema artifact/template, restore `apply.requires: [tasks]`, and revert generated workflow text/test expectation changes.

## Open Questions

None for the initial implementation. A future change can decide whether to add an optional plan-review artifact or subagent review workflow.
