## File Structure

- Create:
  - `src/core/templates/workflows/shape-review.ts` - Skill and command templates, full review-contract export, and short apply invitation-plus-handoff fragment.
- Modify:
  - `src/core/templates/skill-templates.ts` - Re-export shape-review getters.
  - `src/core/shared/skill-generation.ts` - Register skill dir `superpowers-shape-review` and command id `shape-review`.
  - `src/core/profiles.ts` - Add `shape-review` to `ALL_WORKFLOWS` only.
  - `src/core/shared/tool-detection.ts` - Add `superpowers-shape-review` to `SKILL_NAMES` and `shape-review` to `COMMAND_IDS`.
  - `src/core/profile-sync-drift.ts` - Add `WORKFLOW_TO_SKILL_DIR.shape-review`.
  - `src/core/init.ts` - Add the workflow-to-skill map entry if it keeps a separate table.
  - `src/commands/config.ts` - Add `WORKFLOW_PROMPT_META.shape-review`.
  - `src/core/templates/workflows/apply-change.ts` - Completion invitation, non-gate behavior, embedded contract, expansion routing (both template variants).
  - `docs/commands.md`, `docs/workflows.md`, `docs/supported-tools.md` - Command reference, lifecycle, and custom workflow/skill lists.
  - Existing generation, parity, profile, init/update, and adapter tests - Expected IDs, copy, hashes, `path.join` file checks.
- Test:
  - `test/core/templates/skill-templates-parity.test.ts` - Contract strings, hashes, apply invitation.
  - `test/core/shared/skill-generation.test.ts` - Generated IDs include `shape-review` only when filtered in.
  - `test/core/shared/tool-detection.test.ts` - Skill/command name lists.
  - `test/core/profiles.test.ts` - Core omits, custom can include.
  - `test/core/profile-sync-drift.test.ts` - Deselection of `shape-review`.
  - `test/core/init.test.ts`, `test/core/update.test.ts` - Install/omit/remove using `path.join`.
  - `test/core/command-generation/adapters.test.ts` - Namespaced `/sp:shape-review` paths.

## Attachments

None.

## Dispatch Coordination

`tasks.md` is the source of detailed, checkbox-tracked work. Each top-level `# <number>. <scope>` heading is one **dispatch unit**: a logical allocation boundary the coordinator may assign to one worker/subagent, combine with compatible units, or execute inline. It is not a live subagent identity.

| Unit | Scope | Ownership | Dependencies | Assignee policy | Parallel | Handoff |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Workflow surface and registries | `shape-review.ts` and every explicit workflow-ID map | None | Prefer dedicated worker | No; defines the two exports apply will import | Full contract + apply fragment, registry edits, failing-then-passing generation tests |
| 2 | Apply invitation and embedded contract | `apply-change.ts` both variants | Unit 1 fragment API | Prefer dedicated worker | No; must import the settled fragment | Invitation copy, non-gate table, routing prose, parity tests |
| 3 | Docs and integration | `docs/`, hashes, full suite | Units 1–2 | Coordinator | No; consumes integrated diffs | Docs, refreshed hashes, build/lint/full tests |

## Execution Boundaries

### 1. Shape-review workflow surface and registries

- Deliver every detailed checkbox in this dispatch unit.
- Own the new template and all explicit ID maps. Export two strings: the full contract and a short apply fragment. Do not edit apply completion copy in this unit.
- Do not add `shape-review` to `CORE_WORKFLOWS` or invent a `code-review` workflow ID.
- Run the verification named by the detailed tasks and self-review before handoff.

### 2. Apply invitation and embedded contract

- Import the Unit 1 apply fragment. Do not copy the four-angle checklists. Do not add a fifth Final Quality Gates row or auto-run shape-review.
- Do not change simplify, verify, or design-verify gate order.

### 3. Documentation and integration

- Own user-facing docs, hash refresh, and full validation.
- Do not redefine routing or gate membership without returning the issue to Unit 1 or 2.

## Dispatch Execution

### 1. Shape-review workflow surface and registries

#### Task 1.1: Add shape-review workflow templates

