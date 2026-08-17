## Context

This change tightens two quality levers in the Superpowers artifact workflow: (1) required design-time invariants so “always true” properties are explicit before Apply, and (2) a durable `remediations.md` so Final Quality Gates repairs stop being opaque one-shot patches. It touches schema templates/instructions and generated Apply / change-review / Verify workflow text—the same convention surface used by Current system / Contracts—not CLI runtime validation of section presence.

## Current system

Today, change-local `design.md` (package template under `schemas/spec-driven/templates/design.md`, mirrored in `src/commands/schema.ts` fallbacks) requires Context, Current system, Decisions, and Contracts. Specs and design instruction explicitly tell authors **not** to invent mandatory top-level sections such as Invariants. Cross-path “must never break” properties therefore live only in prose Risks or informal notes, and Verify’s coherence check looks at design decisions generally without an invariants checklist.

Final Quality Gates (Apply after Test Hardening) run code review → Simplify → Verify → Design Verify. Repair ownership is coordinator-led: workers report findings; the coordinator repairs accepted resolvable P0/P1 and retries. Outcomes are summarized in `test-plan.md` under `## Final Quality Gates`, but that table records gate outcome and evidence—not a structured comparison of repair options, root cause, or regression guards. The next fresh gate worker therefore often re-reads only the diff and prior gate summary, without a normative repair playbook. `applyRequires` still ends at `test-plan`; no remediations artifact exists.

The gap: invariants are underspecified upstream; accepted gate repairs are underspecified mid-stream—both raise residual bug risk after a “green” Apply.

### Relationship to existing tech

| Existing capability | Relation | Pointer | Note |
|---|---|---|---|
| Design template + Contracts | extend | `schemas/spec-driven/templates/design.md` `## Contracts` | Invariants sit after Contracts as sibling required section |
| Design artifact instruction | extend | `schemas/spec-driven/schema.yaml` design `instruction` | Today forbids inventing Invariants; this change reverses that for one formal section |
| Final Quality Gates / Apply | extend | `src/core/templates/workflows/final-quality-gates.ts` `getFinalQualityGateInstructions()` (Repair ownership); `apply-change.ts` interpolates it | Create/append remediations before implementation edits for accepted code-review/Verify P0/P1 only |
| Verify coherence | extend | `superpowers/specs/sp-verify-skill/spec.md` Coherence Verification; `verify-change.ts` | Read Invariants + remediations on applicable rounds |
| Change review design checks | extend | `src/core/templates/workflows/change-review.ts` Design convention checks | Require `## Invariants` present (N/A OK); do not require remediations at propose time |
| test-plan Final Quality Gates table | extend | Apply completion output / Harden records | Optional `Remediation` → `R#` link column; long-form stays in remediations.md |
| Manual Coverage change | boundary | `superpowers/changes/execute-manual-coverage/` | Orthogonal; do not merge |

## Goals / Non-Goals

**Goals:**

- Make `## Invariants` a first-class, always-present design section (content or explicit N/A).
- Make accepted P0/P1 gate repairs produce `remediations.md` entries with ≥2 candidate fixes, chosen optimal fix + rationale, root cause, concrete fix, guard, and evidence.
- Feed remediations and non-N/A invariants into subsequent Verify / review rounds.
- Keep propose/apply readiness unblocked when no repairs occurred.

**Non-Goals:**

- Adding `remediations` to `applyRequires` or forcing empty remediations at `/sp:propose`.
- Structural CLI `validate` parsers that fail builds solely for missing Invariants headings (convention + review/Verify guidance first).
- Expanding Final Quality Gates with a fifth gate or restoring per-task full code review.
- Changing Manual Coverage / Deferred Coverage semantics.
- Requiring three fake alternatives for trivial docs-only P1 when two meaningful options exist (minimum is ≥2 distinct approaches).
- Requiring `remediations.md` for Design Verify repairs, for code-review/Verify **P2** findings, or for Simplify-only cleanups (those stay outside this artifact unless a finding is separately accepted as P0/P1 under code review or Verify).

## Decisions

### 1. Remediations lifecycle (user-confirmed)

