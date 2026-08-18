## Context

Operators finishing a UI change need to see what the product looked like before the edit and after, then decide whether to keep changing or merge. Superpowers already has a Design Verify gate that inspects the running After UI against a repository visual `DESIGN.md`. It does not capture a Before, does not store a paired visual pack, and treats screenshots only as incidental evidence. This change extends that same gate and the apply start path. It does not add a fifth quality gate, a new CLI command, or a screenshot engine.

User-confirmed product choices from explore: attach the pack to Design Verify; store files in change `attachments/`; capture Before in the same apply worktree before UI edits; count human status-quo attachments as Before; if Before is missing, capture After only and do not reconstruct old code.

## Current system

Workflows are generated from TypeScript templates. `/sp:apply` (`src/core/templates/workflows/apply-change.ts`) selects a change, forbids starting implementation on `main`/`master` without consent, implements tasks, runs Test Hardening, then delegates four final quality gates. The last gate is Design Verify. On success it invites `/sp:archive` and optional `/sp:shape-review`. Apply already discovers referenced files under `attachments/` via `attachmentFiles`; those files are supporting context, not completion-tracked artifacts.

`/sp:design-verify` (`src/core/templates/workflows/design-verify.ts`) is a generated skill/command. For UI scope it must run the app, inspect affected routes and states, and compare the **current** rendering to repository visual `DESIGN.md` (not change-local `design.md`). Non-UI is `not applicable`. Missing runtime or missing visual source is `blocked`. The report has outcome, round, UI scope, visual source, runtime evidence, and a rule table. Screenshots may appear in runtime evidence, but there is no required Before, no attachment path convention, and no After-only fallback rule.

`using-git-worktrees` is required before apply tasks. Typical layout is a feature-branch worktree while the primary checkout still holds `main`. By Design Verify time that feature worktree **is** After. The capture window for same-tree Before is therefore apply start, after the worktree exists and before the first UI implementation edit.

Final quality gate copy is also inlined into apply through `getFinalQualityGateInstructions()` in `src/core/templates/workflows/final-quality-gates.ts`. Design Verify behavior that apply workers must follow has to stay consistent across `design-verify.ts` and that inlined paragraph.

This repository has no product UI and no visual `DESIGN.md`. Instruction-string tests in `test/core/templates/skill-templates-parity.test.ts` pin generated skill text and SHA hashes. Attachment discovery already accepts nested paths such as `attachments/screens/mobile/home.png` with Markdown targets beginning `attachments/` (`src/commands/workflow/attachments.ts`).

```text
today: apply start → implement → FQG → Design Verify(After vs DESIGN.md) → archive invite
gap:   no Before, no attachments/visual-diff, missing Before undefined
```

### Relationship to existing tech

| Existing capability | Relation | Pointer | Note |
|---|---|---|---|
| Design Verify skill | extend | `src/core/templates/workflows/design-verify.ts` | Add After capture, Before consumption, report fields; keep DESIGN.md pass/fail. |
| Apply change skill | extend | `src/core/templates/workflows/apply-change.ts` | Capture runtime Before after worktree, before UI edits. |
| Final quality gates copy | extend | `src/core/templates/workflows/final-quality-gates.ts` Design verify bullet | Same Before/After/missing-Before rules for the apply-delegated worker. |
| Change attachments | reuse | `src/commands/workflow/attachments.ts`, `superpowers/changes/add-change-attachments/specs/change-attachments/spec.md` | Nested `attachments/` images; not a tracked artifact. |
| Manual Coverage | boundary | `getManualCoverageInstructions` in `final-quality-gates.ts` | Screenshots still do not complete a manual row. |
| Git worktrees | reuse | `skills/using-git-worktrees/SKILL.md` | Same apply worktree for Before capture; do not add a merge-base tree. |
| Shape-review invitation | boundary | `SHAPE_REVIEW_APPLY_HANDOFF` | Visual pack is inside Design Verify, not a new optional invitation. |
| Visual DESIGN.md | reuse | existing Design Verify discovery paths | Still required for a UI pass. |

This change is instruction-only for coding agents. There is no repository visual `DESIGN.md` to cite for Superpowers' own UI; none is being added.

## Goals / Non-Goals

**Goals:**

- Capture runtime Before in the apply worktree before UI implementation edits.
- Accept explained human status-quo images as illustrative Before.
- Have Design Verify capture After into `attachments/visual-diff/after/` and present Before/After when Before exists.
- If Before is missing, capture After only, record `Before: missing`, and still evaluate `DESIGN.md`.
- Keep missing Before from failing, blocking, or withholding archive.

