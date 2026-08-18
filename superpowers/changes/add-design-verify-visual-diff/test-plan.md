## Testing Gap Analysis

Existing Design Verify and apply parity tests pin DESIGN.md conformance, four final quality gates, Manual Coverage non-substitution of screenshots, and attachment discovery. They do **not** pin Before/After attachment paths, apply-start capture window, `runtime` vs `illustrative` Before kinds, `Before: missing` After-only fallback, or a ban on second-worktree reconstruction.

Worker-level tests in Units 1–2 add those instruction-string pins. Test Hardening re-runs the integrated parity file plus build and lint after all units land. This change has no product UI; browser Manual Coverage is scope-backed `not applicable`. Critical Path is generated skill/command text.

## Requirement And Scenario Coverage Matrix

| Requirement / Scenario | Planned Coverage | Status | Notes |
| --- | --- | --- | --- |
| Apply Captures Runtime Before: Capture window is open for predicted UI | unit | passed | parity: UI-baseline evidence, `attachments/visual-diff/before/` |
| Apply Captures Runtime Before: Reused worktree with UI already changed is closed | unit | passed | parity: reused worktree defaults `closed` |
| Apply Captures Runtime Before: Capture window is fail-closed when evidence is ambiguous | unit | passed | parity: unknown merge-base → `closed` |
| Apply Captures Runtime Before: Non-UI change skips Before capture | unit | passed | parity: skip when artifacts and suffix list show no UI |
| Apply Captures Runtime Before: Before runtime is unavailable at apply start | unit | passed | parity: continue implementation, do not block apply |
| Apply Captures Runtime Before: Capture uses platform-neutral attachment paths | unit | passed | parity: `path.join`; Markdown targets `attachments/visual-diff/before/` |
| Apply Captures Runtime Before: Named routes are the capture set | unit | passed | parity: union of artifact-named routes |
| Apply Captures Runtime Before: No named routes uses documented entry | unit | passed | parity: documented entry once + limitation |
| Human Attachment Images: Proposal references a status-quo screenshot | unit | passed | parity: explained `attachments/` image is `illustrative` |
| Human Attachment Images: Unexplained attachment is not Before | unit | passed | parity: unexplained image is not Before |
| Human Attachment Images: Runtime and illustrative Before both exist | unit | passed | parity: default `runtime`, supplemental illustrative, artifact override |
| Design Verify Captures After: UI scope captures After | unit | passed | parity: `attachments/visual-diff/after/` |
| Design Verify Captures After: Non-UI scope does not capture After | unit | passed | parity: `not applicable` without After capture |
| Design Verify Captures After: After capture uses platform-neutral paths | unit | passed | parity: `path.join` + Markdown `attachments/visual-diff/after/` |
| Presents Before And After: Before exists and After is captured | unit | passed | parity: visual-diff table columns |
| Presents Before And After: Mixed routes some with Before and some without | unit | passed | parity: Before summary `mixed`; per-row missing |
| Presents Before And After: New route has no prior UI | unit | passed | parity: `route did not exist` or `missing`; still capture After |
| Missing Before Is After-Only: Apply resumed after UI edits with no Before | unit | passed | parity: After-only, `Before: missing`, not failed/blocked |
| Missing Before Is After-Only: Missing Before does not reconstruct old code | unit | passed | negative pin: no second worktree / merge-base checkout |
| Missing Before Is After-Only: Missing Before does not block archive | unit | passed | four-row FQG table; missing Before is not `BLOCKER` |
| Existing Blockers: UI change cannot run at Design Verify | unit | passed | existing + retained `blocked` on missing runtime |
| Existing Blockers: UI change lacks visual DESIGN.md | unit | passed | existing `blocked` sentence retained |
| Existing Blockers: Screenshots are not Manual Coverage proof | unit | passed | visual-diff images do not complete a manual row |

## Boundary And Abnormal Case Sweep

