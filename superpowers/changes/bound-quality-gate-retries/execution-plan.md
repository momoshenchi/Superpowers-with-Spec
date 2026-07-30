## File Structure

- Modify:
  - `src/core/templates/workflows/final-quality-gates.ts` — Bounded round orchestration, severity/state definitions, and gate-local retry entry points.
  - `src/core/templates/workflows/verify-change.ts` — Numbered Verify retries and per-round preflight/E2E evidence.
  - `src/core/templates/workflows/simplify.ts` — Verify handoff after Simplify work.
  - `src/core/templates/workflows/design-verify.ts` — Numbered design-verification retries and terminal failure.
  - `docs/workflows.md` — User-facing retry semantics.
  - `docs/commands.md` — Command behavior and terminal outcomes.
  - `superpowers/changes/bound-quality-gate-retries/test-plan.md` — Hardening evidence and delegated-gate records.
- Test:
  - `test/core/templates/skill-templates-parity.test.ts` — Skill/command retry contract and payload hashes.
  - `test/core/templates/change-review.test.ts` — P0/CRITICAL terminology where shared review wording changes.
  - `test/commands/artifact-workflow.test.ts` — Apply instruction rendering when schema language changes.

## Attachments

None.

## Dispatch Coordination

`tasks.md` remains the checkbox-tracked source of truth. A dispatch unit is an allocation boundary, not a required one-to-one subagent assignment.

| Unit | Scope | Ownership | Dependencies | Assignee policy | Parallel | Handoff |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Shared final-gate orchestration | `final-quality-gates.ts` and apply-facing tests | None | Dedicated worker preferred | No; defines downstream contract | Changed instructions, focused test result, self-review |
| 2 | Standalone gate contracts | verify/simplify/design templates | Unit 1 | May split by file, then integrate | Yes after Unit 1 | Changed templates, focused tests, evidence fields |
| 3 | Regression/docs/validation | tests, docs, test plan | Units 1–2 | Coordinator integration work | No; consumes integrated contract | Full validation, review, durable evidence |

## Execution Boundaries

### 1. Shared final-gate orchestration

- Own only shared gate instructions and their direct parity/command assertions.
- Make P0/CRITICAL versus BLOCKER semantics explicit before modifying retry entry points.

### 2. Standalone gate contracts

- Consume Unit 1's exact names, maximum round count, and evidence requirements.
- Do not reintroduce a global restart-from-code-review rule.

### 3. Regression/docs/validation

- Integrate all contract changes, update generated-content hashes intentionally, and record post-integration evidence.

## Dispatch Execution

### 1. Shared final-gate orchestration

#### Task 1.1: Add severity, state, and round evidence contract

**Files:**
- Modify/Test: `src/core/templates/workflows/final-quality-gates.ts`, `test/core/templates/skill-templates-parity.test.ts`

1. **Step 1: Write focused assertions** — Assert P0 maps to CRITICAL, BLOCKER is orthogonal, and worker reports include numbered rounds.
2. **Step 2: Run the focused test** — Run `pnpm exec vitest run test/core/templates/skill-templates-parity.test.ts`; confirm the new assertions fail before implementation.
3. **Step 3: Implement Task 1.1** — Add concise shared definitions and durable per-round report requirements.
4. **Step 4: Run focused verification** — Re-run the same Vitest command; expect all assertions to pass after updating deliberate hashes.
5. **Step 5: Self-review and handoff** — Confirm P1/P2 do not control retry count and BLOCKER pauses immediately; report changed strings and test evidence.

#### Task 1.2: Implement bounded code-review rounds

**Files:**
- Modify/Test: `src/core/templates/workflows/final-quality-gates.ts`, `test/core/templates/skill-templates-parity.test.ts`

1. **Step 1: Write focused assertions** — Cover no-P0 first-round pass, P0-triggered fresh review, and fourth-round terminal failure.
2. **Step 2: Run the focused test** — Run the parity suite and capture the expected failing contract checks.
3. **Step 3: Implement Task 1.2** — Require repairs within each review round, new workers for retries, and no fifth review.
4. **Step 4: Run focused verification** — Re-run the parity suite; expect passing bounded-round wording in both apply forms.
5. **Step 5: Self-review and handoff** — Verify normal P1/P2 repairs do not force a second review and report the exact terminal condition.

#### Task 1.3: Implement gate-local retry routing

**Files:**
- Modify/Test: `src/core/templates/workflows/final-quality-gates.ts`, `test/core/templates/skill-templates-parity.test.ts`

1. **Step 1: Write focused assertions** — Cover Simplify→Verify, Verify→Verify, design-verify→design-verify, four-round caps, and BLOCKER pause.
2. **Step 2: Run the focused test** — Run the parity suite and capture the expected failing routing checks.
3. **Step 3: Implement Task 1.3** — Replace global restart prose with the specified entry points and fresh-worker retry rules.
4. **Step 4: Run focused verification** — Re-run the parity suite; expect all routing checks to pass.
5. **Step 5: Self-review and handoff** — Confirm only a repair at an affected boundary reruns that boundary and record any legacy wording removed.

### 2. Standalone gate contracts

#### Task 2.1: Add Verify retry contract

**Files:**
- Modify/Test: `src/core/templates/workflows/verify-change.ts`, `test/core/templates/skill-templates-parity.test.ts`

