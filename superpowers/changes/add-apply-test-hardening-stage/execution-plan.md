## File Structure

- Create:
  - `schemas/spec-driven/templates/test-plan.md` - Built-in template for the two-phase test coverage draft and Test Hardening record.
- Modify:
  - `schemas/spec-driven/schema.yaml` - Add `test-plan` after `execution-plan` and update `apply.requires`.
  - `schemas/spec-driven/templates/execution-plan.md` - Clarify responsibility split between red tests and Test Hardening.
  - `src/core/templates/workflows/apply-change.ts` - Add post-task Test Hardening stage and completion messaging.
  - `src/core/templates/workflows/propose.ts` - Mention the `test-plan.md` artifact in default schema flow.
  - `src/core/templates/workflows/continue-change.ts` - Mention creation guidance for `test-plan.md`.
  - `src/core/templates/workflows/ff-change.ts` - Include `test-plan.md` in generated artifact sequence.
  - `src/core/templates/workflows/onboard.ts` - Explain the updated artifact sequence and hardening stage.
  - `src/commands/schema.ts` - Add schema init support for `test-plan`.
  - `docs/workflows.md` - Update completion flow documentation for `test-plan.md` and Test Hardening.
  - `docs/commands.md` - Update `/sp:apply` command documentation so task completion no longer implies archive readiness.
  - `docs/getting-started.md` - Update introductory workflow examples where apply transitions directly to archive.
- Test:
  - `test/core/artifact-graph/workflow.integration.test.ts` - Artifact ordering and dependency coverage.
  - `test/commands/artifact-workflow.test.ts` - Status, templates, apply blocking, and apply context coverage.
  - `test/core/artifact-graph/instruction-loader.test.ts` - Template content and generated artifact instructions.
  - `test/core/templates/skill-templates-parity.test.ts` - Generated workflow text coverage.
  - `test/commands/schema.test.ts` - Schema init `test-plan` support.

## Task Plan

### Task 1: Protect Artifact Graph And Apply Readiness

**Files:**
- Modify: `test/core/artifact-graph/workflow.integration.test.ts`
- Modify: `test/commands/artifact-workflow.test.ts`
- Later modify: `schemas/spec-driven/schema.yaml`
- Later create: `schemas/spec-driven/templates/test-plan.md`

- [ ] **Step 1: Add failing artifact graph tests**

Add tests proving:
- Default artifact order includes `test-plan` after `execution-plan`.
- `test-plan` requires `execution-plan`.
- `test-plan` is incomplete when only `test-plan-notes.md` or `test-plan/plan.md` exists.
- Workflow completion includes `test-plan` only when `test-plan.md` exists.

Run: `pnpm exec vitest run test/core/artifact-graph/workflow.integration.test.ts`

Expected: FAIL because the default schema does not yet include `test-plan`.

- [ ] **Step 2: Add failing status and apply instruction tests**

Add tests proving:
- `superpowers status --change <id> --json` returns `applyRequires: ['test-plan']`.
- Apply is blocked when proposal/specs/design/tasks/execution-plan exist but `test-plan.md` is missing.
- Apply context includes `test-plan` when `test-plan.md` exists.
- Progress tracking still reads `tasks.md`.
- `superpowers templates --schema spec-driven --json` includes `test-plan`.
- The initial template contains incomplete `Status` table rows rather than a standalone hardening checkbox.

Run: `pnpm exec vitest run test/commands/artifact-workflow.test.ts`

Expected: FAIL for missing `test-plan` schema/template behavior, not because of test setup errors.

- [ ] **Step 3: Review artifact tests before production changes**

Check:
- Tests use `path.join()` or path normalization for path expectations.
- Tests would fail for a shallow implementation that adds only the template file but leaves `apply.requires` as `execution-plan`.
- Tests verify context inclusion and progress tracking independently.
- Tests verify table-driven completion rather than accepting fuzzy summary wording.

Expected: Review approves tests or gaps are fixed before schema edits.

### Task 2: Add Schema Artifact And Template

**Files:**
- Modify: `schemas/spec-driven/schema.yaml`
- Create: `schemas/spec-driven/templates/test-plan.md`
- Modify: `schemas/spec-driven/templates/execution-plan.md`
- Test: tests from Task 1 plus instruction-loader tests

- [ ] **Step 1: Add test-plan to schema**

Update `schemas/spec-driven/schema.yaml`:
- Add `test-plan` after `execution-plan`.
- Set `requires: [execution-plan]`.
- Set `template: test-plan.md`.
- Change `apply.requires` to `[test-plan]`.
- Keep `apply.tracks: tasks.md`.

- [ ] **Step 2: Create test-plan template**

Create `schemas/spec-driven/templates/test-plan.md` with sections:
- Testing Phase Boundary: red tests vs Test Hardening.
- Table-driven hardening completion guidance, with draft status rows incomplete by default.
- Status examples that distinguish incomplete rows (`planned`, `failing`, blank) from complete rows (`covered`, `passed`, `not applicable`).
- Requirement and scenario coverage matrix.
- Boundary and abnormal case sweep.
- Non-critical path sweep.
- Earlier testing gaps and newly strengthened tests.
- Selected verification.
- Deferred/manual coverage with reasons.

- [ ] **Step 3: Update execution-plan template**

Clarify:
- Red tests in `execution-plan.md` are still mandatory before production code.
- The broad coverage matrix and post-implementation evidence live in `test-plan.md`.
- Passing task-level red tests does not replace the final Test Hardening pass.

- [ ] **Step 4: Add template content tests**

