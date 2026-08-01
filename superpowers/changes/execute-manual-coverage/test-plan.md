## Testing Gap Analysis

Existing tests cover generic Test Hardening status rows and Verify's canonical/E2E behavior, but do not prove that a manual coverage row has execution evidence or that it is distinct from a deferred item. Hardening must prove both generated forms and schema templates share the split-table contract.

## Requirement And Scenario Coverage Matrix

| Requirement / Scenario | Planned Coverage | Status | Notes |
| --- | --- | --- | --- |
| Separate Manual Coverage and Deferred Coverage tables | schema/template | covered | Template and schema assertions verify both headings, required columns, and removal of the combined-table fallback. |
| Manual Coverage status controls hardening completion | apply-state/template | covered | Apply-state tests cover `planned` and completion behavior; schema/workflow contracts enumerate passed, failed, blocked, blank, placeholder, and scope-backed `not applicable`. |
| Verify executes and records applicable manual checks | skill/command template | covered | Parity tests assert normal-entry-point execution after preflight, method/environment and action/outcome evidence, and status propagation. |
| Deferred Coverage is not execution evidence | template/docs | covered | Schema, generated workflows, and user-facing docs explicitly state that deferred rows never count as execution evidence. |

## Boundary And Abnormal Case Sweep

| Surface | Cases To Attack | Coverage Decision | Status |
| --- | --- | --- | --- |
| Manual status | planned, passed, failed, blocked, blank, placeholder, not applicable | template/unit | covered |
| Prerequisites | missing runtime, credential, safe target, or external permission | Verify/apply contract | covered |
| Scope | row is demonstrably non-applicable versus quietly deferred | template/unit | covered |
| Evidence | absent, vague, and inspectable action/outcome evidence | template/unit | covered |
| Retry | blocked manual check versus repairable Verify failure | template/unit | covered |

## Manual Coverage

| Check / scenario | Execution method and environment | Status | Evidence |
| --- | --- | --- | --- |
| Generated workflow verification | Run focused Vitest suite in repository workspace | passed | Verify round 1 reran `pnpm exec vitest run test/core/templates/skill-templates-parity.test.ts test/core/artifact-graph/instruction-loader.test.ts test/commands/artifact-workflow.test.ts` after canonical preflight: 3 files, 116 tests passed. Assertions include split tables, status/evidence rules, apply-state blocking, Final Quality Gates exclusion, and Verify skill/command parity. |

## Deferred Coverage

| Gap | Reason Deferred | Safer Alternative / Follow-Up |
| --- | --- | --- |
| Live browser/manual acceptance against consumer projects | This CLI repository has no changed product UI or common consumer runtime | Assert generated instructions; validate in a consuming project when a browser flow exists. |

## Test Hardening Record

**Status:** passed

Earlier test gaps were the lack of an explicit Manual Coverage/Deferred Coverage distinction, inspectable evidence requirements, and apply-state coverage for unfinished manual rows. This hardening pass added or strengthened the focused template, schema, and apply-state assertions listed above; no live browser acceptance was added because this repository has no changed product UI or shared consumer runtime.

| Command | Outcome | Evidence |
| --- | --- | --- |
| Focused schema/template tests | passed | `pnpm exec vitest run test/core/templates/skill-templates-parity.test.ts test/core/artifact-graph/instruction-loader.test.ts test/commands/artifact-workflow.test.ts` — 3 files, 112 tests passed. |
| `pnpm run build` | passed | TypeScript build completed successfully. |
| `pnpm run lint` | passed | ESLint completed with no findings. |
| `pnpm test` | passed | Canonical non-visual suite: 73 files, 1,409 tests passed. |
| `superpowers validate execute-manual-coverage --json` | passed | Change validation returned `valid: true` with zero issues. |
| `git diff --check` | passed | No whitespace errors reported. |

## Final Quality Gates

| Gate | Status | Fresh worker evidence |
| --- | --- | --- |
| Host-native code review | passed | Round 1 — fresh worker `/root/quality_code_review`. No P0/CRITICAL or BLOCKER. Repaired P1 in `src/commands/workflow/instructions.ts` so Manual Coverage requires all four non-empty/non-placeholder fields, and added apply-state cases in `test/commands/artifact-workflow.test.ts`. Verification: build, lint, diff check, and artifact-workflow tests 68/68 passed. |
| `/sp:simplify` | passed | Fresh worker `/root/quality_simplify`, single-pass fallback. Applied clarity-only wording in `src/commands/workflow/instructions.ts:403` and its artifact-workflow assertion; no behavior or contract change. Skipped unrelated `change-review` parity drift. Verification: build, lint, diff check, artifact-workflow + instruction-loader tests 108/108 passed. Handoff: Verify round 1. |
| `/sp:verify` | passed | Verify round 1 — fresh worker `/root/quality_verify`. No P0/CRITICAL, BLOCKER, or warnings; 7/7 tasks and all 3 requirements/6 scenarios covered. Reran canonical preflight `pnpm test` (73 files, 1,413 tests), build, lint, validation, and diff check. Manual Coverage `Generated workflow verification` passed after preflight via the focused 3-file/116-test command with inspectable output. CLI apply journey passed through the built command, including planned/failed/blocked/missing-evidence and Final Quality Gates boundary states. Browser E2E is scope-backed `not applicable`: this is CLI workflow/schema/template behavior with no product UI, route, or visual state. Repaired P1: parser now excludes `## Final Quality Gates` rows from Test Hardening completion and added a regression test. |
| `/sp:design-verify` | not applicable | Design verify round 1 — fresh worker `/root/quality_design_verify`. Scope-backed non-UI result: the change touches CLI workflow instructions, schema/templates, parser, docs, and tests only; no rendered route, component, interaction, responsive layout, or visual runtime state. No repository visual `DESIGN.md` was found (lowercase change-local `design.md` artifacts are not visual identity sources). `git diff --name-only` restricted to UI paths returned no files; status/apply instructions reported 7/7 and `all_done`; diff check passed. No visual findings or remediation required. Browser runtime/screenshots/routes intentionally unassessed as not applicable. |
