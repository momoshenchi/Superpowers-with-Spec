## ADDED Requirements

### Requirement: Schema init SHALL support test-plan artifact scaffolding
`superpowers schema init` SHALL recognize `test-plan` as a common artifact that custom schemas can select.

#### Scenario: Interactive schema init lists test-plan
- **WHEN** user runs `superpowers schema init <name>` interactively
- **THEN** the artifact selection prompt SHALL include `test-plan`
- **AND** the option description SHALL identify it as a test planning and hardening artifact

#### Scenario: Non-interactive schema init selects test-plan
- **WHEN** user runs `superpowers schema init <name> --artifacts proposal,specs,design,tasks,execution-plan,test-plan`
- **THEN** the generated schema SHALL include `test-plan`
- **AND** `test-plan` SHALL generate `test-plan.md`
- **AND** `test-plan` SHALL require `execution-plan`
- **AND** the `templates/test-plan.md` file SHALL be created

#### Scenario: Apply requirement prefers test-plan when selected
- **WHEN** schema init generates a schema that includes `test-plan`
- **THEN** the generated `apply.requires` SHALL require `test-plan`
- **AND** the generated `apply.tracks` SHALL remain `tasks.md` when `tasks` is selected

#### Scenario: Schema init omits test-plan
- **WHEN** schema init generates a schema that does not include `test-plan`
- **THEN** existing apply requirement behavior SHALL remain unchanged
- **AND** schemas with `execution-plan` but no `test-plan` SHALL continue to require `execution-plan` for apply
