## ADDED Requirements

### Requirement: Dispatch-unit task-list convention
The default spec-driven task-list instructions SHALL generate logical top-level dispatch-unit blocks with the heading form `# <number>. <scope>`. Each block SHALL contain detailed `- [ ] <number>.<task-number> <description>` checkbox tasks, so the task tracker preserves fine-grained progress while coordinators have a stable dispatch boundary. Instructions SHALL NOT require `agent<logical-id>` in the heading.

#### Scenario: Generate a dispatch-unit block

- **WHEN** an agent creates `tasks.md` for the default spec-driven schema
- **THEN** the instructions and template SHALL show a numbered pure-scope dispatch-unit heading containing detailed checkbox tasks
- **AND** the instructions SHALL state that the heading is a dispatch unit rather than a mandatory subagent assignment

### Requirement: Execution-plan dispatch coordination guidance
The default spec-driven execution-plan instructions SHALL require coordination information for task-list dispatch units, including ownership, dependencies, assignee policy, parallel eligibility, integration order, and handoff evidence. They SHALL expand every detailed task in those units into a Step 1–5 execution sequence under clean `### <number>. <scope>` headings. `tasks.md` SHALL remain the source of checkbox progress tracking; the execution plan SHALL provide the task-level implementation detail without requiring each step to be a 2–5 minute delegation unit and without nested code-wrapped `# ...` headings.

#### Scenario: Generate coordination-aware execution plan

- **WHEN** an agent creates `execution-plan.md` for a change with dispatch-unit task blocks
- **THEN** the instructions and template SHALL require ownership boundaries, dependencies, assignee policy, parallel eligibility, integration order, final validation, and Step 1–5 detail for every detailed task
- **AND** they SHALL describe a single final cross-unit review after integration
- **AND** they SHALL NOT use nested headings of the form `### \`# <number>. ...\``
