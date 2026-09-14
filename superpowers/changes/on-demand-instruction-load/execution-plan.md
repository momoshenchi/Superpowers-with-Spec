## File Structure

- Modify:
  - `skills/full-qa-test/SKILL.md` — YAML description only
  - `skills/using-git-worktrees/SKILL.md` — description; drop Apply REQUIRED
  - `skills/finishing-a-development-branch/SKILL.md` — description; later sweep retired-skill pointers
  - `hooks/session-start` — pointer, not body inject
  - `CLAUDE.md` — drop Skills list
  - `src/core/templates/workflows/apply-change.ts` — index + emit references; delete conflict guardrails
  - `src/core/templates/workflows/propose.ts` — index + artifact-loop reference
  - `src/core/templates/workflows/verify-change.ts` — catalog read; split report body
  - `src/core/templates/types.ts`, `src/core/shared/skill-generation.ts`, `src/core/init.ts`, `src/core/update.ts` — reference file emit; obsolete dirs
  - `skills/using-superpowers/SKILL.md` — evidence + review timing; 8-step out of root
  - `skills/test-driven-development/SKILL.md` — examples to reference
  - `skills/systematic-debugging/SKILL.md` — procedure to reference; sweep VBC pointer
- Create:
  - Apply/Propose/Verify `reference/*.md` via generator
  - `skills/using-superpowers/reference/code-reviewer.md` (moved)
- Remove from live discovery:
  - `skills/verification-before-completion/SKILL.md`
  - `skills/subagent-driven-development/SKILL.md`
  - `skills/when-to-dispatch-code-review/SKILL.md`
  - host tool maps; debug CREATION-LOG / test-pressure files
- Test:
  - `test/core/sdd-guidance.test.ts`
  - `test/core/templates/skill-templates-parity.test.ts`
  - `test/core/init.test.ts`, `test/core/update.test.ts`
  - new hook / description / reference-layout tests under `test/core/`

## Dispatch Coordination

| Unit | Scope | Ownership | Dependencies | Assignee policy | Parallel | Handoff |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | False triggers and always-on | descriptions, hook, `CLAUDE.md`, Apply chain-read sentences | None | Prefer dedicated worker | No vs 2 (shared Apply) | Description pins, hook pin, I3, I6 |
| 2 | Stage-file disclosure | templates, skill-generation, init/update writers, TDD/debug/router reference moves | Unit 1 | Prefer dedicated worker | No | Reference files, I1, I2, I8 |
| 3 | Ownership collapse | retire three skills, Apply guardrails, obsolete dirs, host maps | Unit 2 | Prefer dedicated worker | No | I4, redirected guidance |
| 4 | Pins and projections | remaining tests + generated Cursor copies | Units 1–3 | Execute after 1–3 | No | Green focused + Git-aware related tests |

## Execution Boundaries

### 1. Stop false triggers

- Do not rewrite `full-qa-test` 10→10→10 body.
- Do not change worktrees baseline `npm test` / `cargo test` / `pytest` / `go test ./...`.
- Do not inject `GPT6-guide.md`.

### 2. Disclose by stage

- Keep Hardening → `full-qa-test` (I1).
- Missing companion is `blocked`, not an inline dump fallback.
- Do not collapse command/skill/TS into one source.

### 3. Collapse overlapping owners

- One live owner each; delete conflict sentences rather than explaining them.
- Init and update both list obsolete dirs.

### 4. Pins and projections

- Update pins; do not add a new generator architecture.

## Dispatch Execution

### 1. Stop false triggers

#### Task 1.1: Add failing trigger and always-on tests

**Files:**
- Create / Modify: `test/core/skill-trigger-narrowing.test.ts`
- Test: same

1. **Step 1: Write or extend focused tests** — Fill every slot below, including the test skeleton. This is the RED test that drives the task. A Step 1 that only says "cover the behavior" or lists slot names without values is not a plan. Do not write production code in this step. Six-dimension hardening stays in `test-plan.md`.
   - **Spec bound:** quote `### Requirement: Catalog descriptions SHALL state when not to use the skill` / `#### Scenario: full-qa-test does not fire on a focused unit test`; `### Requirement: SessionStart SHALL not inject the using-superpowers body` / `#### Scenario: Session start names the router`; `### Requirement: Apply SHALL NOT chain-read TDD or completion-evidence skills` / `#### Scenario: Apply starts a behavior task without loading TDD.md`. Map WHEN onto Arrange/Act and THEN onto Assert.
   - **Test location:** `test/core/skill-trigger-narrowing.test.ts` — `describe('skill-trigger-narrowing')` / `it('full-qa-test description does not match generic unit-test writing')`.
   - **Case table:** full-qa-test description | unit | `it('full-qa-test description does not match generic unit-test writing')` | YAML description | not.toMatch(/writing comprehensive test plans or cases for features/) ★; SessionStart | unit | `it('session-start does not embed using-superpowers body')` | hook source | not.toMatch(/Select one of exactly two work modes/); Apply | unit | `it('apply does not refer to the TDD skill file')` | apply template | not.toMatch(/Please refer to the `test-driven-development` skill/).
   - **Test skeleton:**
     ```ts
     import { readFileSync } from 'node:fs';
     import path from 'node:path';
     import { describe, expect, it } from 'vitest';
     const qa = readFileSync(path.join(process.cwd(), 'skills', 'full-qa-test', 'SKILL.md'), 'utf8');
     const hook = readFileSync(path.join(process.cwd(), 'hooks', 'session-start'), 'utf8');
     it('full-qa-test description does not match generic unit-test writing', () => {
       const desc = qa.match(/^description:\s*(.*)$/m)?.[1] ?? '';
       expect(desc).not.toMatch(/writing comprehensive test plans or cases for features/i);
     });
     it('session-start does not embed using-superpowers body', () => {
       expect(hook).not.toMatch(/Select one of exactly two work modes/);
     });
     ```
