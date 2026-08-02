## File Structure

- Create:
  - `test/core/using-superpowers-guidance.test.ts` - Work-mode, workload-budget, Proposal-splitting, and Change/Dispatch Unit guidance contract.
  - `test/core/code-review-dispatch-guidance.test.ts` - Renamed review-dispatch path, timing, repair ownership, and duplicate-prevention contract.
  - `superpowers/changes/define-work-modes-and-proposal-boundaries/specs/sp-verify-skill/spec.md` - Verify report-first/coordinator-repair delta.
- Modify:
  - `skills/using-superpowers/SKILL.md` - Two work modes, workload-first Proposal sizing, large-request decomposition, and Change/Dispatch Unit boundary.
  - `skills/when-to-dispatch-code-review/SKILL.md` - Renamed and reorganized dispatch guidance.
  - `skills/when-to-dispatch-code-review/code-reviewer.md` - Integrated review prompt and read-only reviewer contract.
  - `skills/subagent-driven-development/SKILL.md` - Live review reference and Apply/standalone boundary.
  - `skills/subagent-driven-development/code-quality-reviewer-prompt.md` - New dispatch-skill path and coordinator repair boundary.
  - `skills/receiving-code-review/SKILL.md` - Explicit relationship to read-only review findings where needed.
  - `skills/verification-before-completion/SKILL.md` - Clarify it remains an evidence guardrail, not another final gate, where needed.
  - `CLAUDE.md` - Current static skill name and description.
  - `src/core/templates/workflows/final-quality-gates.ts` - Gate-specific repair ownership while preserving sequence and retries.
  - `src/core/templates/workflows/simplify.ts` - Safe self-editing and Verify handoff wording.
  - `src/core/templates/workflows/verify-change.ts` - Report-first, coordinator-repair, and fresh Verify retry wording.
  - `src/core/templates/workflows/design-verify.ts` - Report-first, coordinator-repair, and fresh Design Verify retry wording.
  - `src/core/init.ts`, `src/core/update.ts` - Synchronize renamed bundled static skills and remove the obsolete installed directory.
  - `docs/workflows.md` and `docs/commands.md` - Two-mode entry, workload-first decomposition, and non-duplicated quality-gate guidance.
  - `test/core/init.test.ts`, `test/core/update.test.ts` - Static-asset clean-install and upgrade migration coverage.
  - `test/core/subagent-work-package-guidance.test.ts` and `test/core/templates/skill-templates-parity.test.ts` - Updated live-reference, generated-contract, and repair-matrix assertions/hashes.
- Rename:
  - `skills/requesting-code-review/` → `skills/when-to-dispatch-code-review/` - Avoid the misleading requesting-only name and stale review cadence.

## Attachments

None.

## Dispatch Coordination

`tasks.md` is the source of detailed, checkbox-tracked work. Each top-level heading is a logical dispatch unit, not a live subagent identity. The coordinator may combine compatible units or execute them inline. Unit 4 is intentionally sequential because it validates the integrated cross-unit result.

| Unit | Scope | Ownership | Dependencies | Assignee policy | Parallel | Handoff |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Root work-mode and workload-boundary guidance | `skills/using-superpowers/**`, `test/core/using-superpowers-guidance.test.ts` | None | Prefer one dedicated guidance worker; may execute inline | Yes with Unit 2 | Updated root skill, passing focused guidance test, self-review of schema terminology |
| 2 | Code-review dispatch rename and references | `skills/when-to-dispatch-code-review/**`, live references, `test/core/code-review-dispatch-guidance.test.ts`, `test/core/subagent-work-package-guidance.test.ts` | None | Prefer one worker owning the rename and all references | Yes with Unit 1 | Renamed source, no stale live path/cadence, passing focused guidance tests |
| 3 | Generated final-gate repair ownership | `src/core/templates/workflows/**`, receiving/verification guidance, parity tests | Units 1 and 2 integrated for terminology and boundaries | Dedicated worker; may combine with Unit 4 only after template contracts stabilize | No; overlaps generated contract surfaces | Generated skill/command parity, repair matrix, fresh focused test output |
| 4 | Documentation, regression matrix, and integrated validation | `docs/**`, cross-unit tests, final validation evidence | Units 1–3 integrated | Coordinator or final validation worker only | No | Full review, build/lint/test/validate evidence and test-plan update |

