## File Structure

- Modify:
  - `src/core/templates/workflows/apply-change.ts` — Hardening order: full-qa-test then Git-aware; no layer dedup
  - `src/core/templates/workflows/final-quality-gates.ts` — suite-stage identifiers; parallel pre-Verify wave; complete-suite exceptions
  - `src/core/templates/workflows/verify-change.ts` — Apply-FQG reuse of Hardening suite evidence
  - `skills/using-superpowers/SKILL.md` — advertised FQG order
  - `skills/subagent-driven-development/SKILL.md` — same advertised FQG order
  - `docs/workflows.md` / `docs/commands.md` / `docs/concepts.md` — parallel wave + suite timing
  - generated `.cursor/commands/sp-apply.md`, `sp-verify.md`, `.cursor/skills/superpowers-apply-change/SKILL.md`, `superpowers-verify-change/SKILL.md`, `.cursor/skills/using-superpowers/SKILL.md`, `.cursor/skills/subagent-driven-development/SKILL.md` via existing generator/copy path only
- Test:
  - `test/core/templates/final-quality-gates.test.ts`
  - `test/core/templates/apply-autonomy.test.ts`
  - `test/core/templates/skill-templates-parity.test.ts`
  - `test/docs/workflows-docs.test.ts`
  - `test/core/using-superpowers-guidance.test.ts`
  - `test/core/subagent-work-package-guidance.test.ts`
- Skip:
  - `.cursor/skills/full-qa-test/SKILL.md`

## Attachments

None.

## Dispatch Coordination

| Unit | Scope | Ownership | Dependencies | Assignee policy | Parallel | Handoff |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Hardening suite timing | `apply-change.ts`, `final-quality-gates.ts` suite helper | None | Execute inline or one worker | No — same helper strings as unit 2 | Suite-stage identifiers and Hardening order green |
| 2 | Parallel FQG + Verify reuse + docs | `final-quality-gates.ts` gate body, `verify-change.ts`, `using-superpowers`, docs, projections | Unit 1 identifiers exist | Prefer after unit 1 | No — shares `final-quality-gates.ts` | Pins I1–I6; projections refreshed |

## Execution Boundaries

### 1. Hardening suite timing

- Deliver tasks 1.1–1.3.
- Do not rewrite FQG spawn order here beyond what 1.3 needs in the shared helper.

### 2. Parallel pre-Verify wave

- Deliver tasks 2.1–2.4.
- Do not weaken I5 while adding `ran-complete-suite-optional`.

## Dispatch Execution

### 1. Hardening suite timing

#### Task 1.1: full-qa-test before Git-aware

**Files:**
- Modify: `src/core/templates/workflows/apply-change.ts` Hardening step
- Test: `test/core/templates/apply-autonomy.test.ts`

1. **Step 1: Write or extend focused tests**
   - **Spec bound:** `Requirement: Hardening SHALL expand full-qa-test before Git-aware` / `Scenario: New unit cases exist before --changed`. WHEN = Hardening adds unit cases. THEN = those tests exist on disk before Git-aware runs.
   - **Test location:** `test/core/templates/apply-autonomy.test.ts`. `it('runs full-qa-test expansion before Git-aware selection')`.
   - **Case table:**

     | Scenario | Form | `it` name | Primary |
     | --- | --- | --- | --- |
     | full-qa-test invoke appears before Git-aware helper in Apply Hardening | unit | `runs full-qa-test expansion before Git-aware selection` | ★ |

   - **Test skeleton:**

     ```ts
     it('runs full-qa-test expansion before Git-aware selection', () => {
       const text = getApplyChangeSkillTemplate().instructions;
       const hardening = text.slice(text.indexOf('Run Test Hardening'));
       const land = hardening.search(
         /land (new |those )?tests|write.*executable `form=unit`|before (running )?Git-aware/i,
       );
       const git = hardening.indexOf('Canonical non-visual test-suite preflight');
       expect(hardening).toMatch(/full-qa-test/);
       expect(land).toBeGreaterThan(-1);
       expect(git).toBeGreaterThan(land);
       expect(hardening).toMatch(
         /tree that contains those tests|selection can include tests added/i,
       );
     });
     ```
