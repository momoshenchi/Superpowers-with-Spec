## File Structure

- Create:
  - `superpowers/changes/add-debug-investigation-checkpoints/proposal.md` - Motivation and scope boundary.
  - `superpowers/changes/add-debug-investigation-checkpoints/design.md` - Checkpoint architecture, evidence contract, and recovery decisions.
  - `superpowers/changes/add-debug-investigation-checkpoints/specs/debug-investigation-checkpoints/spec.md` - Normative checkpoint and bounded-investigation requirements.
  - `superpowers/changes/add-debug-investigation-checkpoints/tasks.md` - Compact implementation progress source.
  - `superpowers/changes/add-debug-investigation-checkpoints/test-plan.md` - Coverage matrix and post-implementation Test Hardening evidence.
  - `test/core/debug-investigation-checkpoint-guidance.test.ts` - Static guidance, generated-template parity, visual evidence, and cross-platform path assertions.
  - `skills/systematic-debugging/test-pressure-4.md` - Compaction/no-progress pressure scenario.
- Modify:
  - `skills/systematic-debugging/SKILL.md` - Per-track phases, checkpoint schema, evidence ledger, visual evidence, and recovery rules.
  - `src/core/templates/workflows/explore.ts` - Generated explore skill and `/sp:explore` command checkpoint guidance.
  - `skills/using-superpowers/SKILL.md` - Diagnostic context-churn checkpoint boundary.
  - `test/core/templates/skill-templates-parity.test.ts` - Intentional hashes for the changed explore templates.
- Test:
  - `test/core/debug-investigation-checkpoint-guidance.test.ts` - Focused contract suite.
  - `test/core/using-superpowers-guidance.test.ts` - Existing work-mode contract remains green with the new diagnostic signal.
  - `test/core/templates/skill-templates-parity.test.ts` - Generated source/content parity.

## Attachments

No attachments are required. The checkpoint itself supports Markdown image references and Mermaid/ASCII diagrams; no fixture image is needed for the contract tests.

## Dispatch Coordination

`tasks.md` is the source of detailed, checkbox-tracked work. Each top-level `# <number>. <scope>` heading is one **dispatch unit**: a logical allocation boundary the coordinator may assign to one worker/subagent, combine with compatible units, or execute inline. It is not a live subagent identity. Legacy `# <number>. agent<logical-id> — <scope>` headings remain acceptable.

| Unit | Scope | Ownership | Dependencies | Assignee policy | Parallel | Handoff |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Checkpoint contract tests | `test/core/debug-investigation-checkpoint-guidance.test.ts`, `skills/systematic-debugging/test-pressure-4.md` | None | Prefer one worker because tests define the shared contract; coordinator may execute inline | No; Unit 2 depends on the red assertions | Failing focused test output, scenario file, and self-review of requirement coverage |
| 2 | Guidance implementation | `skills/systematic-debugging/SKILL.md`, `src/core/templates/workflows/explore.ts`, `skills/using-superpowers/SKILL.md` | Unit 1 red tests | Prefer one worker owning all guidance to keep terminology identical; coordinator may execute inline | No; shared checkpoint vocabulary and test feedback | Passing focused contract tests, changed guidance paths, and evidence that explore remains read-only |
| 3 | Distribution parity and validation | `test/core/templates/skill-templates-parity.test.ts`, `test/core/using-superpowers-guidance.test.ts`, full build/lint/test outputs | Unit 2 integrated | Coordinator owns integration and final validation; no parallel writer | No; requires integrated guidance | Updated hashes, focused test output, full validation report, and baseline-failure separation |

## Execution Boundaries

### 1. Checkpoint contract tests

- Deliver every detailed checkbox in Unit 1.
- Tests must use project-relative paths through `path.join()`/`path.resolve()` and must not hardcode POSIX separators.
- Keep the test focused on observable guidance contracts; it does not execute an LLM or require image OCR.
- Run the named focused tests and self-review before handing off the failing contract to Unit 2.

### 2. Guidance implementation

- Deliver every detailed checkbox in Unit 2.
- Preserve the systematic-debugging Iron Law, four phases, TDD references, and explore-mode no-implementation guardrail.
- Use the same status names, section names, evidence types, and no-progress threshold across all three guidance surfaces.
- Run focused tests and self-review before handoff; do not update parity hashes until content is correct.

