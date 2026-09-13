## File Structure

- Modify:
  - `skills/using-superpowers/SKILL.md` — router-only root skill
  - `skills/using-superpowers/reference/` — schema/scoring dumps moved here
  - `skills/test-driven-development/SKILL.md` — TDD trigger and exceptions
  - `skills/systematic-debugging/SKILL.md` — localized vs unknown-cause
  - `skills/verification-before-completion/SKILL.md` — matching-stage evidence
  - `skills/subagent-driven-development/SKILL.md` — Apply dispatch only
  - `skills/when-to-dispatch-code-review/SKILL.md` — timing-only; Apply owns Proposal-path review
  - `skills/finishing-a-development-branch/SKILL.md` — Git-aware Step 1; keep merge/PR/keep/discard
  - `skills/using-git-worktrees/SKILL.md` — default `.worktrees/`; keep gitignore
  - `src/core/templates/workflows/explore.ts` — Explore vs debug descriptions
  - `writing-plan/SKILL.md` — remove from default discovery
  - `CLAUDE.md` — drop missing skill
  - `src/core/templates/workflows/propose.ts` — confirmation protocol
  - `src/core/templates/workflows/apply-change.ts` — context slice + Hardening bind kept
  - `src/core/templates/workflows/final-quality-gates.ts` — spawn fallback + Git-aware stage
  - `src/core/templates/workflows/verify-change.ts` — change targeting + suite stage
  - `src/core/templates/workflows/archive-change.ts` — targeting + incomplete-gate confirm
  - `src/core/templates/workflows/sync-specs.ts` — targeting
  - `src/core/templates/workflows/change-review.ts` — spawn fallback
  - `docs/workflows.md`, `docs/commands.md` — human docs
  - `schemas/spec-driven/templates/execution-plan.md` — if it still fail-closes to complete suite
- Test:
  - `test/core/using-superpowers-guidance.test.ts`
  - `test/core/templates/skill-templates-parity.test.ts`
  - `test/core/templates/` propose/apply/verify/gate tests
  - `test/docs/` workflow/command string tests if present

## Dispatch Coordination

| Unit | Scope | Ownership | Dependencies | Assignee policy | Parallel | Handoff |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Static skills and CLAUDE.md | `skills/**`, `writing-plan/SKILL.md`, `CLAUDE.md`, `src/core/templates/workflows/explore.ts` | None | Prefer dedicated worker | Yes vs unit 2 | Skill files, focused skill tests |
| 2 | Propose/Apply/gates templates | `src/core/templates/workflows/propose.ts`, `apply-change.ts`, `final-quality-gates.ts`, `verify-change.ts` suite-stage sentence | None | Prefer dedicated worker | Yes vs unit 1 | Template strings, I1–I3 pins |
| 3 | Verify/archive/sync/docs | `verify-change.ts`, `archive-change.ts`, `sync-specs.ts`, `change-review.ts`, `docs/workflows.md`, `docs/commands.md` | Unit 2 for shared gate helper wording | May combine with unit 2 | No with unit 2 (shared `final-quality-gates.ts`) | Targeting + docs + I9 |
| 4 | Tests and parity | `test/core/**`, generated projections | Units 1–3 | Execute after 1–3 | No | Green focused + Git-aware related tests |

## Execution Boundaries

### 1. Static skills and project agent docs

- Deliver every detailed checkbox in this dispatch unit.
- Do not edit `.cursor/skills/full-qa-test/SKILL.md`.
- Do not inject `GPT6-guide.md`.

### 2. Propose, Apply, and quality-gate templates

- Keep Hardening → `full-qa-test` (I1).
- Change spawn and Git-aware suite stage only in `final-quality-gates.ts` plus Apply prose that duplicates it.

### 3. Verify, archive, sync, and docs

- Reuse targeting wording across verify/archive/sync; do not invent a third protocol.
- Task 3.2 then Task 3.4 both edit `change-review.ts`; keep them sequential. Task 3.4 must not weaken I1.

### 4. Tests and projection refresh

- Update pins; do not add a new generator.

## Dispatch Execution

### 1. Static skills and project agent docs

#### Task 1.1: Rewrite using-superpowers as a router

**Files:**
- Modify: `skills/using-superpowers/SKILL.md`
- Create: `skills/using-superpowers/reference/schema-and-workload.md` (moved dump)
- Test: `test/core/using-superpowers-guidance.test.ts`

1. **Step 1: Write or extend focused tests**
   - **Spec bound:** `### Requirement: Skills SHALL load only for the current task` / `#### Scenario: Entry skill does not preload the library`; `### Requirement: Root skills SHALL disclose detail on demand` / `#### Scenario: using-superpowers keeps mode selection in root`; `### Requirement: Direct work SHALL not fall closed to a suite`; I4; I8.
   - **Test location:** `test/core/using-superpowers-guidance.test.ts` — `describe('using-superpowers')` / `it('does not require checking skills before every response')`.
   - **Case table:** Entry skill does not preload | unit | `it('does not require checking skills before every response')` | skill file text | not.toContain('before any response or action') ★; Mode selection remains | unit | `it('still names Direct Modification and Proposal')` | skill file | toContain('Direct Modification'); Direct not complete suite | unit | `it('does not fall closed to the complete suite')` | skill | not.toMatch(/fall closed to the complete suite/) ★.
   - **Test skeleton:**
     ```ts
     import { readFileSync } from 'node:fs';
     import path from 'node:path';
     import { fileURLToPath } from 'node:url';
     import { describe, expect, it } from 'vitest';
     const skill = readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), '../../skills/using-superpowers/SKILL.md'), 'utf8');
     describe('using-superpowers', () => {
       it('does not require checking skills before every response', () => {
         expect(skill).not.toMatch(/before any response or action/i);
         expect(skill).not.toMatch(/starting any conversation/i);
         expect(skill).not.toMatch(/fall closed to the complete suite/i);
       });
     });
     ```
