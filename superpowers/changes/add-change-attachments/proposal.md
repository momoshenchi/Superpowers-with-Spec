## Why

Superpowers change artifacts are currently text-only in practice, which makes UI intent and other reference-heavy context fragile. A fixed per-change attachments directory gives proposals and downstream artifacts a stable place to reference images and supporting text without introducing a new required workflow artifact.

## What Changes

- Add a standard `attachments/` directory under each change directory:
  - `superpowers/changes/<change>/attachments/`
- Allow `proposal.md`, `design.md`, `specs/<capability>/spec.md`, and `execution-plan.md` to reference files in `attachments/`.
- Treat attachments as supporting context, not as standalone completion-tracked artifacts.
- Document how artifact authors should explain referenced attachments:
  - what the attachment is
  - why it matters
  - which parts are normative versus illustrative
  - which artifact or requirement it supports
- Support image, text, and CSV attachments as the initial convention, including screenshots, mockups, visual references, notes, tabular context, and externally provided requirement context saved as files.
- Do not support PDF attachments in the initial version.
- Keep the workflow simple:
  - no dedicated UI brief artifact
  - no attachment validation command
  - no required attachment manifest in the initial version
  - no warnings or prompts for missing attachment files
  - no automatic binary parsing requirement beyond making referenced files discoverable to agents

## Capabilities

### New Capabilities

- `change-attachments`: Defines the fixed per-change `attachments/` directory convention and the rules for referencing attachments from proposal, design, spec, and execution-plan artifacts.

### Modified Capabilities

- `cli-artifact-workflow`: Artifact instructions and apply context should make attachment references usable by agents, including guidance to inspect referenced files when generating or applying a change.

## Impact

- Default schema instructions and templates may need updates so generated artifacts know how to reference `attachments/`.
- Workflow skill and slash-command text may need updates so propose, continue, and apply flows preserve and consume attachment context.
- Apply instructions may need to include or call out referenced attachments so implementation agents do not miss visual or supporting context.
- Tests should cover the convention without requiring attachments to count as completion-tracked artifacts.
