## ADDED Requirements

### Requirement: Work-package task-list convention
The default spec-driven task-list instructions SHALL generate logical top-level agent/work-package blocks with the heading form `# <work-package-number>. agent<logical-id> — <scope>`. Each block SHALL contain detailed `- [ ] <work-package-number>.<task-number> <description>` checkbox tasks, so the task tracker preserves fine-grained progress while coordinators have a stable dispatch boundary.

#### Scenario: Generate a work-package block

- **WHEN** an agent creates `tasks.md` for the default spec-driven schema
- **THEN** the instructions and template SHALL show the defined agent/work-package heading containing detailed checkbox tasks
- **AND** the instructions SHALL state that the heading is a logical work package rather than a mandatory subagent assignment

### Requirement: Execution-plan coordination guidance
The default spec-driven execution-plan instructions SHALL require coordination information for task-list work packages and SHALL expand every detailed task in those packages into a Step 1–5 execution sequence. `tasks.md` SHALL remain the source of checkbox progress tracking; the execution plan SHALL provide the task-level implementation detail without requiring each step to be a 2–5 minute delegation unit.

#### Scenario: Generate coordination-aware execution plan

- **WHEN** an agent creates `execution-plan.md` for a change with work-package task blocks
- **THEN** the instructions and template SHALL require ownership boundaries, dependencies, parallel eligibility, integration order, final validation, and Step 1–5 detail for every detailed task
- **AND** they SHALL describe a single final cross-package review after integration