1. **Step 1: Write focused assertions** — Cover fresh numbered attempts, canonical preflight/E2E on every attempt, and terminal round-four failure.
2. **Step 2: Run the focused test** — Run the parity suite and confirm the contract is initially absent.
3. **Step 3: Implement Task 2.1** — Add retry output/evidence and map CRITICAL to P0 only for final-gate execution.
4. **Step 4: Run focused verification** — Re-run the parity suite and update payload hashes deliberately.
5. **Step 5: Self-review and handoff** — Confirm a blocked prerequisite pauses rather than consuming an attempt.

#### Task 2.2: Add Simplify handoff contract

**Files:**
- Modify/Test: `src/core/templates/workflows/simplify.ts`, `test/core/templates/skill-templates-parity.test.ts`

1. **Step 1: Write focused assertions** — Cover behavior-preserving cleanup evidence and the Verify round-one handoff without Simplify retry.
2. **Step 2: Run the focused test** — Run the parity suite and capture the expected failure.
3. **Step 3: Implement Task 2.2** — State the post-cleanup/repair handoff and terminal blocked/unresolvable failure behavior.
4. **Step 4: Run focused verification** — Re-run the parity suite; expect passing handoff contract assertions.
5. **Step 5: Self-review and handoff** — Verify no language implies a hidden fifth Simplify attempt.

#### Task 2.3: Add design-verification retry contract

**Files:**
- Modify/Test: `src/core/templates/workflows/design-verify.ts`, `test/core/templates/skill-templates-parity.test.ts`

1. **Step 1: Write focused assertions** — Cover fresh numbered visual attempts, rule/runtime evidence, BLOCKER pause, and fourth-round failure.
2. **Step 2: Run the focused test** — Run the parity suite and capture the expected missing contract.
3. **Step 3: Implement Task 2.3** — Add gate-local visual retry language and output fields.
4. **Step 4: Run focused verification** — Re-run the parity suite; expect all assertions and hashes to pass.
5. **Step 5: Self-review and handoff** — Confirm non-UI `not applicable` remains non-blocking and is not a retry.

### 3. Regression coverage and documentation

#### Task 3.1: Add integrated retry regression coverage

**Files:**
- Modify/Test: `test/core/templates/skill-templates-parity.test.ts`, `test/commands/artifact-workflow.test.ts`

1. **Step 1: Write focused assertions** — Verify both skill/command forms preserve the four-round policy and apply text has no global restart contradiction.
2. **Step 2: Run focused tests** — Run `pnpm exec vitest run test/core/templates/skill-templates-parity.test.ts test/commands/artifact-workflow.test.ts` and observe new assertion failures.
3. **Step 3: Implement Task 3.1** — Complete assertions and update expected generated-content hashes after template edits settle.
4. **Step 4: Run focused verification** — Re-run the exact focused command; expect all tests to pass.
5. **Step 5: Self-review and handoff** — Inspect assertion wording for both terminal failure and blocker behavior; report suite counts.

#### Task 3.2: Document bounded retry semantics

**Files:**
- Modify: `docs/workflows.md`, `docs/commands.md`

1. **Step 1: Identify documentation assertions** — Locate final-gate, Verify, Simplify, and design-verification descriptions with `rg`.
2. **Step 2: Review current wording** — Confirm it does not promise a global restart inconsistent with the new contract.
3. **Step 3: Implement Task 3.2** — Describe P0/CRITICAL, P1/P2, BLOCKER, maximum four rounds, and gate-local restart entry points in plain language.
4. **Step 4: Run focused verification** — Run `pnpm exec vitest run test/core/templates/skill-templates-parity.test.ts`; expect passing template/document-adjacent checks.
5. **Step 5: Self-review and handoff** — Compare docs to shared contract and report exact sections changed.

#### Task 3.3: Run integrated validation and record quality gates

**Files:**
- Modify: `superpowers/changes/bound-quality-gate-retries/test-plan.md`
- Test: repository validation commands

1. **Step 1: Define the canonical suite** — Confirm `package.json`, CI, and test documentation identify every non-visual validation command.
2. **Step 2: Run focused and structural checks** — Run focused workflow tests, `git diff --check`, and `superpowers validate bound-quality-gate-retries --json`; expect passing results.
3. **Step 3: Perform Task 3.3** — Run `pnpm run build`, `pnpm run lint`, and `pnpm test`; record fresh outcomes.
4. **Step 4: Run final quality gates** — Use fresh sequential workers for code review, Simplify, Verify, and design-verify; record outcomes and any justified non-applicability.
5. **Step 5: Self-review and handoff** — Confirm every Test Hardening status row is complete, all applicable gates passed, and no unresolved terminal failure remains.

## Final Integration Review and Validation

- Integrate Units 1–3 before one cross-unit review of severity terminology, retry bounds, generated skill/command parity, docs, and test evidence.
- Fix any blocking finding with targeted verification; do not restart a complete review unless a reviewer requests confirmation of a named defect.
- Record coverage gaps, full-suite output, and the fresh delegated gate reports in `test-plan.md`.

## Plan Self-Check

- **Spec coverage:** Tasks 1.1–1.3 cover final-gate requirements; 2.1–2.3 cover each standalone gate; 3.1–3.3 cover regression, docs, and evidence.
- **Placeholder scan:** No implementation placeholders or deferred work remain.
- **Contradiction / orphan check:** Simplify has no independent retry loop; its completion enters Verify round one. BLOCKER never consumes a round.
- **Type consistency:** P0 maps to Verify `CRITICAL`; final outcomes remain `passed`, `failed`, `blocked`, or `not applicable`.
- **Completeness:** Every checkbox has concrete files, commands, expected results, and handoff guidance.
