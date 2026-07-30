## File Structure

- Create:
  - `src/core/templates/workflows/final-quality-gates.ts` - Shared generated-instruction fragments for apply orchestration and final-gate outcome reporting.
  - `src/core/templates/workflows/simplify.ts` - `/sp:simplify` skill and command templates.
  - `src/core/templates/workflows/design-verify.ts` - `/sp:design-verify` skill and command templates.
  - Focused workflow-template tests if a new test file makes the gate contract clearer.
- Modify:
  - `src/core/templates/workflows/apply-change.ts` - Run and report final gates after Test Hardening.
  - `src/core/templates/workflows/verify-change.ts` - Add E2E correctness evidence.
  - `src/core/templates/skill-templates.ts` - Export new workflow templates.
  - `src/core/shared/skill-generation.ts` - Generate the two new skills and commands.
  - `src/core/profiles.ts`, `src/core/profile-sync-drift.ts`, `src/core/init.ts`, `src/core/shared/tool-detection.ts`, `src/commands/config.ts` - Explicit workflow registration and profile/install synchronization.
  - `docs/commands.md`, `docs/workflows.md`, `docs/supported-tools.md` - User-facing workflow behavior and names.
  - Existing generation, template-parity, profile, init/update, and detection tests - New expected IDs, output, and hashes.
- Test:
  - `test/core/templates/skill-templates-parity.test.ts` - Skill/command content and generated-output parity.
  - `test/core/shared/skill-generation.test.ts` and `test/core/shared/tool-detection.test.ts` - Generated IDs and skill names.
  - `test/core/profile-sync-drift.test.ts`, `test/core/init.test.ts`, `test/core/update.test.ts` - Selection, installation, and deselection behavior.
  - Relevant command-generation adapter tests - `/sp:simplify` and `/sp:design-verify` output paths/names.

## Attachments

None.

## Dispatch Coordination

| Unit | Scope | Ownership | Dependencies | Assignee policy | Parallel | Handoff |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Final-gate contract and apply | `src/core/templates/workflows/final-quality-gates.ts`, `apply-change.ts` | None | Dedicated worker or coordinator | No; defines shared contract | Fragment API, apply text, focused tests, self-review |
| 2 | Verify E2E evidence | `src/core/templates/workflows/verify-change.ts` | Unit 1 contract vocabulary | Dedicated worker | Yes after canonical outcomes stabilize | Verify text, report tests, self-review |
| 3 | New workflow distribution | `simplify.ts`, `design-verify.ts`, registries | Unit 1 shared fragments | Dedicated worker | Yes after Unit 1 API stabilizes | New templates, registry edits, generation/profile tests |
| 4 | Documentation and integration | docs, parity hashes, final tests | Units 1–3 | Coordinator | No; consumes all integrated changes | Full validation outputs and final review |

## Execution Boundaries

### 1. Final-gate contract and apply

Owns the canonical sequence, non-visual-suite Test Hardening preflight, and outcome vocabulary. It must not introduce a `code-review` workflow ID or hard-code a Claude-only command. It may modify apply and test-plan guidance, but it must not alter verify or the two standalone workflow modules.

### 2. Verify E2E evidence

Owns correctness/E2E text and related tests only. It reuses the shared outcome terms but does not change apply sequencing or workflow registry files.

### 3. New workflow distribution

Owns the new standalone templates and all explicit registration maps. It must preserve existing workflow IDs and avoid adding `code-review`; any overlap with Unit 1 is limited to importing/reusing the settled shared fragment.

### 4. Documentation and integration

Owns user-facing descriptions, hashes/snapshots, full-suite validation, and one post-integration review. It does not redefine behavior from earlier units without returning the issue to that unit.

## Dispatch Execution

### 1. Final-gate contract and apply

#### Task 1.1: Add shared quality-gate workflow fragment

**Files:**
- Create: `src/core/templates/workflows/final-quality-gates.ts` — canonical final-gate prose and outcome/report helpers.
- Test: `test/core/templates/skill-templates-parity.test.ts` or a focused new template test — shared contract assertions.