2. **Step 2: Run the focused tests** — `pnpm exec vitest run test/core/templates/apply-autonomy.test.ts`. Expect the new `it` to fail until order is fixed.
3. **Step 3: Implement Task 1.1**
   - **Change anchor:** Apply Hardening numbered list in `apply-change.ts`; keep interpolating `getCanonicalNonVisualSuiteInstructions` after the full-qa-test / 10→10→10 bullets.
   - **Design carried:** Decision 3; I3.
   - **Implementation approach:** Move analyze-gaps + invoke `full-qa-test` + **write executable `form=unit` cases to disk** above the canonical preflight interpolation. Instruct Git-aware to use the tree that contains those tests. Manual Coverage stays after Git-aware.
   - **Edges and failures:** Missing `full-qa-test` skill still uses six-dimension fallback before Git-aware.
   - **Out of scope:** Changing 10→10→10 caps; `full-qa-test` skill body.
4. **Step 4: Run focused verification** — same vitest file.
5. **Step 5: Self-review and handoff**.

#### Task 1.2: two layers, no dedup

**Files:**
- Modify: `final-quality-gates.ts` `getCanonicalNonVisualSuiteInstructions`
- Test: `test/core/templates/final-quality-gates.test.ts`

1. **Step 1: Write or extend focused tests**
   - **Spec bound:** `Requirement: Hardening SHALL keep two suite layers without dedup` / `Scenario: Related tests overlap registered unit cases`.
   - **Test location:** `final-quality-gates.test.ts`. `it('does not let Git-aware evidence close test-plan rows')`.
   - **Case table:** overlap still runs both layers ★.
   - **Test skeleton:**

     ```ts
     it('does not let Git-aware evidence close test-plan rows', () => {
       const text = getCanonicalNonVisualSuiteInstructions('Test Hardening');
       expect(text).toMatch(/Registered `test-plan.md` rows remain required/);
       expect(text).not.toMatch(/Git-aware output may satisfy registered TC-/);
       expect(text).toMatch(/do not skip|both layers|without dedup|each layer/i);
     });
     ```
2. **Step 2:** `pnpm exec vitest run test/core/templates/final-quality-gates.test.ts`
3. **Step 3:**
   - **Change anchor:** `getCanonicalNonVisualSuiteInstructions` bullets.
   - **Design carried:** Decision 2; I4.
   - **Implementation approach:** Explicit sentence: overlapping files still run in both layers; one log cannot close the other.
   - **Edges:** Manual Coverage still never satisfied by Git-aware (already true).
   - **Out of scope:** Changing Manual Coverage split.
4. **Step 4:** re-run focused file.
5. **Step 5:** handoff.

#### Task 1.3: no default complete suite

**Files:**
- Modify: `getCanonicalNonVisualSuiteInstructions`
- Test: `final-quality-gates.test.ts`

1. **Step 1:**
   - **Spec bound:** `Requirement: Git-aware unavailable SHALL not run the complete suite` and `Requirement: Complete suite remains exceptional`.
   - **Test location:** `it('records unavailable Git-aware without complete-suite fallback')`.
   - **Test skeleton:**

     ```ts
     it('records unavailable Git-aware without complete-suite fallback', () => {
       const text = getCanonicalNonVisualSuiteInstructions('Test Hardening');
       expect(text).toContain('git-aware-unavailable-recorded');
       expect(text).toMatch(/do not run the complete canonical suite/i);
       expect(text).not.toMatch(/if unavailable, run the complete/i);
       expect(text).toContain('ran-complete-suite-optional');
     });
     ```
2. **Step 2:** same vitest file; expect missing identifier until implemented.
3. **Step 3:**
   - **Change anchor:** Git baseline / unavailable bullets.
   - **Design carried:** Decision 4; I5; Contracts suite-stage table.
   - **Implementation approach:** List exception conditions; introduce `ran-complete-suite-optional` and `git-aware-empty-expected`. Default copy: record and stop; never “run complete suite to pass.”
   - **Edges:** User-asked / CI-required / empty-not-expected-and-no-focused-command.
   - **Out of scope:** Changing CI configs in this repo.
4. **Step 4:** re-run.
5. **Step 5:** handoff.

### 2. Parallel pre-Verify wave

