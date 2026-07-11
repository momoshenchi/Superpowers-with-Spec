## File Structure

- Create:
  - `src/core/validation/change-validator.ts` - Shared schema-aware change validation helper and report composition.
  - `test/core/validation/change-validator.test.ts` - Unit coverage for artifact completeness, schema resolution, glob handling, and delta validation composition.
- Modify:
  - `src/commands/validate.ts` - Use shared change validation for direct and bulk change validation.
  - `src/commands/change.ts` - Use shared change validation for deprecated `change validate`.
  - `src/core/archive.ts` - Use shared schema-aware validation in archive preflight.
  - `src/utils/item-discovery.ts` or `src/commands/validate.ts` - Let direct validation identify existing change directories even when `proposal.md` is missing.
  - `src/core/validation/index.ts` if needed - Export the shared helper when local module organization benefits from it.
  - `superpowers/specs/cli-validate/spec.md` - Apply this change's validate deltas at archive time.
  - `superpowers/specs/cli-archive/spec.md` - Apply this change's archive deltas at archive time.
  - `superpowers/specs/cli-artifact-workflow/spec.md` - Apply this change's artifact workflow deltas at archive time.
- Test:
  - `test/core/validation/change-validator.test.ts` - Shared helper behavior.
  - `test/commands/validate.test.ts` - Top-level direct and bulk command behavior.
  - `test/commands/validate.enriched-output.test.ts` - Human missing-artifact output if existing enriched output coverage is the right home.
  - `test/core/commands/change-command.show-validate.test.ts` or `test/commands/change.interactive-validate.test.ts` - Deprecated command parity.
  - `test/core/archive.test.ts` - Archive preflight blocking and `--no-validate` bypass.

## Attachments

None.

## Task Plan

Red tests in this file drive implementation one step at a time. Keep broad requirement/scenario coverage matrices, testing gap analysis, supplemental test coverage, and post-implementation Test Hardening records in `test-plan.md`. Passing the red/green task tests here does not replace the final Test Hardening pass after implementation tasks are complete.

### Task 1: Shared Schema-Aware Change Validation

**Files:**
- Create: `src/core/validation/change-validator.ts`
- Create: `test/core/validation/change-validator.test.ts`
- Modify: `src/core/validation/validator.ts` only if extracting small reusable helpers is necessary

- [ ] **Step 1: Write failing tests for missing artifacts**

  Create fixtures with a project `superpowers/changes/incomplete/` using `spec-driven` metadata and valid delta specs, but missing `test-plan.md`. Assert the shared helper returns `valid: false`, an `ERROR` issue, `path: artifact:test-plan`, and a message containing both `test-plan` and `test-plan.md`.

- [ ] **Step 2: Write passing tests for complete artifacts**

  Create a complete fixture with `proposal.md`, `design.md`, `tasks.md`, `execution-plan.md`, `test-plan.md`, and at least one valid `specs/<capability>/spec.md`. Assert the helper returns valid when delta validation also passes.

- [ ] **Step 3: Write schema resolution and glob tests**

  Add tests for `.superpowers.yaml` selecting a project-local custom schema, invalid metadata falling back the same way status does, project config fallback when metadata is absent, and `generates: "specs/**/*.md"` being complete only when a matching file exists.

- [ ] **Step 4: Run helper tests to verify they fail**

  Run: `pnpm exec vitest run test/core/validation/change-validator.test.ts`

  Expected: FAIL because the shared helper does not exist or does not yet perform schema artifact checks.

- [ ] **Step 5: Review test coverage before production code**

  Check that tests cover missing simple files, missing `proposal.md`, missing globs, custom schema metadata, invalid metadata fallback, project default schema fallback, complete artifacts, and composition with invalid delta specs. Add missing cases before implementation if any requirement from `specs/cli-validate/spec.md` or `specs/cli-artifact-workflow/spec.md` is uncovered.

- [ ] **Step 6: Implement the shared helper**

  Implement a helper that:
  - resolves change context with existing artifact workflow utilities,
  - computes incomplete artifacts from the graph/status,
  - creates `ERROR` issues for every incomplete artifact,
  - runs existing `Validator.validateChangeDeltaSpecs(changeDir)`,
  - does not add blocking proposal markdown content validation,
  - combines issues and summary counts without changing the existing issue shape.

- [ ] **Step 7: Run helper tests**

  Run: `pnpm exec vitest run test/core/validation/change-validator.test.ts`

  Expected: PASS for shared helper behavior.

### Task 2: Top-Level Validate Command

**Files:**
- Modify: `src/commands/validate.ts`
- Modify: `test/commands/validate.test.ts`
- Modify: `test/commands/validate.enriched-output.test.ts` if human-output coverage belongs there

- [ ] **Step 1: Add failing direct command tests**

  Add a test where `superpowers validate incomplete-change --json` reports `valid: false` because a schema artifact is missing, even though delta specs are valid.

- [ ] **Step 2: Add failing direct discovery test for missing proposal**

  Add a test where `superpowers/changes/scaffolded/` exists without `proposal.md`. Assert `superpowers validate scaffolded --json` treats it as a change and reports missing `proposal`, rather than "Unknown item".

- [ ] **Step 3: Add failing bulk command tests**

  Add tests for `superpowers validate --changes --json` and `superpowers validate --all --json` where one change fails due to a missing artifact and the command exits non-zero.

