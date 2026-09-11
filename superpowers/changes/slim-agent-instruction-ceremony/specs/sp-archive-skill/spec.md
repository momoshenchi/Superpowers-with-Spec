## MODIFIED Requirements

### Requirement: SP Archive Skill

The system SHALL provide an `/sp:archive` skill that archives completed changes in the experimental workflow.

#### Scenario: Archive a change with all artifacts complete

- **WHEN** agent executes `/sp:archive` with a change name
- **AND** all artifacts in the schema are complete
- **AND** all tasks are complete
- **THEN** the agent moves the change to `superpowers/changes/archive/YYYY-MM-DD-<name>/`
- **AND** displays success message with archived location

#### Scenario: Change selection prompt

- **WHEN** agent executes `/sp:archive` without specifying a change
- **THEN** the agent SHALL use an explicit conversation-bound change if present, otherwise the only active change
- **AND** it SHALL prompt only when two or more active changes could match
- **AND** when it prompts, it SHALL show only active changes (excludes archive/)
- **AND** incomplete Final Quality Gates SHALL still produce a warning and require confirmation before archive

## Attachments

None.
