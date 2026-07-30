## ADDED Requirements

### Requirement: Design template exposes Current system and Contracts
The default spec-driven `design.md` template SHALL include, after `## Context`, a required `## Current system` section (without an `(as-is)` title suffix) containing a `### Relationship to existing tech` subsection, and SHALL include a required `## Contracts` section. Authors MAY keep `## Current system` and `## Contracts` extremely short, including a single `N/A` line when appropriate.

#### Scenario: Template skeleton lists the new sections
- **WHEN** an agent loads the default design template for a new change
- **THEN** the template SHALL contain `## Current system`, `### Relationship to existing tech`, and `## Contracts` as first-class headings
- **AND** it SHALL NOT title the current-system section `## Current system (as-is)`

#### Scenario: Small change may use short Current system
- **WHEN** a change only adjusts a local helper with no architectural surface
- **THEN** `## Current system` MAY be one short paragraph or bullet list
- **AND** `## Contracts` MAY be exactly an explicit no-surface-change statement such as `N/A — no API/state/error surface change`

### Requirement: Design instruction defines Current system content
The design artifact instruction SHALL require `## Current system` to describe the relevant technical landscape for the change: entry points, sources of truth, module boundaries, and constraints that matter to implementation. It SHALL require `### Relationship to existing tech` to state how the change reuses, extends, replaces, retires, or leaves existing capabilities as a boundary, and to attach navigable **pointers** (module path, symbol, command, or section of a project file).

#### Scenario: Relationship row carries a pointer
- **WHEN** design states that existing validation logic is reused
- **THEN** the Relationship content SHALL identify a concrete pointer such as a file path and symbol name
- **AND** it SHALL NOT use bare phrases such as “reuse existing logic” without a pointer

#### Scenario: Forbidden bare reuse language
- **WHEN** design or proposal text claims reuse, extend, or keep-current behavior
- **THEN** authors SHALL supply at least one navigable pointer for that claim

### Requirement: Design instruction defines Contracts content
The design artifact instruction SHALL require `## Contracts` whenever the change adds or changes API/CLI surfaces, state transitions, or error/empty/deny semantics. Specs remain normative for observable behavior; Contracts SHALL be an implementation-facing sketch (tables or short lists) that anchors stable names and links back to requirements or scenarios when they exist. Authors SHALL NOT paste full IDL, OpenAPI, or schema dumps when a field-level sketch suffices.

#### Scenario: API field change records contract anchors
- **WHEN** a change adds a JSON field to a CLI or HTTP response
- **THEN** `## Contracts` SHALL name the surface, the field, and the expected meaning or error behavior at least enough to implement without guessing
- **AND** behavioral scenarios SHALL still live in specs when the schema includes specs

#### Scenario: No contract surface
- **WHEN** a change does not alter API, CLI, state machines, or error semantics
- **THEN** `## Contracts` SHALL explicitly record that no such surface changes

### Requirement: Scale-aware decision comparisons
The design artifact instruction and explore workflow guidance SHALL distinguish major versus minor decisions. For major architectural or cross-cutting decisions, design SHALL record a comparison of at least three options with dimensions, the chosen option, and trade-offs (usually after explore diverged on those options). For minor local decisions, a clear rationale is enough and three options SHALL NOT be required. Explore SHALL diverge with at least three approaches for major features before locking direction; design SHALL converge and record the choice rather than re-brainstorm.

#### Scenario: Major decision has three-option comparison
- **WHEN** design records a decision that changes a source of truth, crosses subsystems, or affects security, billing, idempotency, recovery, or irreversible migration
- **THEN** that decision section SHALL include at least three compared options and an explicit choice with trade-offs

#### Scenario: Minor decision skips triple options
- **WHEN** design records a local naming, file placement, or single-helper fix decision
- **THEN** a short rationale SHALL suffice
- **AND** review SHALL NOT treat missing three-option tables as a defect for that decision

#### Scenario: Explore hands off major options
- **WHEN** explore mode is used for a major feature before `/sp:propose`
- **THEN** the explore guidance SHALL direct the agent to present at least three approaches with trade-offs and let the user choose before artifact creation hard-locks the path
- **AND** design guidance SHALL treat design as the place that records the comparison and choice

### Requirement: Visual DESIGN.md is distinct from change design
Workflow design/explore/review guidance SHALL treat a repository visual `DESIGN.md` in the [google-labs-code/design.md](https://github.com/google-labs-code/design.md) sense (YAML tokens + prose identity) as optional visual identity source of truth, distinct from change-local `design.md`, engineering living architecture docs, and ADRs. Guidance SHALL describe discovery of common paths (repo-root `DESIGN.md` / `design.md`, `docs/DESIGN.md`, paths declared in project context). UI-facing changes SHALL read and cite an existing visual `DESIGN.md` when present; look-and-feel token or rule changes SHALL update that file in the same change via tasks. Authors SHALL NOT paste the full visual system into change `design.md`. Diagrams and mockups for a change SHALL use `attachments/` per existing attachment rules. This capability SHALL NOT require installing `@google/design.md` as a Superpowers runtime dependency.

#### Scenario: UI change cites existing visual DESIGN.md
- **WHEN** a change alters user-visible UI and the repository has a visual `DESIGN.md`
- **THEN** change design Current system or Relationship SHALL pointer-cite that file (and relevant sections when useful)
- **AND** implementation guidance SHALL treat tokens and Do's/Don'ts there as visual constraints

#### Scenario: Visual rules change updates DESIGN.md
- **WHEN** a change adopts new colors, typography, or component look rules that belong in the visual system
- **THEN** tasks SHALL include updating the visual `DESIGN.md`
- **AND** change design MAY describe only the delta and rationale, not a full copy of the visual system

#### Scenario: Non-UI change ignores missing DESIGN.md
- **WHEN** a change has no user-visible UI surface
- **THEN** absence of visual `DESIGN.md` SHALL NOT be treated as a design defect

#### Scenario: No visual DESIGN.md on a UI change
- **WHEN** a UI change runs in a repository without visual `DESIGN.md`
- **THEN** Current system SHALL note that no visual DESIGN.md was found and that existing components/CSS are the de facto guide
- **AND** authors MAY still use `attachments/` mockups

### Requirement: Schema fallback template stays aligned
Schema-init and other built-in fallback generators that emit a default design skeleton SHALL include the same Current system, Relationship, Contracts, and decision-comparison guidance shape as the package `schemas/spec-driven` design template, so newly initialized schemas do not regress to a decisions-only stub.

#### Scenario: schema init design fallback
- **WHEN** a user initializes or falls back to the built-in design template content
- **THEN** the fallback SHALL include `## Current system`, Relationship, and `## Contracts` headings consistent with the default schema template
