## ADDED Requirements

### Requirement: Apply SHALL include a post-task Test Hardening stage
`/sp:apply` SHALL treat completed implementation tasks as the transition into Test Hardening, not as immediate readiness to archive.

#### Scenario: Implementation tasks become complete
- **WHEN** the agent marks all implementation tasks in `tasks.md` complete
- **THEN** the agent SHALL announce that implementation tasks are complete
- **AND** the agent SHALL transition into Test Hardening before claiming apply completion
- **AND** the agent SHALL NOT suggest `/sp:archive` until Test Hardening is complete

#### Scenario: Apply resumes after tasks are already complete
- **WHEN** `/sp:apply` is invoked for a change whose `tasks.md` checklist is already complete
- **AND** `test-plan.md` does not mark Test Hardening complete
- **THEN** the agent SHALL resume at the Test Hardening stage
- **AND** the agent SHALL NOT treat the change as apply-complete solely because tasks are complete

#### Scenario: Apply resumes after hardening is complete
- **WHEN** `/sp:apply` is invoked for a change whose tasks are complete
- **AND** `test-plan.md` marks Test Hardening complete
- **THEN** the agent MAY report implementation and hardening as complete
- **AND** the agent MAY suggest the normal next workflow action

### Requirement: Test Hardening SHALL audit the completed implementation
The Test Hardening stage SHALL examine the finished code and test diff to find coverage gaps that pre-implementation red tests may have missed.

#### Scenario: Agent enters Test Hardening
- **WHEN** Test Hardening begins
- **THEN** the agent SHALL inspect the relevant code diff and test diff using repository-native evidence such as `git diff --stat` and `git diff`
- **AND** compare them against specs, design risks, tasks, execution plan, and the pre-implementation `test-plan.md` draft
- **AND** identify missing coverage before final verification

#### Scenario: Worktree contains unrelated changes
- **WHEN** the current diff includes files that are unrelated to the active change
- **THEN** the agent SHALL ignore clearly unrelated files for hardening scope
- **AND** if unrelated changes cannot be separated safely, the agent SHALL pause and report the ambiguity instead of claiming hardening complete

#### Scenario: Boundary and abnormal cases exist
- **WHEN** the change includes inputs, state transitions, filesystem paths, permissions, network calls, user workflows, storage, or external dependencies
- **THEN** the agent SHALL check for boundary and abnormal coverage relevant to those surfaces
- **AND** add feasible unit, integration, or E2E tests for uncovered cases

#### Scenario: User-visible behavior changes
- **WHEN** implementation changes user-visible or browser-visible behavior
- **THEN** Test Hardening SHALL consider integration, E2E, visual, accessibility, or manual verification coverage as appropriate for the affected surface
- **AND** record the selected coverage level and evidence in `test-plan.md`

### Requirement: Test Hardening SHALL block completion on discovered defects
The apply workflow SHALL not complete hardening while hardening tests fail or newly discovered defects remain unresolved.

#### Scenario: Hardening test fails due to product behavior
- **WHEN** a hardening test fails because the implementation does not satisfy the intended behavior
- **THEN** the agent SHALL fix the implementation or pause as blocked
- **AND** the agent SHALL record the failing command, failure summary, and affected files in `test-plan.md`
- **AND** the agent SHALL NOT mark `- [x] Test Hardening complete`

#### Scenario: Hardening test fails due to test setup
- **WHEN** a hardening test fails because of invalid test setup rather than product behavior
- **THEN** the agent SHALL fix the test setup and rerun the command
- **AND** the agent SHALL record only the final meaningful command outcome as completion evidence

#### Scenario: Feasible coverage gap remains
- **WHEN** Test Hardening identifies a feasible automated coverage gap
- **THEN** the agent SHALL add or update tests before apply completion
- **AND** the agent SHALL NOT defer the gap without a specific technical or scope reason

### Requirement: Test Hardening SHALL not replace TDD red tests
The apply workflow SHALL preserve pre-implementation TDD pressure while adding a separate post-implementation hardening pass.

#### Scenario: Agent starts a task from execution plan
- **WHEN** the agent starts an implementation task
- **THEN** it SHALL still follow the red-test-before-production-code guidance from `execution-plan.md`
- **AND** it SHALL not postpone all testing until Test Hardening

#### Scenario: Agent finishes implementation
- **WHEN** task-level TDD tests pass and the implementation task is complete
- **THEN** those passing tests SHALL be treated as necessary but not sufficient for apply completion
- **AND** the agent SHALL still perform Test Hardening against the final diff

### Requirement: Apply output SHALL report implementation and hardening separately
`/sp:apply` SHALL make progress reporting explicit so users can tell whether code tasks, test hardening, or both are complete.

#### Scenario: Implementation tasks are done but hardening remains
- **WHEN** all tasks are complete but Test Hardening remains incomplete
- **THEN** output SHALL report implementation progress as complete
- **AND** output SHALL report Test Hardening as pending or in progress
- **AND** output SHALL list the next hardening actions

#### Scenario: Test Hardening completes
- **WHEN** the exact marker `- [x] Test Hardening complete` is present in `test-plan.md`
- **THEN** output SHALL summarize tests added or reviewed, verification commands run, and any documented deferrals
- **AND** output SHALL state that apply is complete only after this summary
