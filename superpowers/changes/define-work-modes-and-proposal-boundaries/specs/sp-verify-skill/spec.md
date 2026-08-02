## ADDED Requirements

### Requirement: Verify Findings SHALL Be Reported Before Coordinator Repair
The `/sp:verify` worker SHALL be read-only by default: it SHALL report evidence-backed findings and readiness, while the coordinator SHALL evaluate and repair accepted product, architecture, or workflow findings before claiming readiness. A host-native workflow MAY authorize a worker self-repair only when that authorization is explicit.

#### Scenario: Verify reports a repairable finding
- **WHEN** Verify identifies a failed check, applicable E2E failure, or `CRITICAL` finding
- **THEN** the Verify worker SHALL report the finding, evidence, severity, and affected files or journeys without modifying the implementation by default
- **AND** the coordinator SHALL evaluate the finding, apply the accepted repair, and run targeted verification
- **AND** a final-quality invocation SHALL start the next fresh Verify round after a repair rather than silently passing the current round

#### Scenario: Verify feedback is unclear
- **WHEN** a Verify finding cannot be reproduced or its required repair is ambiguous
- **THEN** the coordinator SHALL investigate or clarify the finding before editing
- **AND** it SHALL not apply an unverified change solely to make the report appear clean

#### Scenario: Verify has no blocking finding
- **WHEN** Verify completes with no failed check, applicable E2E failure, `CRITICAL` finding, or unresolved prerequisite
- **THEN** the worker SHALL report the canonical suite, applicable coverage, artifact checks, and evidence
- **AND** the coordinator MAY advance to the next gate or completion step without an extra Verify pass
