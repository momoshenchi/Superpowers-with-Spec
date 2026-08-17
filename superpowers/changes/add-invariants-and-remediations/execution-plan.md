## File Structure

- Create:
  - `schemas/spec-driven/templates/remediations.md`
- Modify:
  - `schemas/spec-driven/templates/design.md`
  - `schemas/spec-driven/schema.yaml` (design `instruction`)
  - `src/commands/schema.ts` (design fallback template string)
  - `src/core/templates/workflows/change-review.ts`
  - `src/core/templates/workflows/final-quality-gates.ts` (`getFinalQualityGateInstructions` — primary FQG / Repair ownership source)
  - `src/core/templates/workflows/apply-change.ts` (only if interpolation/host wiring needs a remediations mention outside the shared FQG block)
  - `src/core/templates/workflows/verify-change.ts`
  - Generated/parity skill & command projections touched by template helpers (as required by existing parity tests)
  - `skills/subagent-driven-development/SKILL.md` and/or `skills/when-to-dispatch-code-review/SKILL.md` only if Apply repair wording must mention remediations
  - `test/core/templates/design-conventions.test.ts`
  - Additional focused tests under `test/core/templates/` or workflow guidance tests as needed
- Test:
  - `test/core/templates/design-conventions.test.ts`
  - skill-templates-parity / workflow instruction tests that snapshot Apply, Verify, change-review strings
  - `pnpm exec vitest run` on the focused files above, then `pnpm run build`, `pnpm run lint`, `pnpm test` at hardening

## Dispatch Coordination

| Dispatch unit | Owns (paths) | Depends on | Assignee policy | Parallel | Handoff evidence |
|---|---|---|---|---|---|
| 1. Design Invariants conventions | design template, schema design instruction, schema.ts fallback, change-review, design-conventions tests | none | coordinator may run inline or one worker | no overlap with unit 2 template file create if both edit shared parity helpers—serialize shared test files | Invariants present in template; review BLOCKER wording; tests updated for section order |
| 2. Remediations artifact conventions | remediations template, `final-quality-gates.ts`, verify-change, optional apply-change wiring / SDD skills, remediations-focused tests | unit 1 preferred first (Verify invariants + remediations land together) | coordinator may run inline or one worker after unit 1 | serialize writes to shared parity test files | remediations template exists; FQG/Verify strings enforce lifecycle + change-dir discovery; focused tests green |

A dispatch unit is an allocation boundary, not a required one-to-one subagent assignment.

## Task Plan

### 1. Design Invariants conventions

#### Task 1.1: Add Invariants to design templates

1. **Step 1: Write failing test** — Extend `design-conventions.test.ts` section-order expectation to require `## Invariants` after `## Contracts` and before `## Attachments`; assert N/A guidance phrase `N/A — no cross-path invariants`.
2. **Step 2: Run test to verify it fails** — `pnpm exec vitest run test/core/templates/design-conventions.test.ts`; expect missing Invariants / order failure.
3. **Step 3: Implement minimal code** — Edit `schemas/spec-driven/templates/design.md` and the matching design fallback in `src/commands/schema.ts` to insert `## Invariants` with short author guidance and N/A example.
4. **Step 4: Run test to verify it passes** — Re-run the same vitest file; expect pass.
5. **Step 5: Commit** — Stage template + fallback + test updates together when the unit is ready.

#### Task 1.2: Update design schema instruction

1. **Step 1: Write failing test** — Assert schema design instruction (loaded from package schema or instruction-loader fixture) requires `## Invariants` and does not forbid inventing Invariants.
2. **Step 2: Run test to verify it fails** — Run the asserting test; expect failure on current “do not invent … Invariants” text.
3. **Step 3: Implement minimal code** — Edit `schemas/spec-driven/schema.yaml` design `instruction`: require Invariants (falsifiable IDs, owner checks, N/A allowed); carve Invariants out of the forbidden-extra-headings rule while keeping the rule for other invented mandatories.
4. **Step 4: Run test to verify it passes** — Re-run focused instruction/template tests.
5. **Step 5: Commit** — With unit 1 when cohesive.

#### Task 1.3: Change-review Invariants checks