## Execution Boundaries

### 1. Work-mode and workload-boundary guidance

- Deliver every detailed checkbox in Unit 1.
- Preserve the existing two-mode conclusion and workload-first split rules from the design; do not reintroduce Plan Mode.
- Keep score bands as guidance, not CLI validation; define per-dimension 0–3 anchors, count shared foundation cost once, and keep new-capability/public-contract and other high-risk overrides mandatory.
- Run the named focused test and self-review references to `tasks.md`, `execution-plan.md`, and Apply final gates before handoff.

### 2. Code-review dispatch skill rename, static distribution, and boundary

- Deliver every detailed checkbox in Unit 2.
- Rename the source directory rather than retaining two discoverable aliases.
- Update all live references and tests, while leaving historical archived artifact prose untouched unless it is a live reference.
- Extend the bundled static asset refresh path used by init/update, remove the obsolete installed directory during refresh, and use platform-safe path assertions.

### 3. Final-gate repair ownership and workflow alignment

- Deliver every detailed checkbox in Unit 3.
- Keep Apply's final gate order and local retry limits unchanged.
- Make worker/report versus coordinator/repair ownership explicit without adding a new command or changing final outcomes.
- Keep `verification-before-completion` as evidence discipline and `receiving-code-review` as feedback evaluation, not additional gates.

### 4. Integrated documentation and validation

- Begin only after Units 1–3 are integrated.
- Validate documentation and generated guidance against the final source wording, not an earlier draft.
- Record all concrete verification results and justified deferrals in `test-plan.md` during Apply, not in this execution plan.

## Dispatch Execution

The following Step 1–5 sequences are task-level execution detail. They are not separate subagent assignments or 2–5 minute timeboxes. Keep checkbox completion only in `tasks.md`.

### 1. Work-mode and workload-boundary guidance

#### Task 1.1: Add the work-mode guidance contract test

**Files:**
- Create: `test/core/using-superpowers-guidance.test.ts` — Assert the observable root-skill workflow contract.

1. **Step 1: Write focused assertions** — Assert Direct Modification, Proposal → Review → Apply, no independent Plan Mode, explicit Proposal triggers, promotion triggers, six workload dimensions, score bands, multiple-small-features merging, multiple-large-features splitting, and Change/Dispatch Unit distinction.
2. **Step 2: Run focused tests** — Run `pnpm exec vitest run test/core/using-superpowers-guidance.test.ts`; expect failures because the current root skill has only a placeholder Proposal section.
3. **Step 3: Implement the test fixture** — Keep assertions based on stable user-visible phrases and use `path.join(process.cwd(), ...)` to read the root skill.
4. **Step 4: Re-run focused verification** — Confirm the assertions remain red only for missing guidance and do not fail on path separator assumptions.
5. **Step 5: Self-review and handoff** — Check that the test does not prescribe implementation internals or a third workflow mode; report the expected failure categories.

#### Task 1.2: Rewrite root work-mode guidance

**Files:**
- Modify: `skills/using-superpowers/SKILL.md` — Replace the single mandatory-proposal narrative with two proportional modes and promotion rules.

1. **Step 1: Identify current contradictions** — Locate the current default path, introductory “before any code” language, placeholder `## When to create change proposal`, and empty multi-Proposal section.
2. **Step 2: Run the guidance contract** — Run `pnpm exec vitest run test/core/using-superpowers-guidance.test.ts` and record the absent-section failures.
3. **Step 3: Implement the two-mode text** — Add the Direct Modification and Proposal → Review → Apply paths, state that a requested plan is an execution aid, and add explicit risk/workload promotion triggers.
4. **Step 4: Run focused verification** — Re-run the focused test and expect all mode-selection assertions to pass while the skill still preserves mandatory skill invocation.
5. **Step 5: Self-review and handoff** — Confirm no prose introduces a Plan Mode artifact or claims that all direct edits need a Proposal; report the changed sections.

#### Task 1.3: Add workload-first Proposal sizing