1. **Step 1: Write focused tests** — Assert native review → simplify → verify → design-verify ordering; allowed outcomes; no generated `code-review`; and that changing code invalidates downstream evidence.
2. **Step 2: Run the focused tests** — Run `pnpm exec vitest run test/core/templates/skill-templates-parity.test.ts`; expect the new assertions to fail before the fragment exists.
3. **Step 3: Implement Task 1.1** — Create reusable, host-neutral instruction fragments that distinguish native review fallback, `blocked`, and `not applicable` from a pass.
4. **Step 4: Run focused verification** — Run the same Vitest command; expect all relevant assertions to pass.
5. **Step 5: Self-review and handoff** — Confirm no host-specific slash command or code-review ID was introduced; report exports and test output.

#### Task 1.2: Integrate final gates into apply completion

**Files:**
- Modify: `src/core/templates/workflows/apply-change.ts` — both skill and command forms.
- Modify: relevant template tests — apply completion and report assertions.

1. **Step 1: Write focused tests** — Cover authoritative canonical non-visual-suite discovery, every selected command passing before Test Hardening completes, ambiguous/failing preflight, each gate outcome, failure/restart, blocked UI verification, and standalone workflows absent from the selected profile.
2. **Step 2: Run the focused tests** — Run `pnpm exec vitest run test/core/templates/skill-templates-parity.test.ts`; expect new apply assertions to fail.
3. **Step 3: Implement Task 1.2** — During Test Hardening, discover the complete non-visual suite from repository scripts, CI, test docs, and `test-plan.md`; run every selected command and record evidence before using the shared final-gate fragment. Remove any completion or archive suggestion that bypasses either preflight or final gates.
4. **Step 4: Run focused verification** — Run the focused Vitest command; expect apply text and generated skill content assertions to pass.
5. **Step 5: Self-review and handoff** — Check both template variants preserve identical ordering, never infer full validation from one convenient command, and never claim completion from task checkboxes alone.

#### Task 1.3: Test contract and no-code-review boundary

**Files:**
- Modify: `test/core/templates/skill-templates-parity.test.ts` and relevant registry tests.

1. **Step 1: Write focused tests** — Add negative assertions that `code-review` is absent from generated workflow/command lists while apply still contains an explicit review gate.
2. **Step 2: Run the focused tests** — Run `pnpm exec vitest run test/core/templates/skill-templates-parity.test.ts test/core/shared/tool-detection.test.ts`; expect the new behavior assertions to fail until integration is complete.
3. **Step 3: Implement Task 1.3** — Adjust test helpers and contract assertions only; do not create a workflow as a test workaround.
4. **Step 4: Run focused verification** — Run the same command; expect both suites to pass.
5. **Step 5: Self-review and handoff** — Verify the tests fail for a skipped native-review contract and for an accidentally registered code-review ID.

### 2. Verify E2E evidence

#### Task 2.1: Classify and require applicable E2E acceptance

**Files:**
- Modify: `src/core/templates/workflows/verify-change.ts`.
- Test: `test/core/templates/skill-templates-parity.test.ts`.

1. **Step 1: Write focused tests** — Assert generated verify instructions discover and run every canonical non-visual test command before requiring normal-entry-point E2E, a risk path, and browser console/network checks for changed runnable journeys.
2. **Step 2: Run the focused tests** — Run `pnpm exec vitest run test/core/templates/skill-templates-parity.test.ts`; expect missing E2E-contract assertions to fail.
3. **Step 3: Implement Task 2.1** — Extend correctness guidance with repository-authority-based full non-visual preflight, without weakening existing requirement/scenario mapping or making all changes require browser automation.
4. **Step 4: Run focused verification** — Run the focused Vitest command; expect both generated verify forms to contain the new contract.
5. **Step 5: Self-review and handoff** — Confirm screenshots/source inspection are explicitly insufficient as E2E proof, a partial test script cannot claim full validation, and non-runnable scopes remain supported.

#### Task 2.2: Define evidence outcomes and blockers

**Files:**
- Modify: `src/core/templates/workflows/verify-change.ts`.
- Test: template contract tests.

1. **Step 1: Write focused tests** — Assert `passed`, `blocked`, and `not applicable` report behavior, including missing or ambiguous canonical-suite authority, failed test commands, missing runtime prerequisites, and concrete scope reasons.
2. **Step 2: Run the focused tests** — Run `pnpm exec vitest run test/core/templates/skill-templates-parity.test.ts`; expect failures before outcome text is implemented.
3. **Step 3: Implement Task 2.2** — Add preflight report rows plus severity/completion semantics so a blocked or failed canonical suite prevents E2E and cannot produce a correctness pass.
4. **Step 4: Run focused verification** — Run the focused test command; expect evidence and blocker assertions to pass.
5. **Step 5: Self-review and handoff** — Confirm manual human inspection is not silently accepted as E2E evidence.

