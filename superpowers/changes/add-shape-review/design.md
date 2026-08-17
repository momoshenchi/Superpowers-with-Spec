## Context

Final quality gates already separate local cleanup (`/sp:simplify`), behavioral correctness (`/sp:verify`), visual conformance (`/sp:design-verify`), and host-native code review. None of those gates is allowed to redesign public surfaces, module cuts, domain representation, or composition seams. This change adds an optional, read-only morphologic review that produces suggestions, then routes accepted work either back into the just-finished change or into a new change depending on session membership.

The command must remain namespaced as `/sp:shape-review` so it does not collide with `/sp:review` or host-native simplify/verify commands. Core profile size stays at five workflows: propose, explore, review, apply, and archive.

## Current system

Workflows are generated from TypeScript templates. `src/core/profiles.ts` decides which workflow IDs a profile installs: `CORE_WORKFLOWS` is propose, explore, review, apply, and archive; `ALL_WORKFLOWS` is the explicit catalog custom profiles can select from. `getSkillTemplates` / `getCommandTemplates` in `src/core/shared/skill-generation.ts` filter that catalog by ID. Init, update, migration, and drift detection each keep a matching name list (`SKILL_NAMES`, `COMMAND_IDS`, `WORKFLOW_TO_SKILL_DIR`, config prompt metadata). A new optional workflow has to be added to every one of those lists by explicit lookup, the same way `simplify` and `design-verify` were added.

`/sp:apply` is the only automatic completion path for core-profile users. After tasks and Test Hardening, it delegates four final gates in order, records them in `test-plan.md`, and if they pass it prints that the user can archive with `/sp:archive`. That sentence is the product pattern this change extends. Apply already embeds gate contracts so simplify/verify/design-verify still run when those standalone commands are not installed. Shape-review needs the same embed for the invitation path, but unlike those gates it must not execute unless the user accepts.

`/sp:simplify` reviews reuse, simplification, efficiency, and altitude, then applies only behavior-preserving edits. Its altitude angle already notices bandaids on shared infrastructure, but it must skip anything that would change intended behavior or public contracts. That skipped remainder is the gap: after the code works, nobody asks whether the seams are right.

```text
propose → review artifacts → apply → FQG
                                   │
                                   ├ code review
                                   ├ simplify (may edit, behavior-preserving)
                                   ├ verify
                                   └ design-verify
                                   │
                                   ▼
                         archive invitation only
                         (no morphologic pass)
```

### Relationship to existing tech

| Existing capability | Relation | Pointer | Note |
|---|---|---|---|
| Simplify workflow | boundary | `src/core/templates/workflows/simplify.ts` | Keep behavior-preserving cleanup there; shape-review routes those findings back to simplify. |
| Proposal review | boundary | `src/core/templates/workflows/change-review.ts` `/sp:review` | Artifact completeness before implementation; not a substitute for implemented-shape review. |
| Design verify | boundary | `src/core/templates/workflows/design-verify.ts` | Visual `DESIGN.md` only. |
| Apply completion | extend | `src/core/templates/workflows/apply-change.ts` completion block | Add optional invitation beside `/sp:archive`; do not add a fifth gate. |
| Final quality gates | reuse | `src/core/templates/workflows/final-quality-gates.ts` | Sequence and retry rules stay unchanged. |
| Workflow generation | extend | `src/core/shared/skill-generation.ts`, `src/core/profiles.ts`, `src/core/shared/tool-detection.ts` | Register `shape-review` by explicit ID like `simplify`. |
| Profile selection | reuse | `CORE_WORKFLOWS` in `src/core/profiles.ts` | Core stays five commands. |

## Goals / Non-Goals

**Goals:**

- Ship a portable `/sp:shape-review` skill and command for custom profiles.
- Review Surface, Boundaries, Model, and Composition as four named angles with fan-out or a disclosed single pass.
- Invite that review from apply completion without making it a gate.
- Let a core-profile user honor the invitation in the same conversation via an embedded contract.
- Route accepted suggestions: same post-apply session expands the current change; a new session creates a new change.

**Non-Goals:**

- Adding shape-review to the core profile.
- Auto-running shape-review inside apply.
- Letting the shape-review worker edit code during the review pass.
- Replacing simplify, proposal review, verify, or design-verify.
- Adding a new schema artifact, CLI status field, or durable `shape-review.md` file.
- Detecting “new session” through host telemetry APIs; conversation evidence is sufficient.

