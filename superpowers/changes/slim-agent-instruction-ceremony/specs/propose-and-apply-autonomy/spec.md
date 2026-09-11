## ADDED Requirements

### Requirement: Propose SHALL ask only unresolved high-impact decisions
Propose SHALL ask the user only about unresolved product decisions (goal, scope, non-goals, capabilities, impact, acceptance) or high-impact technical decisions (architecture, data or migration, public contracts, security, recovery, compatibility) that are not already determined by the request or existing constraints. Routine local implementation details SHALL remain agent-owned. When several such decisions are open, Propose MAY present them together.

#### Scenario: A clear create request has no interview
- **WHEN** the user asks to create a named change and the request already states goal, scope, capabilities, and acceptance
- **AND** read-only discovery finds no open high-impact technical fork
- **THEN** Propose SHALL NOT ask interview questions
- **AND** it MAY still show a short understanding summary before or while writing artifacts

#### Scenario: Open decisions may be batched
- **WHEN** Propose needs both a scope non-goal and a public-contract choice
- **THEN** it MAY ask those decisions in one message
- **AND** it SHALL NOT require waiting for the first answer before stating the second decision

### Requirement: Explicit create requests authorize artifact writes
When the user has already asked to create a proposal or change, that request SHALL authorize `superpowers new change` and schema artifact writes after the agent states its understanding. Propose SHALL NOT require a separate three-state confirmation widget, and SHALL NOT refuse to write solely because the user did not pick "Confirm and create" as a labeled option.

#### Scenario: User says create the proposal
- **WHEN** the user says to create the change proposal and no pause condition from agent-instruction-autonomy applies
- **THEN** Propose SHALL create the change directory and write the schema artifacts
- **AND** it SHALL NOT block on an additional confirm-and-create choice

#### Scenario: Missing product information still pauses
- **WHEN** two product scopes would change acceptance criteria and the request does not choose
- **THEN** Propose SHALL ask that question before writing artifacts
- **AND** it SHALL NOT invent a user Choice for the fork

### Requirement: Propose SHALL not serialize reversible discovery
Propose SHALL complete authorized read-only discovery before asking questions. It SHALL NOT use one-question-at-a-time waiting as a required interaction protocol.

#### Scenario: Preflight runs before questions
- **WHEN** Propose starts
- **THEN** it SHALL inspect relevant existing specs, project configuration, and related docs with read-only operations
- **AND** it SHALL NOT ask the user to choose facts that discovery already determined

### Requirement: Apply SHALL load current-unit context
Apply SHALL treat CLI `contextFiles` as the catalog of normative artifacts. For each task it SHALL read the current dispatch unit in `execution-plan.md` / `tasks.md` plus the spec and design slices that unit needs. It SHALL NOT require reading every listed context file in full before the first edit.

#### Scenario: First task reads its slice
- **WHEN** Apply starts the first pending dispatch unit
- **THEN** the agent SHALL read that unit's execution-plan section and the requirements it cites
- **AND** it SHALL NOT be required to read the entire `test-plan.md` matrix before that unit's first RED test

#### Scenario: Later stages still read their contracts
- **WHEN** implementation tasks are complete and Test Hardening begins
- **THEN** the agent SHALL read `test-plan.md` and the `full-qa-test` skill as Hardening requires
- **AND** Final Quality Gates SHALL still run after Hardening

### Requirement: Apply SHALL continue reversible in-scope work
During Apply, errors caused by the current authorized diff SHALL be repaired and rechecked without waiting. Apply SHALL pause when a task is ambiguous in a way that would change product behavior, when artifacts themselves are wrong, or when a pause condition from agent-instruction-autonomy applies.

#### Scenario: Compile error from this task is fixed
- **WHEN** a TypeScript compile fails on a file this task just edited
- **THEN** the agent SHALL fix it and re-run the affected check
- **AND** it SHALL NOT present options and wait for guidance before that fix

#### Scenario: Design contradiction still pauses
- **WHEN** implementation shows that a recorded design decision cannot be satisfied
- **THEN** the agent SHALL pause and propose an artifact update
- **AND** it SHALL NOT silently expand scope past the design