**Files:**
- Modify: `skills/using-superpowers/SKILL.md` — Add six scoring dimensions, bands, combined budget, and split/merge rules.

1. **Step 1: Define acceptance cases** — Use the test cases for two small cross-feature fixes, two large capabilities, one large plus a small companion, and a very large staged capability.
2. **Step 2: Run the focused test** — Confirm the workload and decomposition assertions fail against the placeholder/current wording.
3. **Step 3: Implement the rubric** — Document implementation surface, layer breadth, behavior complexity, verification, orchestration, context churn, 0–3 scoring anchors, `0–5`/`6–10`/`11–14`/`15+` bands, budget signals, new-capability/public-contract risk overrides, and the rule that shared foundation cost is counted once.
4. **Step 4: Run focused verification** — Re-run `pnpm exec vitest run test/core/using-superpowers-guidance.test.ts`; expect all workload and example assertions to pass.
5. **Step 5: Self-review and handoff** — Verify that prompt length and file count are not presented as sole criteria and that small fixes may share a Proposal.

#### Task 1.4: Add Change/Dispatch Unit and long-running rules

**Files:**
- Modify: `skills/using-superpowers/SKILL.md` — Define the two boundaries and multi-Proposal dependency process.

1. **Step 1: Compare existing schema language** — Read `schemas/spec-driven/templates/tasks.md` and `schemas/spec-driven/templates/execution-plan.md` to preserve logical Dispatch Unit semantics.
2. **Step 2: Run the focused test** — Confirm the current root skill lacks the non-archivable/non-live-agent distinction and long-running decomposition cases.
3. **Step 3: Implement the boundary** — State that Proposal protects context/archive workload and Dispatch Unit protects ownership/dependency/parallelism; add stable milestone, prerequisite, unblocks, and shared-foundation rules.
4. **Step 4: Run focused verification** — Re-run the guidance test and expect Change/Dispatch Unit and long-running cases to pass.
5. **Step 5: Self-review and handoff** — Ensure the text does not force one Proposal per feature or one live agent per unit and that dependency waves remain inside execution planning.

#### Task 1.5: Validate root guidance terminology

**Files:**
- Test: `test/core/using-superpowers-guidance.test.ts`
- Inspect: `schemas/spec-driven/templates/tasks.md`, `schemas/spec-driven/templates/execution-plan.md`, `src/core/templates/workflows/final-quality-gates.ts`

1. **Step 1: Assemble checks** — Identify exact terms for `tasks.md`, `execution-plan.md`, logical Dispatch Units, Test Hardening, and the four final gates.
2. **Step 2: Run focused tests** — Run the guidance test and record any terminology or contradictory-flow failures.
3. **Step 3: Correct root wording** — Remove stale `implementation-plan.md` or duplicate post-Apply Simplify wording if present in the edited root skill, without changing schema files in this task.
4. **Step 4: Run focused verification** — Re-run the focused guidance test; expect zero failures.
5. **Step 5: Self-review and handoff** — Report the final root-skill path, test result, and any intentional references left for later units.

### 2. Code-review dispatch skill rename and boundary

#### Task 2.1: Add code-review dispatch contract tests

**Files:**
- Create: `test/core/code-review-dispatch-guidance.test.ts` — Assert the new path, timing, repair, and no-duplicate contract.

1. **Step 1: Write failing assertions** — Read current review and SDD guidance; assert new directory/name, no `Review after each batch (3 tasks)`, Apply final-gate timing, standalone SDD timing, and read-only reviewer language.
2. **Step 2: Run focused tests** — Run `pnpm exec vitest run test/core/code-review-dispatch-guidance.test.ts`; expect failures for the missing new path and stale cadence.
3. **Step 3: Implement stable path helpers in the test** — Use `path.join()` and inspect live source paths without relying on OS-specific separators.
4. **Step 4: Run focused verification** — Confirm failures correspond only to pending guidance changes.
5. **Step 5: Self-review and handoff** — Ensure assertions do not require a generated `/sp:code-review` command or historical artifact rewrites.

#### Task 2.2: Rename and rewrite the static skill

