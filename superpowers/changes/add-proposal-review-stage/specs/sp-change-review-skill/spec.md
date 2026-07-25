## ADDED Requirements

### Requirement: Schema-aware proposal review workflow
The system SHALL provide a generated `superpowers-change-review` skill and a manual `/sp:review [change]` command that review a completed Superpowers change before implementation. The review SHALL identify the change schema through `superpowers status --change <name> --json`, run schema-aware structural validation, inspect only artifacts and referenced attachments applicable to that schema, and report completeness, clarity, coherence, and implementability findings as `BLOCKER`, `WARNING`, or `SUGGESTION`.

#### Scenario: User manually reviews a completed spec-driven change

- **WHEN** a user invokes `/sp:review <change>` for a spec-driven change whose implementation-required artifacts are complete
- **THEN** the skill SHALL read the completed proposal artifacts and referenced attachments
- **AND** it SHALL run `superpowers validate <change>` before its content review
- **AND** it SHALL return a review report with a readiness conclusion and actionable findings grouped by severity

#### Scenario: Review a change using another schema

- **WHEN** a user invokes `/sp:review <change>` for a schema that does not declare `specs`
- **THEN** the skill SHALL use the schema status and declared artifacts as the review scope
- **AND** it SHALL NOT report absent delta specs as a finding solely because the default schema normally has them

### Requirement: Automatic proposal review after artifact completion
The generated `/sp:propose` workflow SHALL automatically run the change-review workflow only after it has created every artifact required by the selected schema's `applyRequires` list. It SHALL not claim that the change is ready for `/sp:apply` before that review completes.

#### Scenario: Propose creates an implementation-ready change

- **WHEN** `/sp:propose` has created all implementation-required artifacts for a new change
- **THEN** it SHALL automatically invoke the proposal review before its final readiness summary
- **AND** it SHALL distinguish the proposal review from the implementation phase

### Requirement: Report-before-repair proposal loop
When the automatic proposal review finds issues, the workflow SHALL present the complete review report before modifying any proposal artifact in response to those findings. It SHALL repair every resolvable `BLOCKER` and `WARNING`, re-run the proposal review after repair, and announce implementation readiness only when no unresolved `BLOCKER` or `WARNING` remains. `SUGGESTION` findings are non-blocking and MAY remain in the report without an artifact change. If repair requires a user decision or an unavailable external dependency, it SHALL report the blocker and pause without guessing or claiming readiness.

#### Scenario: Automatic review finds a resolvable blocker

- **WHEN** automatic proposal review identifies a missing requirement-to-task mapping
- **THEN** `/sp:propose` SHALL first present the finding in its review report
- **AND** it SHALL then update the affected proposal artifacts to resolve the mapping
- **AND** it SHALL re-run review before announcing that implementation may begin

#### Scenario: Automatic review finds a resolvable warning

- **WHEN** automatic proposal review identifies a resolvable `WARNING`
- **THEN** `/sp:propose` SHALL show the warning in the review report before changing artifacts
- **AND** it SHALL repair the warning and re-run review before announcing readiness

#### Scenario: Automatic review retains a suggestion

- **WHEN** automatic proposal review identifies only `SUGGESTION` findings
- **THEN** `/sp:propose` MAY announce readiness after reporting those suggestions
- **AND** it SHALL not represent the suggestions as unresolved blockers or warnings

#### Scenario: Automatic review needs a user decision

- **WHEN** automatic proposal review finds an unresolved product, security, schema, or external-dependency decision that cannot be safely inferred
- **THEN** `/sp:propose` SHALL present the review report and the decision required
- **AND** it SHALL pause rather than modify artifacts speculatively or declare the change ready for `/sp:apply`

### Requirement: Ephemeral proposal review and separate integration review
Proposal review SHALL not create `review.md`, another review artifact, approval metadata, or a schema `applyRequires` entry. `/sp:apply` SHALL not automatically repeat proposal review before implementation. The system SHALL preserve a separate post-implementation integration review that evaluates cross-work-package behavior, the integrated diff, and full validation rather than proposal-artifact readiness.

#### Scenario: Apply starts after a previously reviewed proposal

- **WHEN** a user invokes `/sp:apply` for a change whose proposal artifacts were reviewed during `/sp:propose`
- **THEN** `/sp:apply` SHALL proceed using the current change artifacts without automatically invoking proposal review again
- **AND** the user MAY invoke `/sp:review <change>` manually before implementation

#### Scenario: Implementation work packages complete

- **WHEN** all implementation work packages have integrated
- **THEN** the implementation workflow SHALL perform its final integration review and full validation
- **AND** it SHALL NOT present that review as a replacement for, or a rerun of, the earlier proposal review

### Requirement: Work-package-aware review criteria
For a spec-driven change, proposal review SHALL treat top-level `# <number>. agent<logical-id> — <scope>` headings in `tasks.md` as logical work-package boundaries, not mandatory live subagent assignments. It SHALL check that `execution-plan.md` gives each detailed checkbox task a concrete Step 1–5 execution sequence and shall not require retired 2–5-minute or per-checkbox delegation/review rules.

#### Scenario: Review a work-package task plan

- **WHEN** proposal review examines a spec-driven `tasks.md` and `execution-plan.md`
- **THEN** it SHALL evaluate the coherence of work-package ownership, dependencies, and detailed task coverage
- **AND** it SHALL verify that every detailed task has Step 1–5 execution guidance
- **AND** it SHALL not report a work package as invalid merely because the logical agent label is executed inline or combined with another compatible package
