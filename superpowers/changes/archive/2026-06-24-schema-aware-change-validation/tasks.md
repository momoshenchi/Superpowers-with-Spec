## 1. Validation Contract

- [x] 1.1 Add schema-aware change validation tests for direct `superpowers validate <change>` when a schema artifact is missing.
- [x] 1.2 Add passing direct validation tests for a change with all schema artifacts complete and valid delta specs.
- [x] 1.3 Add tests proving schema selection comes from `.superpowers.yaml` and project default config.
- [x] 1.4 Add tests for missing generated glob artifacts and satisfied generated glob artifacts.
- [x] 1.5 Add tests proving invalid or unreadable change metadata falls back the same way artifact workflow status does.
- [x] 1.6 Add tests proving direct validation of an existing change directory without `proposal.md` reports the missing `proposal` artifact.

## 2. CLI Entry Points

- [x] 2.1 Add bulk validation tests for `superpowers validate --changes` and `superpowers validate --all --json`.
- [x] 2.2 Add deprecated `superpowers change validate <change>` parity tests.
- [x] 2.3 Update human output assertions so missing artifacts are actionable and schema-specific.
- [x] 2.4 Update JSON output assertions so missing artifacts appear in the existing `issues` array.

## 3. Shared Implementation

- [x] 3.1 Create a shared schema-aware change validation helper that combines artifact completeness and delta spec validation.
- [x] 3.2 Reuse artifact graph schema resolution and completion detection instead of duplicating path/glob logic.
- [x] 3.3 Wire top-level direct and bulk change validation to the shared helper.
- [x] 3.4 Wire deprecated `change validate` to the shared helper.
- [x] 3.5 Update direct item detection so existing change directories without `proposal.md` can be validated as changes.

## 4. Archive Integration

- [x] 4.1 Add archive preflight tests that block schema-incomplete changes before spec updates or directory movement.
- [x] 4.2 Add archive tests proving `--no-validate` continues to bypass validation with a warning.
- [x] 4.3 Add archive tests proving `--skip-specs` still performs schema artifact validation unless `--no-validate` is also provided.
- [x] 4.4 Wire archive preflight to the shared schema-aware validation helper.
- [x] 4.5 Update minimal archive fixtures to create all schema artifacts or explicitly skip validation based on the test intent.

## 5. Specs And Verification

- [x] 5.1 Update main specs by archiving this change after implementation is complete.
- [x] 5.2 Run targeted command and archive tests.
- [x] 5.3 Run the full test suite.