**Problem:** When must `remediations.md` exist, and how does that interact with apply readiness?

**User selection:** Accept any code review / Verify P0 or P1 and prepare to change code → create/append; if any accepted repair exists, file is required; if zero accepted P0/P1 across the change, allow one-line `N/A — no accepted P0/P1 repairs` **or omit** the file.

| Option | Pros | Cons |
|---|---|---|
| A. Create only on first accepted P0/P1 repair; omit or N/A when none | Low ceremony; matches repair moment | Occasional missing file when readers expect a stub |
| B. Always scaffold empty remediations at propose | Predictable path | Empty files on most changes |
| C. Require remediations in applyRequires | Hard guarantee | Blocks Apply before gates run |

**Choice:** A

**Trade-offs / cost:** Archive/readiness must treat “no file” as equivalent to N/A when Final Gates report no accepted P0/P1 repairs; Apply instructions must state that equivalence explicitly.

### 2. Remediations content shape (user-confirmed)

**Problem:** What must each remediation entry contain so repairs are not blind patches?

**User selection:** Each bug’s resolution methods must be written; prefer multiple methods; select the optimal method and give rationale.

| Option | Dimension: auditability | Dimension: cost | Dimension: false rigor |
|---|---|---|---|
| A. Multi-option (≥2) + Choice + Rationale for every accepted P0 and P1 | High | Medium | Low if options must be meaningful |
| B. Multi-option only for P0; P1 single fix + reason | Medium | Lower | P1 blind patches remain |
| C. Free-form narrative only | Low | Low | High |

**Choice:** A (applies to both P0 and P1)

**Trade-offs / cost:** Docs-only P1 still needs two real approaches (e.g. “edit generated template vs edit fallback string only”)—not padded duplicates.

### 3. Invariants section formality (user-confirmed)

**Problem:** How strictly is Invariants required in the design template?

**User selection:** Formal required section in the template; N/A allowed.

| Option | Pros | Cons |
|---|---|---|
| A. Required heading; N/A line permitted | Consistent review target | Slight template growth |
| B. Recommended only | Flexible | Agents skip |
| C. Required with ≥1 non-N/A invariant always | Strongest | Forces fake invariants |

**Choice:** A

### 4. Schema graph membership for remediations (agent-owned)

**Problem:** Should `remediations.md` be a spec-driven schema artifact node?

| Option | Pros | Cons |
|---|---|---|
| A. Template + Apply/Verify/Review instructions only (not in artifact graph / not applyRequires) | Matches on-demand lifecycle; no forever-ready status noise | `superpowers instructions remediations` unavailable unless wired later |
| B. Optional schema artifact, excluded from applyRequires | Discoverable via status | Always-ready artifact confuses propose loop |
| C. Full artifact in applyRequires | Forced existence | Contradicts user lifecycle |

**Choice:** A

**Rationale:** User lifecycle creates the file at repair time; Final Quality Gates already use instruction-owned sections inside `test-plan.md` without new graph nodes. A checked-in `schemas/spec-driven/templates/remediations.md` gives agents a copy-paste skeleton from Apply text (`Read/copy the remediations template…`) without making propose wait on it. Option B still surfaces a perpetual `ready` artifact that invite premature creation; C violates confirmed lifecycle. Fail-closed: if Apply accepts a P0/P1 and edits code without an `R#` entry, Apply guidance treats that as process failure (must append before edit / before next gate round).

**Mapping rules:**

- Path: `superpowers/changes/<name>/remediations.md` (platform-neutral join of change directory + `remediations.md`)
- Discovery: Apply/Verify/Review workers MUST probe that change-directory path when assessing repairs or retry rounds. Do **not** rely on schema `contextFiles` / artifact-graph membership—the file is intentionally outside `applyRequires` and may be absent from CLI context file lists.
- Scope: only accepted **code review** or **Verify** findings with severity **P0 or P1**. Design Verify findings, P2-only findings, and Simplify cleanups do not require remediations entries.
- Entry IDs: `R1`, `R2`, … stable within the change
- Minimum fields per entry: Finding (gate + severity + summary), Root cause, Options (≥2), Choice, Rationale, Fix (paths/behavior), Guard (test and/or invariant `I#`), Evidence (command + outcome), Status (`open` \| `resolved`)
- P0 cannot move to `resolved` without Guard; P1 should have Guard when behavior changed
- `test-plan.md` Final Quality Gates rows MAY cite `Remediation: R#`

