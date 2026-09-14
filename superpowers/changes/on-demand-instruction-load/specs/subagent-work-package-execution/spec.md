## MODIFIED Requirements

### Requirement: Single final integration review
For the default `spec-driven` change workflow, the system SHALL require workers to run the verification and self-review defined for their dispatch units, but SHALL defer independent integrated code review until all dispatch units are integrated. That independent review SHALL be Apply’s Final Quality Gates code-review gate. A second complete review around that gate SHALL NOT be required. Findings from that gate SHALL be repaired and verified with targeted checks by the Apply coordinator.

#### Scenario: Detailed task completion does not trigger formal review

- **WHEN** a worker completes a numbered task within a dispatch unit
- **THEN** the worker SHALL continue through the remaining tasks in that unit
- **AND** the coordinator SHALL NOT require a specification-compliance review and a code-quality review for that individual task

#### Scenario: Review after all work packages are integrated

- **WHEN** all declared dispatch units are complete, their changes are integrated, and Test Hardening is complete
- **THEN** Apply SHALL run its ordered Final Quality Gates, whose code-review gate is the single integrated code review
- **AND** the coordinator SHALL NOT add another complete integration review before or after that gate

## Attachments

None.
