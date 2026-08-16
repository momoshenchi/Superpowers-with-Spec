# propose-interview-gate Specification

## ADDED Requirements

### Requirement: Propose SHALL protect the pre-confirmation boundary

Propose SHALL permit read-only investigation before confirmation, but SHALL NOT create the change directory or write any change artifact until the user explicitly confirms the final understanding summary.

#### Scenario: Read-only preflight precedes change creation

- **WHEN** a user invokes Propose with a change name or description
- **THEN** Propose MAY inspect files, existing specs, configuration, and other environment facts using read-only operations
- **AND** Propose SHALL defer `superpowers new change` and writes to the explicit artifact list `proposal.md`, `specs/<capability>/spec.md`, `design.md`, `tasks.md`, `execution-plan.md`, and `test-plan.md` until confirmation

#### Scenario: User stops before confirmation

- **WHEN** the user chooses to stop or does not confirm the final understanding summary
- **THEN** Propose SHALL not create a change directory or any of the explicit change artifacts
- **AND** Propose SHALL report that no change was created

#### Scenario: Cross-platform preflight paths

- **WHEN** Propose performs read-only discovery on macOS, Linux, or Windows
- **THEN** it SHALL resolve project, spec, and change paths using platform-neutral path handling
- **AND** the confirmation boundary SHALL behave the same regardless of path separator conventions

### Requirement: Propose SHALL adapt interview depth to unresolved decisions

Propose SHALL distinguish environment facts from user-owned decisions and SHALL ask questions only when a decision is unresolved, consequential, or required to make the proposal artifacts coherent.

#### Scenario: Clear low-risk request has no questions

- **WHEN** the request supplies a coherent goal, scope, capabilities, impact, and acceptance expectation
- **AND** read-only discovery finds no high-impact product or technical decision
- **THEN** Propose MAY ask zero interview questions
- **AND** it SHALL still present the final understanding summary and request confirmation

#### Scenario: Ambiguous product scope requires a question

- **WHEN** multiple plausible interpretations would change the requested outcome, in-scope behavior, non-goals, or acceptance criteria
- **THEN** Propose SHALL identify the ambiguity and ask the user to choose a direction before final confirmation
- **AND** it SHALL include a recommended direction grounded in the request and discovered facts

#### Scenario: High-impact technical choice requires a question

- **WHEN** implementation involves a consequential choice about architecture, data or migration, public API/CLI contracts, security, reliability/recovery, performance, compatibility, deployment, or an important dependency
- **AND** the choice is not determined by existing project constraints
- **THEN** Propose SHALL ask the user about that choice before final confirmation
- **AND** routine local implementation details SHALL remain agent-owned

### Requirement: Propose SHALL ask one decision question at a time

Each interview question SHALL state the known facts, the decision to resolve, why it matters, the recommended answer, and two or three alternatives when meaningful; Propose SHALL wait for the user's answer before asking the next question.

#### Scenario: Structured decision question

- **WHEN** Propose identifies a user-owned decision
- **THEN** the question SHALL offer a recommended answer and explain its trade-off
- **AND** it SHALL permit a free-form response in addition to any listed options
- **AND** it SHALL not batch unrelated decisions into the same question

#### Scenario: User delegates a decision

- **WHEN** the user says the agent should decide
- **THEN** Propose SHALL adopt the previously stated recommendation
- **AND** it SHALL state that choice in the running understanding summary
- **AND** it SHALL revisit dependent questions if the selected choice changes their premises

### Requirement: Propose SHALL close decisions before final confirmation

Propose SHALL treat the interview as complete only when the problem and urgency, scope and non-goals, capabilities, impact, acceptance expectations, and user-owned high-impact decisions are sufficiently concrete for artifact generation.

#### Scenario: Decision-closed summary

- **WHEN** all required user-owned decisions are resolved
- **THEN** Propose SHALL present one complete summary of the agreed understanding
- **AND** the summary SHALL distinguish confirmed decisions from agent-owned implementation assumptions
- **AND** Propose SHALL not create the change until the user confirms that summary

#### Scenario: User corrects the summary

- **WHEN** the user selects the change-needed outcome or identifies an inaccurate summary item
- **THEN** Propose SHALL update the affected decision
- **AND** it SHALL re-evaluate dependent decisions and continue the interview only where needed
- **AND** it SHALL present a new complete summary before requesting confirmation again

### Requirement: Propose SHALL use a three-state final confirmation gate

After the summary, Propose SHALL offer exactly these semantic outcomes: confirm and create the change, request changes, or stop without creating the change.

#### Scenario: User confirms and creates

- **WHEN** the user explicitly chooses to confirm and create the change
- **THEN** Propose SHALL create the change directory
- **AND** it SHALL continue the existing dependency-ordered artifact generation and proposal-review flow

#### Scenario: User requests changes

- **WHEN** the user chooses to request changes
- **THEN** Propose SHALL keep the pre-confirmation boundary intact
- **AND** it SHALL ask one corrective question at a time or accept the user's correction before rebuilding the summary

#### Scenario: User stops without creating

- **WHEN** the user chooses to stop without creating the change
- **THEN** Propose SHALL end without creating the change directory or any change artifact
- **AND** Propose SHALL report that no change was created

### Requirement: Propose SHALL preserve confirmed decisions in existing artifacts

After confirmation, Propose SHALL place confirmed product decisions in `proposal.md` and confirmed high-impact technical decisions in `design.md`; `**User selection:**` option comparison tables SHALL appear only for choices the user actually made; agent-owned implementation assumptions MAY include an A/B/C comparison whose final Choice is a strict, detailed analysis; design SHALL fill existing headings with implementable detail (mapping rules, fail-closed paths, a worked example) and MAY add extra subsections without adding required extra headings; it SHALL not create a separate interview transcript artifact.

#### Scenario: Product decisions are recorded in proposal

- **WHEN** Propose generates `proposal.md` after confirmation
- **THEN** the document SHALL reflect the confirmed why, scope, capabilities, impact, and acceptance-relevant decisions

#### Scenario: Technical decisions are recorded in design

- **WHEN** the interview resolved a high-impact technical choice
- **THEN** `design.md` SHALL record the choice, rationale, and accepted trade-offs
- **AND** a `**User selection:**` option comparison table SHALL appear only when the user actually chose among those options, including delegated recommendations after seeing alternatives
- **AND** agent-owned implementation assumptions MAY include an A/B/C comparison whose final Choice is a strict, detailed analysis, and SHALL NOT be presented as a user Choice
- **AND** the design SHALL include implementable detail under existing headings and SHALL NOT require extra top-level headings

#### Scenario: No separate interview artifact

- **WHEN** Propose completes artifact generation
- **THEN** the explicit artifact list SHALL remain the schema-defined proposal, specs, design, tasks, execution-plan, and test-plan files
- **AND** no `interview.md` or equivalent transcript file SHALL be required

## Attachments

<!-- No supporting attachments are required. -->
