## Testing Gap Analysis

Existing validation tests exercise markdown structure, delta spec parsing, direct validate command selection, bulk JSON output shape, and some archive validation behavior. They do not currently prove that change validation agrees with schema artifact status. The main gap is lifecycle-level readiness: a change can pass validation while `status` says schema artifacts are incomplete.

This Test Hardening stage will add coverage at the shared helper level, command level, and archive preflight level. The implementation-driving red tests in `execution-plan.md` should prove the main behavior first. After implementation, hardening should attack edge cases around custom schema metadata, glob artifacts, missing directories, bulk concurrency, JSON shape stability, and archive side effects.

Test Hardening is complete when every concrete test/status row in the tables below is complete. Rows marked `planned` must be updated after implementation and verification.

Hardening result: complete. The implementation-driving tests exposed fixture gaps where old tests created delta-only changes without the full `spec-driven` artifact set. Those gaps were fixed by making positive fixtures schema-complete and by adding explicit negative coverage for missing artifacts.

## Requirement And Scenario Coverage Matrix

| Requirement / Scenario | Planned Coverage | Status | Notes |
| --- | --- | --- | --- |
| cli-validate: Direct change validation fails when schema artifact is missing | Unit plus CLI integration | passed | Covered by `test/core/validation/change-validator.test.ts` and `test/commands/validate.test.ts`; missing `test-plan.md` reports `artifact:test-plan`. |
| cli-validate: Direct change validation reports missing proposal artifact | CLI integration | passed | `superpowers validate scaffolded --json` treats an existing directory without `proposal.md` as a change and reports `artifact:proposal`. |
| cli-validate: Direct change validation passes when all schema artifacts are complete | Unit plus CLI integration | passed | Complete fixtures include proposal, specs, design, tasks, execution-plan, and test-plan. |
| cli-validate: Validation resolves schema from change metadata | Unit | passed | Helper test uses `.superpowers.yaml` selecting a project-local custom schema. |
| cli-validate: Validation falls back to project default schema | Unit | passed | Helper test uses `superpowers/config.yaml` with no change metadata. |
| cli-validate: Invalid change metadata follows status fallback behavior | Unit | passed | Helper test compares fallback behavior with `formatChangeStatus(loadChangeContext(...))` and does not emit metadata parse errors. |
| cli-validate: Validate all changes reports missing schema artifact | CLI integration | passed | `validate --changes --json` exits non-zero and includes the failed change item. |
| cli-validate: Validate all JSON includes schema artifact issues | CLI integration | passed | `validate --all --json` keeps issues in `items[].issues` while validating specs. |
| cli-validate: Deprecated command fails for missing schema artifact | Command unit | passed | `ChangeCommand.validate(..., { json: true })` reports `artifact:test-plan` and sets non-zero exit code. |
| cli-archive: Archive blocks incomplete schema artifacts | Core archive integration | passed | Archive leaves the change active, does not write main specs, and logs the missing artifact. |
| cli-archive: Archive proceeds after schema artifacts are complete | Core archive integration | passed | Existing archive success paths pass with schema-complete fixtures or explicit `noValidate` for mechanics-only tests. |
| cli-archive: Unsafe archive skip bypasses schema artifact validation | Core archive integration | passed | `noValidate: true` archives a schema-incomplete fixture and logs the skip warning. |
| cli-archive: Skipping spec updates does not skip schema artifact validation | Core archive integration | passed | `skipSpecs: true` still blocks missing `test-plan.md` unless validation is skipped. |
| cli-artifact-workflow: Validate and status agree on incomplete artifacts | Unit plus CLI integration | passed | Shared helper uses `loadChangeContext` and `formatChangeStatus`; helper tests compare invalid metadata fallback with status. |
| cli-artifact-workflow: Generated glob artifacts are complete when matches exist | Unit | passed | Helper test covers `specs/**/*.md` with a matching nested `spec.md`. |
| cli-artifact-workflow: Generated glob artifacts are missing when no matches exist | Unit | passed | Helper test covers `specs/**/*.md` with no matching files. |

## Boundary And Abnormal Case Sweep