**Non-Goals:**

- A fifth final quality gate or `/sp:visual-diff` command.
- Reconstructing Before with a second detach worktree, `git checkout` of merge-base, CI screenshot baselines, or deployed-base crawling.
- Pixel-diff pass/fail (Playwright `toHaveScreenshot`, Chromatic, Percy).
- A new schema artifact, CLI flag, or screenshot library dependency.
- Replacing Manual Coverage or weakening DESIGN.md blockers.
- Changing core profile workflow IDs.

## Decisions

### 1. Attach the pack to Design Verify, not a new gate or optional invitation

**Problem:** Where should before/after screenshots attach so an operator can decide continue-versus-merge after apply?

**User selection:** The user chose B after seeing A (apply-completion visual pack), B (extend Design Verify), C (optional `/sp:visual-diff` like shape-review), and D (propose-time required route baselines).

| Option | When shown | Blocks archive | Relation to DESIGN.md |
|---|---|---|---|
| A. Apply-completion pack | After all gates | Human decision only | Separate from the gate |
| B. Extend Design Verify | Inside the fourth gate | Only existing DV blockers | Same report as conformance |
| C. Optional `/sp:visual-diff` | If the user asks | No | Easy to skip |
| D. Propose-time baselines | At propose + apply end | Depends | Extra propose burden |

**Choice:** B.

**Trade-offs / cost:** Design Verify now carries diagnostic screenshots in addition to DESIGN.md conformance. Missing Before must not be mixed up with missing DESIGN.md or missing runtime. Accepted: the pack always runs for UI scope during the gate the operator already waits for.

### 2. Store files in change attachments

**Problem:** Where do Before/After images live?

**User selection:** The user chose change `attachments/`.

| Option | Durable | Extra machinery |
|---|---|---|
| Change `attachments/` | Yes, with the change | Existing convention |
| Chat-only images | No | Operator cannot reopen |
| New schema artifact | Tracked status | Overkill |

**Choice:** Change `attachments/`.

**Trade-offs / cost:** Binaries in the change directory. They remain untracked as schema artifacts; apply readiness does not depend on their presence.

### 3. Before sources: same-tree apply-start capture, plus human attachments

**Problem:** Apply already runs in a feature-branch worktree. How is Before obtained?

**User selection:** The user chose same apply worktree, capture before UI edits; human-provided attachments also count as Before. The user declined second detach worktree, CI baselines, and deployed-base crawling as required sources.

| Option | When it works | Cost |
|---|---|---|
| Same-tree, before first UI edit | Fresh apply | One runtime |
| Human attachments | Any time someone attached status-quo images | May be stale |
| Second detach worktree at merge-base | After the fact | Two apps, two ports |
| CI / deployed base | If SHA matches | Environment drift |

**Choice:** Same-tree runtime capture at apply start, plus explained human attachments.

**Trade-offs / cost:** Resumed apply after UI edits will often have no runtime Before. That is the next decision.

### 4. Missing Before is After-only, not blocked and not reconstructed

**Problem:** If the capture window is gone and nobody attached a status-quo image, what should Design Verify do?

**User selection:** The user chose After-only: do not block, do not rebuild old code.

| Option | Archive | Fidelity |
|---|---|---|
| Block the gate | Stopped | Forces a Before |
| Second worktree reconstruction | Continues after extra setup | True merge-base UI |
| After-only + `Before: missing` | Continues | Pack is incomplete |

**Choice:** After-only + `Before: missing`.

**Trade-offs / cost:** Some UI changes will ship with no visual delta. Accepted so a missed window cannot freeze apply. DESIGN.md and runtime blockers are unchanged.

### 5. Attachment layout, UI prediction, and report fields

**Problem:** Implementers need exact paths, when to attempt Before, and what the report must contain.

| Option | Predictability | False captures |
|---|---|---|
| A. Always try Before on every apply | Never miss UI | Wastes runtime on CLI-only changes |
| B. Explicit artifact + suffix-list lookup | Deterministic | May miss unusual UI paths |
| C. Open-ended glob/regex on the diff | Catches odd files | Violates explicit-lookup rules |

**Choice:** B. Predict UI only from completed artifacts and an explicit owned-path suffix list. Write screenshots with `path.join`; Markdown targets stay `attachments/visual-diff/...`.