### 3. Distribution parity and validation

- Deliver every detailed checkbox in Unit 3 after Units 1 and 2 are integrated.
- Update only hashes caused by the intentional explore template change; do not mask unrelated baseline failures.
- Record known missing/stale change-review and subagent-guidance failures separately from this change's results.
- Perform one final cross-unit review after all units are integrated.

## Dispatch Execution

The five steps below are task-level execution detail, not separate subagent assignments or 2–5 minute work units. Checkbox completion remains only in `tasks.md`.

### 1. Checkpoint contract tests

#### Task 1.1: Add focused guidance-contract tests

**Files:**
- Create: `test/core/debug-investigation-checkpoint-guidance.test.ts` — Read static guidance with `path.join(process.cwd(), ...)`, import `getExploreSkillTemplate` and `getSpExploreCommandTemplate`, and assert the checkpoint contract.

1. **Step 1: Write focused red assertions** — Add a canonical checkpoint fixture using the exact section and field names in `design.md`, then test `Scope and Track Map`, `Evidence Ledger`, `Visual Analysis`, `Handoff / Next Action`, track statuses `OPEN/CONFIRMED/BLOCKED/HANDED_OFF`, hypothesis statuses `PROPOSED/TESTING/CONFIRMED/REFUTED`, source/test/runtime/log/image/diagram evidence, Mermaid/ASCII/data-flow guidance, phase exit criteria, two-action no-progress escalation, reread reasons, fresh-context recovery, and explore read-only handoff. Assert representative source/runtime/image entries and diagram node/edge references link to Evidence IDs; assert the generated skill and command expose the same required concepts. (R1–R7)
2. **Step 2: Run the focused tests** — Run `npm test -- test/core/debug-investigation-checkpoint-guidance.test.ts`. Expect assertion failures because the checkpoint contract is not yet present; confirm there are no import, path, or test-collection errors.
3. **Step 3: Implement the test contract** — Keep the assertions explicit and stable, using semantic phrases/sections rather than hashes or implementation details. Use `path.join()` for every repository path and include a Windows-style display-path case without parsing slash separators.
4. **Step 4: Run focused verification** — Re-run the same command after the guidance implementation in Unit 2; expect the new contract tests to pass and to report both generated explore variants.
5. **Step 5: Self-review and handoff** — Map each assertion group to R1–R7 in `specs/debug-investigation-checkpoints/spec.md`, report the intentional red baseline, and hand off the exact failing output to Unit 2.

#### Task 1.2: Add a compaction/no-progress pressure scenario

**Files:**
- Create: `skills/systematic-debugging/test-pressure-4.md` — Scenario where one track is confirmed, one remains open, and repeated compaction would otherwise trigger broad rereads.

1. **Step 1: Write the scenario** — Define a concrete multi-symptom investigation, include a prior checkpoint with evidence IDs, two no-progress rereads, and a fresh-context handoff. Require the agent to preserve the confirmed conclusion and select one next experiment for the open track. (R1, R3, R5, R6, R7)
2. **Step 2: Run the focused contract test** — Run `npm test -- test/core/debug-investigation-checkpoint-guidance.test.ts`; expect the test to fail until it can find the new scenario and its required pressure terms.
3. **Step 3: Implement the scenario content** — Keep it provider- and repository-neutral, include code anchors, a test result, an image/diagram limitation, and an explicit blocked/escalation option. Do not instruct the simulated agent to modify application code while in explore mode.
4. **Step 4: Run focused verification** — Re-run the focused test and expect the scenario-content assertions to pass.
5. **Step 5: Self-review and handoff** — Check that the scenario exercises requirements 1, 3, 5, and 6 without duplicating the existing pressure scenarios; report its path and coverage.

#### Task 1.3: Verify the red baseline

**Files:**
- Test: `test/core/debug-investigation-checkpoint-guidance.test.ts` — Focused red-test evidence.

1. **Step 1: Select the command** — Use `npm test -- test/core/debug-investigation-checkpoint-guidance.test.ts` from the repository root.
2. **Step 2: Capture expected failure** — Confirm failures identify missing checkpoint terms, not malformed TypeScript or missing files.
3. **Step 3: Do not weaken assertions** — Keep the failed assertions as the contract that the guidance must satisfy.
4. **Step 4: Re-run after Unit 2** — Require a green result before Unit 2 can be marked complete.
5. **Step 5: Handoff** — Report the red output and the exact assertion groups to the guidance owner.

