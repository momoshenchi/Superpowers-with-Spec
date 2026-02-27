## MODIFIED Requirements
### Requirement: AI Tool Configuration
The command SHALL configure AI coding assistants with Superpowers instructions using a marker system.
#### Scenario: Prompting for AI tool selection
- **WHEN** run interactively
- **THEN** prompt the user with "Which AI tools do you use?" using a multi-select menu
- **AND** list every available tool with a checkbox:
  - Claude Code (creates or refreshes CLAUDE.md and slash commands)
  - Cursor (creates or refreshes `.cursor/commands/*` slash commands)
  - OpenCode (creates or refreshes `.opencode/command/superpowers-*.md` slash commands)
  - Windsurf (creates or refreshes `.windsurf/workflows/superpowers-*.md` workflows)
  - AGENTS.md standard (creates or refreshes AGENTS.md with Superpowers markers)
- **AND** show "(already configured)" beside tools whose managed files exist so users understand selections will refresh content
- **AND** treat disabled tools as "coming soon" and keep them unselectable
- **AND** allow confirming with Enter after selecting one or more tools

### Requirement: Slash Command Configuration
The init command SHALL generate slash command files for supported editors using shared templates.

#### Scenario: Generating slash commands for Claude Code
- **WHEN** the user selects Claude Code during initialization
- **THEN** create `.claude/commands/superpowers/proposal.md`, `.claude/commands/superpowers/apply.md`, and `.claude/commands/superpowers/archive.md`
- **AND** populate each file from shared templates so command text matches other tools
- **AND** each template includes instructions for the relevant Superpowers workflow stage

#### Scenario: Generating slash commands for Cursor
- **WHEN** the user selects Cursor during initialization
- **THEN** create `.cursor/commands/superpowers-proposal.md`, `.cursor/commands/superpowers-apply.md`, and `.cursor/commands/superpowers-archive.md`
- **AND** populate each file from shared templates so command text matches other tools
- **AND** each template includes instructions for the relevant Superpowers workflow stage

#### Scenario: Generating slash commands for OpenCode
- **WHEN** the user selects OpenCode during initialization
- **THEN** create `.opencode/commands/superpowers-proposal.md`, `.opencode/commands/superpowers-apply.md`, and `.opencode/commands/superpowers-archive.md`
- **AND** populate each file from shared templates so command text matches other tools
- **AND** each template includes instructions for the relevant Superpowers workflow stage

#### Scenario: Generating slash commands for Windsurf
- **WHEN** the user selects Windsurf during initialization
- **THEN** create `.windsurf/workflows/superpowers-proposal.md`, `.windsurf/workflows/superpowers-apply.md`, and `.windsurf/workflows/superpowers-archive.md`
- **AND** populate each file from shared templates (wrapped in Superpowers markers) so workflow text matches other tools
- **AND** each template includes instructions for the relevant Superpowers workflow stage