**Files:**
- Rename: `skills/requesting-code-review/` → `skills/when-to-dispatch-code-review/`
- Modify: `skills/when-to-dispatch-code-review/SKILL.md` — Timing-oriented dispatch contract.

1. **Step 1: Inventory current content** — Separate generic dispatch timing, payload requirements, SDD integration, Apply cadence, and feedback handling.
2. **Step 2: Run focused tests** — Run the new dispatch guidance test and capture the missing-path/cadence failures.
3. **Step 3: Implement the rename and rewrite** — Keep useful major-feature/pre-merge guidance, remove the fixed-batch Apply rule, define Direct/SDD/Apply timing, and state that Apply owns final review orchestration.
4. **Step 4: Run focused verification** — Re-run `pnpm exec vitest run test/core/code-review-dispatch-guidance.test.ts`; expect the new source path and timing assertions to pass.
5. **Step 5: Self-review and handoff** — Check that only one current source path is discoverable and that no Superpowers code-review command is introduced.

#### Task 2.3: Align reviewer prompt

**Files:**
- Modify: `skills/when-to-dispatch-code-review/code-reviewer.md` — Integrated diff input/output and read-only review responsibility.

1. **Step 1: Identify prompt fields** — Preserve implemented description, requirements/plan, base/head range, integrated dispatch-unit context, strengths, severity findings, and assessment.
2. **Step 2: Run dispatch tests** — Confirm the prompt still contains any old self-repair or isolated-task assumptions that the new assertions should reject.
3. **Step 3: Update the prompt** — Require a complete integrated target, evidence-based findings, and coordinator handoff; do not instruct the reviewer to modify code by default.
4. **Step 4: Run focused verification** — Re-run the dispatch guidance test and expect prompt boundary assertions to pass.
5. **Step 5: Self-review and handoff** — Verify the host-native `code-reviewer` agent identity remains unchanged and the prompt does not duplicate Apply retry rules.

#### Task 2.4: Update live references

**Files:**
- Modify: `CLAUDE.md`, `skills/subagent-driven-development/SKILL.md`, `skills/subagent-driven-development/code-quality-reviewer-prompt.md`, `test/core/subagent-work-package-guidance.test.ts` — Replace live source-path references and preserve one final SDD review.

1. **Step 1: Search references** — Run `rg -n 'requesting-code-review|Requesting Code Review|Review after each batch|Review after EACH task' CLAUDE.md skills test`.
2. **Step 2: Run focused tests** — Run the subagent guidance and dispatch guidance tests to establish the stale-reference failures.
3. **Step 3: Update references** — Use the new directory name, remove obsolete batch wording, and retain SDD’s integrated final review and targeted-fix policy.
4. **Step 4: Run focused verification** — Re-run both guidance test files; expect no live-reference or old-cadence failures.
5. **Step 5: Self-review and handoff** — Confirm only historical change artifacts retain old paths and document any intentional historical references.

#### Task 2.5: Synchronize static distribution and remove the obsolete installed path

**Files:**
- Modify: `src/core/init.ts`, `src/core/update.ts` — copy bundled static assets and remove the obsolete `requesting-code-review` directory during refresh.
- Test: `test/core/init.test.ts`, `test/core/update.test.ts` — clean-install, upgrade, multi-tool, and platform-safe path coverage.
- Inspect: `src/core/migration.ts`, `src/core/shared/tool-detection.ts` for existing configured-tool discovery.

1. **Step 1: Trace distribution** — Confirm init's bundled-asset copy, update's generated workflow refresh, configured-tool discovery, and the absence of the renamed static path from generated workflow registries.
2. **Step 2: Run focused distribution tests** — Run `pnpm exec vitest run test/core/init.test.ts test/core/update.test.ts` and inspect path assumptions and upgrade behavior.
3. **Step 3: Implement synchronization and cleanup** — Make init/update copy the new static directory and remove only the obsolete `requesting-code-review` directory under configured tool skill roots; use `path.join()`/`path.resolve()` and do not add a duplicate alias.
4. **Step 4: Run focused verification** — Re-run the selected tests on the current platform and assert clean install, existing-install upgrade, multi-tool refresh, and platform-safe path construction.
5. **Step 5: Self-review and handoff** — Record what is copied by initialization/update versus what is generated by workflow templates and report the Windows path coverage and old-directory cleanup evidence.