2. **Step 2: Run the focused tests** — `pnpm exec vitest run test/core/using-superpowers-guidance.test.ts`. Expect fail: old phrase still present or new it missing.
3. **Step 3: Implement Task 1.1**
   - **Change anchor:** YAML `description` and opening sections of `skills/using-superpowers/SKILL.md`.
   - **Design carried:** I4, I5, I8; Decision 2 (static skills edited in place); Decision 18.
   - **Implementation approach:** Root file: two work modes, promotion, pause/product-boundary only. Move schema YAML, directory tree, scoring table to `reference/schema-and-workload.md`. Description: use when choosing Direct vs Proposal, not at every conversation start. Direct Modification verification: Git-aware / matching-stage; delete `fall closed to the complete suite`.
   - **Edges and failures:** Explicit Proposal request still forces Proposal mode (existing work-mode spec).
   - **Out of scope:** Do not rewrite Apply gates here.
4. **Step 4: Run focused verification** — Re-run Step 2. Then Git-aware related tests if supported.
5. **Step 5: Self-review and handoff** — Confirm I4; no `GPT6-guide` required read.

Implementation Notes: Root skill is a Direct vs Proposal router. Scoring, schema YAML, and directory tree moved to `reference/schema-and-workload.md`. Direct Modification uses Git-aware / matching-stage; `fall closed to the complete suite` is gone.

#### Task 1.2: Narrow TDD skill

**Files:**
- Modify: `skills/test-driven-development/SKILL.md`
- Test: new or existing TDD guidance test under `test/core/`

1. **Step 1: Write or extend focused tests**
   - **Spec bound:** `### Requirement: TDD SHALL cover observable automated behavior` / both scenarios.
   - **Test location:** `test/core/tdd-guidance.test.ts` — `it('does not apply Iron Law to every feature')`.
   - **Case table:** Copy-only skip | unit | `it('allows documentation-only edits without a failing test')` | skill text | not.toMatch(/NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST/) as always-on ★.
   - **Test skeleton:**
     ```ts
     import { readFileSync } from 'node:fs';
     import path from 'node:path';
     import { describe, expect, it } from 'vitest';
     const tdd = readFileSync(path.join(process.cwd(), 'skills/test-driven-development/SKILL.md'), 'utf8');
     it('scopes TDD to observable automated behavior', () => {
       expect(tdd).toMatch(/observable behavior/i);
       expect(tdd).not.toMatch(/Use when implementing any feature or bugfix/);
       expect(tdd).not.toMatch(/Fall closed to the complete suite/);
     });
     ```
2. **Step 2: Run the focused tests** — `pnpm exec vitest run test/core/tdd-guidance.test.ts`.
3. **Step 3: Implement Task 1.2**
   - **Change anchor:** frontmatter `description`, When to Use, Iron Law block.
   - **Design carried:** TDD requirement in agent-instruction-autonomy.
   - **Implementation approach:** Keep red-green for behavior; list config/generated/copy/type-narrow as in-skill exceptions without asking the user. Replace "Fall closed to the complete suite" with Git-aware related tests or the task's focused command; do not require a complete suite at task level.
   - **Edges and failures:** New CLI flag still TDD.
   - **Out of scope:** Do not change Vitest config.
4. **Step 4: Run focused verification** — Re-run Step 2.
5. **Step 5: Self-review and handoff** — Description no longer says any feature or bugfix.

#### Task 1.3: Narrow systematic-debugging

**Files:**
- Modify: `skills/systematic-debugging/SKILL.md`
- Test: `test/core/debug-investigation-checkpoint-guidance.test.ts` (update pins)

1. **Step 1: Write or extend focused tests**
   - **Spec bound:** `### Requirement: Debugging SHALL skip four-phase gates when localized`; `### Requirement: Debugging SHALL not require reading every line`.
   - **Test location:** existing debug guidance test — add `it('does not require four phases for a named assertion failure')`.
   - **Case table:** Localized skip | unit | new it | skill text | not.toMatch(/You MUST complete each phase before proceeding/) as universal ★.
   - **Test skeleton:**
     ```ts
     const debug = readFileSync(path.join(process.cwd(), 'skills/systematic-debugging/SKILL.md'), 'utf8');
     expect(debug).toMatch(/already identified/i);
     expect(debug).not.toMatch(/Use when encountering any bug, test failure, or unexpected behavior/);
     expect(debug).not.toMatch(/read every line/i);
     expect(debug).not.toMatch(/read reference implementation COMPLETELY/i);
     ```
2. **Step 2: Run the focused tests** — `pnpm exec vitest run test/core/debug-investigation-checkpoint-guidance.test.ts`.
3. **Step 3: Implement Task 1.3**
   - **Change anchor:** description, When to Use, Iron Law, phase MUST.
   - **Design carried:** Debugging requirement.
   - **Implementation approach:** Root: when unknown/unstable/failed patches; point to existing `root-cause-tracing.md` for phases. Keep checkpoint for multi-turn unknown-cause work. Delete `read reference implementation COMPLETELY` and `Don't skim - read every line`. Grep `skills/systematic-debugging/reference/` and remove those sentences if present; do not relocate them.
   - **Edges and failures:** Intermittent flake still investigates. Comparing differing slices remains allowed.
   - **Out of scope:** Do not delete reference files that still hold useful phase detail. Explore vs debug split is Task 1.11.
4. **Step 4: Run focused verification** — Re-run Step 2.
5. **Step 5: Self-review and handoff** — Existing checkpoint tests updated, not deleted without replacement.

#### Task 1.4: Rewrite verification-before-completion

**Files:**
- Modify: `skills/verification-before-completion/SKILL.md`
- Test: `test/core/verification-before-completion-guidance.test.ts` (create if missing)