| Surface | Cases To Attack | Coverage Decision | Status |
| --- | --- | --- | --- |
| Inputs and validation | Missing change directory, missing `proposal.md`, malformed metadata, unknown schema after fallback, missing `specs/` directory, invalid delta specs plus missing artifact | Add unit tests for helper error composition where practical; preserve existing unknown-item command tests for paths that do not exist | passed |
| State and repeat actions | Repeated validation runs, bulk validation order, no mutation during validation | CLI and archive tests assert missing-artifact validation does not move directories or write main specs; full suite covers bulk ordering stability | passed |
| Permissions and ownership | Read failures for artifacts or metadata | Defer OS permission simulation unless implementation adds explicit error handling beyond existing filesystem behavior | not applicable |
| Filesystem and paths | Glob paths, nested spec files, POSIX normalization, project-local schema paths | Unit tests cover glob completion and project-local schema resolution; existing filesystem utility tests cover platform path behavior | passed |
| External and integration points | Commander exit codes, archive preflight before spec updates, JSON consumers | CLI/helper tests and archive tests cover exit codes, JSON shape, and preflight side effects | passed |

## Non-Critical Path Sweep

| Path | Why It Matters | Coverage / Rationale |
| --- | --- | --- |
| Human output next steps for missing artifact | Users need to know to create the artifact, not debug deltas only | Add human output assertion if existing enriched output tests can host it. |
| Existing standalone spec validation | This change must not alter `superpowers validate --specs` behavior | Keep existing spec validation tests passing; no new behavior expected. |
| Bulk validation with mixed specs and changes | `--all` must still validate specs while applying schema checks only to changes | Add `--all --json` command test with one failed change and one passed spec. |
| Deprecated command warning | The warning should remain while validation behavior changes underneath | Existing warning tests should remain valid; add assertion only if needed. |
| Archive fixture-only tests | Tests not about validation should not become noisy | Update fixtures or use `noValidate: true` based on test intent. |
| Archive `--skip-specs` path | Users may assume skipping spec updates also skips validation | Add explicit test proving only `--no-validate` bypasses schema artifact validation. |

## Deferred Or Manual Coverage

| Gap | Reason Deferred | Safer Alternative / Follow-Up |
| --- | --- | --- |
| Real filesystem permission denial | Expensive and brittle across local, CI, and platform environments | Not applicable: implementation uses existing filesystem behavior and adds no permission-specific branch. |
| Very large schema performance | Artifact counts are small in normal workflows and validation is file-existence based | Covered by bounded bulk validation tests and full-suite execution. |
| End-to-end manual CLI session | Automated CLI tests cover command behavior and exit codes more reliably | Covered by CLI/e2e tests and final `superpowers validate schema-aware-change-validation --json` smoke. |

## Verification Commands

| Command | Status | Result |
| --- | --- | --- |
| `pnpm exec vitest run test/core/validation/change-validator.test.ts` | passed | 8 tests passed. |
| `pnpm exec vitest run test/commands/validate.test.ts test/commands/validate.enriched-output.test.ts` | passed | 11 tests passed. |
| `pnpm exec vitest run test/core/commands/change-command.show-validate.test.ts test/commands/change.interactive-validate.test.ts` | passed | 6 tests passed. |
| `pnpm exec vitest run test/core/archive.test.ts` | passed | 26 tests passed. |
| `pnpm exec vitest run test/core/validation/change-validator.test.ts test/commands/validate.test.ts test/core/archive.test.ts` | passed | 44 tests passed. |
| `pnpm exec vitest run test/commands test/core/commands test/core/validation.test.ts test/core/validation.enriched-messages.test.ts` | passed | 229 tests passed. |
| `pnpm exec vitest run test/cli-e2e/basic.test.ts` | passed | 10 tests passed after making the `tmp-init` fixture schema-complete. |
| `pnpm test` | passed | 69 test files and 1385 tests passed. |

## Hardening Summary

Earlier test gaps: validation tests proved delta spec parsing and command output, but did not prove that validate/archive agreed with the schema artifact graph used by status and instructions.

Tests added or strengthened: added a shared helper suite for schema resolution, invalid metadata fallback, glob artifacts, missing proposal, and delta composition; added top-level direct/bulk JSON and human output assertions; added deprecated command parity; added archive preflight side-effect tests; made positive CLI/e2e fixtures schema-complete.

Deferrals: OS-level permission denial and very large schema performance remain not applicable for this change because no new permission-specific or scaling-specific branch was introduced.
