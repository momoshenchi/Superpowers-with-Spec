## Why

The current final-quality workflow restarts all four gates after any repair, which is unnecessarily expensive and does not distinguish a critical code-review finding from a blocked prerequisite. Bounded, gate-local retries make completion behavior predictable while preserving fresh evidence and independent review.

## What Changes

- Define `P0` as the final-quality equivalent of the existing Verify `CRITICAL` severity; keep `BLOCKER` as an orthogonal missing-prerequisite state rather than treating it as P1.
- Change host-native final code review to repair all resolvable findings in a round, then use a fresh code-review subagent for another round only when that round contained a P0. Permit at most four rounds; a P0 still present in round four fails the gate.
- Replace the global “restart from code review after every code edit” rule with bounded retry entry points: simplify repair proceeds to Verify; Verify repair reruns Verify; design-verification repair reruns design-verify. Each affected retry sequence is capped at four rounds and uses fresh subagents.
- Preserve immediate pause for `BLOCKER`, durable per-round evidence, canonical non-visual verification before every Verify round, and the existing sequential-gate ordering for an initial pass.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `post-apply-quality-gates`: Define final-gate severities, bounded round counts, retry entry points, fresh-worker requirements, and terminal outcomes.
- `sp-verify-skill`: Define Verify retry behavior, per-round preflight/E2E evidence, and the P0/CRITICAL relationship.
- `sp-simplify-skill`: Define simplify repair handoff to the bounded Verify retry sequence.
- `sp-design-verify-skill`: Define bounded design-verification retry behavior after repair.

## Attachments

None.

## Impact

- Shared final-gate instructions plus `/sp:verify`, `/sp:simplify`, and `/sp:design-verify` workflow templates.
- Final-gate template-contract tests, Test Hardening coverage records, and workflow documentation.
- No new commands, dependencies, generated `code-review` surface, or runtime browser tooling.
