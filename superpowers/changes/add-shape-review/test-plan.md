## Testing Gap Analysis

Existing workflow tests cover simplify, design-verify, apply final gates, and profile install/deselect. They do not assert a `shape-review` workflow ID, apply completion copy that invites a non-gate review, core-profile omission with an embedded same-session contract, or session-based suggestion routing. Worker-level tests in Units 1–2 close those template and registry gaps. Test Hardening re-runs the integrated generation/parity/init/update suite plus build and lint after all units land.

This change has no runtime UI. Browser Manual Coverage is `not applicable` with scope evidence. Critical Path is generated CLI/skill text and apply completion behavior, covered by unit tests of templates and installers.

## Requirement And Scenario Coverage Matrix

| Requirement / Scenario | Planned Coverage | Status | Notes |
| --- | --- | --- | --- |
| Shape Review Skill Invocation: User invokes the generated shape-review command | unit | covered | `skill-templates-parity.test.ts` contains `/sp:shape-review` and scope-resolution strings |
| Invocation: Core profile does not install shape-review | unit | covered | `profiles.test.ts` `CORE_WORKFLOWS`; init/update omit named files |
| Invocation: Custom profile selects shape-review | unit | covered | skill-generation filter + init/update `path.join` existence |
| Invocation: Shape review resolves a named change safely | unit | covered | parity: status/instructions JSON, dirty-tree pause, platform-neutral paths |
| Invocation: Shape review has no change name | unit | covered | parity: explicit PR/branch/file/diff; apply-completion exception is in apply embed tests |
| Four angles: Four-angle fan-out | unit | covered | parity: four agents, Surface/Boundaries/Model/Composition headings |
| Four angles: Single-pass fallback | unit | covered | parity: disclosed single-pass wording |
| Four angles: Angle is not applicable | unit | covered | parity: n/a with scope evidence |
| Four angles: Worker remains read-only | unit | covered | parity: read-only / no structural edits during review |
| Route findings: simplify-eligible | unit | covered | parity: classification `simplify`, destination `simplify` |
| Route findings: changes seams or contracts | unit | covered | parity: classification `structural`; destination from session rule |
| Route findings: false positive or out of scope | unit | covered | parity: classification `skip` with reason |
| Session routing: Same-session acceptance after apply | unit | covered | apply template: in-place expansion, withdraw archive |
| Session routing: Slash command after apply completion stays in session | unit | covered | parity: same-session wins over slash “fresh request” |
| Session routing: New-session acceptance | unit | covered | apply + shape-review templates: new change + prerequisite |
| Session routing: Session membership is uncertain | unit | covered | fail-closed new change |
| Session routing: No suggestions are accepted | unit | covered | archive invitation remains valid; does not block archive |
| Summarize: Review completes with suggestions | unit | covered | `## Shape Review Result`; `passed` does not block archive |
| Summarize: No structural suggestions | unit | covered | report schema allows empty suggestions / `Skipped: none` |
| Summarize: Review process cannot complete | unit | covered | `failed` is process failure, not “has suggestions” |
| Summarize: Scope cannot be resolved | unit | covered | `blocked`, no whole-tree scan |
| Apply invitation: Completion invites archive and shape-review | unit | covered | apply completion copy plus host-neutral acceptance sentence |
| Apply invitation: Shape-review is not a fifth quality gate | unit | covered | four-row gate table; no shape-review gate row |
| Apply invitation: Failed or paused apply does not invite | unit | covered | pause/issue template omits invitation |
| Same-session without command: Core profile user accepts invitation | unit | covered | apply embed present even when workflow deselected |
| Same-session without command: Standalone command remains optional | unit | covered | core omit + apply still has invitation |
| Embedded apply contract is runnable without the standalone skill | unit | covered | apply text contains handoff minimums, not a skill pointer |
| Reopen apply: Archive invitation withdrawn after expansion | unit | covered | apply routing prose |
| Reopen apply: Implementation changes after expansion | unit | covered | re-run FQG wording |
| Reopen apply: In-place expansion that changes specs or design | unit | covered | `/sp:review` before implementing expansion |
| Reopen apply: User ignores the invitation | unit | covered | archive proceeds; no prerequisite |
| Adapter namespaced command paths | unit | covered | `adapters.test.ts` + `path.join` |
| Deselection removes named files | unit | covered | profile-sync-drift / update tests |
| Docs: supported-tools custom lists | unit | covered | `test/docs/shape-review-docs.test.ts` |

