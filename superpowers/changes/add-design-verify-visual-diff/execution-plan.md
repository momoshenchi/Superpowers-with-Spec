## File Structure

Commands use `pnpm` to match `pnpm-lock.yaml` and `.github/workflows/ci.yml`. `package.json` scripts also invoke `pnpm`.

- Create:
  - None. No new workflow file or schema artifact.
- Modify:
  - `src/core/templates/workflows/design-verify.ts` — After capture, Before consumption, After-only fallback, report fields, reconstruction ban.
  - `src/core/templates/workflows/final-quality-gates.ts` — Design verify bullet aligned with the same visual-diff rules; still four gates.
  - `src/core/templates/workflows/apply-change.ts` — Both skill and command variants: apply-start runtime Before capture window, suffix-list prediction, non-blocking capture failure.
  - `docs/commands.md` — `/sp:design-verify` section.
  - `docs/workflows.md` — Apply / Design Verify paragraphs.
- Test:
  - `test/core/templates/skill-templates-parity.test.ts` — Instruction-string pins and hash refresh for design-verify, apply, and FQG copy.
  - `test/core/templates/invariants-remediations.test.ts` — Only if FQG string assertions there must stay true; do not weaken existing remediations pins.

## Attachments

None.

## Dispatch Coordination

`tasks.md` is the source of detailed, checkbox-tracked work. Each top-level `# <number>. <scope>` heading is one **dispatch unit**: a logical allocation boundary the coordinator may assign to one worker/subagent, combine with compatible units, or execute inline. It is not a live subagent identity.

| Unit | Scope | Ownership | Dependencies | Assignee policy | Parallel | Handoff |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Design Verify After capture and report | `design-verify.ts`, Design verify bullet in `final-quality-gates.ts`, parity assertions for those strings | None | Prefer dedicated worker; may combine with unit 2 | No; shares `skill-templates-parity.test.ts` with unit 2 | Updated DV + FQG text, failing-then-passing content pins |
| 2 | Apply-start runtime Before capture | `apply-change.ts` both variants, apply parity assertions | None logically; serialize after or with unit 1 because of the shared parity file | Prefer dedicated worker; may combine with unit 1 | No; shared test file | Capture-window prose in both apply variants, passing apply pins |
| 3 | Docs, hashes, validation | `docs/`, hash constants in parity test, full suite | Units 1–2 | Coordinator | No; consumes integrated diffs | Docs, refreshed hashes, build/lint/full tests |

## Execution Boundaries

### 1. Design Verify After capture and report

- Deliver every detailed checkbox in this dispatch unit.
- Own Design Verify skill/command text and the apply-delegated Design verify bullet. Do not edit apply-start Before capture (unit 2) or user docs (unit 3).
- Do not add a fifth FQG row or a `/sp:visual-diff` command.
- Run the verification named by the detailed tasks and self-review before handoff.

### 2. Apply-start runtime Before capture

- Own both apply template variants' capture-window instructions. Do not rewrite Design Verify report format except to keep phrases consistent if a shared sentence is required.
- Do not block apply when Before capture cannot run. Do not instruct a second worktree.
- Predict UI only from completed artifacts plus the explicit suffix list in design Decision 5.

### 3. Documentation and integration

- Own user-facing docs, hash refresh, and full validation.
- Do not change capture or report rules without returning the issue to unit 1 or 2.

## Dispatch Execution

### 1. Design Verify After capture and report

#### Task 1.1: Extend Design Verify skill and command

**Files:**
- Modify: `src/core/templates/workflows/design-verify.ts` — execution steps, output format.
- Test: `test/core/templates/skill-templates-parity.test.ts` — joined skill+command content.

1. **Step 1: Write or extend focused tests** — Assert joined Design Verify text contains `attachments/visual-diff/after/`, `path.join`, `Before: missing` or Before summary `missing`, `runtime`, `illustrative`, unexplained images are not Before, default comparison `runtime` with supplemental illustrative, visual-diff table headers `Route / state | Before kind | Before | After | Default comparison`, mixed-row `missing`, and forbids second worktree / merge-base checkout reconstruction. Assert it still contains `If UI scope has no repository visual design source, report \`blocked\``, `not applicable` for non-UI, and does not treat missing Before as `blocked` or `failed`. Assert screenshots still do not complete Manual Coverage.
2. **Step 2: Run the focused tests** — Run `pnpm exec vitest run test/core/templates/skill-templates-parity.test.ts`; expect the new assertions to fail because the phrases are absent.
3. **Step 3: Implement Task 1.1** — Add an execution step after runtime inspection: write After screenshots with `path.join(changeDir, 'attachments', 'visual-diff', 'after', fileName)`; discover Before as `runtime` files under `attachments/visual-diff/before/` plus artifact-explained illustrative images (skip unexplained); present the visual-diff table (one row per route/state, mixed missing allowed); After-only when missing; never reconstruct. Extend the output template with Before summary and the table from design Contracts. Keep existing DESIGN.md and retry sections.
4. **Step 4: Run focused verification** — Re-run the same Vitest command; expect new content assertions to pass. Do not “fix” unrelated hash failures by deleting old pins.
5. **Step 5: Self-review and handoff** — Confirm non-UI still skips capture; missing DESIGN.md still `blocked`; Markdown targets begin `attachments/`.