1. **Step 1: Write or extend focused tests**
   - **Spec bound:** `### Requirement: Verification SHALL use matching-stage evidence`.
   - **Test location:** `test/core/verification-before-completion-guidance.test.ts`.
   - **Case table:** No complete suite as evidence | unit | `it('does not define evidence as the complete canonical suite')` | skill | not.toMatch(/complete canonical suite/) ★.
   - **Test skeleton:**
     ```ts
     const v = readFileSync(path.join(process.cwd(), 'skills/verification-before-completion/SKILL.md'), 'utf8');
     expect(v).toMatch(/matching-stage|current stage/i);
     expect(v).not.toMatch(/Execute the FULL command \(fresh, complete\)/);
     ```
2. **Step 2: Run the focused tests**.
3. **Step 3: Implement Task 1.4**
   - **Change anchor:** Iron Law, Gate Function, Tests pattern.
   - **Design carried:** verification requirement; test-scope-selection task-level.
   - **Implementation approach:** Three sentences: identify stage command, run it this turn, read output. Point to Git-aware / test-plan rules instead of complete suite.
   - **Edges and failures:** Empty related selection is not a task pass.
   - **Out of scope:** Do not change Hardening full-qa bind.
4. **Step 4: Run focused verification**.
5. **Step 5: Self-review and handoff**.

#### Task 1.5: Shrink subagent-driven-development

**Files:**
- Modify: `skills/subagent-driven-development/SKILL.md`
- Test: guidance string test

1. **Step 1: Write or extend focused tests**
   - **Spec bound:** `### Requirement: SDD SHALL not duplicate Apply`; `### Requirement: Workers SHALL receive current-unit context`.
   - **Test location:** `test/core/sdd-guidance.test.ts`.
   - **Case table:** No five-file preload | unit | `it('does not require reading all artifacts once')` | skill | not.toMatch(/Read the proposal, specs, design/) ★.
   - **Test skeleton:**
     ```ts
     const sdd = readFileSync(path.join(process.cwd(), 'skills/subagent-driven-development/SKILL.md'), 'utf8');
     expect(sdd).not.toMatch(/Read the proposal, specs, design, `tasks.md`, and `execution-plan.md` once/);
     expect(sdd).toMatch(/dispatch unit/i);
     ```
2. **Step 2: Run the focused tests**.
3. **Step 3: Implement Task 1.5**
   - **Change anchor:** Setup steps 1–3, Final Quality Gates copy.
   - **Design carried:** SDD requirement; subagent-work-package-execution added requirement.
   - **Implementation approach:** Keep continuous execution (persist-until-done). Replace artifact preload with current-unit package. Delete restated gate paragraphs; point to Apply.
   - **Edges and failures:** Inline execution when no spawn (modified flexible allocation).
   - **Out of scope:** Do not remove remediations from Apply.
4. **Step 4: Run focused verification**.
5. **Step 5: Self-review and handoff**.

#### Task 1.6: Omit writing-plans from default install

**Files:**
- Modify or delete discovery of `writing-plan/SKILL.md`
- Test: init/update skill list tests if they enumerate static skills

1. **Step 1: Write or extend focused tests**
   - **Spec bound:** `### Requirement: Default installs SHALL omit writing-plans`.
   - **Test location:** `test/core/writing-plans-retired.test.ts`.
   - **Case table:** Live SKILL.md gone | unit | `it('does not keep writing-plan/SKILL.md as a discoverable skill')` | `writing-plan/SKILL.md` | not exists; retired path under `docs/archive/` exists ★.
   - **Test skeleton:**
     ```ts
     import { existsSync } from 'node:fs';
     import path from 'node:path';
     expect(existsSync(path.join(process.cwd(), 'writing-plan/SKILL.md'))).toBe(false);
     expect(existsSync(path.join(process.cwd(), 'docs/archive/writing-plans-skill.md'))).toBe(true);
     ```
2. **Step 2: Run the focused tests**.
3. **Step 3: Implement Task 1.6**
   - **Change anchor:** `writing-plan/SKILL.md`.
   - **Design carried:** writing-plans requirement.
   - **Implementation approach:** Move the file to `docs/archive/writing-plans-skill.md` (or delete if archive copy is enough). Strip YAML skill frontmatter or rename away from `SKILL.md` so hosts do not auto-discover it.
   - **Edges and failures:** Do not add it to `SKILL_NAMES`.
   - **Out of scope:** Do not add executing-plans.
4. **Step 4: Run focused verification**.
5. **Step 5: Self-review and handoff**.

#### Task 1.7: Fix CLAUDE.md and keep AGENTS.md empty

**Files:**
- Modify: `CLAUDE.md`
- Test: `test/docs/` or a small CLAUDE.md assertion

1. **Step 1: Write or extend focused tests**
   - **Spec bound:** `### Requirement: Project docs SHALL not list missing skills`; `### Requirement: No Astra-only agent ruleset`.
   - **Test location:** `test/docs/claude-md-skills.test.ts`.
   - **Case table:** No dispatching-parallel-agents | unit | `it('does not list dispatching-parallel-agents')` | CLAUDE.md | not.toContain ★; AGENTS empty or short | unit | `it('does not require GPT6-guide')` | AGENTS.md | not.toMatch(/GPT6-guide/).
   - **Test skeleton:**
     ```ts
     const claude = readFileSync(path.join(process.cwd(), 'CLAUDE.md'), 'utf8');
     expect(claude).not.toContain('dispatching-parallel-agents');
     const agents = readFileSync(path.join(process.cwd(), 'AGENTS.md'), 'utf8');
     expect(agents).not.toMatch(/GPT6-guide/);
     ```
2. **Step 2: Run the focused tests**.
3. **Step 3: Implement Task 1.7**
   - **Change anchor:** Skills list in `CLAUDE.md`.
   - **Design carried:** I5.
   - **Implementation approach:** Delete the missing skill bullet. Do not add Astra section to AGENTS.md.
   - **Edges and failures:** Keep real skills that exist.
   - **Out of scope:** Do not rewrite CLAUDE.md into a workflow.
4. **Step 4: Run focused verification**.
5. **Step 5: Self-review and handoff**.

#### Task 1.8: Narrow remaining skill descriptions

