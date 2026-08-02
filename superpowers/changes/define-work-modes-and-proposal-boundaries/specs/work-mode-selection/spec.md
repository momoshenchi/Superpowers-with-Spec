## ADDED Requirements

### Requirement: Superpowers SHALL Provide Two Proportional Work Modes
Superpowers SHALL distinguish exactly two implementation lifecycles: Direct Modification for low-risk, local, unambiguous work, and Proposal → Review → Apply for high-risk, cross-cutting, contract-changing, or workload-heavy work. A user-provided plan SHALL be treated as communication or execution guidance inside the selected lifecycle, not as a third Plan Mode.

#### Scenario: A small local edit is handled directly
- **WHEN** a request is unambiguous, localized, reversible, and does not change a public contract, data model, security boundary, or cross-module architecture
- **THEN** the agent MAY modify the code directly without creating a change Proposal
- **AND** it SHALL run relevant verification and apply `verification-before-completion` before claiming completion

#### Scenario: A user asks for a plan before a small edit
- **WHEN** the request remains within Direct Modification criteria after the user receives or approves a plan
- **THEN** the agent SHALL execute the plan using Direct Modification handling
- **AND** it SHALL NOT create a third workflow state or artificial change Proposal solely because a plan was requested

#### Scenario: A request requires a Proposal
- **WHEN** the user explicitly requests a Proposal or the request changes a public contract, data/security boundary, high-risk behavior, multi-agent surface, or exceeds the workload budget
- **THEN** the agent SHALL create a Proposal and use Proposal → Review → Apply
- **AND** it SHALL NOT continue expanding Direct Modification work past the discovered Proposal boundary

### Requirement: Direct Modification SHALL Promote When Scope Grows
During Direct Modification, the agent SHALL pause and promote the work to a Proposal when it discovers a new public contract, migration, authentication/authorization, billing, data-integrity or recovery concern, multiple large implementation surfaces, multiple dependency waves, or workload beyond the Proposal budget.

#### Scenario: A local fix reveals a schema change
- **WHEN** a direct bug fix requires changing a persisted schema or migration
- **THEN** the agent SHALL stop further direct edits
- **AND** it SHALL report that Proposal creation is required before continuing

#### Scenario: A direct request expands into multiple large surfaces
- **WHEN** implementation reveals multiple large capabilities or repeated broad context rereads beyond the workload budget
- **THEN** the agent SHALL preserve the discovered scope and create one or more bounded Proposals
- **AND** it SHALL not silently keep all work in the original direct session

### Requirement: Proposal Apply SHALL Retain Its Existing Quality Gates
Proposal → Review → Apply SHALL retain schema-aware Proposal review, Test Hardening, and the existing final gate order of host-native code review, Simplify, Verify, and Design Verify. Direct Modification SHALL use applicable verification without pretending that it completed an Apply-only artifact lifecycle.

#### Scenario: A Proposal reaches implementation
- **WHEN** all required Proposal artifacts pass their pre-implementation review
- **THEN** `/sp:apply` SHALL execute the existing Test Hardening and final-quality contracts
- **AND** a standalone `/sp:simplify` or `/sp:verify` invocation SHALL not be treated as a replacement for the Apply gate sequence

#### Scenario: A direct UI change is completed
- **WHEN** a Direct Modification affects a runnable UI journey or visual design rule
- **THEN** the agent SHALL execute applicable repository/browser E2E and visual-design checks, using `/sp:design-verify` when an active change exists or an equivalent direct-scope inspection when no Proposal exists
- **AND** it SHALL record evidence before claiming completion even though no Proposal artifacts exist

### Requirement: Work-Mode Selection SHALL Not Depend on Prompt Length
The agent SHALL choose work mode from risk, scope, workload, ambiguity, reversibility, and verification needs rather than the character length of the user's request or the number of files mentioned in the request.

#### Scenario: A short high-risk request is received
- **WHEN** a short request asks for an authentication, migration, or public API change
- **THEN** the agent SHALL select Proposal → Review → Apply
- **AND** it SHALL not infer Direct Modification from the request's brevity

#### Scenario: A long but local request is received
- **WHEN** a detailed request still describes one low-risk, reversible, local edit with a clear verification path
- **THEN** the agent MAY select Direct Modification
- **AND** it SHALL not create a Proposal solely because the prompt is long
