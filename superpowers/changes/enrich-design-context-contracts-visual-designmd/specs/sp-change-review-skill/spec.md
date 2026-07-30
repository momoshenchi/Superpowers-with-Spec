## ADDED Requirements

### Requirement: Review enforces design Current system and Contracts
Proposal review (`/sp:review` and automatic propose review) SHALL treat missing `## Current system` or missing `## Contracts` in a present `design.md` as a finding. Empty or placeholder-only sections SHALL be at least `WARNING`. Review SHALL accept explicitly short Current system content and explicit Contracts `N/A` lines when they match change scope.

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

### Requirement: Review enforces major decision comparisons scale-aware
Proposal review SHALL require multi-option comparison records for major decisions in `design.md` and SHALL NOT require three-option tables for minor local decisions. If major vs minor is ambiguous, review MAY emit `WARNING` asking the author to classify or add comparison.

#### Scenario: Major decision without comparison
- **WHEN** a decision changes a source of truth or cross-service boundary and lists only the chosen approach
- **THEN** review SHALL report a finding requesting a ≥3 option comparison with choice and trade-offs

#### Scenario: Minor decision without comparison passes
- **WHEN** a decision only renames a local helper inside one file and states a one-line rationale
- **THEN** review SHALL NOT fail the change solely for lacking three alternatives

### Requirement: Review enforces visual DESIGN.md rules for UI changes
When a change affects user-visible UI and a repository visual `DESIGN.md` (google-labs design.md format or equivalently named project visual identity file) exists, proposal review SHALL expect citation from change design (Current system or Relationship pointer). When look-and-feel rules or tokens change, review SHALL expect a task (or completed edit plan) that updates that visual `DESIGN.md`. Review SHALL NOT fail non-UI changes for missing visual DESIGN.md, and SHALL NOT require pasting the full visual system into change design.

#### Scenario: UI change omits citation to existing DESIGN.md
- **WHEN** tasks or specs clearly alter UI and `DESIGN.md` exists at a discovered path but design never references it
- **THEN** review SHALL report at least a `WARNING`

#### Scenario: Non-UI change without DESIGN.md
- **WHEN** the change is CLI-only and no visual DESIGN.md exists
- **THEN** review SHALL NOT report a visual DESIGN.md defect
