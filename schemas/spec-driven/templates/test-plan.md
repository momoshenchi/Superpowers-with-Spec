## Testing Gap Analysis

Analyze which earlier tests were still insufficient or not broad enough, walking the six `full-qa-test` dimensions (D1–D6) so the gap hunt and the case matrix below use the same lens. Then describe which tests this Test Hardening stage added or strengthened.

Workers record and run the tests needed by their detailed dispatch-unit task blocks in `tasks.md`. Test Hardening in this `test-plan.md` supplements that local verification after all dispatch units are integrated. Passing worker-level tests is necessary but not sufficient for final apply completion.

Name each gap as `R<object> / D<dimension>: <what existing worker tests do not see>`. Start from `execution-plan.md` Step 1 tests and from `design.md` Contracts and Invariants; cite those tests in Evidence rather than rewriting them.

Test Hardening is complete when every concrete test/status row in the tables below is complete. **Write** statuses as `planned`, `passed`, `failed`, `blocked`, or `not applicable`. A row is complete when it is `passed` or scope-backed `not applicable`. Leave rows as `planned`, `failed`, `blocked`, or blank until the coverage is actually complete. Readers may still treat legacy aliases such as `covered` as complete for older plans; do not write those aliases in new rows.

## Test Scope Register

A **test object** is one coverage unit. It is not a folder, not a file list, and not a Scenario.

| Layer | What it is | Where it is recorded |
| --- | --- | --- |
| Object (`R1`, `R2`, `R1a`) | Stable ID for one `### Requirement:` | Object column; prefix of every `TC-R…` / `MC-R…` ID |
| Requirement | The SHALL statement being proven | Requirement column — copy the spec heading, do not paraphrase |
| System under test | The callable surface you actually invoke | Entry Point — CLI subcommand, HTTP route, exported function, or UI route, never an internal helper |
| Spec Scenario | A `#### Scenario:` already written under that Requirement | Spec Scenarios to import — titles only; this is the import list, not a second object list |
| Case | One executable row | `TC-R<object>-D<dimension>-<seq>` in D1–D6 |

Take objects from the change's delta spec first: one row per `### Requirement:`, coded R1, R2, …. A Requirement that contains independently testable sub-capabilities may split into R1a / R1b. Do not invent a parallel feature list that renames those Requirements. Existing `#### Scenario:` blocks are the D1 baseline — import them, then expand; do not rewrite them under new names.

**A thin spec does not cap coverage.** Import every written `#### Scenario:` as `imported:`. Then add `gap:` rows for happy path, branches, exceptions, and implicit rules the spec omitted. If design, proposal, or code exposes a testable capability with no `### Requirement:`, register another object (continue R numbering) and say `spec omitted` in its Risk Hypothesis. Do not rewrite `spec.md` here; do not skip the tests because the spec is thin.

If you cannot name an Entry Point, the row is not yet a test object: split the Requirement, or mark Entry Point `not applicable` with a Risk Hypothesis that says why no runtime surface exists. When one requirement triggers another, say so in its Risk Hypothesis.

Example (replace; do not leave this sample in the live table):

| Object | Requirement | Spec Scenarios to import | Entry Point | Diff Anchor | Risk Hypothesis |
| --- | --- | --- | --- | --- | --- |
| R1 | `Requirement: Cancel pending orders` | Pending can cancel; shipped rejected | `POST /api/orders/{id}/cancel` | `orderService.ts:cancel` | Refund failure leaves a half-cancelled order |

| Object | Requirement | Spec Scenarios to import | Entry Point | Diff Anchor | Risk Hypothesis |
| --- | --- | --- | --- | --- | --- |
| R1 | <!-- `### Requirement:` name from `specs/<capability>/spec.md` --> | <!-- titles of `#### Scenario:` already written --> | <!-- CLI subcommand, HTTP route, exported function, or UI route — not an internal helper --> | <!-- files or symbols this requirement changes --> | <!-- the single most likely thing to be missed --> |

## Design Contract And Invariant Coverage

Map each non-N/A `## Contracts` item and `## Invariants` row from `design.md` to case IDs after those cases exist. An unmapped invariant is a coverage hole. Write exactly `N/A — no contracts or invariants` when design says N/A.

| Object | Contract / Invariant | Case IDs | Notes |
| --- | --- | --- | --- |
| <!-- R1 --> | <!-- I1 or contract name, quoted --> | <!-- TC-R1-D1-001, TC-R1-D4-002 --> | <!-- or N/A with reason --> |

## Requirement And Scenario Coverage Matrix

Traceability index from each imported spec `#### Scenario:` to the D1 case that owns it. This table is not a second case list: Steps, Expected, Form, and Status live only on the D1 row named here. D1 then adds gap rows (branch / exception / implicit) that do not appear in this table.

One row per imported Scenario. A blank D1 Case ID is a coverage hole. Related Case IDs list D2–D6 cases that prove the same Scenario from another dimension.