#### Task 1.2: Align apply-delegated Design verify bullet

**Files:**
- Modify: `src/core/templates/workflows/final-quality-gates.ts` — item 4 Design verify paragraph only.
- Test: `test/core/templates/skill-templates-parity.test.ts` (apply/FQG joined content) and existing assertions in `test/core/templates/invariants-remediations.test.ts` if they snapshot FQG text.

1. **Step 1: Write or extend focused tests** — Assert `getFinalQualityGateInstructions()` (and apply templates that inline it) still contain exactly four gates including `Design verify (rounds 1–4)`, plus After capture / `Before: missing` / no second worktree. Assert the completion gate table still has only code review, simplify, verify, design-verify rows.
2. **Step 2: Run the focused tests** — `pnpm exec vitest run test/core/templates/skill-templates-parity.test.ts test/core/templates/invariants-remediations.test.ts`; expect new FQG phrases to fail.
3. **Step 3: Implement Task 1.2** — Extend the Design verify bullet so the delegated worker captures After, consumes Before attachments, After-only if missing, does not reconstruct, and still `blocked` on missing runtime or visual source. Do not add a fifth numbered gate.
4. **Step 4: Run focused verification** — Re-run those Vitest files; expect new assertions to pass and remediations pins to remain green.
5. **Step 5: Self-review and handoff** — Diff FQG vs standalone Design Verify for contradictory rules; they must agree on missing Before.

#### Task 1.3: Pin reconstruction ban and Manual Coverage boundary

**Files:**
- Test: `test/core/templates/skill-templates-parity.test.ts`.
- Modify: `design-verify.ts` / `final-quality-gates.ts` only if Step 2 shows a phrase gap after 1.1–1.2.

1. **Step 1: Write or extend focused tests** — Negative pins: Design Verify and FQG text must not contain instructions to `git worktree add` a visual-before tree, must not say missing Before is `BLOCKER`, must not say Before/After images complete a Manual Coverage row. Positive pin: `Before: missing` is recorded in the report.
2. **Step 2: Run the focused tests** — Same Vitest parity file; fail if 1.1–1.2 omitted a negative pin.
3. **Step 3: Implement Task 1.3** — Add any missing one-line prohibitions; no new files.
4. **Step 4: Run focused verification** — Re-run parity; all new pins pass.
5. **Step 5: Self-review and handoff** — List the exact phrases unit 2 should not contradict.

### 2. Apply-start runtime Before capture

#### Task 2.1: Add capture window to both apply variants

**Files:**
- Modify: `src/core/templates/workflows/apply-change.ts` — `getApplyChangeSkillTemplate` and `getSpApplyCommandTemplate`.
- Test: `test/core/templates/skill-templates-parity.test.ts`.

1. **Step 1: Write or extend focused tests** — Both apply variants contain: capture window `open`/`closed`; UI-baseline evidence commands (`git diff --name-only` merge-base, unstaged, cached; `git status --porcelain`); reused worktree defaults `closed`; fail-closed when merge-base unknown; write `attachments/visual-diff/before/`; `path.join`; suffix list `.html`, `.css`, `.scss`, `.sass`, `.less`, `.vue`, `.svelte`, `.jsx`, `.tsx`; named-route union; documented entry fallback; continue implementation if runtime/browser missing; explained human `attachments/` images are illustrative Before. Assert they do not block apply on failed Before capture and do not add a fifth FQG row.
2. **Step 2: Run the focused tests** — `pnpm exec vitest run test/core/templates/skill-templates-parity.test.ts`; expect failures until the step exists. Insert the new step after “Show current progress” and before “Implement tasks” so it cannot be read as post-implementation.
3. **Step 3: Implement Task 2.1** — Duplicate the same fail-closed capture-window contract in both variants. UI prediction is explicit artifact reading plus suffix list lookup, not glob/regex. Keep “Never start implementation on main/master without explicit user consent.”
4. **Step 4: Run focused verification** — Re-run parity; new apply assertions pass on both skill and command strings.
5. **Step 5: Self-review and handoff** — Diff the two apply variants and confirm capture wording matches; Windows guidance is `path.join`, not `'attachments\\visual-diff'`.

#### Task 2.2: Apply parity for non-reconstruction and illustrative Before

**Files:**
- Test: `test/core/templates/skill-templates-parity.test.ts`.
- Modify: `apply-change.ts` only if a required phrase is still missing.

