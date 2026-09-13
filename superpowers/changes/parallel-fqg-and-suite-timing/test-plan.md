## Testing Gap Analysis

Worker pins today assert sequential “exactly this order,” always-on Verify preflight, and no complete-suite fail-closed. They do not prove: (1) CR ∥ Simplify ∥ DV spawn; (2) P0 retries stay in-wave; (3) Verify withheld until no P0; (4) full-qa-test before Git-aware; (5) no layer dedup; (6) Apply-FQG Verify reuse on zero diff.

Hardening suite-stage: `ran-git-aware`. Command: `pnpm exec vitest run --changed origin/main`. Baseline: merge-base `origin/main` `bd92646d1ecf5f35f7f87c0d17cb1a84e5ad2c33`. Result: 38 files / 491 tests passed after landing Hardening pins. Verify re-ran the same Git-aware command after Simplify (still 38 files / 491 tests). `pnpm exec tsc --noEmit` passed. `superpowers validate parallel-fqg-and-suite-timing` passed. Two layers not deduped. `full-qa-test` expansion already recorded in this test-plan; unique WHEN/THEN pairs exhausted at batch 1. Extra pin: already-passed CR not re-run + spawn-absent sequential CR/Simplify/DV.

## Test Scope Register

| Object | Requirement | Spec Scenarios to import | Entry Point | Diff Anchor | Risk Hypothesis |
| --- | --- | --- | --- | --- | --- |
| R1 | `Requirement: Apply SHALL run a parallel pre-Verify wave` | Host can spawn three gate workers; Host cannot spawn | `getFinalQualityGateInstructions` | `final-quality-gates.ts` | Sequential “exactly this order” remains |
| R2 | `Requirement: Pre-Verify P0 retries stay in the parallel wave` | Code review P0 while Design verify passed; Code review and Design verify both P0; Round four still P0; Simplify edited UI after Design verify passed on the pre-Simplify snapshot | same | same | Verify starts with CR P0 still open |
| R3 | `Requirement: Verify runs only after the pre-Verify wave is clear` | Three gates clear; Simplify blocked | same | same | Verify listed as a sibling of CR |
| R4 | `Requirement: Hardening SHALL keep two suite layers without dedup` | Related tests overlap registered unit cases | `getCanonicalNonVisualSuiteInstructions` | `final-quality-gates.ts` | One command closes both layers |
| R5 | `Requirement: Hardening SHALL expand full-qa-test before Git-aware` | New unit cases exist before --changed | Apply Hardening | `apply-change.ts` | Git-aware still precedes full-qa-test |
| R6 | `Requirement: Git-aware unavailable SHALL not run the complete suite` | Runner has no Git-aware flags; Related selection empty on instruction-only diff | suite helper | `final-quality-gates.ts` | Complete suite returns as default |
| R7 | `Requirement: Complete suite remains exceptional` | User asks for the complete suite; CI already requires the complete command; Empty selection is not expected and no focused command exists; Ambiguous Git-aware does not authorize complete suite | suite helper | same | `ran-complete-suite-optional` becomes default |
| R8 | `Requirement: Verify suite preflight SHALL reuse unchanged Hardening Git-aware evidence` | Zero implementation diff and unchanged baseline; Simplify changed implementation; Code review or Design verify repair changed implementation; Verify repair changed implementation; Git baseline changed after Hardening; Standalone verify always preflights | Apply FQG Verify + `/sp:verify` | `verify-change.ts`, FQG Verify paragraph | Apply-FQG still always re-runs preflight; CR/DV/Verify repair or baseline change wrongly reuses Hardening |

## Design Contract And Invariant Coverage

| Object | Contract / Invariant | Case IDs | Notes |
| --- | --- | --- | --- |
| R1 | I1 parallel pre-Verify wave | TC-R1-D1-001, TC-R1-D2-001 | |
| R2 | I2 Verify withheld while P0 | TC-R2-D1-001, TC-R2-D4-001 | |
| R4 | I4 no layer dedup | TC-R4-D1-001 | |
| R5 | I3 full-qa before Git-aware | TC-R5-D1-001 | |
| R6 | I5 no default complete suite | TC-R6-D1-001, TC-R7-D1-002 | |
| R8 | I6 Verify reuse + agent-browser | TC-R8-D1-001, TC-R8-D1-002, TC-R8-D1-004, TC-R8-D1-005, TC-R8-D1-006 | |

