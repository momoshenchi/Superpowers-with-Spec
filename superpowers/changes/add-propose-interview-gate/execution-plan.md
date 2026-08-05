## File Structure

- Modify:
  - `src/core/templates/workflows/propose.ts` - Add the shared adaptive-interview, summary, confirmation, and artifact-handoff guidance to both Propose projections.
  - `docs/workflows.md` - Document the proportional Propose preflight and confirmation gate.
  - `docs/opsx.md` - Keep the default quick-path explanation aligned with the new gate.
- Test:
  - `test/core/templates/skill-templates-parity.test.ts` - Verify both Propose projections expose the same interview contract and update intentional content hashes.
  - `test/core/templates/change-review.test.ts` - Preserve the automatic review contract while asserting review remains post-confirmation artifact work.
  - `test/core/shared/skill-generation.test.ts` - Verify generated skill content carries the updated Propose guidance.
  - `test/core/update.test.ts` - Verify update emission writes the changed Propose skill and command content through project-relative paths.
  - `test/core/command-generation/adapters.test.ts` - Verify representative adapters preserve the shared Propose command body while formatting host-specific frontmatter and paths.

## Attachments

<!-- No supporting attachments are required. -->

## Dispatch Coordination

`tasks.md` is the source of detailed, checkbox-tracked work. Each top-level `# <number>. <scope>` heading is one **dispatch unit**: a logical allocation boundary the coordinator may assign to one worker/subagent, combine with compatible units, or execute inline. It is not a live subagent identity. These units are deliberately serialized because Units 1 and 2 share the canonical Propose template and Unit 3 validates their integrated output.

| Unit | Scope | Ownership | Dependencies | Assignee policy | Parallel | Handoff |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Propose interview contract | `src/core/templates/workflows/propose.ts` and focused template assertions | Proposal, specs, design complete | Coordinator executes inline or assigns one worker; one owner for the shared template | No; all tasks touch the same workflow source | Changed template/test files, focused Vitest result, and a self-review confirming one semantic interview source |
| 2 | Confirmed-decision handoff and documentation | `src/core/templates/workflows/propose.ts`, `docs/workflows.md`, `docs/opsx.md`, review-contract assertions | Unit 1 integrated | Coordinator executes inline or assigns one worker after Unit 1 handoff | No; Unit 2 extends Unit 1's shared source and docs | Changed source/docs/tests, focused results, and a self-review confirming post-confirmation flow was preserved |
| 3 | Parity, generation, and final validation | `test/core/templates/skill-templates-parity.test.ts`, `test/core/shared/skill-generation.test.ts`, `test/core/update.test.ts`, `test/core/command-generation/adapters.test.ts`, full repository checks | Units 1–2 integrated | Prefer a fresh validation worker for independent evidence; coordinator owns repairs and final integration | No; validates the integrated shared output and serializes any hash repairs | Test results from all named files, generated-content evidence, Windows matrix result, validation/build/lint/full-suite results |

## Execution Boundaries

### 1. Propose interview contract

- Deliver every detailed checkbox in Unit 1.
- Keep the interview guidance reusable and semantically identical in the skill and command projections.
- Do not change the schema, CLI runtime, artifact graph, or post-confirmation review behavior.
- Run the focused template tests and self-review before handing off to Unit 2.

### 2. Confirmed-decision handoff and documentation

- Deliver every detailed checkbox in Unit 2 after Unit 1 is integrated.
- Keep product decisions routed to `proposal.md` and technical decisions routed to `design.md`.
- Keep the explicit artifact list and dependency-ordered artifact loop unchanged.
- Run focused tests and documentation checks before handing off to Unit 3.

### 3. Parity, generation, and final validation

- Deliver every detailed checkbox in Unit 3 after Units 1–2 are integrated.
- Treat `tasks.md` as the only implementation progress source; this plan records execution guidance, not task status.
- Update exact hashes only when the generated content change is intentional and verified.
- Run the complete validation set before declaring the change ready for review.

## Dispatch Execution

Expand every detailed task from `tasks.md` beneath its dispatch unit. These steps explain how to execute a feature-scale task; they are not separate subagent assignments or required 2–5 minute units. Keep checkbox completion only in `tasks.md`. Use clean `### <number>.<task-number> <scope>` headings.