## Decisions

### 1. Standalone command plus apply invitation, not a fifth gate

**Problem:** Where should morphologic review attach to the lifecycle?

**User selection:** The user chose option C, then confirmed Apply should only prompt, the same way it currently prompts `/sp:archive`, and must not auto-run.

| Option | Apply coupling | Archive | Risk |
|---|---|---|---|
| A. Pure standalone command | None unless the user remembers | Unaffected | Easy to skip; core users never see it |
| B. Fifth final quality gate | Always runs | Blocks or fakes a gate | Contract edits after Verify restart the gate chain |
| C. Independent command + optional appendix after FQG | Invitation only | Does not block | Relies on the prompt being noticed |

**Choice:** C, with the archive-style prompt and no automatic execution.

**Trade-offs / cost:** Some users will archive without reviewing shape. That is accepted so a completed, verified change is not forced into a redesign. The prompt makes the path discoverable without expanding core.

### 2. Custom profile only

**Problem:** Should `/sp:shape-review` install with core, or only when selected?

**User selection:** The user chose custom: core stays five commands; Apply may still prompt; without the installed command, the same session honors the invitation or the user runs `superpowers config profile` first.

| Option | Any-session slash command | Core command count |
|---|---|---|
| Core install | Always present | Six |
| Custom install | Only after profile selection | Five |

**Choice:** Custom install.

**Trade-offs / cost:** A fresh core user cannot type `/sp:shape-review` in a new chat until they opt in. Same-session apply invitation still works because apply embeds the contract.

### 3. Session-based acceptance routing

**Problem:** When the user accepts structural suggestions, should they enlarge the current change or start a new one?

**User selection:** If acceptance happens in the apply-after phase, expand the current change in place. Create a new proposal only in a new session.

| Option | Context | Archive of the original change |
|---|---|---|
| Always new proposal | Cold start, clean boundary | Original can archive immediately |
| Always in-place | Keeps one change | Invalidates a just-passed FQG |
| Same session in-place; new session new proposal | Uses hot context when it exists | Original archives only after expansion, or separately in a later session |

**Choice:** Same session after apply expands in place; new session creates a new proposal.

**Trade-offs / cost:** A large in-place expansion can stretch one change past a comfortable workload. Default is still in-place in that session; the agent may warn, but it does not split unless the user asks.

### 4. Four fixed angles and the `/sp:shape-review` name

**Problem:** What does the review inspect, and what is it called?

**User selection:** The user locked Surface, Boundaries, Model, and Composition as the four angle names, then chose `/sp:shape-review` after considering `/sp:shape`, `/sp:reshape`, `/sp:seams`, and the `structure-review` working title.

| Option | Clarity | Collision |
|---|---|---|
| `/sp:shape` | Short | Sounds like it will edit |
| `/sp:reshape` | Verb like simplify | Implies auto-apply |
| `/sp:seams` | Precise | Jargon |
| `/sp:shape-review` | Review posture is visible | Must not be shortened to `/sp:review` |

**Choice:** `/sp:shape-review`, four angles named Surface, Boundaries, Model, and Composition.

**Trade-offs / cost:** Docs must say `/sp:review` is not an abbreviation of this command.

### 5. Same-session detection is fail-closed and conversation-scoped

**Problem:** Implementers need a rule for “this conversation just finished apply” versus “new session.”

| Option | Reliability | Extra machinery |
|---|---|---|
| A. Host session IDs or timestamps | Fragile across tools | New telemetry |
| B. Fail-closed conversation evidence | Portable | Occasional extra new change |
| C. Always ask the user | Unambiguous | Interrupts the archive-style prompt |

**Choice:** B. Infer same-session membership only from evidence in this conversation that `/sp:apply` completed applicable final quality gates for this change and that the user is answering that completion. If that evidence is missing, create a new change.

**Rationale:** A wins only if every host exposes a stable session ID; Superpowers workflows cannot depend on that. C would turn an optional invitation into another interview question and fights the archive-prompt analogy. B matches the product rule the user locked: in-place expansion is a hot-context optimization, not a guess. A false new-proposal is recoverable; silently editing an already-archived or unrelated change is not.

