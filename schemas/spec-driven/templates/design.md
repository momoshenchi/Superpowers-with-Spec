## Context

<!-- Background, motivation, and constraints for this change -->

## Current system

<!-- Teach a new engineer the relevant current design—not a file dump.
     Explain: what this subsystem does, entry points, control/data flow,
     current behavior this change touches, and the gap or defect.
     A table or bullet list of file paths is not Current system, 你必须添加充足的解释性文字.
     Short is fine only when the prose still explains behavior. A mermaid/ASCII diagram is welcome
     when it clarifies flow.
     Do not add required extra headings. Authors MAY add extra subsections
     (target flow after the change, diagrams) when they add implementable detail. -->

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
     Do not present a model-inferred result as a user Choice.

     Agent-owned implementation: MAY include an A/B/C comparison. The
     final Choice MUST be a strict, detailed analysis of why that option
     wins and why the others lose—not a one-line ritual.
     Do not present a model-inferred result as a user Choice.
     After the choice, add implementable detail under this heading:
     mapping rules, fail-closed paths, ownership, and a worked example.
     Authors MAY add extra subsections. Do not add required extra headings. -->

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

| Option | <!-- dimension --> | <!-- dimension --> | <!-- dimension --> |
|---|---|---|---|
| A. <!-- ... --> | | | |
| B. <!-- ... --> | | | |
| C. <!-- ... --> | | | |

**Choice:** <!-- selected option -->

**Rationale:** <!-- strict, detailed analysis: why this option wins, why A/B/C losers fail the constraints, and what cost we accept. A one-line "pick C" is not enough. Then write mapping rules and a worked example so an implementer need not guess. -->

## Contracts

<!-- Stable anchors for API/CLI fields, states, and errors this change
     touches. If the change does not alter any of those surfaces, write:
     N/A — no API/state/error surface change
     When a surface changes, include implementable detail (mapping rules,
     a worked example) under these headings. Authors MAY add extra subsections.
     Do not add required extra headings. -->

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