## Boundary And Abnormal Case Sweep

| Surface | Cases To Attack | Coverage Decision | Status |
| --- | --- | --- | --- |
| Inputs and validation | Missing change name; dirty mixed tree; explicit file target | unit: blocked vs scoped review strings | covered |
| State and repeat actions | Accept suggestions twice; ignore invitation; expand then FQG again | unit: routing and archive-withdrawal prose | covered |
| Permissions and ownership | Unrelated dirty files absorbed into review | unit: pause for narrower target | covered |
| Filesystem and paths | Skill/command install paths on Windows vs POSIX | unit: `path.join` expected paths in init/update/adapters | covered |
| External and integration points | Host cannot spawn agents; standalone workflow absent | unit: single-pass fallback; embedded apply contract | covered |

## Non-Critical Path Sweep

| Path | Why It Matters | Coverage / Rationale |
| --- | --- | --- |
| Angle `not applicable` | Avoid fake findings on diffs with no surface/model change | unit string in parity tests |
| Docs warning that `/sp:review` is not an abbreviation | Name collision | docs grep in Task 3.1; no runtime |
| Config prompt metadata for `shape-review` | Custom profile picker must show the workflow | unit: config/profile tests |
| Hash refresh for untouched templates | Prevent accidental template edits | parity hash map in Task 3.2 |

## Manual Coverage

| Check / Scenario | Execution Method and Environment | Status | Evidence |
| --- | --- | --- | --- |
| Runtime UI / browser journey | not applicable — no user-facing UI in this change | not applicable | CLI and generated Markdown skills/commands only |
| Critical Path: custom-profile init emits `/sp:shape-review` and core omits it | cli; `pnpm exec vitest run test/core/init.test.ts test/core/profiles.test.ts` in the repo | passed | 53 + 9 tests passed after implementation |
| Critical Path: apply completion invites shape-review without a fifth gate | cli; `pnpm exec vitest run test/core/templates/skill-templates-parity.test.ts` | passed | 14/14 parity tests passed, including invitation and non-gate assertions |

## Deferred Coverage

| Gap | Reason Deferred | Safer Alternative / Follow-Up |
| --- | --- | --- |
| Live multi-host session-ID detection | Hosts do not share a session API; design is fail-closed conversation evidence | Template contract tests plus manual use during apply of this change |
| End-to-end agent actually expanding a change in Cursor/Claude | Requires a full apply session after this ships | First use of `/sp:shape-review` on a real change after merge |

## Test Hardening Record

**Status:** complete

**Canonical non-visual suite authority:** `package.json` scripts `build`, `lint`, `test`; this change's `test-plan.md`; init/update/parity tests as Critical Path.

| Command | Outcome | Evidence |
| --- | --- | --- |
| Focused workflow/registry tests | passed | `pnpm exec vitest run` on skill-generation, profiles, tool-detection, init, update, profile-sync-drift, adapters — 266 passed |
| Docs contract tests | passed | `test/docs/shape-review-docs.test.ts` — 2 passed |
| Template parity | passed | `test/core/templates/skill-templates-parity.test.ts` — 14 passed; apply + shape-review hashes refreshed |
| `pnpm run build` | passed | `node build.js` completed successfully (TypeScript 5.9.3) |
| `pnpm run lint` | passed | `eslint src/` completed with no findings |
| `pnpm test` | passed | 78 files / 1460 tests passed |
| `superpowers validate add-shape-review --json` | passed | 1 item, 0 failed |
| `git diff --check` | passed | No whitespace errors |

Earlier test gaps: no `shape-review` workflow ID, no apply invitation/non-gate assertions, no docs distinction from `/sp:review`. Tests added: template contract, registry/core-omit, init/update/`path.join`, adapters, apply invitation/handoff, docs grep tests. One Test Hardening restore: `skills/using-superpowers/SKILL.md` diagnostic-reread paragraph required by an existing `debug-investigation-checkpoint-guidance` test that was already on the branch base.

## Final Quality Gates

| Gate | Outcome | Fresh worker evidence |
| --- | --- | --- |
| code review | | |
| `/sp:simplify` | | |
| `/sp:verify` | | |
| `/sp:design-verify` | | |