## Requirement And Scenario Coverage Matrix

| Object | Requirement | Spec Scenario | D1 Case ID | Related Case IDs | Notes |
| --- | --- | --- | --- | --- | --- |
| R1 | Apply SHALL run a parallel pre-Verify wave | Host can spawn three gate workers | TC-R1-D1-001 | TC-R1-D2-001 | |
| R1 | Apply SHALL run a parallel pre-Verify wave | Host cannot spawn | TC-R1-D1-002 | TC-R1-D6-001 | |
| R2 | Pre-Verify P0 retries stay in the parallel wave | Code review P0 while Design verify passed | TC-R2-D1-001 | TC-R2-D4-001 | |
| R2 | Pre-Verify P0 retries stay in the parallel wave | Code review and Design verify both P0 | TC-R2-D1-002 | TC-R2-D4-002 | |
| R2 | Pre-Verify P0 retries stay in the parallel wave | Round four still P0 | TC-R2-D1-003 | TC-R2-D5-001 | |
| R2 | Pre-Verify P0 retries stay in the parallel wave | Simplify edited UI after Design verify passed on the pre-Simplify snapshot | TC-R2-D1-004 | TC-R2-D4-003 | |
| R3 | Verify runs only after the pre-Verify wave is clear | Three gates clear | TC-R3-D1-001 | | |
| R3 | Verify runs only after the pre-Verify wave is clear | Simplify blocked | TC-R3-D1-002 | | |
| R4 | Hardening SHALL keep two suite layers without dedup | Related tests overlap registered unit cases | TC-R4-D1-001 | TC-R4-D2-001 | |
| R5 | Hardening SHALL expand full-qa-test before Git-aware | New unit cases exist before --changed | TC-R5-D1-001 | TC-R5-D2-001 | |
| R6 | Git-aware unavailable SHALL not run the complete suite | Runner has no Git-aware flags | TC-R6-D1-001 | | |
| R6 | Git-aware unavailable SHALL not run the complete suite | Related selection empty on instruction-only diff | TC-R6-D1-002 | | |
| R7 | Complete suite remains exceptional | User asks for the complete suite | TC-R7-D1-001 | | |
| R7 | Complete suite remains exceptional | CI already requires the complete command | TC-R7-D1-003 | | |
| R7 | Complete suite remains exceptional | Empty selection is not expected and no focused command exists | TC-R7-D1-004 | | |
| R7 | Complete suite remains exceptional | Ambiguous Git-aware does not authorize complete suite | TC-R7-D1-002 | | |
| R8 | Verify suite preflight SHALL reuse unchanged Hardening Git-aware evidence | Zero implementation diff and unchanged baseline | TC-R8-D1-001 | TC-R8-D4-001 | |
| R8 | Verify suite preflight SHALL reuse unchanged Hardening Git-aware evidence | Simplify changed implementation | TC-R8-D1-002 | | |
| R8 | Verify suite preflight SHALL reuse unchanged Hardening Git-aware evidence | Code review or Design verify repair changed implementation | TC-R8-D1-004 | TC-R8-D4-002 | |
| R8 | Verify suite preflight SHALL reuse unchanged Hardening Git-aware evidence | Verify repair changed implementation | TC-R8-D1-005 | | |
| R8 | Verify suite preflight SHALL reuse unchanged Hardening Git-aware evidence | Git baseline changed after Hardening | TC-R8-D1-006 | | |
| R8 | Verify suite preflight SHALL reuse unchanged Hardening Git-aware evidence | Standalone verify always preflights | TC-R8-D1-003 | | |

## Six-Dimension Case Matrix

10→10→10 stop: unique instruction WHEN/THEN pairs are the imported scenarios. Batch 1 exhausted unique cases; no batch 2.

### D1 — Requirements and business scenarios