## Implementation Notes

After any Step 1–5, a worker MAY append a concise `#### Implementation Notes` subsection directly below that step when implementation produces useful knowledge. These notes are non-normative narrative context, not an execution status tracker, and do not replace `tasks.md` progress or verification evidence. They must not contain task checkboxes, status fields, or a second completion model. When parallel work is ever introduced, the coordinator serializes writes to this shared file or appends worker notes after handoff.

### 1.1 Shared interview guidance fragment

**Files:**
- Modify: `src/core/templates/workflows/propose.ts` - Define one reusable interview guidance fragment and include it in both Propose projections.
- Test: `test/core/templates/skill-templates-parity.test.ts` - Assert both projections contain the fragment's stable contract markers and retain the existing artifact flow.

1. **Step 1: Write or extend focused tests** — Add a focused assertion for a new stable interview-contract marker in both `getSpProposeSkillTemplate().instructions` and `getSpProposeCommandTemplate().content`, while keeping the existing `execution-plan.md`, `applyRequires`, and review assertions.
2. **Step 2: Run the focused tests** — Run `pnpm exec vitest run test/core/templates/skill-templates-parity.test.ts`; confirm the new marker fails because the baseline Propose templates do not contain the interview fragment.
3. **Step 3: Implement the shared fragment** — Add a single local template fragment in `src/core/templates/workflows/propose.ts` and interpolate it into the skill and command instruction strings without changing template metadata, command IDs, or host adapters.
4. **Step 4: Run focused verification** — Rerun the same Vitest file and confirm the new marker and all existing parity assertions pass.
5. **Step 5: Self-review and handoff** — Inspect the diff for duplicated semantic guidance, confirm both projections render the same fragment, and report the focused test result before handing the shared source to Unit 2.

### 1.2 Adaptive trigger and zero-question path

**Files:**
- Modify: `src/core/templates/workflows/propose.ts` - Document fact discovery, decision classification, trigger conditions, and the allowed zero-question path.
- Test: `test/core/templates/skill-templates-parity.test.ts` - Assert the trigger list and zero-question confirmation language appear in both projections.

1. **Step 1: Write or extend focused tests** — Add assertions for read-only fact discovery, the explicit zero-question path, and the trigger categories covering scope/acceptance ambiguity and high-impact technical choices.
2. **Step 2: Run the focused tests** — Run `pnpm exec vitest run test/core/templates/skill-templates-parity.test.ts`; verify the new trigger assertions fail against the baseline guidance.
3. **Step 3: Implement adaptive policy** — Add concise instructions that facts are discovered from the environment, user-owned decisions are asked only when unresolved or consequential, and a clear request may proceed with zero interview questions before the final summary gate.
4. **Step 4: Run focused verification** — Rerun the template parity test and confirm both projections expose identical trigger and zero-question behavior without introducing a fixed questionnaire.
5. **Step 5: Self-review and handoff** — Check that routine local implementation details remain agent-owned, high-impact categories are explicit, and the quick path is still described accurately.

### 1.3 One-at-a-time question format

**Files:**
- Modify: `src/core/templates/workflows/propose.ts` - Define the structured question format, recommendation behavior, delegation handling, and host fallback.
- Test: `test/core/templates/skill-templates-parity.test.ts` - Assert the one-question, recommendation, alternatives, free-form, and fallback contract.

1. **Step 1: Write or extend focused tests** — Add assertions for “one question at a time,” known facts, decision impact, recommended answer, meaningful alternatives, free-form response, waiting for the answer, and plain-conversation fallback.
2. **Step 2: Run the focused tests** — Run `pnpm exec vitest run test/core/templates/skill-templates-parity.test.ts`; confirm the new interaction assertions fail before implementation.
3. **Step 3: Implement question guidance** — Add the unified question format and state that a delegated decision adopts the disclosed recommendation and triggers dependent-decision re-evaluation when necessary.
4. **Step 4: Run focused verification** — Rerun the parity test and confirm the same question contract is present in both generated projections.
5. **Step 5: Self-review and handoff** — Verify unrelated decisions are not batched, the recommendation does not masquerade as a user fact, and the fallback does not require a new runtime dependency.

### 1.4 Summary and three-state gate