| Object | Requirement | Spec Scenario | D1 Case ID | Related Case IDs | Notes |
| --- | --- | --- | --- | --- | --- |
| <!-- R1 --> | <!-- `### Requirement:` name --> | <!-- `#### Scenario:` title, copied not paraphrased --> | <!-- TC-R1-D1-001 --> | <!-- TC-R1-D2-001, TC-R1-D4-002 — or none --> | <!-- optional --> |

Choose form on the D1 row by the `full-qa-test` rule: observe the behavior at the lowest layer that can see it. `unit` for a function or branch, `integration` for collaborating modules or a real store, `E2E` only when the behavior is invisible below the full journey, `manual` only when automation cannot run and a `## Manual Coverage` row exists.

## Six-Dimension Case Matrix

Cases carried over from the `full-qa-test` skill, one table per dimension. Each table uses that dimension's own columns from the skill's Step 1–6 output formats, plus Object, Form, Status, and Evidence. Run the skill's 10→10→10 batch rule once per registered Requirement per dimension — do not share one batch of ten across several requirements. Non-critical paths — fallback, warning, empty result, cleanup, logging — belong to whichever dimension owns them rather than to a separate table.

Case IDs are `TC-R<object>-D<dimension>-<seq>`, for example `TC-R2-D6-001`. Group rows by object within each table. Status values are `planned`, `passed`, `failed`, `blocked`, or `not applicable`. Every registered Requirement needs coverage in every applicable dimension, or an explicit `not applicable` row stating why.

Write concrete cases: name real routes, symbols, and values, and give expected results as checkable assertions such as a status code, a resulting state, or a specific error. "Invalid input is rejected" is not a case. Every case must name its form. A case is incomplete if a wrong implementation could still pass it. Expected must name a value, state, collaborator, or error that would change if the code were wrong. Cite an existing worker test in Evidence when `execution-plan.md` Step 1 already covers the case; do not duplicate that test.

D5 owns quality attributes of this object (authz, latency SLO, compatibility). D6 owns isolation when a named collaborator fails. Do not copy the same fault into both tables.

### D1 — Requirements and business scenarios

Imported spec Scenarios use `Source` `imported: <Scenario title>`. Gaps this dimension adds use `gap: <short name>` and do not belong in the coverage-matrix index above.

| ID | Object | Source | Scenario Type | Steps | Expected | Form | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| <!-- TC-R1-D1-001 --> | <!-- R1 --> | <!-- imported: Pending can cancel  OR  gap: double-submit --> | <!-- happy path / branch / exception / implicit; mark imported spec scenarios --> | <!-- ordered actions through the registered entry point, with the starting state --> | <!-- checkable outcome: status code, resulting state, returned field --> | <!-- unit / integration / E2E / manual --> | | <!-- test file, command, or rationale --> |

### D2 — Code and branch coverage

Every path or symbol in the object's Diff Anchor must appear in at least one D2 Code Anchor, or that object needs a D2 `not applicable` row stating why the diff is untestable.

| ID | Object | Code Anchor | Coverage Type | Trigger Input | Expected | Form | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| <!-- TC-R1-D2-001 --> | <!-- R1 --> | <!-- file:symbol — the specific decision, e.g. `cancel` / `status==='shipped'` --> | <!-- branch true / branch false / condition combo / diff line --> | <!-- input that actually reaches this branch --> | <!-- which path runs, and which collaborator must not be called --> | <!-- unit unless the branch is unreachable without a real collaborator --> | | <!-- test file, command, or rationale --> |

### D3 — Data and input space

Use pairwise / orthogonal combinations for multi-parameter interaction; do not explode the cartesian product.

| ID | Object | Parameter | Class | Sample Input | Expected | Form | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| <!-- TC-R1-D3-001 --> | <!-- R1 --> | <!-- parameter under test --> | <!-- equivalence / boundary N-1,N,N+1 / empty / null / dirty data --> | <!-- the literal value, not a description of it --> | <!-- rejection code or accepted normalization --> | <!-- unit unless validation lives in a gateway or framework layer --> | | <!-- test file, command, or rationale --> |

### D4 — State transitions and timing

| ID | Object | State / Timing Scenario | Legal? | Operation Sequence | Expected | Form | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| <!-- TC-R1-D4-001 --> | <!-- R1 --> | <!-- from-state -> to-state, race, replay, retry, or timeout --> | <!-- yes / no --> | <!-- ordered operations including concurrency or timing --> | <!-- resulting state, and that no partial write remains --> | <!-- integration when real storage or a queue is required; E2E for cross-client races --> | | <!-- test file, command, or rationale --> |

### D5 — Non-functional and fault tolerance

| ID | Object | Quality Attribute | Scenario | Pass Criteria | Form | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| <!-- TC-R1-D5-001 --> | <!-- R1 --> | <!-- performance / security / resilience / compatibility --> | <!-- concrete scenario, e.g. another user's token calls this route --> | <!-- measurable threshold or required behavior, e.g. 403 and no state change --> | <!-- integration by default; dedicated load test or E2E when the attribute is invisible in-process --> | | <!-- test file, command, or rationale --> |

### D6 — Environment and dependencies

