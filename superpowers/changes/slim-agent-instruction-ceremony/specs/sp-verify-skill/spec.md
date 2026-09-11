## ADDED Requirements

### Requirement: Verify SHALL resolve the change without guessing
`/sp:verify` SHALL use an explicit change name when provided. When omitted, it SHALL use the change bound in conversation or the only active change that has implementation tasks. It SHALL prompt only when two or more such changes could match.

#### Scenario: Verify infers a sole active change
- **WHEN** agent executes `/sp:verify` without a change name
- **AND** exactly one active change has implementation tasks
- **THEN** the agent SHALL verify that change
- **AND** it SHALL announce the selected name

#### Scenario: Verify prompts when several changes match
- **WHEN** agent executes `/sp:verify` without a change name
- **AND** two or more active changes have implementation tasks
- **AND** conversation does not name one
- **THEN** the agent SHALL prompt the user to select
- **AND** it SHALL NOT guess

### Requirement: Verify SHALL split test-plan rows from Git-aware tests
Correctness SHALL execute registered applicable `test-plan.md` rows, including Manual Coverage and `agent-browser` rows deferred from Test Hardening. The non-`test-plan` automated suite stage SHALL use Git-aware related tests when supported and SHALL NOT require a complete canonical suite to pass.

#### Scenario: Verify executes registered test-plan rows
- **WHEN** verifying correctness on a spec-driven change with `test-plan.md`
- **THEN** the agent SHALL run every applicable concrete row outside Deferred Coverage
- **AND** it SHALL record inspectable evidence for each row

#### Scenario: Verify uses Git-aware tests outside test-plan
- **WHEN** verify reaches the non-`test-plan` suite stage and the runner supports Git-aware selection
- **THEN** the agent SHALL run that related-test command
- **AND** it SHALL NOT require the complete canonical non-visual suite as the pass condition

## MODIFIED Requirements

### Requirement: Verify Skill Invocation
The system SHALL provide an `/sp:verify` skill that validates implementation against change artifacts.

#### Scenario: Verify with change name provided
- **WHEN** agent executes `/sp:verify <change-name>`
- **THEN** the agent verifies implementation for that specific change
- **AND** produces a verification report

#### Scenario: Verify without change name
- **WHEN** agent executes `/sp:verify` without a change name
- **THEN** the agent SHALL resolve the change using the added unambiguous-selection rule
- **AND** shows only changes that have implementation tasks when a prompt is required

#### Scenario: Change has no tasks
- **WHEN** selected change has no tasks.md or tasks are empty
- **THEN** the agent reports "No tasks to verify"
- **AND** suggests running `/sp:continue` to create tasks

## Attachments

None.
