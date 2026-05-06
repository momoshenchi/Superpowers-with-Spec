# schema-init-command Specification

## Purpose

Define `superpowers schema init` behavior for creating project-local schema skeletons in interactive and non-interactive modes.

## MODIFIED Requirements

### Requirement: Schema init supports interactive mode

The CLI SHALL prompt for schema configuration when run in an interactive terminal without explicit flags.

#### Scenario: Interactive prompts for description

- **WHEN** user runs `superpowers schema init my-workflow` in an interactive terminal
- **THEN** system prompts for schema description
- **AND** uses provided description in generated `schema.yaml`

#### Scenario: Interactive prompts for artifact selection

- **WHEN** user runs `superpowers schema init my-workflow` in an interactive terminal
- **THEN** system displays multi-select prompt with common artifacts (proposal, specs, design, tasks, execution-plan)
- **AND** each option includes a brief description
- **AND** uses selected artifacts in generated `schema.yaml`

#### Scenario: Non-interactive mode with flags

- **WHEN** user runs `superpowers schema init my-workflow --description "My workflow" --artifacts proposal,tasks,execution-plan`
- **THEN** system creates schema without prompting
- **AND** uses flag values for configuration

## ADDED Requirements

### Requirement: Schema init execution-plan scaffolding

The schema init command SHALL support `execution-plan` as a common artifact and scaffold it with deterministic dependencies and template content.

#### Scenario: Create schema with execution plan

- **WHEN** user runs `superpowers schema init my-workflow --description "My workflow" --artifacts proposal,specs,design,tasks,execution-plan`
- **THEN** the generated `schema.yaml` includes an artifact with id `execution-plan`
- **AND** the artifact generates `execution-plan.md`
- **AND** the artifact references template `execution-plan.md`
- **AND** the artifact requires `tasks`
- **AND** the command creates `templates/execution-plan.md` under the schema directory using platform-safe path joining

#### Scenario: Apply requires execution plan when selected

- **WHEN** schema init creates a schema that includes both `tasks` and `execution-plan`
- **THEN** the generated schema `apply.requires` is `["execution-plan"]`
- **AND** `apply.tracks` remains `tasks.md`

#### Scenario: Tasks remain apply requirement without execution plan

- **WHEN** schema init creates a schema that includes `tasks` but does not include `execution-plan`
- **THEN** the generated schema `apply.requires` is `["tasks"]`
- **AND** `apply.tracks` is `tasks.md`

#### Scenario: Reject unknown artifact id

- **WHEN** user runs `superpowers schema init my-workflow --artifacts proposal,execution_plan`
- **THEN** the command rejects `execution_plan`
- **AND** lists valid artifact ids including `execution-plan`
- **AND** exits with a non-zero code
