## ADDED Requirements

### Requirement: Schema-aware proposal review workflow
The system SHALL provide a proposal-review workflow available as a generated skill and optional `/sp:review` command. The workflow SHALL identify the change schema from `superpowers status --change "<name>" --json`, validate with `superpowers validate`, review only artifacts required or already produced by that schema, and report completeness, clarity, coherence, and implementability findings as `BLOCKER`, `WARNING`, or `SUGGESTION`.

#### Scenario: User manually reviews a completed spec-driven change

- **WHEN** a user invokes `/sp:review <change>` for a complete `spec-driven` change
- **THEN** the workflow SHALL load schema-scoped artifacts and validation results
- **AND** it SHALL emit a structured report with severity-tagged findings
- **AND** it SHALL distinguish proposal readiness from post-implementation verification

### Requirement: Automatic proposal review after artifact completion
When `/sp:propose` finishes every artifact listed in `applyRequires`, it SHALL automatically invoke the proposal review before its final readiness summary and SHALL distinguish that review from the later implementation phase.

#### Scenario: Propose completes applyRequires

- **WHEN** `/sp:propose` marks every `applyRequires` artifact done
- **THEN** it SHALL run proposal review before announcing implementation readiness
- **AND** it SHALL not treat that review as part of `/sp:apply`

### Requirement: Report-before-repair proposal loop with blocker-gated re-review
When automatic proposal review finds issues, the workflow SHALL present the complete review report before modifying any proposal artifact in response to those findings.

It SHALL repair every resolvable `BLOCKER` and then re-run proposal review. It SHALL announce implementation readiness only when no unresolved `BLOCKER` remains.

`WARNING` findings are recommended repairs: the workflow MAY repair them after the report, but WARNING repairs SHALL NOT require a second full proposal review and SHALL NOT block readiness by themselves. Unrepaired WARNINGs MAY remain visible as residual notes.

`SUGGESTION` findings are non-blocking and MAY remain in the report without an artifact change.

If repair requires a user decision or an unavailable external dependency, the workflow SHALL report the blocker and pause without guessing or claiming readiness.

#### Scenario: Automatic review finds a resolvable blocker

- **WHEN** automatic proposal review identifies a missing requirement-to-task mapping as a `BLOCKER`
- **THEN** `/sp:propose` SHALL first present the finding in its review report
- **AND** it SHALL then update the affected proposal artifacts to resolve the mapping
- **AND** it SHALL re-run review before announcing that implementation may begin

#### Scenario: Automatic review finds only warnings and suggestions

- **WHEN** automatic proposal review identifies one or more `WARNING` and/or `SUGGESTION` findings and no `BLOCKER`
- **THEN** `/sp:propose` SHALL present the complete review report
- **AND** it MAY repair resolvable WARNINGs
- **AND** it SHALL NOT re-run full proposal review solely because WARNINGs or SUGGESTIONs were present or repaired
- **AND** it MAY announce readiness with residual WARNING/SUGGESTION notes still visible

#### Scenario: Automatic review retains a suggestion

- **WHEN** automatic proposal review identifies only `SUGGESTION` findings
- **THEN** `/sp:propose` MAY announce readiness after reporting those suggestions
- **AND** it SHALL not represent the suggestions as unresolved blockers or warnings

#### Scenario: Automatic review needs a user decision

- **WHEN** automatic proposal review finds an unresolved product, security, schema, or external-dependency decision that cannot be safely inferred
- **THEN** `/sp:propose` SHALL present the review report and the decision required
- **AND** it SHALL pause rather than modify artifacts speculatively or declare the change ready for `/sp:apply`

### Requirement: Ephemeral proposal review and separate integration review
Proposal review SHALL not create `review.md`, another review artifact, approval metadata, or a schema `applyRequires` entry. `/sp:apply` SHALL not automatically repeat proposal review before implementation. The system SHALL preserve a separate post-implementation integration review that evaluates cross-dispatch-unit behavior, the integrated diff, and full validation rather than proposal-artifact readiness.

#### Scenario: Apply starts after a previously reviewed proposal

- **WHEN** a user invokes `/sp:apply` for a change whose proposal artifacts were reviewed during `/sp:propose`
- **THEN** `/sp:apply` SHALL proceed using the current change artifacts without automatically invoking proposal review again
- **AND** the user MAY invoke `/sp:review <change>` manually before implementation

#### Scenario: Implementation dispatch units complete

- **WHEN** all implementation dispatch units have integrated
- **THEN** the implementation workflow SHALL perform its final integration review and full validation
- **AND** it SHALL NOT present that review as a replacement for, or a rerun of, the earlier proposal review

### Requirement: Dispatch-unit-aware review criteria
For a spec-driven change, proposal review SHALL treat top-level `# <number>. <scope>` headings in `tasks.md` as logical dispatch-unit boundaries, not mandatory live subagent assignments. It SHALL also accept legacy `# <number>. agent<logical-id> — <scope>` headings as equivalent dispatch-unit boundaries. It SHALL check that `execution-plan.md` gives each detailed checkbox task a concrete Step 1–5 execution sequence and shall not require retired 2–5-minute or per-checkbox delegation/review rules.

#### Scenario: Review a dispatch-unit task plan

- **WHEN** proposal review examines a spec-driven `tasks.md` and `execution-plan.md`
- **THEN** it SHALL evaluate the coherence of dispatch-unit ownership, dependencies, assignee policy, and detailed task coverage
- **AND** it SHALL verify that every detailed task has Step 1–5 execution guidance
- **AND** it SHALL not report a dispatch unit as invalid merely because it is executed inline or combined with another compatible unit