| ID | Object | Source | Scenario Type | Steps | Expected | Form | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TC-R1-D1-001 | R1 | imported: Host can spawn three gate workers | happy path | Spawn CR, Simplify, DV together | None waits on another of the three; Verify not started | unit | passed | Task 2.1 |
| TC-R1-D1-002 | R1 | imported: Host cannot spawn | branch | No spawn | Sequential CR, Simplify, DV; `same-context fallback`; then Verify rules | unit | passed | Task 2.1 |
| TC-R2-D1-001 | R2 | imported: Code review P0 while Design verify passed | branch | CR P0, DV N/A | Repair; CR round 2 only; DV not re-run | unit | passed | Task 2.2 |
| TC-R2-D1-002 | R2 | imported: Code review and Design verify both P0 | branch | Both P0 | Next CR and DV rounds spawned together | unit | passed | Task 2.2 |
| TC-R2-D1-003 | R2 | imported: Round four still P0 | exception | CR round 4 P0 | Gate `failed`; Verify not started | unit | passed | Task 2.2 |
| TC-R2-D1-004 | R2 | imported: Simplify edited UI after Design verify passed on the pre-Simplify snapshot | branch | Simplify edited UI | Re-run DV; withhold Verify until DV clear | unit | passed | Task 2.2 |
| TC-R3-D1-001 | R3 | imported: Three gates clear | happy path | No P0, Simplify passed, DV N/A | Verify round 1 | unit | passed | Task 2.1 |
| TC-R3-D1-002 | R3 | imported: Simplify blocked | exception | Simplify blocked | Pause; no Verify | unit | passed | Task 2.2 |
| TC-R4-D1-001 | R4 | imported: Related tests overlap registered unit cases | happy path | Overlap files | Both layers execute | unit | passed | Task 1.2 |
| TC-R5-D1-001 | R5 | imported: New unit cases exist before --changed | happy path | Hardening adds tests | Git-aware runs after land | unit | passed | Task 1.1 |
| TC-R6-D1-001 | R6 | imported: Runner has no Git-aware flags | exception | No --changed | Record; no complete suite | unit | passed | Task 1.3 |
| TC-R6-D1-002 | R6 | imported: Related selection empty on instruction-only diff | branch | Empty + docs-only diff | `git-aware-empty-expected`; no complete suite | unit | passed | Task 1.3 |
| TC-R7-D1-001 | R7 | imported: User asks for the complete suite | happy path | User asks | MAY run; `ran-complete-suite-optional` | unit | passed | Task 1.3 |
| TC-R7-D1-003 | R7 | imported: CI already requires the complete command | branch | CI requires complete command | MAY run; `ran-complete-suite-optional` | unit | passed | Task 1.3 |
| TC-R7-D1-004 | R7 | imported: Empty selection is not expected and no focused command exists | exception | Empty + runtime surface + no focused command | MAY run; `ran-complete-suite-optional` | unit | passed | Task 1.3 |
| TC-R7-D1-002 | R7 | imported: Ambiguous Git-aware does not authorize complete suite | exception | Ambiguous, no ask | Record unavailable; no complete suite | unit | passed | Task 1.3 |
| TC-R8-D1-001 | R8 | imported: Zero implementation diff and unchanged baseline | happy path | No impl/baseline change | Reuse Hardening suite-stage; still test-plan + agent-browser | unit | passed | Task 2.3 |
| TC-R8-D1-002 | R8 | imported: Simplify changed implementation | branch | Simplify edited | Verify preflights again | unit | passed | Task 2.3 |
| TC-R8-D1-004 | R8 | imported: Code review or Design verify repair changed implementation | branch | CR/DV repair edited implementation | Verify preflights again; no Hardening reuse | unit | passed | Task 2.3 |
| TC-R8-D1-005 | R8 | imported: Verify repair changed implementation | branch | Verify round n repair | Next Verify round preflights again | unit | passed | Task 2.3 |
| TC-R8-D1-006 | R8 | imported: Git baseline changed after Hardening | branch | Baseline changed | Verify preflights again | unit | passed | Task 2.3 |
| TC-R8-D1-003 | R8 | imported: Standalone verify always preflights | branch | `/sp:verify` alone | Preflight required | unit | passed | Task 2.3 |

### D2 — Code and branch coverage