**Mapping rules:**

- Same-session after apply when all of these hold: this conversation contains an apply completion for change `N`; applicable FQG passed; the user then asks to run shape-review or accepts the invitation, including by typing `/sp:shape-review`, `/sp:shape-review N`, or natural language such as “跑一下 shape-review”; `N` is still the active change directory (not already moved under `superpowers/changes/archive/`).
- New session when the conversation has **no** apply-completion evidence for `N`. Typical cases: `/sp:shape-review` is the first workflow in a fresh chat; `N` is archived; multiple candidate changes exist and apply completion is not uniquely identified.
- Conflict rule: if same-session and new-session bullets both appear to match, same-session wins. “Fresh request” means “this conversation lacks apply-completion evidence,” not “the user typed the slash command.”
- Fail-closed: uncertain membership → new change, and say so.
- In-place expansion updates the existing artifacts, withholds `/sp:archive`, and continues apply on new tasks. If specs or design changed, run the existing `/sp:review` loop before implementing the expansion. After implementation changes, re-run FQG. Do not treat the earlier pass as live.
- New-session acceptance runs `/sp:propose` (or equivalent change creation) with a kebab-case follow-up name, records the prior change as prerequisite, and does not edit the prior artifacts.
- Soft workload warning: if accepted suggestions look like a distinct large capability, tell the user, keep in-place as default in same session, and split only on explicit request.
- Finding classification at report time is `simplify`, `structural`, or `skip`. Only after the session rule is applied does a `structural` finding get destination `expand-current-change` or `new-proposal`.

**Worked example (same session, slash command):** Apply completes `add-dark-mode` and prints archive plus optional shape-review. User types `/sp:shape-review add-dark-mode`. Four-angle report flags a leaked internal DTO on the CLI (`structural` → `expand-current-change`). User accepts. Coordinator updates `add-dark-mode` proposal/design/specs/tasks, withdraws archive, reviews artifacts if specs changed, continues apply, then re-runs FQG. This is not a new change.

**Worked example (same session, natural language):** Same apply completion. User: “跑一下 shape-review.” Same routing as the slash example.

**Worked example (new session):** Next day, new chat with no apply-completion turn: `/sp:shape-review add-dark-mode`. User accepts a structural finding. Coordinator creates `reshape-add-dark-mode-cli-contract` (or a derived kebab name), points prerequisite at `add-dark-mode`, and leaves the original change alone.

**Worked example (core profile, no slash command):** Apply completes in core. User: “optional shape review 也跑一下.” Coordinator uses the embedded apply contract, not a missing `/sp:shape-review` file.

**Worked example (other angles):** A new package that depends the wrong way is Boundaries/`structural`. A boolean pair that can represent an illegal state is Model/`structural`. A use-case that constructs HTTP clients inline is Composition/`structural`. A duplicated private helper is `simplify`.

### 6. Shared fragment for the review contract, apply owns the invitation

**Problem:** The four-angle contract must not drift between the standalone command and apply’s same-session path.

| Option | Drift | Core-profile behavior |
|---|---|---|
| A. Shared generated fragment imported by both templates | Low | Apply can embed the contract without installing the command |
| B. Standalone skill only; apply tells the user to install it | None in apply | Invitation is dead in core |
| C. Duplicate the full workflow into apply prose | High | Works, but two sources of truth |

**Choice:** A. Put the review procedure, four-angle checklists, report schema, and session-routing rules in `shape-review.ts`. Export two strings: the full contract for the skill/command, and a short invitation-plus-handoff fragment for `apply-change.ts`. Apply imports the short fragment and does not copy the four-angle checklists. This is the same layering `final-quality-gates.ts` uses.

**Rationale:** B contradicts the locked core-profile invitation. C will desync the four angles the first time one template is edited. A keeps one procedure, while apply still owns whether and when to mention it. Apply must not import the four-gate runner; shape-review stays off the gate list.

**Angle checklists (normative for the full contract):**

