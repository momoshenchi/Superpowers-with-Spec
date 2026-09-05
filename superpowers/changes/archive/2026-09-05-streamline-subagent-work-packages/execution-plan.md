## File Structure

- Modify:
  - `skills/subagent-driven-development/SKILL.md` — dispatch, self-review, and final-review workflow.
  - `skills/subagent-driven-development/implementer-prompt.md` — complete work-package assignment prompt.
  - `skills/subagent-driven-development/code-quality-reviewer-prompt.md` or its replacement — final integration-review prompt.
  - `skills/requesting-code-review/SKILL.md` and `skills/requesting-code-review/code-reviewer.md` — review timing and criteria.
  - `schemas/spec-driven/schema.yaml` — task and execution-plan artifact instructions.
  - `schemas/spec-driven/templates/tasks.md` — work-package task-list shape.
  - `schemas/spec-driven/templates/execution-plan.md` — coordination and final-validation shape.
  - `schemas/spec-driven/templates/test-plan.md` — post-integration hardening context.
  - `src/commands/schema.ts` — project-local schema fallback templates.
  - `src/core/templates/workflows/propose.ts` — generated task-granularity guidance.
  - `src/core/templates/workflows/onboard.ts` — generated execution-plan explanation.
  - `src/core/templates/workflows/apply-change.ts` — generated apply and Test Hardening guidance.
- Test:
  - `test/core/subagent-work-package-guidance.test.ts` — static contract for root skill and review prompt guidance.
  - `test/commands/schema.test.ts` — schema-init scaffolded templates and dependency behavior.
  - `test/core/artifact-graph/instruction-loader.test.ts` — default artifact instruction/template content.
  - `test/core/templates/skill-templates-parity.test.ts` — generated onboarding and workflow wording.

## Work-Package Coordination

The headings in `tasks.md` are logical work-package identifiers, not a reservation of one subagent per heading. The coordinator decides at execution time whether to assign a block to a subagent, combine compatible blocks in one assignment, or perform all blocks itself. In every case, the numbered checkbox tasks remain the source of granular progress.

| Task block | Ownership boundary | Dependencies | Parallel eligibility | Handoff evidence |
| --- | --- | --- | --- | --- |
| `# 1. agent1` | `skills/subagent-driven-development/**`, `skills/requesting-code-review/**`, and `test/core/subagent-work-package-guidance.test.ts` | None | May run in parallel with block 2 because it does not modify schema or command source | Updated skills/prompts, passing guidance-contract test, concise self-review report |
| `# 2. agent2` | `schemas/spec-driven/**`, `src/commands/schema.ts`, focused schema/instruction tests | None | May run in parallel with block 1; serialize with block 3 because block 3 verifies the resulting generated language | Updated schema/templates and passing focused tests |
| `# 3. agent3` | `src/core/templates/workflows/onboard.ts`, generated-workflow tests, final validation record | Blocks 1 and 2 integrated | Sequential | Updated workflow wording, targeted test results, final review result |

Do not dispatch blocks concurrently if implementation reveals shared file ownership beyond this table. The coordinator must then sequence the affected blocks and preserve their task-list order.

## Execution Boundaries

### `# 1. agent1`

Deliver the complete block in `tasks.md`. The worker must remove the interpretation that every numbered task needs a fresh subagent and two reviews. It must use the exact work-package syntax, preserve existing flat task lists by treating their incomplete tasks as one sequential package, and retain clear self-review and verification expectations. Formal review happens only after the whole change is integrated. The worker reports changed files, verification performed, and unresolved concerns.

### `# 2. agent2`

Deliver the complete block in `tasks.md`. The worker must make the default schema and schema-init fallback templates agree: `tasks.md` presents a logical work-package heading with granular checkbox items, while `execution-plan.md` expands every detailed task into implementation steps without making those steps subagent dispatch boundaries. The worker must update focused regression coverage before or together with template changes and use platform-safe path construction in filesystem assertions.

### `# 3. agent3`

Begin only after the first two blocks are integrated. Align generated onboarding language and parity tests with the schema convention without changing `writing-plan/SKILL.md`. Run the named targeted tests, lint, and full suite. Record any non-blocking, justified test deferral in `test-plan.md`; unresolved product defects or failing verification block completion.

## Work-Package Execution

The following Step 1–5 sequences are execution detail for each detailed task. They are not independent subagent assignments or formal review gates. `tasks.md` remains the only checkbox completion tracker.