#### Task 2.6: Confirm no stale dispatch cadence

**Files:**
- Test: `test/core/code-review-dispatch-guidance.test.ts`, `test/core/subagent-work-package-guidance.test.ts`
- Inspect: live `skills/**` and `CLAUDE.md`

1. **Step 1: Search stale language** — Run `rg -n -i 'after each batch|after every batch|3 tasks|each task.*review|requesting-code-review' skills CLAUDE.md test`.
2. **Step 2: Run focused tests** — Run both guidance suites and capture any remaining stale source failure.
3. **Step 3: Correct only live guidance** — Update residual active references while leaving archived historical artifacts untouched.
4. **Step 4: Run focused verification** — Re-run the search and tests; expect no stale live cadence and passing guidance contracts.
5. **Step 5: Self-review and handoff** — Report the final live reference list and confirm Apply remains the sole mandatory final-gate owner inside Apply.

### 3. Final-gate repair ownership and workflow alignment

#### Task 3.1: Add repair-matrix parity assertions

**Files:**
- Modify/Test: `test/core/templates/skill-templates-parity.test.ts` — Assert the worker/coordinator repair matrix across generated contracts.

1. **Step 1: Write assertions** — Cover read-only code review/Verify/Design Verify, Simplify safe self-editing, coordinator repair, fresh retry handoff, and receiving/verification boundaries.
2. **Step 2: Run focused parity tests** — Run `pnpm exec vitest run test/core/templates/skill-templates-parity.test.ts`; expect missing-contract failures.
3. **Step 3: Add stable phrase checks** — Keep assertions at the generated instruction contract level and avoid testing internal implementation details.
4. **Step 4: Run focused verification** — Confirm the new assertions isolate the pending template changes.
5. **Step 5: Self-review and handoff** — Verify assertions do not weaken P0/BLOCKER/four-round semantics already covered by existing tests.

#### Task 3.2: Align shared final-gate contract

**Files:**
- Modify: `src/core/templates/workflows/final-quality-gates.ts` — Clarify report, repair, integration, and retry ownership.

1. **Step 1: Map current wording** — Identify code-review worker repair language, Verify/Design Verify repair language, Simplify self-editing, and the generic isolated-workspace merge rule.
2. **Step 2: Run parity tests** — Record the current mismatch against the repair-matrix assertions.
3. **Step 3: Implement the boundary** — State that code review/Verify/Design Verify workers report by default and the coordinator repairs; retain Simplify’s safe self-editing, fresh workers, local retry entry points, and final-gate order.
4. **Step 4: Run focused verification** — Re-run the parity suite and expect the shared contract assertions to pass without changing outcome names or retry limits.
5. **Step 5: Self-review and handoff** — Check that no language silently permits a coordinator-context substitute when a fresh worker is required.

#### Task 3.3: Align standalone quality workflows and Verify delta

**Files:**
- Create: `superpowers/changes/define-work-modes-and-proposal-boundaries/specs/sp-verify-skill/spec.md` — Verify report-first/coordinator-repair delta.
- Modify: `src/core/templates/workflows/simplify.ts`, `src/core/templates/workflows/verify-change.ts`, `src/core/templates/workflows/design-verify.ts` — Match standalone and Apply repair ownership.

1. **Step 1: Compare generated skill and command copies** — Locate duplicated instruction blocks and retry/output sections in `verify-change.ts`.
2. **Step 2: Run parity tests** — Capture failures for missing report-first/coordinator-repair language.
3. **Step 3: Update the delta and instructions** — Add the Verify report-first/coordinator-repair scenarios; keep Simplify’s safe cleanup application; make Verify and Design Verify report-first with coordinator repair before the next fresh round; retain all canonical suite, Manual Coverage, E2E, visual-source, and output requirements.
4. **Step 4: Run focused verification** — Re-run `pnpm exec vitest run test/core/templates/skill-templates-parity.test.ts` and expect both skill and command content to agree.
5. **Step 5: Self-review and handoff** — Confirm standalone invocation is still useful and Apply handoff/retry wording does not introduce an extra gate.

