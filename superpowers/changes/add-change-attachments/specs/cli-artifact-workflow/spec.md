## MODIFIED Requirements

### Requirement: Instructions Command

The system SHALL output enriched instructions for creating an artifact, including for scaffolded changes and attachment-aware artifact guidance.

#### Scenario: Show enriched instructions

- **WHEN** user runs `superpowers instructions <artifact> --change <id>`
- **THEN** the system outputs:
  - Artifact metadata (ID, output path, description)
  - Template content
  - Dependency status (done/missing)
  - Unlocked artifacts (what becomes available after completion)

#### Scenario: Instructions JSON output

- **WHEN** user runs `superpowers instructions <artifact> --change <id> --json`
- **THEN** the system outputs JSON matching ArtifactInstructions interface

#### Scenario: Unknown artifact

- **WHEN** user runs `superpowers instructions unknown-artifact --change <id>`
- **THEN** the system displays an error listing valid artifact IDs for the schema

#### Scenario: Artifact with unmet dependencies

- **WHEN** user requests instructions for a blocked artifact
- **THEN** the system displays instructions with a warning about missing dependencies

#### Scenario: Instructions on scaffolded change

- **WHEN** user runs `superpowers instructions proposal --change <id>` on a scaffolded change
- **THEN** system outputs template and metadata for creating the proposal
- **AND** does not require any artifacts to already exist

#### Scenario: Attachment guidance for attachment-aware artifacts

- **WHEN** user runs `superpowers instructions proposal --change <id>`
- **OR** user runs `superpowers instructions design --change <id>`
- **OR** user runs `superpowers instructions specs --change <id>`
- **OR** user runs `superpowers instructions execution-plan --change <id>`
- **THEN** the instructions SHALL tell the agent that files may be referenced from `attachments/`
- **AND** the instructions SHALL require referenced attachments to be explained in the artifact text

### Requirement: Apply Instructions Command

The system SHALL generate schema-aware apply instructions via `superpowers instructions apply`, including referenced change attachments when present.

#### Scenario: Generate apply instructions

- **WHEN** user runs `superpowers instructions apply --change <id>`
- **AND** all required artifacts (per schema's `apply.requires`) exist
- **THEN** the system outputs:
  - Context files from all existing artifacts
  - Schema-specific instruction text
  - Progress tracking file path (if `apply.tracks` is set)

#### Scenario: Apply blocked by missing artifacts

- **WHEN** user runs `superpowers instructions apply --change <id>`
- **AND** required artifacts are missing
- **THEN** the system indicates apply is blocked
- **AND** lists which artifacts must be created first

#### Scenario: Apply instructions JSON output

- **WHEN** user runs `superpowers instructions apply --change <id> --json`
- **THEN** the system outputs JSON with:
  - `contextFiles`: object mapping artifact IDs to resolved paths for existing artifact files
  - `instruction`: the apply instruction text
  - `tracks`: path to progress file or null
  - `applyRequires`: list of required artifact IDs

#### Scenario: Apply JSON includes referenced attachments

- **WHEN** completed artifacts contain Markdown image or link targets beginning with `attachments/`
- **AND** user runs `superpowers instructions apply --change <id> --json`
- **THEN** the system outputs `attachmentFiles`
- **AND** `attachmentFiles` maps each discovered existing supported change-relative attachment path to its resolved filesystem path
- **AND** `contextFiles` continues to contain only schema artifact files keyed by artifact ID

#### Scenario: Apply text includes referenced attachments

- **WHEN** completed artifacts contain Markdown image or link targets beginning with `attachments/`
- **AND** user runs `superpowers instructions apply --change <id>`
- **THEN** the output includes an `Attachment Files` section
- **AND** the section lists each discovered change-relative attachment path

#### Scenario: No referenced attachments

- **WHEN** completed artifacts contain no Markdown image or link targets beginning with `attachments/`
- **AND** user runs `superpowers instructions apply --change <id> --json`
- **THEN** `attachmentFiles` SHALL be omitted or empty
- **AND** apply readiness SHALL be unchanged

#### Scenario: Missing attachment references are ignored

- **WHEN** completed artifacts contain Markdown image or link targets beginning with `attachments/`
- **AND** the referenced attachment files do not exist
- **AND** user runs `superpowers instructions apply --change <id> --json`
- **THEN** the missing references SHALL NOT appear in `attachmentFiles`
- **AND** the command SHALL NOT warn, prompt, fail, or change apply readiness

#### Scenario: Unsupported attachment references are ignored

- **WHEN** completed artifacts contain Markdown image or link targets for PDF or unsupported extension files under `attachments/`
- **AND** user runs `superpowers instructions apply --change <id> --json`
- **THEN** the unsupported references SHALL NOT appear in `attachmentFiles`
- **AND** the command SHALL NOT warn, prompt, fail, or change apply readiness

#### Scenario: Unsafe attachment references are excluded

- **WHEN** completed artifacts contain an attachment reference that resolves outside the change's `attachments/` directory
- **AND** user runs `superpowers instructions apply --change <id> --json`
- **THEN** the unsafe reference SHALL NOT appear in `attachmentFiles`
- **AND** the command SHALL NOT expose files outside the change directory
