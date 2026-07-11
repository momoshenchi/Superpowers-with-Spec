## Why

`superpowers validate <change>` currently validates change delta spec content, but it does not verify that the change satisfies the workflow schema declared for that change. A change can contain `proposal.md`, `tasks.md`, and valid delta specs, pass validation, and still be missing schema-required artifacts such as `execution-plan.md` or `test-plan.md`.

This breaks the expected handoff from validation to implementation. In practice, users often run validate immediately before apply, so a valid change should mean every artifact required by the resolved schema is complete.

## What Changes

- Make change validation schema-aware.
- When validating a change, resolve the change schema using the same metadata/config/default behavior used by status and instructions.
- Treat a change as invalid when any artifact declared by the resolved schema is incomplete.
- Preserve existing delta spec validation; schema artifact completeness is an additional gate, not a replacement.
- Do not add new blocking proposal content validation. `proposal.md` is validated as a required schema artifact when the schema declares it, but its markdown contents keep existing command behavior.
- Preserve existing schema resolution behavior for unreadable or invalid change metadata: metadata read failures fall back to project config and then the default schema, matching artifact workflow status.
- Apply the same behavior to:
  - `superpowers validate <change>`
  - `superpowers validate --changes`
  - `superpowers validate --all`
  - deprecated `superpowers change validate <change>`
  - archive preflight validation before a change is archived
- For direct validation, treat an existing directory under `superpowers/changes/<change-id>/` as a change even when `proposal.md` is missing, so validation can report `proposal` as a missing schema artifact instead of reporting the item as unknown.
- Report missing artifacts with actionable messages that name the artifact id and expected generated path or glob.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `cli-validate`: Change validation requires all artifacts declared by the change's resolved schema to be complete before reporting the change as valid.
- `cli-archive`: Archive preflight blocks incomplete schema artifacts instead of relying only on proposal and delta spec validation.
- `cli-artifact-workflow`: Validation reuses the same schema resolution and artifact completion model as status/instructions so workflow commands agree on readiness.

## Attachments

None.

## Impact

- `src/commands/validate.ts` - Add schema artifact completeness checks to direct and bulk change validation, including direct validation of existing change directories that lack `proposal.md`.
- `src/commands/change.ts` - Keep deprecated `change validate` consistent with top-level validate.
- `src/core/archive.ts` - Reuse schema-aware change validation in archive preflight.
- `src/core/validation/` and/or `src/core/artifact-graph/` - Introduce or reuse a shared helper that combines existing delta validation with artifact graph completeness.
- `superpowers/specs/cli-validate/spec.md` - Add requirements and scenarios for schema-aware validation.
- `superpowers/specs/cli-archive/spec.md` - Add archive preflight expectations if needed.
- `superpowers/specs/cli-artifact-workflow/spec.md` - Clarify that validate uses the same resolved schema artifact model as status.
- Tests under `test/commands/`, `test/core/validation*`, and `test/core/archive.test.ts` - Cover missing required artifacts, custom schema metadata, bulk validation, deprecated command parity, JSON output, and archive blocking behavior.