- Always evaluate all four angles. If the diff has no evidence for a layer, that angle is `not applicable` with scope evidence; do not omit the angle.
- **Surface:** public API, CLI, events, flags, wire/DTO/error shapes, compatibility seams, command taxonomy. Typical evidence: exports, schemas, or user-visible names.
- **Boundaries:** module cohesion/coupling, layering, dependency direction, trust-boundary placement, ownership vs file topology. Typical evidence: packages, folders, or cross-module imports.
- **Model:** representable invalid states, domain vs transport vs persistence types, explicit lifecycle vs flag soup, stable identifiers. Typical evidence: types, state, or stored shapes.
- **Composition:** where rules live, missing vs premature extension points, wiring/lifecycle, testability ports, sync/async protocol between parts. Typical evidence: orchestration, construction, or IO seams.

Findings that are local and behavior-preserving are classified `simplify`. Visual token issues go to design-verify. Artifact completeness goes to `/sp:review`.

## Contracts

### API / CLI

| Surface | Change | Compatibility |
|---|---|---|
| Workflow ID `shape-review` | Add to `ALL_WORKFLOWS`, skill/command maps, config prompt metadata | Additive. Core profile unchanged. |
| Skill directory `superpowers-shape-review` | Generated when selected | Named lookup, not glob. |
| Slash command `/sp:shape-review [change-name]` | Optional argument; same change-resolution as simplify | Distinct from `/sp:review`. |
| `/sp:apply` completion text | Adds optional shape-review invitation beside archive | Archive wording stays valid; invitation is extra. |
| Final Quality Gates table | Unchanged four rows | Shape-review is not a gate. |

**Completion copy (both apply template variants):**

```text
Implementation, Test Hardening, and every applicable final quality gate are complete.
You can archive this change with `/sp:archive`.
Optional: review shape with `/sp:shape-review` (does not block archive).
If that command is not installed, say you want a shape review in this conversation.
```

**Report schema:**

```text
## Shape Review Result
Outcome: passed | failed | blocked
Scope: <change name and owned paths, or explicit target>
Review mode: four-agent fan-out | single-pass fallback
Session routing: same-session apply-after | new-session | not accepting
Angles: Surface=<passed|n/a+evidence> | Boundaries=<...> | Model=<...> | Composition=<...>
Suggestions: <angle, file:line or symbol, summary, cost, classification, destination>
Skipped: <finding and reason, or none>
Evidence: <diff/review inputs>
```

Classification values: `simplify`, `structural`, `skip`.  
Destination values: `simplify`, `expand-current-change`, `new-proposal`, `skip`. A `structural` destination is assigned only after the session rule.

### States

Shape-review does not add CLI change states. Apply completion remains “ready to archive” until in-place expansion withdraws that recommendation by adding incomplete tasks. No `superpowers status` field is added.

### Errors

| Situation | Outcome | Behavior |
|---|---|---|
| No change name and no apply-completion context and no explicit target | `blocked` | Ask for PR, branch, file, or change name. Do not scan the whole tree. |
| Owned paths mixed with unrelated dirty files | `blocked` | Ask for a narrower target. |
| Host cannot spawn agents | still review | Single-pass fallback; disclose it. |
| Review process cannot finish after scope is resolved | `failed` | Do not use `failed` for “has structural suggestions.” |
| Uncertain session membership on acceptance | new change | Fail-closed; do not edit the prior change. |
| Prior change already archived on same-session claim | new change | Cannot expand in place. |

## Attachments

None.

## Risks / Trade-offs

- [Users shorten `/sp:shape-review` to `/sp:review`] → Docs and the skill description state they are different workflows; `/sp:review` remains proposal-artifact review.
- [In-place expansion after FQG invalidates a green gate record] → Withdraw archive and re-run FQG; do not keep the old pass.
- [Core users never install the command] → Apply still invites and can execute the embedded contract in that conversation.
- [Large same-session expansion overruns one change] → Warn; split only if the user asks.
- [Registry miss on a new ID] → Follow the simplify registration checklist; tests must fail if `shape-review` is absent from any explicit map.
- [Stacking with in-progress template/registry changes] → Rebase so the new ID is added to whatever unified pipeline those changes produce.

## Migration Plan

- Additive. Existing core installs keep working. `superpowers update` after selecting `shape-review` in a custom profile generates the new skill and command.
- Rollback: deselect `shape-review` and run update; generated files are removed by explicit ID. Apply invitation text would remain until this change is reverted; if this change is reverted, restore the previous completion paragraph.
- No data migration.

## Open Questions

None. Session detection, profile placement, invitation posture, angle names, and command name were closed in explore.