**Files:**
- Modify: `src/core/templates/workflows/propose.ts` - Define decision closure, final summary, and the three semantic outcomes.
- Test: `test/core/templates/skill-templates-parity.test.ts` - Assert no-write-before-confirmation, confirm/request-changes/stop outcomes, and dependent-decision re-evaluation language.

1. **Step 1: Write or extend focused tests** — Add assertions for the final summary, explicit confirmation, confirm-and-create, request-changes, stop-without-creating, and updated-summary loop.
2. **Step 2: Run the focused tests** — Run `pnpm exec vitest run test/core/templates/skill-templates-parity.test.ts`; verify the gate assertions fail against the baseline Propose instructions.
3. **Step 3: Implement the gate** — Add the decision-closed summary requirement before `superpowers new change`, require explicit confirmation even for zero-question requests, and define the three outcomes without introducing a new CLI state.
4. **Step 4: Run focused verification** — Rerun the parity test and confirm the existing change creation and artifact-review steps occur only after the confirm-and-create outcome in the instruction order.
5. **Step 5: Self-review and handoff** — Read the generated instruction flow from top to bottom, ensure request-changes keeps writes closed, and hand off the integrated template contract to Unit 2.

### 2.1 Confirmed-decision artifact routing

**Files:**
- Modify: `src/core/templates/workflows/propose.ts` - Tell the artifact author to place confirmed product decisions in `proposal.md` and high-impact technical decisions in `design.md` without creating `interview.md`.
- Test: `test/core/templates/skill-templates-parity.test.ts` - Assert the explicit routing and no-transcript contract in both projections.

1. **Step 1: Write or extend focused tests** — Add assertions for `proposal.md`, `design.md`, confirmed alternatives/rationale/trade-offs, and the absence of a separate interview artifact instruction.
2. **Step 2: Run the focused tests** — Run `pnpm exec vitest run test/core/templates/skill-templates-parity.test.ts`; verify the new routing assertions fail before the guidance is added.
3. **Step 3: Implement artifact routing** — Add the handoff guidance after confirmation while keeping the schema-defined artifact names explicit and preserving the existing instructions for reading dependencies and applying templates.
4. **Step 4: Run focused verification** — Rerun the parity test and confirm both projections route the same confirmed information to the same artifacts.
5. **Step 5: Self-review and handoff** — Check that raw Q&A is not required, technical design decisions remain in `design.md`, and the prompt does not imply a new schema artifact.

### 2.2 Preserve the post-confirmation pipeline

**Files:**
- Modify: `src/core/templates/workflows/propose.ts` - Keep artifact dependency ordering, progress reporting, automatic review, and final status after the new gate.
- Test: `test/core/templates/change-review.test.ts` - Assert the automatic proposal-review contract remains intact and is not duplicated in Apply.

1. **Step 1: Write or extend focused tests** — Add an ordering assertion that the confirm-and-create guidance precedes `superpowers new change`, while the existing review assertions still require `Dispatch a fresh change reviewer subagent` and blocker-gated re-review.
2. **Step 2: Run the focused tests** — Run `pnpm exec vitest run test/core/templates/change-review.test.ts`; record the baseline result and any expected failure from the new ordering assertion.
3. **Step 3: Preserve the pipeline** — Keep the existing `status --json`, artifact instruction loop, `applyRequires` readiness check, review rounds, and final status text unchanged except for the new pre-confirmation handoff.
4. **Step 4: Run focused verification** — Rerun `pnpm exec vitest run test/core/templates/change-review.test.ts test/core/templates/skill-templates-parity.test.ts` and confirm review behavior remains green.
5. **Step 5: Self-review and handoff** — Verify no review is initiated before artifact readiness, Apply is not given a second automatic proposal review, and Unit 2's source/docs changes are ready for final parity validation.

### 2.3 Workflow documentation

**Files:**
- Modify: `docs/workflows.md` - Explain the adaptive gate in the default quick-path and workflow-pattern sections.
- Modify: `docs/opsx.md` - Align the command overview and quick-path explanation with the new pre-confirmation behavior.

