# CLI Init Specification

## Purpose

The `superpowers init` command SHALL create a complete Superpowers directory structure in any project, enabling immediate adoption of Superpowers conventions with support for multiple AI coding assistants.

## ADDED Requirements

### Requirement: Generated workflow instructions include execution plan artifact

The command SHALL generate Superpowers skills and slash commands whose workflow instructions describe the default execution-plan artifact.

#### Scenario: Propose and fast-forward mention execution plan

- **WHEN** `superpowers init` generates workflow skills or slash commands for a selected AI tool
- **THEN** the generated `/sp:propose` and `/sp:ff` instructions list `execution-plan.md` as an artifact created before implementation
- **AND** those instructions continue to rely on `superpowers status --json` and `applyRequires` rather than hardcoded artifact completion assumptions

#### Scenario: Continue flow can create execution plan

- **WHEN** `superpowers init` generates `/sp:continue` instructions for a selected AI tool
- **THEN** those instructions treat `execution-plan` like any other schema artifact discovered from status output
- **AND** the instructions tell the agent to read completed dependency artifacts before creating `execution-plan.md`

#### Scenario: Apply flow mentions execution plan context

- **WHEN** `superpowers init` generates `/sp:apply` instructions for a selected AI tool
- **THEN** those instructions tell the agent to use `superpowers instructions apply --change <name>`
- **AND** they do not assume `tasks.md` is the only planning context file
- **AND** they preserve `tasks.md` checkbox updates as the progress-tracking mechanism

#### Scenario: Onboarding describes artifact sequence

- **WHEN** `superpowers init` generates onboarding instructions
- **THEN** the onboarding text describes the default sequence as proposal, specs, design, tasks, and execution plan
- **AND** the text distinguishes `tasks.md` as the progress checklist from `execution-plan.md` as the detailed implementation plan
