## ADDED Requirements

### Requirement: Investigations SHALL maintain independent track state

The debugging guidance SHALL require an agent to split materially different symptoms or causal questions into independent investigation tracks. Each track SHALL record its current phase, track status, facts, hypotheses, evidence IDs, and one next decisive experiment. Track statuses SHALL be `OPEN`, `CONFIRMED`, `BLOCKED`, or `HANDED_OFF`; hypothesis statuses SHALL be `PROPOSED`, `TESTING`, `CONFIRMED`, or `REFUTED`. Closing one track SHALL not keep it globally open because another track remains unresolved.

#### Scenario: One report contains two independent symptoms

- **WHEN** a report contains a confirmed data-projection defect and a separate unresolved status-transition defect
- **THEN** the agent SHALL create two tracks
- **AND** it SHALL mark the confirmed track `CONFIRMED` with its evidence and stop rereading that path unless new evidence invalidates it
- **AND** it SHALL keep the unresolved track `OPEN` with one next decisive experiment

#### Scenario: A hypothesis is disproved

- **WHEN** the decisive experiment contradicts the track's hypothesis
- **THEN** the agent SHALL mark that hypothesis `REFUTED` while leaving the track `OPEN` unless the track is independently blocked or handed off
- **AND** it SHALL record the observation that refuted it before forming a replacement hypothesis

### Requirement: A Debug Checkpoint SHALL preserve evidence-rich investigation state

When the checkpoint protocol is activated by a multi-turn investigation, a context compaction, a fresh-worker handoff, or a detected reread loop, the agent SHALL emit a structured Debug Checkpoint. Once activated, the checkpoint SHALL be updated after a decisive experiment, a phase close, and before a context handoff. A short one-turn investigation without those triggers MAY omit it. The checkpoint SHALL include `Scope and Track Map`, `Current Phase and Exit Criteria`, `Facts and Decisions`, `Evidence Ledger`, `Hypotheses`, `Verification`, `Reread Budget and No-Progress Log`, and `Handoff / Next Action` sections.

#### Scenario: Checkpoint records code and test evidence

- **WHEN** an agent has inspected source code and run a focused test
- **THEN** the Evidence Ledger SHALL give each item a stable ID, evidence type, source path or command, precise symbol/line or output anchor, observed result, implication, and confidence or limitation
- **AND** the checkpoint SHALL distinguish observed facts from inferences and hypotheses

#### Scenario: Checkpoint records runtime and log evidence

- **WHEN** an agent uses a runtime probe, database fixture, browser trace, or log to investigate a boundary
- **THEN** the checkpoint SHALL record the entry/exit observation for the boundary, the command or environment, the relevant output/artifact, and whether the evidence is reproducible
- **AND** it SHALL not summarize a probe only as “checked” or “works” without an inspectable anchor

### Requirement: Checkpoints SHALL support visual and diagram evidence without overstating proof

The guidance SHALL allow a checkpoint to include image references, image observations, ASCII diagrams, Mermaid flowcharts, data-flow diagrams, state diagrams, and comparison tables. Each visual item SHALL include a caption, source or capture context, observed facts, expected-versus-actual interpretation when applicable, and limitations or uncertainty. Visual evidence SHALL be labeled as illustrative or evidentiary and SHALL not substitute for executable verification.

#### Scenario: Screenshot shows a state mismatch

- **WHEN** a screenshot or local image is used to analyze a UI state
- **THEN** the checkpoint SHALL reference the image with a renderable path or attachment, identify the route/state and capture context, and record the visible facts separately from the inferred cause
- **AND** it SHALL name what the image cannot establish, such as backend persistence or timing outside the capture

#### Scenario: Diagram explains a multi-component path

- **WHEN** a failure crosses multiple components or state transitions
- **THEN** the checkpoint SHALL include a flow/data/state diagram with labeled observed boundaries and inferred edges
- **AND** the diagram SHALL link its nodes or edges to Evidence Ledger IDs where code or runtime evidence exists

### Requirement: Debugging phases SHALL have explicit per-track exit criteria

