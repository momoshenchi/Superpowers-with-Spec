## ADDED Requirements

### Requirement: Fixed Change Attachment Directory
The system SHALL recognize `attachments/` as the standard directory for supporting files inside a Superpowers change directory.

#### Scenario: Change includes attachment directory
- **WHEN** a change contains `superpowers/changes/add-ui/attachments/`
- **THEN** the system treats the directory as change-local supporting context
- **AND** artifacts may reference files in that directory using change-relative paths beginning with `attachments/`

#### Scenario: Change has no attachment directory
- **WHEN** a change does not contain `superpowers/changes/add-ui/attachments/`
- **THEN** the system continues normal artifact workflow behavior
- **AND** the missing attachment directory does not make any artifact incomplete

#### Scenario: Attachment directory is not an artifact
- **WHEN** `superpowers status --change add-ui --json` is run for a change with files under `attachments/`
- **THEN** the output SHALL NOT include `attachments` as a completion-tracked artifact
- **AND** apply readiness SHALL NOT depend on the existence of the attachment directory

### Requirement: Artifact Attachment References
The system SHALL allow proposal, design, spec, and execution-plan artifacts to reference change-local attachments.

#### Scenario: Proposal references an attachment
- **WHEN** `proposal.md` contains `![Dashboard target](attachments/dashboard-target.png)`
- **THEN** the reference is valid supporting context for the proposal
- **AND** the proposal text SHALL explain what the attachment is and why it matters

#### Scenario: Spec references an attachment
- **WHEN** `specs/ui/spec.md` contains `[Interaction notes](attachments/interaction-notes.md)`
- **THEN** the reference is valid supporting context for the spec
- **AND** the spec text SHALL identify which requirement or scenario the attachment supports

#### Scenario: Execution plan references an attachment
- **WHEN** `execution-plan.md` references `attachments/mobile-state.png`
- **THEN** the execution plan SHALL explain how the implementer should use the attachment while completing the relevant task

#### Scenario: Normative versus illustrative meaning is explicit
- **WHEN** an artifact references an attachment
- **THEN** the artifact SHALL state whether the referenced attachment is normative, illustrative, or background context
- **AND** normative attachments SHALL identify the behavior, layout, state, or constraint that must be preserved

### Requirement: Attachment File Types
The system SHALL surface only existing image, text, and CSV files as initial attachment types without requiring the CLI to parse their contents.

#### Scenario: Image attachment
- **WHEN** an artifact references `attachments/target-layout.png`
- **THEN** the system treats the image as a referenced attachment file
- **AND** the CLI SHALL NOT be required to inspect or interpret image pixels

#### Scenario: Supported image extensions
- **WHEN** an artifact references an existing file ending in `.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`, or `.svg` under `attachments/`
- **THEN** the system surfaces the file as a referenced attachment

#### Scenario: Text attachment
- **WHEN** an artifact references `attachments/product-notes.md`
- **THEN** the system treats the text file as a referenced attachment file
- **AND** agents may read the file as supporting context when creating or applying artifacts

#### Scenario: Supported text extensions
- **WHEN** an artifact references an existing file ending in `.txt`, `.md`, or `.markdown` under `attachments/`
- **THEN** the system surfaces the file as a referenced attachment

#### Scenario: CSV attachment
- **WHEN** an artifact references an existing file ending in `.csv` under `attachments/`
- **THEN** the system surfaces the file as a referenced attachment
- **AND** agents may read the file as tabular supporting context when creating or applying artifacts

#### Scenario: PDF attachment unsupported
- **WHEN** an artifact references `attachments/reference.pdf`
- **THEN** the system SHALL NOT surface the file as an attachment reference
- **AND** the command SHALL NOT warn, prompt, or fail because of the unsupported PDF reference

#### Scenario: Unknown extension unsupported
- **WHEN** an artifact references `attachments/reference.bin`
- **THEN** the system SHALL NOT surface the file as an attachment reference
- **AND** the command SHALL NOT warn, prompt, or fail because of the unsupported extension

#### Scenario: Missing referenced file ignored
- **WHEN** an artifact references `attachments/missing.png`
- **AND** that file does not exist under the change's `attachments/` directory
- **THEN** the system SHALL NOT surface the file as an attachment reference
- **AND** the command SHALL NOT warn, prompt, or fail because of the missing file

### Requirement: Safe Attachment Path Resolution
The system SHALL resolve attachment references safely within the current change directory.

#### Scenario: Change-relative markdown target
- **WHEN** an artifact contains a Markdown link target beginning with `attachments/`
- **THEN** the system resolves it relative to `superpowers/changes/<change>/`
- **AND** filesystem resolution SHALL use path utilities rather than hardcoded platform separators

#### Scenario: Nested attachment path
- **WHEN** an artifact references `attachments/screens/mobile/home.png`
- **THEN** the system resolves the nested file under the change's `attachments/` directory

#### Scenario: Path traversal rejected
- **WHEN** an artifact references `attachments/../proposal.md`
- **THEN** the system SHALL NOT surface the resolved path as an attachment file
- **AND** the reference SHALL NOT allow access outside the change's `attachments/` directory

#### Scenario: Containment check uses path-relative validation
- **WHEN** the system resolves an attachment reference to a filesystem path
- **THEN** the system SHALL validate that the resolved path is contained within the resolved change-local `attachments/` directory
- **AND** the containment check SHALL reject paths whose `path.relative(attachmentsDir, resolvedPath)` result begins with `..` or is absolute

### Requirement: Attachment References Are Explicit
The system SHALL discover attachment references from explicit Markdown image and link targets that begin with `attachments/`.

#### Scenario: Markdown image target discovered
- **WHEN** `design.md` contains `![Reference](attachments/reference.png)`
- **THEN** the system discovers `attachments/reference.png` as a referenced attachment

#### Scenario: Markdown link target discovered
- **WHEN** `design.md` contains `[Notes](attachments/notes.md)`
- **THEN** the system discovers `attachments/notes.md` as a referenced attachment

#### Scenario: Plain prose mention not required to be discovered
- **WHEN** an artifact says `see attachments/reference.png` without a Markdown link or image target
- **THEN** the system is not required to discover that mention as an attachment reference

#### Scenario: Duplicate references deduplicated
- **WHEN** multiple artifacts reference `attachments/reference.png`
- **THEN** the system surfaces the referenced attachment only once in machine-readable attachment output