2. **Step 2: Run the focused tests** — `pnpm exec vitest run test/core/skill-trigger-narrowing.test.ts`. Record the actual failure. If it fails for the wrong reason or already passes, stop and fix Step 1; do not start Step 3.
3. **Step 3: Implement Task 1.1**
   - **Change anchor:** new test file only.
   - **Design carried:** Decision 1 (A in scope); I3; I6.
   - **Implementation approach:** Assert current production strings so the tests fail until 1.2–1.4 land. Include CLAUDE.md Skills-list assertion and worktrees REQUIRED assertion in the same file.
   - **Edges and failures:** Missing files fail the test, not skip.
   - **Out of scope:** Do not edit production files in this task.
4. **Step 4: Run focused verification** — Re-run Step 2. Then Git-related tests when the runner supports Git-aware selection; do not require the full suite. Record the passing result (this task: failing tests exist). If a new failure appears outside this task's test, name it — do not silently expand the diff to chase it.
5. **Step 5: Self-review and handoff** — Confirm the Step 1 assertions fail for the right reason (old descriptions/hook/Apply still present).

#### Task 1.2: Narrow remaining catalog descriptions

**Files:**
- Modify: `skills/full-qa-test/SKILL.md`, `skills/using-git-worktrees/SKILL.md`, `skills/finishing-a-development-branch/SKILL.md`

1. **Step 1: Write or extend focused tests** — Use the 1.1 tests as the red suite for this task’s description edits.
   - **Spec bound:** `### Requirement: Catalog descriptions SHALL state when not to use the skill` — all three scenarios.
   - **Test location:** `test/core/skill-trigger-narrowing.test.ts` — the description `it`s from 1.1.
   - **Case table:** worktrees | unit | `it('worktrees description is not an Apply precondition')` | description + body | not.toMatch(/REQUIRED before executing any tasks/) ★.
   - **Test skeleton:**
     ```ts
     import { readFileSync } from 'node:fs';
     import path from 'node:path';
     import { describe, expect, it } from 'vitest';
     const wt = readFileSync(path.join(process.cwd(), 'skills', 'using-git-worktrees', 'SKILL.md'), 'utf8');
     const finish = readFileSync(path.join(process.cwd(), 'skills', 'finishing-a-development-branch', 'SKILL.md'), 'utf8');
     it('worktrees description is not an Apply precondition', () => {
       expect(wt).not.toMatch(/REQUIRED before executing any tasks/);
     });
     it('finishing-a-branch description waits for an integration request', () => {
       const desc = finish.split('\n').find((l) => l.startsWith('description:')) ?? '';
       expect(desc).not.toMatch(/implementation is complete, all tests pass/i);
     });
     ```
2. **Step 2: Run the focused tests** — `pnpm exec vitest run test/core/skill-trigger-narrowing.test.ts`. Expect description cases still red until this edit.
3. **Step 3: Implement Task 1.2**
   - **Change anchor:** YAML `description` at top of each listed SKILL.md; worktrees Integration “REQUIRED” lines.
   - **Design carried:** Decision 1; I7 (`full-qa-test` body untouched).
   - **Implementation approach:** `full-qa-test` description: Test Hardening or user asks 六维/无死角. `using-git-worktrees`: only when creating an isolated worktree. `finishing-a-development-branch`: only when the user asks to merge, PR, keep, or discard. Delete Apply REQUIRED sentences. Leave worktrees Step 4 `npm test` / `cargo test` / `pytest` / `go test ./...` baseline (D leftover vs already-Git-aware Direct Modification / Hardening).
   - **Edges and failures:** Hardening still loads `full-qa-test` by name from Apply (Unit 2), not via a broad description.
   - **Out of scope:** `.cursor/skills/full-qa-test/SKILL.md`; 10→10→10 procedure.