### `# 1. agent1 — Subagent dispatch and final review guidance`

#### Task 1.1: Add the guidance contract test

1. Define assertions for complete-block dispatch, logical labels, inline/combined allocation, legacy flat-list fallback, and one final review in `test/core/subagent-work-package-guidance.test.ts`.
2. Run `pnpm exec vitest run test/core/subagent-work-package-guidance.test.ts`; the assertions document the required guidance before source changes.
3. Add the test file using `path.join(process.cwd(), ...)` to read the root skill and prompt files.
4. Re-run the command and retain the expected failing assertions until Tasks 1.2–1.5 update the guidance.
5. Self-review that the assertions check observable workflow wording rather than internal implementation detail.

#### Task 1.2: Update the subagent-driven development skill

1. Use the Task 1.1 contract to identify every per-task dispatch and two-stage review rule in `skills/subagent-driven-development/SKILL.md`.
2. Run the guidance contract and confirm the new work-package assertions fail against the old skill.
3. Define exact agent heading syntax, logical-label semantics, compatible-package combination, inline execution, and the flat-list fallback in the skill.
4. Run `pnpm exec vitest run test/core/subagent-work-package-guidance.test.ts` and expect the dispatch/allocation assertions to pass.
5. Self-review that only one final cross-package review remains and that safe parallelism still requires disjoint ownership.

#### Task 1.3: Update the implementer prompt

1. Identify prompt fields needed to hand a worker its complete work-package block, dependencies, file ownership, and verification commands.
2. Run the guidance contract to establish the pre-change prompt mismatch.
3. Replace single-task wording with complete work-package wording and require the worker to finish all detailed tasks before handoff.
4. Run the guidance contract and expect the complete-block prompt assertion to pass.
5. Self-review that the prompt does not ask for formal review after an individual checkbox.

#### Task 1.4: Replace the two-stage reviewer flow

1. Identify every spec-compliance-first/code-quality-second instruction and the old reviewer prompt assumptions.
2. Run the guidance contract and confirm its final-review assertions fail before the rewrite.
3. Convert the reviewer prompt and skill flow to one integrated review after all work packages are merged, with targeted verification after fixes.
4. Run the guidance contract and expect no two-stage-review wording plus final-review wording.
5. Self-review that a second complete review is optional only when the reviewer explicitly requests confirmation of a finding.

#### Task 1.5: Align requesting-code-review guidance

1. Identify the subagent-specific “after EACH task” rule while preserving general major-feature and pre-merge review advice.
2. Run the guidance contract and confirm the old rule conflicts with the final-review requirement.
3. Update `skills/requesting-code-review/` and its reviewer prompt to review the complete integrated change once.
4. Run the guidance contract and expect the new integrated-review assertion to pass.
5. Self-review that the generic review skill remains useful outside subagent-driven development.

#### Task 1.6: Verify work-package guidance

1. Review the final test file and changed guidance together for requirement coverage.
2. Run `pnpm exec vitest run test/core/subagent-work-package-guidance.test.ts`.
3. Resolve any failing assertion by correcting the source guidance, not weakening the contract.
4. Re-run the command and expect all guidance-contract tests to pass.
5. Record the command and result for integration.

### `# 2. agent2 — Default schema and scaffolded artifact conventions`

#### Task 2.1: Add focused schema regression assertions

1. Identify existing schema-init and instruction-loader tests that encode the old execution-plan structure.
2. Run `pnpm exec vitest run test/commands/schema.test.ts test/core/artifact-graph/instruction-loader.test.ts` to establish the baseline.
3. Add assertions for agent headings, coordination, per-task Step 1–5 detail, final integration review, and worker-level Test Hardening context.
4. Re-run the focused tests and expect failures until Tasks 2.2–2.4 update source templates.
5. Self-review that filesystem assertions use `path.join()` or `path.resolve()`.

#### Task 2.2: Update the default task-list template and instruction

1. Map the exact `# <number>. agent<logical-id> — <scope>` grammar into `tasks.md` and the schema instruction.
2. Run the focused schema tests and confirm their new heading assertions fail against the old template.
3. Implement agent work-package headings, nested delivery areas, and detailed checkbox syntax while preserving `tasks.md` progress parsing.
4. Re-run focused schema tests and expect heading/scaffold assertions to pass.
5. Self-review that labels remain logical allocation identifiers rather than mandatory live subagents.