1. **Step 1: Write or extend focused tests** — Identify the exact quick-path statements with `rg -n "quick path|/sp:propose|proposal" docs/workflows.md docs/opsx.md`, then add semantic assertions for the new gate to `test/core/templates/skill-templates-parity.test.ts` so documentation and generated instructions share the same contract markers.
2. **Step 2: Run the focused tests** — Run `pnpm exec vitest run test/core/templates/skill-templates-parity.test.ts` and `git diff --check`; the new contract assertions should fail before the documentation/template wording is complete, while the baseline diff check should pass.
3. **Step 3: Implement documentation** — State that Propose performs read-only discovery, may ask zero questions, asks one question at a time only for consequential uncertainty, requires final confirmation, and can stop without creating a change.
4. **Step 4: Run focused verification** — Rerun `pnpm exec vitest run test/core/templates/skill-templates-parity.test.ts`, `git diff --check`, and `rg -n "quick path|read-only|zero questions|confirmation|stop without creating" docs/workflows.md docs/opsx.md`; expect the parity test and diff check to pass and the search to show the aligned guidance.
5. **Step 5: Self-review and handoff** — Compare the docs with `design.md` and the generated template, remove contradictory quick-path examples, and report the edited anchors to Unit 3.

### 3.1 Behavioral parity assertions

**Files:**
- Test: `test/core/templates/skill-templates-parity.test.ts` - Cover the full interview contract for skill and command projections.

1. **Step 1: Write or extend focused tests** — Group assertions for the preflight boundary, adaptive triggers, zero-question path, one-at-a-time format, technical decisions, artifact routing, three-state gate, and preserved review flow for both Propose templates.
2. **Step 2: Run the focused tests** — Run `pnpm exec vitest run test/core/templates/skill-templates-parity.test.ts`; inspect failures for missing guidance versus accidental wording drift.
3. **Step 3: Implement test coverage** — Replace overly brittle duplicate assertions with stable semantic markers where appropriate, while retaining exact parity/hash coverage required by the existing test contract.
4. **Step 4: Run focused verification** — Rerun the test file and confirm both projections pass every behavioral assertion with no unintentional differences.
5. **Step 5: Self-review and handoff** — Check every requirement and scenario in `specs/propose-interview-gate/spec.md` has at least one assertion or documented manual verification path.

### 3.2 Intentional template hashes

**Files:**
- Test: `test/core/templates/skill-templates-parity.test.ts` - Update only the expected source-function and generated-skill hashes changed by the intentional Propose guidance update.

1. **Step 1: Write or extend focused tests** — Add no new production behavior; first run the parity test to capture the exact hash mismatches caused by the approved template change.
2. **Step 2: Run the focused tests** — Run `pnpm exec vitest run test/core/templates/skill-templates-parity.test.ts` and record which Propose function/content entries differ.
3. **Step 3: Implement test fixture update** — Recompute hashes from the verified template output and update only `getSpProposeSkillTemplate`, `getSpProposeCommandTemplate`, and `superpowers-propose` entries that changed.
4. **Step 4: Run focused verification** — Rerun the parity test and confirm all non-Propose hashes remain unchanged and the updated values pass deterministically.
5. **Step 5: Self-review and handoff** — Compare the generated content diff against the approved design; reject hash changes unrelated to Propose or caused by unstable rendering.

### 3.3 Generation and adapter coverage

**Files:**
- Test: `test/core/shared/skill-generation.test.ts` - Verify generated skill content includes the new Propose guidance and metadata remains stable.
- Test: `test/core/update.test.ts` - Verify update writes the changed skill and command files through path-aware project fixtures.
- Test: `test/core/command-generation/adapters.test.ts` - Verify representative adapters preserve body content while formatting frontmatter and paths.

1. **Step 1: Write or extend focused tests** — Add assertions that generated skill content contains the approved interview markers, update fixtures locate Propose output with `path.join()`, and the Claude, Cursor, and Windsurf adapter cases in `test/core/command-generation/adapters.test.ts` retain the shared body.
2. **Step 2: Run the focused tests** — Run `pnpm exec vitest run test/core/shared/skill-generation.test.ts test/core/update.test.ts test/core/command-generation/adapters.test.ts`; expect failures only for missing guidance or newly exposed path assumptions, not for changed frontmatter contracts.
3. **Step 3: Implement test coverage** — Extend only the generation fixtures and assertions needed to cover the changed body; do not alter adapter frontmatter or introduce hard-coded platform separators.
4. **Step 4: Run focused verification** — Rerun the three test files and confirm skill metadata, command body, adapter formatting, and project-relative output paths remain correct.
5. **Step 5: Self-review and handoff** — Verify test paths use `path.join()` or `path.resolve()`, representative tools share the same semantic body, and no host-specific adapter owns interview logic.