#### Task 2.3: Verify generated parity and report actionability

**Files:**
- Modify: `test/core/templates/skill-templates-parity.test.ts`.

1. **Step 1: Write focused tests** — Check skill/command parity for E2E rules and that reports name the route, command/environment, states, and missing prerequisites.
2. **Step 2: Run the focused tests** — Run `pnpm exec vitest run test/core/templates/skill-templates-parity.test.ts`; expect any missing exact contract terms to fail.
3. **Step 3: Implement Task 2.3** — Update assertions and deterministic content hashes after the intended template content settles.
4. **Step 4: Run focused verification** — Run the suite; expect all template tests to pass with updated hashes.
5. **Step 5: Self-review and handoff** — Review hashes only after semantic assertions prove coverage; report the exact test command.

### 3. Simplify and design-verify workflow surfaces

#### Task 3.1: Add simplify templates

**Files:**
- Create: `src/core/templates/workflows/simplify.ts`.
- Modify: `src/core/templates/skill-templates.ts`.
- Test: `test/core/templates/skill-templates-parity.test.ts`.

1. **Step 1: Write focused tests** — Require `/sp:simplify`, behavior-preserving scope, forbidden observable changes, fresh verification, and repair/revert on uncertainty.
2. **Step 2: Run the focused tests** — Run the template-parity suite; expect the new template exports and content assertions to fail.
3. **Step 3: Implement Task 3.1** — Add parallel skill and command templates using shared outcome/evidence vocabulary while preserving the `/sp:` namespace.
4. **Step 4: Run focused verification** — Run the template-parity suite; expect simplify assertions to pass.
5. **Step 5: Self-review and handoff** — Confirm it recreates documented cleanup behavior but does not claim to replace host-native `/simplify`.

#### Task 3.2: Add design-verify templates

**Files:**
- Create: `src/core/templates/workflows/design-verify.ts`.
- Modify: `src/core/templates/skill-templates.ts`.
- Test: template contract tests.

1. **Step 1: Write focused tests** — Require UI-scope detection, visual `DESIGN.md` discovery, runtime/browser evidence, explicit status values, and no formal-pass claim without a formal design source.
2. **Step 2: Run the focused tests** — Run the template-parity suite; expect new design-verify export/content assertions to fail.
3. **Step 3: Implement Task 3.2** — Add skill and command templates that separate functional verification from visual conformance and identify actionable route/state findings.
4. **Step 4: Run focused verification** — Run the template-parity suite; expect all design-verify assertions to pass.
5. **Step 5: Self-review and handoff** — Confirm non-UI changes are `not applicable`, missing runtime is `blocked`, and a missing visual design source is never a formal pass.

#### Task 3.3: Register new workflow IDs and generation paths

**Files:**
- Modify: `src/core/shared/skill-generation.ts`, `src/core/profiles.ts`, `src/core/profile-sync-drift.ts`, `src/core/init.ts`, `src/core/shared/tool-detection.ts`, `src/commands/config.ts`.
- Test: generation/profile/detection suites.

1. **Step 1: Write focused tests** — Assert exact IDs `simplify` and `design-verify`, expected `superpowers-*` directories, filtered generation, and the absence of `code-review`.
2. **Step 2: Run the focused tests** — Run `pnpm exec vitest run test/core/shared/skill-generation.test.ts test/core/shared/tool-detection.test.ts test/core/profile-sync-drift.test.ts`; expect new-ID assertions to fail.
3. **Step 3: Implement Task 3.3** — Add the new workflow IDs consistently to every explicit list/map and metadata surface; do not alter the core profile unless a product decision explicitly requires it.
4. **Step 4: Run focused verification** — Run the same test command; expect selected/deselected workflow logic and directory mapping to pass.
5. **Step 5: Self-review and handoff** — Compare every existing registry with the two additions and verify no code-review registration was introduced.

#### Task 3.4: Prove adapter, init, update, and deselection behavior

**Files:**
- Modify: `test/core/init.test.ts`, `test/core/update.test.ts`, adapter-related tests, and any fixture expectations.

