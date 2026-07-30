## Context

<!-- Background, motivation, and constraints for this change -->

## Current system

<!-- Technical landscape slice for THIS change only. Short is fine.
     Describe the starting point implementers must understand—modules,
     data flow, entry points—not a full system encyclopedia. -->

### Relationship to existing tech

<!-- How this work hangs off what already exists.
     Relations: reuse | extend | replace | boundary | retire
     Always include a Pointer (path, symbol, command, or doc section). -->

| Existing capability | Relation | Pointer | Note |
|---|---|---|---|
| <!-- e.g. auth middleware --> | <!-- reuse / extend / replace / boundary / retire --> | <!-- path, symbol, command, or section --> | <!-- optional --> |

## Goals / Non-Goals

**Goals:**
<!-- What this design aims to achieve -->

**Non-Goals:**
<!-- What is explicitly out of scope -->

## Decisions

<!-- Key design decisions and rationale.

     Major decisions (new source of truth, cross-subsystem, security/billing/
     idempotency/recovery, irreversible migration, important dependency, or
     user-declared module-scale work): record ≥3 options in a comparison
     table, then state the choice and trade-offs. Explore should have
     diverged on these options; design converges and records the choice.

     Minor decisions (local naming, single-helper fix, file placement):
     short rationale only—do not invent three fake alternatives. -->

### 1. <!-- Major decision name -->

**Problem:** <!-- what must be chosen -->

<!-- Keep this comparison table for major decisions only. For minor decisions, delete the table and use section 2 style. -->

| Option | <!-- dimension --> | <!-- dimension --> | <!-- dimension --> |
|---|---|---|---|
| A. <!-- ... --> | | | |
| B. <!-- ... --> | | | |
| C. <!-- ... --> | | | |

**Choice:** <!-- A/B/C and why -->

**Trade-offs / cost:** <!-- what we accept -->

### 2. <!-- Minor decision name -->

<!-- Local naming, single-helper fix, or file placement: short rationale only—no three-option table. -->

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