### 3.4 Cross-platform path verification

**Files:**
- Test: `test/core/update.test.ts` and relevant path-aware generation fixtures - Verify macOS/Linux/Windows-safe expected paths.
- CI / verification configuration: existing repository workflow or Windows-capable validation environment - Run the focused generation/update checks on Windows without adding a new runtime path convention.

1. **Step 1: Write or extend focused tests** — Audit `test/core/update.test.ts` and `test/core/command-generation/adapters.test.ts` for hard-coded separators, then add or correct path assertions using `path.join()`/`path.resolve()` and explicit expected artifact names.
2. **Step 2: Run the focused tests** — Run `pnpm exec vitest run test/core/update.test.ts test/core/command-generation/adapters.test.ts` on the current platform and inspect the generated skill/command paths for platform-independent semantics.
3. **Step 3: Implement cross-platform verification** — Use the existing `.github/workflows/ci.yml` `test_matrix` job, whose `windows-latest`/`windows-pwsh` entry runs `pnpm test`, as the selected Windows verification path; do not add a platform-specific code path.
4. **Step 4: Run focused verification** — Execute the named focused Vitest command locally and confirm the `windows-latest` `test_matrix` run passes in CI with native separators; record both signals in `test-plan.md`.
5. **Step 5: Self-review and handoff** — Confirm the requirement's no-write boundary is semantic rather than separator-dependent, verify explicit artifact names are used, and record the platform, commands, and evidence for `test-plan.md`.

### 3.5 Full validation and Test Hardening handoff

**Files:**
- Test evidence: `superpowers/changes/add-propose-interview-gate/test-plan.md` - Record focused, cross-platform, and full-suite results after implementation.
- Change artifacts: `superpowers/changes/add-propose-interview-gate/*` - Validate artifact completeness and internal consistency.

1. **Step 1: Write or extend focused tests** — Confirm all planned behavior rows in `test-plan.md` map to the spec scenarios, including no-question, ambiguous-scope, high-impact-technical, delegated-decision, three-state, and path cases.
2. **Step 2: Run the focused tests** — Run `pnpm exec vitest run test/core/templates/skill-templates-parity.test.ts test/core/templates/change-review.test.ts test/core/shared/skill-generation.test.ts test/core/update.test.ts test/core/command-generation/adapters.test.ts` and record outcomes.
3. **Step 3: Implement final validation updates** — Fill the pre-implementation coverage plan and, after implementation, record Test Hardening evidence; update only targeted artifact or test content when a check exposes a gap.
4. **Step 4: Run focused verification** — Run `superpowers validate add-propose-interview-gate`, `pnpm run build`, `pnpm run lint`, `pnpm test`, and `git diff --check`; expect validation, build, lint, and all tests to pass.
5. **Step 5: Self-review and handoff** — Re-read proposal, spec, design, tasks, and this plan; verify no unresolved placeholders, orphan tasks, contradictory boundaries, or missing evidence remain, then hand off the integrated change for proposal review.

## Spec Coverage and Plan Audit

- `Propose SHALL protect the pre-confirmation boundary` → Unit 1.4 and Unit 3.4.
- `Propose SHALL adapt interview depth to unresolved decisions` → Unit 1.2 and Unit 3.1.
- `Propose SHALL ask one decision question at a time` → Unit 1.3 and Unit 3.1.
- `Propose SHALL close decisions before final confirmation` → Unit 1.4 and Unit 3.1.
- `Propose SHALL use a three-state final confirmation gate` → Unit 1.4, Unit 2.2, and Unit 3.1.
- `Propose SHALL preserve confirmed decisions in existing artifacts` → Unit 2.1 and Unit 3.1.

The plan contains no placeholder or deferred implementation directive. The named artifacts, command names, states, and path conventions match the proposal, spec, design, and repository source. All shared-template writes are serialized, and the final cross-unit validation occurs only after Units 1–2 are integrated.
