## Context

Superpowers already has a change-local `design.md` artifact (Context, Goals/Non-Goals, Decisions, Risks) plus explore guidance to compare approaches and change-review checks that mention alternatives. In practice, designs still ship as decision lists: weak technical starting point, vague “reuse existing,” unstable API/state/error naming, forced or missing option comparisons, and no first-class story for repo visual identity files named `DESIGN.md` (google-labs design.md: tokens + prose for coding agents).

This change is **convention-only** for agents: package schema template/instruction, explore + change-review workflow text, schema-init fallback string, and repo `skills/change-review/SKILL.md` parity. No new artifact graph nodes, no validate parsers, no docs/onboard rewrite, no npm dependency on `@google/design.md`.

## Current system

Default design production path today:

```text
schemas/spec-driven/schema.yaml          # design.instruction (sections list)
schemas/spec-driven/templates/design.md  # skeleton headings
src/commands/schema.ts                   # fallback design markdown for schema init
src/core/templates/workflows/explore.ts  # “2-3 approaches” on propose handoff
src/core/templates/workflows/change-review.ts  # generated review skill source
skills/change-review/SKILL.md            # repo-local review skill rendering
```

`superpowers instructions design` injects schema `instruction` + template into propose. Review reads completed artifacts and scores completeness/clarity; it already expects Decisions with alternatives but does not require Current system / Contracts / pointers / visual DESIGN.md / scale-aware major vs minor rules.

### Relationship to existing tech

