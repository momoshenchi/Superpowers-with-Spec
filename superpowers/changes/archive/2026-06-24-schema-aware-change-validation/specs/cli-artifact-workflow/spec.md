## ADDED Requirements

### Requirement: Validation SHALL reuse resolved artifact completion state
Change validation SHALL use the same schema resolution and artifact completion model as artifact workflow status, so readiness checks agree across `status`, `instructions`, `validate`, and archive preflight.

#### Scenario: Validate and status agree on incomplete artifacts
- **GIVEN** `superpowers status --change <change-id> --json` reports `isComplete: false`
- **AND** the incomplete status is caused by one or more missing schema artifacts
- **WHEN** a user runs `superpowers validate <change-id>`
- **THEN** validation fails because the schema artifact set is incomplete

#### Scenario: Generated glob artifacts are complete when matches exist
- **GIVEN** a schema artifact generates `specs/**/*.md`
- **AND** at least one matching file exists under the change directory
- **WHEN** validation checks schema artifact completion
- **THEN** that artifact is treated as complete using the same glob behavior as status

#### Scenario: Generated glob artifacts are missing when no matches exist
- **GIVEN** a schema artifact generates `specs/**/*.md`
- **AND** no matching files exist under the change directory
- **WHEN** validation checks schema artifact completion
- **THEN** that artifact is reported as incomplete

## Attachments

None.