#### Task 3.4: Clarify receiving and completion guardrails

**Files:**
- Modify only if required: `skills/receiving-code-review/SKILL.md`, `skills/verification-before-completion/SKILL.md`
- Test: `test/core/code-review-dispatch-guidance.test.ts` or a focused guidance assertion

1. **Step 1: Inspect existing responsibilities** — Confirm receiving already requires technical evaluation before implementation and verification-before-completion already requires fresh evidence before claims.
2. **Step 2: Run focused guidance tests** — Identify any wording that incorrectly makes either skill a final Apply gate.
3. **Step 3: Add minimal boundary wording** — State that receiving evaluates findings and verification-before-completion validates evidence; do not duplicate substantive review commands.
4. **Step 4: Run focused verification** — Re-run the relevant guidance/parity tests and expect no new gate or command wording.
5. **Step 5: Self-review and handoff** — Confirm unchanged core behavior and report whether either file required modification.

#### Task 3.5: Reconcile generated parity hashes

**Files:**
- Modify/Test: `test/core/templates/skill-templates-parity.test.ts` — Update hashes only after reviewing final generated payloads.

1. **Step 1: Generate or inspect payloads** — Compare skill and command content for Apply, Simplify, Verify, Design Verify, and any affected onboarding output.
2. **Step 2: Run parity tests** — Record the exact hash mismatches caused by intentional wording changes.
3. **Step 3: Update expected hashes** — Change only hashes whose generated content was intentionally modified by this Proposal.
4. **Step 4: Run focused verification** — Re-run the exact parity command and expect all generated-content hashes and contract assertions to pass.
5. **Step 5: Self-review and handoff** — Inspect the diff of expected hashes and confirm no unrelated workflow payload changed.

### 4. Integrated documentation and validation

#### Task 4.1: Update workflow documentation and onboarding boundary

**Files:**
- Modify: `docs/workflows.md`, `docs/commands.md` — Explain two modes, workload-first Proposal sizing, and non-duplicated final gates.
- Inspect: `src/core/templates/workflows/onboard.ts` — Preserve its full-cycle tutorial unless it presents the global mode-selection rule.

1. **Step 1: Locate stale documentation** — Search for single mandatory Proposal paths, Plan Mode, per-batch review, and standalone Simplify duplication.
2. **Step 2: Run documentation-adjacent tests/searches** — Use `rg` and the focused guidance suites to identify wording drift.
3. **Step 3: Rewrite current sections** — Document Direct Modification, Proposal → Review → Apply, workload bands, Change/Dispatch Unit boundaries, and Apply’s existing final gate order; explicitly keep onboarding's deliberate tutorial lifecycle separate when applicable.
4. **Step 4: Run focused verification** — Re-run `rg` for stale terms and the guidance tests; expect no active documentation contradiction.
5. **Step 5: Self-review and handoff** — Ensure docs describe behavior without claiming a new CLI command or schema artifact.

#### Task 4.2: Add decomposition regression cases

**Files:**
- Modify/Test: `test/core/using-superpowers-guidance.test.ts` — Cover concrete workload examples and exceptions.

1. **Step 1: Define cases** — Encode two small cross-feature fixes → one Proposal, two large capabilities → separate Proposals, one large plus small companion → may combine, very large stable milestones → staged Proposals, and Dispatch Units → non-archivable.
2. **Step 2: Run focused tests** — Run `pnpm exec vitest run test/core/using-superpowers-guidance.test.ts` and capture any missing phrase/assertion failures.
3. **Step 3: Complete regression assertions** — Assert the rules as observable guidance, not exact prose formatting.
4. **Step 4: Run focused verification** — Re-run the test and expect all decomposition cases to pass.
5. **Step 5: Self-review and handoff** — Confirm small unrelated fixes are not forced apart and large-context protection remains the primary split reason.

#### Task 4.3: Validate structure and path hygiene

**Files:**
- Test: `superpowers validate define-work-modes-and-proposal-boundaries --json`, `git diff --check`
- Inspect: all changed skill, template, test, and documentation paths

