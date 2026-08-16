## ADDED Requirements

### Requirement: Review enforces design Current system and Contracts
Proposal review (`/sp:review` and automatic propose review) SHALL treat missing `## Current system` or missing `## Contracts` in a present `design.md` as a finding. Empty, placeholder-only, or file-path-dump Current system sections SHALL be at least `WARNING`. Review SHALL accept explicitly short Current system content when the prose still explains behavior, and explicit Contracts `N/A` lines when they match change scope.

#### Scenario: Design lacks Current system heading
- **WHEN** proposal review inspects a change that includes `design.md` without `## Current system`
- **THEN** it SHALL report a `WARNING` or `BLOCKER` finding citing the missing section
- **AND** it SHALL describe the expected section purpose (technical landscape slice for this change)

#### Scenario: Contracts N/A accepted for non-surface change
- **WHEN** `design.md` contains `## Contracts` with an explicit no-surface-change statement and specs/tasks show no API or state change
- **THEN** review SHALL NOT require API tables

### Requirement: Review enforces reuse pointers
When proposal artifacts claim reuse, extend, keep-current, or equivalent dependence on existing behavior, proposal review SHALL require a navigable pointer (path, symbol, command, or documented section). Bare reuse language without a pointer SHALL be at least `WARNING`, and `BLOCKER` when the claim crosses module or trust boundaries.

#### Scenario: Bare reuse language flagged
- **WHEN** design Decisions say “reuse existing auth checks” with no file or symbol pointer
- **THEN** review SHALL emit a finding that demands a concrete pointer

### Requirement: Review enforces user-real choice labels and strict agent-owned analysis
Proposal review SHALL require `**User selection:**` comparison tables in `design.md` only when the user actually chose among those options. An A/B/C table presented as a user Choice when the user did not choose SHALL be at least `WARNING` as a misattributed user Choice. Agent-owned decisions MAY include an A/B/C comparison; a Choice without strict, detailed analysis SHALL be at least `WARNING` as shallow rationale. Missing three-option tables SHALL NOT be findings.

#### Scenario: Misattributed user Choice flagged
- **WHEN** a decision labels an A/B/C comparison as a user Choice but the user did not choose among those options
- **THEN** review SHALL report a finding for misattributed user Choice

#### Scenario: Shallow agent-owned Choice flagged
- **WHEN** an agent-owned decision lists A/B/C but the Choice is only a one-line ritual without why winners and losers
- **THEN** review SHALL report a finding for shallow rationale

#### Scenario: Agent-owned decision with strict analysis passes
- **WHEN** an agent-owned decision includes an A/B/C comparison and a strict, detailed analysis of the chosen option
- **THEN** review SHALL NOT fail the change solely for the presence of that comparison
- **AND** review SHALL NOT fail the change solely for lacking three alternatives

### Requirement: Review judges implementable detail without requiring extra headings
Proposal review SHALL expect implementable detail (mapping rules, fail-closed paths, a worked example) under existing design headings. A behavioral change whose design is principle-only SHALL be at least `WARNING`. Extra subsections under existing headings SHALL be welcome. Missing invented top-level headings such as Target flow SHALL NOT be findings.

#### Scenario: Principle-only design flagged
- **WHEN** a behavioral change's design states only a principle with no mapping rules or worked example
- **THEN** review SHALL report a finding for missing implementable detail

#### Scenario: Missing invented heading is not a finding
- **WHEN** design has no `## Target flow` heading but existing sections include mapping rules and a worked example
- **THEN** review SHALL NOT fail the change for lacking that heading

### Requirement: Review enforces visual DESIGN.md rules for UI changes
When a change affects user-visible UI and a repository visual `DESIGN.md` (google-labs design.md format or equivalently named project visual identity file) exists, proposal review SHALL expect citation from change design (Current system or Relationship pointer). When look-and-feel rules or tokens change, review SHALL expect a task (or completed edit plan) that updates that visual `DESIGN.md`. Review SHALL NOT fail non-UI changes for missing visual DESIGN.md, and SHALL NOT require pasting the full visual system into change design.

#### Scenario: UI change omits citation to existing DESIGN.md
- **WHEN** tasks or specs clearly alter UI and `DESIGN.md` exists at a discovered path but design never references it
- **THEN** review SHALL report at least a `WARNING`

#### Scenario: Non-UI change without DESIGN.md
- **WHEN** the change is CLI-only and no visual DESIGN.md exists
- **THEN** review SHALL NOT report a visual DESIGN.md defect
