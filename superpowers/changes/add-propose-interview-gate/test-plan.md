## Testing Gap Analysis

The current Propose coverage verifies generated template parity, exact content hashes, artifact-generation wording, and the automatic proposal-review contract. It does not yet assert the new pre-confirmation boundary, the ability to ask zero questions, the trigger distinction between facts and decisions, one-question-at-a-time presentation, delegated recommendations, the three final outcomes, or the routing of confirmed decisions into `proposal.md` and `design.md`. It also does not provide a manual smoke path for host question-tool fallback or a cross-platform check of the affected generation/update fixtures.

Worker-level verification for individual prompt, documentation, and test tasks remains in `tasks.md` and `execution-plan.md`. After those units are integrated, Test Hardening will strengthen semantic parity assertions, generation/update coverage, documentation consistency, and macOS/Linux/Windows path evidence here. Passing worker-level tests is necessary but not sufficient for final apply completion.

Test Hardening is complete only when every concrete testing or manual status row below is `passed`, `covered`, or scope-backed `not applicable`.

## Test Hardening Record

### Canonical non-visual suite preflight

| Authority | Selected command / check | Result | Evidence and scope |
| --- | --- | --- | --- |
| `package.json` `test` script and `.github/workflows/ci.yml` `test_matrix` | `pnpm test` | passed with authorized baseline exceptions | Fresh coordinator run after all four gates exited 1 with 77 test files and 1,450 tests: 75 files passed, 1,447 tests passed, and exactly the three user-authorized pre-existing assertions failed—two in `test/core/subagent-work-package-guidance.test.ts` and one in `test/core/artifact-graph/instruction-loader.test.ts`. No changed test failed; the final run had no additional timeout. |
| `test-plan.md` planned focused coverage | `pnpm exec vitest run test/core/templates/skill-templates-parity.test.ts test/core/templates/change-review.test.ts test/core/shared/skill-generation.test.ts test/core/update.test.ts test/core/command-generation/adapters.test.ts` | passed | 5 files, 188 tests passed after the code-review remediation. |
| `.github/workflows/ci.yml` `lint` job | `pnpm run build` | passed | Build completed successfully. |
| `.github/workflows/ci.yml` `lint` job | `pnpm exec tsc --noEmit` | passed | TypeScript check completed with exit code 0. |
| `.github/workflows/ci.yml` `lint` job | `pnpm run lint` | passed | ESLint completed with no errors. |
| Change validation workflow | `superpowers validate add-propose-interview-gate` | passed | Change reported valid. |
| Repository diff hygiene | `git diff --check` | passed | No whitespace errors. |
| Cross-platform CI authority | `.github/workflows/ci.yml` `test_matrix` | covered | Matrix includes `ubuntu-latest`, `macos-latest`, and `windows-latest`/`windows-pwsh`; no new path implementation was added. This local branch was not pushed, so no fresh remote Windows run is claimed. |

Visual-only checks were excluded because this change modifies generated instructions, tests, and workflow documentation; it adds no UI route or visual artifact.

## Requirement And Scenario Coverage Matrix

| Requirement / Scenario | Planned Coverage | Status | Notes |
| --- | --- | --- | --- |
| Pre-confirmation boundary / read-only preflight precedes change creation | Template contract test plus generated-entry walkthrough | covered | `skill-templates-parity.test.ts` checks the read-only wording and ordering of confirmation before `superpowers new change`; the shared fragment lists all explicit artifacts as write-protected. |
| Pre-confirmation boundary / user stops before confirmation | Template contract test plus generated-entry walkthrough | covered | The three-state assertions cover stop-without-creating and the no-directory/no-artifact outcome. |
| Pre-confirmation boundary / cross-platform preflight paths | Path-aware generation/update test and CI matrix inspection | covered | Update and adapter fixtures use `path.join()`/`path.resolve()`; the existing CI matrix includes Windows. |
| Adaptive depth / clear low-risk request has no questions | Template contract test plus generated-entry walkthrough | covered | The parity test asserts the zero-question path and the independent final confirmation requirement. |
| Adaptive depth / ambiguous product scope | Template contract test and generated-entry walkthrough | covered | Product trigger wording explicitly covers goal, scope, non-goals, capabilities, impact, and acceptance. |
| Adaptive depth / high-impact technical choice | Template contract test and generated-entry walkthrough | covered | The parity test checks architecture, data/migration, public API/CLI, security, reliability/recovery, performance, compatibility, deployment/operations, and important dependency triggers. |
| One-at-a-time / structured decision question | Template contract test | covered | The parity test checks known facts, decision impact, recommendation/trade-off, alternatives, free-form response, and waiting. |
| One-at-a-time / user delegates a decision | Template contract test and generated-entry walkthrough | covered | Delegation, recommendation adoption, running-summary recording, and dependent-decision reevaluation are asserted. |
| Decision closure / decision-closed summary | Template contract test and generated-entry walkthrough | covered | The final summary must separate confirmed decisions from agent-owned assumptions before creation. |
| Decision closure / user corrects the summary | Template contract test and generated-entry walkthrough | covered | Request-changes wording requires one correction at a time, dependent reevaluation, and a new complete summary. |
| Three-state gate / confirm and create | Template ordering test and generated-entry walkthrough | covered | `change-review.test.ts` and parity ordering assertions keep creation and automatic review after confirm-and-create. |
| Three-state gate / request changes | Template contract test and generated-entry walkthrough | covered | Request changes explicitly keeps the write boundary closed. |
| Three-state gate / stop without creating | Template contract test and generated-entry walkthrough | covered | Stop explicitly ends without a change directory or artifact and reports no change created. |
| Artifact handoff / product decisions in proposal | Template contract test and generated-content inspection | covered | Generated skill and command content explicitly routes confirmed product decisions to `proposal.md`. |
| Artifact handoff / technical decisions in design | Template contract test and generated-content inspection | covered | Generated content requires choice, alternatives, rationale, trade-offs, and at least three options for major decisions in `design.md`. |
| Artifact handoff / no separate interview artifact | Schema/status validation and template contract test | covered | The explicit list remains schema-defined artifacts and the guidance says not to create `interview.md`. |

