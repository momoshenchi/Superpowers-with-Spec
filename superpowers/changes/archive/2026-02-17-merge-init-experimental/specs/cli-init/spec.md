## MODIFIED Requirements

### Requirement: Directory Creation

The command SHALL create the Superpowers directory structure with config file.

#### Scenario: Creating Superpowers structure

- **WHEN** `superpowers init` is executed
- **THEN** create the following directory structure:
```
superpowers/
├── config.yaml
├── specs/
└── changes/
    └── archive/
```

### Requirement: AI Tool Configuration

The command SHALL configure AI coding assistants with skills and slash commands using a searchable multi-select experience.

#### Scenario: Prompting for AI tool selection

- **WHEN** run interactively
- **THEN** display animated welcome screen with Superpowers logo
- **AND** present a searchable multi-select that shows all available tools
- **AND** mark already configured tools with "(configured ✓)" indicator
- **AND** pre-select configured tools for easy refresh
- **AND** sort configured tools to appear first in the list
- **AND** allow filtering by typing to search

#### Scenario: Selecting tools to configure

- **WHEN** user selects tools and confirms
- **THEN** generate skills in `.<tool>/skills/` directory for each selected tool
- **AND** generate slash commands in `.<tool>/commands/sp/` directory for each selected tool
- **AND** create `superpowers/config.yaml` with default schema setting

### Requirement: Skill Generation

The command SHALL generate Agent Skills for selected AI tools.

#### Scenario: Generating skills for a tool

- **WHEN** a tool is selected during initialization
- **THEN** create 9 skill directories under `.<tool>/skills/`:
  - `superpowers-explore/SKILL.md`
  - `superpowers-new-change/SKILL.md`
  - `superpowers-continue-change/SKILL.md`
  - `superpowers-apply-change/SKILL.md`
  - `superpowers-ff-change/SKILL.md`
  - `superpowers-verify-change/SKILL.md`
  - `superpowers-sync-specs/SKILL.md`
  - `superpowers-archive-change/SKILL.md`
  - `superpowers-bulk-archive-change/SKILL.md`
- **AND** each SKILL.md SHALL contain YAML frontmatter with name and description
- **AND** each SKILL.md SHALL contain the skill instructions

### Requirement: Slash Command Generation

The command SHALL generate sp slash commands for selected AI tools.

#### Scenario: Generating slash commands for a tool

- **WHEN** a tool is selected during initialization
- **THEN** create 9 slash command files using the tool's command adapter:
  - `/sp:explore`
  - `/sp:new`
  - `/sp:continue`
  - `/sp:apply`
  - `/sp:ff`
  - `/sp:verify`
  - `/sp:sync`
  - `/sp:archive`
  - `/sp:bulk-archive`
- **AND** use tool-specific path conventions (e.g., `.claude/commands/sp/` for Claude)
- **AND** include tool-specific frontmatter format

### Requirement: Success Output

The command SHALL provide clear, actionable next steps upon successful initialization.

#### Scenario: Displaying success message

- **WHEN** initialization completes successfully
- **THEN** display categorized summary:
  - "Created: <tools>" for newly configured tools
  - "Refreshed: <tools>" for already-configured tools that were updated
  - Count of skills and commands generated
- **AND** display getting started section with:
  - `/sp:new` - Start a new change
  - `/sp:continue` - Create the next artifact
  - `/sp:apply` - Implement tasks
- **AND** display links to documentation and feedback

#### Scenario: Displaying restart instruction

- **WHEN** initialization completes successfully and tools were created or refreshed
- **THEN** display instruction to restart IDE for slash commands to take effect

### Requirement: Config File Generation

The command SHALL create an Superpowers config file with schema settings.

#### Scenario: Creating config.yaml

- **WHEN** initialization completes
- **AND** config.yaml does not exist
- **THEN** create `superpowers/config.yaml` with default schema setting
- **AND** display config location in output

#### Scenario: Preserving existing config.yaml

- **WHEN** initialization runs in extend mode
- **AND** `superpowers/config.yaml` already exists
- **THEN** preserve the existing config file
- **AND** display "(exists)" indicator in output

### Requirement: Non-Interactive Mode

The command SHALL support non-interactive operation through command-line options.

#### Scenario: Select all tools non-interactively

- **WHEN** run with `--tools all`
- **THEN** automatically select every available AI tool without prompting
- **AND** proceed with skill and command generation

#### Scenario: Select specific tools non-interactively

- **WHEN** run with `--tools claude,cursor`
- **THEN** parse the comma-separated tool IDs
- **AND** generate skills and commands for specified tools only

#### Scenario: Skip tool configuration non-interactively

- **WHEN** run with `--tools none`
- **THEN** create only the superpowers directory structure and config.yaml
- **AND** skip skill and command generation

### Requirement: Experimental Command Alias

The command SHALL maintain backward compatibility with the experimental command.

#### Scenario: Running superpowers experimental

- **WHEN** user runs `superpowers experimental`
- **THEN** delegate to `superpowers init`
- **AND** the command SHALL be hidden from help output

## REMOVED Requirements

### Requirement: File Generation

**Reason**: AGENTS.md and project.md are no longer generated. Skills contain all necessary instructions.

**Migration**: Skills in `.<tool>/skills/` provide all Superpowers workflow instructions. No manual file needed.

### Requirement: AI Tool Configuration Details

**Reason**: Config files (CLAUDE.md, .cursorrules, etc.) are replaced by skills.

**Migration**: Use skills in `.<tool>/skills/` instead of config files. Skills provide richer, tool-specific instructions.

### Requirement: Slash Command Configuration

**Reason**: Old `/superpowers:*` slash commands are replaced by `/sp:*` commands with richer functionality.

**Migration**: Use `/sp:new`, `/sp:continue`, `/sp:apply` instead of `/superpowers:proposal`, `/superpowers:apply`, `/superpowers:archive`.

### Requirement: Root instruction stub

**Reason**: Root AGENTS.md stub is no longer needed. Skills provide tool-specific instructions.

**Migration**: Skills are loaded automatically by supporting tools. No root stub needed.
