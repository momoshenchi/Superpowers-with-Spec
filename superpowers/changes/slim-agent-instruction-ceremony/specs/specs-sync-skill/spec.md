## MODIFIED Requirements

### Requirement: Specs Sync Skill
The system SHALL provide an `/sp:sync` skill that syncs delta specs from a change to the main specs.

#### Scenario: Sync delta specs to main specs
- **WHEN** agent executes `/sp:sync` with a change name
- **THEN** the agent reads delta specs from `superpowers/changes/<name>/specs/`
- **AND** reads corresponding main specs from `superpowers/specs/`
- **AND** reconciles main specs to match what the deltas describe

#### Scenario: Idempotent operation
- **WHEN** agent executes `/sp:sync` multiple times on the same change
- **THEN** the result is the same as running it once
- **AND** no duplicate requirements are created

#### Scenario: Change selection prompt
- **WHEN** agent executes `/sp:sync` without specifying a change
- **THEN** the agent SHALL use an explicit conversation-bound change if present, otherwise the only active change that has delta specs
- **AND** it SHALL prompt only when two or more changes with delta specs could match
- **AND** when it prompts, it SHALL show changes that have delta specs

#### Scenario: No eligible change has delta specs
- **WHEN** agent executes `/sp:sync` without specifying a change
- **AND** no active change has delta specs
- **THEN** the agent SHALL report that nothing is eligible to sync
- **AND** it SHALL NOT guess a change that has no delta specs

## Attachments

None.