1. **Step 1: Write failing test** — Assert change-review workflow/skill text requires `## Invariants`, treats missing heading as BLOCKER, accepts N/A.
2. **Step 2: Run test to verify it fails** — Focused parity/guidance test fails on missing strings.
3. **Step 3: Implement minimal code** — Update `change-review.ts` design convention table/checks; regenerate or sync skill/command projections per repo parity pattern.
4. **Step 4: Run test to verify it passes** — Parity tests green.
5. **Step 5: Commit** — With unit 1.

#### Task 1.4: Finish design-conventions test coverage

1. **Step 1: Write failing test** — Cover any remaining instruction/template anchors (falsify/owner check language if asserted).
2. **Step 2: Run test to verify it fails** — Confirm red.
3. **Step 3: Implement minimal code** — Adjust template comments/instruction until assertions match specs.
4. **Step 4: Run test to verify it passes** — `pnpm exec vitest run test/core/templates/design-conventions.test.ts` (and related) green.
5. **Step 5: Commit** — Close unit 1.

### 2. Remediations artifact conventions

#### Task 2.1: Add remediations template

1. **Step 1: Write failing test** — Assert `schemas/spec-driven/templates/remediations.md` exists and contains Options, Choice, Rationale, Root cause, Fix, Guard, Evidence, Status.
2. **Step 2: Run test to verify it fails** — File missing → fail.
3. **Step 3: Implement minimal code** — Create the template with an `R1` example skeleton matching design contracts.
4. **Step 4: Run test to verify it passes** — New/extended test green.
5. **Step 5: Commit** — With unit 2.

#### Task 2.2: FQG repair ownership → remediations

1. **Step 1: Write failing test** — Assert Final Quality Gates instruction text (from `final-quality-gates.ts` / generated Apply skill) requires create/append remediations before code edits for accepted code-review/Verify P0/P1, change-directory path discovery, multi-option selection, omit/N/A when zero such repairs, exclusion of Design Verify-only and P2-only, P0 Guard before resolved, optional `R#` link.
2. **Step 2: Run test to verify it fails** — Missing strings in FQG/Apply templates.
3. **Step 3: Implement minimal code** — Update `getFinalQualityGateInstructions()` in `final-quality-gates.ts`; touch `apply-change.ts` only if needed outside that shared block; sync generated skills/commands.
4. **Step 4: Run test to verify it passes** — Apply/FQG instruction assertions green.
5. **Step 5: Commit** — With unit 2.

#### Task 2.3: Verify reads remediations + Invariants

1. **Step 1: Write failing test** — Assert Verify workflow probes change-dir `remediations.md` (not only contextFiles), checks non-N/A Invariants with owner-check failure → CRITICAL, and incomplete evidence when resolved P0 lacks Guard.
2. **Step 2: Run test to verify it fails** — Current verify template lacks strings.
3. **Step 3: Implement minimal code** — Update `verify-change.ts` + skill/command parity.
4. **Step 4: Run test to verify it passes** — Focused tests green.
5. **Step 5: Commit** — With unit 2.

#### Task 2.4: SDD / review-timing touch-up

1. **Step 1: Write failing test** — Only if existing guidance tests snapshot repair ownership; otherwise document N/A and skip new assertions.
2. **Step 2: Run test to verify it fails** — If applicable.
3. **Step 3: Implement minimal code** — Minimal wording in SDD / when-to-dispatch-code-review so remediations is named under Apply repair ownership without new gates.
4. **Step 4: Run test to verify it passes** — Related tests green or confirm no snapshot breakage.
5. **Step 5: Commit** — With unit 2.

#### Task 2.5: Integration verification for this change

1. **Step 1: Write failing test** — None new if prior tasks cover contracts; use verification commands as the red/green signal for regressions.
2. **Step 2: Run test to verify it fails** — If full suite shows unrelated failures, isolate; fix only regressions from this change.
3. **Step 3: Implement minimal code** — Fix any fallout from template/parity edits.
4. **Step 4: Run test to verify it passes** — `pnpm exec vitest run` on focused files; `pnpm run build`; `pnpm run lint`; then `pnpm test`. Record outcomes in `test-plan.md`.
5. **Step 5: Commit** — Final unit 2 commit after green focused path.

## Final Validation

After both dispatch units integrate: one cross-unit review of design template order, remediations lifecycle wording, and Verify/Apply/Review consistency; run focused tests + build + lint + full non-visual suite; complete Test Hardening and Final Quality Gates per Apply (this meta-change’s own Apply will exercise remediations if any P0/P1 appear).
