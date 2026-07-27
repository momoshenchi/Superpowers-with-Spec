## Testing Gap Analysis

Existing tests cover:

- Generated proposal-review skill/command presence and report-before-repair ordering (`test/core/templates/change-review.test.ts`)
- Root/generated review phrase parity (`test/core/change-review-guidance.test.ts`)
- Work-package dispatch/review guidance (`test/core/subagent-work-package-guidance.test.ts`)
- Schema-init/template scaffolding expectations (`test/commands/schema.test.ts`, instruction-loader fixtures)

Gaps this change must close:

- No contract currently asserts that WARNING-only findings skip re-review and do not block readiness.
- Current contracts require repairing WARNINGs and re-running review.
- Guidance tests still lock `work package` / `# <n>. agent...` as the preferred form rather than `dispatch unit` + pure-scope headings.
- No assertion forbids nested `` ### `# ...` `` execution-plan headings or requires an Assignee policy column.
- Legacy acceptance of old agent-labeled headings is not explicitly tested.

Workers record and run the tests needed by their detailed tasks in `tasks.md`. Test Hardening in this `test-plan.md` supplements that local verification after all dispatch units are integrated. Passing worker-level tests is necessary but not sufficient for final apply completion.

Test Hardening is complete when every concrete test/status row in the tables below is complete. Use statuses such as `covered`, `passed`, or `not applicable` for completed rows. Leave rows as `planned`, `failing`, or blank until the coverage is actually complete.

## Requirement And Scenario Coverage Matrix

| Requirement / Scenario | Planned Coverage | Status | Notes |
| --- | --- | --- | --- |
| Schema-aware proposal review workflow | unit / generated-template contract | passed | `test/core/templates/change-review.test.ts` |
| Automatic proposal review after artifact completion | unit / generated-template contract | passed | propose skill/command content |
| Report-before-repair with blocker-gated re-review | unit / generated-template + root parity | passed | assert no full re-review for WARNING-only |
| WARNING residual non-blocking readiness | unit / generated-template contract | passed | readiness with residual WARNING notes allowed |
| SUGGESTION-only readiness | unit / generated-template contract | passed | already partially covered; keep |
| Decision pause on unresolved blocker | unit / generated-template contract | passed | keep existing pause language |
| Ephemeral review / no apply-time repeat | unit / generated-template contract | passed | apply templates |
| Dispatch-unit-aware review criteria + legacy acceptance | unit / root+generated parity | passed | change-review skill/template |
| Logical dispatch-unit execution | unit / guidance contract | passed | subagent-driven-development skill |
| Flexible allocation / combine / inline | unit / guidance contract | passed | skill + implementer prompt |
| Pure-scope task headings | unit / template + schema instruction | passed | tasks template + schema.yaml |
| Coordination table assignee policy | unit / execution-plan template | passed | execution-plan template/tests |
| Clean execution-plan unit headings | unit / template contract | passed | forbid nested code-wrapped `#` headings |
| Single final integration review | unit / guidance contract | passed | requesting-code-review + subagent skill |
| Legacy work-package headings acceptable | unit / guidance contract | passed | explicit acceptance phrase |
| cli-artifact-workflow dispatch-unit generation | unit / instruction/template tests | passed | schema instructions + templates |
| schema-init dispatch-unit templates | unit / command tests | passed | `test/commands/schema.test.ts` |
| sp-onboard blocker-gated re-review language | unit / generated onboard text | passed | `onboard.ts` assertions if present / parity |

## Boundary And Abnormal Case Sweep

| Surface | Cases To Attack | Coverage Decision | Status |
| --- | --- | --- | --- |
| Review severities | BLOCKER only; WARNING only; SUGGESTION only; mixed; decision-needed blocker | unit/template contracts | passed |
| Heading formats | pure-scope; legacy agent label; missing unit heading (sequential fallback) | unit/guidance contracts | passed |
| Execution-plan headings | clean `### 1. Scope`; nested `` ### `# 1...` `` must not be generated | unit/template contracts | passed |
| Assignment policy | dedicated worker; combine; inline sequential | unit/guidance contracts | passed |
| Apply path | no automatic proposal re-review after propose | unit/template contracts | passed |
| Cross-platform paths | template path examples remain project-relative portable strings | not applicable for new runtime code | passed |
| Historical changes | do not require rewrite of old artifacts | manual/docs acceptance language | passed |

## Integration And Regression Sweep

| Integration Point | Risk | Coverage Decision | Status |
| --- | --- | --- | --- |
| propose ↔ change-review shared phrases | loop text drifts between files | contract tests on both templates | passed |
| root Chinese skill ↔ generated English template | policy mismatch | shared requirement phrases in parity test | passed |
| schema.yaml instructions ↔ templates | example formats diverge | instruction-loader / schema tests | passed |
| schema.ts fallbacks ↔ default templates | init scaffolds old format | schema command tests | passed |
| subagent skill ↔ requesting-code-review | final review timing regresses to per-task | guidance tests | passed |
| Full suite | unrelated regressions from broad string edits | `pnpm test` / build / lint as needed | passed |

## Deferred / Manual Coverage

| Item | Reason | Follow-up |
| --- | --- | --- |
| Live LLM execution of propose review loop | repo tests validate generated instructions, not model behavior | manual smoke after implementation with `/sp:propose` on a sample change |
| Bulk migration of historical changes | intentionally out of scope | leave legacy acceptance in place |

## Test Hardening Record

| Check | Command / Evidence | Status |
| --- | --- | --- |
| Focused review contracts | `pnpm exec vitest run test/core/templates/change-review.test.ts test/core/change-review-guidance.test.ts` → 5 passed | passed |
| Focused dispatch-unit guidance | `pnpm exec vitest run test/core/subagent-work-package-guidance.test.ts` → 2 passed | passed |
| Schema/template scaffolding | `pnpm exec vitest run test/commands/schema.test.ts test/core/artifact-graph/instruction-loader.test.ts test/core/templates/skill-templates-parity.test.ts` → passed | passed |
| Broader suite | `pnpm test` → 72 files / 1398 tests passed | passed |
| Build | `pnpm run build` → success | passed |
| Lint | `pnpm run lint` → eslint src/ clean | passed |
