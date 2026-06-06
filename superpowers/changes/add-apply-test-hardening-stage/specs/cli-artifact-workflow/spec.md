## ADDED Requirements

### Requirement: Spec-driven workflow SHALL include test-plan after execution-plan
The default spec-driven schema SHALL create `test-plan.md` after `execution-plan.md` and before apply begins.

#### Scenario: Status shows test-plan ordering
- **WHEN** a change has proposal, specs, design, tasks, and execution-plan complete
- **AND** `test-plan.md` is missing
- **THEN** `superpowers status --change <id>` SHALL show `test-plan` as ready
- **AND** apply SHALL remain blocked until `test-plan.md` exists

#### Scenario: Apply requirements include test-plan
- **WHEN** user runs `superpowers status --change <id> --json`
- **THEN** `applyRequires` SHALL include `test-plan` for the default spec-driven schema
- **AND** the progress tracking file SHALL remain `tasks.md`

#### Scenario: Apply context includes test-plan
- **WHEN** user runs `superpowers instructions apply --change <id> --json`
- **AND** `test-plan.md` exists
- **THEN** `contextFiles` SHALL include `test-plan`
- **AND** `instruction` SHALL describe the post-task Test Hardening stage
- **AND** `instruction` SHALL identify complete concrete `Status` table rows as the Test Hardening completion condition

### Requirement: Test-plan template path SHALL resolve like other schema templates
The CLI SHALL expose the `test-plan` template through existing schema template discovery.

#### Scenario: Templates command lists test-plan
- **WHEN** user runs `superpowers templates --schema spec-driven`
- **THEN** output SHALL include `test-plan`
- **AND** the path SHALL resolve to the built-in `schemas/spec-driven/templates/test-plan.md`

#### Scenario: Instructions command generates test-plan guidance
- **WHEN** user runs `superpowers instructions test-plan --change <id>`
- **THEN** output SHALL include the `test-plan.md` output path
- **AND** output SHALL include the template content for the test coverage matrix and hardening record
- **AND** output SHALL identify `execution-plan` as a required dependency

### Requirement: Execution-plan instructions SHALL hand broad coverage planning to test-plan
The execution-plan artifact SHALL remain the detailed implementation guide while pointing broad post-diff coverage planning at `test-plan.md`.

#### Scenario: Agent creates execution-plan
- **WHEN** the agent creates `execution-plan.md`
- **THEN** the instructions SHALL preserve red-test-before-production-code guidance
- **AND** clarify that the broad coverage matrix and post-implementation hardening record belong in `test-plan.md`