**Files:**
- Create: `src/core/templates/workflows/shape-review.ts` — `getShapeReviewSkillTemplate`, `getSpShapeReviewCommandTemplate`, `SHAPE_REVIEW_CONTRACT` (full procedure including per-angle checklist bullets), and `SHAPE_REVIEW_APPLY_HANDOFF` (runnable minimum inlined into apply: invitation, host-neutral accept, four angle names, always-run plus per-angle n/a, read-only, report schema, session routing, summarizing-pass destinations, archive withdrawal).
- Test: `test/core/templates/skill-templates-parity.test.ts` — content assertions for `/sp:shape-review` analogous to simplify.

1. **Step 1: Write focused tests** — Assert the joined skill+command text contains `/sp:shape-review`, `superpowers status --change`, dirty-worktree pause, `### Surface`, `### Boundaries`, `### Model`, `### Composition`, `single-pass review, not the four-agent fan-out`, classifications `simplify` / `structural` / `skip`, destinations `simplify` / `expand-current-change` / `new-proposal` / `skip`, slash-after-apply remaining same-session, fail-closed uncertain session, summarizing pass assigns destinations, `## Shape Review Result`, cost and `file:line` or symbol, and read-only wording. Assert it does not authorize applying structural edits during the review pass. Assert `SHAPE_REVIEW_APPLY_HANDOFF` contains the four angle names, always-run plus per-angle n/a, report schema, and host-neutral accept, and does not contain the per-angle checklist bullets.
2. **Step 2: Run the focused tests** — Run `pnpm exec vitest run test/core/templates/skill-templates-parity.test.ts`; expect the new assertions to fail because the template does not exist.
3. **Step 3: Implement Task 1.1** — Port the simplify skeleton (Phase -1 scope, Phase 0 diff, Phase 1 four agents, Phase 2 summarize) but keep Phase 2 report-only. Always run all four angles. Checklists match design Decision 6. Session routing matches design Decision 5, including the conflict rule that same-session wins. Export `SHAPE_REVIEW_CONTRACT` and `SHAPE_REVIEW_APPLY_HANDOFF`.
4. **Step 4: Run focused verification** — Re-run the same Vitest command; expect the new content assertions to pass. Hash mismatches for existing templates must not be “fixed” by weakening tests.
5. **Step 5: Self-review and handoff** — Confirm both exports exist, `/sp:review` is named as a different workflow, simplify-eligible findings are classified `simplify`, and path guidance uses Superpowers CLI rather than hardcoded slashes.

#### Task 1.2: Register workflow ID maps

**Files:**
- Modify: `src/core/templates/skill-templates.ts`, `src/core/shared/skill-generation.ts`, `src/core/profiles.ts`, `src/core/shared/tool-detection.ts`, `src/core/profile-sync-drift.ts`, `src/core/init.ts`, `src/commands/config.ts`, and any other explicit `simplify`/`design-verify` map in `src/core/update.ts` / `src/core/migration.ts`.
- Test: `test/core/shared/skill-generation.test.ts`, `test/core/profiles.test.ts`, `test/core/shared/tool-detection.test.ts`.

1. **Step 1: Write focused tests** — `CORE_WORKFLOWS` still has exactly propose, explore, review, apply, archive. `ALL_WORKFLOWS` includes `shape-review`. Unfiltered skill dirs include `superpowers-shape-review`. A core filter omits it. A custom filter `['shape-review']` includes only that pair. Config metadata has a name/description.
2. **Step 2: Run the focused tests** — `pnpm exec vitest run test/core/shared/skill-generation.test.ts test/core/profiles.test.ts test/core/shared/tool-detection.test.ts`; expect failures on missing IDs.
3. **Step 3: Implement Task 1.2** — Add `shape-review` by explicit list lookup next to `design-verify` in every name-based registry. Do not glob. Do not put it in `CORE_WORKFLOWS`.
4. **Step 4: Run focused verification** — Re-run the same Vitest files; expect the new ID assertions to pass.
5. **Step 5: Self-review and handoff** — Grep `ALL_WORKFLOWS`, `SKILL_NAMES`, `COMMAND_IDS`, and `WORKFLOW_TO_SKILL_DIR` and confirm one matching entry each; report any map that still lists `design-verify` without `shape-review`.

#### Task 1.3: Install, deselect, and adapter path tests

**Files:**
- Test: `test/core/init.test.ts`, `test/core/update.test.ts`, `test/core/profile-sync-drift.test.ts`, `test/core/command-generation/adapters.test.ts`.
- Modify: those tests’ expected workflow lists and `path.join(...)` existence checks.

