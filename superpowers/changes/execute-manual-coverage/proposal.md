## Why

`test-plan.md` currently combines executable manual coverage with intentionally deferred coverage in one table that has no status or evidence fields. `/sp:verify` therefore cannot reliably distinguish a required manual check from a justified deferral, and an unexecuted manual check can be mistaken for completed validation.

## What Changes

- Replace `## Deferred Or Manual Coverage` in the spec-driven test-plan template with two explicit sections:
  - `## Manual Coverage`, whose rows contain the required check, execution method/environment, status, and inspectable evidence.
  - `## Deferred Coverage`, whose rows contain the gap, specific reason for deferral, and follow-up/safer alternative.
- Require `/sp:verify` to execute every required Manual Coverage row, record its evidence and outcome, and block Verify when such a row is unexecuted, failed, or blocked.
- Preserve a scope-backed `not applicable` outcome and keep deferred coverage from being represented as executed evidence.
- Update Test Hardening completion guidance, generated templates, documentation, and regression tests for the distinct table semantics.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `test-plan-manual-coverage`: Make executable manual coverage independently status-tracked and evidence-backed from deferred coverage.
- `sp-verify-skill`: Require Verify to execute and report required manual coverage before it can pass.

## Impact

- Spec-driven test-plan templates and schema/instruction text.
- `/sp:verify` skill and command templates, including final-quality Verify behavior.
- Template/schema regression tests and workflow documentation.
- No new runtime dependency or browser driver; manual execution continues to use a suitable repository runner or agent-controlled environment.
