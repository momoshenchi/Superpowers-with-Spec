## Why

`/sp:propose` currently moves from a request to change creation with only narrow clarification prompts, so ambiguous scope, acceptance criteria, and high-impact technical choices can surface after artifacts already exist. Propose needs a proportional understanding gate that reduces rework while preserving its fast path for clear, low-risk requests.

## What Changes

- Add a read-only preflight to Propose that inspects environment facts before asking the user to decide anything.
- Add an adaptive interview that asks only about unresolved, high-impact product or technical decisions, one question at a time, with a recommendation and alternatives.
- Allow the interview to contain zero questions when the request is sufficiently clear and no consequential decision is open.
- Prevent change creation and artifact writes until the user confirms the final understanding summary.
- Add a three-state final gate: confirm and create, request changes, or stop without creating the change.
- Record confirmed product decisions in `proposal.md` and high-impact technical decisions, options, and trade-offs in `design.md`; do not add a separate interview artifact.
- Preserve the existing artifact-generation and proposal-review flow after confirmation.
- Add focused template, generation-parity, and workflow documentation coverage for the new interaction contract.

## Capabilities

### New Capabilities

- `propose-interview-gate`: Adaptive, decision-focused preflight and explicit confirmation behavior for Propose.

### Modified Capabilities

<!-- No existing spec-level capability requirements are being modified directly. -->

## Attachments

<!-- No supporting attachments are required. -->

## Impact

- Generated Propose skill and slash-command instructions in `src/core/templates/workflows/propose.ts`.
- Template parity and generated-artifact tests, including the existing exact-content hash expectations.
- Propose workflow documentation and any generated guidance that describes the quick path.
- No new CLI flags, schema artifacts, runtime persistence, or external dependencies are required.