The guidance SHALL define phase completion per track. Phase 1 SHALL require a reproducible or explicitly blocked reproduction, a narrowed failing boundary, and recorded evidence. Phase 2 SHALL require a working-versus-broken comparison and a prioritized difference. Phase 3 SHALL require one stated hypothesis and one minimal decisive test. Phase 4 SHALL require a failing test before an implementation fix and verification evidence after the fix. An unresolved sibling track SHALL not prevent a completed track from closing.

#### Scenario: Phase 1 has insufficient runtime access

- **WHEN** the agent cannot reproduce a track because a required environment, credential, or runtime is unavailable
- **THEN** the agent SHALL mark the track `BLOCKED`
- **AND** it SHALL record the exact missing prerequisite and the smallest input needed to continue
- **AND** it SHALL not continue broad source rereads while waiting for that prerequisite

#### Scenario: Phase 2 finds a confirmed difference

- **WHEN** the working-versus-broken comparison identifies a difference that a minimal experiment confirms
- **THEN** the agent SHALL freeze the confirmed difference as a root-cause finding for that track
- **AND** it SHALL hand off to implementation or proposal work without reopening Phase 1 for the same evidence

### Requirement: Context recovery SHALL use the checkpoint as the source of truth

Before a context-compaction recovery or fresh-worker handoff, the agent SHALL create or update the checkpoint. A recovering agent SHALL read the checkpoint first, use its evidence IDs and exact anchors, and perform only the recorded next experiment or a narrowly justified new read. It SHALL not restart a broad repository scan by default.

#### Scenario: Fresh context resumes after compaction

- **WHEN** the prior context contains a completed checkpoint and the investigation resumes in a fresh context
- **THEN** the recovering agent SHALL restate the open tracks and their statuses from the checkpoint
- **AND** it SHALL preserve confirmed and refuted conclusions
- **AND** its first investigation action SHALL be the checkpoint's next decisive experiment or an explicit correction supported by new evidence

#### Scenario: Checkpoint contains a local Windows path

- **WHEN** a checkpoint references source, test, or image files on Windows
- **THEN** the guidance SHALL preserve the path as a displayable path without assuming POSIX separators
- **AND** any generated tooling or test assertion handling the path SHALL use platform-safe path resolution rather than hardcoded slash concatenation

### Requirement: Investigation loops SHALL have bounded rereads and no-progress escalation

The guidance SHALL require the agent to record why a previously inspected file or evidence source is being reread. A reread is allowed only when the source changed, the anchor is new, or the active hypothesis requires a new slice. After two consecutive investigation actions that add no new evidence, the agent SHALL checkpoint and escalate to a minimal probe, a fresh context, or `BLOCKED`; it SHALL not silently continue the same broad loop.

#### Scenario: Repeated rereads produce no new fact

- **WHEN** two consecutive inspection actions only restate evidence already present in the checkpoint
- **THEN** the agent SHALL append a no-progress entry
- **AND** it SHALL stop broad rereading and select one escalation path
- **AND** the checkpoint SHALL name the selected path and its reason

#### Scenario: A source file changed during investigation

- **WHEN** a file previously inspected has changed or a new line/symbol is required by the current hypothesis
- **THEN** the agent MAY reread only the changed or newly relevant slice
- **AND** it SHALL record the new revision or anchor and the reason in the Reread Budget

### Requirement: Explore-mode checkpoints SHALL remain read-only

Explore-mode guidance SHALL permit creating or updating a Debug Checkpoint and its diagrams/evidence, but SHALL prohibit application-code implementation. When a track is confirmed and implementation is the next action, the agent SHALL hand off to a Proposal or the selected implementation mode rather than patching product code inside explore mode.

#### Scenario: Exploration reaches a confirmed root cause

- **WHEN** a track has a confirmed root cause and requires a code change
- **THEN** the agent SHALL record the root cause and verification gap in the checkpoint
- **AND** it SHALL offer or create the appropriate Proposal boundary
- **AND** it SHALL not modify application code while remaining in explore mode

## Attachments

No attachments. The scenarios intentionally cover code, test, runtime, image, diagram, path, compaction, and no-progress evidence directly.