1. **Step 1: Run structural checks** — Run the exact validate and diff-check commands before final integration review.
2. **Step 2: Read failures completely** — Classify every issue as schema/artifact, path/reference, formatting, or unrelated worktree state.
3. **Step 3: Repair scoped issues** — Fix only Proposal-owned structure, links, headings, and cross-platform path assertions; pause on ambiguous unrelated changes.
4. **Step 4: Re-run verification** — Expect `valid: true`, zero validation issues, and clean diff check.
5. **Step 5: Self-review and handoff** — Report command output summaries and confirm every task maps to a spec requirement.

#### Task 4.4: Run full project validation

**Files:**
- Test: repository build, lint, and full test commands
- Record: `superpowers/changes/define-work-modes-and-proposal-boundaries/test-plan.md`

1. **Step 1: Identify canonical commands** — Confirm `package.json`, CI, and repository test documentation identify `pnpm run build`, `pnpm run lint`, and `pnpm test` as the required non-visual checks.
2. **Step 2: Run focused validation** — Run the changed guidance/parity tests, structural validation, and `git diff --check`; resolve scoped failures first.
3. **Step 3: Run full commands** — Execute `pnpm run build`, `pnpm run lint`, and `pnpm test` and capture exit status and counts.
4. **Step 4: Record evidence** — Update Test Hardening rows with fresh command evidence and document any justified manual/deferred coverage; do not mark unexecuted rows passed.
5. **Step 5: Self-review and handoff** — Confirm no unresolved product defect or scoped validation failure remains before final gates.

#### Task 4.5: Perform final integrated review

**Files:**
- Inspect: complete integrated diff, proposal artifacts, all changed skills/templates/docs/tests
- Record: `superpowers/changes/define-work-modes-and-proposal-boundaries/test-plan.md`

1. **Step 1: Re-read requirements** — Map every requirement in the four delta specs, including `sp-verify-skill`, to source guidance, references, tests, and docs.
2. **Step 2: Review integrated diff** — Check two-mode semantics, workload-first split rules, Change/Dispatch Unit distinction, rename completeness, repair ownership, and no duplicate Apply review.
3. **Step 3: Repair findings** — Resolve blocking findings in the owning files and run targeted verification; do not restart a complete review for non-blocking notes.
4. **Step 4: Run final validation** — Re-run structural, focused, build, lint, and full-test commands after repairs and record the results in `test-plan.md`.
5. **Step 5: Self-review and handoff** — Mark the implementation plan ready only when every required test/status row and final quality gate record is evidence-backed.

## Final Integration Review and Validation

After Units 1–4 are integrated, perform one cross-unit review of the full diff. Confirm that the root skill exposes only two lifecycles, Proposal sizing is workload/context-first, small cross-feature fixes can remain together, multiple large capabilities split before Dispatch Unit planning, Dispatch Units are not archive boundaries, and the renamed review skill no longer prescribes per-batch Apply review. Confirm generated final-gate instructions match the repair matrix and that `receiving-code-review` and `verification-before-completion` remain complementary rather than new gates. Fix blocking findings with targeted verification, then run focused guidance tests, `superpowers validate`, `git diff --check`, `pnpm run build`, `pnpm run lint`, and `pnpm test` before completion.

## Plan Self-Check

- **Spec coverage:** Units 1 and 4 cover `work-mode-selection`; Units 1 and 4 cover `proposal-workload-decomposition`; Units 2 and 3 cover `code-review-dispatch-guidance`; Unit 3 covers the `sp-verify-skill` delta.
- **Placeholder scan:** No `TBD`, `TODO`, `implement later`, or vague “update as needed” steps remain.
- **Contradiction/orphan check:** Plan Mode is removed; Apply retains final gates; Dispatch Units remain non-archivable; small fixes may share a Proposal; large capabilities split by workload.
- **Type consistency:** `Direct Modification`, `Proposal → Review → Apply`, `when-to-dispatch-code-review`, `P0`, `P1`, `P2`, `BLOCKER`, `Verification`, and `Design Verify` match the existing workflow vocabulary.
- **Completeness:** Every checkbox in `tasks.md` has concrete files, commands, expected results, Step 1–5 guidance, and a handoff path.
