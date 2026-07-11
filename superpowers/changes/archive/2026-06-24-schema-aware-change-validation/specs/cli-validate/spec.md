## ADDED Requirements

### Requirement: Change validation SHALL require complete schema artifacts
The validate command SHALL treat a change as valid only when every artifact declared by the change's resolved workflow schema is complete, in addition to existing delta spec validation. Schema validation SHALL require `proposal.md` when the schema declares the `proposal` artifact, but SHALL NOT introduce new blocking validation of proposal markdown contents.

#### Scenario: Direct change validation fails when schema artifact is missing
- **GIVEN** a change uses a schema with artifacts `proposal`, `specs`, `design`, `tasks`, `execution-plan`, and `test-plan`
- **AND** the change has valid delta specs
- **AND** `test-plan.md` is missing
- **WHEN** a user runs `superpowers validate <change-id>`
- **THEN** validation fails
- **AND** output identifies the missing `test-plan` artifact
- **AND** output includes the expected generated path `test-plan.md`

#### Scenario: Direct change validation reports missing proposal artifact
- **GIVEN** a directory exists at `superpowers/changes/<change-id>/`
- **AND** the resolved schema declares an artifact that generates `proposal.md`
- **AND** `proposal.md` is missing
- **WHEN** a user runs `superpowers validate <change-id>`
- **THEN** validation treats `<change-id>` as a change
- **AND** validation fails
- **AND** output identifies the missing `proposal` artifact
- **AND** output includes the expected generated path `proposal.md`

#### Scenario: Direct change validation passes when all schema artifacts are complete
- **GIVEN** a change uses a resolved schema
- **AND** every artifact declared by that schema has a matching generated file or glob match
- **AND** existing proposal and delta spec validation passes
- **WHEN** a user runs `superpowers validate <change-id>`
- **THEN** validation passes

#### Scenario: Validation resolves schema from change metadata
- **GIVEN** a change has `.superpowers.yaml` selecting a non-default schema
- **AND** the selected schema declares a custom artifact
- **WHEN** a user runs `superpowers validate <change-id>`
- **THEN** validation checks completion against the metadata-selected schema
- **AND** missing custom artifacts fail validation

#### Scenario: Validation falls back to project default schema
- **GIVEN** a change has no `.superpowers.yaml`
- **AND** `superpowers/config.yaml` selects a default schema
- **WHEN** a user runs `superpowers validate <change-id>`
- **THEN** validation checks artifact completion against the configured project schema

#### Scenario: Invalid change metadata follows status fallback behavior
- **GIVEN** a change has unreadable or invalid `.superpowers.yaml`
- **AND** artifact workflow status would fall back to project config or the default schema
- **WHEN** a user runs `superpowers validate <change-id>`
- **THEN** validation uses the same fallback schema that status uses
- **AND** validation does not introduce a metadata error that status would not report

### Requirement: Bulk change validation SHALL include schema artifact completeness
Bulk validation SHALL apply the same schema artifact completeness checks used by direct change validation.

#### Scenario: Validate all changes reports missing schema artifact
- **GIVEN** one active change is missing a schema-declared artifact
- **WHEN** a user runs `superpowers validate --changes`
- **THEN** the missing-artifact change is reported as failed
- **AND** the command exits with a non-zero status

#### Scenario: Validate all JSON includes schema artifact issues
- **GIVEN** one active change is missing `execution-plan.md`
- **WHEN** a user runs `superpowers validate --all --json`
- **THEN** the corresponding `items[]` entry has `valid: false`
- **AND** the entry includes an issue with level `ERROR`
- **AND** the issue message names the missing `execution-plan` artifact

### Requirement: Deprecated change validation SHALL match top-level validation
The deprecated `superpowers change validate` command SHALL use the same schema-aware change validation behavior as `superpowers validate`.

#### Scenario: Deprecated command fails for missing schema artifact
- **GIVEN** a change has valid delta specs but is missing a schema-declared artifact
- **WHEN** a user runs `superpowers change validate <change-id>`
- **THEN** validation fails
- **AND** the missing schema artifact is reported

## Attachments

None.
