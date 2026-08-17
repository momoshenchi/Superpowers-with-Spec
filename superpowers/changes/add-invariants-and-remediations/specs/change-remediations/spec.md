## ADDED Requirements

### Requirement: Remediations file records accepted gate repairs
When a coordinator accepts a **code review** or **Verify** finding with severity P0 or P1 and prepares to change implementation, the active change SHALL create or append `remediations.md` under the change directory before those implementation edits. Design Verify findings, P2-only findings, and Simplify-only cleanups SHALL NOT by themselves require a remediations entry. If the change never accepts any code-review/Verify P0/P1 repairs, authors MAY omit `remediations.md` or record a single N/A line `N/A — no accepted P0/P1 repairs`.

#### Scenario: First accepted P0 creates remediations.md
- **WHEN** the coordinator accepts a code-review or Verify P0 and is about to edit code
- **AND** `remediations.md` does not exist
- **THEN** the coordinator SHALL create `remediations.md` and append a remediation entry for that finding before editing implementation

#### Scenario: Additional accepted P1 appends an entry
- **WHEN** `remediations.md` already exists
- **AND** a later accepted Verify P1 requires a code change
- **THEN** the coordinator SHALL append a new remediation entry rather than overwriting prior resolved entries

#### Scenario: Zero accepted repairs may omit file
- **WHEN** Final Quality Gates complete with no accepted code-review or Verify P0 or P1 repairs
- **THEN** the change MAY omit `remediations.md`
- **AND** Apply readiness SHALL NOT fail solely because the file is absent

#### Scenario: Design Verify or P2 alone does not require remediations
- **WHEN** the only accepted findings are Design Verify issues or code-review/Verify P2 items
- **THEN** authors MAY omit `remediations.md`
- **AND** SHALL NOT be required to create remediations entries for those findings alone

### Requirement: Each remediation compares multiple fixes and selects one
Every remediation entry for an accepted P0 or P1 SHALL document at least two meaningfully different candidate fixes, select one optimal fix, and provide a rationale explaining why the chosen fix wins and why the alternatives lose.

#### Scenario: Multi-option selection is mandatory
- **WHEN** recording an accepted P0 or P1 remediation
- **THEN** the entry SHALL list ≥2 candidate options
- **AND** SHALL name the chosen option
- **AND** SHALL include a rationale for the choice

#### Scenario: Clone options are insufficient
- **WHEN** two listed options differ only by wording and not by approach
- **THEN** reviewers or Apply self-check SHALL treat the comparison as incomplete

### Requirement: Remediation entries include root cause, fix, guard, and evidence
Each remediation entry SHALL include the finding summary (gate, round, severity), root cause, concrete fix description (paths and behavior), a regression guard, verification evidence, and status (`open` or `resolved`).

#### Scenario: P0 requires a guard before resolved
- **WHEN** a remediation entry has severity P0
- **THEN** status MUST NOT be `resolved` unless a Guard is recorded (failing-then-passing test and/or an invariant ID assertion)

#### Scenario: Evidence accompanies resolution
- **WHEN** a remediation is marked `resolved`
- **THEN** the entry SHALL include fresh command evidence summarizing the verifying run

### Requirement: Remediations are not applyRequires blockers
The default schema SHALL NOT place `remediations` in `applyRequires`, and propose-time apply readiness SHALL NOT require `remediations.md` to exist.

#### Scenario: Propose completes without remediations.md
- **WHEN** all `applyRequires` artifacts are done for a change that has not entered Final Quality Gates repairs
- **THEN** missing `remediations.md` SHALL NOT block proposal readiness or the start of Apply implementation tasks

### Requirement: Next gate rounds consume remediations
When `remediations.md` exists on disk under the change directory, subsequent Final Quality Gates workers for code review or Verify SHALL discover it by probing `superpowers/changes/<name>/remediations.md` (not solely via schema `contextFiles`) and SHALL read it as repair context. Final Quality Gates records MAY link rows to remediation IDs.

#### Scenario: Retry Verify reads remediations
- **WHEN** Verify is re-dispatched after coordinator repairs
- **AND** `remediations.md` exists at the change-directory path
- **THEN** the Verify worker guidance SHALL require probing that path and reading those entries before assessing residual risk

#### Scenario: Gate row may cite R-id
- **WHEN** a Final Quality Gates table row corresponds to an accepted repair
- **THEN** authors MAY cite a remediation ID such as `R1` on that row
- **AND** long-form option comparison SHALL live in `remediations.md`, not duplicated as the sole record in `test-plan.md`

#### Scenario: Missing from contextFiles still discovered
- **WHEN** CLI apply/verify context file lists omit `remediations.md` because it is outside the artifact graph
- **AND** the file exists under the change directory
- **THEN** workers SHALL still discover and read it via the change-directory path

### Requirement: Remediations template is available for copy
The repository SHALL provide a `remediations.md` template under the default schema templates directory that matches the required entry fields so Apply can instruct agents to copy it when creating the file.

#### Scenario: Template lists required fields
- **WHEN** an agent opens the packaged remediations template
- **THEN** the template SHALL include placeholders for Options, Choice, Rationale, Root cause, Fix, Guard, Evidence, and Status
