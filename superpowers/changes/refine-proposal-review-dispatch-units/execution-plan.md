## File Structure

- Modify:
  - `src/core/templates/workflows/change-review.ts` - Blocker-gated re-review policy and dispatch-unit review criteria
  - `src/core/templates/workflows/propose.ts` - Propose automatic review loop and task/dispatch guidance
  - `src/core/templates/workflows/apply-change.ts` - Dispatch-unit terminology; keep no automatic proposal re-review
  - `src/core/templates/workflows/onboard.ts` - Onboarding language for proposal review + dispatch units
  - `skills/change-review/SKILL.md` - Root proposal-review policy aligned with generated template
  - `skills/subagent-driven-development/SKILL.md` - Dispatch-unit execution model
  - `skills/subagent-driven-development/implementer-prompt.md` - Implementer prompt for a dispatch unit
  - `skills/subagent-driven-development/code-quality-reviewer-prompt.md` - Final review after all units integrate
  - `skills/requesting-code-review/SKILL.md` - Timing/language for post-integration review
  - `skills/requesting-code-review/code-reviewer.md` - Cross-unit review framing
  - `schemas/spec-driven/schema.yaml` - tasks/execution-plan instructions
  - `schemas/spec-driven/templates/tasks.md` - Pure-scope dispatch-unit template
  - `schemas/spec-driven/templates/execution-plan.md` - Dispatch coordination + clean unit headings
  - `schemas/spec-driven/templates/test-plan.md` - Terminology alignment if it mentions work packages
  - `src/commands/schema.ts` - Fallback tasks/execution-plan scaffolds for schema init
- Test:
  - `test/core/templates/change-review.test.ts` - Generated review/propose/apply contracts
  - `test/core/change-review-guidance.test.ts` - Root/generated review parity
  - `test/core/subagent-work-package-guidance.test.ts` - Dispatch-unit guidance contracts
  - `test/core/templates/skill-templates-parity.test.ts` - Template phrase parity if needed
  - `test/commands/schema.test.ts` - Schema-init template expectations
  - `test/core/artifact-graph/instruction-loader.test.ts` - Fixture/heading expectations if present

## Dispatch Coordination

`tasks.md` is the source of detailed, checkbox-tracked work. Each top-level `# <number>. <scope>` heading is one **dispatch unit**: a logical allocation boundary the coordinator may assign to one worker/subagent, combine with compatible units, or execute inline. It is not a live subagent identity. Legacy `# <number>. agent...` headings remain acceptable.

| Unit | Scope | Ownership | Dependencies | Assignee policy | Parallel | Handoff |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Proposal review gate | `change-review.ts`, full `propose.ts` review-loop + task-guidance text, `skills/change-review/**`, review contract tests | None | Prefer dedicated worker | Yes with unit 2 only on disjoint files | Updated review policy text + passing review contract tests |
| 2 | Dispatch unit model and templates | schema templates/instructions, subagent/review skills, `apply-change.ts`, `onboard.ts`, `schema.ts` fallbacks, dispatch-unit guidance tests. Do **not** edit `propose.ts` review-loop sentences owned by unit 1; only touch propose if unit 1 left residual work-package strings after handoff | None for schema/skills; sequential after 1.2 if residual propose terminology remains | Prefer dedicated worker; combine with unit 1 only on disjoint files | Yes with unit 1 when file ownership is disjoint | New templates + guidance + guidance tests green |
| 3 | Integrated verification | whole change | Units 1–2 complete | Coordinator / main agent | No | Full verification evidence + final integration review notes |

## Execution Boundaries

### 1. Proposal review gate

- Deliver every detailed checkbox in this dispatch unit.
- Own review severity/re-review semantics end to end (generated + root + tests).
- Self-review that WARNING no longer forces re-review or blocks readiness.

### 2. Dispatch unit model and templates

- Deliver every detailed checkbox in this dispatch unit.
- Keep assignable-worker semantics while removing `agentN` headings and nested code-wrapped unit headings.
- Preserve legacy acceptance language.

### 3. Integrated verification

- Run focused then broader verification after units 1–2 integrate.
- Perform one final cross-unit integration review only after both content units land.

## Dispatch Execution

Expand every detailed task from `tasks.md` under its dispatch unit. These Step 1–5 sequences explain how to implement a feature-scale task; they are not separate subagent assignments or required timeboxes. Keep checkbox completion only in `tasks.md`.

### 1. Proposal review gate

#### Task 1.1: Update generated change-review workflow

**Files:**
- Modify: `src/core/templates/workflows/change-review.ts` — severity loop and readiness text
- Test: `test/core/templates/change-review.test.ts` — policy assertions