1. **Step 1: Write or extend focused tests** — Apply text must not instruct a second detach worktree for Before. It must mention illustrative Before via artifact-explained attachments, that unexplained images are not Before, non-UI skips capture, and fail-closed closed window. Design Verify (if not already pinned in 1.1) must pin runtime-over-illustrative default and artifact override.
2. **Step 2: Run the focused tests** — Same Vitest file; expect fail if 2.1 omitted these sentences.
3. **Step 3: Implement Task 2.2** — Add the missing sentences to both variants.
4. **Step 4: Run focused verification** — Re-run parity; pass.
5. **Step 5: Self-review and handoff** — Confirm apply still invites only archive + optional shape-review after FQG; visual pack is not a separate invitation.

### 3. Docs, hashes, and validation

#### Task 3.1: Update user-facing docs

**Files:**
- Modify: `docs/commands.md` `/sp:design-verify` section; `docs/workflows.md` apply completion / design-verify paragraphs.

1. **Step 1: Write or extend focused tests** — If docs are not currently string-tested, skip a new test file; verification is grep in Step 4. Do not add a docs test harness unless one already exists for these sections.
2. **Step 2: Run the focused tests** — N/A if no docs unit tests; record that the baseline is the current markdown.
3. **Step 3: Implement Task 3.1** — Document Before/After attachments, human illustrative Before, After-only when Before is missing, and that this is not a fifth gate. Do not invent `/sp:visual-diff`.
4. **Step 4: Run focused verification** — Grep `docs/commands.md` and `docs/workflows.md` for `visual-diff`, `Before: missing`, and confirm no fifth-gate wording.
5. **Step 5: Self-review and handoff** — Docs match design Goals and Contracts.

#### Task 3.2: Refresh parity hashes with path.join-safe expectations

**Files:**
- Modify: `test/core/templates/skill-templates-parity.test.ts` hash constants for `getDesignVerifySkillTemplate`, `superpowers-design-verify`, apply templates, and any FQG-inlined apply hash that changes.

1. **Step 1: Write or extend focused tests** — Existing hash tests will fail after units 1–2; that is the red baseline. Confirm no assertion compares filesystem paths with hardcoded `/` or `\\`; expected paths in this repo already use `path.join`.
2. **Step 2: Run the focused tests** — `pnpm exec vitest run test/core/templates/skill-templates-parity.test.ts`; record hash mismatches as expected until refresh.
3. **Step 3: Implement Task 3.2** — Recompute hashes the same way the test file already does (do not invent a new hasher). Only update hashes for templates this change edited.
4. **Step 4: Run focused verification** — Re-run parity; all hashes and content pins pass.
5. **Step 5: Self-review and handoff** — No unrelated template hashes changed.

#### Task 3.3: Full validation

**Files:**
- Test: full suite via package scripts. Record evidence in `test-plan.md`.

1. **Step 1: Write or extend focused tests** — None new; use repository scripts.
2. **Step 2: Run the focused tests** — `pnpm exec vitest run test/core/templates/skill-templates-parity.test.ts test/core/templates/invariants-remediations.test.ts` still green.
3. **Step 3: Implement Task 3.3** — No product edits unless a suite failure is caused by this change.
4. **Step 4: Run focused verification** — `pnpm run build`, `pnpm run lint`, then the canonical `package.json` test script (`pnpm test` or `pnpm run test` as defined). Cross-platform path behavior is covered by existing `path.join` tests; this change adds no Node filesystem screenshot writer, so Windows CI is the existing matrix rather than a new screenshot runner.
5. **Step 5: Self-review and handoff** — Map specs requirements to instruction pins; record commands/results in `test-plan.md`; hand off to the single final cross-unit review after integration.

## Spec coverage (author checklist)

| Requirement | Dispatch unit |
|---|---|
| Apply captures runtime Before before UI edits | 2.1 |
| Capture window fail-closed / reused worktree closed | 2.1 |
| Named routes union and documented entry fallback | 2.1 |
| Capture uses platform-neutral paths | 2.1, 3.2 |
| Human attachments are illustrative Before | 2.1, 2.2 |
| Unexplained attachment is not Before | 1.1, 2.2 |
| Runtime vs illustrative precedence | 1.1, 2.2 |
| Per-route visual-diff table / mixed missing | 1.1 |
| Design Verify captures After | 1.1, 1.2 |
| Non-UI skips After | 1.1 |
| Present Before/After when Before exists | 1.1 |
| New route / missing Before After-only | 1.1, 1.3 |
| No second worktree reconstruction | 1.3, 2.2 |
| Missing Before does not block archive | 1.2 (no fifth gate / not blocked) |
| DESIGN.md and runtime blockers unchanged | 1.1, 1.2 |
| Screenshots ≠ Manual Coverage | 1.3 |
| Docs | 3.1 |

No TBD/TODO placeholders. No orphan tasks. Report field names match design Contracts (`Before`, `After`, kinds `runtime`/`illustrative`/`missing`).
