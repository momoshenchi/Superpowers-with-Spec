## MODIFIED Requirements
### Requirement: AI Tool Configuration Details

The command SHALL properly configure selected AI tools with Superpowers-specific instructions using a marker system.

#### Scenario: Configuring Claude Code

- **WHEN** Claude Code is selected
- **THEN** create or update `CLAUDE.md` in the project root directory (not inside superpowers/)
- **AND** populate the managed block with a short stub that points teammates to `@/superpowers/AGENTS.md`

#### Scenario: Configuring CodeBuddy Code

- **WHEN** CodeBuddy Code is selected
- **THEN** create or update `CODEBUDDY.md` in the project root directory (not inside superpowers/)
- **AND** populate the managed block with a short stub that points teammates to `@/superpowers/AGENTS.md`

#### Scenario: Configuring Cline

- **WHEN** Cline is selected
- **THEN** create or update `CLINE.md` in the project root directory (not inside superpowers/)
- **AND** populate the managed block with a short stub that points teammates to `@/superpowers/AGENTS.md`

#### Scenario: Creating new CLAUDE.md

- **WHEN** CLAUDE.md does not exist
- **THEN** create new file with stub instructions wrapped in markers so the full workflow stays in `superpowers/AGENTS.md`:
```markdown
<!-- SUPERPOWERS:START -->
# Superpowers Instructions

This project uses Superpowers to manage AI assistant workflows.

- Full guidance lives in '@/superpowers/AGENTS.md'.
- Keep this managed block so 'superpowers update' can refresh the instructions.
<!-- SUPERPOWERS:END -->
```

### Requirement: Slash Command Configuration
The init command SHALL generate slash command files for supported editors using shared templates.

#### Scenario: Generating slash commands for Claude Code
- **WHEN** the user selects Claude Code during initialization
- **THEN** create `.claude/commands/superpowers/proposal.md`, `.claude/commands/superpowers/apply.md`, and `.claude/commands/superpowers/archive.md`
- **AND** populate each file from shared templates so command text matches other tools
- **AND** each template includes instructions for the relevant Superpowers workflow stage

#### Scenario: Generating slash commands for CodeBuddy Code
- **WHEN** the user selects CodeBuddy Code during initialization
- **THEN** create `.codebuddy/commands/superpowers/proposal.md`, `.codebuddy/commands/superpowers/apply.md`, and `.codebuddy/commands/superpowers/archive.md`
- **AND** populate each file from shared templates so command text matches other tools
- **AND** each template includes instructions for the relevant Superpowers workflow stage

#### Scenario: Generating slash commands for Cline
- **WHEN** the user selects Cline during initialization
- **THEN** create `.clinerules/superpowers-proposal.md`, `.clinerules/superpowers-apply.md`, and `.clinerules/superpowers-archive.md`
- **AND** populate each file from shared templates so command text matches other tools
- **AND** include Cline-specific Markdown heading frontmatter
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

#### Scenario: Generating slash commands for Kilo Code
- **WHEN** the user selects Kilo Code during initialization
- **THEN** create `.kilocode/workflows/superpowers-proposal.md`, `.kilocode/workflows/superpowers-apply.md`, and `.kilocode/workflows/superpowers-archive.md`
- **AND** populate each file from shared templates (wrapped in Superpowers markers) so workflow text matches other tools
- **AND** each template includes instructions for the relevant Superpowers workflow stage

#### Scenario: Generating slash commands for Codex
- **WHEN** the user selects Codex during initialization
- **THEN** create global prompt files at `~/.codex/prompts/superpowers-proposal.md`, `~/.codex/prompts/superpowers-apply.md`, and `~/.codex/prompts/superpowers-archive.md` (or under `$CODEX_HOME/prompts` if set)
- **AND** populate each file from shared templates that map the first numbered placeholder (`$1`) to the primary user input (e.g., change identifier or question text)
- **AND** wrap the generated content in Superpowers markers so `superpowers update` can refresh the prompts without touching surrounding custom notes

#### Scenario: Generating slash commands for GitHub Copilot
- **WHEN** the user selects GitHub Copilot during initialization
- **THEN** create `.github/prompts/superpowers-proposal.prompt.md`, `.github/prompts/superpowers-apply.prompt.md`, and `.github/prompts/superpowers-archive.prompt.md`
- **AND** populate each file with YAML frontmatter containing a `description` field that summarizes the workflow stage
- **AND** include `$ARGUMENTS` placeholder to capture user input
- **AND** wrap the shared template body with Superpowers markers so `superpowers update` can refresh the content
- **AND** each template includes instructions for the relevant Superpowers workflow stage
