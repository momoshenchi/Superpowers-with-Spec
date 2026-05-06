# execution-plan-artifact Specification

## Purpose

Define a dedicated execution-plan artifact for Superpowers changes that captures implementation-ready planning guidance separately from the trackable task checklist.

## ADDED Requirements

### Requirement: Execution plan artifact

The default Superpowers workflow SHALL include an `execution-plan` artifact that generates `execution-plan.md` inside the change directory.

#### Scenario: Artifact appears after tasks

- **WHEN** the default `spec-driven` schema is resolved
- **THEN** the artifact graph includes an artifact with id `execution-plan`
- **AND** the artifact generates `execution-plan.md`
- **AND** the artifact template is resolved from `schemas/spec-driven/templates/execution-plan.md`
- **AND** the artifact requires `tasks`

#### Scenario: Completion uses explicit generated path

- **WHEN** artifact completion is detected for a change
- **THEN** the system checks the explicit generated path `execution-plan.md` relative to the change directory using path-safe filesystem utilities
- **AND** the system does not infer execution-plan completion from unrelated Markdown files or filename pattern matching

### Requirement: Execution plan template content

The execution-plan artifact template SHALL guide agents to create a detailed, implementation-ready plan based on the existing `writing-plan` guidance.

#### Scenario: Template includes plan header

- **WHEN** an agent requests instructions for the `execution-plan` artifact
- **THEN** the returned template includes an implementation plan title section
- **AND** includes fields for goal, architecture, and tech stack
- **AND** makes clear that the plan is saved as `execution-plan.md` in the current Superpowers change directory

#### Scenario: Template maps files before tasks

- **WHEN** an agent creates `execution-plan.md`
- **THEN** the template instructs the agent to list files to create, modify, and test before task steps
- **AND** file paths are written as project-relative paths that are portable across macOS, Linux, and Windows

#### Scenario: Template requires bite-sized TDD steps

- **WHEN** an agent creates execution steps
- **THEN** the template requires each task to use checkbox syntax
- **AND** the template requires steps for writing a failing test, running it, implementing the minimum change, running verification, and committing where appropriate
- **AND** command steps include exact commands and expected outcomes

#### Scenario: Template requires test review before production code

- **WHEN** an agent creates `execution-plan.md`
- **THEN** the template requires all planned tests to be written before production-code implementation steps begin
- **AND** the template requires a comprehensive code review of the tests before production-code implementation steps begin
- **AND** the review focuses on test completeness, thoroughness, requirement coverage, edge cases, negative paths, regression sensitivity, and cross-platform path behavior where paths are involved
- **AND** production-code steps are blocked until the test review has either approved the tests or identified gaps that are fixed

#### Scenario: Template rejects placeholders

- **WHEN** an agent creates `execution-plan.md`
- **THEN** the artifact instructions prohibit placeholders such as `TBD`, `TODO`, `implement later`, and vague directives without concrete code or commands
- **AND** the artifact instructions require enough detail for an implementer with little project context to proceed

### Requirement: Execution plan dependencies

The execution-plan artifact SHALL use prior planning artifacts as context.

#### Scenario: Instructions include dependency files

- **WHEN** an agent requests instructions for `execution-plan`
- **THEN** the instructions list completed dependencies that provide context
- **AND** those dependencies include `tasks`
- **AND** apply context includes all existing artifacts from the schema, including `execution-plan` when present

### Requirement: Execution plan readiness for apply

The default workflow SHALL require `execution-plan` before implementation begins while preserving `tasks.md` as the progress tracking file.

#### Scenario: Apply blocked until execution plan exists

- **WHEN** a change using the default `spec-driven` schema has `proposal.md`, specs, `design.md`, and `tasks.md` but does not have `execution-plan.md`
- **THEN** `superpowers instructions apply --change <id>` reports apply as blocked
- **AND** the missing artifact list includes `execution-plan`

#### Scenario: Apply tracks tasks file

- **WHEN** a change has all required apply artifacts including `execution-plan.md`
- **THEN** apply instructions use `tasks.md` as the tracking file
- **AND** task progress is parsed from checkbox entries in `tasks.md`
- **AND** `execution-plan.md` is used as context rather than as the progress-tracking source
