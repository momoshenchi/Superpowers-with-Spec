## ADDED Requirements

### Requirement: Changes SHALL include a two-phase test-plan artifact
The spec-driven workflow SHALL include `test-plan.md` as a dedicated artifact for test coverage planning and post-implementation hardening evidence.

#### Scenario: User creates the test plan before implementation
- **WHEN** `proposal.md`, specs, `design.md`, `tasks.md`, and `execution-plan.md` exist
- **THEN** `test-plan.md` SHALL be the next required artifact before `/sp:apply` begins
- **AND** the initial `test-plan.md` content SHALL map requirements, scenarios, and known risks to intended test coverage
- **AND** the initial `test-plan.md` SHALL NOT claim post-implementation verification evidence before implementation has happened

#### Scenario: User updates the test plan after implementation
- **WHEN** `/sp:apply` completes the implementation task checklist
- **THEN** the agent SHALL update `test-plan.md` with post-implementation Test Hardening evidence
- **AND** the update SHALL account for the actual code diff, test diff, and any implementation risks discovered during coding
- **AND** the update SHALL record verification commands and outcomes

### Requirement: Test plan SHALL distinguish red tests from hardening tests
`test-plan.md` SHALL describe the relationship between pre-implementation red tests and post-implementation Test Hardening without merging their purposes.

#### Scenario: Agent reads the test plan before implementation
- **WHEN** the agent reads `test-plan.md` before writing production code
- **THEN** the document SHALL state that red tests in `execution-plan.md` drive the next implementation step
- **AND** the document SHALL state that Test Hardening audits the completed implementation after tasks are done
- **AND** the document SHALL prevent the agent from treating pre-implementation red tests as a substitute for post-implementation hardening

#### Scenario: Agent performs post-implementation hardening
- **WHEN** implementation tasks are complete
- **THEN** the agent SHALL use `test-plan.md` to look for missing boundary, abnormal, integration, E2E, and non-critical-path coverage
- **AND** the agent SHALL add missing automated tests when feasible
- **AND** the agent SHALL document any deferred manual or impractical coverage with a specific reason

### Requirement: Test plan SHALL use a coverage matrix
`test-plan.md` SHALL use a compact matrix-oriented structure rather than duplicating the full implementation steps from `execution-plan.md`.

#### Scenario: Test plan draft is created
- **WHEN** the agent creates `test-plan.md`
- **THEN** the artifact SHALL include a requirement and scenario coverage matrix
- **AND** each row SHALL identify whether coverage belongs in unit, integration, E2E, manual, or not-applicable verification
- **AND** each row SHALL include a status such as planned, covered, deferred, or not applicable

#### Scenario: Hardening record is completed
- **WHEN** the agent completes the Test Hardening stage
- **THEN** the artifact SHALL include a command evidence section with exact commands run and outcomes
- **AND** the artifact SHALL include any added or modified test files
- **AND** the artifact SHALL include unresolved gaps only when they have a clear deferment reason

### Requirement: Test plan SHALL mark hardening completion explicitly
`test-plan.md` SHALL include explicit checklist state so `/sp:apply` can decide whether post-implementation hardening is complete.

#### Scenario: Test plan starts as a draft
- **WHEN** the artifact is first created before implementation
- **THEN** the artifact SHALL include the exact unchecked marker `- [ ] Test Hardening complete`
- **AND** the artifact SHALL be usable as an apply prerequisite without claiming that post-implementation work is done

#### Scenario: Test hardening is finished
- **WHEN** post-implementation hardening has reviewed the diff, added feasible missing tests, run verification, and documented deferrals
- **THEN** the artifact SHALL update the exact marker to `- [x] Test Hardening complete`
- **AND** `/sp:apply` may then report the change as apply-complete

#### Scenario: Completion marker uses other wording
- **WHEN** `test-plan.md` does not contain the exact marker `- [x] Test Hardening complete`
- **THEN** `/sp:apply` SHALL treat Test Hardening as incomplete
- **AND** the agent SHALL NOT infer completion from alternate wording, headings, summaries, or command evidence alone