4. **Step 4: Run focused verification** — Re-run Step 2 for description cases. Git-aware related tests when supported.
5. **Step 5: Self-review and handoff** — Confirm `full-qa-test` procedure section unchanged in the diff.

#### Task 1.3: SessionStart pointer and CLAUDE.md catalog

**Files:**
- Modify: `hooks/session-start`, `CLAUDE.md`
- Test: `test/core/skill-trigger-narrowing.test.ts` or `test/hooks/session-start.test.ts`

1. **Step 1: Write or extend focused tests**
   - **Spec bound:** `### Requirement: SessionStart SHALL not inject the using-superpowers body`; docs-agent-instructions `### Requirement: Agent docs SHALL not merchandize the skill catalog`.
   - **Test location:** same narrowing file — `it('CLAUDE.md has no Skills merchandising list')`.
   - **Case table:** CLAUDE.md | unit | `it('CLAUDE.md has no Skills merchandising list')` | file text | not.toMatch(/^## Skills$/m) ★.
   - **Test skeleton:**
     ```ts
     const claude = readFileSync(path.join(process.cwd(), 'CLAUDE.md'), 'utf8');
     it('CLAUDE.md has no Skills merchandising list', () => {
       expect(claude).not.toMatch(/^## Skills$/m);
       expect(claude).toMatch(/npm test/);
     });
     ```
2. **Step 2: Run the focused tests** — expect CLAUDE.md and hook cases red.
3. **Step 3: Implement Task 1.3**
   - **Change anchor:** `hooks/session-start` `using_superpowers_content=$(cat ...)` block; `CLAUDE.md` `## Skills` section.
   - **Design carried:** Decision 5; I3; I5.
   - **Implementation approach:** Hook additional_context names the skill and when to read it. Do not `cat` SKILL.md. Keep legacy `~/.config/superpowers/skills` warning. CLAUDE.md deletes the skill bullet list only.
   - **Edges and failures:** Hook still valid JSON for Cursor and Claude shapes.
   - **Out of scope:** Do not regenerate `superpowers/AGENTS.md`.
4. **Step 4: Run focused verification** — Re-run Step 2. Git-aware when supported.
5. **Step 5: Self-review and handoff** — Confirm empty `AGENTS.md` and no GPT6 required read.

#### Task 1.4: Stop Apply chain-read of TDD and VBC

**Files:**
- Modify: `src/core/templates/workflows/apply-change.ts`

1. **Step 1: Write or extend focused tests**
   - **Spec bound:** `### Requirement: Apply SHALL NOT chain-read TDD or completion-evidence skills` — both scenarios; I6.
   - **Test location:** `test/core/templates/` apply guidance or `skill-templates-parity.test.ts` — `it('apply does not refer to the TDD skill file')`.
   - **Case table:** TDD refer | unit | existing 1.1 Apply it | template string | not.toMatch(/Please refer to the `test-driven-development` skill/) ★; VBC refer | unit | `it('apply does not refer to verification-before-completion')` | template | not.toMatch(/verification-before-completion` skill/).
   - **Test skeleton:**
     ```ts
     import { getApplyChangeSkillTemplate, getSpApplyCommandTemplate } from '../../src/core/templates/skill-templates.js';
     it('apply does not refer to the TDD or VBC skill files', () => {
       const text = getApplyChangeSkillTemplate().instructions + getSpApplyCommandTemplate().content;
       expect(text).not.toMatch(/Please refer to the `test-driven-development` skill/);
       expect(text).not.toMatch(/verification-before-completion` skill/);
       expect(text).toMatch(/matching-stage|observable automated behavior/);
     });
     ```
2. **Step 2: Run the focused tests** — expect red on current Apply template.
3. **Step 3: Implement Task 1.4**
   - **Change anchor:** Apply implement-loop paragraph and Guardrails “Before claiming a task is completed, please refer to `verification-before-completion`”.
   - **Design carried:** Decision 1; I6.
   - **Implementation approach:** In-place: TDD for observable automated behavior, skip copy-only/generated/config/type-narrowing; completion needs matching-stage evidence. No skill-file referral.
   - **Edges and failures:** Unit 3 will retire VBC; this task must not depend on that file existing.
   - **Out of scope:** Do not split Apply into reference files yet (Unit 2).
4. **Step 4: Run focused verification** — Re-run Step 2. Git-aware when supported.
5. **Step 5: Self-review and handoff** — Apply still concatenates FQG (known until Unit 2).

### 2. Disclose by stage

#### Task 2.1: Add failing root-vs-reference tests

**Files:**
- Create: `test/core/stage-file-disclosure.test.ts`

1. **Step 1: Write or extend focused tests**
   - **Spec bound:** `### Requirement: Workflow roots SHALL be stage indexes` / `#### Scenario: Apply root does not contain Final Quality Gates`; `### Requirement: Long technique skills SHALL keep procedure off the root` — both scenarios.
   - **Test location:** `test/core/stage-file-disclosure.test.ts` — `it('apply root omits remediations field list')`.
   - **Case table:** Apply root | unit | `it('apply root omits remediations field list')` | skill+command | not.toMatch(/≥2 meaningfully different Solutions/) ★; companion | unit | `it('apply reference contains final quality gates')` | `reference/final-quality-gates.md` | toMatch(/Final Quality Gates/); Verify | unit | `it('verify does not read all contextFiles')` | verify template | not.toMatch(/Read all available artifacts from `contextFiles`/).
   - **Test skeleton:**
     ```ts
     import { getApplyChangeSkillTemplate, getSpApplyCommandTemplate } from '../../src/core/templates/skill-templates.js';
     it('apply root omits remediations field list', () => {
       expect(getApplyChangeSkillTemplate().instructions).not.toMatch(/≥2 meaningfully different Solutions/);
       expect(getSpApplyCommandTemplate().content).not.toMatch(/≥2 meaningfully different Solutions/);
     });
     ```
2. **Step 2: Run the focused tests** — `pnpm exec vitest run test/core/stage-file-disclosure.test.ts`. Expect fail: FQG still inlined.
3. **Step 3: Implement Task 2.1** — tests only.
   - **Change anchor:** new test file.
   - **Design carried:** I2; Decisions 3.
   - **Implementation approach:** Also assert TDD root has no `## Common Rationalizations` table; debug root has no `### Evidence ledger`; using-superpowers root has no `1. Inventory logical capabilities`.
   - **Edges and failures:** Tests may fail on missing `reference/` until 2.3; that is the intended red.
   - **Out of scope:** Production split.
4. **Step 4: Run focused verification** — Re-run Step 2.
5. **Step 5: Self-review and handoff** — I1 not asserted here; Unit 2.3 pins Hardening bind in the companion.

#### Task 2.2: Emit reference companions from generation

**Files:**
- Modify: `src/core/templates/types.ts`, `src/core/shared/skill-generation.ts`, `src/core/init.ts`, `src/core/update.ts`
- Test: `test/core/init.test.ts` or `test/core/skill-generation.test.ts`

1. **Step 1: Write or extend focused tests**
   - **Spec bound:** `### Requirement: Stage contracts SHALL live in referenced files` / `#### Scenario: Hardening loads its contract when the stage starts`.
   - **Test location:** `test/core/init.test.ts` — `it('writes apply reference companions')`.
   - **Case table:** init layout | unit | `it('writes apply reference companions')` | temp skills dir | `fs.existsSync(path.join(applyDir, 'reference', 'final-quality-gates.md'))` ★.
   - **Test skeleton:** after a fixture init, `expect(existsSync(path.join(skillsDir, 'superpowers-apply-change', 'reference', 'test-hardening.md'))).toBe(true)`.
2. **Step 2: Run the focused tests** — expect fail: no reference dir.
3. **Step 3: Implement Task 2.2**
   - **Change anchor:** `SkillTemplate` optional `references`; `generateSkillContent` unchanged for SKILL.md; init/update write loop using `path.join`.
   - **Design carried:** Decision 3; I8.
   - **Implementation approach:** Export `getApplyChangeReferences()` (and propose/verify) returning `{ relativePath, content }[]`. After writing SKILL.md, mkdir reference and write each file. Commands stay one file; their index will name the skill-dir paths in 2.3.
   - **Edges and failures:** `path.join` only; Windows-safe. Do not hardcode `/`.
   - **Out of scope:** Content of the companions (2.3–2.4).
4. **Step 4: Run focused verification** — Re-run Step 2 (may still fail if references export is empty until 2.3; if so, write a stub companion in this task so the writer path is green, then 2.3 replaces content).
5. **Step 5: Self-review and handoff** — Dual projection API still two functions per workflow.

#### Task 2.3: Split Apply into index plus references

**Files:**
- Modify: `src/core/templates/workflows/apply-change.ts`, `src/core/templates/workflows/final-quality-gates.ts` (export only; do not change gate order)

1. **Step 1: Write or extend focused tests** — 2.1 Apply root/companion cases plus I1.
   - **Spec bound:** Apply index scenarios; I1 Hardening still invokes `full-qa-test`.
   - **Test location:** `test/core/stage-file-disclosure.test.ts` — `it('hardening reference still invokes full-qa-test')`.
   - **Case table:** I1 | unit | `it('hardening reference still invokes full-qa-test')` | test-hardening.md | toMatch(/full-qa-test/) ★.
   - **Test skeleton:**
     ```ts
     import { getApplyChangeReferences } from '../../src/core/templates/skill-templates.js';
     it('hardening reference still invokes full-qa-test', () => {
       const hardening = getApplyChangeReferences().find((f) => f.relativePath.endsWith('test-hardening.md'))?.content ?? '';
       expect(hardening).toMatch(/full-qa-test/);
       expect(hardening).toMatch(/10/);
     });
     ```
2. **Step 2: Run the focused tests** — red until split.
3. **Step 3: Implement Task 2.3**
   - **Change anchor:** `buildApplyInstructions`; stop interpolating `APPLY_RUNTIME_BEFORE_CAPTURE`, Hardening, Manual Coverage, `getFinalQualityGateInstructions()` into the root.
   - **Design carried:** Decision 3; I1; I2.
   - **Implementation approach:** Root: select change, status, current-unit catalog read, pause list, pointers including `reference/dispatch-units.md`. References: `runtime-before.md`, `test-hardening.md`, `final-quality-gates.md`. Command index uses the same skill-relative pointers. Missing file → `blocked` sentence in the index.
   - **Edges and failures:** `all_done` still checks Final Quality Gates record; that check stays in the index as a pointer to existing outcomes, not a recipe dump.
   - **Out of scope:** Guardrail conflict deletion (3.3).
4. **Step 4: Run focused verification** — Re-run 2.1 Apply cases. Git-aware when supported.
5. **Step 5: Self-review and handoff** — Root word count is an index; FQG recipe exists only in reference.

#### Task 2.4: Split Propose and Verify

**Files:**
- Modify: `src/core/templates/workflows/propose.ts`, `src/core/templates/workflows/verify-change.ts`

1. **Step 1: Write or extend focused tests**
   - **Spec bound:** `#### Scenario: Propose root defers artifact-loop detail`; `#### Scenario: Verify root does not dump every artifact`.
   - **Test location:** `test/core/stage-file-disclosure.test.ts`.
   - **Case table:** Verify | unit | `it('verify does not read all contextFiles')` | instructions | not.toMatch(/Read all available artifacts from `contextFiles`/) ★; Propose | unit | `it('propose root omits per-artifact instruction loop')` | root | not.toMatch(/superpowers instructions <artifact-id>/).
   - **Test skeleton:**
     ```ts
     import { getSpProposeSkillTemplate, getVerifyChangeSkillTemplate } from '../../src/core/templates/skill-templates.js';
     it('verify does not read all contextFiles', () => {
       expect(getVerifyChangeSkillTemplate().instructions).not.toMatch(/Read all available artifacts from `contextFiles`/);
       expect(getVerifyChangeSkillTemplate().instructions).toMatch(/catalog/);
     });
     it('propose root omits per-artifact instruction loop', () => {
       expect(getSpProposeSkillTemplate().instructions).not.toMatch(/superpowers instructions <artifact-id>/);
     });
     ```
2. **Step 2: Run the focused tests** — red on current templates.
3. **Step 3: Implement Task 2.4**
   - **Change anchor:** `buildVerifyInstructions` contextFiles sentence; Propose `**Steps**` loop.
   - **Design carried:** Decision 3.
   - **Implementation approach:** Verify: read artifacts needed for current dimensions. Propose: root keeps interview/authorization; artifact-generation loop in `reference/artifact-loop.md`.
   - **Edges and failures:** Explicit create still authorizes writes (slim contract).
   - **Out of scope:** Explore one-question-at-a-time (D).
4. **Step 4: Run focused verification** — Re-run Step 2.
5. **Step 5: Self-review and handoff** — Propose derived-assumption MUST list remains (D).

#### Task 2.5: Move technique bodies into reference files

**Files:**
- Modify: `skills/test-driven-development/SKILL.md`, `skills/systematic-debugging/SKILL.md`, `skills/using-superpowers/SKILL.md`
- Create: matching `reference/` markdown files

1. **Step 1: Write or extend focused tests** — 2.1 technique-root cases.
   - **Spec bound:** `### Requirement: Long technique skills SHALL keep procedure off the root`.
   - **Test location:** `test/core/stage-file-disclosure.test.ts`.
   - **Case table:** TDD | unit | `it('tdd root omits rationalization table')` | SKILL.md | not.toMatch(/## Common Rationalizations/) ★; debug | unit | `it('debug root omits evidence ledger')` | SKILL.md | not.toMatch(/### Evidence ledger/); router | unit | `it('using-superpowers root omits eight-step decompose')` | SKILL.md | not.toMatch(/Inventory logical capabilities/).
   - **Test skeleton:**
     ```ts
     import { readFileSync } from 'node:fs';
     import path from 'node:path';
     const tdd = readFileSync(path.join(process.cwd(), 'skills', 'test-driven-development', 'SKILL.md'), 'utf8');
     const dbg = readFileSync(path.join(process.cwd(), 'skills', 'systematic-debugging', 'SKILL.md'), 'utf8');
     const sp = readFileSync(path.join(process.cwd(), 'skills', 'using-superpowers', 'SKILL.md'), 'utf8');
     it('tdd root omits rationalization table', () => {
       expect(tdd).not.toMatch(/## Common Rationalizations/);
     });
     it('debug root omits evidence ledger', () => {
       expect(dbg).not.toMatch(/### Evidence ledger/);
     });
     it('using-superpowers root omits eight-step decompose', () => {
       expect(sp).not.toMatch(/Inventory logical capabilities/);
     });
     ```
2. **Step 2: Run the focused tests** — red until move.
3. **Step 3: Implement Task 2.5**
   - **Change anchor:** TDD from `## Why Order Matters` through examples; debug from checkpoint protocol through phase bodies; using-superpowers `## Decompose long-running work`.
   - **Design carried:** Decision 3.
   - **Implementation approach:** Roots keep when-to-use and the one-page rule. Point to `reference/` with relative links. Do not copy “read every line” back in (already deleted by slim).
   - **Edges and failures:** Localized-failure skip stays in debug root.
   - **Out of scope:** TDD philosophy rewrite beyond moving text (D-adjacent; moving is B).
4. **Step 4: Run focused verification** — Re-run Step 2.
5. **Step 5: Self-review and handoff** — Router still contains Direct vs Proposal.

### 3. Collapse overlapping owners

#### Task 3.1: Add failing retirement and conflict tests

**Files:**
- Create: `test/core/instruction-ownership-collapse.test.ts`

1. **Step 1: Write or extend focused tests**
   - **Spec bound:** `### Requirement: Apply SHALL own dispatch-unit execution` / init removal scenarios; `### Requirement: Apply SHALL not restate a second complete review`; `### Requirement: Apply pause text SHALL match the router`.
   - **Test location:** `test/core/instruction-ownership-collapse.test.ts`.
   - **Case table:** obsolete | unit | `it('init removes verification-before-completion')` | OBSOLETE list / fixture | includes `'verification-before-completion'` ★; Apply | unit | `it('apply has no extra complete integration review')` | apply root | not.toMatch(/Keep the final integration review separate/); Apply | unit | `it('apply does not pause on every implementation issue')` | apply | not.toMatch(/If implementation reveals issues, pause/).
   - **Test skeleton:** `expect(OBSOLETE_BUNDLED_SKILL_DIRS).toEqual(expect.arrayContaining(['verification-before-completion', 'subagent-driven-development', 'when-to-dispatch-code-review']));` — export the list for tests or assert via init fixture after 3.2.
2. **Step 2: Run the focused tests** — red.
3. **Step 3: Implement Task 3.1** — tests only.
   - **Change anchor:** new test file.
   - **Design carried:** Decision 4; Decision 6; I4.
   - **Implementation approach:** Also assert host maps and CREATION-LOG absence once 3.4 lands.
   - **Edges and failures:** Do not pin `SKILL_NAMES`.
   - **Out of scope:** Production retirement.
4. **Step 4: Run focused verification** — Re-run Step 2.
5. **Step 5: Self-review and handoff** — Tests name the three retired directories exactly.

#### Task 3.2: Fold owners and retire live skills

**Files:**
- Modify: `skills/using-superpowers/SKILL.md`, Apply `reference/dispatch-units.md` emitter, `src/core/init.ts`, `src/core/update.ts`, `skills/finishing-a-development-branch/SKILL.md`, `skills/systematic-debugging/SKILL.md`, `skills/using-git-worktrees/SKILL.md`
- Create: `skills/using-superpowers/reference/code-reviewer.md`
- Remove live: the three SKILL.md trees from default discovery

1. **Step 1: Write or extend focused tests**
   - **Spec bound:** router owns evidence and review timing; Apply owns dispatch; `### Requirement: Remaining skills SHALL not point at retired skills`; init/update removal scenarios.
   - **Test location:** `test/core/using-superpowers-guidance.test.ts` plus `test/core/instruction-ownership-collapse.test.ts`.
   - **Case table:** evidence | unit | `it('using-superpowers states matching-stage evidence')` | router | toMatch(/matching-stage/) ★; finishing | unit | `it('finishing-a-branch does not require VBC or SDD')` | skill | not.toMatch(/verification-before-completion|subagent-driven-development/).
   - **Test skeleton:**
     ```ts
     import { readFileSync } from 'node:fs';
     import path from 'node:path';
     const usingSuperpowers = readFileSync(path.join(process.cwd(), 'skills', 'using-superpowers', 'SKILL.md'), 'utf8');
     const finish = readFileSync(path.join(process.cwd(), 'skills', 'finishing-a-development-branch', 'SKILL.md'), 'utf8');
     it('using-superpowers states matching-stage evidence', () => {
       expect(usingSuperpowers).toMatch(/fresh run of the current-stage command|matching-stage/);
       expect(usingSuperpowers).not.toMatch(/GPT6-guide/);
     });
     it('finishing-a-branch does not require VBC or SDD', () => {
       expect(finish).not.toMatch(/verification-before-completion/);
       expect(finish).not.toMatch(/subagent-driven-development/);
     });
     ```
2. **Step 2: Run the focused tests** — red until fold.
3. **Step 3: Implement Task 3.2**
   - **Change anchor:** `using-superpowers` persist/verification paragraphs; Apply `getApplyChangeReferences` entry `dispatch-units.md`; `OBSOLETE_BUNDLED_SKILL_DIRS` in init.ts and update.ts (keep in sync); remaining catalog see-also lines.
   - **Design carried:** Decision 4; I4; I5.
   - **Implementation approach:** Three short evidence sentences, no Iron Law. Review timing: Direct Modification conditions + Apply gate is the Proposal-path review. Dispatch loop only in `reference/dispatch-units.md`. Move `code-reviewer.md`. Archive retired skill dirs under `docs/archive/` or delete; they MUST NOT remain under `skills/` with SKILL.md. Add all three names plus keep `requesting-code-review`. Rewrite finishing/debug/worktrees/router pointers to `using-superpowers` or Apply.
   - **Edges and failures:** `copyBundledStaticSkills` removes obsolete dirs before copy. Update path too.
   - **Out of scope:** Do not retire `receiving-code-review` (not in A/B/C).
4. **Step 4: Run focused verification** — Re-run 3.1 and using-superpowers guidance.
5. **Step 5: Self-review and handoff** — Live `skills/` listing no longer contains the three names.

#### Task 3.3: Delete Apply conflict guardrails

**Files:**
- Modify: `src/core/templates/workflows/apply-change.ts` (index only)

1. **Step 1: Write or extend focused tests** — 3.1 Apply conflict `it`s.
   - **Spec bound:** `### Requirement: Apply SHALL not restate a second complete review`; `### Requirement: Apply pause text SHALL match the router`.
   - **Test location:** `test/core/instruction-ownership-collapse.test.ts`.
   - **Case table:** same as 3.1 Apply rows ★.
   - **Test skeleton:**
     ```ts
     import { getApplyChangeSkillTemplate } from '../../src/core/templates/skill-templates.js';
     it('apply has no extra complete integration review', () => {
       expect(getApplyChangeSkillTemplate().instructions).not.toMatch(/Keep the final integration review separate/);
     });
     it('apply does not pause on every implementation issue', () => {
       expect(getApplyChangeSkillTemplate().instructions).not.toMatch(/If implementation reveals issues, pause/);
     });
     ```
2. **Step 2: Run the focused tests** — red if 2.3 copied guardrails into the index.
3. **Step 3: Implement Task 3.3**
   - **Change anchor:** Apply `**Guardrails**` bullets `If implementation reveals issues, pause` and `Keep the final integration review separate`.
   - **Design carried:** Decision 6.
   - **Implementation approach:** Delete both. Keep the pause list that matches the router. Do not add a replacement explanation.
   - **Edges and failures:** Worker self-review of a unit remains in dispatch guidance.
   - **Out of scope:** FQG retry policy.
4. **Step 4: Run focused verification** — Re-run 3.1 Apply cases.
5. **Step 5: Self-review and handoff** — No third “to be clear” sentence added.

#### Task 3.4: Remove host maps and debug debris

**Files:**
- Delete or move: `skills/using-superpowers/reference/codex-tools.md`, `copilot-tools.md`, `gemini-tools.md`; `skills/systematic-debugging/CREATION-LOG.md`, `test-pressure-*.md`

1. **Step 1: Write or extend focused tests**
   - **Spec bound:** `### Requirement: Default discovery SHALL omit host maps and debug authoring debris`.
   - **Test location:** `test/core/instruction-ownership-collapse.test.ts`.
   - **Case table:** maps | unit | `it('using-superpowers reference has no host tool maps')` | `existsSync(path.join('skills','using-superpowers','reference','codex-tools.md'))` | false ★; debris | unit | `it('systematic-debugging live dir has no CREATION-LOG')` | existsSync | false.
   - **Test skeleton:** `expect(existsSync(path.join(process.cwd(), 'skills', 'systematic-debugging', 'CREATION-LOG.md'))).toBe(false);`.
2. **Step 2: Run the focused tests** — red while files exist.
3. **Step 3: Implement Task 3.4**
   - **Change anchor:** those files; any root links to them.
   - **Design carried:** Decision 7.
   - **Implementation approach:** Move to `docs/archive/` if history is useful, otherwise delete. Keep `root-cause-tracing.md` and other technique references.
   - **Edges and failures:** Tests that imported test-pressure files must move or drop.
   - **Out of scope:** writing-skills Iron Law (not in A/B/C).
4. **Step 4: Run focused verification** — Re-run Step 2.
5. **Step 5: Self-review and handoff** — `skills/using-superpowers/reference/` still has `schema-and-workload.md` and `code-reviewer.md`.

### 4. Pins and projections

#### Task 4.1: Retarget guidance tests to new owners

**Files:**
- Modify: `test/core/verification-before-completion-guidance.test.ts`, `test/core/subagent-work-package-guidance.test.ts`, `test/core/sdd-guidance.test.ts`, `test/core/when-to-dispatch-code-review-guidance.test.ts`, `test/core/code-review-dispatch-guidance.test.ts`, `test/core/using-superpowers-guidance.test.ts`, `test/core/git-related-test-selection-guidance.test.ts`, `test/core/implementation-notes-guidance.test.ts`, `test/core/init.test.ts`, `test/core/update.test.ts`

1. **Step 1: Write or identify checks**
   - **Spec bound:** I4; ownership-collapse install scenarios; existing matching-stage pins that pointed at VBC.
   - **Test location:** the listed files, including `test/core/sdd-guidance.test.ts`.
   - **Case table:** read path | unit | each former `readGuidance('skills', 'verification-before-completion')` | now router or Apply | file exists at new owner ★.
   - **Test skeleton:**
     ```ts
     import { existsSync } from 'node:fs';
     import path from 'node:path';
     it('retired SDD skill is not a live path', () => {
       expect(existsSync(path.join(process.cwd(), 'skills', 'subagent-driven-development', 'SKILL.md'))).toBe(false);
     });
     ```
2. **Step 2: Run the focused tests** — `pnpm exec vitest run test/core/using-superpowers-guidance.test.ts test/core/sdd-guidance.test.ts test/core/init.test.ts test/core/update.test.ts`. Expect fail on old paths until retarget.
3. **Step 3: Implement Task 4.1**
   - **Change anchor:** those test files; export obsolete dir list if tests need it.
   - **Design carried:** I1–I8.
   - **Implementation approach:** Point assertions at `using-superpowers` and Apply `reference/dispatch-units.md`. Retarget `sdd-guidance.test.ts` off `skills/subagent-driven-development/SKILL.md`. Init/update fixtures expect obsolete dirs gone and apply `reference/` present.
   - **Edges and failures:** Do not weaken I1 while retargeting.
   - **Out of scope:** New generator.
4. **Step 4: Run focused verification** — Re-run Step 2 plus `pnpm exec vitest run test/core/templates/skill-templates-parity.test.ts` if it still compiles.
5. **Step 5: Self-review and handoff** — No test still requires a live VBC/SDD/when-to-dispatch SKILL.md.

#### Task 4.2: Refresh projections through existing parity

**Files:**
- Modify: generated `.cursor/commands/sp-apply.md`, `sp-propose.md`, `sp-verify.md` and matching `.cursor/skills/superpowers-*` only via existing generate path; `test/core/templates/skill-templates-parity.test.ts`

1. **Step 1: Write or identify checks**
   - **Spec bound:** I2; I8; Decision 3 “still three emitters”.
   - **Test location:** `test/core/templates/skill-templates-parity.test.ts`.
   - **Case table:** parity | unit | existing hash/string pins | updated to short index + reference existence | pass ★.
   - **Test skeleton:**
     ```ts
     import { getApplyChangeSkillTemplate, getSpApplyCommandTemplate } from '../../src/core/templates/skill-templates.js';
     it('apply command omits remediations list', () => {
       expect(getSpApplyCommandTemplate().content).not.toMatch(/≥2 meaningfully different Solutions/);
       expect(getApplyChangeSkillTemplate().instructions).not.toMatch(/≥2 meaningfully different Solutions/);
     });
     ```
2. **Step 2: Run the focused tests** — parity will fail on old hashes until refresh.
3. **Step 3: Implement Task 4.2**
   - **Change anchor:** parity expected strings; regenerate Cursor copies with existing `generateSkillContent` / `generateCommand` + cursor adapter. Skip `.cursor/skills/full-qa-test/SKILL.md`.
   - **Design carried:** I8; I7.
   - **Implementation approach:** Same pipeline slim used. Do not add a markdown source tree.
   - **Edges and failures:** Repo-local `.cursor/skills` copies of retired skills should be absent after copy/obsolete removal if this repo is an init target; if they are fixtures, delete them in this task.
   - **Out of scope:** DRY rewrite.
4. **Step 4: Run focused verification** — Re-run parity, stage-file-disclosure, ownership-collapse, skill-trigger-narrowing, then Git-aware related tests.
5. **Step 5: Self-review and handoff** — I1–I8 green; D leftovers still present on purpose.

Workers MAY append `#### Implementation Notes` under any Step 1–5 when the implementation produces a useful finding. Notes are non-normative and do not replace `tasks.md` checkboxes.
