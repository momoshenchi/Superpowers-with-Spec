## ADDED Requirements

### Requirement: Verify SHALL Execute Required Manual Coverage
`/sp:verify` SHALL read all concrete rows in `test-plan.md` `## Manual Coverage` after the canonical non-visual suite preflight. For every applicable row, it SHALL perform the stated check through its normal entry point, record method/environment, actions, observed outcome, and inspectable evidence, then update or report its status.

#### Scenario: All required manual checks pass
- **WHEN** every applicable Manual Coverage row is executed successfully
- **THEN** Verify SHALL record each row as `passed` with evidence
- **AND** Verify MAY pass if all other completion and correctness checks pass

#### Scenario: A required manual check cannot run
- **WHEN** an applicable Manual Coverage row cannot run because a required prerequisite is unavailable
- **THEN** Verify SHALL report the row and Verify as `blocked` with the missing prerequisite
- **AND** it SHALL NOT claim the row was executed or recommend archive

#### Scenario: A manual row is not applicable
- **WHEN** a Manual Coverage row is demonstrably outside the implemented scope
- **THEN** Verify SHALL record `not applicable` with a concrete scope rationale
- **AND** it SHALL not substitute a deferred reason for execution evidence
