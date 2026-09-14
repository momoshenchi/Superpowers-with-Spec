## ADDED Requirements

### Requirement: Workflow roots SHALL be stage indexes
Generated Apply, Propose, and Verify `SKILL.md` and slash-command files SHALL state when to use the workflow, how to select the change, what to read for the current stage, and when to pause. They SHALL NOT include Test Hardening matrices, Final Quality Gates recipes, Manual Coverage procedures, remediations templates, or runtime-Before capture procedures in the root file.

#### Scenario: Apply root does not contain Final Quality Gates
- **WHEN** the agent opens `/sp:apply` or `superpowers-apply-change` to start implementation
- **THEN** the root file SHALL identify the current-unit read rule and the pause conditions
- **AND** it SHALL name the referenced file to read when Test Hardening or Final Quality Gates start
- **AND** the root file SHALL NOT contain the Final Quality Gates outcome table recipe or remediations field list

#### Scenario: Propose root defers artifact-loop detail
- **WHEN** the agent opens `/sp:propose` after the user asked to create a change
- **THEN** the root file SHALL keep the high-impact decision rule and write authorization
- **AND** dependency-ordered artifact generation steps SHALL live in a referenced file read after authorization
- **AND** the root file SHALL NOT include the full per-artifact instruction loop

#### Scenario: Verify root does not dump every artifact
- **WHEN** the agent opens `/sp:verify` for a selected change
- **THEN** it SHALL treat `contextFiles` as a catalog
- **AND** it SHALL read the artifacts needed for the current Verify dimensions
- **AND** it SHALL NOT be required to read every `contextFiles` path in full before the first check

### Requirement: Stage contracts SHALL live in referenced files
Stage bodies SHALL be generated under each workflow skill directory as these `relativePath` values (POSIX relative to that skill directory; Node writers use `path.join`):

- Apply: `reference/test-hardening.md`, `reference/runtime-before.md`, `reference/final-quality-gates.md`, `reference/dispatch-units.md`
- Propose: `reference/artifact-loop.md`
- Verify: `reference/verify-report.md`

Slash-command roots SHALL name those same skill-relative paths (for example `` `reference/test-hardening.md` ``). They SHALL NOT paste `path.join(...)` into the markdown body. Init and update SHALL emit the companions; a missing companion SHALL NOT authorize skipping that stage.

#### Scenario: Hardening loads its contract when the stage starts
- **WHEN** Apply implementation tasks are complete and Test Hardening begins
- **THEN** the agent SHALL read the Test Hardening referenced file and `full-qa-test` as Hardening still requires
- **AND** it SHALL NOT have been required to read that Hardening file before the first implementation edit

#### Scenario: Missing companion does not skip the gate
- **WHEN** Final Quality Gates start and the named reference file is absent
- **THEN** Apply SHALL NOT mark the gate passed or skip it
- **AND** it SHALL report the missing file as `blocked` or regenerate companions via the documented init/update path

#### Scenario: Apply dispatch lives in a named companion
- **WHEN** Apply starts a spec-driven dispatch unit
- **THEN** the root SHALL name `reference/dispatch-units.md`
- **AND** the dispatch-unit assignment loop SHALL NOT be inlined in the Apply root file

### Requirement: Long technique skills SHALL keep procedure off the root
`skills/systematic-debugging/SKILL.md` SHALL state when four-phase debugging applies and when it is skipped. Four-phase procedure and Debug Checkpoint ledgers SHALL live in referenced files in that skill directory. `skills/test-driven-development/SKILL.md` SHALL state when TDD applies and the red-green rule; worked examples and rationalization tables SHALL live in referenced files. `using-superpowers` SHALL keep Direct vs Proposal in the root; its eight-step long-running decomposition SHALL live in `reference/schema-and-workload.md` (or an equivalent named reference) rather than the root file.

#### Scenario: Localized failure does not load debug procedure
- **WHEN** a unit test failure already names the edited function and expected value
- **THEN** the systematic-debugging root SHALL allow skipping four-phase work
- **AND** the agent SHALL NOT be required to read the four-phase reference to apply that skip

#### Scenario: TDD root stays the rule not the lecture
- **WHEN** the agent reads `test-driven-development` for a behavior change
- **THEN** the root file SHALL include when to use TDD and the red-green sequence
- **AND** it SHALL NOT include the multi-section rationalization table or “start over” checklist in the root

#### Scenario: using-superpowers root omits eight-step decompose
- **WHEN** the agent reads `using-superpowers` to choose Direct Modification or Proposal → Review → Apply
- **THEN** the root file SHALL NOT contain the numbered step `Inventory logical capabilities`
- **AND** that decomposition SHALL live in `reference/schema-and-workload.md` or another file the root names

## Attachments

None.
