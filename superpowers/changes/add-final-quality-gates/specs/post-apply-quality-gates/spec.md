## ADDED Requirements

### Requirement: Apply SHALL Run Final Quality Gates After Test Hardening
After all tracked implementation tasks and concrete Test Hardening rows are complete, `/sp:apply` SHALL run final quality gates in this order: host-native code review, simplify, verify, and design-verify. It SHALL delegate each gate to one fresh, distinct subagent, await and integrate that worker's report before starting the next gate, and not recommend archive before every applicable gate passes.

#### Scenario: Apply reaches the final quality stage
- **WHEN** all implementation tasks and Test Hardening evidence are complete
- **THEN** `/sp:apply` SHALL first request or execute the host-native code-review capability
- **AND** it SHALL then execute simplify, verify, and design-verify in that order
- **AND** it SHALL present a separate outcome and fresh evidence for each gate

#### Scenario: Final-gate records do not block Test Hardening entry
- **WHEN** `test-plan.md` contains planned Final Quality Gates rows before those gates execute
- **THEN** `/sp:apply` SHALL evaluate Test Hardening from its concrete testing/hardening rows only
- **AND** it SHALL evaluate Final Quality Gates separately after Test Hardening instead of treating their planned rows as a hardening failure

#### Scenario: Final gates are delegated and integrated sequentially
- **WHEN** `/sp:apply` starts final quality gates
- **THEN** it SHALL launch a fresh, distinct subagent for each gate
- **AND** it SHALL give that worker the scoped diff, relevant artifacts, and fresh earlier evidence
- **AND** it SHALL await and integrate each worker's report before launching the next gate
- **AND** it SHALL not reuse a worker or substitute a coordinator-context gate

#### Scenario: Host cannot launch a gate subagent
- **WHEN** the host lacks an agent-spawning or delegation capability
- **THEN** `/sp:apply` SHALL report the applicable final-quality stage as blocked with the missing capability
- **AND** it SHALL pause instead of silently performing that gate in the coordinator context

### Requirement: Test Hardening SHALL Run The Canonical Non-Visual Test Suite
Before Test Hardening may complete, `/sp:apply` SHALL identify and run the project's complete canonical non-visual test suite using repository scripts, CI configuration, test documentation, and the active `test-plan.md`. This requirement applies even when all task-local tests have passed.

#### Scenario: Test Hardening identifies full non-visual coverage
- **WHEN** implementation tasks are complete and Test Hardening begins
- **THEN** the agent SHALL record the selected non-visual commands, their sources of authority, and any explicitly visual-only checks excluded from the suite
- **AND** it SHALL NOT treat a partial or guessed command set as full validation

#### Scenario: Test Hardening runs the full non-visual suite
- **WHEN** the canonical non-visual test suite has been identified
- **THEN** the agent SHALL run every selected command before marking Test Hardening complete
- **AND** it SHALL record fresh outcomes in `test-plan.md`

#### Scenario: Full non-visual validation cannot pass
- **WHEN** a selected non-visual command fails, cannot run, or the full suite cannot be determined
- **THEN** the agent SHALL keep Test Hardening incomplete and repair or pause with the failing command or missing source of authority
- **AND** it SHALL NOT enter final quality gates

#### Scenario: Standalone quality workflows are not selected in the profile
- **WHEN** a profile installs `/sp:apply` but does not expose one or more standalone quality-gate commands
- **THEN** `/sp:apply` SHALL retain and execute their gate contracts
- **AND** profile selection SHALL NOT make final quality gates unavailable

### Requirement: Apply SHALL Reuse Host-Native Code Review Without Generating One
The system SHALL not generate a Superpowers `code-review` skill or command. `/sp:apply` SHALL use the host's native code-review skill or command when available, and otherwise require an explicitly reported equivalent independent final code review.

#### Scenario: Host-native code review is available
- **WHEN** the current agent host exposes a native code-review capability
- **THEN** `/sp:apply` SHALL invoke that capability before simplify
- **AND** it SHALL preserve the review's findings and resolution status in its final quality-gate summary

#### Scenario: Host-native code review has no named command
- **WHEN** the host has no discoverable named code-review skill or command
- **THEN** `/sp:apply` SHALL perform an equivalent independent final review of the integrated change
- **AND** it SHALL state that the host-native named capability was unavailable
- **AND** it SHALL NOT silently skip the review gate or generate a replacement Superpowers workflow

### Requirement: Failed Quality Gates SHALL Return To Implementation
A failed or blocked final quality gate SHALL prevent apply completion. The agent SHALL repair resolvable defects, rerun the affected earlier checks, and restart the final quality sequence from the first invalidated gate with new distinct subagents.

#### Scenario: Code review, simplify, or verify changes implementation
- **WHEN** resolving a quality-gate finding or applying a simplify cleanup changes implementation
- **THEN** the agent SHALL rerun affected tests and Test Hardening evidence
- **AND** it SHALL restart final quality gates from code review with new distinct subagents before it may claim apply completion

#### Scenario: Design verification is blocked
- **WHEN** design-verify is blocked for an applicable UI change
- **THEN** `/sp:apply` SHALL report the blocking prerequisite and pause completion
- **AND** it SHALL NOT recommend archive

### Requirement: Final Quality Gate Results SHALL Be Explicit
The apply completion output SHALL identify each gate as `passed`, `failed`, `blocked`, or `not applicable`, with commands or runtime evidence and all justified deferrals.

#### Scenario: All applicable gates pass
- **WHEN** every applicable final quality gate has passed
- **THEN** `/sp:apply` SHALL summarize the four gate outcomes and supporting evidence
- **AND** it MAY recommend the normal archive workflow

#### Scenario: Apply resumes after its artifacts say all done
- **WHEN** apply instructions report `state: "all_done"`
- **THEN** `/sp:apply` SHALL inspect the durable final-gate record before recommending archive
- **AND** it SHALL run or resume final gates when a record is missing, failed, or applicable-blocked

#### Scenario: A gate is not applicable
- **WHEN** a gate legitimately does not apply, such as design verification for a non-UI change
- **THEN** `/sp:apply` SHALL record the reason and scope evidence
- **AND** it SHALL distinguish that result from a passed gate

## Attachments

None.
