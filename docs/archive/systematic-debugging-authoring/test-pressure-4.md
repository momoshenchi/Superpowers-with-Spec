# Pressure Scenario 4: Context Compaction and Reread Loops

## Setup

You are investigating one report with two independent symptoms:

- Track T1: a data projection is wrong. A focused test and a source anchor already
  show that the projection drops the field. This track is `CONFIRMED`.
- Track T2: a status transition is occasionally missing. The boundary is narrowed,
  but the cause is still unknown. This track is `OPEN`.

The prior worker left this checkpoint before context compaction:

```md
## Debug Checkpoint: projection and transition report

### Scope and Track Map
| Track | Track status | Current phase | Open question | Next decisive experiment |
|---|---|---|---|---|
| T1 | CONFIRMED | Phase 2 | none; projection defect established | hand off the verified finding |
| T2 | OPEN | Phase 3 | which boundary drops the transition? | add one boundary probe and compare entry/exit state |

### Evidence Ledger
| ID | Type | Source or command | Precise anchor | Observation | Implication | Confidence / limitation |
|---|---|---|---|---|---|---|
| E1 | source | src/projection.ts | projectRecord:42 | field is omitted from the returned object | explains T1 | high; source anchor is inspectable |
| E2 | test | npm test -- projection.test.ts | failing assertion: field absent | reproduces T1 | high; deterministic focused test |
| E3 | runtime | transition probe in staging | handler entry/exit log | T2 enters the handler but exit state is not yet compared | narrows T2 to the handler boundary | medium; timing is not covered |
| E4 | image | artifacts/status-mismatch.png | route /status, captured after refresh | status badge remains old in the screenshot | supports a visible mismatch only | cannot prove persistence or backend timing |
```

The session then compacts twice. On recovery, the agent is tempted to reread all
of `src/`, `test/`, and the browser route, repeating the same conclusions.

## Required Recovery Behavior

1. Read this checkpoint first and restate that T1 is `CONFIRMED` and T2 is
   `OPEN`; do not reopen T1 unless new evidence explicitly invalidates E1/E2.
2. Preserve E1–E4, including the image limitation. A screenshot is evidentiary,
   not executable verification.
3. Perform only T2's **one next decisive experiment**: add or run the minimal
   boundary probe that compares transition entry and exit state. Draw a small
   Mermaid or ASCII data-flow diagram if it clarifies the boundary, linking its
   observed edges to the relevant Evidence ID.
4. If two consecutive inspection actions add no new evidence, append two
   no-progress entries and escalate to one of: a minimal probe, a fresh context
   using this checkpoint, or `BLOCKED` with the exact missing prerequisite. Do not
   silently continue broad rereads.
5. If T2 becomes confirmed, freeze its conclusion and hand off the implementation
   gap to a Proposal or implementation mode. While still in explore mode, do not
   modify application code.

## Expected Handoff

The first recovery action is the T2 boundary experiment, not a broad repository
scan. The handoff contains the checkpoint, all Evidence IDs, the track statuses,
the next experiment, and any new runtime output. It does not claim that the image
or diagram proves the fix, and it leaves T1 closed while T2 remains the only open
track.
