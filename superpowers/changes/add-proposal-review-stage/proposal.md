## Why

`/sp:propose` can create a complete set of implementation artifacts and immediately advertise the change as ready for `/sp:apply`, even when requirements, technical decisions, work-package boundaries, or test coverage still leave room for conflicting interpretations. The repository already has a `change-review` skill for this pre-implementation audit, but it is neither part of the generated Superpowers workflow nor automatically used after proposal creation.

The default proposal path needs one visible, mandatory-in-practice review pass before implementation begins, without turning review results into a new persisted artifact or adding repeat review cost to `/sp:apply`.

## What Changes

- Introduce a generated `superpowers-change-review` workflow skill and manual `/sp:review <change>` command based on the existing change-review guidance.
- Make `/sp:propose` automatically run the proposal review only after it has created every artifact required for implementation by the selected schema.
- Require the automatic proposal flow to present the complete review report before it edits any proposal artifacts in response to findings; it must then repair all resolvable BLOCKER and WARNING findings, re-run review, and only announce readiness when no unresolved BLOCKER or WARNING remains. SUGGESTION findings remain visible but do not block readiness.
- Keep unresolved user-decision or external-dependency blockers explicit and pause the proposal flow rather than guessing or claiming that the change is ready.
- Keep review ephemeral: do not create `review.md`, do not add a review artifact, do not change schema `applyRequires`, and do not persist an approval status.
- Keep `/sp:apply` free of a second proposal review. It starts implementation from the current artifacts; users may manually invoke `/sp:review` again when they choose.
- Preserve the distinct final integration review after implementation: it evaluates cross-work-package behavior, the integrated diff, and full validation rather than re-auditing proposal completeness.
- Update review criteria and generated workflow guidance to use logical work packages in `tasks.md` and task-level Step 1–5 execution detail in `execution-plan.md`, not the retired micro-task delegation model.

## Capabilities

### New Capabilities

- `sp-change-review-skill`: Provides a schema-aware, pre-implementation change-review workflow that reports proposal completeness, clarity, coherence, and implementability, supports manual invocation, and differentiates blocking findings from warnings and suggestions.

### Modified Capabilities

- `cli-init`: Core-profile setup and updates expose the generated change-review skill and its `/sp:review` command alongside the other available workflows.
- `sp-onboard-skill`: Default workflow guidance explains that a complete proposal is reviewed and repaired before implementation, while preserving the separate post-implementation integration review.

## Impact

- Generated workflow templates and registration:
  - `src/core/templates/workflows/`
  - `src/core/templates/skill-templates.ts`
  - `src/core/shared/skill-generation.ts`
  - `src/core/profiles.ts`
  - workflow/profile synchronization and configuration surfaces
- Existing source review guidance:
  - `skills/change-review/SKILL.md`
- Proposal, apply, continue, onboarding, and generated command wording.
- Init/update/profile and generated-template parity tests, plus new coverage for the automatic proposal-review sequence and its separation from the final implementation review.

No application product behavior, schema artifact graph, `applyRequires` contract, or persisted review-report file is introduced by this change.
