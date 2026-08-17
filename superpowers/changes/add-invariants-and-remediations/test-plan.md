## Testing Gap Analysis

Worker-level tests covered template section order, schema instruction wording, and Apply/Verify/Review string contracts via `design-conventions.test.ts`, `invariants-remediations.test.ts`, and updated parity hashes. Harden also confirmed remediations lifecycle wording (omit/N/A, P0 Guard, Design Verify/P2 exclusion, change-dir discovery), Invariants N/A vs missing heading, and that `applyRequires` still excludes remediations. Strengthened shape-review content assertions that were stale on this branch (Phase -0 / Gather the diff) so parity could lock new Apply/Verify/Review hashes. No browser E2E applies.

## Requirement And Scenario Coverage Matrix

| Requirement / Scenario | Planned Coverage | Status | Notes |
| --- | --- | --- | --- |
| Design template requires Invariants: Template skeleton lists Invariants | unit | covered | `design-conventions.test.ts` |
| Design template requires Invariants: N/A invariants allowed | unit | covered | `N/A — no cross-path invariants` |
| Invariants falsifiable: Invariant row is reviewable | unit | covered | template falsify/owner-check guidance |
| Design instruction mandates Invariants: Instruction no longer forbids Invariants | unit | covered | schema.yaml instruction |
| Change review checks Invariants: Missing heading BLOCKER | unit | covered | change-review + design-conventions |
| Change review checks Invariants: N/A passes presence | unit | covered | change-review strings |
| Remediations file records repairs: First accepted P0 creates file | unit | covered | FQG remediations block |
| Remediations file records repairs: Additional P1 appends | unit | covered | create or append wording |
| Remediations file records repairs: Zero repairs may omit | unit | covered | omit / N/A line |
| Each remediation compares multiple fixes: Multi-solution mandatory | unit | covered | ≥2 Solutions + Choice + Rationale |
| Each remediation compares multiple fixes: Clone solutions insufficient | unit | covered | FQG incomplete clone wording |
| Remediation entries root cause/fix/guard/evidence: P0 requires guard | unit | covered | apply + verify |
| Remediation entries: Evidence accompanies resolution | unit | covered | remediations template |
| Remediations not applyRequires: Propose without file | unit / manual | covered | status JSON + schema apply.requires |
| Next gate rounds consume remediations: Retry Verify reads file | unit | covered | verify-change |
| Next gate rounds: Gate row may cite R-id | unit | covered | `Remediation: R#` |
| Remediations template available: Template lists required fields | unit | covered | `invariants-remediations.test.ts` |
| Remediations file records repairs: Design Verify or P2 alone does not require remediations | unit | covered | FQG exclusion |
| Next gate rounds: Missing from contextFiles still discovered | unit | covered | change-dir probe |
| Verify coherence: Soft design drift without owner-check failure | unit | covered | WARNING-only soft drift |
| Verify coherence checks Invariants: Broken invariant reported | unit | covered | CRITICAL / P0-equivalent |
| Verify coherence: N/A skips checklist | unit | covered | verify-change |
| Verify retry reads remediations: Missing guard incomplete | unit | covered | verify-change |
| Verify retry: Absent file on first Verify | unit | covered | verify-change |

## Boundary And Abnormal Case Sweep

| Surface | Cases To Attack | Coverage Decision | Status |
| --- | --- | --- | --- |
| Inputs and validation | Empty Invariants (no rows, no N/A); clone remediation solutions | unit string contracts + review BLOCKER/WARNING text | covered |
| State and repeat actions | Second P1 append; Verify retry with existing remediations | apply/verify instruction coverage | covered |
| Permissions and ownership | Coordinator vs read-only gate workers writing remediations | apply Repair ownership text (coordinator writes) | covered |
| Filesystem and paths | `remediations.md` under change dir; template path via `path.join` in tests | unit tests use `path.join` | covered |
| External and integration points | Host cannot launch subagent (existing blocked behavior) | not applicable — unchanged | not applicable |

## Non-Critical Path Sweep

| Path | Why It Matters | Coverage / Rationale |
| --- | --- | --- |
| Docs-only P1 still needs ≥2 solutions | Avoid rubber-stamp single patches | apply multi-solution rule applies to P1 |
| Optional Final Gates `R#` link omitted | Must not fail when link column unused | optional language in apply text |
| SDD skill updated with remediations mention | Keep Apply repair ownership discoverable | `skills/subagent-driven-development/SKILL.md` (+ mirrors) |

## Manual Coverage

| Check / Scenario | Execution Method and Environment | Status | Evidence |
| --- | --- | --- | --- |
| After templates land: `superpowers status --change add-invariants-and-remediations --json` shows `applyRequires` still only `test-plan` and does not list remediations as required | CLI in repo checkout | passed | `applyRequires: ["test-plan"]`; artifacts list has no remediations; file absent OK |
| Spot-read generated Apply skill projection contains remediations create/append rules | Read generated/parity skill file after sync | passed | `.cursor/skills/superpowers-apply-change/SKILL.md` and `.codex/...` contain Remediations (`remediations.md`) create-or-append block |

## Deferred Coverage

| Gap | Reason for deferral | Follow-up / safer alternative |
| --- | --- | --- |
| Structural CLI validate fails on missing `## Invariants` | Out of scope (convention + review first) | Future validate enhancement if needed |
| Live multi-agent Final Gates dry-run exercising remediations creation | High cost; instruction tests cover contract | Exercise on next real Apply that accepts a P0/P1 |

## Test Hardening Record

| Area | Result | Evidence |
| --- | --- | --- |
| Focused template/parity tests | passed | `design-conventions` 7/7, `invariants-remediations` 5/5, `skill-templates-parity` 14/14 |
| `pnpm run build` | passed | `node build.js` OK |
| `pnpm run lint` | passed | `eslint src/` clean |
| `pnpm test` canonical suite | passed with isolated baseline failure | 78 passed / 1 failed files; 1464 passed / 1 failed tests. Failure: `test/core/debug-investigation-checkpoint-guidance.test.ts` expects `diagnostic rereads` in `skills/using-superpowers/SKILL.md` — pre-existing on branch, not in this change's owned diff; reproduces without our template edits. Owned-path focused suites all green. |
