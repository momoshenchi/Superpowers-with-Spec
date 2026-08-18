## Why

Apply 完成后，前端改动只对照仓库 `DESIGN.md`，操作者看不到改前/改后画面，难以判断该继续改还是合并。需要在现有 Design Verify 门里给出可检视的对照包，而不是再加一门质量门。

## What Changes

- Extend `/sp:apply` so that, once the isolated worktree exists and **before any UI implementation edit**, it captures runtime Before screenshots for predicted UI scope and writes them under the change's `attachments/`.
- Treat human-provided status-quo images already referenced under `attachments/` as Before, labeled illustrative.
- Extend `/sp:design-verify` so a UI-scoped run captures After screenshots into `attachments/`, presents Before/After when Before exists, and still evaluates repository `DESIGN.md` conformance.
- When no Before exists (apply resumed after UI edits, capture window missed, and no human Before attachment), capture After only, record `Before: missing`, and do **not** fail, block, or reconstruct old code via a second worktree.
- Missing Before does not block archive. Missing runtime/browser/`DESIGN.md` for UI scope keeps today's `blocked` rules.
- Screenshots remain inspectable evidence; they still do not replace Manual Coverage execution.

## Capabilities

### New Capabilities

- `design-verify-visual-diff`: Before/After screenshot protocol spanning apply-start capture, human `attachments/` Before, Design Verify After capture and report, After-only fallback, and attachment path/label rules.

### Modified Capabilities

None. `superpowers/specs/` has no `sp-design-verify-skill` master spec; this change introduces the visual-diff contract as a new capability rather than a delta against an unsynced archived spec.

## Attachments

None.

## Impact

- Generated skill/command text in `src/core/templates/workflows/design-verify.ts` and `src/core/templates/workflows/apply-change.ts` (and the shared final-quality-gates copy of Design Verify behavior if the same contract is inlined there).
- User-facing `docs/commands.md` and `docs/workflows.md` Design Verify / Apply completion description.
- Template-parity and instruction-string tests (hashes and required phrases).
- Reuses existing `attachments/` directory convention; no new schema artifact, CLI command, or runtime screenshot engine.
- Superpowers itself has no product UI; this change's own Design Verify remains scope-backed `not applicable`.