**Files:**
- Modify: `skills/security-review/SKILL.md` YAML description only
- Explicitly skip `skills/full-qa-test/SKILL.md` and `.cursor/skills/full-qa-test/SKILL.md`

1. **Step 1: Write or extend focused tests**
   - **Spec bound:** Skills load only for current task (description precision).
   - **Test location:** `test/core/skill-description-triggers.test.ts`.
   - **Case table:** security-review not encyclopedia | unit | `it('security-review description requires an explicit security request')` | frontmatter | not.toMatch(/find bugs/) as a generic trigger ★.
   - **Test skeleton:**
     ```ts
     const sec = readFileSync(path.join(process.cwd(), 'skills/security-review/SKILL.md'), 'utf8');
     expect(sec).toMatch(/^description:.*security/m);
     expect(sec.split('\n').find(l => l.startsWith('description:'))!.length).toBeLessThan(400);
     ```
2. **Step 2: Run the focused tests**.
3. **Step 3: Implement Task 1.8**
   - **Change anchor:** YAML `description` in `skills/security-review/SKILL.md` only.
   - **Design carried:** Decision 1 (do not process cursor full-qa copy).
   - **Implementation approach:** Replace the encyclopedia-length description with a short trigger: use when the user explicitly asks for a security review or vulnerability scan. Leave full-qa-test body untouched.
   - **Edges and failures:** User saying "六维测试" may still match full-qa-test; that is intended.
   - **Out of scope:** Tasks 1.9–1.11 own code-review timing, finishing-a-branch, and Explore; `.cursor/skills/full-qa-test/SKILL.md`.
4. **Step 4: Run focused verification**.
5. **Step 5: Self-review and handoff**.

#### Task 1.9: Slim when-to-dispatch-code-review to timing

**Files:**
- Modify: `skills/when-to-dispatch-code-review/SKILL.md`
- Test: `test/core/when-to-dispatch-code-review-guidance.test.ts`

