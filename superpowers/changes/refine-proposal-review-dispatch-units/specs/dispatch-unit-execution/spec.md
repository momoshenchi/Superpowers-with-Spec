## ADDED Requirements

### Requirement: Logical dispatch-unit execution
For the default `spec-driven` change workflow, the system SHALL treat each top-level `# <number>. <scope>` heading in a change task list as a logical **dispatch unit**. A dispatch unit SHALL contain one or more detailed numbered checkbox tasks and SHALL be the unit used for subagent dispatch, handoff, and integration. A dispatch unit is an allocation boundary, not a live subagent identity.

#### Scenario: Dispatching a whole dispatch unit

- **WHEN** a coordinator uses subagent-driven development for a change whose `tasks.md` contains a dispatch-unit heading
- **THEN** the coordinator dispatches the full unit, its detailed tasks, and its execution context as one assignment
- **AND** it SHALL NOT dispatch or review each numbered checkbox in that unit as a separate agent task

### Requirement: Flexible dispatch-unit allocation
For the default `spec-driven` change workflow, the system SHALL record assignment intent in `execution-plan.md` dispatch coordination (including an assignee policy) rather than in task-list agent identity labels. A coordinator SHALL be able to assign one dispatch unit to one subagent, combine multiple dispatch units into one subagent assignment when their dependencies and ownership permit, or execute all dispatch units sequentially without subagents.

#### Scenario: Main agent executes all dispatch units

- **WHEN** the coordinator elects not to dispatch subagents
- **THEN** it SHALL execute the declared dispatch units in dependency order
- **AND** the task-list format and completion criteria SHALL remain valid

#### Scenario: One subagent receives multiple dispatch units

- **WHEN** two dispatch units are compatible to execute together
- **THEN** the coordinator MAY include both complete units in one subagent assignment
- **AND** each unit's detailed checkbox progress SHALL remain independently trackable

### Requirement: Pure-scope task headings
Default generated `tasks.md` guidance and templates SHALL use the heading form `# <number>. <scope>` for each dispatch unit. They SHALL NOT require `agent<logical-id>` in the heading. Detailed tasks SHALL remain checkbox items of the form `- [ ] <number>.<task-number> <description>`.

#### Scenario: Generate a pure-scope dispatch unit

- **WHEN** an agent creates `tasks.md` for the default spec-driven schema
- **THEN** the instructions and template SHALL show `# <number>. <scope>` headings containing detailed checkbox tasks
- **AND** the instructions SHALL state that the heading is a dispatch unit rather than a mandatory subagent identity

### Requirement: Coordination table owns assignee policy
Default generated `execution-plan.md` guidance and templates SHALL include a Dispatch Coordination table with columns for unit id, scope, ownership, dependencies, assignee policy, parallel eligibility, and handoff evidence. Allocation guidance SHALL live in that table, not in `tasks.md` headings.

#### Scenario: Generate dispatch coordination

- **WHEN** an agent creates `execution-plan.md` for a change with dispatch units
- **THEN** the template and instructions SHALL require an assignee-policy column in the coordination table
- **AND** execution section headings SHALL use `### <number>. <scope>` without nested code-wrapped `#` heading text

### Requirement: Single final integration review across dispatch units
For the default `spec-driven` change workflow, the system SHALL require workers to run the verification and self-review defined for their dispatch units, but SHALL defer formal review until all dispatch units are integrated. It SHALL then perform one cross-unit integration review and full validation of the completed change. Findings from that review SHALL be fixed and verified with targeted checks by the coordinator; a second complete review SHALL NOT be mandatory unless the final reviewer explicitly requests confirmation of a specified finding.

#### Scenario: Detailed task completion does not trigger formal review

- **WHEN** a worker completes a numbered task within a dispatch unit
- **THEN** the worker SHALL continue through the remaining tasks in that unit with self-review only
- **AND** the coordinator SHALL NOT start the formal integration review until all dispatch units are integrated

### Requirement: Legacy work-package headings remain acceptable
Review, apply, and subagent-driven guidance SHALL accept legacy top-level headings of the form `# <number>. agent<logical-id> — <scope>` as dispatch units. The system SHALL NOT require rewriting historical task lists to the pure-scope form before implementation.

#### Scenario: Apply a legacy agent-labeled task list

- **WHEN** a change still uses `# 1. agent1 — Auth API` style headings
- **THEN** coordinators and reviewers SHALL treat each such heading as one dispatch unit
- **AND** they SHALL NOT fail the change solely because the heading uses a legacy agent label
