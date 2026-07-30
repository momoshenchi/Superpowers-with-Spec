## ADDED Requirements

### Requirement: Design Verify SHALL Support Bounded Fresh Retries
When `/sp:design-verify` runs as an apply final-quality gate, each failed-but-repairable visual conformance attempt SHALL be followed by a fresh numbered design-verification attempt. The gate SHALL permit at most four total attempts and SHALL not restart earlier quality gates solely because of a design-verification retry.

#### Scenario: A visual defect is repaired
- **WHEN** a design-verification attempt before attempt four finds a repairable nonconformance
- **THEN** the agent SHALL repair it and use a fresh subagent to rerun design verification
- **AND** it SHALL retain route, rule, and runtime evidence for each attempt

#### Scenario: Design verify reaches its retry limit
- **WHEN** design-verification attempt four still reports a visual nonconformance
- **THEN** it SHALL report `failed`
- **AND** it SHALL not begin a fifth attempt

#### Scenario: Design verify is blocked
- **WHEN** UI scope lacks a required runtime, browser capability, credential, or visual design source
- **THEN** design verification SHALL report `blocked` with the missing prerequisite
- **AND** it SHALL pause rather than consume a retry attempt

## Attachments

None.
