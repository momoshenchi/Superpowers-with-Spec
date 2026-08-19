## ADDED Requirements

### Requirement: Behavioral changes run a closed implication scan
When Propose generates or change-review inspects a change that alters behavior, the authoring agent SHALL consider this closed set of implication dimensions derived from the confirmed product and design direction, including details the user did not mention:

1. Actor, permission, and ownership
2. Empty, deny, error, and fail-closed behavior
3. Lifecycle: create, update, cancel, retry, and idempotency
4. Compatibility and migration
5. Data shape and contracts
6. Important product-direction forks implied by the confirmed goal

For each dimension the artifacts SHALL either record a derived rule that an implementer can follow, or a short N/A that states why the dimension does not apply. A local non-behavioral helper change MAY cover the whole scan with one short N/A. Authors SHALL NOT invent a required extra top-level heading for this scan.

#### Scenario: Behavioral change records every scan dimension
- **WHEN** Propose writes `design.md` for a change that adds or changes user-visible or system behavior
- **THEN** `design.md` SHALL contain, for each of the six scan dimensions, either a derived rule or a short N/A
- **AND** the derived rules SHALL follow from the confirmed product or design direction even when the user never named those details

#### Scenario: Local helper may use one short N/A
- **WHEN** the change only adjusts a local helper with no behavioral surface
- **THEN** `design.md` MAY cover the implication scan with one short N/A
- **AND** review SHALL NOT require six separate N/A lines

#### Scenario: No extra required heading
- **WHEN** `design.md` records the scan under existing headings, optionally as a `### Derived implications` subsection under `## Decisions`
- **THEN** that SHALL be acceptable
- **AND** review SHALL NOT report a defect for missing `## Derived implications` or any other invented top-level heading

### Requirement: Derived details live in existing design headings and stay agent-owned
Propose and design instruction SHALL place derived implication content in existing `design.md` headings (`## Decisions`, `## Contracts`, `## Invariants`, `## Risks / Trade-offs`, and `## Migration Plan` as they apply). Authors MAY add a `### Derived implications` subsection under `## Decisions`. Each derived item SHALL be labeled as agent-owned and derived from the confirmed direction. Authors SHALL NOT present a derived implication as a user Choice or `**User selection:**`.

#### Scenario: Derived rule is not a user Choice
- **WHEN** the agent derives fail-closed behavior the user never selected among options
- **THEN** that content SHALL be recorded as agent-owned derived implication
- **AND** it SHALL NOT use `**User selection:**` or otherwise claim the user chose it

#### Scenario: Optional subsection is allowed
- **WHEN** an author groups scan results under `### Derived implications` inside `## Decisions`
- **THEN** that SHALL be acceptable
- **AND** mapping rules, contracts, invariants, and migration notes MAY still live under those existing headings when they fit better

### Requirement: Observable derived rules trace into delta specs
When a derived implication changes observable user behavior or acceptance criteria, Propose SHALL record it in the change's delta spec as an ADDED or MODIFIED requirement with at least one WHEN/THEN scenario. Implementation-only derived rules that do not change observable behavior MAY remain in `design.md` without a spec row.

#### Scenario: User-visible empty state is specified
- **WHEN** the scan derives that an empty export returns an empty CSV with headers, and that is user-visible
- **THEN** the delta spec SHALL include a requirement or scenario for that empty export
- **AND** `design.md` SHALL still record the derived rule under existing headings

#### Scenario: Internal mapping stays design-only
- **WHEN** the scan derives a fail-closed mapping that does not change user-visible behavior or acceptance
- **THEN** `design.md` SHALL record the mapping
- **AND** Propose SHALL NOT be required to add a delta-spec requirement solely for that mapping

### Requirement: Propose derives unless the implication crosses a user-owned boundary
Propose SHALL write non-boundary derived implications as agent-owned assumptions without adding interview questions. Propose SHALL ask the user only when a derived implication would reverse a confirmed goal, scope, or acceptance expectation, or would cross a security, persisted-data, billing, or public-contract boundary that is not already determined.

#### Scenario: Non-boundary derivation is written without a new question
- **WHEN** the confirmed direction implies an empty-state rule and that rule does not reverse confirmed scope or cross a trust or public-contract boundary
- **THEN** Propose SHALL NOT add an interview question for that empty-state rule
- **AND** it SHALL record the rule as an agent-owned derived assumption

#### Scenario: Boundary derivation is interviewed
- **WHEN** a derived implication would grant a new permission, change persisted data integrity, billing, or a public API/CLI contract in a way not already confirmed
- **THEN** Propose SHALL ask the user about that implication before final confirmation
- **AND** it SHALL wait for the answer before treating the implication as confirmed

