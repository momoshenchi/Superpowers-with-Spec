## ADDED Requirements

### Requirement: Verify coherence checks non-N/A Invariants
When verifying coherence and `design.md` contains a non-N/A `## Invariants` section, the Verify workflow SHALL assess whether implementation and tests uphold those invariants and SHALL report violations.

#### Scenario: Broken invariant is reported
- **WHEN** Verify assesses coherence
- **AND** `design.md` lists invariant `I1` with an owner check
- **AND** the owner check fails or implementation contradicts `I1` in a way that breaks the stated invariant
- **THEN** Verify SHALL report a CRITICAL issue citing `I1` (Final Quality Gates P0-equivalent)
- **AND** SHALL recommend remediation that restores the invariant or updates design with explicit rationale

#### Scenario: Soft design drift without owner-check failure
- **WHEN** Verify finds narrative tension with an invariant statement
- **AND** the recorded owner check still passes
- **THEN** Verify MAY report a WARNING
- **AND** SHALL NOT escalate to CRITICAL solely on soft documentary drift

#### Scenario: N/A Invariants skips invariant checklist
- **WHEN** `## Invariants` is an explicit N/A statement
- **THEN** Verify SHALL NOT fail coherence solely for lack of invariant rows

### Requirement: Verify retry rounds read remediations
When a Verify round runs after coordinator repairs and `remediations.md` exists, Verify SHALL read remediation entries as context for residual findings and SHALL treat a P0 remediation marked `resolved` without a Guard as incomplete repair evidence.

#### Scenario: Missing guard on resolved P0 is incomplete
- **WHEN** Verify reads `remediations.md`
- **AND** an entry claims severity P0 and status `resolved`
- **AND** the entry has no Guard
- **THEN** Verify SHALL report incomplete repair evidence
- **AND** SHALL NOT treat that finding as fully closed based solely on the status label

#### Scenario: Absent remediations file on first Verify
- **WHEN** Verify runs and no accepted P0/P1 repairs have been recorded yet
- **AND** `remediations.md` is absent
- **THEN** Verify SHALL proceed without requiring the file