| ID | Object | Code Anchor | Coverage Type | Trigger Input | Expected | Form | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TC-R1-D2-001 | R1 | `getFinalQualityGateInstructions` preamble | diff line | generated Apply | No “exactly this order” for CR/Simplify/DV vs Verify serial chain | unit | passed | Task 2.1 |
| TC-R4-D2-001 | R4 | suite helper overlap sentence | diff line | helper | No “Git-aware may satisfy TC-” | unit | passed | Task 1.2 |
| TC-R5-D2-001 | R5 | Apply Hardening indexOf full-qa-test vs preflight | branch | instructions | qa index < git index | unit | passed | Task 1.1 |

Other objects: D2 N/A — same instruction strings as D1. Stop: unique anchors exhausted.

### D3 — Data and input space

| ID | Object | Parameter | Class | Sample Input | Expected | Form | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TC-R6-D3-001 | R6 | suite-stage state | enum | `git-aware-empty-expected` | Distinct from `ran-git-aware` | unit | passed | Task 1.3 |
| TC-R7-D3-001 | R7 | suite-stage state | enum | `ran-complete-suite-optional` | Distinct identifier | unit | passed | Task 1.3 |

Other objects: D3 N/A — no extra parameters. Stop: unique classes exhausted.

### D4 — State transitions and timing

| ID | Object | State / Timing Scenario | Legal? | Operation Sequence | Expected | Form | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TC-R2-D4-001 | R2 | CR P0 → repair → CR round 2 | yes | DV already N/A | DV not in retry wave | unit | passed | Task 2.2 |
| TC-R2-D4-002 | R2 | CR P0 ∥ DV P0 retry | yes | spawn both | Wait both before next decision | unit | passed | Task 2.2 |
| TC-R2-D4-003 | R2 | Wave-1 DV passed → Simplify UI edit → DV retry | yes | re-run DV | Verify still withheld | unit | passed | Task 2.2 |
| TC-R8-D4-001 | R8 | Hardening ran-git-aware → Verify reuse | yes | no implementation diff | No second Git-aware command | unit | passed | Task 2.3 |
| TC-R8-D4-002 | R8 | CR/DV repair changed implementation → Verify preflight | yes | implementation diff after Hardening | Git-aware re-run; no reuse | unit | passed | Task 2.3 |

Other objects: D4 N/A. Stop: unique transitions exhausted.

### D5 — Non-functional and fault tolerance

| ID | Object | Quality Attribute | Scenario | Pass Criteria | Form | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| TC-R2-D5-001 | R2 | safety | CR round 4 still P0 | Verify not started; archive not recommended | unit | passed | Task 2.2 |

Other objects: D5 N/A — instruction policy. Stop.

### D6 — Environment and dependencies

| ID | Object | Dependency | Fault Injection | Expected Isolation / Compensation | Form | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| TC-R1-D6-001 | R1 | host subagent spawn | spawn absent | sequential fallback labeled; not blocked | unit | passed | Task 2.1 |

Other objects: D6 N/A. Stop.

## Dimension Coverage Summary

| Dimension | Must-check items | Status | Case IDs / Rationale |
| --- | --- | --- | --- |
| D1 Requirements and business scenarios | Imported spec Scenarios | passed | All imported scenarios have D1 IDs and executable pins. Batch 1 exhausted; no unique batch 2. |
| D2 Code and branch coverage | Diff anchors on helpers | passed | TC-R1-D2-001, TC-R4-D2-001, TC-R5-D2-001 |
| D3 Data and input space | Suite-stage identifiers | passed | TC-R6-D3-001, TC-R7-D3-001 |
| D4 State transitions and timing | P0 retry waves; Verify reuse | passed | TC-R2-D4-001/002/003, TC-R8-D4-001/002 |
| D5 Non-functional and fault tolerance | Round-four fail withholds Verify | passed | TC-R2-D5-001 |
| D6 Environment and dependencies | Spawn missing | passed | TC-R1-D6-001 |

### Requirement × Dimension Coverage

