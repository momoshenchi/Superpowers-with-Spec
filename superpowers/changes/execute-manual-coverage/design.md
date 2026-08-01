## Context

The test-plan schema supports `manual` as a coverage decision, while the current `## Deferred Or Manual Coverage` table joins manual work with deliberate deferrals and lacks `Status` or `Evidence` columns. Existing Test Hardening completion only evaluates concrete status rows, so this combined section cannot enforce execution of manual checks.

## Goals / Non-Goals

**Goals:**

- Make required manual checks actionable, status-tracked, and evidence-backed.
- Ensure `/sp:verify` executes applicable manual rows rather than treating them as prose or implied human work.
- Preserve explicit deferrals without allowing them to masquerade as completed validation.

**Non-Goals:**

- Require an agent to perform unsafe, credentialed, destructive, physical-device, or externally authorized actions.
- Turn a justified non-applicable row into a failure.
- Add a new browser/E2E framework or alter the existing E2E acceptance criteria.

## Decisions

### 1. Split manual and deferred coverage into independent tables

| Section | Required columns | Completion semantics |
| --- | --- | --- |
| `## Manual Coverage` | Check / scenario, execution method and environment, Status, Evidence | Each concrete row must become `passed` or `not applicable`; `planned`, `failing`, blank, or `blocked` prevents completion. |
| `## Deferred Coverage` | Gap, specific reason deferred, safer alternative or follow-up | Not execution evidence. It must not be described as passed or run. |

This makes the status parser and reviewer unambiguous without conflating an intentional deferral with a runnable manual acceptance check.

### 2. Verify owns execution, with safety-aware blocking

`/sp:verify` reads the Manual Coverage table after canonical non-visual preflight and performs each applicable row through the stated normal entry point. It records commands/runtime, performed steps, observed result, and evidence. A missing safe target, runtime, credential, or required external permission is `blocked`, not guessed or bypassed; an applicable blocked row prevents Verify from passing.

### 3. Keep manual checks bounded by the artifact

Verify follows the concrete rows in `test-plan.md`, using requirements and the diff only to identify incomplete or missing required rows. It may add a newly discovered requirement to the plan, but cannot silently reduce a required manual row to a deferral or `not applicable` without a scope-backed rationale.

## Risks / Trade-offs

- Manual rows may be underspecified. Mitigation: require method/environment and evidence fields; incomplete rows remain unfinished.
- Some manual checks need user-owned credentials or unsafe actions. Mitigation: report `blocked` with the prerequisite and do not consume a final-gate retry round.
- Extra evidence creates work. Mitigation: require concise, inspectable proof rather than recordings for every action.

## Migration Plan

1. Update schema/template and generated Test Hardening instructions.
2. Update Verify skill/command instructions and report structure.
3. Add contract tests for distinct table semantics and blocking outcomes.
4. Update documentation and run the canonical non-visual suite.