| Surface | Cases To Attack | Coverage Decision | Status |
| --- | --- | --- | --- |
| Inputs and validation | Unexplained attachment; empty route list; non-UI suffix-only repo | unit: skip / not-Before / default `/` limitation wording | passed |
| State and repeat actions | Apply resume after UI edits; reused dirty worktree; ambiguous merge-base | unit: closed window → After-only; fail-closed | passed |
| Permissions and ownership | Attachment path escape `attachments/../` | reuse existing attachment containment tests; no new writer | not applicable |
| Filesystem and paths | Windows vs POSIX joins for `attachments/visual-diff/...` | unit: `path.join` guidance; Markdown forward-slash targets | passed |
| External and integration points | Missing browser at apply start vs at Design Verify | unit: apply continues; Design Verify still `blocked` without runtime | passed |

## Non-Critical Path Sweep

| Path | Why It Matters | Coverage / Rationale |
| --- | --- | --- |
| Docs-only description of After-only | Operators must not think a fifth gate exists | Task 3.1 grep; no runtime |
| Hash refresh for untouched templates | Prevent accidental extra template edits | Task 3.2 hash map |
| Illustrative-as-source-of-truth override | Rare; must not silently drop human images | unit string pin in Design Verify |

## Manual Coverage

| Check / Scenario | Execution Method and Environment | Status | Evidence |
| --- | --- | --- | --- |
| Runtime UI / browser journey for this repository | not applicable — Superpowers has no product UI route | not applicable | Instruction-only change; no rendered app. No agent-browser Critical Path exists here. |
| Critical Path: Design Verify After capture + missing-Before After-only | cli; `pnpm exec vitest run test/core/templates/skill-templates-parity.test.ts` | passed | 17/17 parity tests passed after implementation |
| Critical Path: Apply Before capture window + non-blocking failure | cli; same Vitest file | passed | Same run; apply capture-window assertions passed |

## Deferred Coverage

| Gap | Reason Deferred | Safer Alternative / Follow-Up |
| --- | --- | --- |
| Live Before/After screenshots in a consuming frontend app | This repository has no product UI, credentials, or documented app runtime to drive | First UI change in a consuming project after merge; instruction pins are the contract |
| Pixel-diff / Playwright screenshot baselines | Explicit non-goal | Consuming projects may add their own E2E snapshots later |
| Second-worktree reconstruction | Explicitly rejected | After-only fallback |

## Test Hardening Record

**Canonical non-visual suite:** `pnpm run build`, `pnpm run lint`, `pnpm test` from `package.json` and `.github/workflows/ci.yml`. Visual-only checks excluded: none in this repo.

| Command | Outcome | Evidence |
| --- | --- | --- |
| `pnpm run build` | passed | Build completed successfully |
| `pnpm run lint` | passed | eslint src/ clean |
| `pnpm test` | passed with authorized baseline exception | 78 passed / 1 failed files; 1467 passed / 1 failed tests. Failure: `test/core/debug-investigation-checkpoint-guidance.test.ts` expects `diagnostic rereads` in `skills/using-superpowers/SKILL.md` — pre-existing on this branch, not in this change's owned diff. Owned-path focused suites all green. |

Earlier test gaps: Design Verify/apply parity did not pin visual-diff paths, capture window, Before kinds, or After-only. Tests added: three new `it` blocks in `skill-templates-parity.test.ts` plus hash refresh for edited templates (apply, design-verify, and verify because it inlines FQG). Deferrals: live consuming-app screenshots as documented.

## Final Quality Gates

Evaluated after Test Hardening. One fresh worker per gate; P1/P2 repaired in-round without a second code-review pass.

