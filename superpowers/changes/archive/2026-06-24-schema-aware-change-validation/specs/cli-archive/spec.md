## ADDED Requirements

### Requirement: Archive preflight SHALL require complete schema artifacts
The archive command SHALL block archiving when the change does not complete every artifact declared by its resolved workflow schema, unless validation is explicitly skipped with `--no-validate`.

#### Scenario: Archive blocks incomplete schema artifacts
- **GIVEN** a change has all tasks marked complete
- **AND** its delta specs are valid
- **AND** the resolved schema declares `test-plan`
- **AND** `test-plan.md` is missing
- **WHEN** a user runs `superpowers archive <change-id> --yes`
- **THEN** archive preflight fails
- **AND** the change directory remains active
- **AND** main specs are not updated
- **AND** output identifies the missing `test-plan` artifact

#### Scenario: Archive proceeds after schema artifacts are complete
- **GIVEN** a change completes every artifact declared by its resolved schema
- **AND** existing archive validation passes
- **WHEN** a user runs `superpowers archive <change-id> --yes`
- **THEN** archive proceeds with spec update and archive movement behavior unchanged

#### Scenario: Unsafe archive skip bypasses schema artifact validation
- **GIVEN** a change is missing a schema-declared artifact
- **WHEN** a user runs `superpowers archive <change-id> --no-validate --yes`
- **THEN** archive skips schema artifact validation
- **AND** output continues to warn that validation was skipped

#### Scenario: Skipping spec updates does not skip schema artifact validation
- **GIVEN** a change is missing a schema-declared artifact
- **WHEN** a user runs `superpowers archive <change-id> --skip-specs --yes`
- **THEN** archive preflight still validates schema artifact completion
- **AND** archive fails unless `--no-validate` is also provided
- **AND** the change directory remains active

## Attachments

None.
