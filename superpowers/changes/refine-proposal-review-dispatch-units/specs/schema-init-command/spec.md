## ADDED Requirements

### Requirement: Schema init dispatch-unit templates
When `superpowers schema init` scaffolds the common `tasks` and `execution-plan` artifacts, it SHALL generate templates consistent with the default dispatch-unit convention: pure-scope task headings, dispatch coordination with assignee policy, and clean execution-plan unit headings.

#### Scenario: Scaffold selected dispatch-unit artifacts

- **WHEN** a user initializes a schema selecting both `tasks` and `execution-plan`
- **THEN** the generated task template SHALL show a numbered pure-scope dispatch-unit block containing detailed checkbox tasks
- **AND** the generated execution-plan template SHALL show dispatch coordination, assignee policy, and final-validation guidance rather than agent-labeled or nested code-wrapped unit headings
