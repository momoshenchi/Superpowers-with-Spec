---
name: superpowers-change-review
description: Review a complete Superpowers proposal before implementation. Use manually with /sp:review or automatically after /sp:propose creates all required artifacts.
license: MIT
compatibility: Requires superpowers CLI.
metadata:
  author: superpowers
  version: "1.0"
  generatedBy: "1.0.6"
---

Review a complete Superpowers change before implementation.

**Input**: Optionally specify a change name. If omitted, infer it only from clear conversation context; otherwise run `superpowers list --json` and ask the user to choose.

## Review procedure

1. Run `superpowers status --change "<name>" --json`. Use `schemaName`, `applyRequires`, and the declared artifacts to determine the review scope. Do not assume every schema has delta specs.
2. Run `superpowers validate <name>`. Treat every validation error as a BLOCKER.
3. Read only completed artifacts declared by the selected schema and attachments referenced from those artifacts. For spec-driven changes, review proposal, specs, design, tasks, execution-plan, and test-plan.
4. Assess completeness, clarity, coherence, and implementability. Report findings as BLOCKER, WARNING, or SUGGESTION with an artifact location and a concrete repair.
5. For spec-driven tasks, treat top-level `# <number>. <scope>` headings as logical **dispatch unit** boundaries. Accept legacy `# <number>. agent<logical-id> — <scope>` headings as equivalent dispatch units. Verify `execution-plan.md` Dispatch Coordination covers each unit's ownership, dependencies, assignee policy, parallel eligibility, and handoff evidence, and that every detailed task has concrete Step 1–5 execution guidance under clean `### <number>. <scope>` headings. Do not require per-checkbox delegation, per-checkbox formal review, or 2–5 minute work units.

## Automatic proposal-review loop

When this procedure runs automatically from `/sp:propose` after every `applyRequires` artifact is complete:

1. Inspect the complete proposal artifacts and **present the complete review report** before editing any of them.
2. Then **repair every resolvable BLOCKER**. WARNING findings are recommended repairs: you may fix them after the report, but they do not block readiness by themselves. SUGGESTION findings are non-blocking and may remain visible in the report.
3. **re-run review only after repairing one or more BLOCKERs** (or when the initial report contained a BLOCKER that was repaired). Do not re-run full proposal review solely because WARNING or SUGGESTION findings were present or repaired.
4. Announce readiness only when no unresolved BLOCKER remains. Residual WARNING and SUGGESTION notes may stay visible.
5. If a repair needs a product, security, schema, or external-dependency decision, report the blocker and pause; do not guess or claim readiness.

Do not create `review.md`, approval metadata, or a review artifact. Proposal review is ephemeral. `/sp:apply` does not automatically repeat proposal review; users may invoke `/sp:review <change>` voluntarily.

## Design convention checks (when `design.md` is present)

Apply these in addition to general completeness/clarity checks. Prefer **WARNING**; escalate to **BLOCKER** only when missing landscape or contracts would block implementation of a cross-cutting change.

### Current system and Contracts
- Expect the exact `## Current system` title as a technical landscape *slice for this change*. Short content is OK; empty/placeholder-only is at least WARNING.
- Expect `## Contracts` always. Accept an explicit `N/A — no API/state/error surface change` (or equivalent) when specs/tasks show no API/CLI/state/error change. If Contracts says N/A but specs add API/state/error behavior, escalate.
- Missing Current system or Contracts headings on a present design.md → WARNING (BLOCKER if cross-cutting and the design otherwise has no technical landscape).

### Relationship / reuse pointers
- Prefer a Relationship table (or equivalent) with relations `reuse | extend | replace | boundary | retire` and a **Pointer** column (path, symbol, command, or documented section).
- Bare reuse / "keep existing behavior" language without a navigable pointer → WARNING; BLOCKER when the claim crosses module or trust boundaries.

### Scale-aware decision comparisons
- **Major** decisions (new source of truth; cross-subsystem; security/billing/idempotency/recovery; irreversible migration; important dependency; user-declared module-scale): require a recorded comparison of **≥3 options** with choice and trade-offs. Missing comparison → WARNING or BLOCKER by blast radius.
- **Minor** decisions (local rename, single-helper, file placement): rationale only is enough. Do **not** flag missing three-option tables as a defect.
- If major vs minor is ambiguous, WARNING asking the author to classify or add comparison is enough.

### Visual DESIGN.md (UI identity; not change design.md)
- Visual `DESIGN.md` means the google-labs design.md idea (YAML tokens + prose identity)—**not** change-local design.md, not engineering living docs, not ADRs.
- Discovery: repo-root `DESIGN.md`/`design.md`, `docs/DESIGN.md`, or project-context paths.
- UI change + visual DESIGN.md exists but design never cites it → at least WARNING.
- Look-and-feel token/rule changes → expect a task (or completed plan) that updates that visual DESIGN.md; do not require pasting the full visual system into change design.
- Non-UI change missing visual DESIGN.md → **not a finding**.
- UI change with no visual DESIGN.md found → note de facto components/CSS is OK; not an automatic defect.

## Keep review contracts separate

- **Proposal review** happens before implementation and judges whether artifacts can be implemented without ambiguity.
- The **final integration review** happens after dispatch units integrate and judges cross-unit behavior, the integrated diff, code quality, and full validation. It is not a rerun of proposal review.

## Output

```markdown
## Change Review: <change-name>

### Summary
| Dimension | Result |
| --- | --- |
| Completeness | ... |
| Clarity | ... |
| Coherence | ... |
| Implementability | ... |

**Readiness:** ready / needs repair / blocked for a decision

### BLOCKER
1. ...

### WARNING
1. ...

### SUGGESTION
1. ...
```

