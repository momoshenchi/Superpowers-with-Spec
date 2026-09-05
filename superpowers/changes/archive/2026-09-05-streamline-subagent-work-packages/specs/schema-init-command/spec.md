## ADDED Requirements

### Requirement: Schema init work-package templates
When `superpowers schema init` scaffolds the common `tasks` and `execution-plan` artifacts, it SHALL generate templates consistent with the default work-package convention.

#### Scenario: Scaffold selected work-package artifacts

- **WHEN** a user initializes a schema selecting both `tasks` and `execution-plan`
- **THEN** the generated task template SHALL show a numbered logical work-package block containing detailed checkbox tasks
- **AND** the generated execution-plan template SHALL show coordination and final-validation guidance rather than a mandatory 2–5 minute micro-step sequence