1. **Step 1: Write focused tests** — Configure workflows containing the two new IDs for representative commands/skills delivery and assert generated `/sp:simplify` and `/sp:design-verify` paths, then assert they are removed when deselected.
2. **Step 2: Run the focused tests** — Run `pnpm exec vitest run test/core/init.test.ts test/core/update.test.ts test/core/profile-sync-drift.test.ts`; expect failures before registry implementation.
3. **Step 3: Implement Task 3.4** — Update expected counts, fixtures, adapters, and cleanup assumptions only where the named registry additions require it.
4. **Step 4: Run focused verification** — Run the same command; expect init/update and deselection tests to pass cross-platform.
5. **Step 5: Self-review and handoff** — Confirm generated names remain `/sp:*` and all expected paths use `path.join()` in tests.

### 4. Integration, documentation, and full validation

#### Task 4.1: Update user-facing workflow documentation

**Files:**
- Modify: `docs/commands.md`, `docs/workflows.md`, `docs/supported-tools.md` as relevant.
- Test: docs assertions or repository search review.

1. **Step 1: Write or identify checks** — Add/update focused documentation assertions where the repository already checks command inventories; otherwise define the exact strings to inspect.
2. **Step 2: Run the focused checks** — Run the applicable docs/template Vitest suite; expect stale command lists or descriptions to fail where covered.
3. **Step 3: Implement Task 4.1** — Document sequence, native-review boundary, standalone command selection, E2E evidence, UI-only design verification, and result semantics.
4. **Step 4: Run focused verification** — Run the selected checks and `rg -n "code-review|simplify|design-verify|Test Hardening" docs`; expect accurate, non-conflicting descriptions.
5. **Step 5: Self-review and handoff** — Ensure proposal `review` is not described as final code review and no document advertises `/code-review` as generated by Superpowers.

#### Task 4.2: Integrate and review all generated output

**Files:**
- Modify: parity hashes/snapshots and any integrated generated-output expectations.

1. **Step 1: Prepare the review checklist** — Map each requirement to templates, registries, docs, and tests; include native-command collision and core-profile independence checks.
2. **Step 2: Run the integrated focused suite** — Run `pnpm exec vitest run test/core/templates/skill-templates-parity.test.ts test/core/shared/skill-generation.test.ts test/core/shared/tool-detection.test.ts test/core/profile-sync-drift.test.ts test/core/init.test.ts test/core/update.test.ts`; expect all integrated assertions to pass before hashes are finalized.
3. **Step 3: Implement Task 4.2** — Resolve integration findings, then update deterministic parity hashes/snapshots from the final intended templates.
4. **Step 4: Run focused verification** — Run the integrated focused suite again; expect all suites to pass with no generated code-review artifact.
5. **Step 5: Self-review and handoff** — Perform the one cross-unit review of final diff, requirement mapping, output paths, and command wording; report any follow-up fixes.

#### Task 4.3: Run full validation and record evidence

**Files:**
- Modify: `superpowers/changes/add-final-quality-gates/test-plan.md` — post-implementation evidence only.

1. **Step 1: Prepare validation matrix** — Populate concrete rows for template, generation, profile, init/update, docs, build, lint, and full-suite coverage; record the repository sources that define this project's canonical non-visual suite and mark platform-specific path risk as covered by existing cross-platform path tests.
2. **Step 2: Run focused checks** — Run the integrated focused Vitest command from Task 4.2; expect zero failing tests.
3. **Step 3: Run full validation** — Execute `pnpm run build`, `pnpm run lint`, and `pnpm test`; expect exit code 0 for each.
4. **Step 4: Record results** — Add exact commands, outcomes, and any justified non-applicable E2E/manual items to `test-plan.md`; do not mark rows complete without evidence.
5. **Step 5: Self-review and handoff** — Verify all test-plan rows are concrete and complete, then hand off the final quality-gate summary for archive consideration.

## Final Integration Review and Validation

After all units integrate, review the full diff against the four new/modified capability specs. Confirm Test Hardening and verify discover/run the complete canonical non-visual suite before E2E, apply runs the required order, native code review is reused rather than generated, simplify has no behavior-changing escape hatch, verify distinguishes E2E evidence from screenshots/source inspection, and design-verify does not claim formal conformance without a visual `DESIGN.md`. Run the focused suite from Task 4.2, then `pnpm run build`, `pnpm run lint`, and `pnpm test`.