#### Task 2.1: parallel spawn of CR ∥ Simplify ∥ DV

**Files:**
- Modify: `getFinalQualityGateInstructions` opening + numbered gates
- Test: `final-quality-gates.test.ts`, `skill-templates-parity.test.ts`

1. **Step 1:**
   - **Spec bound:** `Requirement: Apply SHALL run a parallel pre-Verify wave` / `Scenario: Host can spawn three gate workers`.
   - **Test location:** `it('spawns code review, simplify, and design-verify in parallel before verify')`.
   - **Test skeleton:**

     ```ts
     it('spawns code review, simplify, and design-verify in parallel before verify', () => {
       const text = getFinalQualityGateInstructions();
       expect(text).toMatch(/parallel/i);
       expect(text).not.toMatch(/run these gates in exactly this order/);
       expect(text.indexOf('code review')).toBeLessThan(text.indexOf('Verify (rounds'));
       expect(text).toMatch(/Do not start Verify until/);
     });
     ```
2. **Step 2:** expect current “exactly this order” to fail the not.toMatch.
3. **Step 3:**
   - **Change anchor:** `getFinalQualityGateInstructions` preamble and gate list.
   - **Design carried:** Decision 1 mapping; I1; I2.
   - **Implementation approach:** Wave 1: spawn CR, Simplify, DV together. Await all three. Verify is listed after the wave, not as a fourth serial sibling of CR.
   - **Edges:** `not applicable` DV still spawned (returns quickly).
   - **Out of scope:** Changing Simplify’s four-angle internal fan-out.
4. **Step 4:** focused + parity if hashes change.
5. **Step 5:** handoff.

#### Task 2.2: P0 parallel retry

**Files:**
- Modify: same gate helper; remediations paragraph still applies to CR P0/P1
- Test: `final-quality-gates.test.ts`

1. **Step 1:**
   - **Spec bound:** `Requirement: Pre-Verify P0 retries stay in the parallel wave` scenarios CR-only P0, both P0, round four, Simplify UI re-runs DV.
   - **Test location:** `final-quality-gates.test.ts`. `it('retries unresolved CR and DV P0 in parallel and withholds Verify')`.
   - **Case table:** CR-only P0; both P0; round four; Simplify UI re-runs DV.
   - **Test skeleton:**

     ```ts
     it('retries unresolved CR and DV P0 in parallel and withholds Verify', () => {
       const text = getFinalQualityGateInstructions();
       expect(text).toMatch(/retry only the unresolved/i);
       expect(text).toMatch(/round four|four rounds/i);
       expect(text).toMatch(/Do not start Verify until/);
       expect(text).not.toMatch(
         /Do not reuse a gate worker or start a later gate before the current worker has completed/,
       );
       expect(text).toMatch(/UI-owned paths|UI files for Design verify/i);
       expect(text).toMatch(/Simplify.*(failed|blocked)|failed\/blocked/i);
     });
     ```
2. **Step 2:** run file.
3. **Step 3:**
   - **Change anchor:** round rules for CR and DV; remove “do not start a later gate before current completes” as applied to CR vs Simplify vs DV.
   - **Design carried:** Decision 1 Choice C; I2.
   - **Implementation approach:** Integrate wave before repairs. Retry only P0 gates; cap 4; Simplify `failed`/`blocked` pauses. Keep remediations.md for CR P0/P1.
   - **Edges:** UI-touching CR repair or Simplify UI edits re-run DV.
   - **Out of scope:** Changing proposal-review round limits.
4. **Step 4:** re-run.
5. **Step 5:** handoff.

#### Task 2.3: Verify reuse Hardening suite evidence

**Files:**
- Modify: `verify-change.ts` correctness; FQG Verify paragraph
- Test: `final-quality-gates.test.ts` or verify template test