**Worked example:** Verify round 1 reports P0 “invariant I2 unbroken on empty input, but handler returns 500”. Coordinator appends `R1` with options (A) add null guard in parser (B) reject at CLI boundary with typed error (C) widen invariant). Chooses B with rationale (fail-closed at boundary matches Contracts.Errors). Adds failing test, implements, records evidence, marks `resolved`, links Final Gates Verify row to `R1`, then starts Verify round 2 with remediations in contextFiles/read list.

### 5. Invariants content contract (agent-owned)

**Problem:** What makes an Invariants section valid beyond the heading?

| Option | Pros | Cons |
|---|---|---|
| A. Table with ID, statement, how-to-falsify, owner check; or exact N/A line | Reviewable + testable | Slight authoring cost |
| B. Free bullet list of wishes | Easy | Unverifiable |
| C. Must mirror every spec scenario | Over-coupled | Duplicates specs |

**Choice:** A

**Rationale:** Invariants are cross-path constants, not a second spec. Falsifiability + owner check give Verify something to execute; IDs let remediations Guard reference `I#`. Specs remain normative for WHEN/THEN behavior. N/A uses a fixed phrase: `N/A — no cross-path invariants`.

**Placement:** After `## Contracts`, before `## Attachments` (or immediately after Contracts if Attachments absent in a fork)—update section-order tests accordingly.

**Change-review:** Missing `## Invariants` → BLOCKER (content completeness). Present but non-falsifiable bullets with no N/A → WARNING. Auth/money/data-integrity changes with only N/A → WARNING (recommend at least one invariant).

**Schema instruction edit:** Remove “do not invent … Invariants” prohibition; require `## Invariants` as a formal section with N/A allowed. Keep “Do not add required extra headings” for *other* invented mandatories—Invariants becomes an exception listed alongside Contracts.

## Contracts

### API / CLI

N/A — no user-facing CLI flag or command output schema change. Workflow instruction text and Markdown templates change only.

### States

| State | Meaning |
|---|---|
| remediations absent | Equivalent to N/A when no accepted P0/P1 repairs occurred |
| remediations N/A line only | Explicit zero-repair record |
| remediations with `R#` open | Accepted finding not yet resolved; blocks claiming gate success for that finding |
| remediations with `R#` resolved | Repair complete with evidence; next gate round may proceed |

### Errors

| Condition | Expected agent behavior |
|---|---|
| Accepted P0/P1, code edit started, no new/updated `R#` | Fail-closed: stop; write remediations entry first |
| P0 marked resolved without Guard | Invalid; keep `open` or revert status |
| Design missing `## Invariants` heading | Change-review BLOCKER |
| Design Invariants is empty with neither rows nor N/A | Change-review BLOCKER |

## Attachments

None.

## Risks / Trade-offs

- [Agents pad two duplicate “options”] → Review/Apply text requires meaningfully different approaches; change-review WARNING for clone options.
- [Remediations drift from Final Gates table] → Prefer single link column `R#`; do not duplicate long rationale in test-plan.
- [Template tests still expect “never invent Invariants”] → Update design-conventions and schema instruction tests in the same change.
- [Concurrent edits to design section order / schema design instruction] → Rebase carefully if another in-flight change also touches `schemas/spec-driven/templates/design.md` or the design `instruction` block.

## Migration Plan

- Ship template + instruction updates; existing in-flight changes without Invariants get the section on next design edit or at change-review repair time.
- In-flight Applies mid-Final-Gates: on next accepted P0/P1, create remediations.md going forward (no backfill required for already-closed gates).
- Rollback: revert template/workflow files; leftover remediations.md files remain harmless archives.

## Open Questions

None — product decisions closed in propose interview.
