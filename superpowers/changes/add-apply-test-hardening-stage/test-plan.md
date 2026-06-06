## Testing Gap Analysis

Earlier tests already covered the main schema, CLI, and generated-template behavior, but they were not broad enough around completion semantics, template path generation, and documentation drift. This hardening stage strengthened coverage for incomplete vs complete test-plan table statuses, schema init with and without `test-plan`, local template resolution, and user-facing workflow wording.

## Requirement And Scenario Coverage Matrix

| Requirement / Scenario | Planned Coverage | Status | Notes |
| --- | --- | --- | --- |
| Spec-driven workflow includes `test-plan` after `execution-plan` | unit/integration | covered | `test/core/artifact-graph/workflow.integration.test.ts`, `test/commands/artifact-workflow.test.ts` |
| Default apply readiness requires `test-plan` while tracking `tasks.md` | CLI integration | covered | `test/commands/artifact-workflow.test.ts` |
| `test-plan.md` template has draft/hardening phases and table-driven completion guidance | template/unit | covered | `test/core/artifact-graph/instruction-loader.test.ts`, `test/commands/artifact-workflow.test.ts` |
| Apply resumes Test Hardening after tasks are complete | CLI/generated text | covered | `test/commands/artifact-workflow.test.ts`, `test/core/templates/skill-templates-parity.test.ts` |
| Hardening blocks completion on failures or unresolved defects | generated text | covered | `test/core/templates/skill-templates-parity.test.ts` |
| Schema init supports `test-plan` and preserves old behavior without it | CLI integration | covered | `test/commands/schema.test.ts` |
| User-facing docs describe apply as implementation plus hardening | docs review | covered | `docs/workflows.md`, `docs/commands.md`, `docs/getting-started.md` |

## Boundary And Abnormal Case Sweep

| Surface | Cases Attacked | Coverage Decision | Status |
| --- | --- | --- | --- |
| Artifact graph | Missing `execution-plan.md`, missing `test-plan.md`, similarly named files | automated | covered |
| Apply state | Missing `test-plan.md`, incomplete status rows, complete status rows | automated | covered |
| Template resolution | Built-in `schemas/spec-driven/templates/test-plan.md` path | automated + CLI | covered |
| Schema init | With `test-plan`, without `test-plan`, invalid artifact id list | automated | covered |
| Paths | Template file creation under `templates/` with `path.join` | automated | covered |

## Non-Critical Path Sweep

| Path | Why It Matters | Coverage / Rationale |
| --- | --- | --- |
| Existing custom schemas without `test-plan` | Avoids breaking existing schema init behavior | Covered by negative schema init test |
| Generated prose parity | Prevents accidental workflow text drift | Covered by generated template assertions and hash updates |
| Docs | Prevents users learning task completion as archive readiness | Reviewed docs and scanned for stale archive shortcuts |

## Deferred Or Manual Coverage

| Gap | Reason Deferred | Safer Alternative / Follow-Up |
| --- | --- | --- |
| Globally installed `superpowers` binary template output | The global package on this machine is older and resolves `/opt/homebrew/lib/node_modules/superpowers-spec` | Validated the local built CLI from this repository with `node dist/cli/index.js` |
