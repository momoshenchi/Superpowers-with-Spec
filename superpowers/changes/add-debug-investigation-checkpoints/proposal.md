## Why

Long-running read-only debugging can repeatedly reread the same code after context compaction because facts, evidence, hypotheses, and phase completion are not preserved in a durable, structured handoff. The existing debugging phases describe the right intent but do not give an agent a bounded recovery protocol, per-issue state, or a stopping rule when investigation stops producing new evidence.

## What Changes

- Add a reusable Debug Checkpoint protocol for multi-step investigations and context-compaction recovery.
- Make checkpoint state track independent issue tracks instead of one global debugging phase.
- Require durable capture of code evidence, test/runtime evidence, hypotheses, ruled-out explanations, decisions, and exactly one next decisive experiment per open track.
- Support rich evidence attachments, including source anchors, command/output excerpts, screenshots or image references, ASCII diagrams, Mermaid flowcharts, and data-flow diagrams with captions and uncertainty notes.
- Add phase exit criteria, bounded reread/no-progress rules, and fresh-context handoff guidance so agents stop looping instead of restarting broad exploration.
- Add guidance-contract tests covering checkpoint structure, evidence preservation, visual evidence, per-track closure, compaction recovery, and no-progress escalation.

## Capabilities

### New Capabilities

- `debug-investigation-checkpoints`: Define durable, evidence-rich checkpoints and bounded recovery behavior for long-running debugging and exploration.

### Modified Capabilities

<!-- No existing product capability requirements change; this is a reusable process/skill capability. -->

## Attachments

<!-- No attachments. -->

## Impact

- `skills/systematic-debugging/SKILL.md` — add per-track phase gates, checkpoint schema, evidence/visualization rules, and compaction recovery.
- `src/core/templates/workflows/explore.ts` — add bounded investigation and checkpoint handoff guidance to both generated explore surfaces without turning explore mode into implementation mode.
- `skills/using-superpowers/SKILL.md` — recognize repeated broad rereads during diagnosis as a context-boundary signal.
- Guidance and parity tests for static skills and generated workflow content, as applicable.
- No product runtime, public API, persisted application data, or user-facing application behavior changes.
