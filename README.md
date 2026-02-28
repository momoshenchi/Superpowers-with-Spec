# Superpowers with Spec

Superpowers with Spec is an AI-native CLI for spec-driven development.

It combines:

- OpenSpec's structured artifact workflow and CLI foundations: proposal/design/tasks/spec lifecycle
- Superpowers' practical skill library for brainstorming, planning, execution, debugging, and verification

Project base references:

- OpenSpec: https://github.com/Fission-AI/OpenSpec
- Superpowers skills: https://github.com/obra/superpowers

## What this project is

This repository is a fork/evolution focused on:

- **OpenSpec-style rigor**: explicit artifacts, traceable changes, predictable implementation flow
- **Superpowers-style productivity**: reusable skills that guide agent behavior in real coding sessions
- **Tool-agnostic setup**: generated skills/commands for many coding agents (including Codex)

## Quickstart
```bash
npm i -g superpowers-spec@latest && superpowers --version
```

Inside your target project:

```bash
superpowers init
```


## Core concepts

Superpowers with Spec manages change artifacts under `superpowers/`:

- `superpowers/changes/<change>/proposal.md`
- `superpowers/changes/<change>/design.md`
- `superpowers/changes/<change>/tasks.md`
- `superpowers/changes/<change>/specs/...`

And installs agent-facing assets under tool directories (for example):

- `.claude/skills`, `.claude/commands`, `.claude/hooks`, `.claude/agents`
- `.codex/skills`, global Codex prompts under `~/.codex/prompts`, plus `.codex/hooks` and `.codex/agents`

## Requirements

- Node.js >= 20.19.0
- pnpm (recommended) or npm

## Local development

Install dependencies:

```bash
pnpm install
```

Build:

```bash
pnpm run build
```

Run tests:

```bash
pnpm test
```

Lint:

```bash
pnpm run lint
```

Run CLI locally from repo:

```bash
node bin/superpowers.js --help
node bin/superpowers.js --version
```

## Initialize in a project

Inside your target project:

```bash
superpowers init
```

Or non-interactive:

```bash
superpowers init --tools codex
superpowers init --tools claude,cursor
superpowers init --tools all
```

## Main commands

- `superpowers init` — initialize project and tool assets
- `superpowers update` — refresh installed skills/commands from current profile
- `superpowers list` — list changes (or specs with flags)
- `superpowers show` — show artifacts/specs
- `superpowers validate` — validate artifacts/specs
- `superpowers config profile` — switch workflow profile

## Repository structure

- `src/` — TypeScript source
- `skills/` — bundled static skills copied to tool directories
- `hooks/` — bundled hook files
- `agents/` — bundled agent definitions
- `schemas/` — schema templates and validation schema
- `test/` — Vitest test suite

## Publish to npm

Before publish:

```bash
pnpm run build
pnpm test
pnpm run check:pack-version
```

Publish flow:

```bash
pnpm changeset
pnpm changeset version
pnpm run release:ci
```

Package metadata is in `package.json` (current package name: `superpowers-spec`).

## Telemetry

Anonymous command telemetry is enabled by default and can be disabled via:

```bash
export SUPERPOWERS_TELEMETRY=0
# or
export DO_NOT_TRACK=1
```

## License

MIT