1. **Step 1:**
   - **Spec bound:** `Requirement: Verify suite preflight SHALL reuse unchanged Hardening Git-aware evidence` / Zero implementation diff, Simplify changed, CR/DV repair, Verify repair, baseline changed, Standalone.
   - **Test location:** `final-quality-gates.test.ts` plus `getSpVerifyCommandTemplate`.
   - **Test skeleton:**

     ```ts
     it('reuses Hardening Git-aware when implementation and baseline are unchanged', () => {
       const apply = getFinalQualityGateInstructions();
       expect(apply).toMatch(/reuse.*Hardening suite-stage|cite that Hardening/i);
       expect(apply).toMatch(/agent-browser/);
       expect(apply).toMatch(/test-plan\.md` rows that Verify still owns|Verify still owns/i);
       expect(apply).toMatch(/baseline changed|Git baseline/i);
       expect(apply).toMatch(/Verify repair|next Verify round/i);
       expect(apply).not.toMatch(/only if Simplify or a Verify repair/i);
     });

     it('standalone verify always preflights', () => {
       const verify = getSpVerifyCommandTemplate().content;
       expect(verify).toMatch(/canonical non-visual/i);
       expect(verify).not.toMatch(/reuse Hardening suite-stage/i);
     });
     ```
2. **Step 2:** run tests.
3. **Step 3:**
   - **Change anchor:** `VERIFY` gate paragraph in `final-quality-gates.ts`; verify-change correctness intro.
   - **Design carried:** Decision 5; I6.
   - **Implementation approach:** Apply-FQG path: if no implementation change since Hardening suite record and baseline unchanged, cite Hardening state; else re-run preflight. Count CR/DV/Simplify/Verify-repair implementation edits, not only Simplify. Always Manual Coverage including deferred `agent-browser`. Standalone `/sp:verify` unchanged preflight-every-time.
   - **Edges:** Verify repair that edits implementation starts next Verify round with a fresh preflight.
   - **Out of scope:** Dedup with test-plan rows.
4. **Step 4:** re-run.
5. **Step 5:** handoff.

#### Task 2.4: docs, using-superpowers, projections

**Files:**
- Modify: `skills/using-superpowers/SKILL.md`, `skills/subagent-driven-development/SKILL.md`, `docs/workflows.md`, `docs/commands.md`, `docs/concepts.md`, generated apply/verify/using-superpowers Cursor copies
- Test: `test/docs/workflows-docs.test.ts`, `test/core/using-superpowers-guidance.test.ts`, `test/core/subagent-work-package-guidance.test.ts`, parity

1. **Step 1:**
   - **Implementation approach:** Delete sequential FQG advertisement from using-superpowers and subagent-driven-development (point at `/sp:apply` instead of restating the parallel wave). Update docs FQG/Git-aware paragraphs including `docs/concepts.md`. Refresh projections with existing `generateSkillContent` / `generateCommand` + `cursorAdapter`. Skip full-qa-test cursor file.
   - **Test location:** `test/core/using-superpowers-guidance.test.ts`.
   - **Test skeleton:**

     ```ts
     it('does not advertise sequential CR then Simplify then Verify then DV as Apply FQG order', () => {
       expect(usingSuperpowers).not.toContain(
         'code review → Simplify → Verify → Design Verify',
       );
       expect(subagentDriven).not.toContain(
         'code review → Simplify → Verify → Design Verify',
       );
       expect(concepts).not.toContain(
         'code review → Simplify → Verify → Design Verify',
       );
     });
     ```
2. **Step 2:** run those tests.
3. **Step 3:**
   - **Change anchor:** using-superpowers and subagent-driven-development Proposal-path sentence; docs FQG/Git-aware paragraphs including `docs/concepts.md`.
   - **Design carried:** Decision 1 advertised order; Decision 6 spawn fallback.
   - **Implementation approach:** Delete sequential FQG advertisement from using-superpowers and subagent-driven-development (point at `/sp:apply` instead of restating the parallel wave). Update docs FQG/Git-aware paragraphs including `docs/concepts.md`. Refresh projections with existing `generateSkillContent` / `generateCommand` + `cursorAdapter`. Skip full-qa-test cursor file.
   - **Edges:** same-context fallback still documented.
   - **Out of scope:** New DRY markdown architecture.
4. **Step 4:** `pnpm exec vitest run` focused files; `pnpm exec tsc --noEmit` if types changed.
5. **Step 5:** handoff.

## Final validation

`superpowers validate parallel-fqg-and-suite-timing`. Git-aware related tests plus focused pins above. Confirm I1–I6. Do not require a complete suite as a pass.
