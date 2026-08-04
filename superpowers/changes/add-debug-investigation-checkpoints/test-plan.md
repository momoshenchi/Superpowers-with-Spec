## Testing Gap Analysis

The existing `skills/systematic-debugging/test-pressure-1.md` through `test-pressure-3.md` cover resisting quick fixes, sunk-cost shortcuts, and authority pressure. They do not cover context compaction, durable evidence recovery, independent issue tracks, confirmed-track closure, image/diagram evidence limits, or repeated reread escalation. Existing work-mode guidance tests cover Proposal sizing and context churn before implementation, but do not assert a diagnosis-time checkpoint boundary. Existing template parity tests detect generated-content drift but do not validate the semantic checkpoint contract.

This change adds a focused static guidance contract test, a fourth pressure scenario, explicit semantic parity assertions for the generated explore skill/command, and cross-platform path checks. Worker-level verification belongs in the detailed task blocks in `tasks.md`; this file records the integrated Test Hardening matrix and later full-validation evidence.

The initial full-suite baseline has seven known failures: `test/core/change-review-guidance.test.ts` cannot read `skills/change-review/SKILL.md`; `test/core/subagent-work-package-guidance.test.ts` expects the missing `Legacy` wording and cannot read `skills/subagent-driven-development/code-quality-reviewer-prompt.md`; `test/core/templates/change-review.test.ts` expects `coordinator chooses`; `test/core/templates/design-conventions.test.ts` cannot read `skills/change-review/SKILL.md`; and `test/core/templates/skill-templates-parity.test.ts` reports stale `getChangeReviewSkillTemplate`, `getSpReviewCommandTemplate`, and generated `superpowers-change-review` hashes. These signatures are unrelated to this change and must remain separately classified.

## Requirement And Scenario Coverage Matrix

| Requirement / Scenario | Planned Coverage | Status | Notes |
| --- | --- | --- | --- |
| R1 / One report contains two independent symptoms | Unit/static guidance | passed | `npm test -- test/core/debug-investigation-checkpoint-guidance.test.ts`: 6/6; separate `CONFIRMED` and `OPEN` track language is present. |
| R1 / A hypothesis is disproved | Unit/static guidance | passed | Same focused suite checks `REFUTED` while the track remains `OPEN`. |
| R2 / Checkpoint records code and test evidence | Unit/static guidance | passed | Stable IDs, source/command, anchors, observations, implications, and confidence/limitations asserted. |
| R2 / Checkpoint records runtime and log evidence | Unit/static guidance | passed | Boundary entry/exit, environment, artifact, and reproducibility fields asserted. |
| R3 / Screenshot shows a state mismatch | Unit/static guidance | passed | Caption, capture context, visible facts, inferred cause, and limitations asserted; temporary rendered check completed. |
| R3 / Diagram explains a multi-component path | Unit/static guidance | passed | Mermaid/ASCII/data-flow support and Evidence ID links asserted. |
| R4 / Phase 1 exit criteria | Unit/static guidance | passed | Reproduction-or-blocked, narrowed boundary, and evidence requirements asserted. |
| R4 / Phase 2 exit criteria | Unit/static guidance | passed | Working-vs-broken comparison and prioritized difference asserted. |
| R4 / Phase 3/4 TDD and verification boundary | Unit/static guidance | passed | One hypothesis/experiment and failing-test-before-fix language asserted. |
| R4 / Missing runtime prerequisite | Unit/static guidance | passed | `BLOCKED` with exact prerequisite and no broad reread rule asserted. |
| R5 / Fresh context resumes after compaction | Unit/static guidance and pressure scenario | passed | Focused suite plus fresh-worker report for `test-pressure-4.md`; only the open track resumed. |
| R5 / Checkpoint contains a local Windows path | Unit/static guidance | covered | `path.join()`/`path.resolve()` assertions pass on Darwin and preserve foreign display separators; actual Windows runner deferred below. |
| R6 / Repeated rereads produce no new fact | Unit/static guidance and pressure scenario | passed | Probe/fresh-context/blocked escalation and no silent loop asserted. |
| R6 / A source file changed during investigation | Unit/static guidance | passed | Changed revision/new anchor/hypothesis slice is recorded as reread reason. |
| R7 / Exploration reaches a confirmed root cause | Unit/static guidance | passed | Generated explore guidance requires checkpoint evidence and a read-only handoff. |
| R2/R3/R5 / Generated skill/command semantic parity | Integration/template | passed | Both generated surfaces pass the 6-test semantic contract suite. |
| R2/R3/R5 / Generated template hash parity | Integration/template | covered | Explore function/content hashes updated and match; only the two known change-review hash families remain red. |
| R1–R7 / Full CLI/build/lint regression | Integration | covered | Build and lint exit 0; full suite: 1434 passed, 7 known baseline failures, 0 new failures. |

