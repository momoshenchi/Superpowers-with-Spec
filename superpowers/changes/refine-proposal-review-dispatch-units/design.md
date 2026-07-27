## Context

Two earlier unarchived changes introduced proposal review (`add-proposal-review-stage`) and work-package coordination (`streamline-subagent-work-packages`). Their guidance is already live in root skills, generated templates, and default schema instructions, but source specs were never archived into `superpowers/specs/`.

This change refines that live behavior:

1. Proposal review re-review is too strict for WARNING-only findings.
2. `work package` + `agentN` headings hide the intended assignable-unit semantics and read poorly.
3. `execution-plan.md` uses nested code-wrapped headings that couple display format to `tasks.md` text.

No new runtime CLI commands are required. The change is template, skill, instruction, and contract-test driven.

## Goals / Non-Goals

**Goals:**

- Make automatic proposal re-review **blocker-gated**.
- Rename the assignable implementation boundary to **dispatch unit**.
- Use pure-scope task headings: `# <number>. <scope>`.
- Put assignment policy in the execution-plan coordination table.
- Use clean `### <number>. <scope>` headings in execution-plan.
- Keep generated and root guidance in lockstep via contract tests.
- Accept legacy `agentN` task lists without forcing rewrite.

**Non-Goals:**

- Changing checkbox parsing / apply progress mechanics beyond heading text conventions.
- Building a persisted review artifact or approval store.
- Forcing every dispatch unit onto a live subagent.
- Rewriting historical change folders under `superpowers/changes/`.
- Archiving the two earlier unarchived changes as part of this change.

## Decisions

### Decision 1: Blocker-gated proposal re-review

**Choice:** After presenting the complete review report:

- Repair every resolvable **BLOCKER**, then **re-run review**.
- **WARNING** repairs are recommended but optional; they do **not** trigger re-review and do **not** block readiness.
- **SUGGESTION** remains visible and non-blocking.
- Readiness requires **no unresolved BLOCKER**.

**Alternatives considered:**

- Keep current “repair BLOCKER + WARNING, always re-review” → rejected; WARNING means “can start with risk,” so a second formal review is waste.
- Demote WARNING to SUGGESTION → rejected; WARNING still deserves recommended repair and residual visibility.

### Decision 2: Term is `dispatch unit`, not `task block`

**Choice:** Use **dispatch unit** as the canonical name.

**Why:** It preserves the assignable-worker intent (dispatch / handoff / integration) without implying npm packages or mandatory live agent identities.

**Alternatives considered:**

- `task block` → accurate structurally, weak on assignment.
- `worker assignment` → strong assignment, weaker as a standing plan unit.
- Keep `work package` → rejected for clarity/collision reasons.

### Decision 3: Pure-scope headings + coordination-table assignee policy

**Choice:**

`tasks.md`:

```md
# 1. Auth API
```

`execution-plan.md` coordination table columns:

`Unit | Scope | Ownership | Dependencies | Assignee policy | Parallel | Handoff`

Execution headings:

```md
### 1. Auth API
```

**Why:** Number + scope is the stable identity. Allocation is policy, not identity baked into the heading. This removes `agentN` and nested `` ### `# ...` ``.

**Legacy:** Review/apply guidance MUST accept existing `# <n>. agent...` headings as dispatch units.

### Decision 4: Codify review + dispatch-unit specs even if prior changes are unarchived

**Choice:** Add `sp-change-review-skill` and `dispatch-unit-execution` as **new** capabilities in this change, with the refined behavior as normative. Also add/adjust requirements on existing source capabilities (`cli-artifact-workflow`, `schema-init-command`, `sp-onboard-skill`).

**Why:** Prior related changes are still unarchived, so main specs lack these requirements. This change becomes the source of truth for the refined behavior.

### Decision 5: Implementation surface

Update in one pass:

1. Default schema instructions + templates
2. Generated propose / change-review / apply / onboard workflow text
3. Root skills (`change-review`, `subagent-driven-development`, `requesting-code-review`)
4. Schema-init fallback templates in `src/commands/schema.ts`
5. Contract tests asserting phrases and formats

No schema graph / artifact id changes.

## Risks / Trade-offs

- [Risk] Drift between root Chinese `change-review` skill and generated English template → Mitigation: shared contract phrases in tests; keep behavior identical even if language differs.
- [Risk] Existing in-flight changes use `agentN` headings → Mitigation: explicit legacy acceptance in review/apply/subagent skills.
- [Risk] WARNING no longer blocks readiness may allow weaker proposals through → Mitigation: keep WARNING highly visible in residual notes; still recommend repair before announce; BLOCKER definition covers true implementability failures.
- [Risk] Broad terminology rename misses a string → Mitigation: ripgrep-driven checklist in tasks + focused contract tests.

## Migration Plan

1. Land template/skill/test updates in this repo.
2. New `/sp:propose` output uses dispatch-unit format and blocker-gated review.
3. Existing change folders remain valid; no bulk rewrite.
4. Optional later archive of older unarchived changes after this lands, to avoid conflicting requirement text.

## Open Questions

None. Locked by user:

- Name: `dispatch unit`
- Heading: pure scope `# 1. Auth API`
- Assignment: coordination table only
- Review: no BLOCKER → no re-review after WARNING/SUGGESTION handling
