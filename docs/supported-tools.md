# Supported Tools

Superpowers works with many AI coding assistants. When you run `superpowers init`, Superpowers configures selected tools using your active profile/workflow selection and delivery mode.

## How It Works

For each selected tool, Superpowers can install:

1. **Skills** (if delivery includes skills): `.../skills/superpowers-*/SKILL.md`
2. **Commands** (if delivery includes commands): tool-specific `sp-*` command files

By default, Superpowers uses the `core` profile, which includes:
- `propose`
- `explore`
- `apply`
- `archive`

You can enable expanded workflows (`new`, `continue`, `ff`, `verify`, `sync`, `bulk-archive`, `onboard`) via `superpowers config profile`, then run `superpowers update`.

## Tool Directory Reference

| Tool (ID) | Skills path pattern | Command path pattern |
|-----------|---------------------|----------------------|
| Amazon Q Developer (`amazon-q`) | `.amazonq/skills/superpowers-*/SKILL.md` | `.amazonq/prompts/sp-<id>.md` |
| Antigravity (`antigravity`) | `.agent/skills/superpowers-*/SKILL.md` | `.agent/workflows/sp-<id>.md` |
| Auggie (`auggie`) | `.augment/skills/superpowers-*/SKILL.md` | `.augment/commands/sp-<id>.md` |
| Claude Code (`claude`) | `.claude/skills/superpowers-*/SKILL.md` | `.claude/commands/sp/<id>.md` |
| Cline (`cline`) | `.cline/skills/superpowers-*/SKILL.md` | `.clinerules/workflows/sp-<id>.md` |
| CodeBuddy (`codebuddy`) | `.codebuddy/skills/superpowers-*/SKILL.md` | `.codebuddy/commands/sp/<id>.md` |
| Codex (`codex`) | `.codex/skills/superpowers-*/SKILL.md` | `$CODEX_HOME/prompts/sp-<id>.md`\* |
| Continue (`continue`) | `.continue/skills/superpowers-*/SKILL.md` | `.continue/prompts/sp-<id>.prompt` |
| CoStrict (`costrict`) | `.cospec/skills/superpowers-*/SKILL.md` | `.cospec/superpowers/commands/sp-<id>.md` |
| Crush (`crush`) | `.crush/skills/superpowers-*/SKILL.md` | `.crush/commands/sp/<id>.md` |
| Cursor (`cursor`) | `.cursor/skills/superpowers-*/SKILL.md` | `.cursor/commands/sp-<id>.md` |
| Factory Droid (`factory`) | `.factory/skills/superpowers-*/SKILL.md` | `.factory/commands/sp-<id>.md` |
| Gemini CLI (`gemini`) | `.gemini/skills/superpowers-*/SKILL.md` | `.gemini/commands/sp/<id>.toml` |
| GitHub Copilot (`github-copilot`) | `.github/skills/superpowers-*/SKILL.md` | `.github/prompts/sp-<id>.prompt.md`\*\* |
| iFlow (`iflow`) | `.iflow/skills/superpowers-*/SKILL.md` | `.iflow/commands/sp-<id>.md` |
| Kilo Code (`kilocode`) | `.kilocode/skills/superpowers-*/SKILL.md` | `.kilocode/workflows/sp-<id>.md` |
| Kiro (`kiro`) | `.kiro/skills/superpowers-*/SKILL.md` | `.kiro/prompts/sp-<id>.prompt.md` |
| OpenCode (`opencode`) | `.opencode/skills/superpowers-*/SKILL.md` | `.opencode/commands/sp-<id>.md` |
| Pi (`pi`) | `.pi/skills/superpowers-*/SKILL.md` | `.pi/prompts/sp-<id>.md` |
| Qoder (`qoder`) | `.qoder/skills/superpowers-*/SKILL.md` | `.qoder/commands/sp/<id>.md` |
| Qwen Code (`qwen`) | `.qwen/skills/superpowers-*/SKILL.md` | `.qwen/commands/sp-<id>.toml` |
| RooCode (`roocode`) | `.roo/skills/superpowers-*/SKILL.md` | `.roo/commands/sp-<id>.md` |
| Trae (`trae`) | `.trae/skills/superpowers-*/SKILL.md` | Not generated (no command adapter; use skill-based `/superpowers-*` invocations) |
| Windsurf (`windsurf`) | `.windsurf/skills/superpowers-*/SKILL.md` | `.windsurf/workflows/sp-<id>.md` |

\* Codex commands are installed in the global Codex home (`$CODEX_HOME/prompts/` if set, otherwise `~/.codex/prompts/`), not your project directory.

\*\* GitHub Copilot prompt files are recognized as custom slash commands in IDE extensions (VS Code, JetBrains, Visual Studio). Copilot CLI does not currently consume `.github/prompts/*.prompt.md` directly.

## Non-Interactive Setup

For CI/CD or scripted setup, use `--tools` (and optionally `--profile`):

```bash
# Configure specific tools
superpowers init --tools claude,cursor

# Configure all supported tools
superpowers init --tools all

# Skip tool configuration
superpowers init --tools none

# Override profile for this init run
superpowers init --profile core
```

**Available tool IDs (`--tools`):** `amazon-q`, `antigravity`, `auggie`, `claude`, `cline`, `codex`, `codebuddy`, `continue`, `costrict`, `crush`, `cursor`, `factory`, `gemini`, `github-copilot`, `iflow`, `kilocode`, `kiro`, `opencode`, `pi`, `qoder`, `qwen`, `roocode`, `trae`, `windsurf`

## Workflow-Dependent Installation

Superpowers installs workflow artifacts based on selected workflows:

- **Core profile (default):** `propose`, `explore`, `apply`, `archive`
- **Custom selection:** any subset of all workflow IDs:
  `propose`, `explore`, `new`, `continue`, `apply`, `ff`, `sync`, `archive`, `bulk-archive`, `verify`, `onboard`

In other words, skill/command counts are profile-dependent and delivery-dependent, not fixed.

## Generated Skill Names

When selected by profile/workflow config, Superpowers generates these skills:

- `superpowers-propose`
- `superpowers-explore`
- `superpowers-new-change`
- `superpowers-continue-change`
- `superpowers-apply-change`
- `superpowers-ff-change`
- `superpowers-sync-specs`
- `superpowers-archive-change`
- `superpowers-bulk-archive-change`
- `superpowers-verify-change`
- `superpowers-onboard`

See [Commands](commands.md) for command behavior and [CLI](cli.md) for `init`/`update` options.

## Related

- [CLI Reference](cli.md) — Terminal commands
- [Commands](commands.md) — Slash commands and skills
- [Getting Started](getting-started.md) — First-time setup