1. **Step 1: Write focused tests** — Custom workflows including `shape-review` create `path.join(skillsDir, 'superpowers-shape-review', 'SKILL.md')` and the adapter command path for `shape-review`. Core or a list without `shape-review` does not. Deselection removes those named files. Adapter tests include `shape-review` beside `simplify` and `design-verify` for namespaced `/sp:` output. Use `path.join` for every expected path.
2. **Step 2: Run the focused tests** — `pnpm exec vitest run test/core/init.test.ts test/core/update.test.ts test/core/profile-sync-drift.test.ts test/core/command-generation/adapters.test.ts`; expect new cases to fail until registration from 1.2 is complete (if 1.2 already landed, expect install tests to fail until fixtures include the new ID).
3. **Step 3: Implement Task 1.3** — Update fixtures and assertions; no production behavior beyond 1.2 unless an installer switch is missing.
4. **Step 4: Run focused verification** — Re-run the same Vitest files; expect install/deselect/adapter assertions to pass on macOS/Linux path joins (Windows CI uses the same `path.join` expectations).
5. **Step 5: Self-review and handoff** — Confirm tests never hardcode `/skills/superpowers-shape-review/SKILL.md` with raw slashes in expected values.

### 2. Apply invitation and embedded contract

#### Task 2.1: Add apply completion invitation

**Files:**
- Modify: `src/core/templates/workflows/apply-change.ts` — both skill and command completion blocks.
- Test: `test/core/templates/skill-templates-parity.test.ts`.

1. **Step 1: Write focused tests** — Apply templates contain the completion copy from design Contracts (archive, optional `/sp:shape-review`, host-neutral “say you want a shape review in this conversation”), still list only four Final Quality Gates rows, and do not contain a gate row for `/sp:shape-review`. Pause/issue output does not mention the shape-review invitation.
2. **Step 2: Run the focused tests** — `pnpm exec vitest run test/core/templates/skill-templates-parity.test.ts`; expect the new apply assertions to fail.
3. **Step 3: Implement Task 2.1** — After the existing archive sentence, add the optional shape-review sentence and the host-neutral acceptance sentence. Keep gate-table rows unchanged. Duplicate the same copy in both apply template variants.
4. **Step 4: Run focused verification** — Re-run the parity file; expect invitation assertions to pass.
5. **Step 5: Self-review and handoff** — Diff both apply variants and confirm wording is identical; archive recommendation still requires FQG success.

#### Task 2.2: Embed contract and session routing

**Files:**
- Modify: `src/core/templates/workflows/apply-change.ts` — post-completion instructions.
- Modify: `src/core/templates/workflows/shape-review.ts` only if the exported fragment needs an apply-handoff section.
- Test: `test/core/templates/skill-templates-parity.test.ts`.

1. **Step 1: Write focused tests** — Apply text says a same-session invitation may run the shape-review contract even when the standalone workflow is not installed; `/sp:shape-review` after apply completion stays same-session; uncertain session membership creates a new change; accepted same-session structural suggestions expand the current change and withhold archive; spec/design expansion runs `/sp:review` before implementation; new-session acceptance creates a new change with a prerequisite; implementation after expansion re-runs final quality gates.
2. **Step 2: Run the focused tests** — `pnpm exec vitest run test/core/templates/skill-templates-parity.test.ts`; expect failures until the prose exists.
3. **Step 3: Implement Task 2.2** — Concatenate `SHAPE_REVIEW_APPLY_HANDOFF` into both apply variants at generation time. Do not copy per-angle checklist bullets. Do not leave a pointer to an uninstalled skill. Instruct the coordinator not to auto-run it.
4. **Step 4: Run focused verification** — Re-run parity tests; expect routing assertions to pass.
5. **Step 5: Self-review and handoff** — Confirm apply still auto-runs only the four gates; shape-review runs only after an explicit user accept in that conversation.

#### Task 2.3: Parity for pause, core embed, and archive withdrawal

**Files:**
- Test: `test/core/templates/skill-templates-parity.test.ts`.
- Modify: apply templates if 2.1/2.2 missed pause or withdrawal wording.