**Rationale:** A would start browsers for every Superpowers CLI change and fights YAGNI. C is forbidden by schema path rules (explicit list lookup, no invented detection). B matches how Design Verify already decides UI scope from artifacts and diff, and it reuses attachment discovery which already requires Markdown targets beginning `attachments/`. Suffix list is the owned-path half; artifact text (routes in design, Manual Coverage, proposal) is the other half. Unusual UI in `.go` templates is still predicted when artifacts name a rendered route; a dirty or resumed worktree is fail-closed (`closed`) because baseline evidence requires an empty diff, so a resumed After is never stored as runtime Before.

**Mapping rules:**

- **Capture window (fail-closed):** `open` only when all of: predicted UI; this invocation has not edited implementation yet; UI-baseline evidence holds. Evidence: the union of `git diff --name-only <merge-base> HEAD`, `git diff --name-only`, and `git diff --name-only --cached` contains **no paths at all**, and `git status --porcelain` is empty. Any dirty or committed implementation change closes the window, including template/non-suffix UI, so a resumed After is never stored as runtime Before. Reusing an existing worktree defaults to `closed` unless that evidence holds. If this invocation created the worktree and evidence holds, `open`. If merge-base or those commands cannot be run, `closed`. If `attachments/visual-diff/before/` already has files for this change, do not overwrite. Do not capture on `main`/`master` unless the user already consented to implement there.
- **Predicted UI:** true if any completed context artifact describes a rendered route, component, or responsive/state UI, **or** any owned path ends with one of: `.html`, `.css`, `.scss`, `.sass`, `.less`, `.vue`, `.svelte`, `.jsx`, `.tsx`. Lookup is exact suffix / artifact reading, not regex over the whole tree.
- **Routes:** union of routes/states named in design, proposal, specs, and `test-plan.md` Manual Coverage. If none are named, capture the smallest documented app entry route once (for example `/`) and record that limitation.
- **Filesystem:** `path.join(changeDir, 'attachments', 'visual-diff', 'before', fileName)` and `... 'after', fileName`. Suggested names: `<route-slug>--<state>.png`. Markdown in reports: `attachments/visual-diff/before/<file>` and `attachments/visual-diff/after/<file>`.
- **Kinds:** apply-captured files are `runtime`. Artifact-explained current-product images anywhere under `attachments/` (not only `visual-diff/before/`) are `illustrative` only when the referencing artifact names source, route or state, and that the file is illustrative. Unexplained images are not Before.
- **Precedence:** both kinds present → default comparison is `runtime`; show `illustrative` as supplemental; artifact may override to illustrative-as-source-of-truth.
- **Apply-start failure:** missing runtime/browser at Before capture does not block implementation; Design Verify later uses After-only unless illustrative Before exists.
- **Design Verify:** UI + runnable → always attempt After. If any Before exists for a route, present pair. Else `Before: missing`. Pass/fail still DESIGN.md. Missing DESIGN.md or runtime still `blocked`. Non-UI: no screenshots, `not applicable`.
- **Forbidden:** second worktree, checkout of merge-base in the apply tree, treating After-only as DESIGN.md pass, treating images as Manual Coverage completion, adding a fifth FQG row.
- **Apply-delegated copy:** the Design verify bullet in `getFinalQualityGateInstructions()` must tell the worker to follow the same Before/After/missing-Before rules as the standalone skill (capture After, consume attachments, After-only if missing, do not reconstruct).
- **Docs:** `docs/commands.md` `/sp:design-verify` and `docs/workflows.md` apply/design-verify paragraphs mention the pack and After-only fallback.

**Worked example (fresh UI apply):** Change `add-settings-page` owns `src/pages/Settings.tsx`. Apply enters `.worktrees/add-settings-page`. Before any edit, it starts the documented dev server, screenshots `/settings`, writes `attachments/visual-diff/before/settings--default.png` (`runtime`). After implementation, Design Verify screenshots After to `attachments/visual-diff/after/settings--default.png`, shows both, cites DESIGN.md color/spacing rules. Missing Before never happens.

**Worked example (resumed apply):** Apply resumes with Settings.tsx already edited and no before files. Proposal has `![Current settings](attachments/prod-settings.png)` explained as production status-quo. Design Verify uses that as `illustrative` Before, captures After, default comparison is illustrative because no runtime Before exists.

**Worked example (After-only):** Apply resumes, no before files, no explained human image. Design Verify captures After, report field `Before: missing`, still needs DESIGN.md + runtime. Outcome can be `passed`. Apply may invite archive.

## Contracts

### API / CLI