1. **Step 1: Write or extend focused tests**
   - **Spec bound:** `### Requirement: Code-review dispatch SHALL not duplicate Apply`.
   - **Test location:** `test/core/when-to-dispatch-code-review-guidance.test.ts`.
   - **Case table:** Apply owns integrated review | unit | `it('does not schedule another complete review around Apply')` | skill | toMatch(/Apply's (final )?code-review gate/) and not.toMatch(/severity or retry policy/) as a restated Apply recipe ★.
   - **Test skeleton:**
     ```ts
     const review = readFileSync(path.join(process.cwd(), 'skills/when-to-dispatch-code-review/SKILL.md'), 'utf8');
     expect(review).toMatch(/single integrated/i);
     expect(review).toMatch(/Direct Modification/);
     expect(review).not.toMatch(/P0|retry the gate|severity scale of Apply/i);
     ```
2. **Step 2: Run the focused tests**.
3. **Step 3: Implement Task 1.9**
   - **Change anchor:** YAML `description`, Proposal → Review → Apply section, Avoid Duplicate Review.
   - **Design carried:** Decision 17.
   - **Implementation approach:** Keep Direct Modification timing (user request, merge-ready high risk, policy). On Proposal path, one sentence: Apply's final code-review gate is the integrated review; do not add another complete review around it. Delete restated Apply severity/retry paragraphs. Keep `code-reviewer.md` as the portable prompt.
   - **Edges and failures:** SDD through Apply still hands off to Apply's gate; do not add a standalone SDD complete review.
   - **Out of scope:** Do not add `/sp:code-review`. Do not rewrite Apply's gate in `final-quality-gates.ts` here.
4. **Step 4: Run focused verification**.
5. **Step 5: Self-review and handoff**.

#### Task 1.10: Align finishing-a-development-branch with Git-aware tests

**Files:**
- Modify: `skills/finishing-a-development-branch/SKILL.md`
- Test: `test/core/finishing-a-development-branch-guidance.test.ts`

1. **Step 1: Write or extend focused tests**
   - **Spec bound:** `### Requirement: Branch finish SHALL not require a complete suite`; I7.
   - **Test location:** `test/core/finishing-a-development-branch-guidance.test.ts`.
   - **Case table:** No complete suite | unit | `it('does not require npm test cargo test pytest go test before options')` | skill | not.toMatch(/npm test \/ cargo test \/ pytest \/ go test \.\/\.\.\./) ★; Options remain | unit | `it('still offers merge PR keep discard')` | skill | toMatch(/Merge back/) and toMatch(/Discard this work/).
   - **Test skeleton:**
     ```ts
     const finish = readFileSync(path.join(process.cwd(), 'skills/finishing-a-development-branch/SKILL.md'), 'utf8');
     expect(finish).not.toMatch(/npm test \/ cargo test \/ pytest \/ go test \.\/\.\.\./);
     expect(finish).toMatch(/Git-aware|related tests/i);
     expect(finish).toMatch(/Merge back to/);
     expect(finish).toMatch(/Discard this work/);
     ```
2. **Step 2: Run the focused tests**.
3. **Step 3: Implement Task 1.10**
   - **Change anchor:** YAML `description`, Step 1 Verify Tests, and any later "verify tests on merged result" that still means complete suite.
   - **Design carried:** Decision 17; Decision 4 / I2 for the non-`test-plan` suite stage.
   - **Implementation approach:** Step 1 runs Git-aware related tests when the runner supports them, otherwise the same recorded non-`test-plan` suite stage as Hardening/Verify. Keep the four integration options. Discard still requires confirmation. Point to `verification-before-completion` for matching-stage evidence; do not restate Apply gates.
   - **Edges and failures:** Failed related tests still block merge/PR options. Merged-result check uses the same Git-aware command, not a complete suite.
   - **Out of scope:** Do not change archive merge mechanics. Do not rewrite `full-qa-test`.
4. **Step 4: Run focused verification**.
5. **Step 5: Self-review and handoff**.

#### Task 1.11: Split Explore from systematic debugging

**Files:**
- Modify: `src/core/templates/workflows/explore.ts` descriptions (skill and command)
- Modify: `skills/systematic-debugging/SKILL.md` description only if Task 1.3 left an "investigating problems" overlap
- Test: `test/core/templates/skill-templates-parity.test.ts` or `test/core/explore-debug-split-guidance.test.ts`

1. **Step 1: Write or extend focused tests**
   - **Spec bound:** `### Requirement: Explore SHALL not own failure debugging`.
   - **Test location:** `test/core/explore-debug-split-guidance.test.ts`.
   - **Case table:** Explore description not a bug trap | unit | `it('explore description does not trigger on investigating problems')` | `getExploreSkillTemplate().description` | not.toMatch(/investigating problems/) ★; Debug still owns unknown-cause | unit | debug description | toMatch(/unknown/) or equivalent.
   - **Test skeleton:**
     ```ts
     import { getExploreSkillTemplate, getSpExploreCommandTemplate } from '../../../src/core/templates/workflows/explore.ts';
     expect(getExploreSkillTemplate().description).not.toMatch(/investigating problems/i);
     expect(getSpExploreCommandTemplate().description).not.toMatch(/investigating problems/i);
     expect(getExploreSkillTemplate().description).toMatch(/think through|clarif/i);
     const debug = readFileSync(path.join(process.cwd(), 'skills/systematic-debugging/SKILL.md'), 'utf8');
     expect(debug).toMatch(/unknown-cause|cause is unknown|already identified/i);
     ```
2. **Step 2: Run the focused tests**.
3. **Step 3: Implement Task 1.11**
   - **Change anchor:** `description` on `getExploreSkillTemplate` and `getSpExploreCommandTemplate`. Keep the existing no-implement body.
   - **Design carried:** Decision 17. Do not merge Explore and debug.
   - **Implementation approach:** Explore description: think through ideas, scope, or requirements without implementing. Drop "investigating problems" as a generic trigger. Debug remains the unknown-cause failure skill (Task 1.3 owns four-phase skip).
   - **Edges and failures:** User asking to think through a feature still loads Explore. A failing unit test does not.
   - **Out of scope:** Do not add an Explore `skills/` static copy. Do not rewrite Explore's thinking-partner body into a debug recipe.
4. **Step 4: Run focused verification**.
5. **Step 5: Self-review and handoff**.

Implementation Notes: Explore skill/command descriptions now say think-through without implementing and no longer mention investigating problems. Debug still owns unknown-cause work. Skills were not merged.

#### Task 1.12: Default worktree directory without a prompt

**Files:**
- Modify: `skills/using-git-worktrees/SKILL.md`
- Test: `test/core/using-git-worktrees-guidance.test.ts`

1. **Step 1: Write or extend focused tests**
   - **Spec bound:** `### Requirement: Worktrees SHALL default without asking location`.
   - **Test location:** `test/core/using-git-worktrees-guidance.test.ts`.
   - **Case table:** No two-option prompt | unit | `it('does not ask where to create worktrees')` | skill | not.toMatch(/Where should I create worktrees/) ★; Default | unit | toMatch(/\.worktrees\//) and toMatch(/check-ignore|gitignore/i).
   - **Test skeleton:**
     ```ts
     const wt = readFileSync(path.join(process.cwd(), 'skills/using-git-worktrees/SKILL.md'), 'utf8');
     expect(wt).not.toMatch(/Where should I create worktrees/);
     expect(wt).not.toMatch(/Which would you prefer/);
     expect(wt).toMatch(/\.worktrees\//);
     expect(wt).toMatch(/check-ignore|gitignore/i);
     ```
2. **Step 2: Run the focused tests**.
3. **Step 3: Implement Task 1.12**
   - **Change anchor:** Directory Selection Process step 3 (Ask User).
   - **Design carried:** Decision 18.
   - **Implementation approach:** Keep existing-directory and CLAUDE.md preference. If neither exists, create `.worktrees/`, ensure gitignore, continue. Delete the two-option prompt. Keep the gitignore MUST before creating a project-local worktree.
   - **Edges and failures:** Both `.worktrees/` and `worktrees/` present: `.worktrees/` still wins.
   - **Out of scope:** Do not change git worktree CLI flags.
4. **Step 4: Run focused verification**.
5. **Step 5: Self-review and handoff**.

Implementation Notes: Missing directory defaults to `.worktrees/` after gitignore check. Existing-directory and CLAUDE.md preference still win. Two-option location prompt removed.

### 2. Propose, Apply, and quality-gate templates

#### Task 2.1: Update Propose template

**Files:**
- Modify: `src/core/templates/workflows/propose.ts`
- Test: `test/core/templates/skill-templates-parity.test.ts` and propose-specific tests

1. **Step 1: Write or extend focused tests**
   - **Spec bound:** Propose batched questions; explicit create authorizes writes; `### Requirement: Propose SHALL not require a TodoWrite loop`.
   - **Test location:** `test/core/templates/skill-templates-parity.test.ts` (existing pin at `Ask one decision question`).
   - **Case table:** No one-at-a-time | unit | existing expect | propose content | not.toContain('Ask one decision question at a time') ★.
   - **Test skeleton:**
     ```ts
     import { getSpProposeSkillTemplate } from '../../../src/core/templates/workflows/propose.ts';
     const content = getSpProposeSkillTemplate().instructions;
     expect(content).not.toContain('Ask one decision question at a time and wait for the answer');
     expect(content).not.toMatch(/Use the \*\*TodoWrite tool\*\* to track progress/);
     expect(content).toMatch(/explicit create request|already asked to create/i);
     ```
2. **Step 2: Run the focused tests** — `pnpm exec vitest run test/core/templates/skill-templates-parity.test.ts`.
3. **Step 3: Implement Task 2.1**
   - **Change anchor:** `PROPOSE_INTERVIEW_GUIDANCE` in `propose.ts`.
   - **Design carried:** Decision 1 remaining audit items; propose-and-apply-autonomy.
   - **Implementation approach:** Keep read-only preflight and "do not invent user Choices". Replace one-at-a-time and mandatory three-state lock with: ask unresolved high-impact decisions (batch OK); if the user already asked to create, write artifacts after the summary unless a product-decision pause applies. Delete required TodoWrite / progress-tracker loops; optional host todo bookkeeping is allowed.
   - **Edges and failures:** Two scopes that change acceptance still pause.
   - **Out of scope:** Do not add interview.md.
4. **Step 4: Run focused verification**.
5. **Step 5: Self-review and handoff**.

Implementation Notes: High-impact questions may be batched. Explicit create authorizes writes after the summary; three-state Confirm remains optional UX, not a write lock. TodoWrite is optional bookkeeping. User-invented Choices stay forbidden.

#### Task 2.2: Update Apply template

**Files:**
- Modify: `src/core/templates/workflows/apply-change.ts`
- Test: apply guidance tests / parity

1. **Step 1: Write or extend focused tests**
   - **Spec bound:** Apply current-unit context; continue reversible repairs; I1 Hardening bind.
   - **Test location:** apply template test or parity on `getApplyChangeSkillTemplate()`.
   - **Case table:** Keep full-qa-test | unit | `it('still invokes full-qa-test during Test Hardening')` | apply instructions | toContain('full-qa-test') ★; No always-read-all | unit | not.toMatch(/Always read context files before starting/).
   - **Test skeleton:**
     ```ts
     import { getApplyChangeSkillTemplate } from '../../../src/core/templates/workflows/apply-change.ts';
     const text = getApplyChangeSkillTemplate().instructions;
     expect(text).toContain('full-qa-test');
     expect(text).not.toMatch(/Always read context files before starting/);
     expect(text).toMatch(/current dispatch unit|current-unit/i);
     ```
2. **Step 2: Run the focused tests**.
3. **Step 3: Implement Task 2.2**
   - **Change anchor:** Steps 4, 7 pause list, guardrails in `apply-change.ts`.
   - **Design carried:** I1; Apply context and continue-reversible requirements.
   - **Implementation approach:** Replace "read all contextFiles" with catalog + current unit slice. Pause list: ambiguous product, wrong artifacts, irreversible ops — not every error. Keep Test Hardening full-qa-test paragraph. Keep Final Quality Gates and Manual Coverage later in the same generated file; the opening must say which later section to read at Hardening vs gates. Optional shape-review stays an invitation, not a fifth gate.
   - **Edges and failures:** Hardening still reads test-plan in full at that stage. Do not split dual-projection architecture.
   - **Out of scope:** Do not remove 10→10→10 fallback.
4. **Step 4: Run focused verification**.
5. **Step 5: Self-review and handoff**.

Implementation Notes: `contextFiles` is a catalog. Each task reads the current dispatch unit plus cited spec/design slices. Reversible in-scope failures are repaired without waiting. Hardening still invokes `full-qa-test` and the six-dimension 10→10→10 fallback.

#### Task 2.3: Update final-quality-gates helper

**Files:**
- Modify: `src/core/templates/workflows/final-quality-gates.ts`, `src/core/templates/workflows/verify-change.ts` (Correctness complete-suite sentence)
- Test: unit test next to templates

1. **Step 1: Write or extend focused tests**
   - **Spec bound:** Quality gates fallback; non-test-plan Git-aware; I2, I3.
   - **Test location:** `test/core/templates/final-quality-gates.test.ts`.
   - **Case table:** No complete-suite fail-closed | unit | `it('does not fail-closed to the complete suite')` | `getCanonicalNonVisualSuiteInstructions('verify')` | not.toMatch(/fail-closed and run the complete canonical/) ★; Spawn fallback | unit | `getFinalQualityGateInstructions()` | toMatch(/same-context fallback/) and not.toMatch(/pause; do not silently substitute a same-context review/).
   - **Test skeleton:**
     ```ts
     import { getCanonicalNonVisualSuiteInstructions, getFinalQualityGateInstructions } from '../../../src/core/templates/workflows/final-quality-gates.ts';
     it('does not fail-closed to the complete suite', () => {
       expect(getCanonicalNonVisualSuiteInstructions('Test Hardening')).not.toMatch(/fail-closed and run the complete canonical non-visual suite/);
       expect(getCanonicalNonVisualSuiteInstructions('Test Hardening')).toMatch(/Git-aware|Git-related/);
     });
     it('falls back when spawn is missing', () => {
       expect(getFinalQualityGateInstructions()).toMatch(/same-context fallback/);
     });
     import { getVerifyChangeSkillTemplate } from '../../../src/core/templates/workflows/verify-change.ts';
     it('verify correctness does not require the complete suite', () => {
       expect(getVerifyChangeSkillTemplate().instructions).not.toMatch(/otherwise the complete suite/);
     });
     ```
2. **Step 2: Run the focused tests**.
3. **Step 3: Implement Task 2.3**
   - **Change anchor:** `getCanonicalNonVisualSuiteInstructions`, spawn paragraph in `getFinalQualityGateInstructions`, and the Verify Correctness bullet that currently says "otherwise the complete suite".
   - **Design carried:** Decision 3, Decision 4, I2, I3.
   - **Implementation approach:** Suite stage: Git-aware when supported; if unavailable, record `git-aware-unavailable-recorded`; do not require complete suite. Apply the same sentence in `verify-change.ts` Correctness. Spawn: prefer fresh worker; else same-context fallback labeled. `blocked` remains for runtime/credentials/DESIGN.md/product decision.
   - **Edges and failures:** Empty Git-aware selection is not a pass for that stage; test-plan rows still required.
   - **Out of scope:** Do not change remediations MUST.
4. **Step 4: Run focused verification**.
5. **Step 5: Self-review and handoff**.

Implementation Notes: Non-`test-plan` suite stage records `ran-git-aware` or `git-aware-unavailable-recorded`; empty related selection is not a pass and does not authorize a complete-suite pass. Missing spawn uses labeled `same-context fallback` and is not `blocked`. Verify Correctness no longer says "otherwise the complete suite"; targeting sentences were left for Task 3.1.

### 3. Verify, archive, sync, and docs

#### Task 3.1: Auto-select unambiguous changes

**Files:**
- Modify: `src/core/templates/workflows/verify-change.ts`, `archive-change.ts`, `sync-specs.ts`
- Test: parity + verify tests

1. **Step 1: Write or extend focused tests**
   - **Spec bound:** Change targeting auto-select; archive incomplete gates still confirm.
   - **Test location:** verify/archive template tests.
   - **Case table:** Remove always-choose | unit | `it('verify does not forbid auto-select')` | verify content | not.toContain('Do NOT guess or auto-select a change') ★.
   - **Test skeleton:**
     ```ts
     import { getVerifyChangeSkillTemplate } from '../../../src/core/templates/workflows/verify-change.ts';
     import { getArchiveChangeSkillTemplate } from '../../../src/core/templates/workflows/archive-change.ts';
     import { getSyncSpecsSkillTemplate } from '../../../src/core/templates/workflows/sync-specs.ts';
     const banned = 'Do NOT guess or auto-select a change. Always let the user choose.';
     for (const text of [
       getVerifyChangeSkillTemplate().instructions,
       getArchiveChangeSkillTemplate().instructions,
       getSyncSpecsSkillTemplate().instructions,
     ]) {
       expect(text).not.toContain(banned);
       expect(text).toMatch(/only active change|sole active change|conversation-bound/i);
     }
     ```
2. **Step 2: Run the focused tests**.
3. **Step 3: Implement Task 3.1**
   - **Change anchor:** Input / Step 1 of verify, archive, sync.
   - **Design carried:** Change targeting requirement.
   - **Implementation approach:** Shared wording: explicit name > conversation binding > sole eligible change > prompt. For sync, eligible means active with delta specs; if none have delta specs, report that and stop without guessing. Archive keeps incomplete-gate warning.
   - **Edges and failures:** Two active changes still prompt.
   - **Out of scope:** Do not change archive merge algorithm.
4. **Step 4: Run focused verification**.
5. **Step 5: Self-review and handoff**.

Implementation Notes: Shared targeting helper: explicit name > conversation-bound > sole eligible change > prompt. Archive still warns on incomplete gates. Sync with zero delta-spec changes reports ineligible and stops.

#### Task 3.2: Change-review spawn fallback

**Files:**
- Modify: `src/core/templates/workflows/change-review.ts`
- Test: change-review tests / parity

1. **Step 1: Write or extend focused tests**
   - **Spec bound:** Quality gates fallback applied to proposal review.
   - **Test location:** `test/core/templates/change-review.test.ts` or parity (`cannot launch a subagent` pin).
   - **Case table:** Fallback | unit | pin update | change-review content | toMatch(/same-context fallback/) ★.
   - **Test skeleton:**
     ```ts
     import { getChangeReviewSkillTemplate } from '../../../src/core/templates/workflows/change-review.ts';
     expect(getChangeReviewSkillTemplate().instructions).toMatch(/same-context fallback/);
     expect(getChangeReviewSkillTemplate().instructions).not.toContain('do not silently substitute an inline coordinator review');
     ```
2. **Step 2: Run the focused tests**.
3. **Step 3: Implement Task 3.2**
   - **Change anchor:** Dispatch section of `change-review.ts`.
   - **Design carried:** I3.
   - **Implementation approach:** Prefer fresh reviewer; if no spawn, coordinator runs the four dimensions and labels mode.
   - **Edges and failures:** P0 still blocks readiness.
   - **Out of scope:** Do not add review.md artifact. 10→10→10 completeness wording is Task 3.4.
4. **Step 4: Run focused verification**.
5. **Step 5: Self-review and handoff**.

Implementation Notes: Missing spawn uses labeled `same-context fallback`. P0 still withholds readiness.

#### Task 3.3: Align human docs

**Files:**
- Modify: `docs/workflows.md`, `docs/commands.md`
- Test: `test/docs/` grep tests

1. **Step 1: Write or extend focused tests**
   - **Spec bound:** docs-agent-instructions progressive disclosure; test-scope-selection Git-aware stage.
   - **Test location:** `test/docs/shape-review-docs.test.ts` or `test/docs/workflows-docs.test.ts`.
   - **Case table:** Docs drop complete-suite fail-closed | unit | `it('workflows.md does not require complete suite fail-closed')` | docs/workflows.md | not.toMatch(/fail-closed runs the complete canonical/) ★.
   - **Test skeleton:**
     ```ts
     const docs = readFileSync(path.join(process.cwd(), 'docs/workflows.md'), 'utf8');
     expect(docs).not.toMatch(/fail-closed runs the complete canonical non-visual suite/);
     expect(docs).toMatch(/Git-aware|Git-related/);
     ```
2. **Step 2: Run the focused tests**.
3. **Step 3: Implement Task 3.3**
   - **Change anchor:** Completing a Change / verify sections in the two docs.
   - **Design carried:** Non-goal: do not restate full gate recipes.
   - **Implementation approach:** Replace complete-suite and blocked-on-spawn sentences. Keep links to skills. Do not paste Apply step lists.
   - **Edges and failures:** Keep Manual Coverage terminology.
   - **Out of scope:** `GPT6-guide.md`.
4. **Step 4: Run focused verification**.
5. **Step 5: Self-review and handoff**.

Implementation Notes: Docs use Git-aware / `git-aware-unavailable-recorded` and labeled spawn fallback. Manual Coverage terminology kept. Propose table now says explicit create request.

#### Task 3.4: Stop counting 10→10→10 as proposal completeness

**Files:**
- Modify: `src/core/templates/workflows/change-review.ts` test-plan Must include row
- Test: change-review / parity tests

1. **Step 1: Write or extend focused tests**
   - **Spec bound:** `### Requirement: Review SHALL not count 10-per-dimension batches`; I9; I1 still holds on Apply.
   - **Test location:** `test/core/templates/change-review.test.ts` or parity.
   - **Case table:** No 10-batch Must include | unit | `it('does not require 10→10→10 as proposal completeness')` | change-review instructions | not.toMatch(/10→10→10 run once per Requirement per dimension/) ★; Hardening bind | unit | apply template still contains full-qa-test.
   - **Test skeleton:**
     ```ts
     import { getChangeReviewSkillTemplate } from '../../../src/core/templates/workflows/change-review.ts';
     import { getApplyChangeSkillTemplate } from '../../../src/core/templates/workflows/apply-change.ts';
     expect(getChangeReviewSkillTemplate().instructions).not.toMatch(/10→10→10 run once per Requirement per dimension/);
     expect(getApplyChangeSkillTemplate().instructions).toContain('full-qa-test');
     ```
2. **Step 2: Run the focused tests**.
3. **Step 3: Implement Task 3.4**
   - **Change anchor:** `test-plan.md` Must include cell in `change-review.ts`.
   - **Design carried:** Decision 18; I1; I9.
   - **Implementation approach:** Keep register, imported scenarios, six-dimension tables, and gap analysis as reviewable structure. Delete unfinished 10→10→10 batches as a completeness Must include / BLOCKER. Review MAY warn on missing risk dimensions. Do not edit `skills/full-qa-test/SKILL.md`.
   - **Edges and failures:** Sharing one batch of ten across several Requirements can remain a Common gap about object identity, not a count-to-ten completeness rule.
   - **Out of scope:** Do not weaken Apply Hardening 10→10→10 / six-dimension fallback.
4. **Step 4: Run focused verification**.
5. **Step 5: Self-review and handoff**.

Implementation Notes: Must include no longer lists 10→10→10 as completeness. Common gaps still warn about sharing one batch of ten. Apply `full-qa-test` bind unchanged.

### 4. Tests and projection refresh

#### Task 4.1: Update pins for I1–I9

**Files:**
- Modify: `test/core/templates/skill-templates-parity.test.ts` and related guidance tests
- Test: those files themselves

1. **Step 1: Write or extend focused tests**
   - **Spec bound:** I1–I9 as owner tests.
   - **Test location:** the same test files being updated.
   - **Case table:** Parity still holds | unit | `it('skill and command projections stay in parity')` | hashes/strings | pass after wording updates ★.
   - **Test skeleton:** Update `expect(content).toContain('Ask one decision question...')` to the new batched-decision marker; add I1 `full-qa-test` still present on Apply; add I7 finishing-a-branch no complete suite; add I8 no Direct `fall closed to the complete suite`; add I9 change-review without 10→10→10 Must include; add Explore description without `investigating problems`; add no debug `read every line`; add no worktree location prompt; add no required TodoWrite loop.
2. **Step 2: Run the focused tests** — `pnpm exec vitest run test/core/templates/skill-templates-parity.test.ts test/core/using-superpowers-guidance.test.ts`.
3. **Step 3: Implement Task 4.1**
   - **Change anchor:** string expects and snapshot hashes.
   - **Design carried:** Decision 2 — refresh through existing parity, no new architecture.
   - **Implementation approach:** Replace obsolete pins. Keep parity between skill and command projections as the existing test already does.
   - **Edges and failures:** Do not weaken parity to skip command.md updates; updating generated projections is allowed as a consequence of TS edits, not as a DRY rewrite.
   - **Out of scope:** Dual-projection redesign.
4. **Step 4: Run focused verification**.
5. **Step 5: Self-review and handoff**.

Implementation Notes: I1–I9 pins live in `skill-templates-parity.test.ts` (`full-qa-test` + `**10** test cases`, no complete-suite fail-closed, `same-context fallback`, no `before any response`, no GPT6-guide, no invented Choices, no complete `npm test` suite, no Direct `fall closed`, no review 10→10→10 Must include, Explore description without `investigating problems`, no debug `read every line`, no worktree location prompt). Related autonomy/guidance tests updated to the same contracts.

#### Task 4.2: Refresh projections via existing path

**Files:**
- Modify: generated `.cursor/commands/*.md` and `.cursor/skills/superpowers-*.md` only as the current pipeline already requires
- Explicit skip: `.cursor/skills/full-qa-test/SKILL.md`

1. **Step 1: Write or extend focused tests**
   - **Spec bound:** Decision 2; non-goal on full-qa cursor copy.
   - **Test location:** `skill-templates-parity.test.ts`.
   - **Case table:** Cursor full-qa-test not required | unit | `it('does not treat cursor full-qa-test as a projection of workflows/*.ts')` | parity file list | not to include that path as a workflow projection ★.
   - **Test skeleton:** Assert parity suite file list omits `.cursor/skills/full-qa-test/SKILL.md`.
2. **Step 2: Run the focused tests**.
3. **Step 3: Implement Task 4.2**
   - **Change anchor:** only files already in the parity map.
   - **Design carried:** user lock — do not process cursor full-qa-test.
   - **Implementation approach:** If parity fails because command.md lagged TS, update those generated files the same way current tests already expect. Do not open `.cursor/skills/full-qa-test/SKILL.md`.
   - **Edges and failures:** `.codex/skills` copies that CI tracks must match if tests already compare them, except full-qa-test cursor file.
   - **Out of scope:** New single-source markdown architecture.
4. **Step 4: Run focused verification**.
5. **Step 5: Self-review and handoff**.

Implementation Notes: Regenerated existing `.cursor/commands/sp-*.md` and `.cursor/skills/superpowers-*/SKILL.md` from TS via `generateSkillContent` / `generateCommand` + `cursorAdapter`. Synced existing `.cursor/skills/*` copies from `skills/` except `full-qa-test`. Did not create new/continue/ff/onboard projections. Snapshot hashes updated.

## Final validation

After units integrate: `superpowers validate slim-agent-instruction-ceremony`, then Git-aware related tests plus `pnpm exec tsc --noEmit` if types changed. Confirm I1–I9 pins. Do not run a complete suite as a required pass.
