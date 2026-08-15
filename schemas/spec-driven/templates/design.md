## Context

<!-- Background, motivation, and constraints for this change -->

## Current system

<!-- Teach a new engineer the relevant current design—not a file dump.
     Explain: what this subsystem does, entry points, control/data flow,
     current behavior this change touches, and the gap or defect.
     A table or bullet list of file paths is not Current system.
     Pointers go in Relationship below. Short is fine only when the
     prose still explains behavior. A mermaid/ASCII diagram is welcome
     when it clarifies flow. -->

### Relationship to existing tech

<!-- How this work hangs off what already exists.
     Relations: reuse | extend | replace | boundary | retire
     Always include a Pointer (path, symbol, command, or doc section).
     This table supplements Current system prose; it does not replace it. -->

| Existing capability | Relation | Pointer | Note |
|---|---|---|---|
| <!-- e.g. auth middleware --> | <!-- reuse / extend / replace / boundary / retire --> | <!-- path, symbol, command, or section --> | <!-- optional --> |

## Goals / Non-Goals

**Goals:**
<!-- What this design aims to achieve -->

**Non-Goals:**
<!-- What is explicitly out of scope -->

## Decisions

<!-- Record each consequential technical choice.

     User-confirmed selection: include an option comparison table ONLY
     when the user actually chose among those options (explore, propose
     interview, or another explicit confirmation), including when the
     user delegated to the stated recommendation after seeing the options.
     Record the exact options the user saw, the user's choice, and
     trade-offs. Do not add options the user never saw.

     Agent-owned implementation: write problem + approach + rationale
     only. Do not invent A/B/C. Do not present a model-inferred result
     as a user Choice. -->

### 1. <!-- User-confirmed decision (delete this section if the user did not choose among options) -->

**Problem:** <!-- what the user was asked to choose -->

**User selection:** <!-- quote or paraphrase the user's choice, or that they delegated after seeing these options -->

| Option | <!-- dimension --> | <!-- dimension --> | <!-- dimension --> |
|---|---|---|---|
| A. <!-- option the user saw --> | | | |
| B. <!-- option the user saw --> | | | |

**Choice:** <!-- the user's selection -->

**Trade-offs / cost:** <!-- what we accept -->

### 2. <!-- Agent-owned implementation decision -->

**Problem:** <!-- what must be decided in implementation -->

**Approach:** <!-- the derived approach -->

**Rationale:** <!-- why this is the local default; no invented alternatives -->

## Contracts

<!-- Stable anchors for API/CLI fields, states, and errors this change
     touches. If the change does not alter any of those surfaces, write:
     N/A — no API/state/error surface change -->

### API / CLI

<!-- Surface, fields, meaning. Omit or N/A if none. -->

### States

<!-- State machine or lifecycle changes. Omit or N/A if none. -->

### Errors

<!-- Error codes, empty/deny behavior. Omit or N/A if none. -->

## Attachments

<!-- Optional.  Explain what each file is, why it matters, and whether it is normative, illustrative, or background context.
Diagrams and mockups for this change belong under attachments/, not pasted as the full visual system. -->

## Risks / Trade-offs

<!-- Known risks and trade-offs. Format: [Risk] → Mitigation -->

## Migration Plan

<!-- Steps to deploy, rollback strategy (if applicable) -->

## Open Questions

<!-- Outstanding decisions or unknowns to resolve -->
