## ADDED Requirements

### Requirement: Hardening SHALL keep two suite layers without dedup
Test Hardening SHALL execute both the Git-aware non-`test-plan` suite stage and every applicable registered `test-plan.md` row. Overlapping tests SHALL still run in both layers. Git-aware output SHALL NOT close a `test-plan` row, and a `test-plan` run SHALL NOT skip Git-aware when Git-aware is available.

#### Scenario: Related tests overlap registered unit cases
- **WHEN** Git-aware selection includes files that also back registered `TC-*` rows
- **THEN** the agent SHALL still run the Git-aware command for the non-`test-plan` stage
- **AND** it SHALL still execute those registered `TC-*` rows as `test-plan` evidence
- **AND** it SHALL NOT treat one command log as satisfying both layers

### Requirement: Hardening SHALL expand full-qa-test before Git-aware
Test Hardening SHALL invoke `full-qa-test` (or the six-dimension / 10→10→10 fallback) and land new automated cases before running Git-aware selection, so related selection can include tests added in this stage.

#### Scenario: New unit cases exist before --changed
- **WHEN** Test Hardening adds executable `form=unit` cases during `full-qa-test` expansion
- **THEN** those tests SHALL be written to the repository before the Git-aware command runs
- **AND** the Git-aware command SHALL use the tree that contains those tests

### Requirement: Git-aware unavailable SHALL not run the complete suite
When Git-aware selection is unsupported, the Git baseline is unclear, or related selection is empty or ambiguous, the agent SHALL record `git-aware-unavailable-recorded` (or a more specific recorded limitation) for the non-`test-plan` suite stage and SHALL NOT run the complete canonical suite as a pass or as a default fallback. Registered `test-plan.md` rows and applicable Manual Coverage SHALL still run. Empty related selection is not a pass for the Git-aware layer.

#### Scenario: Runner has no Git-aware flags
- **WHEN** the canonical runner does not support Git-aware selection
- **THEN** the agent SHALL record the limitation
- **AND** it SHALL NOT run `npm test` / `pnpm test` / equivalent complete-suite commands to finish that stage
- **AND** it SHALL still execute registered `test-plan` rows

#### Scenario: Related selection empty on instruction-only diff
- **WHEN** Git-aware is supported and related selection is empty
- **AND** the owned diff has no executable production/runtime surface (instruction, docs, or pin tests only)
- **THEN** the agent SHALL record `git-aware-empty-expected` for the Git-aware layer
- **AND** it SHALL NOT run the complete suite
- **AND** registered `test-plan` rows SHALL still run

### Requirement: Complete suite remains exceptional
A complete canonical suite MAY run only when the user explicitly requests it, repository CI already requires that complete command as the canonical check, or related selection is empty, that emptiness is **not** expected, and no focused command can be constructed. That optional run SHALL be recorded with a distinct identifier and SHALL NOT become the default when Git-aware is merely unavailable.

#### Scenario: User asks for the complete suite
- **WHEN** the user explicitly asks to run the complete canonical suite during Hardening or Verify
- **THEN** the agent MAY run it
- **AND** it SHALL record `ran-complete-suite-optional`
- **AND** it SHALL NOT record that run as `ran-git-aware`

#### Scenario: CI already requires the complete command
- **WHEN** repository CI already requires that complete canonical command as the check for this stage
- **THEN** the agent MAY run it
- **AND** it SHALL record `ran-complete-suite-optional`
- **AND** it SHALL NOT record that run as `ran-git-aware`

#### Scenario: Empty selection is not expected and no focused command exists
- **WHEN** Git-aware is supported and related selection is empty
- **AND** emptiness is not expected because the owned diff has a runtime surface
- **AND** no focused command can be constructed
- **THEN** the agent MAY run the complete canonical suite
- **AND** it SHALL record `ran-complete-suite-optional`
- **AND** it SHALL NOT treat that run as `ran-git-aware` or as the default unavailable path

#### Scenario: Ambiguous Git-aware does not authorize complete suite
- **WHEN** Git-aware selection is ambiguous and the user did not ask for a complete suite
- **AND** CI does not already require the complete command
- **THEN** the agent SHALL record `git-aware-unavailable-recorded`
- **AND** it SHALL NOT treat a complete-suite command as required or as the pass for that stage
