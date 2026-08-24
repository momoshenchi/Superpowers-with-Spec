## Testing Gap Analysis

Unifying ID/status vocabulary is primarily template and guidance contract work. Focused unit/parity tests pin the new writer vocabulary, Manual IDs, `RM-` headings, and unchanged completeness aliases.

Test Hardening is complete when every concrete test/status row in the tables below is complete. Use statuses `planned`, `passed`, `failed`, `blocked`, or `not applicable`.

## Test Scope Register

| Object | Requirement | Existing Scenarios | Entry Point | Diff Anchor | Risk Hypothesis |
| --- | --- | --- | --- | --- | --- |
| R1 | Executable test rows SHALL use one status vocabulary | Writer omits covered/failing; Dimension summary vocabulary | schema template + apply instructions | `test-plan.md`, `schema.yaml`, `apply-change.ts` | leftover `covered` in scaffold |
| R2 | Test and manual rows SHALL use stable IDs | Manual Coverage row recorded | test-plan Manual table | `test-plan.md`, `schema.ts` | Manual table missing ID |
| R3 | Remediations entries SHALL use RM identifiers | New remediations template entry | remediations template | `remediations.md` | tests still pin `## R1` |
| R4 | Hardening completion readers SHALL remain alias-compatible | Legacy covered row still completes | `COMPLETE_TEST_PLAN_STATUSES` | `instructions.ts` | accidental alias removal |

## Requirement And Scenario Coverage Matrix

| Object | Requirement / Spec Scenario | Form | Status | Notes |
| --- | --- | --- | --- | --- |
| R1 | Writer guidance omits covered and failing | unit | passed | schema + instruction-loader + parity |
| R1 | Dimension summary uses execution vocabulary | unit | passed | template placeholders |
| R2 | Manual Coverage row is recorded | unit | passed | ID column pin |
| R3 | New remediations template entry | unit | passed | RM-1 pin |
| R4 | Legacy covered row still completes | unit | passed | alias set assertion + artifact-workflow `covered` fixture |

## Six-Dimension Case Matrix

### D1 — Requirements and business scenarios

| ID | Object | Requirement | Scenario Type | Steps | Expected | Form | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TC-R1-D1-001 | R1 | Writer guidance omits covered/failing | happy path | Assert template/scaffold/apply text | No normative covered/failing placeholders | unit | passed | schema.test + instruction-loader + parity |
| TC-R1-D1-002 | R1 | Dimension summary vocabulary | happy path | Assert Dimension Summary placeholders | planned / passed / not applicable | unit | passed | schemas/.../test-plan.md |
| TC-R2-D1-001 | R2 | Manual ID present | happy path | Assert Manual table header | Includes ID and MC- guidance | unit | passed | template + schema scaffold |
| TC-R3-D1-001 | R3 | RM heading | happy path | Assert remediations template | `## RM-1` | unit | passed | invariants-remediations.test.ts |
| TC-R4-D1-001 | R4 | Alias compatibility | happy path | Assert COMPLETE_TEST_PLAN_STATUSES | still accepts covered | unit | passed | invariants-remediations + artifact-workflow |

### D2 — Code and branch coverage

| ID | Object | Code Anchor | Coverage Type | Trigger Input | Expected | Form | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TC-R4-D2-001 | R4 | `instructions.ts` COMPLETE_TEST_PLAN_STATUSES | branch | set membership | `covered` remains in set | unit | passed | source pin test |

### D3 — Data and input space

| ID | Object | Parameter | Class | Sample Input | Expected | Form | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TC-R2-D3-001 | R2 | Manual ID | equivalence | `MC-R1-001`, `MC-001` | both documented as valid forms | unit | passed | test-plan template + full-qa-test |

### D4 — State transitions and timing

| ID | Object | State / Timing Scenario | Legal? | Operation Sequence | Expected | Form | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TC-R1-D4-001 | R1 | planned → passed | yes | write planned then passed | hardening complete for that row | unit | passed | existing completeness behavior unchanged |

### D5 — Non-functional and fault tolerance

| ID | Object | Quality Attribute | Scenario | Pass Criteria | Form | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TC-R1-D5-001 | R1 | compatibility | old plans with covered | still parse complete | unit | passed | COMPLETE_TEST_PLAN_STATUSES |

### D6 — Environment and dependencies

| ID | Object | Dependency | Fault Injection | Expected Isolation / Compensation | Form | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TC-R1-D6-001 | R1 | generated skill/command install | N/A | source templates drive generation; parity on functions | unit | passed | skill-templates-parity snapshots updated |

## Dimension Coverage Summary

| Dimension | Must-check items | Status | Case IDs / Rationale |
| --- | --- | --- | --- |
| D1 Requirements and business scenarios | Imported scenarios + happy paths above | passed | R1–R4 D1 cases |
| D2 Code and branch coverage | Alias set membership | passed | TC-R4-D2-001 |
| D3 Data and input space | Manual ID forms | passed | TC-R2-D3-001 |
| D4 State transitions and timing | planned→passed narrative | passed | TC-R1-D4-001 |
| D5 Non-functional and fault tolerance | Legacy compatibility | passed | TC-R1-D5-001 |
| D6 Environment and dependencies | Template generation parity | passed | TC-R1-D6-001 |

### Requirement × Dimension Coverage

| Object | D1 | D2 | D3 | D4 | D5 | D6 |
| --- | --- | --- | --- | --- | --- | --- |
| R1 | TC-R1-D1-001/002 | N/A — no branch logic beyond templates | N/A | TC-R1-D4-001 | TC-R1-D5-001 | TC-R1-D6-001 |
| R2 | TC-R2-D1-001 | N/A | TC-R2-D3-001 | N/A | N/A | N/A |
| R3 | TC-R3-D1-001 | N/A | N/A | N/A | N/A | N/A |
| R4 | TC-R4-D1-001 | TC-R4-D2-001 | N/A | N/A | N/A | N/A |

## Mutation Testing

| Scope | Mutation Score | Surviving Mutants | Follow-Up Case IDs / Equivalence Rationale |
| --- | --- | --- | --- |
| deferred / not applicable — guidance/template contract | | | string pins suffice |

## Manual Coverage

| ID | Check / Scenario | Execution Method and Environment | Status | Evidence |
| --- | --- | --- | --- | --- |
| MC-001 | Spot-check focused + full suite after build | cli | passed | `npm run build`; `npm run lint`; `npm test` — 81 files / 1494 tests passed |

## Deferred Coverage

| Gap | Reason Deferred | Safer Alternative / Follow-Up |
| --- | --- | --- |
| Rewrite historical change test-plans | Out of scope | Alias-compatible readers |

## Final Quality Gates

| Gate | Outcome | Fresh worker evidence |
| --- | --- | --- |
| code review | planned | |
| `/sp:simplify` | planned | |
| `/sp:verify` | planned | |
| `/sp:design-verify` | planned | not applicable expected — no UI |
