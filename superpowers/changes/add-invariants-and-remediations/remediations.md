# Remediations

## R1 — Code-review workers must probe remediations.md

**Meta:** code review #1 · **P1** · **resolved**

### Finding

FQG remediations rules bind **coordinator writes**, but do not require **code-review workers** to probe/read an existing `remediations.md` on retry rounds. Verify already has the probe/read path; code-review retries do not.

### Root cause

The Remediations paragraph was written around create/append ownership. Worker **consumption** was only spelled out in `verify-change`, which left a gap against `change-remediations` (“code review **or** Verify SHALL probe”).

### Solutions (compare ≥2)

| Solution | Approach | Pros | Cons |
|---|---|---|---|
| A. | Shared FQG Remediations paragraph: both **code-review** and **Verify** workers MUST probe/read | Single source; matches Verify style | Slightly longer FQG block |
| B. | Duplicate probe instructions only under code-review step 1 | Localized edit | Duplicates Verify; easy to drift |
| C. | Rely on Verify alone; weaken the spec | Less text | Contradicts accepted remediations requirement |

### Choice and rationale (重点)

**Choice: A**

- Wins because Apply already embeds one FQG Remediations contract next to Repair ownership; extending that paragraph keeps code-review and Verify aligned without a second copy.
- B loses on drift: step-1-only prose will diverge from Verify over time.
- C loses on requirement: the capability explicitly covers both gates.

### Fix

Extend `getFinalQualityGateInstructions()` Remediations paragraph; assert in `invariants-remediations.test.ts`; regenerate apply skill projections; refresh parity hashes.

### Guard and evidence

- **Guard:** `invariants-remediations.test.ts` requires FQG/Apply text to say code-review workers MUST probe/read `remediations.md`.
- **Evidence:** `pnpm exec vitest run test/core/templates/invariants-remediations.test.ts` → 5/5; FQG paragraph includes code-review + Verify probe wording.

## R2 — Open remediation status must not imply closed findings

**Meta:** code review #1 · **P2** · **resolved**

### Finding

Design Contracts say Status **`open`** blocks treating that finding as closed for gate success, but Verify/FQG text only called out **resolved P0 without Guard**.

### Root cause

`Contracts.States` for open remediations was never fully transferred into the Verify remediations bullets / FQG Remediations paragraph.

### Solutions (compare ≥2)

| Solution | Approach | Pros | Cons |
|---|---|---|---|
| A. | Add explicit open-status incomplete-evidence rule to Verify (+ FQG) | Preserves design Contracts; concrete Verify check | Slightly more instruction text |
| B. | Drop open-state semantics from design | Less text | Weakens the remediations artifact |
| C. | Rely on coordinator judgment only | No new wording | Reintroduces blind-patch risk this change targets |

### Choice and rationale (重点)

**Choice: A**

- Wins because the open-state rule is already normative in design; Verify/FQG must make it executable for workers.
- B loses by deleting a useful fail-closed signal.
- C loses by leaving closure to unrecorded judgment.

### Fix

`verify-change` Remediations bullets + FQG one-liner: `open` must not count as closing the finding for gate success.

### Guard and evidence

- **Guard:** `invariants-remediations.test.ts` asserts open-status wording in FQG/Apply and Verify.
- **Evidence:** focused suite 26/26; open-status strings present.

## R3 — FQG MUST field list include Finding

**Meta:** code review #1 · **P2** · **resolved**

### Finding

The FQG “MUST include” list omitted **Finding**, even though the remediations template and design already require it.

### Root cause

The author listed repair-analysis fields (Root cause, Solutions, …) and skipped the finding-identity row that the template already defines.

### Solutions (compare ≥2)

| Solution | Approach | Pros | Cons |
|---|---|---|---|
| A. | Add Finding (gate/round, severity, summary) to the MUST list | Aligns FQG with template + design | One more required field in prose |
| B. | Remove Finding from the template | Shorter template | Loses audit trail for what was repaired |
| C. | Leave Finding implicit | No edit | Fields silently diverge across sources |

### Choice and rationale (重点)

**Choice: A**

- Wins because template and design already treat Finding as required substance; the MUST list should match.
- B loses the audit trail of which gate finding was repaired.
- C loses by allowing sources to drift.

### Fix

`final-quality-gates.ts` MUST list now includes Finding (gate/round, severity, summary).

### Guard and evidence

- **Guard:** FQG/Apply assert `Finding` in `invariants-remediations.test.ts`.
- **Evidence:** focused suite 26/26.