## Boundary And Abnormal Case Sweep

| Surface | Cases To Attack | Coverage Decision | Status |
| --- | --- | --- | --- |
| Inputs and validation | Empty checkpoint, missing track, missing next experiment, unsupported evidence type | Static guidance assertions require named sections/types and one next experiment | passed |
| State and repeat actions | Confirmed sibling plus open sibling, refuted hypothesis, compaction, repeated reread, no-progress | Pressure scenario plus semantic contract test | passed |
| Permissions and ownership | Explore agent attempts application edit; fresh worker receives only checkpoint | Static explore guidance assertion; no product authorization surface | passed |
| Filesystem and paths | POSIX path, Windows-style display path, image reference, source anchor, nested path | Node path API assertions; actual Windows runner deferred below | covered |
| External and integration points | Runtime probe, logs, browser/screenshot evidence, generated/static guidance distribution | Static evidence schema and generated template parity; no live browser required for process-only change | covered |

## Non-Critical Path Sweep

| Path | Why It Matters | Coverage / Rationale |
| --- | --- | --- |
| Visual evidence limitation note | Prevents screenshots/diagrams from being misreported as executable proof | Static contract test and pressure scenario |
| `BLOCKED` prerequisite path | Prevents endless source rereads when runtime access is unavailable | Static contract test |
| Existing one-turn debugging | Avoids imposing checkpoint overhead on trivial work | Inspect guidance wording and test that triggers are multi-turn/compaction/reread-loop based |
| Generated command vs generated skill drift | Users may invoke either surface | Semantic parity assertions and hash parity |
| Known repository baseline failures | Prevents unrelated missing/stale guidance files from hiding this change's outcome | Full-suite report classifies seven baseline failures separately |

## Manual Coverage

| Check / Scenario | Execution Method and Environment | Status | Evidence |
| --- | --- | --- | --- |
| Resume a simulated debugging conversation after a context boundary | Fresh worker read the checkpoint first, preserved one confirmed and one open track, and selected only the open track's experiment | passed | Fresh-worker report: T1 `CONFIRMED` stayed closed; T2 `OPEN` received the boundary probe; no files changed. |
| Inspect a checkpoint containing source excerpt, test output, screenshot, Mermaid flow, and data-flow diagram | Open temporary Markdown checkpoint in Codex panel and inspect referenced repository image; verify captions/limitations and diagram are visible | passed | `/tmp/debug-checkpoint-manual.md` opened/queued in Codex; `/Volumes/rep/Superpowers-with-Spec/assets/openspec_bg.png` rendered and visually inspected; temporary file is not part of the change. |
| Exercise explore-mode handoff after confirmed root cause | Fresh worker inspected generated `/sp:explore` surface and simulated a small issue through evidence capture to read-only handoff | passed | Fresh-worker report plus unchanged git status: confirmed root cause hands off to Proposal/implementation mode and forbids application-code edits in explore. |
| Run path/reference checks on Windows | Local focused Vitest path case on Darwin; repository CI defines a `windows-latest`/`pwsh` matrix but no Windows runtime is attached to this worktree | not applicable | This change adds documentation/path-display guidance only; Windows execution is deferred, while POSIX/foreign-display semantics pass locally. |

## Deferred Coverage

| Gap | Reason Deferred | Safer Alternative / Follow-Up |
| --- | --- | --- |
| Automatic host-level detection of actual context-token pressure | Requires Codex/host telemetry and is outside static skill distribution | Use explicit compaction/fresh-worker triggers and revisit after observing real sessions |
| CLI-managed checkpoint persistence and indexing | No current requirement for a new CLI state store; adding one would widen schema and migration scope | Emit the Markdown checkpoint in the response and save an identical handoff file when needed |
| Automated OCR/image semantic validation | Would add external tooling and cannot establish backend causality from a screenshot | Require captions, source context, limitations, and separate executable verification |
| Windows-runner execution of the path case | Current host is Darwin and this unpushed worktree has no attached Windows runner; the repository CI matrix is the follow-up environment | Keep the `path.join()`/`path.resolve()` contract test and run the same focused file in the existing `windows-latest` CI job before release |

## Post-Implementation Test Hardening

### Canonical non-visual preflight

The repository `package.json` defines the canonical non-visual commands as
`npm run build`, `npm run lint`, and `npm test`; visual-only checks are excluded
because this change modifies process guidance and templates, not a runnable UI.

