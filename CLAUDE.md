# Superpowers with Spec

AI-native CLI for spec-driven development — combines structured artifact workflows (proposals, designs, tasks) with a comprehensive library of reusable AI coding skills.

## Development Commands

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Lint source
npm run lint
```

## Project Structure

- `src/` — TypeScript source code
  - `src/core/` — Core CLI commands (init, status, list, etc.)
  - `src/core/templates/` — Skill and command templates
  - `src/core/shared/` — Shared utilities for skill generation
  - `src/utils/` — General utilities
- `skills/` — Static skill files copied to AI tool directories on init
- `hooks/` — Claude Code session hooks
- `agents/` — Claude Code agent definitions
- `test/` — Vitest test suite
- `schemas/` — JSON schemas for artifact validation

## Coding Conventions

- **Language:** TypeScript (ESM modules, `"type": "module"` in package.json)
- **Build:** `tsc` compiles `src/` → `dist/`
- **Tests:** Vitest (`npm test`)
- **Commits:** Conventional commits (`feat:`, `fix:`, `chore:`, etc.)
- **Node:** >= 20.19.0

## CLI Usage

```bash
# Initialize Superpowers in a project
superpowers init

# Initialize for a specific AI tool
superpowers init --tools claude

# List active changes
superpowers list

# Check status of a change
superpowers status --change <name>
```

## Slash Commands

After running `superpowers init`, the following slash commands are available in your AI tool:

The default `core` profile installs:

- `/sp:propose` — Create a new change with all artifacts
- `/sp:explore` — Enter explore/brainstorming mode
- `/sp:review` — Review a complete proposal before implementation
- `/sp:apply` — Implement tasks from a change
- `/sp:archive` — Archive a completed change
- `/sp:simplify`, `/sp:verify`, `/sp:design-verify` — Final quality gate workflows that `/sp:apply` runs after Test Hardening (code review ∥ Simplify ∥ Design verify, then Verify), and that `/sp:archive` checks via the `## Final Quality Gates` table in `test-plan.md`

Remaining workflows (`new`, `continue`, `ff`, `sync`, `bulk-archive`, `shape-review`, `onboard`) are available through `superpowers config profile`.
