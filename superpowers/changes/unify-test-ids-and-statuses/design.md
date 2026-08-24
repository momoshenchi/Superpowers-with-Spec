## Context

Superpowers records verification intent and evidence in `test-plan.md`. Multiple generations of guidance introduced overlapping status words and ID schemes. This change unifies writer-facing vocabulary while preserving reader compatibility.

## Current system

Apply readiness walks Status columns in `test-plan.md` (`isTestPlanComplete` in `src/commands/workflow/instructions.ts`) and treats a fixed alias set as complete. Final Quality Gates use a separate parser (`GateOutcome`) with `planned|passed|failed|blocked|not applicable`. The schema template still teaches `covered`/`failing` for case tables and a different set for Manual/gates. Remediations use `## R1`, colliding with requirement object `R1`. Manual Coverage has no ID column.

### Relationship to existing tech

| Existing capability | Relation | Pointer | Note |
|---|---|---|---|
| test-plan template | extend | `schemas/spec-driven/templates/test-plan.md` | Primary writer contract |
| schema init scaffold | extend | `src/commands/schema.ts` test-plan case | Must stay aligned with template |
| Apply hardening guidance | extend | `apply-change.ts`, `instructions.ts` | Normative strings only |
| Gate parser | reuse | `test-plan-gates.ts` | Already aligned |
| Completeness parser | reuse | `COMPLETE_TEST_PLAN_STATUSES` | Do not tighten |
| Remediations template | extend | `schemas/spec-driven/templates/remediations.md` | RM-n |
| full-qa-test | extend | `skills/full-qa-test/SKILL.md` | Document MC IDs + status |

## Goals / Non-Goals

**Goals:**
- One normative status vocabulary for executable and dimension-summary rows
- Stable Manual and remediation IDs without colliding with requirement `R#`
- Keep legacy alias acceptance in completeness parsing

**Non-Goals:**
- Rewriting historical change `test-plan.md` / `remediations.md` bodies
- Tightening or removing aliases from `COMPLETE_TEST_PLAN_STATUSES`
- Changing Final Quality Gates gate names or round semantics

## Decisions

### 1. Dimension Summary status after dropping covered

**Problem:** What replaces `covered` on Dimension Coverage Summary?

**User selection:** A — dimension-level Status also uses `planned` / `passed` / `not applicable`

| Option | Writer clarity | Alignment with cases | Cost |
|---|---|---|---|
| A. `planned`/`passed`/`not applicable` | High | Same vocabulary | Agents must learn dimension `passed` means rollup |
| B. Remove Status column | Medium | Derived only | Harder human glance |
| C. Only `not applicable` or blank | Low | Ambiguous complete | Easy to leave blank forever |

**Choice:** A

**Trade-offs / cost:** Dimension `passed` means “required child cases complete,” not a separately executed suite.

### 2. Parser compatibility (user-confirmed)

**Problem:** Whether to reject legacy aliases on read.

**User selection:** Do not tighten the parser; keep compatibility with old aliases including `covered`.

**Choice:** Keep `COMPLETE_TEST_PLAN_STATUSES` as-is; update writer guidance only.

### 3. Agent-owned — Manual ID shape

**Choice:** Prefer `MC-R<object>-<seq>`; allow `MC-<seq>` when no object applies.

**Why:** Matches `TC-R…` discoverability; object-less manual checks still need an ID.

### Closed implication scan (agent-owned)

- **Actor / ownership:** Writers use normative vocabulary; parsers remain permissive.
- **Empty / fail-closed:** Empty/placeholder stay incomplete; unknown non-alias values stay incomplete.
- **Lifecycle:** `planned` → `passed`|`failed`|`blocked`; scope-out → `not applicable`.
- **Compatibility:** Read accepts `covered`/`failing`/etc.; write teaches new vocabulary.
- **Data shape:** Manual table gains `ID`; remediations `## RM-n`.
- **Product forks:** N/A — workflow contract only.

## Risks / Trade-offs

- Agents may still emit `covered` from memory → mitigated by template placeholders and apply text.
- Dimension `passed` vs case `passed` ambiguity → documented in template prose.

## Migration Plan

- New templates and generated guidance only.
- Existing plans keep working via alias-compatible readers.
- No forced rewrite of active/archived changes.

## Contracts

- Normative Status (writers): `planned | passed | failed | blocked | not applicable`
- Dimension Summary recommended: `planned | passed | not applicable`
- Case ID: `TC-R<object>-D<dimension>-<seq>`
- Manual ID: `MC-R<object>-<seq>` or `MC-<seq>`
- Remediation ID: `RM-<n>`
- Complete (readers): existing `COMPLETE_TEST_PLAN_STATUSES` unchanged
- Gate outcomes: unchanged `GateOutcome`

## Invariants

- I1: New schema test-plan template MUST NOT list `covered` or `failing` as Status placeholders.
- I2: `COMPLETE_TEST_PLAN_STATUSES` MUST continue to include `covered`.
- I3: Remediations template sample heading MUST match `RM-` prefix, not bare `R1` as remediation id.
- I4: Manual Coverage header MUST include an `ID` column.

## Attachments

N/A — no change-local attachments.

## Open Questions

None — decisions closed with the user.