#### Task 2.3: Restore per-task execution detail in the execution-plan and test-plan templates

1. List every execution-plan requirement: coordination, ownership, dependencies, safe parallelism, and Step 1–5 detail for every detailed task.
2. Run instruction-loader tests and confirm the new execution-detail assertions fail before template changes.
3. Update `execution-plan.md`, `test-plan.md`, and schema instructions so tasks track completion in `tasks.md`, execution plans expand task steps, and hardening follows integrated worker verification.
4. Re-run instruction-loader tests and expect the execution-plan and test-plan assertions to pass.
5. Self-review that Step 1–5 is task-level implementation detail, with no independent test-review gate or 2–5 minute delegation requirement.

#### Task 2.4: Update schema-init fallback templates

1. Compare `src/commands/schema.ts` fallback output with the default schema templates.
2. Run `pnpm exec vitest run test/commands/schema.test.ts` and confirm scaffold assertions fail before the fallback update.
3. Implement matching agent headings, work-package coordination, per-task Step 1–5, and final integration validation in the fallback templates.
4. Re-run the schema command test and expect scaffolded template assertions to pass.
5. Self-review that generated project-local schemas need no hardcoded platform-specific paths.

#### Task 2.5: Verify schema artifacts

1. Inspect the default schema, package templates, fallback templates, and focused tests for terminology drift.
2. Run `pnpm exec vitest run test/commands/schema.test.ts test/core/artifact-graph/instruction-loader.test.ts`.
3. Fix any disagreement between default and scaffolded output.
4. Re-run the focused command and expect all tests to pass.
5. Record the platform-safe path coverage and test result for integration.

### `# 3. agent3 — Generated workflow alignment and integrated validation`

#### Task 3.1: Update generated workflow guidance

1. Identify proposal, onboarding, and apply wording that still describes micro-step delegation or a test-review gate.
2. Run `pnpm exec vitest run test/core/templates/skill-templates-parity.test.ts` and confirm the new wording expectations fail before source updates.
3. Update proposal, onboarding, and apply templates to describe work-package allocation plus per-task Step 1–5 execution guidance.
4. Re-run the parity test and expect semantic assertions to pass before updating intentional hashes.
5. Self-review that `writing-plan/SKILL.md` remains unchanged.

#### Task 3.2: Update generated-template parity evidence

1. Inspect changed template payloads and identify every affected function/content hash.
2. Run the parity test to obtain intentional hash deltas after reviewing source text.
3. Update the parity expectations and workflow assertions for coordination, task-level steps, worker verification, and final review.
4. Re-run `pnpm exec vitest run test/core/templates/skill-templates-parity.test.ts` and expect all parity checks to pass.
5. Self-review that unrelated template hashes were not changed.

#### Task 3.3: Run integrated verification

1. Build the CLI so schema-init integration tests execute current source: `pnpm run build`.
2. Run the focused Vitest command, then `pnpm run lint` and `pnpm test`.
3. Investigate failures as product defects or stale assertions and correct the responsible source.
4. Re-run every command and expect build, lint, focused tests, and the full suite to pass.
5. Update `test-plan.md` with commands, evidence, and any justified deferrals.

#### Task 3.4: Perform final cross-package review

1. Compare the complete diff with proposal, delta specs, design, `tasks.md`, and this execution plan.
2. Verify task tracking remains in `tasks.md`, every detailed task has Step 1–5 execution guidance, and formal review is final and cross-package.
3. Check generated default-schema output, schema-init output, root skills, and workflow templates for stale per-checkbox/two-stage-review language.
4. Resolve blocking findings and run targeted verification without automatically starting another complete review.
5. Record the review result and mark the change ready only when full verification passes.



## Final Integration Review and Validation

After all work-package blocks are complete and integrated, perform exactly one formal review of the full diff. Confirm that:

- the proposal and delta specifications are fully implemented;
- `tasks.md` keeps per-item checkbox tracking while agent headings are allocation-neutral;
- `execution-plan.md` is the sole source of coordination details;
- no subagent guidance still mandates per-checkbox dispatch, per-checkbox review, or two-stage review;
- a final-review finding has been fixed and targetedly verified without automatically starting a second complete review;
- generated default-schema and schema-init output follow the same convention;
- the targeted Vitest command, `pnpm run lint`, and `pnpm test` pass.

Fix blocking findings before completion. The final review replaces repetitive per-task formal reviews; it does not replace each worker's own verification and self-review.
