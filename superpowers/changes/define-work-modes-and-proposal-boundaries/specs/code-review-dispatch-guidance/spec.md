## ADDED Requirements

### Requirement: Code Review Dispatch Guidance SHALL Have an Explicit Timing-Oriented Identity
The system SHALL provide the reusable static guidance under `skills/when-to-dispatch-code-review/` with matching frontmatter identity and reviewer prompt references. It SHALL not generate a Superpowers `/sp:code-review` command or duplicate the host-native code-review capability.

#### Scenario: Live guidance is renamed
- **WHEN** current source guidance and its live references are refreshed
- **THEN** the old `requesting-code-review` path SHALL no longer be the active source path
- **AND** the new timing-oriented path SHALL be discoverable in current guidance

#### Scenario: Installed tools are refreshed on Windows
- **WHEN** a supported tool installation is updated on Windows
- **THEN** the renamed static skill SHALL be copied to the tool's configured skills directory using platform-safe path handling
- **AND** the system SHALL not require hardcoded `/` separators or a duplicate alias directory

### Requirement: Code Review Dispatch SHALL Be Mode-Aware and Duplicate-Safe
The dispatch guidance SHALL distinguish Direct Modification, standalone subagent-driven development, and Proposal → Review → Apply. `/sp:apply` SHALL own its mandatory final code-review gate after Test Hardening; standalone SDD SHALL use one final cross-unit review; Direct Modification SHALL dispatch review based on risk, user request, delivery boundary, or merge readiness. The guidance SHALL not prescribe review after every fixed-size task batch.

#### Scenario: Apply reaches final quality gates
- **WHEN** `/sp:apply` completes implementation tasks and Test Hardening
- **THEN** it SHALL dispatch host-native code review as the first final gate
- **AND** the generic dispatch skill SHALL not trigger an additional per-batch review

#### Scenario: Standalone SDD integrates units
- **WHEN** all logical Dispatch Units in standalone SDD are integrated
- **THEN** the coordinator SHALL perform one final cross-unit review
- **AND** it SHALL not request a second complete review unless a reviewer explicitly requests confirmation of a named finding

#### Scenario: Direct work reaches a meaningful delivery boundary
- **WHEN** a Direct Modification is a major feature, merge candidate, high-risk fix, or the user explicitly asks for review
- **THEN** the coordinator SHALL dispatch an appropriate code reviewer
- **AND** it SHALL provide a complete integrated target rather than an isolated checkbox

### Requirement: Code Review Findings SHALL Use the Agreed Repair Ownership
Code review workers SHALL be read-only by default and SHALL report strengths, evidence, severity-classified findings, and readiness. The main coordinator SHALL repair accepted findings and run targeted verification. A host-native reviewer MAY self-repair only when that capability is explicitly available and authorized by the active workflow.

#### Scenario: Review reports a valid P0 or important finding
- **WHEN** the reviewer identifies a valid issue in the reviewed scope
- **THEN** the coordinator SHALL evaluate the finding against codebase reality and the change requirements
- **AND** it SHALL implement or explicitly reject the repair with technical reasoning before claiming readiness

#### Scenario: Review feedback is unclear
- **WHEN** a review item cannot be understood or verified
- **THEN** the coordinator SHALL use `receiving-code-review` behavior to pause, clarify, or investigate
- **AND** it SHALL not blindly modify code based on the unclear item

### Requirement: Dispatch Guidance SHALL Keep Final-Gate Retry Policy in Apply
The dispatch skill SHALL describe when to invoke review but SHALL not duplicate the final-quality P0/P1/P2, BLOCKER, fresh-worker, or four-round retry policy. Those rules SHALL remain in the Apply/final-quality contracts.

#### Scenario: A final code-review round has no P0
- **WHEN** Apply's fresh reviewer reports resolvable non-P0 findings and no P0
- **THEN** the coordinator SHALL repair the accepted findings, run relevant validation, and then pass the code-review gate to Simplify
- **AND** the dispatch skill SHALL not request a separate retry solely for P1/P2 findings

#### Scenario: A final code-review prerequisite is blocked
- **WHEN** the host cannot launch the required reviewer or a required external prerequisite is unavailable
- **THEN** Apply SHALL report the gate as blocked without consuming a review round
- **AND** the generic dispatch guidance SHALL not silently substitute an unscoped coordinator review
