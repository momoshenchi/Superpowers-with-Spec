## MODIFIED Requirements

### Requirement: Quick Reference Placement
Agent-facing project docs SHALL begin with a short index that names the required artifacts and links to schema templates. They SHALL NOT embed copy-ready full file templates in root `AGENTS.md` or `docs/workflows.md`. Superpowers SHALL NOT require regenerating `superpowers/AGENTS.md`; that path was removed by legacy cleanup.

#### Scenario: Loading templates at the top
- **WHEN** `docs/workflows.md` or root `AGENTS.md` is updated
- **THEN** any introductory section SHALL name `proposal.md`, `tasks.md`, spec deltas, and scenario formatting
- **AND** it SHALL link each name to the schema template rather than pasting the full template

### Requirement: Embedded Templates and Examples
Schema templates under `schemas/` SHALL remain the copy/paste source for artifact structure. Agent instruction docs SHALL point authors to those templates instead of duplicating them inline.

#### Scenario: Providing file templates
- **WHEN** authors need the required structure for proposals and deltas
- **THEN** instructions SHALL direct them to the schema templates (`## Why`, `## ADDED Requirements`, `#### Scenario:` and related headings)
- **AND** they SHALL NOT require `AGENTS.md` or `docs/workflows.md` to contain complete fenced Markdown templates for those files

### Requirement: Pre-validation Checklist
`docs/workflows.md` or `CLAUDE.md` MAY offer a short pre-validation checklist. When present, it SHALL highlight common formatting mistakes without embedding full templates.

#### Scenario: Highlighting common validation failures
- **WHEN** a reader reaches the validation guidance
- **THEN** the checklist SHALL remind them to verify requirement headers, scenario formatting, and delta sections
- **AND** it SHALL include reminders about at least `#### Scenario:` usage and descriptive requirement text before scenarios

### Requirement: Progressive Disclosure of Workflow Guidance
The documentation SHALL separate essentials from advanced topics so agents can load only what the current task needs.

#### Scenario: Organizing beginner and advanced sections
- **WHEN** reorganizing `docs/workflows.md` or equivalent agent docs
- **THEN** keep any introductory section limited to work-mode choice, artifact names, and links
- **AND** move advanced topics (multi-capability changes, archiving details, tooling deep dives) into clearly labeled later sections or separate docs
- **AND** provide links from the index to those advanced sections

## Attachments

None.