| Object | D1 | D2 | D3 | D4 | D5 | D6 |
| --- | --- | --- | --- | --- | --- | --- |
| R1 | TC-R1-D1-001/002 | TC-R1-D2-001 | N/A | N/A | N/A | TC-R1-D6-001 |
| R2 | TC-R2-D1-001/002/003/004 | N/A same helper | N/A | TC-R2-D4-001/002/003 | TC-R2-D5-001 | N/A |
| R3 | TC-R3-D1-001/002 | N/A | N/A | N/A | N/A | N/A |
| R4 | TC-R4-D1-001 | TC-R4-D2-001 | N/A | N/A | N/A | N/A |
| R5 | TC-R5-D1-001 | TC-R5-D2-001 | N/A | N/A | N/A | N/A |
| R6 | TC-R6-D1-001/002 | N/A | TC-R6-D3-001 | N/A | N/A | N/A |
| R7 | TC-R7-D1-001/002/003/004 | N/A | TC-R7-D3-001 | N/A | N/A | N/A |
| R8 | TC-R8-D1-001/002/003/004/005/006 | N/A | N/A | TC-R8-D4-001/002 | N/A | N/A |

## Mutation Testing

| Scope | Mutation Score | Surviving Mutants | Follow-Up Case IDs / Equivalence Rationale |
| --- | --- | --- | --- |
| `both layers` / `ran-complete-suite-optional` / `Do not start Verify until` / `cite that Hardening suite-stage evidence` / `Already-passed code review SHALL NOT be re-run` | 5/5 | none | Dropping any of those strings fails `final-quality-gates.test.ts` |

## Manual Coverage

| ID | Check / Scenario | Execution Method and Environment | Status | Evidence |
| --- | --- | --- | --- | --- |
| MC-R1-001 | Author reads generated Apply FQG text and confirms CR/Simplify/DV parallel then Verify | cli | passed | `.cursor/skills/superpowers-apply-change/SKILL.md` contains `Pre-Verify wave (parallel when spawn exists)` and `Do not start Verify until` |
| MC-R8-001 | Author reads Apply vs standalone Verify: reuse vs always-preflight | cli | passed | Apply FQG: `cite that Hardening suite-stage evidence`. Standalone `sp-verify.md`: `Standalone \`/sp:verify\` always runs this canonical non-visual preflight` and no `reuse Hardening suite-stage` |

No UI Critical Path. `agent-browser` not applicable.

## Deferred Coverage

| Gap | Reason Deferred | Safer Alternative / Follow-Up |
| --- | --- | --- |
| Live multi-host parallel spawn E2E | Needs Cursor spawn vs spawn-less host | Unit string pins + MC-R1-001 |
| Syncing `.cursor/skills/full-qa-test/SKILL.md` | Excluded | `skills/full-qa-test/SKILL.md` remains source |

## Final Quality Gates

| Gate | Outcome | Fresh worker evidence |
| --- | --- | --- |
| code review | passed | Wave 1 / round 1, review mode `fresh-worker`, worker `92087a55-6733-4885-aab6-87ad32fa23ee`. No P0. P1 RM-1/RM-2 repaired in coordinator. Implementation unchanged by worker. |
| `/sp:simplify` | passed | Wave 1, review mode `fresh-worker`, worker `02ea12d4-de33-41d7-9a1f-909c3a2f4957`. Four-angle fan-out skipped in same-context. Extracted `SUITE_STAGE_STATES`. Focused tests 15/15. Implementation changed: yes (cleanup). |
| `/sp:design-verify` | not applicable | Wave 1 / round 1, review mode `fresh-worker`, worker `4546038a-3d2a-4cc9-8b92-b1a54c77a5e6`. Owned diff is `.ts` / `.md` / tests; UI suffix list empty. Before summary: not applicable. No screenshots. |
| `/sp:verify` | passed | Round 1, review mode `fresh-worker`, worker `3ced2810-9c8f-43f0-b313-fda2e5c16552`. Suite **re-ran** `ran-git-aware` (`pnpm exec vitest run --changed origin/main`, 38 files / 491 tests, merge-base `origin/main` `bd92646d1ecf5f35f7f87c0d17cb1a84e5ad2c33`) because Simplify changed implementation. MC-R1-001/MC-R8-001 passed. `agent-browser` N/A. P0 none. P2 record-table row order + CLAUDE.md/docs FQG advertising repaired after report. Remediation: RM-1, RM-2. |