| Command | Authority | Fresh result |
| --- | --- | --- |
| `npm run build` | `package.json` `scripts.build` | passed, exit 0 |
| `npm run lint` | `package.json` `scripts.lint` | passed, exit 0 |
| `npm test` | `package.json` `scripts.test` | 1434 passed; 7 pre-existing baseline failures; no new failures |
| focused guidance/parity suite | change `test-plan.md` and `tasks.md` | checkpoint + using-superpowers tests pass; explore parity passes; only unrelated change-review hashes remain baseline-red |

### Integrated outcomes

- Added and ran the 6-test checkpoint contract suite and pressure scenario.
- Added path-safe `path.join()`/`path.resolve()` assertions and verified POSIX plus foreign Windows-display path semantics.
- Verified build and lint after integration.
- Full-suite failures remain exactly the seven signatures documented in the
  baseline paragraph above; none touches the changed guidance or new pressure
  scenario.

## Final Quality Gates

### Host-native code review — round 1

- **Fresh worker:** Poincare (`019fcc42-f7da-7721-8b42-0ff8e192c05f`), independent equivalent review because no separately named host-native reviewer was available.
- **Outcome:** passed; no P0/P1/BLOCKER findings.
- **Evidence:** Reviewed the integrated diff and all R1–R7 artifacts; focused guidance 6/6, using-superpowers 10/10, build/lint exit 0, full suite 1434 passed with the seven documented baseline failures, validate and diff-check passed.
- **Finding and resolution:** P2 at the path test did not execute `path.resolve()` or validate source/image resolution. Accepted and repaired by adding absolute-path and `path.relative()` assertions for both references; fresh checkpoint test passed 6/6. P2 did not require a new review round.
- **Not applicable:** Windows execution, browser/E2E, host token telemetry, CLI persistence, and OCR/image semantics remain outside this change or deferred as documented above.

### Simplify — pass 1

- **Fresh worker:** Godel (`019fcc48-0dba-7dd2-9204-9d1505045fcf`), behavior-preserving cleanup scope.
- **Outcome:** passed.
- **Evidence:** Reviewed all owned files and both generated explore surfaces; focused guidance tests 16/16, build exit 0, lint exit 0, diff-check passed; explore hashes passed and only unrelated change-review parity hashes remain baseline-red.
- **Cleanup:** Cached the pressure-scenario `existsSync()` result in `test/core/debug-investigation-checkpoint-guidance.test.ts`; coordinator independently inspected the change and reran the two affected guidance files, 16/16 passed.
- **Not applicable:** No product routes/UI journey, Windows runtime, or unrelated baseline repair was in scope.

### Verify — round 1

- **Fresh worker:** Hooke (`019fcc4c-5433-7510-ab2b-287095a10dc7`), read-only.
- **Outcome:** passed; no P0/P1/P2/BLOCKER findings.
- **Evidence:** Fresh `npm run build` and `npm run lint` exit 0; fresh `npm test` reports 1434/1441 passed with exactly the seven documented baseline failures; checkpoint 6/6, using-superpowers 10/10, and parity 6/8 (only unrelated change-review hash failures) reproduced; validate and diff-check exit 0.
- **Requirement coverage:** R1–R7 mapped to the changed skill/template/test files; all manual scenarios reviewed.
- **E2E:** not applicable with scope evidence: only skills, templates, tests, and change artifacts changed; no product route, runtime, API, persisted data, or browser journey exists.
- **Not applicable:** Windows runner, browser/E2E, host token telemetry, CLI persistence, and OCR/image semantics are deferred or outside scope as recorded above.

### Design Verify — round 1

- **Fresh worker:** Peirce (`019fcc52-dc66-7f10-911c-9c74673b46c7`), read-only.
- **Outcome:** not applicable.
- **Design source discovery:** No repository visual identity source was found at the repository root or docs/project-context paths; the change-local `design.md` is technical design and not a visual identity file.
- **Scope evidence:** The diff contains only Markdown guidance, a prompt-template generator, static tests/parity hashes, and change artifacts. No route, component, JSX/CSS/HTML, interaction, responsive behavior, persisted data, or product runtime changed. The manual PNG inspection was guidance evidence, not product UI.
- **Commands/evidence:** focused checkpoint 6/6, using-superpowers 10/10, parity 6/8 with only baseline change-review hash failures, and diff-check passed.
- **Findings:** none; no UI conformance or blocker exists. Browser route, responsive/accessibility states, and visual DESIGN.md conformance are not applicable by scope.
