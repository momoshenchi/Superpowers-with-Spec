## ADDED Requirements

### Requirement: Workers SHALL receive current-unit context
For the default `spec-driven` change workflow, a coordinator SHALL give each dispatch unit the `tasks.md` block, the matching `execution-plan.md` section, and the spec/design slices that unit cites. It SHALL NOT require the coordinator or a worker to read proposal, all specs, design, tasks, and execution-plan in full before the first unit.

#### Scenario: First unit starts with a slice
- **WHEN** a coordinator dispatches or executes the first incomplete dispatch unit
- **THEN** it SHALL load that unit's ownership, dependencies, and cited requirements
- **AND** it SHALL NOT treat an unread later unit's files as required context for that start

#### Scenario: Integration still sees the combined diff
- **WHEN** all dispatch units are complete
- **THEN** the coordinator SHALL review the integrated diff against the change artifacts
- **AND** Apply Final Quality Gates SHALL still run once after that integration

## MODIFIED Requirements

### Requirement: Flexible work-package allocation
For the default `spec-driven` change workflow, the system SHALL treat agent labels in `tasks.md` as logical identifiers rather than required subagent identities. A coordinator SHALL be able to assign one work package to one subagent, combine multiple work packages into one subagent assignment when their dependencies permit, or execute all work packages sequentially without subagents. When the host cannot spawn subagents, sequential inline execution SHALL remain a valid completion path.

#### Scenario: Main agent executes all work packages
- **WHEN** the coordinator elects not to dispatch subagents
- **THEN** it SHALL execute the declared work packages in dependency order
- **AND** the task-list format and completion criteria SHALL remain valid

#### Scenario: One subagent receives multiple work packages
- **WHEN** two work packages are compatible to execute together
- **THEN** the coordinator MAY include both complete blocks in one subagent assignment
- **AND** each block's detailed checkbox progress SHALL remain independently trackable

#### Scenario: Host cannot spawn subagents
- **WHEN** the host has no agent-spawning mechanism
- **THEN** the coordinator SHALL execute remaining work packages inline
- **AND** completion criteria SHALL NOT require a blocked status solely because no subagent ran

## Attachments

None.