## Boundary And Abnormal Case Sweep

| Surface | Cases To Attack | Coverage Decision | Status |
| --- | --- | --- | --- |
| Inputs and validation | Missing input, clear request, ambiguous scope, conflicting requirement, user correction | Template assertions plus generated-entry walkthrough | covered |
| State and repeat actions | Zero-question summary, repeated confirmation, changed decision with dependent branch, stop after several questions | Static state-flow assertions plus generated-entry walkthrough | covered |
| Permissions and ownership | User-owned product decision, agent-owned routine implementation detail, delegated decision, unresolved high-impact choice | Template contract and generated-entry walkthrough | covered |
| Filesystem and paths | Existing specs discovery, nested project path, change artifact names, macOS/Linux/Windows separators | `path.join()`/`path.resolve()` fixture tests plus CI matrix inspection | covered |
| External and integration points | Structured question tool available, tool unavailable, existing `superpowers` commands, generated skill/command adapters | Generation tests plus fallback wording assertion | covered |

## Non-Critical Path Sweep

| Path | Why It Matters | Coverage / Rationale |
| --- | --- | --- |
| Zero-question fast path | Preserves Propose's quick-path promise while retaining explicit confirmation | Covered by semantic parity assertions and generated-entry walkthrough |
| User delegates a decision | Prevents unnecessary friction when the user accepts the agent's recommendation | Covered by delegation and dependent-decision assertions |
| Host lacks structured question tool | Generated instructions must remain usable across supported hosts | Covered by fallback wording and representative adapter generation |
| User stops before change creation | Ensures the new gate does not leave partial change directories or artifacts | Covered by no-write/stop ordering and outcome assertions |
| Existing proposal review flow | Prevents the new preflight from duplicating or moving the established post-artifact review | Covered by `change-review.test.ts` regression assertions |
| Documentation-only quick-path examples | Contradictory docs can cause agents to skip the gate or over-question | Covered by `git diff --check` and documentation anchor search |

## Manual Coverage

| Check / Scenario | Execution Method and Environment | Status | Evidence |
| --- | --- | --- | --- |
| Clear request with zero interview questions | Generated `/sp:propose` skill/command entry-point walkthrough on macOS; inspect the preflight-to-summary-to-creation order | passed | The generated projections explicitly allow zero questions, still require final confirmation, and place `superpowers new change` after the gate; covered by the 188 focused tests. No host-specific conversational runtime is present in this repository. |
| Ambiguous scope asks one question at a time | Generated Propose entry-point walkthrough with two plausible scopes | passed | Product ambiguity triggers and one-at-a-time/wait wording are present in both projections; no unrelated batch prompt is prescribed. |
| High-impact technical decision is surfaced | Generated Propose entry-point walkthrough with architecture/data alternatives | passed | All high-impact trigger categories, recommendation, alternatives, and design handoff wording are present; focused parity and adapter tests pass, including the mandatory three-option rule for major decisions. |
| Summary correction loops safely | Generated final-gate walkthrough of request-changes outcome | passed | Request changes keeps writes closed, accepts one correction at a time, reevaluates dependencies, and requires a new summary. |
| Confirm-and-create handoff | Generated final-gate walkthrough of confirm-and-create outcome | passed | Creation, artifact generation, automatic review, and final status remain after the confirmation gate; product/technical routing is explicit. |
| Stop without creating | Generated final-gate walkthrough of stop-without-creating outcome | passed | The stop branch explicitly reports no change created and no artifact writes. |
| Structured question tool fallback | Generated Propose entry-point walkthrough with structured question capability unavailable | passed | The shared guidance explicitly falls back to ordinary natural-language conversation for the interview, missing-input question, and artifact-clarification question while preserving one-at-a-time semantics. |
| Generated host parity | Generate shared command content and format Claude, Cursor, and Windsurf representative outputs | passed | `test/core/command-generation/adapters.test.ts` verifies shared Propose body markers and path preservation; all representative adapter tests pass. |
| Windows path behavior | Equivalent cross-platform verification through path-aware fixtures and repository CI matrix inspection | passed | Local update/adapter tests pass using `path.join()`/`path.resolve()`; `.github/workflows/ci.yml` has the Windows native-separator `windows-latest`/`windows-pwsh` test job. No unpushed-branch remote run is claimed. |

