# 1. Final quality-gate foundation and apply completion

## Shared contract and orchestration

- [x] 1.1 Add a shared workflow-template fragment that defines the four ordered final gates, canonical outcomes, failure/restart behavior, host-native code-review fallback, and final evidence recording.
- [x] 1.2 Update both `/sp:apply` template forms so Test Hardening discovers and runs the complete canonical non-visual test suite before completion, then runs the shared final-gate sequence, appends evidence to `test-plan.md`, and withholds archive recommendation on failed or blocked applicable gates.
- [x] 1.3 Add focused template tests for sequencing, profile-independent apply behavior, explicit outcome values, restart semantics, and the prohibition on generating a Superpowers code-review workflow.
- [x] 1.4 Require one fresh subagent per final gate, sequential result integration, and a blocked outcome when a host cannot delegate.

# 2. E2E acceptance in verify

## Correctness evidence

- [x] 2.1 Extend `src/core/templates/workflows/verify-change.ts` so correctness discovers and runs the complete canonical non-visual test suite before classifying changed runnable user journeys and requiring executable E2E evidence, risk-path coverage, and browser/network signals.
- [x] 2.2 Define verify report behavior for E2E `passed`, `blocked`, and `not applicable` outcomes without allowing source inspection, screenshots, or unaided human checks to stand in for an applicable E2E pass.
- [x] 2.3 Add parity and contract tests for the generated verify skill and command, including non-UI/non-runnable scope, missing runtime prerequisites, and actionable evidence output.
- [x] 2.4 Strengthen browser E2E instructions and report evidence for real UI interaction, concrete drivers, UI-adjacent risk paths, and destructive-flow safety.

# 3. Simplify and design-verify workflow surfaces

## Standalone skills and commands

- [x] 3.1 Add the `/sp:simplify` skill and command templates with Claude Code 2.1.220's two-phase cleanup flow, portable parallel-agent support, and its closing summary contract.
- [x] 3.2 Add the `/sp:design-verify` skill and command templates with UI-scope detection, visual `DESIGN.md` discovery, runtime evidence, explicit numbered steps, result states, and actionable report format.
- [x] 3.3 Register `simplify` and `design-verify` in template exports, skill/command generation, profile workflow lists, init/update/migration maps, drift detection, command metadata, and tool detection without adding a `code-review` identifier.
- [x] 3.4 Add registry, generation, initialization, profile-sync, and tool-adapter tests proving both commands are emitted with `/sp:` names across supported adapters and are removable when deselected.

# 4. Integration, documentation, and full validation

## User-facing behavior and regression safety

- [x] 4.1 Update command/workflow documentation to distinguish proposal `review`, host-native final code review, `/sp:simplify`, enhanced `/sp:verify`, and `/sp:design-verify`; document that standalone selection is optional while apply gates are mandatory.
- [x] 4.2 Perform final cross-unit review of generated output and all registries, confirm no native command collision or generated `code-review` surface, then update parity hashes/snapshots.
- [x] 4.3 Run focused workflow, registry, init/update, and documentation tests, then `pnpm run build`, `pnpm run lint`, and the full test suite; record quality-gate and platform-relevant evidence in `test-plan.md`.
- [x] 4.4 Re-run final integration validation and record the delegated final-gate evidence after Tasks 1.4 and 2.4.
