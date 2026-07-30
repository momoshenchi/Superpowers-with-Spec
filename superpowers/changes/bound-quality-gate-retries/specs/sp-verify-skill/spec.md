## ADDED Requirements

### Requirement: Verify SHALL Support Bounded Fresh Retries
When `/sp:verify` runs as an apply final-quality gate, every attempt SHALL use a fresh subagent and be numbered. The initial attempt after Simplify and every retry SHALL run the complete canonical non-visual suite before requirement/scenario assessment and applicable E2E acceptance. `CRITICAL` findings SHALL be identified as P0 for final-quality retry decisions.

#### Scenario: Verify attempt is retried
- **WHEN** a Verify attempt has a resolvable failed check, applicable E2E failure, or P0/CRITICAL finding before attempt four
- **THEN** the agent SHALL repair the issue and run a fresh numbered Verify attempt
- **AND** it SHALL preserve separate evidence for every attempt

#### Scenario: Verify reaches its retry limit
- **WHEN** Verify attempt four still has a failed check, applicable E2E failure, or P0/CRITICAL finding
- **THEN** Verify SHALL report `failed`
- **AND** it SHALL not begin a fifth attempt

#### Scenario: Verify is blocked
- **WHEN** the canonical suite or applicable E2E cannot run because a prerequisite is missing
- **THEN** Verify SHALL report `blocked` with the prerequisite
- **AND** it SHALL pause rather than consume a retry attempt

## Attachments

None.