### 2. Guidance implementation

#### Task 2.1: Extend systematic debugging guidance

**Files:**
- Modify: `skills/systematic-debugging/SKILL.md` — Add the reusable Debug Checkpoint contract and bounded recovery rules.

1. **Step 1: Read the red assertions and current skill** — Preserve the existing Iron Law, four-phase order, single-hypothesis rule, supporting-technique references, and current user-authored wording outside the intended additions.
2. **Step 2: Run the focused tests** — Run `npm test -- test/core/debug-investigation-checkpoint-guidance.test.ts`; confirm the checkpoint assertions fail before editing the skill.
3. **Step 3: Implement the minimum guidance** — Add a trigger section, a copyable Markdown checkpoint skeleton, per-track statuses and phase exit gates, an evidence ledger with source/test/runtime/log/image/diagram fields, visual caption/limitation rules, reread budget, two-action no-progress escalation, and compaction/fresh-worker recovery. Explicitly state that images/diagrams explain evidence but do not replace executable verification.
4. **Step 4: Run focused verification** — Run `npm test -- test/core/debug-investigation-checkpoint-guidance.test.ts`; expect the static skill assertions to pass while generated-template assertions may remain red until Task 2.2 is complete.
5. **Step 5: Self-review and handoff** — Verify the addition does not permit fixes before root-cause investigation, does not merge independent tracks, and does not force checkpoints for trivial one-turn bugs. Report the changed sections and test output.

#### Task 2.2: Extend generated explore guidance

**Files:**
- Modify: `src/core/templates/workflows/explore.ts` — Update both `getExploreSkillTemplate` and `getSpExploreCommandTemplate` with the same checkpoint and visual-evidence contract.

1. **Step 1: Compare both template bodies** — Identify their shared opening, guardrails, visualization guidance, ending-discovery text, and the duplicate content that must remain semantically aligned.
2. **Step 2: Run focused tests** — Run `npm test -- test/core/debug-investigation-checkpoint-guidance.test.ts`; confirm generated explore assertions still fail before editing.
3. **Step 3: Implement the minimum guidance** — Add a multi-turn/compaction trigger, the checkpoint sections and evidence examples, Mermaid/ASCII flow/data/state diagrams, image path/caption/uncertainty guidance, one-next-experiment recovery, and read-only handoff to Proposal/implementation. Keep ordinary creative exploration flexible and do not turn `/sp:explore` into an implementation workflow.
4. **Step 4: Run focused verification** — Run the focused guidance test and `npm test -- test/core/templates/skill-templates-parity.test.ts`. Expect semantic guidance tests to pass; parity hash assertions will be updated in Unit 3 only after content review.
5. **Step 5: Self-review and handoff** — Compare generated skill and command content for the same required terms, verify code examples do not claim screenshots are E2E proof, and report the template functions changed.

#### Task 2.3: Extend work-mode context-churn guidance

**Files:**
- Modify: `skills/using-superpowers/SKILL.md` — Add diagnosis-time checkpoint/fresh-context escalation alongside existing Proposal promotion rules.

1. **Step 1: Read current context-churn and promotion rules** — Keep the two-mode model, workload rubric, Proposal/Dispatch Unit boundary, and artifact guidance unchanged.
2. **Step 2: Run focused tests** — Run `npm test -- test/core/debug-investigation-checkpoint-guidance.test.ts test/core/using-superpowers-guidance.test.ts`; confirm the new diagnostic assertions fail before editing.
3. **Step 3: Implement the minimum guidance** — State that repeated broad diagnostic rereads require a checkpoint before further inspection; distinguish a read-only fresh-context handoff from promoting implementation work to a Proposal; direct agents to preserve evidence and not silently restart broad scans.
4. **Step 4: Run focused verification** — Run both focused test files and expect existing work-mode assertions plus the new context-churn assertions to pass.
5. **Step 5: Self-review and handoff** — Check that this addition does not create a third work mode or a mandatory new Proposal artifact; report the exact promotion/checkpoint boundary.

