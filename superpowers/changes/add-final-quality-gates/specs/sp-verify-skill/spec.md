## MODIFIED Requirements

### Requirement: Correctness Verification
The agent SHALL verify that implementation matches the specifications, including a passing canonical non-visual test-suite preflight before evidence-based end-to-end acceptance whenever the change affects a runnable user or browser journey.

#### Scenario: Requirement implementation mapping
- **WHEN** verifying correctness
- **THEN** for each requirement in delta specs:
  - Search codebase for implementation
  - Identify relevant files and line numbers
  - Assess whether implementation satisfies the requirement

#### Scenario: Scenario coverage check
- **WHEN** verifying correctness
- **THEN** for each scenario in delta specs:
  - Check if the scenario's conditions are handled in code
  - Check if tests exist that cover the scenario
  - Report coverage status

#### Scenario: Implementation matches spec
- **WHEN** implementation appears to satisfy a requirement
- **THEN** report which files/lines implement it
- **AND** mark requirement as covered

#### Scenario: Implementation diverges from spec
- **WHEN** implementation exists but doesn't match spec intent
- **THEN** report the divergence as WARNING
- **AND** explain what differs
- **AND** suggest: either update implementation or update spec to match reality

#### Scenario: Missing implementation
- **WHEN** no implementation found for a requirement
- **THEN** report as CRITICAL issue
- **AND** suggest: "Implement requirement X" with guidance on what's needed

#### Scenario: Verify discovers the canonical non-visual test suite
- **WHEN** verify begins correctness validation
- **THEN** the agent SHALL inspect the repository's declared test scripts, CI configuration, test documentation, and active change `test-plan.md` to identify the complete canonical non-visual test suite
- **AND** it SHALL list the selected commands and the visual-only checks excluded from that preflight
- **AND** it SHALL NOT infer that one convenient test command is complete without repository evidence

#### Scenario: Canonical non-visual preflight passes
- **WHEN** the canonical non-visual test suite has been identified
- **THEN** the agent SHALL run every selected command and record fresh command output before beginning any changed-journey E2E acceptance
- **AND** it SHALL continue to E2E only when every selected command passes

#### Scenario: Canonical non-visual suite is unavailable or failing
- **WHEN** the complete non-visual suite cannot be determined, a selected command cannot run, or a selected command fails
- **THEN** the agent SHALL report correctness as blocked or failed with the command and reason
- **AND** it SHALL NOT begin or report a passing E2E acceptance result

#### Scenario: Changed runnable user journey requires E2E acceptance
- **WHEN** a requirement or scenario changes a runnable user-facing, browser-facing, or end-to-end workflow
- **THEN** the agent SHALL exercise the affected journey through its normal application entry point using repository E2E automation or an equivalent agent-controlled browser driver
- **AND** browser-facing journeys SHALL use real user-equivalent clicks, input, and navigation rather than an API-only substitute
- **AND** it SHALL verify the observable success outcome plus at least one applicable risk path, such as an error, empty, permission, repeat-operation, refresh, or navigation path
- **AND** it SHALL check relevant browser-console and failed-request signals

#### Scenario: E2E evidence passes
- **WHEN** the changed journey completes with observable expected results and no relevant browser or network failure signal
- **THEN** the agent SHALL report the route or entry point, environment or command, exercised states, and result as E2E evidence
- **AND** it SHALL identify the selected driver and retain inspectable command, DOM/response, route, console/network, or screenshot/pane evidence
- **AND** it SHALL distinguish this evidence from source inspection or screenshots alone

#### Scenario: E2E evidence fails
- **WHEN** a changed journey has an unexpected observable outcome or a relevant browser-console or failed-request signal
- **THEN** the agent SHALL report E2E as failed with inspectable evidence and remediation
- **AND** it SHALL treat Correctness and the overall Verify result as failed

#### Scenario: E2E needs UI-adjacent risk coverage
- **WHEN** an affected browser journey has relevant interaction or layout risk
- **THEN** the agent SHALL consider invalid or missing input, rapid repeated interaction, refresh/navigation, and resize/responsive behavior in addition to its normal success path

#### Scenario: E2E would alter real data or systems
- **WHEN** an affected end-to-end journey is destructive
- **THEN** the agent SHALL use a documented safe target, fixture, dry run, or disposable environment
- **AND** it SHALL report that path as blocked when no safe execution target exists

#### Scenario: E2E cannot run for an applicable journey
- **WHEN** an applicable journey cannot be exercised because a required runtime, credential, dependency, or browser capability is unavailable
- **THEN** the agent SHALL report the E2E check as blocked with the missing prerequisite
- **AND** it SHALL NOT mark correctness as passed or substitute unaided human manual inspection

#### Scenario: Applicable E2E fails
- **WHEN** an applicable journey reports an E2E failure or blocked outcome
- **THEN** the agent SHALL report Correctness and the overall Verify result as failed or blocked
- **AND** it SHALL require the outcome to be resolved before archive

#### Scenario: E2E is not applicable
- **WHEN** no changed requirement or scenario creates a runnable user or browser journey
- **THEN** the agent SHALL mark E2E as not applicable
- **AND** it SHALL give a concrete scope reason and identify the selected non-E2E verification evidence

## Attachments

None.
