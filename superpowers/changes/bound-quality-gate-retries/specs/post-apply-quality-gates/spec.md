## ADDED Requirements

### Requirement: Final Quality Gates SHALL Use Bounded Retry Semantics
`/sp:apply` SHALL distinguish final-quality severity from gate availability: `P0` SHALL be equivalent to Verify's `CRITICAL` severity, while `BLOCKER` SHALL mean a missing prerequisite or external decision and SHALL remain independent of P0/P1/P2. A `BLOCKER` SHALL pause the affected gate rather than consume a retry round.

#### Scenario: A gate is blocked
- **WHEN** a final-quality gate cannot run because of a missing runtime, credential, visual design source, delegation capability, or required user decision
- **THEN** `/sp:apply` SHALL report the gate as `blocked` with the missing prerequisite
- **AND** it SHALL pause without starting another retry round

### Requirement: Code Review SHALL Be Retried Only For P0 Findings
Each final code-review round SHALL use a fresh independent subagent. The worker SHALL repair every resolvable finding and run relevant verification before reporting its outcome. A review with no P0 finding SHALL pass after those repairs; a review containing one or more P0 findings SHALL trigger a fresh next review round.

#### Scenario: First code-review round has no P0
- **WHEN** the first code-review round repairs all resolvable findings and reports no P0 finding
- **THEN** the code-review gate SHALL pass
- **AND** `/sp:apply` SHALL continue to Simplify without a second code-review round

#### Scenario: Code-review round has P0
- **WHEN** any code-review round finds one or more P0 findings
- **THEN** the worker SHALL repair every resolvable finding and record its evidence
- **AND** `/sp:apply` SHALL start a fresh code-review round before proceeding

#### Scenario: Fourth code-review round still has P0
- **WHEN** code-review round four reports a P0 finding
- **THEN** `/sp:apply` SHALL report the code-review gate as failed
- **AND** it SHALL NOT start a fifth code-review round or recommend archive

### Requirement: Verify And Design Verification SHALL Retry From Their Own Entry Points
After Simplify resolves its work, `/sp:apply` SHALL enter Verify. A failed Verify SHALL be repaired and retried from Verify; a failed design-verification gate SHALL be repaired and retried from design-verify. Each retry SHALL use a fresh gate subagent and SHALL be limited to four total rounds at that entry point. The Verify count SHALL include the first Verify round entered after Simplify.

#### Scenario: Simplify hands off to Verify
- **WHEN** Simplify has repaired or safely completed its cleanup work
- **THEN** `/sp:apply` SHALL begin Verify rather than restart code review or Simplify
- **AND** that Verify attempt SHALL count as round one of at most four Verify rounds

#### Scenario: Verify fails before its fourth round
- **WHEN** a Verify round fails and the defect is resolvable
- **THEN** `/sp:apply` SHALL repair the defect and start a fresh Verify round
- **AND** it SHALL rerun Verify's canonical preflight and applicable E2E acceptance in that round

#### Scenario: Verify fails in its fourth round
- **WHEN** Verify round four fails
- **THEN** `/sp:apply` SHALL report Verify as failed
- **AND** it SHALL not start a fifth Verify round or recommend archive

#### Scenario: Design verification fails before its fourth round
- **WHEN** a design-verification round fails and the visual defect is resolvable
- **THEN** `/sp:apply` SHALL repair the defect and start a fresh design-verification round
- **AND** it SHALL not restart earlier final gates solely for that retry

#### Scenario: Design verification fails in its fourth round
- **WHEN** design-verification round four fails
- **THEN** `/sp:apply` SHALL report design verification as failed
- **AND** it SHALL not start a fifth design-verification round or recommend archive

## Attachments

None.
