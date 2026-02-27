## MODIFIED Requirements

### Requirement: Directory Creation
The command SHALL create the complete Superpowers directory structure with all required directories and files.

#### Scenario: Creating Superpowers structure
- **WHEN** `superpowers init` is executed
- **THEN** create the following directory structure:
```
superpowers/
├── project.md
├── AGENTS.md
├── specs/
└── changes/
    └── archive/
```

### Requirement: File Generation
The command SHALL generate required template files with appropriate content for immediate use.

#### Scenario: Generating template files
- **WHEN** initializing Superpowers
- **THEN** generate `AGENTS.md` containing complete Superpowers instructions for AI assistants
- **AND** generate `project.md` with project context template

### Requirement: AI Tool Configuration Details

The command SHALL properly configure selected AI tools with Superpowers-specific instructions using a marker system.

#### Scenario: Creating new CLAUDE.md
- **WHEN** CLAUDE.md does not exist
- **THEN** create new file with Superpowers content wrapped in markers including reference to `@superpowers/AGENTS.md`

### Requirement: Success Output

The command SHALL provide clear, actionable next steps upon successful initialization.

#### Scenario: Displaying success message
- **WHEN** initialization completes successfully
- **THEN** include prompt: "Please explain the Superpowers workflow from superpowers/AGENTS.md and how I should work with you on this project"