Update `test/core/artifact-graph/instruction-loader.test.ts` to assert the `test-plan` instructions/template include:
- Two-phase draft/hardening language.
- Explicit red-test vs hardening distinction.
- Table-driven hardening completion language.
- Command evidence section.

Run: `pnpm exec vitest run test/core/artifact-graph/instruction-loader.test.ts test/commands/artifact-workflow.test.ts test/core/artifact-graph/workflow.integration.test.ts`

Expected: PASS after schema and template implementation.

### Task 3: Update Apply Workflow Instructions

**Files:**
- Modify: `src/core/templates/workflows/apply-change.ts`
- Modify: `test/core/templates/skill-templates-parity.test.ts`

- [ ] **Step 1: Add failing generated apply text tests**

Add assertions that generated apply instructions:
- Mention `test-plan.md`.
- State that task completion transitions into Test Hardening.
- State that apply completion requires implementation tasks and Test Hardening.
- Tell agents to resume hardening when tasks are complete but concrete `test-plan.md` status rows are not all complete.
- Distinguish red tests from Test Hardening.
- Block completion when hardening tests fail or defects remain unresolved.
- Scope hardening to relevant implementation/testing changes and pause on ambiguous unrelated changes.

Run: `pnpm exec vitest run test/core/templates/skill-templates-parity.test.ts`

Expected: FAIL until workflow templates are updated.

- [ ] **Step 2: Update apply skill template**

Update both skill and command content in `apply-change.ts`:
- Context file descriptions include `test-plan`.
- Apply handling says `state: all_done` requires reading `test-plan.md` before claiming completion.
- Apply handling treats only complete concrete `Status` table rows as hardening complete.
- The implementation loop runs tasks as before.
- After all tasks complete, the agent enters Test Hardening.
- Test Hardening inspects specs/design/tasks/execution-plan/test-plan plus the completed implementation and test coverage.
- Agent adds feasible missing tests and records evidence.
- Agent fixes defects or pauses as blocked when hardening tests fail due to product behavior.
- Final output separates implementation completion from hardening completion.

- [ ] **Step 3: Verify generated apply text**

Run: `pnpm exec vitest run test/core/templates/skill-templates-parity.test.ts`

Expected: PASS for updated workflow assertions.

### Task 4: Update Other Workflow Templates

**Files:**
- Modify: `src/core/templates/workflows/propose.ts`
- Modify: `src/core/templates/workflows/continue-change.ts`
- Modify: `src/core/templates/workflows/ff-change.ts`
- Modify: `src/core/templates/workflows/onboard.ts`
- Modify: `test/core/templates/skill-templates-parity.test.ts`

- [ ] **Step 1: Add failing generated artifact sequence tests**

Assert generated propose, continue, fast-forward, and onboarding text mentions:
- Default sequence includes `test-plan.md` after `execution-plan.md`.
- `test-plan.md` is the pre-implementation test coverage draft and post-implementation hardening record.

Run: `pnpm exec vitest run test/core/templates/skill-templates-parity.test.ts`

Expected: FAIL until workflow text is updated.

- [ ] **Step 2: Update workflow text**

Update each workflow template while keeping schema-driven behavior:
- Do not hardcode custom schema behavior.
- Explain `test-plan.md` only as part of the default spec-driven sequence.
- Keep `tasks.md` as progress tracking.

- [ ] **Step 3: Verify workflow text**

Run: `pnpm exec vitest run test/core/templates/skill-templates-parity.test.ts`

Expected: PASS.

### Task 5: Update Schema Init

**Files:**
- Modify: `src/commands/schema.ts`
- Modify: `test/commands/schema.test.ts`

- [ ] **Step 1: Add failing schema init tests**

Add tests proving:
- `test-plan` appears in valid/common artifact lists.
- Non-interactive schema init with `proposal,specs,design,tasks,execution-plan,test-plan` creates `test-plan`.
- `test-plan` requires `execution-plan`.
- `apply.requires` is `test-plan` when selected.
- Existing behavior remains when `test-plan` is not selected.

Run: `pnpm exec vitest run test/commands/schema.test.ts`

Expected: FAIL until schema init support is implemented.

- [ ] **Step 2: Implement schema init support**

Update `src/commands/schema.ts`:
- Add `test-plan` to default/common artifact metadata.
- Add dependency rule `test-plan -> execution-plan`.
- Generate `apply.requires` preference order: `test-plan`, then `execution-plan`, then `tasks` where available.
- Create template file via platform-safe paths.

- [ ] **Step 3: Verify schema init**

Run: `pnpm exec vitest run test/commands/schema.test.ts`

Expected: PASS.

### Task 6: Final Verification

**Files:**
- All files touched by implementation.

- [ ] **Step 1: Run targeted artifact workflow tests**

Run: `pnpm exec vitest run test/core/artifact-graph/workflow.integration.test.ts test/commands/artifact-workflow.test.ts test/core/artifact-graph/instruction-loader.test.ts`

Expected: PASS.

- [ ] **Step 2: Run workflow and schema init tests**

Run: `pnpm exec vitest run test/core/templates/skill-templates-parity.test.ts test/commands/schema.test.ts`

Expected: PASS.

- [ ] **Step 3: Run full suite**

Run: `pnpm test`

Expected: PASS.

- [ ] **Step 4: Verify documentation updates**

Read `docs/workflows.md`, `docs/commands.md`, and `docs/getting-started.md`.

Expected: They describe `/sp:apply` as implementation tasks plus Test Hardening and do not state that task completion alone means archive readiness.

- [ ] **Step 5: Check generated template paths**

Run: `superpowers templates --schema spec-driven --json`

Expected: Output includes `test-plan` resolving to the built-in template path.