N/A — no Commander options, flags, or machine JSON fields. Surface change is generated skill/command Markdown for `/sp:apply` and `/sp:design-verify`.

Design Verify report SHALL keep existing outcome, round, UI scope, visual source, runtime evidence, and rule table. It SHALL add:

- **Before summary:** `present` | `mixed` | `missing` | `not applicable`
- A **visual-diff table** with one row per affected route or state:

| Route / state | Before kind | Before | After | Default comparison |
| --- | --- | --- | --- | --- |
| `<route> <state>` | `runtime` \| `illustrative` \| `missing` \| `route did not exist` | markdown target or `—` | markdown target or `not captured` | `runtime` \| `illustrative` \| After-only |

When both kinds exist on one row, Default comparison is `runtime` unless an artifact names illustrative as source of truth. Supplemental illustrative paths stay in the Before cell or a footnote on that row.

**Worked mixed example:** `/settings` has runtime Before; `/settings?empty` has none. Two rows: first pair + `runtime`; second `missing` + After-only. Before summary is `mixed`.

### States

Before presence is not a schema artifact state. Informal capture-window states for implementers:

- `open`: predicted UI, this invocation has not implemented yet, and UI-baseline evidence holds → apply SHALL attempt runtime Before
- `closed`: non-UI, reused dirty worktree, fail-closed missing evidence, or this invocation already edited → no runtime capture
- `missing`: Design Verify finds no runtime and no illustrative Before → After-only

Design Verify outcomes stay `passed` | `failed` | `blocked` | `not applicable`. `Before: missing` is not an outcome.

### Errors

- Apply-start Before capture cannot run → continue implement; do not `blocked` apply.
- Design Verify UI without runtime/browser/`DESIGN.md` → `blocked` (existing).
- Design Verify UI without Before → not an error; After-only.
- Attachment path escape (`attachments/../...`) → existing attachment containment rejection; visual-diff files MUST stay inside the change `attachments/` directory.

## Invariants

| ID | Invariant | How to falsify | Owner test / check |
|---|---|---|---|
| I1 | Generated Design Verify instructions require After capture into `attachments/visual-diff/after/` for UI scope and After-only when Before is missing | Instructions omit After path, treat missing Before as `blocked`/`failed`, or tell the agent to add a second worktree | `test/core/templates/skill-templates-parity.test.ts` string pins on `getDesignVerifySkillTemplate` |
| I2 | Generated Apply instructions require runtime Before only when the fail-closed capture window is `open`, and do not block apply when that capture cannot run | Instructions capture After as Before on a reused dirty worktree, or block apply when the browser is missing at start | parity pins on `getApplyChangeSkillTemplate` |
| I3 | Missing Before is not a Design Verify `blocked`/`failed` outcome and does not add a fifth FQG row | Gate table gains a visual-diff row, or missing Before listed as `BLOCKER` | parity pins on apply completion table remaining four gates; design-verify outcome list unchanged |
| I4 | Screenshots are not Manual Coverage completion | Instructions say Before/After images complete a manual row | existing Manual Coverage sentence plus a visual-diff non-substitution pin |
| I5 | Markdown attachment targets begin with `attachments/` and filesystem joins use `path.join` guidance; no hardcoded `\\` vs `/` concatenation requirement in generated examples beyond Markdown forward-slash targets | Instructions tell agents to concatenate `'attachments\\visual-diff'` on Windows | spec scenario + instruction phrase `path.join` |

## Attachments

None.

## Risks / Trade-offs

- [Risk] Apply-start UI prediction misses template-driven UI → Mitigation: After-only fallback; Design Verify still uses diff-based UI scope.
- [Risk] Human illustrative Before is stale or wrong route → Mitigation: require artifact explanation of source/route; prefer runtime when both exist.
- [Risk] Operators confuse After-only `passed` with “visual delta reviewed” → Mitigation: report MUST show `Before: missing`.
- [Risk] Large PNG binaries in change directories → Mitigation: only predicted UI routes; no schema-required attachments.
- [Risk] Skill text drift between `design-verify.ts` and apply's inlined Design verify bullet → Mitigation: I1 pins both generated surfaces; keep phrases aligned.

## Migration Plan

- Regenerated skills/commands pick up the new text on next `superpowers init` / `superpowers update`.
- In-progress applies that already edited UI simply take After-only; no migration of old changes.
- Rollback: revert the template/docs/test commits; no data migration.

## Open Questions

None. Remaining implementation naming (exact PNG slugs) is agent-owned inside the mapping rules above.