### 3. Cross-tool parity and verification

#### Task 3.1: Update generated template parity

**Files:**
- Modify: `test/core/templates/skill-templates-parity.test.ts` — Replace only hashes generated from the intentional `explore.ts` changes.

1. **Step 1: Capture semantic test evidence** — Run `npm test -- test/core/debug-investigation-checkpoint-guidance.test.ts test/core/templates/skill-templates-parity.test.ts` and confirm only the expected explore hashes differ after the content is final.
2. **Step 2: Generate actual hashes** — Use the parity test's existing hash output or a small read-only Node command to compute the current `getExploreSkillTemplate`, `getSpExploreCommandTemplate`, and `superpowers-explore` generated-content hashes.
3. **Step 3: Update exact expected values** — Change only those entries in `test/core/templates/skill-templates-parity.test.ts`; do not rewrite unrelated expected hashes or suppress parity checks.
4. **Step 4: Run focused verification** — Run `npm test -- test/core/templates/skill-templates-parity.test.ts test/core/debug-investigation-checkpoint-guidance.test.ts`; expect parity and semantic tests to pass.
5. **Step 5: Self-review and handoff** — Confirm generated skill and command source both include the new contract and that the hash diff is limited to the intended explore outputs.

#### Task 3.2: Verify cross-platform path handling

**Files:**
- Test: `test/core/debug-investigation-checkpoint-guidance.test.ts` — Use `path.join()`/`path.resolve()` and check Windows-style display paths without slash assumptions.

1. **Step 1: Define path cases** — Cover a POSIX workspace path, a Windows-style display path, an image reference, and a source anchor. Keep path joining in Node's `path` API rather than string concatenation.
2. **Step 2: Run the focused path test** — Run `npm test -- test/core/debug-investigation-checkpoint-guidance.test.ts`; confirm the baseline behavior is represented by a failing assertion if the path rule is absent.
3. **Step 3: Implement path-safe assertions/guidance** — Ensure the test validates display/anchor semantics without trying to normalize a foreign platform path using the host separator. Use the repository's existing Windows-capable CI job when available.
4. **Step 4: Run verification** — Run the focused test on the local host and the existing Windows CI/Windows-compatible Node environment when available; expect identical semantic results. If no Windows runner exists, record that limitation explicitly in `test-plan.md` rather than claiming a Windows pass.
5. **Step 5: Self-review and handoff** — Check all new repository path assertions use `path.join()`/`path.resolve()` and report the environment used.

#### Task 3.3: Run full validation and separate baseline failures

**Files:**
- Test: `test/core/debug-investigation-checkpoint-guidance.test.ts`, `test/core/using-superpowers-guidance.test.ts`, `test/core/templates/skill-templates-parity.test.ts`.
- Modify: `superpowers/changes/add-debug-investigation-checkpoints/test-plan.md` — Record actual coverage and validation evidence.

1. **Step 1: Run focused preflight** — Run `npm test -- test/core/debug-investigation-checkpoint-guidance.test.ts test/core/using-superpowers-guidance.test.ts test/core/templates/skill-templates-parity.test.ts` and confirm the new contract is green.
2. **Step 2: Run build and lint** — Run `npm run build` and `npm run lint`; record exact commands and outcomes.
3. **Step 3: Run the full suite** — Run `npm test`; classify failures against the baseline: the known seven failures from missing/stale `change-review`/subagent guidance and any new failure caused by this change.
4. **Step 4: Implement only scoped repairs** — If this change introduces a failure, repair the guidance/test/parity scope and rerun the affected command. Do not repair unrelated baseline files in this change.
5. **Step 5: Self-review and final handoff** — Review the complete diff against all seven requirements (R1–R7), record focused/full validation and baseline separation in `test-plan.md`, and hand off to the single final cross-unit review.

## Final Integration Review and Validation

- Integrate Units 1–3 before formal review.
- Perform one cross-unit review covering requirement mapping, identical terminology across static/generated guidance, visual-evidence limits, recovery/no-progress behavior, path portability, and test coverage.
- Fix accepted blocking findings and run targeted verification; do not start a second complete review unless the reviewer explicitly requests confirmation of a specified finding.
- Record post-implementation Test Hardening evidence in `test-plan.md`, including the known baseline failures and any Windows-environment limitation.
