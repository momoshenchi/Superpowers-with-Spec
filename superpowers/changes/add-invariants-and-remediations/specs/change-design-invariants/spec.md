## ADDED Requirements

### Requirement: Design template requires Invariants section
The default spec-driven change-local `design.md` template SHALL include a formal required heading `## Invariants` after `## Contracts`. Authors MAY satisfy the section with an explicit N/A line when no cross-path invariants apply.

#### Scenario: Template skeleton lists Invariants
- **WHEN** an agent loads the default design template for a new change
- **THEN** the template SHALL contain the exact heading `## Invariants`
- **AND** `## Invariants` SHALL appear after `## Contracts` in document order

#### Scenario: N/A invariants allowed
- **WHEN** a change has no cross-path invariants
- **THEN** authors SHALL write an explicit N/A statement under `## Invariants` such as `N/A — no cross-path invariants`
- **AND** an empty Invariants section with neither rows nor N/A SHALL be treated as incomplete

### Requirement: Invariants are falsifiable and identifiable
When `## Invariants` is not N/A, each invariant SHALL have a stable ID, a statement that must remain true across in-scope paths, a description of how to falsify it, and an owner test or check reference.

#### Scenario: Invariant row is reviewable
- **WHEN** authors record a non-N/A invariant
- **THEN** the entry SHALL include an ID (for example `I1`), the invariant statement, how to falsify it, and an owner check pointer
- **AND** vague wish-list bullets without falsification guidance SHALL be treated as incomplete for review purposes

### Requirement: Design instruction mandates Invariants
The design artifact instruction for the default schema SHALL require `## Invariants` as a formal section (N/A allowed) and SHALL NOT prohibit authors from including that section.

#### Scenario: Instruction no longer forbids Invariants
- **WHEN** an agent reads the design artifact instruction
- **THEN** the instruction SHALL require `## Invariants`
- **AND** it SHALL NOT list Invariants among forbidden invented mandatory headings

### Requirement: Change review checks Invariants presence
Proposal change review SHALL treat a missing `## Invariants` heading in an in-scope `design.md` as a content completeness BLOCKER, while accepting an explicit N/A body.

#### Scenario: Missing Invariants heading is a BLOCKER
- **WHEN** change review assesses a schema-required `design.md`
- **AND** the file has no `## Invariants` heading
- **THEN** the reviewer SHALL report a BLOCKER for missing Invariants

#### Scenario: N/A Invariants passes presence check
- **WHEN** `design.md` contains `## Invariants` with an explicit N/A line
- **THEN** presence review SHALL NOT fail solely for lack of invariant rows
