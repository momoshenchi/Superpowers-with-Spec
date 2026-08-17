## Testing Gap Analysis

Worker-level tests will assert template section order, schema instruction wording, and Apply/Verify/Review string contracts. Those are necessary but not sufficient: Harden must also confirm remediations lifecycle edge cases (omit vs N/A, P0 without Guard, clone options), Invariants N/A vs missing heading distinctions, and that `applyRequires` still excludes remediations. No browser E2E applies—this change is workflow/template text.

After implementation, strengthen any missing string anchors discovered during parity runs and record canonical suite results below.

## Requirement And Scenario Coverage Matrix

| Requirement / Scenario | Planned Coverage | Status | Notes |
| --- | --- | --- | --- |
| Design template requires Invariants: Template skeleton lists Invariants | unit | planned | `design-conventions.test.ts` section order |
| Design template requires Invariants: N/A invariants allowed | unit | planned | template phrase + review guidance strings |
| Invariants falsifiable: Invariant row is reviewable | unit | planned | template guidance + review WARNING language if asserted |
| Design instruction mandates Invariants: Instruction no longer forbids Invariants | unit | planned | schema.yaml / instruction-loader assertions |
| Change review checks Invariants: Missing heading BLOCKER | unit | planned | change-review template/parity tests |
| Change review checks Invariants: N/A passes presence | unit | planned | change-review strings |
| Remediations file records repairs: First accepted P0 creates file | unit | planned | apply-change instruction strings |
| Remediations file records repairs: Additional P1 appends | unit | planned | apply-change append wording |
| Remediations file records repairs: Zero repairs may omit | unit | planned | apply-change omit/N/A wording |
| Each remediation compares multiple fixes: Multi-option mandatory | unit | planned | apply + remediations template |
| Each remediation compares multiple fixes: Clone options insufficient | unit | planned | apply/review WARNING wording if present |
| Remediation entries root cause/fix/guard/evidence: P0 requires guard | unit | planned | apply + verify incomplete-evidence strings |
| Remediation entries: Evidence accompanies resolution | unit | planned | remediations template + apply |
| Remediations not applyRequires: Propose without file | unit / manual | planned | schema `apply.requires` unchanged; status check |
| Next gate rounds consume remediations: Retry Verify reads file | unit | planned | verify-change strings |
| Next gate rounds: Gate row may cite R-id | unit | planned | apply Final Gates link wording |
| Remediations template available: Template lists required fields | unit | planned | file existence test |
| Remediations file records repairs: Design Verify or P2 alone does not require remediations | unit | planned | FQG/apply exclusion wording |
| Next gate rounds: Missing from contextFiles still discovered | unit | planned | verify/FQG change-dir probe wording |
| Verify coherence: Soft design drift without owner-check failure | unit | planned | verify WARNING (not CRITICAL) wording |
| Verify coherence checks Invariants: Broken invariant reported | unit | planned | verify CRITICAL / P0-equivalent strings |
| Verify coherence: N/A skips checklist | unit | planned | verify-change strings |
| Verify retry reads remediations: Missing guard incomplete | unit | planned | verify-change strings |
| Verify retry: Absent file on first Verify | unit | planned | verify-change strings |

## Boundary And Abnormal Case Sweep

| Surface | Cases To Attack | Coverage Decision | Status |
| --- | --- | --- | --- |
| Inputs and validation | Empty Invariants (no rows, no N/A); clone remediation options | unit string contracts + review BLOCKER/WARNING text | planned |
| State and repeat actions | Second P1 append; Verify retry with existing remediations | apply/verify instruction coverage | planned |
| Permissions and ownership | Coordinator vs read-only gate workers writing remediations | apply Repair ownership text (coordinator writes) | planned |
| Filesystem and paths | `remediations.md` under change dir; template path via `path.join` in tests | unit tests use `path.join` | planned |
| External and integration points | Host cannot launch subagent (existing blocked behavior) | not applicable — unchanged | not applicable |

## Non-Critical Path Sweep

| Path | Why It Matters | Coverage / Rationale |
| --- | --- | --- |
| Docs-only P1 still needs ≥2 options | Avoid rubber-stamp single patches | apply multi-option rule applies to P1 |
| Optional Final Gates `R#` link omitted | Must not fail when link column unused | optional language in apply text |
| SDD skill unchanged if snapshots stable | Avoid drive-by edits | task 2.4 may no-op |

## Manual Coverage

| Check / Scenario | Execution Method and Environment | Status | Evidence |
| --- | --- | --- | --- |
| After templates land: `superpowers status --change add-invariants-and-remediations --json` shows `applyRequires` still only `test-plan` and does not list remediations as required | CLI in repo checkout | planned | |
| Spot-read generated Apply skill projection contains remediations create/append rules | Read generated/parity skill file after sync | planned | |

## Deferred Coverage

| Gap | Reason for deferral | Follow-up / safer alternative |
| --- | --- | --- |
| Structural CLI validate fails on missing `## Invariants` | Out of scope (convention + review first) | Future validate enhancement if needed |
| Live multi-agent Final Gates dry-run exercising remediations creation | High cost; instruction tests cover contract | Exercise on next real Apply that accepts a P0/P1 |

## Test Hardening Record

<!-- Fill during Apply after integration -->

| Area | Result | Evidence |
| --- | --- | --- |
| Focused template/parity tests | planned | |
| `pnpm run build` | planned | |
| `pnpm run lint` | planned | |
| `pnpm test` canonical suite | planned | |