1. **Step 1: Write focused tests** — Cover: paused apply omits invitation; `failed`/`blocked` gate omits invitation; core-profile apply still contains the embedded contract strings; in-place expansion “stop recommending `/sp:archive` until … gates are complete again” or equivalent.
2. **Step 2: Run the focused tests** — Same Vitest file; expect any missing phrases to fail.
3. **Step 3: Implement Task 2.3** — Fill remaining apply prose gaps without adding a gate row.
4. **Step 4: Run focused verification** — Parity file passes including apply hash updates only after copy is final.
5. **Step 5: Self-review and handoff** — Note the new apply hashes for Unit 3; do not refresh unrelated template hashes.

### 3. Documentation and integration

#### Task 3.1: Update user-facing docs

**Files:**
- Modify: `docs/commands.md`, `docs/workflows.md`, `docs/supported-tools.md`.
- Test: `test/core/templates/skill-templates-parity.test.ts` only if docs are hashed there; otherwise treat docs as review-checked.

1. **Step 1: Write focused tests** — If command docs are covered by existing doc or generation tests, extend them to mention `/sp:shape-review`. Otherwise record that 3.3’s full suite plus a grep of the three doc files is the check: they must contain `/sp:shape-review`, “does not block archive”, custom profile, host-neutral acceptance, and a warning that `/sp:review` is not an abbreviation.
2. **Step 2: Run the focused tests** — Run any existing docs tests; if none, `rg "/sp:shape-review" docs/commands.md docs/workflows.md docs/supported-tools.md` and expect no matches yet.
3. **Step 3: Implement Task 3.1** — Add the command to the expanded-workflow table and a reference section mirroring `/sp:simplify`. In `docs/supported-tools.md` and the commands/workflows core lists touched by this task, write core as propose, explore, review, apply, archive. Add `shape-review` / `superpowers-shape-review` to custom lists only. Describe four angles, invitation, host-neutral acceptance, and session routing.
4. **Step 4: Run focused verification** — Confirm the three docs mention the command and the `/sp:review` distinction; core lists still omit `shape-review`.
5. **Step 5: Self-review and handoff** — Core getting-started lists must still omit shape-review.

#### Task 3.2: Refresh hashes and registry snapshots

**Files:**
- Modify: `test/core/templates/skill-templates-parity.test.ts` hash maps and any snapshots that list workflow IDs.

1. **Step 1: Write focused tests** — Already present from Units 1–2; this task updates expected hashes after copy is stable.
2. **Step 2: Run the focused tests** — `pnpm exec vitest run test/core/templates/skill-templates-parity.test.ts`; expect hash mismatches for apply and new shape-review templates.
3. **Step 3: Implement Task 3.2** — Recompute hashes with the same helper the test file uses; add `getShapeReviewSkillTemplate` / `getSpShapeReviewCommandTemplate` / `superpowers-shape-review` entries. Do not rewrite hashes for untouched templates.
4. **Step 4: Run focused verification** — Parity file passes. Grep confirms core workflow tests still expect five names.
5. **Step 5: Self-review and handoff** — List every hash key added or changed.

#### Task 3.3: Full validation

**Files:**
- Test: full suite; record in `test-plan.md`.

1. **Step 1: Write focused tests** — No new tests; this task runs the repository canonical suite.
2. **Step 2: Run the focused tests** — Run `pnpm exec vitest run test/core/templates/skill-templates-parity.test.ts test/core/shared/skill-generation.test.ts test/core/profiles.test.ts test/core/init.test.ts test/core/update.test.ts` as a preflight; expect pass.
3. **Step 3: Implement Task 3.3** — Run `pnpm run build`, `pnpm run lint`, and `pnpm test`. Fix only defects introduced by this change.
4. **Step 4: Run focused verification** — Build, lint, and full tests pass. Cross-platform path assertions remain `path.join`-based.
5. **Step 5: Self-review and handoff** — Record commands and outcomes in `test-plan.md` Test Hardening later; one cross-unit review after integration.

## Spec coverage

- Shape-review invocation, core omit, custom select, dirty scope, missing name → Unit 1.
- Four angles, fan-out/single-pass, n/a, read-only, routing to simplify/expand/new/skip, session routing, report → Unit 1 template + Unit 2 apply embed.
- Apply invitation, non-gate, pause omit, core embed, archive withdrawal, FQG rerun, ignore invitation → Unit 2.
- Docs distinction → Unit 3.

No TBD/TODO placeholders. No fifth gate. No core install.