### Requirement: Pre-confirmation summary lists derived assumptions
The Propose final understanding summary SHALL include a compact list of agent-owned derived assumptions from the closed scan, separate from confirmed user decisions. The user MAY correct an assumption before confirm-and-create. Derived assumptions SHALL NOT be labeled as user Choices in that summary.

#### Scenario: Summary shows derived assumptions before create
- **WHEN** Propose presents the final understanding summary
- **THEN** the summary SHALL list the compact derived assumptions from the scan
- **AND** it SHALL distinguish them from confirmed product and technical decisions
- **AND** Propose SHALL still require explicit confirm-and-create before writing artifacts

#### Scenario: User corrects a derived assumption
- **WHEN** the user rejects or edits a derived assumption in the summary
- **THEN** Propose SHALL update that assumption
- **AND** it SHALL re-scan only dependent dimensions
- **AND** it SHALL present a new complete summary before requesting confirmation again

### Requirement: Change-review flags missing scan coverage as WARNING only
Proposal review (`/sp:review` and automatic review after Propose) SHALL treat a behavioral change whose `design.md` omits a scan dimension (neither a derived rule nor N/A) as a WARNING. Review SHALL NOT emit a BLOCKER solely because a derived-implication scan dimension is missing. Review SHALL NOT fail a change for lacking an invented top-level derived-implications heading. A derived item labeled as a user Choice SHALL remain a misattributed-user-Choice finding under existing choice-label rules.

#### Scenario: Missing scan dimension is WARNING
- **WHEN** proposal review inspects a behavioral change whose `design.md` has no rule and no N/A for lifecycle
- **THEN** review SHALL report a WARNING citing the missing implication scan dimension
- **AND** that WARNING SHALL NOT by itself make readiness `blocked`

#### Scenario: Derived gap never blocks readiness
- **WHEN** the only open review findings are derived-implication scan WARNINGs
- **THEN** review SHALL still allow readiness
- **AND** review SHALL NOT escalate those findings to BLOCKER solely because they are derived-implication gaps

#### Scenario: Missing extra heading is not a finding
- **WHEN** `design.md` has no `## Derived implications` heading but existing sections cover each scan dimension with a rule or N/A
- **THEN** review SHALL NOT report a defect for the missing heading

#### Scenario: Observable derived rule missing from specs is WARNING
- **WHEN** `design.md` records a user-visible derived rule and the delta spec has no matching requirement or scenario
- **THEN** review SHALL report a WARNING for missing spec trace
- **AND** that WARNING SHALL NOT by itself block readiness

### Requirement: Convention sources stay aligned without new artifacts
The closed-scan rules SHALL be encoded in Propose workflow text, the spec-driven design artifact instruction, the package design template comments, the schema-init design fallback, and change-review rubric text. Generated skill and command projections SHALL stay aligned with those sources. This capability SHALL NOT add a schema artifact, SHALL NOT add `applyRequires` membership, SHALL NOT require CLI `validate` to parse scan content, and SHALL NOT require an onboard long-form rewrite. Instruction text SHALL be platform-neutral: the same scan, labeling, and review rules apply on macOS, Linux, and Windows; any file-path examples in tests SHALL use `path.join` or equivalent rather than hardcoded separators.

#### Scenario: Propose instruction contains the scan
- **WHEN** an agent loads the generated Propose skill or `/sp:propose` command
- **THEN** the instruction text SHALL require the closed implication scan, agent-owned labeling, summary listing, derive-unless-boundary interview rule, and spec trace for observable derived rules

#### Scenario: Design template does not add a required heading
- **WHEN** an agent loads the default spec-driven `design.md` template or the schema-init design fallback
- **THEN** the skeleton SHALL keep the existing top-level heading set
- **AND** it SHALL include guidance for the closed scan under existing headings
- **AND** it MAY include an optional `### Derived implications` placeholder under Decisions
- **AND** it SHALL NOT make `## Derived implications` a required top-level heading

#### Scenario: Validate does not parse scan rows
- **WHEN** `superpowers validate` runs on a change whose design omits a scan dimension
- **THEN** that omission SHALL NOT by itself produce a validation ERROR
- **AND** content quality SHALL remain a change-review WARNING as specified above

#### Scenario: Cross-platform instruction parity
- **WHEN** Propose or change-review instructions are generated on macOS, Linux, or Windows
- **THEN** the scan dimensions, labeling rules, and WARNING-only review severity SHALL be the same
- **AND** tests that assert file paths for those instruction sources SHALL build expected paths with platform-neutral joins

## Attachments

None.
