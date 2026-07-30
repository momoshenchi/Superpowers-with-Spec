## Why

Change `design.md` files often read as decision dumps: background may be rich, but readers (engineers and agents) still cannot see the technical starting point, how the work hangs off existing code, which contracts are stable, or why a major fork was chosen. Explore already nudges “2–3 approaches,” and review asks for alternatives, but templates and instructions do not force a navigable current-system slice, reuse pointers, contract anchors, scale-aware option comparison, or a clean split between change `design.md` and a repo visual `DESIGN.md` (google-labs design.md format).

This change tightens **schema design template/instruction**, **explore handoff**, and **change-review** checks only—so proposed changes become implementable without expanding docs/onboard or adding CLI structural validation.

## What Changes

- Expand the default `design.md` template and schema instruction with:
  - required `## Current system` (short allowed; no `(as-is)` suffix)
  - `### Relationship to existing tech` with reuse/extend/replace/boundary relations and **pointers**
  - required `## Contracts` (API/CLI, states, errors; `N/A` when no surface change)
  - scale-aware Decisions: major decisions record ≥3-option comparison tables; minor decisions need rationale only
  - visual `DESIGN.md` discovery/citation rules for UI-facing work (not engineering living docs, not ADRs)
- Update explore workflow text so major-feature exploration diverges ≥3 options and design converges with comparison + choice.
- Update change-review (repo skill + generated workflow template) to check the new sections and rules without failing non-UI or minor-detail changes for ceremony.
- Sync schema-init / fallback design template strings so new schemas get the same skeleton.
- Keep scope to convention sources agents already read when proposing/reviewing; no new artifact types, no `applyRequires` changes, no `@google/design.md` runtime dependency.

## Capabilities

### New Capabilities
- `change-design-conventions`: Normative conventions for change-local `design.md` content quality—Current system, Relationship pointers, Contracts, major vs minor decision comparison, and visual `DESIGN.md` handling relative to change design.

### Modified Capabilities
- `sp-change-review-skill`: Proposal review criteria cover Current system, Relationship pointers, Contracts when surfaces change, scale-aware major-decision comparisons, and UI/visual `DESIGN.md` citation or update expectations when applicable.

## Impact

- Schema sources:
  - `schemas/spec-driven/templates/design.md`
  - `schemas/spec-driven/schema.yaml` (design artifact `instruction`)
  - `src/commands/schema.ts` fallback design template
- Workflow / review sources:
  - `src/core/templates/workflows/explore.ts`
  - `src/core/templates/workflows/change-review.ts`
  - `skills/change-review/SKILL.md` (repo-local rendering; keep parity with generated template)
- Tests that snapshot or assert design template / review / explore strings and schema-init fallbacks.
- **Non-impact:** CLI artifact graph, validate structural parsers, applyRequires, archive merge, onboard long-form docs, engineering living-design (`docs/detailed_doc`) mandates, ADR workflow, bundling `@google/design.md`.

## Success criteria (for readers of this proposal)

- A stranger can open a new change’s `design.md` and answer: where we start, what we reuse (with pointers), what contracts matter, and why major options lost.
- UI changes that have a repo `DESIGN.md` are expected to cite it; visual token truth stays in `DESIGN.md`, not pasted into change design.
- Minor local decisions are not forced through three fake alternatives.
