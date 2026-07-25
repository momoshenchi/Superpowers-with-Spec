## Context

The default spec-driven workflow separates a compact progress list in `tasks.md` from detailed execution guidance in `execution-plan.md`. The subagent-driven development skill currently gives a different meaning to "task": it dispatches one fresh subagent for every task and requires two sequential reviews after it. In practice, task lists contain granular items such as `1.3`, which are useful progress markers but poor boundaries for ownership, context, review, or integration.

This change aligns the task tracker, execution guidance, and subagent workflow around coherent work packages while preserving detailed checkbox progress.

## Goals / Non-Goals

**Goals:**

- Make a top-level agent/work-package block the unit of dispatch and handoff.
- Retain detailed numbered checkbox tasks within each work package for transparent progress tracking.
- Let the coordinator choose whether and how to use subagents without changing the task-list structure.
- Replace repeated local reviews with one final review of the fully integrated change.
- Keep proposal and design artifacts focused on product requirements and technical design.
- Keep the standalone `writing-plan/SKILL.md` behavior outside this change's scope.

**Non-Goals:**

- Require a fixed number of subagents or bind a work-package label to a particular agent instance.
- Change the task-progress parser or add a new workflow artifact.
- Change `writing-plan/SKILL.md`.
- Permit parallel implementation where work packages overlap in files or unresolved dependencies.

## Decisions

### Use nested task-list structure for work packages

`tasks.md` will use `# <work-package-number>. agent<logical-id> — <scope>` headings with detailed `- [ ] <work-package-number>.<task-number> <description>` checkbox tasks below them. The heading is the coordination boundary; the checkboxes remain the progress and completion evidence. This keeps the existing parser and its granular reporting useful without treating every checkbox as a separate delegation.

Using only one checkbox per work package was rejected because it loses visibility into partial progress and makes recovery from an interrupted worker harder. Keeping the current flat list was rejected because it cannot convey the scope that a worker owns.

For an existing flat list, the subagent workflow will safely treat all incomplete items as one sequential work package. It will not rewrite an existing change folder solely to introduce headings.

### Keep coordination in execution plans

`execution-plan.md` will contain package ownership, dependencies, safe parallelism, integration order, and final validation. It will also expand every detailed task inside each task-list block into Step 1–5 execution guidance. `tasks.md` remains the completion tracker, while the execution plan remains the detailed implementation guide. Proposal and design templates remain structurally unchanged.

Putting coordination in proposal or design was rejected because staffing and dispatch mechanics are execution concerns, not requirements or technical architecture. The execution plan repeats detailed task identifiers and execution guidance, but not their completion state, so it does not create a second source of truth for progress.

### Review the integrated change once

Workers remain responsible for local tests and self-review. After every work package is integrated, the coordinator performs one review that covers requirements, interaction boundaries, implementation quality, test coverage, and full validation. The current per-task specification and code-quality review sequence is removed. If that review finds a blocking issue, the coordinator fixes it and runs targeted verification; it does not start a second complete review unless the reviewer explicitly requests confirmation of that specific issue.

Reviewing each numbered checkbox was rejected because most checkboxes are implementation steps rather than independently reviewable deliverables. Removing all review was rejected because cross-package defects are only visible after integration.

### Permit only planned safe parallelism

An execution plan will identify owned files, dependencies, and parallel eligibility for each work package. Packages sharing files or relying on unintegrated interfaces execute sequentially. Disjoint packages may be dispatched in parallel through isolated workspaces; the coordinator remains responsible for integration.

Allowing unconstrained parallel dispatch was rejected because concurrent edits to shared files create avoidable conflicts and obscure ownership.

## Risks / Trade-offs

- [Risk] A work package can become too broad for a worker to complete reliably. → Mitigation: require each block to have a coherent boundary, explicit files, verification, and a meaningful independently reportable outcome.
- [Risk] Deferring review hides defects until later. → Mitigation: retain worker self-review and targeted verification, then require a final review of requirements and interactions before completion.
- [Risk] Generated templates and standalone skills drift. → Mitigation: update templates, schema instructions, fallback templates, and relevant generated-output assertions together.
- [Risk] Parallel workers conflict despite a plan. → Mitigation: declare ownership and dependencies in the execution plan; serialize any overlapping package.

## Migration Plan

1. Add regression coverage for the work-package task template, coordination-aware execution plan, schema-init fallback templates, and final-review guidance.
2. Update the subagent-driven development and review prompts to dispatch whole blocks and defer review until integration.
3. Update default schema templates, instructions, and schema-init fallbacks.
4. Update affected generated-template assertions and run targeted tests followed by the full suite.

Rollback consists of restoring the previous task and execution-plan templates and the previous subagent review guidance; existing change folders remain readable because checkbox parsing is unchanged.

## Open Questions

None. A coordinator retains discretion to combine logical work packages, dispatch them separately, or execute them inline.
