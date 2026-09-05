# test-id-status-vocabulary Specification

## Purpose
TBD - created by archiving change unify-test-ids-and-statuses. Update Purpose after archive.
## Requirements
### Requirement: Executable test rows SHALL use one status vocabulary
Every concrete Status cell in `test-plan.md` outside Final Quality Gates—including the Requirement And Scenario Coverage Matrix, Six-Dimension Case Matrix rows, Dimension Coverage Summary, and Manual Coverage—SHALL use only `planned`, `passed`, `failed`, `blocked`, or `not applicable` as the normative writer vocabulary. Dimension Coverage Summary SHALL use `planned`, `passed`, or `not applicable` as the recommended dimension-level values (a dimension is `passed` when required child cases are complete).

#### Scenario: Writer guidance omits covered and failing
- **WHEN** an agent authors or updates a new `test-plan.md` from the schema template or apply/Test Hardening instructions
- **THEN** normative status examples SHALL list `planned`, `passed`, `failed`, `blocked`, and `not applicable`
- **AND** SHALL NOT present `covered` or `failing` as preferred writer values

#### Scenario: Dimension summary uses execution vocabulary
- **WHEN** Dimension Coverage Summary Status is filled for an applicable dimension whose required cases are complete
- **THEN** the Status SHALL be `passed` (or `not applicable` with a concrete scope reason when the dimension does not apply)
- **AND** unfinished dimension coverage SHALL remain `planned`

### Requirement: Test and manual rows SHALL use stable IDs
Six-dimension cases SHALL keep IDs `TC-R<object>-D<dimension>-<seq>`. Manual Coverage rows SHALL carry an `ID` column using `MC-R<object>-<seq>`, or `MC-<seq>` when no requirement object applies.

#### Scenario: Manual Coverage row is recorded
- **WHEN** a concrete Manual Coverage check is added to `test-plan.md`
- **THEN** the row SHALL include an ID of the form `MC-R<object>-<seq>` or `MC-<seq>`
- **AND** Check / Scenario, Execution Method and Environment, Status, and Evidence remain required

### Requirement: Remediations entries SHALL use RM identifiers
The remediations template and new remediations entries SHALL use headings `## RM-<n>` so remediation IDs do not collide with Test Scope Register requirement codes `R<n>`.

#### Scenario: New remediations template entry
- **WHEN** a coordinator creates `remediations.md` from the schema template
- **THEN** the sample entry heading SHALL be `## RM-1` (or equivalent `RM-<n>`)
- **AND** SHALL NOT use `## R1` as the remediation entry id

### Requirement: Hardening completion readers SHALL remain alias-compatible
Apply readiness parsers that inspect test-plan Status columns SHALL continue to treat existing complete aliases (including `covered`, `complete`, `completed`, `done`, `pass`, `passed`, `not applicable`, `n/a`, `na`) as complete. Writer guidance changes MUST NOT remove those aliases from the reader set.

#### Scenario: Legacy covered row still completes hardening
- **WHEN** a concrete test-plan Status cell contains the legacy value `covered`
- **THEN** the apply Test Hardening completeness check SHALL treat that row as complete
- **AND** normative templates MAY still discourage writing `covered` going forward

### Requirement: Test Hardening SHALL Include Manual Coverage Statuses
Test Hardening SHALL treat every concrete Manual Coverage status row as complete only when it is `passed` or scope-backed `not applicable`. An applicable `blocked` or `failed` manual row SHALL prevent Test Hardening and apply completion. Incomplete writer values include `planned`, `failed`, `blocked`, blank, or placeholder; legacy `failing` MAY still appear in older plans and remains incomplete.

#### Scenario: A manual check is required
- **WHEN** a test plan contains an applicable manual coverage item
- **THEN** the item SHALL be recorded in `## Manual Coverage` with a stable Manual ID
- **AND** it SHALL remain incomplete while its status is `planned`, `failed`, `blocked`, blank, or a placeholder

#### Scenario: A required manual check is blocked
- **WHEN** a Manual Coverage row lacks a required safe target, runtime, credential, external permission, or other prerequisite
- **THEN** its status SHALL be `blocked` with the missing prerequisite in Evidence
- **AND** Test Hardening SHALL remain incomplete