### Requirement: Quality gates SHALL fall back without spawn
Apply, proposal review, and standalone quality workflows SHALL prefer a fresh, distinct worker per gate or review round. When the host cannot spawn a worker, the coordinator SHALL run an equivalent review in the current context, label the review mode as same-context fallback, and continue. Missing spawn capability SHALL NOT by itself mark a gate `blocked`.

#### Scenario: Host can spawn gate workers
- **WHEN** `/sp:apply` reaches Final Quality Gates on a host that can launch subagents
- **THEN** it SHALL delegate code review, Simplify, Verify, and Design Verify to distinct workers in that order
- **AND** it SHALL integrate each report before starting the next gate

#### Scenario: Host cannot spawn a worker
- **WHEN** the host has no agent-spawning mechanism
- **THEN** the coordinator SHALL perform the same gate contract in the current context
- **AND** the Final Quality Gates record SHALL state review mode `same-context fallback`
- **AND** the gate SHALL NOT be `blocked` solely because spawn was unavailable

### Requirement: Change targeting SHALL auto-select when unambiguous
Verify, archive, and sync SHALL use an explicit change name when given. Otherwise they SHALL use the change already bound in the conversation, or the only active change. They SHALL prompt only when two or more active changes could match. Archive SHALL still warn and require confirmation before archiving when applicable Final Quality Gates are missing, failed, or blocked.

#### Scenario: Sole active change is used
- **WHEN** the user runs `/sp:verify`, `/sp:archive`, or `/sp:sync` with no name and exactly one eligible change exists
- **THEN** the agent SHALL use that change
- **AND** it SHALL NOT ask the user to pick from a one-item list
- **AND** for `/sp:sync`, eligible changes are active changes that have delta specs

#### Scenario: Ambiguous names still prompt
- **WHEN** two or more eligible changes exist and conversation does not name one
- **THEN** the agent SHALL ask the user to choose
- **AND** it SHALL NOT guess

#### Scenario: Incomplete gates still block quiet archive
- **WHEN** the user asks to archive a change whose applicable Final Quality Gates are failed
- **THEN** the agent SHALL warn and wait for explicit confirmation
- **AND** it SHALL NOT archive silently

### Requirement: Propose SHALL not require a TodoWrite loop
Propose SHALL write schema artifacts in dependency order after an authorized create request. It MAY use a host todo tool as optional bookkeeping. It SHALL NOT require the TodoWrite tool, or any other progress-tracker loop, as a precondition for writing artifacts.

#### Scenario: Authorized writes proceed without TodoWrite
- **WHEN** the user has asked to create the proposal and no product-decision pause applies
- **THEN** Propose SHALL write the required artifacts
- **AND** `propose.ts` SHALL NOT instruct the agent that it must Use the TodoWrite tool to track progress

#### Scenario: Optional tracking does not block writes
- **WHEN** the host has a todo tool and the agent wants a checklist
- **THEN** the agent MAY track artifacts that way
- **AND** missing TodoWrite SHALL NOT be a reason to stop or wait

### Requirement: Review SHALL not count 10-per-dimension batches
Proposal change-review SHALL judge whether `test-plan.md` names requirements, imported scenarios, risk gaps, and the six coverage dimensions. It SHALL NOT treat an unfinished 10→10→10 batch per requirement per dimension as a completeness BLOCKER or as a required "Must include" item before implementation. Test Hardening SHALL still own the 10→10→10 procedure (test-scope-selection).

#### Scenario: A draft test-plan without a 10-batch still reviews
- **WHEN** change-review inspects a spec-driven `test-plan.md` that registers requirements and imported scenarios but has not written ten cases per dimension
- **THEN** the reviewer SHALL NOT fail completeness solely for the missing 10→10→10 batches
- **AND** it MAY still flag missing risk dimensions or empty registers as warnings

#### Scenario: Hardening still owns 10→10→10
- **WHEN** Apply reaches Test Hardening
- **THEN** the agent SHALL still follow `full-qa-test` six-dimension and 10→10→10 rules (or the Apply fallback)
- **AND** dropping the review completeness check SHALL NOT remove that Hardening bind

## Attachments

None.