- [ ] **Step 4: Add human output assertions**

  Assert human output names the missing artifact and generated path, and that next-step guidance is not limited to delta spec debugging.

- [ ] **Step 5: Run command tests to verify they fail**

  Run: `pnpm exec vitest run test/commands/validate.test.ts test/commands/validate.enriched-output.test.ts`

  Expected: FAIL because top-level validate still uses `Validator.validateChangeDeltaSpecs(changeDir)`.

- [ ] **Step 6: Review test coverage before production code**

  Check command tests cover direct change validation, scaffolded directory detection, bulk changes, all validation with specs included, JSON output shape, human output, and non-zero exit behavior.

- [ ] **Step 7: Wire top-level validate to shared helper**

  Replace direct and bulk change validation paths with the shared schema-aware helper. Update direct item detection so existing change directories can be validated even when `proposal.md` is missing. Leave spec validation paths unchanged.

- [ ] **Step 8: Run command tests**

  Run: `pnpm exec vitest run test/commands/validate.test.ts test/commands/validate.enriched-output.test.ts`

  Expected: PASS.

### Task 3: Deprecated Change Validate Parity

**Files:**
- Modify: `src/commands/change.ts`
- Modify: `test/core/commands/change-command.show-validate.test.ts` or existing command-level change validate tests

- [ ] **Step 1: Add failing deprecated command test**

  Add a test proving `superpowers change validate incomplete-change --json` fails for missing schema artifacts and reports the same issue class as top-level validate.

- [ ] **Step 2: Run deprecated command tests to verify failure**

  Run: `pnpm exec vitest run test/core/commands/change-command.show-validate.test.ts test/commands/change.interactive-validate.test.ts`

  Expected: FAIL because deprecated change validation still uses delta-only validation.

- [ ] **Step 3: Review test coverage before production code**

  Confirm coverage includes JSON output and human output, or document why one is already covered by top-level validate.

- [ ] **Step 4: Wire deprecated command to shared helper**

  Replace `Validator.validateChangeDeltaSpecs(changeDir)` in `ChangeCommand.validate()` with the shared helper.

- [ ] **Step 5: Run deprecated command tests**

  Run: `pnpm exec vitest run test/core/commands/change-command.show-validate.test.ts test/commands/change.interactive-validate.test.ts`

  Expected: PASS.

### Task 4: Archive Preflight Integration

**Files:**
- Modify: `src/core/archive.ts`
- Modify: `test/core/archive.test.ts`

- [ ] **Step 1: Add failing archive preflight test**

  Add a test where a change has completed tasks and valid delta specs but is missing `test-plan.md`. Assert `archive.execute(changeName, { yes: true })` does not move the change, does not update main specs, and logs the missing artifact.

- [ ] **Step 2: Add `--no-validate` bypass test**

  Add or update coverage proving `archive.execute(changeName, { yes: true, noValidate: true })` bypasses schema artifact validation while preserving the warning behavior.

- [ ] **Step 3: Add `--skip-specs` validation test**

  Add coverage proving `archive.execute(changeName, { yes: true, skipSpecs: true })` still performs schema artifact validation and blocks missing artifacts unless `noValidate` is also set.

- [ ] **Step 4: Run archive tests to verify failure**

  Run: `pnpm exec vitest run test/core/archive.test.ts`

  Expected: FAIL because archive preflight only performs old proposal/delta validation.

- [ ] **Step 5: Review test coverage before production code**

  Confirm tests distinguish archive mechanics from validation preflight, and explicitly cover `--skip-specs` versus `--no-validate`. Fixture-only archive tests should use `noValidate: true` when they are not exercising validation.

- [ ] **Step 6: Wire archive preflight to shared helper**

  Use the shared schema-aware validation helper before spec update and directory movement unless validation is skipped.

- [ ] **Step 7: Run archive tests**

  Run: `pnpm exec vitest run test/core/archive.test.ts`

  Expected: PASS.

### Task 5: Final Verification And Spec Consistency

**Files:**
- Modify: command, core validation, and archive files changed by previous tasks
- Test: all targeted suites and full suite

- [ ] **Step 1: Run targeted test set**

  Run: `pnpm exec vitest run test/core/validation/change-validator.test.ts test/commands/validate.test.ts test/core/archive.test.ts`

  Expected: PASS.

- [ ] **Step 2: Run broader affected command tests**

  Run: `pnpm exec vitest run test/commands test/core/commands test/core/validation.test.ts test/core/validation.enriched-messages.test.ts`

  Expected: PASS.

- [ ] **Step 3: Run full suite**

  Run: `pnpm test`

  Expected: PASS.

- [ ] **Step 4: Update Test Hardening record**

  Update `test-plan.md` with final coverage results, added tests, verification commands, and any explicit deferrals.

- [ ] **Step 5: Archive when ready**

  Run `superpowers validate schema-aware-change-validation` and then archive after implementation and Test Hardening are complete.

## Self-Review

Spec coverage: The plan covers schema-aware direct validate, missing proposal discovery, bulk validate, JSON/human output, deprecated command parity, archive preflight, `--skip-specs` behavior, schema resolution, metadata fallback, glob artifact handling, and preserving existing delta validation.

Placeholder scan: No `TBD`, `TODO`, or open placeholder instructions remain in this plan.

Type consistency: The planned helper consistently returns the existing validation report shape and uses `ValidationIssue` with `level`, `path`, and `message` fields.
