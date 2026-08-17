## Why

`/sp:simplify` can only apply behavior-preserving local cleanup, and final quality gates check correctness, tests, and visual UI. After a change is implemented, nothing reviews whether the result is cut, named, and wired at the right seams. Teams currently either skip that look or fold it into simplify, which is forbidden from touching public contracts and architecture.

## What Changes

- Add a generated custom-profile workflow `/sp:shape-review` (skill `superpowers-shape-review`) that read-only reviews Surface, Boundaries, Model, and Composition, then reports modification suggestions.
- Keep the five-workflow core profile unchanged (`propose`, `explore`, `review`, `apply`, `archive`). `/sp:shape-review` is selectable in a custom profile like `/sp:simplify` and `/sp:design-verify`.
- After `/sp:apply` finishes every applicable final quality gate, always invite `/sp:shape-review` next to the existing `/sp:archive` prompt. The invitation is optional, never a fifth gate, and never blocks archive.
- Embed the shape-review contract in apply so a core-profile session can honor the invitation in the same conversation even when the standalone command is not installed.
- When the user accepts suggestions in the same session after apply, expand the current change in place, withdraw the archive recommendation, and continue apply (re-running gates after implementation changes). When they accept suggestions in a new session, create a new change instead.

## Capabilities

### New Capabilities

- `sp-shape-review-skill`: Cross-tool `/sp:shape-review` workflow with four-angle read-only review, suggestion routing, and report contract.
- `apply-shape-review-invitation`: Apply-completion invitation, embedded same-session contract, and archive-non-blocking behavior.

### Modified Capabilities

None.

## Attachments

None.

## Impact

- New workflow template `src/core/templates/workflows/shape-review.ts` plus registration in skill/command generation, profiles, init/update/migration, drift detection, and command metadata.
- `/sp:apply` completion text and embedded invitation contract in `src/core/templates/workflows/apply-change.ts`.
- User-facing `docs/commands.md`, `docs/workflows.md`, and `docs/supported-tools.md` (custom workflow/skill lists).
- Generation, template-parity, profile, init/update, and adapter tests.
- No new runtime dependency, schema artifact, or CLI lifecycle state.
- Stacks with in-progress registry/template changes (`unify-template-generation-pipeline`, `add-tool-command-surface-capabilities`, `add-global-install-scope`) and with apply-completion text from `bound-quality-gate-retries`: rebase so `shape-review` remains an explicit workflow ID in every name-based registry and the invitation copy lands on the current apply completion paragraph.