## Final Quality Gates

### 1. Host-native code review

| Round | Fresh worker | Outcome | Commands / runtime evidence | Files / states reviewed | Findings and resolution |
| --- | --- | --- | --- | --- | --- |
| 1 | Leibniz (`019fd1de-e96d-7352-b25f-aecb9a809970`), fresh equivalent review worker; no named host-native reviewer was available | passed after coordinator remediation | Worker reviewed the diff and reported no P0/BLOCKER. Coordinator reran the focused suite: 5 files, 188 tests passed; `superpowers validate add-propose-interview-gate`, `pnpm exec tsc --noEmit`, `pnpm run lint`, and `git diff --check` passed. | Shared Propose skill/command projections, preflight/interview/summary states, artifact handoff, post-confirmation review, docs, generation/update/adapters, and change artifacts | Resolved P1: changed “should compare at least three options” to mandatory “must compare at least three options.” Resolved P2: added ordinary-conversation fallback to missing-input and artifact-clarification branches. Resolved P2: updated `docs/workflows.md` quick-reference row. P1/P2-only round; no second code-review round required. |

### 2. Simplify

| Round | Fresh worker | Outcome | Commands / runtime evidence | Files / states reviewed | Findings and resolution |
| --- | --- | --- | --- | --- | --- |
| 1 | Lagrange (`019fd1ec-8f0c-7923-9372-7e580fbf39d8`) | passed | Fresh worker completed the behavior-preserving cleanup review. The only accepted cleanup cached one repeated adapter-test formatting result; the coordinator inspected the diff and reran the focused suite: 5 files, 188 tests passed. | Adapter generation test and the integrated Propose template, documentation, generation/update, and artifact changes | No product or contract changes. The duplicate formatting computation was consolidated within the existing test scope; no uncertain cleanup was applied. |

### 3. Verify

| Round | Fresh worker | Outcome | Commands / runtime evidence | Files / states reviewed | Findings and resolution |
| --- | --- | --- | --- | --- | --- |
| 1 | Carver (`019fd1f3-86af-7312-b3ea-e9f6ed39a282`) | passed | Fresh read-only worker ran the canonical preflight: `pnpm test` reported 74 files / 1,450 tests with 1,446 passed; the three user-authorized pre-existing failures remained isolated, and one `artifact-workflow.test.ts` resource timeout passed on isolated rerun (`69/69`). Focused suite passed (5 files / 188 tests), `superpowers validate add-propose-interview-gate`, `pnpm run build` in a temporary copy, `pnpm exec tsc --noEmit`, `pnpm run lint`, and `git diff --check` passed. Manual Coverage: 9/9 rows passed. | All 12 tasks, 6 requirements, 16 scenarios, shared skill/command projections, pre-confirmation write boundary, adaptive interview, three-state gate, proposal/design handoff, fallback, adapter/update/path behavior, and post-confirmation review ordering | No CRITICAL, WARNING, or SUGGESTION requiring repair. E2E is scope-backed `not applicable`: this change affects generated instructions/CLI/docs and has no runnable browser/UI journey. Windows was not run locally; path-aware fixtures and the existing `windows-latest`/`windows-pwsh` CI matrix provide the documented coverage. |

### 4. Design Verify

| Round | Fresh worker | Outcome | Commands / runtime evidence | Files / states reviewed | Findings and resolution |
| --- | --- | --- | --- | --- | --- |
| 1 | Rawls (`019fd1fc-c600-76e0-90aa-b6d6eaf03854`) | not applicable | Fresh read-only worker inspected `superpowers status --change add-propose-interview-gate --json`, the integrated diff, and repository visual-source paths. No UI runtime, browser, or screenshot was started because the diff has no runnable product UI route or state. | `src/core/templates/workflows/propose.ts`, `docs/`, `test/`, and change artifacts; the change-local `design.md` and `schemas/spec-driven/templates/design.md` were correctly treated as technical/artifact templates, not visual sources | Scope-backed `not applicable`: no rendered route, component, interaction, responsive layout, or runtime UI state. No visual findings or repair; this is not a visual-conformance pass. |

## Deferred Coverage

| Gap | Reason Deferred | Safer Alternative / Follow-Up |
| --- | --- | --- |
| Fully automated end-to-end validation of interactive agent answers across every host | Propose is generated instruction content; host question tools and conversational state are outside this repository's runtime test surface | Cover semantic instructions statically, run representative host smoke checks, and add host-specific automation only when a stable harness exists |
| Cross-session interview resume | The agreed design intentionally has no persistent interview state or `interview.md` artifact | Confirm stop is no-write and rely on a new conversation/request rather than risking stale decision state |
