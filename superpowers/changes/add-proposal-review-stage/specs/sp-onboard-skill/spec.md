## MODIFIED Requirements

### Requirement: SP Onboard Skill

The system SHALL provide an `/sp:onboard` skill that guides users through their first complete Superpowers workflow cycle with narration and real codebase work.

#### Scenario: Skill invocation

- **WHEN** user invokes `/sp:onboard`
- **THEN** agent checks if Superpowers is initialized
- **AND** if not initialized, prompts user to run `superpowers init` first
- **AND** if initialized, proceeds with onboarding flow

#### Scenario: Welcome and expectations

- **WHEN** onboarding begins
- **THEN** agent displays welcome message explaining what will happen
- **AND** sets expectation of ~15 minute duration
- **AND** explains the workflow phases: explore → new → proposal artifacts → proposal review → apply → final integration review → archive
- **AND** distinguishes the proposal review of artifact completeness and implementability from the post-implementation integration review of cross-work-package behavior, the integrated diff, and full validation

#### Scenario: Onboarding reaches implementation readiness

- **WHEN** onboarding has completed the proposal artifacts required for the starter change
- **THEN** it SHALL explain that `/sp:propose` performs proposal review before `/sp:apply`
- **AND** it SHALL explain that the report is shown before affected planning artifacts are repaired and reviewed again
- **AND** it SHALL not describe proposal review as a repeated apply-time check