| ID | Object | Dependency | Fault Injection | Expected Isolation / Compensation | Form | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| <!-- TC-R1-D6-001 --> | <!-- R1 --> | <!-- named upstream/downstream: HTTP service, MQ, DB, cache, third party --> | <!-- latency, 5xx, outage, pool exhaustion, empty result --> | <!-- circuit break, fallback, retry, compensation, and what must still succeed --> | <!-- integration with fault injection; E2E only if isolation is unobservable below the full topology --> | | <!-- test file, command, or rationale --> |

## Dimension Coverage Summary

One row per dimension, mirroring the `full-qa-test` Step 8 self-check. Mark Status `passed` when the 10→10→10 rule has been run for every registered Requirement in that dimension and required child cases are `passed` or scope-backed `not applicable`; use `not applicable` with a concrete scope reason when the whole dimension does not apply; leave unfinished dimensions `planned`. List case IDs per object, for example `R1: TC-R1-D3-001/002; R2: TC-R2-D3-001`.

| Dimension | Must-check items | Status | Case IDs / Rationale |
| --- | --- | --- | --- |
| D1 Requirements and business scenarios | Imported spec Scenarios plus happy path, every branch, and recovery after an aborted run | <!-- planned / passed / not applicable --> | |
| D2 Code and branch coverage | Diff and critical-path branch coverage; mutation testing or a stated deferral | <!-- planned / passed / not applicable --> | |
| D3 Data and input space | Boundaries (max/min/zero/negative/empty/null); special characters, over-length, Emoji, SQL/XSS | <!-- planned / passed / not applicable --> | |
| D4 State transitions and timing | Illegal state transitions; concurrent requests, replay, and idempotency | <!-- planned / passed / not applicable --> | |
| D5 Non-functional and fault tolerance | Permissions and privilege escalation; third-party timeout and 5xx fallback; performance and compatibility where applicable | <!-- planned / passed / not applicable --> | |
| D6 Environment and dependencies | Empty or failing database/cache; weak or absent network; multi-device, resolution, and role compatibility | <!-- planned / passed / not applicable --> | |

### Requirement × Dimension Coverage

Required once two or more Requirements are registered. It makes a requirement that is silently missing from a dimension visible at a glance. Fill each cell with the object's case IDs for that dimension, or `N/A` plus a reason; an empty cell is a gap to close.

| Object | D1 | D2 | D3 | D4 | D5 | D6 |
| --- | --- | --- | --- | --- | --- | --- |
| R1 | | | | | | |

## Mutation Testing

Optional coverage-quality gate from `full-qa-test` Step 7. Run it only after every planned `unit` case across D1–D6 is executable and green — not after D2 alone. Record a deferral reason instead of leaving this blank. Surviving mutants that change observable behavior MUST get a follow-up case ID; equivalent mutants need a one-line reason.

| Scope | Mutation Score | Surviving Mutants | Follow-Up Case IDs / Equivalence Rationale |
| --- | --- | --- | --- |
| <!-- files or symbols mutated, or "deferred / not applicable" with reason --> | <!-- killed / valid mutants --> | <!-- surviving mutant list --> | <!-- added cases, or why the mutant is equivalent --> |

## Manual Coverage

Manual check IDs are `MC-R<object>-<seq>` (for example `MC-R1-001`), or `MC-<seq>` when no requirement object applies.

| ID | Check / Scenario | Execution Method and Environment | Status | Evidence |
| --- | --- | --- | --- | --- |
| <!-- MC-R1-001 --> | <!-- concrete manual check --> | <!-- programmatic-browser (Playwright/Cypress) | agent-browser | cli | other; entry point; safe environment. Critical Path may list both browser modes. --> | <!-- planned / passed / failed / blocked / not applicable --> | <!-- command, steps, observed outcome, and inspectable evidence --> |

## Deferred Coverage

| Gap | Reason Deferred | Safer Alternative / Follow-Up |
| --- | --- | --- |
| <!-- coverage gap --> | <!-- specific technical or scope reason --> | <!-- safer alternative or follow-up --> |

## Final Quality Gates

Apply records each mandatory gate here once Test Hardening is finished. Rows in this section are not Test Hardening coverage: hardening completeness is judged only from the tables above.

Leave a row `planned` until a fresh worker has actually run that gate. A gate is complete when it is `passed`, or `not applicable` with concrete scope evidence. A `failed` gate, or an applicable `blocked` gate, keeps the change unready for archive.

| Gate | Outcome | Fresh worker evidence |
| --- | --- | --- |
| code review | <!-- planned / passed / failed / blocked / not applicable --> | <!-- round, fresh worker, report and findings resolution --> |
| `/sp:simplify` | <!-- planned / passed / failed / blocked / not applicable --> | <!-- fresh worker, report and cleanup/skip summary --> |
| `/sp:verify` | <!-- planned / passed / failed / blocked / not applicable --> | <!-- round, fresh worker, canonical suite, Manual Coverage disposition --> |
| `/sp:design-verify` | <!-- planned / passed / failed / blocked / not applicable --> | <!-- round, fresh worker, UI/DESIGN.md disposition --> |