1. **Step 1: Write or extend focused tests** — Assert report-before-repair remains; re-run review is required only after BLOCKER repair; readiness allows residual WARNING/SUGGESTION; no `review.md`.
2. **Step 2: Run the focused tests** — Expect current template text to fail new assertions.
3. **Step 3: Implement Task 1.1** — Replace “repair every resolvable BLOCKER and WARNING, re-run review, no unresolved WARNING” with blocker-gated policy; update dispatch-unit criteria language.
4. **Step 4: Run focused verification** — `pnpm exec vitest run test/core/templates/change-review.test.ts` passes for review template expectations.
5. **Step 5: Self-review and continue** — Confirm manual `/sp:review` and automatic propose paths share the same severity rules.

#### Task 1.2: Update generated propose workflow

**Files:**
- Modify: `src/core/templates/workflows/propose.ts` — automatic review loop + task guidance bullets

1. **Step 1: Write or extend focused tests** — Assert propose template contains blocker-gated re-review and pure-scope/`dispatch unit` task guidance.
2. **Step 2: Run the focused tests** — Record red baseline against old work-package phrases.
3. **Step 3: Implement Task 1.2** — Update both skill and command content copies in `propose.ts`.
4. **Step 4: Run focused verification** — change-review/propose contract tests pass.
5. **Step 5: Self-review and continue** — Ensure readiness summary mentions residual non-blocking notes when present.

#### Task 1.3: Align root change-review skill

**Files:**
- Modify: `skills/change-review/SKILL.md` — automatic loop, readiness, task-format criteria

1. **Step 1: Write or extend focused tests** — Root/generated parity phrases for blocker-gated re-review and dispatch-unit criteria.
2. **Step 2: Run the focused tests** — Expect drift failures if root still requires WARNING re-review.
3. **Step 3: Implement Task 1.3** — Update Chinese/root guidance to same policy; replace work-package/`agent` heading criteria with dispatch unit + legacy acceptance.
4. **Step 4: Run focused verification** — `test/core/change-review-guidance.test.ts` passes.
5. **Step 5: Self-review and continue** — Root readiness section no longer conflicts with generated readiness.

#### Task 1.4: Lock review contracts in tests

**Files:**
- Modify: `test/core/templates/change-review.test.ts`
- Modify: `test/core/change-review-guidance.test.ts`

1. **Step 1: Write or extend focused tests** — Cover scenarios: blocker re-review required; warning-only no re-review; suggestion non-blocking; apply never auto-repeats proposal review.
2. **Step 2: Run the focused tests** — Confirm failures map to missing phrases only.
3. **Step 3: Implement Task 1.4** — Finalize assertions after content lands.
4. **Step 4: Run focused verification** — both review test files pass.
5. **Step 5: Self-review and handoff** — No assertion still requires “repair every WARNING then re-run”.

### 2. Dispatch unit model and templates

#### Task 2.1: Rewrite tasks template

**Files:**
- Modify: `schemas/spec-driven/templates/tasks.md`

1. **Step 1: Write or extend focused tests** — Assert pure-scope heading example and absence of required `agent1` template text where appropriate.
2. **Step 2: Run the focused tests** — Red against old template.
3. **Step 3: Implement Task 2.1** — Replace template with `# 1. <!-- scope -->` style units.
4. **Step 4: Run focused verification** — template/schema tests pass for tasks template content.
5. **Step 5: Self-review and continue** — Checkbox numbering convention preserved for apply tracking.

#### Task 2.2: Rewrite execution-plan template

**Files:**
- Modify: `schemas/spec-driven/templates/execution-plan.md`

1. **Step 1: Write or extend focused tests** — Require `Dispatch Coordination`, `Assignee policy`, `### 1. <scope>`, and forbid nested `` ### `# `` form.
2. **Step 2: Run the focused tests** — Red baseline.
3. **Step 3: Implement Task 2.2** — Apply the locked template structure from this change’s design.
4. **Step 4: Run focused verification** — template assertions pass.
5. **Step 5: Self-review and continue** — Final integration section uses dispatch-unit language.

#### Task 2.3: Update schema instructions

**Files:**
- Modify: `schemas/spec-driven/schema.yaml` — tasks and execution-plan `instruction` blocks

1. **Step 1: Write or extend focused tests** — Instruction loader / schema tests expect dispatch-unit wording and pure-scope examples.
2. **Step 2: Run the focused tests** — Red baseline.
3. **Step 3: Implement Task 2.3** — Replace work-package/`agent` instructions; document assignee policy in execution-plan requirements.
4. **Step 4: Run focused verification** — instruction-related tests pass.
5. **Step 5: Self-review and continue** — Examples use `# 1. Schema and template foundation` style.

#### Task 2.4: Update schema-init fallbacks

**Files:**
- Modify: `src/commands/schema.ts` — embedded fallback templates
- Test: `test/commands/schema.test.ts`

1. **Step 1: Write or extend focused tests** — Scaffolded tasks/execution-plan match dispatch-unit convention.
2. **Step 2: Run the focused tests** — Red baseline.
3. **Step 3: Implement Task 2.4** — Mirror default templates in fallback strings.
4. **Step 4: Run focused verification** — schema command tests pass.
5. **Step 5: Self-review and continue** — Fallback and default templates do not diverge.

