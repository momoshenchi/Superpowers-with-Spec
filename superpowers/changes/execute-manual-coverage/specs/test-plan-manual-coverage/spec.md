## ADDED Requirements

### Requirement: Test Plans SHALL Separate Manual And Deferred Coverage
The spec-driven `test-plan.md` template SHALL contain a `## Manual Coverage` table separate from a `## Deferred Coverage` table. Every concrete Manual Coverage row SHALL state its check or scenario, execution method/environment, `Status`, and inspectable `Evidence`. Every concrete Deferred Coverage row SHALL state the coverage gap, a specific deferral reason, and a safer alternative or follow-up.

#### Scenario: A manual check is required
- **WHEN** a test plan contains an applicable manual coverage item
- **THEN** the item SHALL be recorded in `## Manual Coverage`
- **AND** it SHALL remain incomplete while its status is `planned`, `failing`, `blocked`, blank, or a placeholder

#### Scenario: Coverage is intentionally deferred
- **WHEN** a test cannot currently be performed and is intentionally deferred
- **THEN** it SHALL be recorded in `## Deferred Coverage` with a specific reason and follow-up
- **AND** it SHALL NOT be presented as executed evidence or a passed manual check

### Requirement: Test Hardening SHALL Include Manual Coverage Statuses
Test Hardening SHALL treat every concrete Manual Coverage status row as complete only when it is `passed` or scope-backed `not applicable`. An applicable `blocked` or failed manual row SHALL prevent Test Hardening and apply completion.

#### Scenario: A required manual check is blocked
- **WHEN** a Manual Coverage row lacks a required safe target, runtime, credential, external permission, or other prerequisite
- **THEN** its status SHALL be `blocked` with the missing prerequisite in Evidence
- **AND** Test Hardening SHALL remain incomplete