| Existing capability | Relation | Pointer | Note |
|---|---|---|---|
| Spec-driven design artifact | extend | `schemas/spec-driven/schema.yaml` `id: design`; `templates/design.md` | Add sections + instruction text only |
| Schema init fallback templates | extend | `src/commands/schema.ts` `case 'design'` | Keep parity with package template |
| Explore workflow | extend | `src/core/templates/workflows/explore.ts` | Major ≥3 diverge; design converges |
| Change review workflow | extend | `change-review.ts` + `skills/change-review/SKILL.md` | New checks; severity scale-aware |
| Change attachments | reuse | `attachments/` convention from `change-attachments` | Mockups/diagrams stay here |
| Visual DESIGN.md format | boundary | [google-labs-code/design.md](https://github.com/google-labs-code/design.md) | Cite/discover only; do not vendor CLI |
| Engineering living docs / ADR | boundary | out of scope | Not this change’s “D” |

## Goals / Non-Goals

**Goals:**

- Make change `design.md` answer: technical start point, reuse with pointers, contracts, major option choice.
- Split visual `DESIGN.md` from change `design.md` in agent instructions.
- Enforce via template + instruction + review (and explore handoff), with short/`N/A` escapes for small work.

**Non-Goals:**

- Docs/onboard long-form chapters, config schema field `visualDesign.path`, archive auto-merge into living docs.
- CLI structural validation of design headings, new artifacts, applyRequires changes.
- Requiring every repo to add visual `DESIGN.md` or `docs/detailed_doc`.
- Bundling or mandating `npx @google/design.md` in Superpowers runtime.
- Triple options on every minor decision.

## Decisions

### 1. Always-on template sections with short/`N/A` allowed

**Problem:** Optional sections are skipped; mixed “Context” buries technical landscape.

| Option | Discoverability | Ceremony | Agent compliance |
|---|---|---|---|
| A. Always include `## Current system` + `## Contracts` in template; allow short/N/A | High | Low if short allowed | High |
| B. Instruction-only; create sections when needed | Medium | Lowest empty-file | Low (forgotten) |
| C. Separate optional artifacts | Low | High | Medium |

**Choice:** A. Title is exactly `## Current system` (no `(as-is)`). Contracts always present; use explicit N/A when no API/state/error surface change.

**Cost:** Slightly longer empty skeleton; mitigated by “short is fine” instruction.

### 2. Pointers live on Relationship (and any bare reuse claim)

**Problem:** “Reuse existing logic” is unimplementable.

| Option | Clarity | Template weight |
|---|---|---|
| A. Relationship table with Pointer column + review ban on bare reuse | High | Low |
| B. Free-form only | Low | None |
| C. Require code citations everywhere including Goals | High | Noisy |

**Choice:** A. Relations: `reuse | extend | replace | boundary | retire`. Pointers: path, symbol, command, or file section (including visual `DESIGN.md#…`).

### 3. Explore diverges; design converges for major decisions

**Problem:** Need ≥3 options on big forks without ritual on renames.

| Option | Explore | Design | Review |
|---|---|---|---|
| A. Explore ≥3 major; design comparison table + choice; minor rationale only | Diverge | Converge record | Scale-aware |
| B. Always ≥3 in design | Forced | Bloated | Noisy |
| C. Alternatives one-liner only | Weak | Status quo | Weak |

**Choice:** A. Triggers for major: new source of truth, cross-subsystem, security/billing/idempotency/recovery, irreversible migration, important dependency, user-declared module-scale.

### 4. Visual DESIGN.md = optional UI identity source; not change design

**Problem:** User intent is google-labs visual DESIGN.md, not ADR/living eng design.

| Option | Fit | Scope creep |
|---|---|---|
| A. Instruction: discover, cite, update-on-token-change; no runtime dep | Matches intent | Low |
| B. Vendor @google/design.md + lint in CI | Strong tooling | Out of “template/review only” |
| C. Ignore visual systems | Misses user ask | — |

**Choice:** A. Discovery order: root `DESIGN.md`/`design.md`, `docs/DESIGN.md`, context-declared paths. UI changes cite when present; token/rule changes get a task to edit DESIGN.md. Mockups → `attachments/`. Non-UI: no penalty for absence.

### 5. Review severity: prefer WARNING; BLOCKER only when ambiguity blocks implementation

| Finding | Typical severity |
|---|---|
| Missing Current system / Contracts headings | WARNING (BLOCKER if design otherwise empty of landscape on cross-cutting change) |
| Bare reuse without pointer | WARNING; BLOCKER if cross-trust-boundary |
| Major decision without ≥3 comparison | WARNING/BLOCKER by blast radius |
| UI change omits existing DESIGN.md cite | WARNING |
| Minor decision without 3 options | not a finding |
| Non-UI missing DESIGN.md | not a finding |

### 6. Keep generated review template and repo skill in parity

**Problem:** `change-review.ts` is distributed source of truth; `skills/change-review/SKILL.md` is repo entry.

**Choice:** Update both in one change; existing contract tests / string assertions updated together (same pattern as proposal-review work).

**Alternatives:** Only generate and delete repo skill — rejected; repo still uses local skill path.

## Contracts

### Workflow / agent surfaces (instruction text, not CLI JSON)

| Surface | Change | Notes |
|---|---|---|
| Design template headings | add Current system, Relationship, Contracts | package template + schema init fallback |
| Design `instruction` in schema.yaml | normative authoring rules | loaded via `superpowers instructions design` |
| Explore skill/command template | major ≥3; handoff to design comparison | `explore.ts` |
| Change-review skill/command template | new checklist rows / severity | `change-review.ts` + `skills/change-review/SKILL.md` |

### States

No new change lifecycle or artifact graph states. Artifact completion remains file-presence based.

### Errors / empty / deny

| Condition | Expected agent/review behavior |
|---|---|
| No visual DESIGN.md, UI change | Note de facto CSS/components; no hard fail |
| No visual DESIGN.md, non-UI | Silent OK |
| Contracts N/A but specs add API | Review WARNING/BLOCKER: contracts under-specified |
| Major decision single option | Review finding for missing comparison |

## Risks / Trade-offs

- [Risk] Agents write long encyclopedic Current system → Mitigation: “slice for this change; short fine.”
- [Risk] Everything classified major → three-option spam → Mitigation: explicit minor triggers; review must not punish minor.
- [Risk] Generated vs repo review skill drift → Mitigation: dual edit + existing parity tests.
- [Risk] Visual DESIGN.md confused with change design.md on case-insensitive FS → Mitigation: instruction names “visual DESIGN.md (identity)” vs “change design.md”; discovery lists both casings carefully.
- [Trade-off] Convention-only means non-compliant designs still validate structurally → Accept for this scope; review is the gate on propose.

## Migration Plan

1. Land template/instruction/explore/review text + tests.
2. No migration of existing change folders required; new proposes pick up conventions.
3. Rollback = revert those files; in-flight changes remain valid.

## Open Questions

None for scoped version. Optional later: `config.visualDesign.path`, docs chapter, lint hook.