| Gate | Outcome | Fresh worker evidence |
| --- | --- | --- |
| code review | passed (round 1; no P0) | Worker [Code Review](00f3b29e-d373-40ce-9507-765f0fd2cf6e). `pnpm run build` passed; `pnpm run lint` passed; focused parity 22/22 at review time; `pnpm test` 1467/1468 with authorized baseline `diagnostic rereads`. Three P2s accepted and repaired in-round (no remediations.md: P2-only). |
| `/sp:simplify` | passed | Worker [Simplify](2621fccc-e805-45ce-858e-2c7eb4dff075), single-pass four-angle review. Applied: none. Skipped extracting shared Design Verify copy (would change generated instructions) and left a then-stale `docs/workflows.md` baseline sentence as correctness, not cleanup. Coordinator then aligned `docs/workflows.md` and `docs/commands.md` with the in-round P2 capture-window / illustrative contract. Focused parity 17/17. Handoff: Verify round 1. |
| `/sp:verify` | passed (round 1; no CRITICAL) | Replacement [Verify](2a563d4b-a245-4a6a-88b7-75353df4e2eb). Prior [Verify](76d7886c-0248-47b9-a308-561f3ba443ac) connection-failed, round not consumed. Preflight: build 0, lint 0, `pnpm test` 1465/1468 with unowned baseline `diagnostic rereads` plus two unowned 10s flakes that passed in isolation. Manual Coverage 3/3 (UI N/A; two cli Critical Path rows 17/17). Completeness 8/8 tasks, 23/23 scenarios, I1–I5. SUGGESTION 1 accepted (FQG Design verify illustrative triplet/Before path/mixed summary); SUGGESTION 2 skipped (renumber capture as a step would churn generated apply contract); SUGGESTION 3 accepted (negative `BLOCKER` pin). No remediations.md. SUGGESTION repairs do not restart Verify. |
| `/sp:design-verify` | not applicable (round 1; scope-backed) | Worker [Design Verify](86a695d5-8724-47c1-8eb3-65977c6a75d1). Owned paths are `.ts`/`.md`/`.yaml` only; zero UI suffixes; no product runtime; change-local `design.md` is not a visual source. After not captured. Missing repo `DESIGN.md` is not `blocked` because scope is non-UI. Before summary: not applicable. |

### Code review round 1

- **Worker:** [Code Review](00f3b29e-d373-40ce-9507-765f0fd2cf6e)
- **Outcome:** passed
- **P0:** none
- **Accepted P2 repairs (in-round):**
  1. Capture window UI-baseline evidence now requires **no paths at all** (plus empty porcelain), so resumed template/non-suffix UI cannot store After as runtime Before. Spec, design, apply template, and tasks 2.1 aligned.
  2. Illustrative Before qualification now requires the referencing artifact to name source, route or state, and that the file is illustrative (apply + Design Verify templates).
  3. Parity tests pin the full suffix list, `--cached`, `no paths at all`, named-route union, illustrative qualification, and runtime-over-illustrative `source of truth`. Hashes refreshed after the template edits.
- **Targeted validation after repairs:** `pnpm exec vitest run test/core/templates/skill-templates-parity.test.ts` 17/17 passed; `pnpm run build` passed; `pnpm run lint` passed.
- **Remediation:** N/A — no accepted P0/P1 repairs.

### Verify round 1

- **Worker:** [Verify](2a563d4b-a245-4a6a-88b7-75353df4e2eb) (replacement; [Verify](76d7886c-0248-47b9-a308-561f3ba443ac) connection-failed, not a round)
- **Outcome:** passed
- **CRITICAL / WARNING:** none
- **SUGGESTION disposition:**
  1. Accepted — FQG Design verify bullet now includes Before path, illustrative triplet, `source of truth`, and Before summary `mixed`. Parity pins the delegated gate section. Hashes refreshed; focused parity 17/17.
  2. Skipped — numbering the capture block as its own apply step would churn generated apply contract without changing behavior.
  3. Accepted — negative pin `missing Before is \`BLOCKER\``.
- **Retry:** not required (no CRITICAL / failed verification / Manual Coverage failure).

### Design verify round 1

- **Worker:** [Design Verify](86a695d5-8724-47c1-8eb3-65977c6a75d1)
- **Outcome:** not applicable
- **UI scope:** none in this repository (instruction-only templates/docs/tests; no `.html/.css/.tsx` owned paths; `package.json` `dev` is `tsc --watch`)
- **Visual source:** not found; change-local design.md is not the repository visual source
- **Runtime / After:** n/a — not captured
- **Before summary:** not applicable
- **Retry:** not a retry; scope-backed `not applicable` is non-blocking