#### Task 2.5: Update subagent and code-review skills

**Files:**
- Modify: `skills/subagent-driven-development/SKILL.md`
- Modify: `skills/subagent-driven-development/implementer-prompt.md`
- Modify: `skills/subagent-driven-development/code-quality-reviewer-prompt.md`
- Modify: `skills/requesting-code-review/SKILL.md`
- Modify: `skills/requesting-code-review/code-reviewer.md`

1. **Step 1: Write or extend focused tests** — Guidance tests look for `dispatch unit`, flexible allocation, legacy acceptance, and one final integration review.
2. **Step 2: Run the focused tests** — Red baseline on work-package phrases.
3. **Step 3: Implement Task 2.5** — Rename terminology; keep dispatch/combine/inline semantics; accept legacy headings.
4. **Step 4: Run focused verification** — `test/core/subagent-work-package-guidance.test.ts` (possibly renamed assertions) passes.
5. **Step 5: Self-review and continue** — No instruction still requires `agentN` as identity.

#### Task 2.6: Update apply/onboard remaining terminology

**Files:**
- Modify: `src/core/templates/workflows/apply-change.ts`
- Modify: `src/core/templates/workflows/onboard.ts`
- Modify: `src/core/templates/workflows/propose.ts` only for residual work-package/`agent` strings left after unit 1 handoff (do not rewrite the review-loop block owned by tasks 1.1–1.2)

1. **Step 1: Write or extend focused tests** — Onboard/apply generated text mentions dispatch units and blocker-only re-review where relevant.
2. **Step 2: Run the focused tests** — Red baseline.
3. **Step 3: Implement Task 2.6** — Replace remaining work-package language; onboard readiness explains blocker-gated re-review.
4. **Step 4: Run focused verification** — related template tests pass.
5. **Step 5: Self-review and continue** — Apply still does not auto-repeat proposal review.

#### Task 2.7: Update remaining tests and fixtures

**Files:**
- Modify: `test/core/subagent-work-package-guidance.test.ts`
- Modify: `test/core/templates/skill-templates-parity.test.ts`
- Modify: `test/core/artifact-graph/instruction-loader.test.ts`
- Modify: other fixtures asserting `# 1. agent1` if needed

1. **Step 1: Write or extend focused tests** — Convert expectations to dispatch-unit phrases while keeping legacy-acceptance coverage.
2. **Step 2: Run the focused tests** — Identify leftover old phrases.
3. **Step 3: Implement Task 2.7** — Update assertions/fixtures; optionally keep file name for stability if desired.
4. **Step 4: Run focused verification** — affected test files pass.
5. **Step 5: Self-review and handoff** — Repo search for required old template forms is limited to legacy-acceptance docs/tests.

### 3. Integrated verification

#### Task 3.1: Run focused contract tests

**Files:**
- Test: review/dispatch-unit related test files above

1. **Step 1: Write or extend focused tests** — None new unless a gap appears during integration.
2. **Step 2: Run the focused tests** — `pnpm exec vitest run test/core/templates/change-review.test.ts test/core/change-review-guidance.test.ts test/core/subagent-work-package-guidance.test.ts test/commands/schema.test.ts`
3. **Step 3: Implement Task 3.1** — Fix any integration misses across units 1–2.
4. **Step 4: Run focused verification** — focused set green.
5. **Step 5: Self-review and continue** — Record commands/results in test-plan.

#### Task 3.2: Run broader verification

**Files:**
- Whole package scripts

1. **Step 1: Write or extend focused tests** — N/A
2. **Step 2: Run the focused tests** — N/A
3. **Step 3: Implement Task 3.2** — Run `pnpm test` / `pnpm run build` / `pnpm run lint` as needed for this repo.
4. **Step 4: Run package verification** — capture pass/fail and remediate regressions caused by this change.
5. **Step 5: Self-review and continue** — Update test-plan evidence tables.

#### Task 3.3: Final integration review

**Files:**
- Full diff of this change

1. **Step 1: Write or extend focused tests** — N/A
2. **Step 2: Run the focused tests** — N/A
3. **Step 3: Implement Task 3.3** — Review requirements coverage, terminology consistency, legacy acceptance, and no apply-time proposal re-review regression.
4. **Step 4: Run package verification** — targeted checks for any findings.
5. **Step 5: Self-review and handoff** — Mark change ready for archive path after implementation completes.

## Final Integration Review and Validation

- Integrate all dispatch units before formal review.
- Perform one cross-unit review of requirements, interactions, code quality, test coverage, and full-change verification.
- Fix blocking findings and run targeted verification. Do not restart a complete review unless the reviewer explicitly requests confirmation of a specified finding.
- Record post-implementation coverage gaps and Test Hardening evidence in `test-plan.md`.
