# 1. Design Verify After capture and report

## Skill, command, and apply-delegated copy

- [x] 1.1 Extend `src/core/templates/workflows/design-verify.ts` so UI scope captures After under `attachments/visual-diff/after/` using `path.join` guidance, consumes runtime and illustrative Before (unexplained images are not Before; both kinds default to runtime with supplemental illustrative unless an artifact overrides), presents a per-route/state visual-diff table including mixed missing rows, records Before summary `present|mixed|missing`, After-only without failing or blocking, forbids second-worktree / merge-base checkout reconstruction, and keeps DESIGN.md and runtime `blocked` rules.
- [x] 1.2 Extend the Design verify bullet in `getFinalQualityGateInstructions()` so an apply-delegated worker follows the same After capture, Before consumption, After-only fallback, and non-reconstruction rules. Do not add a fifth Final Quality Gates row.
- [x] 1.3 Add focused template-parity assertions that pin After path, `Before: missing`, `runtime`/`illustrative` kinds, `path.join`, forbidden reconstruction phrases, unchanged four-gate table, and that screenshots still do not complete Manual Coverage.

# 2. Apply-start runtime Before capture

## Capture window

- [x] 2.1 Extend both `/sp:apply` template variants in `src/core/templates/workflows/apply-change.ts` so runtime Before capture runs only while the capture window is `open`: predicted UI (artifacts + explicit suffix list), this invocation has not implemented yet, and UI-baseline evidence holds (`git diff --name-only` vs merge-base/unstaged/staged plus `git status --porcelain` contain no paths at all). Any dirty or committed change, including template/non-suffix UI, closes the window. Reused worktrees default `closed` unless that evidence holds; ambiguous merge-base is `closed`. Write `attachments/visual-diff/before/` with `path.join`. Named routes are the artifact union; if none, capture the documented entry once and record the limitation. Missing runtime at capture time continues implementation and does not block apply.
- [x] 2.2 Add focused apply-template parity assertions for the fail-closed capture window, reused-worktree closed default, suffix-list lookup, named-route union and documented-entry fallback, `path.join`, non-blocking capture failure, unexplained attachments are not Before, runtime/illustrative precedence, and no second-worktree reconstruction.

# 3. Docs, hashes, and validation

## User-facing description and regression safety

- [x] 3.1 Update `docs/commands.md` `/sp:design-verify` and `docs/workflows.md` apply/design-verify text to describe Before/After attachments, human illustrative Before, and After-only when Before is missing. Do not document a fifth gate or `/sp:visual-diff`.
- [x] 3.2 Refresh skill-template parity hashes/snapshots after Units 1–2 integrate; keep Windows-safe `path.join` expectations in tests (no hardcoded slash assertions for filesystem joins).
- [x] 3.3 Run focused template/docs tests, then `pnpm run build`, `pnpm run lint`, and the full test suite; record Test Hardening and final quality-gate evidence in `test-plan.md`.
