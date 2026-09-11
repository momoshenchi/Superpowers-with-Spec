## ADDED Requirements

### Requirement: Hardening SHALL keep the full-qa-test binding
After implementation tasks complete, Test Hardening SHALL invoke `full-qa-test` when that skill is present and SHALL follow its six-dimension and 10→10→10 rules, including the existing Apply fallback that writes those dimensions when the skill is absent. This change SHALL NOT remove that binding.

#### Scenario: Hardening invokes full-qa-test
- **WHEN** Apply finishes tracked implementation tasks on a spec-driven change that has `test-plan.md`
- **THEN** the agent SHALL apply `full-qa-test` rules to add or strengthen comprehensive tests
- **AND** it SHALL record results in `test-plan.md`

#### Scenario: Fallback still covers six dimensions
- **WHEN** `full-qa-test` is not available during Test Hardening
- **THEN** Apply SHALL still require the six coverage dimensions and the 10→10→10 batch rule per object per dimension
- **AND** it SHALL NOT skip comprehensive coverage because the skill file is missing

### Requirement: Hardening and Verify SHALL run registered test-plan rows
Test Hardening and Verify SHALL execute every applicable concrete row in the active `test-plan.md` outside Deferred Coverage, using the existing Manual Coverage split (`agent-browser` deferred to Verify). Unexecuted applicable rows SHALL keep the stage incomplete.

#### Scenario: Hardening runs non-agent-browser manual rows
- **WHEN** Test Hardening runs on a change with programmatic-browser Manual Coverage rows
- **THEN** the agent SHALL execute those rows and record evidence
- **AND** it SHALL leave `agent-browser` rows planned for Verify

#### Scenario: Verify runs deferred agent-browser rows
- **WHEN** Verify runs after Test Hardening deferred `agent-browser` rows
- **THEN** the agent SHALL execute those applicable rows
- **AND** source inspection alone SHALL NOT mark them passed

### Requirement: Non-test-plan suite stage SHALL use Git-aware tests
The suite stage that covers automated tests outside `test-plan.md` SHALL use Git-aware related tests when the runner supports that selection (for example Vitest `--changed`, Jest `--changedSince` / `--onlyChanged`, or pytest-picked). This stage exists so agents do not run a complete canonical suite to finish Hardening or Verify.

#### Scenario: Git-aware runner selects related tests
- **WHEN** Test Hardening or Verify reaches the non-`test-plan` suite stage
- **AND** the project's test runner supports Git-aware selection
- **THEN** the agent SHALL run that related-test command against the documented Git baseline
- **AND** it SHALL record the command, capability evidence, and baseline

#### Scenario: Git-aware unavailable does not require complete suite
- **WHEN** Git-aware selection is unsupported, empty, or ambiguous
- **THEN** the agent SHALL record that limitation on the non-`test-plan` suite stage
- **AND** it SHALL NOT treat a complete canonical suite run as required to pass that stage
- **AND** registered `test-plan.md` rows SHALL still run

### Requirement: Task-level checks SHALL stay focused
Detailed Apply tasks SHALL run the focused RED/GREEN tests for that task, then Git-aware related tests when supported. They SHALL NOT require the complete canonical suite and SHALL NOT treat `test-plan.md` Hardening as a per-task obligation.

#### Scenario: A dispatch-unit task uses focused tests
- **WHEN** a worker completes one detailed task
- **THEN** it SHALL run the tests named in that task's execution-plan Step 1 and Step 4
- **AND** it SHALL NOT run the full `test-plan.md` matrix before the next task

## Attachments

None.
