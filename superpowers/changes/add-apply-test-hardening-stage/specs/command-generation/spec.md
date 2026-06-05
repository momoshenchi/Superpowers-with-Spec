## ADDED Requirements

### Requirement: Generated apply commands SHALL include Test Hardening guidance
Generated `/sp:apply` skill and command content SHALL describe the post-task Test Hardening stage.

#### Scenario: Apply template is generated
- **WHEN** Superpowers generates the apply workflow instructions for any supported tool
- **THEN** the generated content SHALL mention `test-plan.md` when it is present in the schema context
- **AND** describe that task completion transitions into Test Hardening
- **AND** state that apply completion requires both implementation tasks and Test Hardening to be complete

#### Scenario: Apply template distinguishes testing phases
- **WHEN** an agent reads the generated apply instructions
- **THEN** the instructions SHALL distinguish pre-implementation red tests in `execution-plan.md` from post-implementation Test Hardening in `test-plan.md`
- **AND** the instructions SHALL state that passing red tests is necessary but not sufficient for final apply completion
- **AND** the instructions SHALL identify `- [x] Test Hardening complete` as the only completion marker

#### Scenario: Apply template handles hardening failures
- **WHEN** an agent reads the generated apply instructions
- **THEN** the instructions SHALL state that failing hardening tests or unresolved product defects block apply completion
- **AND** the instructions SHALL tell agents to fix the defect or pause as blocked rather than checking the completion marker

### Requirement: Generated workflow content SHALL describe test-plan in artifact flows
Generated workflow instructions SHALL mention `test-plan.md` in schema-aware artifact flow descriptions without hardcoding behavior for custom schemas that omit it.

#### Scenario: Propose, continue, fast-forward, or onboarding content is generated
- **WHEN** the generated workflow content describes the default spec-driven artifact sequence
- **THEN** it SHALL include `test-plan.md` after `execution-plan.md`
- **AND** explain that `test-plan.md` captures the pre-implementation coverage draft and post-implementation hardening evidence

### Requirement: User-facing workflow docs SHALL describe Test Hardening
The documented Superpowers workflow SHALL describe apply completion as implementation tasks plus Test Hardening.

#### Scenario: Workflow documentation is updated
- **WHEN** a user reads command or workflow documentation for `/sp:apply`
- **THEN** the docs SHALL mention `test-plan.md`
- **AND** describe that `/sp:apply` enters Test Hardening after implementation tasks complete
- **AND** avoid saying that task completion alone means the change is ready to archive
