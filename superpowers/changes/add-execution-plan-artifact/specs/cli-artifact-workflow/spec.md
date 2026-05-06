# cli-artifact-workflow Specification

## Purpose

Define artifact workflow CLI behavior (`status`, `instructions`, `templates`, and setup flows) for scaffolded and active changes.

## ADDED Requirements

### Requirement: Default execution-plan artifact workflow

The default `spec-driven` workflow SHALL include an execution-plan artifact between task creation and apply.

#### Scenario: Status shows execution plan artifact

- **WHEN** user runs `superpowers status --change <id>` for a change using the default `spec-driven` schema
- **THEN** the status output includes `execution-plan` in dependency order after `tasks`
- **AND** the artifact output path is `execution-plan.md`
- **AND** the artifact status is computed from the explicit generated path inside the change directory

#### Scenario: JSON status includes execution plan apply requirement

- **WHEN** user runs `superpowers status --change <id> --json` for the default schema
- **THEN** the JSON `artifacts` array includes an entry with `id: "execution-plan"` and `outputPath: "execution-plan.md"`
- **AND** the JSON `applyRequires` array includes `execution-plan`

#### Scenario: Execution plan unlocks after tasks

- **WHEN** `tasks.md` exists for a default-schema change
- **AND** `execution-plan.md` does not exist
- **THEN** `superpowers status --change <id>` marks `execution-plan` as ready
- **AND** apply remains blocked until `execution-plan.md` exists

### Requirement: Apply uses execution plan as required context

The apply instruction generator SHALL require the execution-plan artifact for the default workflow and include it as context once present.

#### Scenario: Apply blocked by missing execution plan

- **WHEN** user runs `superpowers instructions apply --change <id>`
- **AND** the change uses the default `spec-driven` schema
- **AND** `tasks.md` exists but `execution-plan.md` does not exist
- **THEN** the command reports state `blocked`
- **AND** the missing artifact list includes `execution-plan`

#### Scenario: Apply includes execution plan context

- **WHEN** user runs `superpowers instructions apply --change <id>`
- **AND** all required apply artifacts exist
- **THEN** the apply context files include an `execution-plan` entry whose path resolves to the change directory's `execution-plan.md` using platform-safe path joining
- **AND** the apply progress still comes from `tasks.md`

## MODIFIED Requirements

### Requirement: Schema Apply Block

The system SHALL support an `apply` block in schema definitions that controls when and how implementation begins.

#### Scenario: Schema with apply block

- **WHEN** a schema defines an `apply` block
- **THEN** the system uses `apply.requires` to determine which artifacts must exist before apply
- **AND** uses `apply.tracks` to identify the file for progress tracking (or null if none)
- **AND** uses `apply.instruction` for guidance shown to the agent
- **AND** the default `spec-driven` schema requires `execution-plan` while tracking progress in `tasks.md`

#### Scenario: Schema without apply block

- **WHEN** a schema has no `apply` block
- **THEN** the system requires all artifacts to exist before apply is available
- **AND** uses default instruction: "All artifacts complete. Proceed with implementation."

### Requirement: Apply Instructions Command

The system SHALL generate schema-aware apply instructions via `superpowers instructions apply`.

#### Scenario: Generate apply instructions

- **WHEN** user runs `superpowers instructions apply --change <id>`
- **AND** all required artifacts (per schema's `apply.requires`) exist
- **THEN** the system outputs:
  - Context files from all existing artifacts
  - Schema-specific instruction text
  - Progress tracking file path (if `apply.tracks` is set)
- **AND** for the default `spec-driven` schema, context files include `execution-plan` when `execution-plan.md` exists
- **AND** progress is tracked from `tasks.md`

#### Scenario: Apply blocked by missing artifacts

- **WHEN** user runs `superpowers instructions apply --change <id>`
- **AND** required artifacts are missing
- **THEN** the system indicates apply is blocked
- **AND** lists which artifacts must be created first

#### Scenario: Apply instructions JSON output

- **WHEN** user runs `superpowers instructions apply --change <id> --json`
- **THEN** the system outputs JSON with:
  - `contextFiles`: array of paths to existing artifacts
  - `instruction`: the apply instruction text
  - `tracks`: path to progress file or null
  - `applyRequires`: list of required artifact IDs
- **AND** for the default `spec-driven` schema, `applyRequires` includes `execution-plan`
