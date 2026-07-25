## ADDED Requirements

### Requirement: Logical work-package execution
For the default `spec-driven` change workflow, the system SHALL treat each top-level agent block in a change task list as a logical work package. A work package SHALL contain one or more detailed numbered checkbox tasks and SHALL be the smallest unit used for subagent dispatch, handoff, and integration.

#### Scenario: Dispatching a whole work package

- **WHEN** a coordinator uses subagent-driven development for a change whose `tasks.md` contains an agent work-package block
- **THEN** the coordinator dispatches the full block, its detailed tasks, and its execution context as one assignment
- **AND** it SHALL NOT dispatch or review each numbered checkbox in that block as a separate agent task

### Requirement: Flexible work-package allocation
For the default `spec-driven` change workflow, the system SHALL treat agent labels in `tasks.md` as logical identifiers rather than required subagent identities. A coordinator SHALL be able to assign one work package to one subagent, combine multiple work packages into one subagent assignment when their dependencies permit, or execute all work packages sequentially without subagents.

#### Scenario: Main agent executes all work packages

- **WHEN** the coordinator elects not to dispatch subagents
- **THEN** it SHALL execute the declared work packages in dependency order
- **AND** the task-list format and completion criteria SHALL remain valid

#### Scenario: One subagent receives multiple work packages

- **WHEN** two work packages are compatible to execute together
- **THEN** the coordinator MAY include both complete blocks in one subagent assignment
- **AND** each block's detailed checkbox progress SHALL remain independently trackable

### Requirement: Single final integration review
For the default `spec-driven` change workflow, the system SHALL require workers to run the verification and self-review defined for their work packages, but SHALL defer formal review until all work packages are integrated. It SHALL then perform one cross-package integration review and full validation of the completed change. Findings from that review SHALL be fixed and verified with targeted checks by the coordinator; a second complete review SHALL NOT be mandatory unless the final reviewer explicitly requests confirmation of a specified finding.

#### Scenario: Detailed task completion does not trigger formal review

- **WHEN** a worker completes a numbered task within a work package
- **THEN** the worker SHALL continue through the remaining tasks in that package
- **AND** the coordinator SHALL NOT require a specification-compliance review and a code-quality review for that individual task

#### Scenario: Review after all work packages are integrated

- **WHEN** all declared work packages are complete and their changes are integrated
- **THEN** the coordinator SHALL conduct one review covering requirements, package interactions, code quality, test coverage, and full-change verification

### Requirement: Execution plan owns coordination details
For the default `spec-driven` change workflow, the system SHALL keep requirements in `proposal.md` and technical design in `design.md`. `execution-plan.md` SHALL define work-package ownership boundaries, dependencies, safe parallelism, integration order, final verification, and a Step 1–5 execution sequence for every detailed task in a work package. It SHALL NOT require a fixed number of subagents or treat those task-level steps as 2–5 minute delegation units.

#### Scenario: Planning optional parallel work

- **WHEN** an execution plan identifies work packages with disjoint file ownership and no unmet dependency
- **THEN** it SHALL mark them as eligible for parallel execution
- **AND** it SHALL identify overlapping ownership or dependencies that require sequential execution

### Requirement: Work-package syntax and legacy task lists
The default `spec-driven` task-list template and instructions SHALL define each work package with the exact heading form `# <work-package-number>. agent<logical-id> — <scope>`. Detailed tasks in that block SHALL use `- [ ] <work-package-number>.<task-number> <description>`. When subagent-driven development is applied to an existing task list that has no work-package heading, the coordinator SHALL treat all incomplete tasks as one sequential work package without rewriting the task list automatically.

#### Scenario: Generate exact work-package syntax

- **WHEN** an agent creates a default `tasks.md`
- **THEN** it SHALL use the defined top-level heading and detailed checkbox syntax
- **AND** it SHALL explain that `agent<logical-id>` is a logical label rather than a required live subagent identity

#### Scenario: Execute a legacy flat task list

- **WHEN** subagent-driven development receives an existing `tasks.md` with no work-package heading
- **THEN** the coordinator SHALL assign or execute all incomplete tasks as one sequential work package
- **AND** it SHALL preserve the existing task list unless the user asks to restructure it
