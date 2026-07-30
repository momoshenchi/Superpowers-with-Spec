## Why

Completing implementation tasks and Test Hardening still leaves a gap between automated tests and a trustworthy final handoff: no required final code review, no behavior-preserving cleanup pass, no repeatable end-to-end acceptance of changed user journeys, and no runtime check that UI work follows the repository's visual `DESIGN.md`. These checks must work for generated Superpowers workflows across hosts such as OpenCode and Codex without colliding with Claude Code's built-in slash commands.

## What Changes

- Extend `/sp:apply` so Test Hardening first discovers and runs the project's canonical non-visual test suite, then its completion path delegates each final quality gate to a fresh subagent in sequence: reuse the host's native `code-review` capability, then `/sp:simplify`, `/sp:verify`, and `/sp:design-verify`.
- Add a generated, cross-tool `/sp:simplify` workflow that ports Claude Code 2.1.220's two-phase cleanup flow: gather the diff; assess reuse, simplification, efficiency, and abstraction-level improvements with four parallel agents where supported; then deduplicate and apply safe findings.
- Extend `/sp:verify` with a mandatory canonical non-visual test-suite preflight before evidence-based E2E acceptance for affected runnable user journeys, requiring real UI input for browser flows, concrete browser-driver artifacts, relevant interaction risks, and destructive-flow safety in addition to an explicit pass/block/not-applicable outcome.
- Add a generated, cross-tool `/sp:design-verify` workflow that detects UI scope and checks the running UI against the repository visual `DESIGN.md` when one exists.
- Keep Superpowers from generating a `code-review` command or skill. The apply workflow invokes the host-native review capability when available and requires an equivalent explicit final review rather than silently skipping the gate.
- Keep automatic apply completion independent of whether the optional standalone `verify`, `simplify`, and `design-verify` workflows are selected in a user's profile; their gate contracts must be available from `/sp:apply` itself.

## Capabilities

### New Capabilities

- `sp-simplify-skill`: Cross-tool `/sp:simplify` cleanup workflow with behavior-preservation and verification requirements.
- `sp-design-verify-skill`: Cross-tool `/sp:design-verify` workflow for runtime UI conformance to a visual `DESIGN.md`.
- `post-apply-quality-gates`: Final `/sp:apply` gate orchestration, host-native code-review reuse, outcome semantics, and profile-independent availability.

### Modified Capabilities

- `sp-verify-skill`: Add evidence-based E2E acceptance rules and report outcomes for applicable user journeys.

## Attachments

None.

## Impact

- Workflow templates and generated command/skill registries under `src/core/templates/`, `src/core/shared/`, `src/core/profiles.ts`, and profile-sync/detection maps.
- `/sp:apply` and `/sp:verify` generated instructions, plus new `/sp:simplify` and `/sp:design-verify` command/skill templates.
- Existing workflow, template-parity, generation, profile, init/update, and documentation tests; update user-facing workflow/command documentation.
- No new dependency, browser automation framework, or Superpowers-owned `code-review` workflow. Individual projects remain responsible for supplying a runnable application and any required browser-test setup.
