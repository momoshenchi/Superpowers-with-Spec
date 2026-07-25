## File Structure

- Create:
  - `src/core/templates/workflows/change-review.ts` — shared generated skill and `/sp:review` command template.
  - `test/core/templates/change-review.test.ts` — generated review skill/command content, ordering, severity, and no-persistence behavior.
  - `test/core/change-review-guidance.test.ts` — contract between generated review guidance and `skills/change-review/SKILL.md`.
- Modify:
  - `skills/change-review/SKILL.md` — canonical local pre-implementation review guidance.
  - `src/core/templates/skill-templates.ts` and `src/core/shared/skill-generation.ts` — export and generate the review workflow.
  - `src/core/profiles.ts`, `src/commands/config.ts`, `src/core/init.ts`, `src/core/shared/tool-detection.ts`, and `src/core/profile-sync-drift.ts` — expose, install, discover, and synchronize `review`.
  - `src/core/templates/workflows/propose.ts` — automatic report → repair → re-review sequence after artifacts complete.
  - `src/core/templates/workflows/apply-change.ts` — explicit no-repeat policy and manual review guidance.
  - `src/core/templates/workflows/onboard.ts` — teach the two review contracts.
  - `test/core/profiles.test.ts`, `test/core/shared/skill-generation.test.ts`, `test/core/shared/tool-detection.test.ts`, `test/core/profile-sync-drift.test.ts`, `test/core/init.test.ts`, `test/core/update.test.ts`, `test/commands/config.test.ts`, `test/commands/config-profile.test.ts`, and `test/core/templates/skill-templates-parity.test.ts` — registration, generated output, lifecycle, and parity coverage.
- Test:
  - `test/core/templates/change-review.test.ts` and `test/core/change-review-guidance.test.ts`;
  - `test/core/shared/skill-generation.test.ts`, `test/core/profiles.test.ts`, `test/core/shared/tool-detection.test.ts`, `test/core/profile-sync-drift.test.ts`, `test/commands/config.test.ts`, `test/commands/config-profile.test.ts`, `test/core/init.test.ts`, `test/core/update.test.ts`, and `test/core/templates/skill-templates-parity.test.ts`.

## Work-Package Coordination

The headings in `tasks.md` are logical work-package identifiers, not a reservation of four live subagents. The coordinator may execute all blocks in sequence, assign one block per worker, or combine disjoint compatible blocks.

| Task block | Ownership boundary | Dependencies | Parallel eligibility | Handoff evidence |
| --- | --- | --- | --- | --- |
| `# 1. agent1` | review content/template and review contract tests | None | May run with block 2 if template export ownership is deferred to block 2 | Generated/local review guidance and passing contract tests |
| `# 2. agent2` | profile, generation, installation, update, and drift registration | Task 1.2 supplies the review template export | Sequential after 1.2; may overlap with block 3 once export surface is stable | Review workflow appears only in selected profiles across supported tool outputs |
| `# 3. agent3` | propose/apply/onboard lifecycle text and parity tests | Task 1.2 review contract and block 2 workflow id | May begin after the interface and workflow id are stable | Generated guidance proves report-before-repair and no apply-time repeat |
| `# 4. agent4` | integrated verification and final review | Blocks 1–3 integrated | Sequential | Passing commands, reviewed diff, updated test-plan evidence |

If source ownership overlaps unexpectedly, serialize the affected blocks. `tasks.md` remains the checkbox progress source of truth.

## Work-Package Execution

The Step 1–5 sequences below are implementation detail for every detailed task. They are neither individual subagent dispatches nor formal review gates.

### `# 1. agent1 — Proposal-review workflow contract and content`

#### Task 1.1: Specify the generated review workflow contract

1. Identify the existing template-test conventions and write focused failing assertions for schema detection, validation, severity reporting, work-package criteria, and proposal-versus-implementation review separation.
2. Run the focused review-workflow tests and record the absent-template failure as the baseline.
3. Add fixtures that model a completed spec-driven change and a non-spec schema so tests assert schema-aware scope instead of hardcoded default-schema assumptions.
4. Re-run the focused tests and confirm they remain red until the review template exists.
5. Self-review that assertions test user-observable generated guidance rather than internal formatting.

#### Task 1.2: Create the generated review skill and command

1. Extract the reusable proposal-review behavior from `skills/change-review/SKILL.md` and identify fields needed in both a skill and command template.
2. Run Task 1.1 tests to confirm the generated review workflow is missing.
3. Create `change-review.ts` with a schema-aware manual review procedure, the required report format, work-package/Step 1–5 criteria, and explicit distinction from final integration review.
4. Run focused review template tests and expect the new generated-content assertions to pass.
5. Self-review that the template creates no review artifact, approval marker, or apply preflight requirement.

#### Task 1.3: Align root review guidance

1. Compare the generated review procedure with `skills/change-review/SKILL.md`, including the existing 2–20-minute and red-test wording.
2. Run the guidance contract to establish any drift from the new review template.
3. Update the local skill with logical work-package criteria, per-task Step 1–5 checks, report-before-repair sequencing, and the proposal/final-review distinction.
4. Re-run the guidance contract and expect local and generated behavior to agree.
5. Self-review that root guidance does not prescribe per-checkbox dispatch or two-stage review.

#### Task 1.4: Prevent review-guidance drift

1. Identify stable phrases or structured requirements shared by the root and generated review guidance.
2. Run the contract/parity test before its final expectations are updated.
3. Add assertions for automatic proposal timing, visible report before edits, mandatory repair of resolvable BLOCKER/WARNING findings, re-review after repair, no persisted review state, no apply-time repeat, and the separate integration review.
4. Run the focused test and expect all shared-contract assertions to pass.
5. Self-review that the test permits schema-specific content without weakening the required core behavior.

### `# 2. agent2 — Generate and distribute the review workflow`

#### Task 2.1: Specify registration expectations

1. Inspect profile, generator, init, update, tool-detection, and drift tests for exhaustive workflow lists and generated-file counts.
2. Run the focused tests and add assertions that core includes `review`, custom exclusion omits it, and matching skill/command identifiers are generated.
3. Include at least one adapter-level assertion for the optional command argument and tool-specific output path.
4. Re-run the focused set and retain expected failures until registration source is updated.
5. Self-review that tests cover both skills and commands without assuming a particular operating-system separator.

#### Task 2.2: Register review workflow surfaces

1. Map every workflow-id registry consumed by profiles, config prompts, template exports, skill generation, detection, and profile synchronization.
2. Run Task 2.1 tests against the old registries to verify the missing `review` behavior.
3. Register `review` consistently and connect it to the generated `superpowers-change-review` template and `/sp:review` command.
4. Re-run focused registration tests and expect core/custom selection behavior to pass.
5. Self-review that no registry refers to a non-existent template and that ordering remains deterministic.

#### Task 2.3: Align initialization and update outputs

1. Locate skill/command counts, success summaries, command adapters, and update handling that assume the prior workflow set.
2. Run init and update tests to confirm their expected counts/files need revision.
3. Update implementation and expectations so selected profiles create or refresh review skill/command files only when selected, preserving user-managed content and platform-safe paths; change a generic command adapter only if a review-specific hardcoded workflow list exists.
4. Run the targeted init/update tests and expect generated review files and counts to pass.
5. Self-review one skills-only, commands-only, both, core, and custom-profile path.

#### Task 2.4: Verify distribution

1. Inspect generated skill and command outputs for each representative supported tool.
2. Run the focused profile/init/update/generation/drift test command.
3. Resolve any stale workflow list, orphaned generated file, or path-specific assertion.
4. Re-run the command and expect all focused distribution tests to pass.
5. Record commands and results for integrated validation.

### `# 3. agent3 — Proposal lifecycle and onboarding integration`

#### Task 3.1: Specify automatic proposal-review order

1. Add failing parity assertions that encode all-artifacts-complete → report → repair every resolvable BLOCKER/WARNING → re-review → ready or pause, with SUGGESTION findings reported but non-blocking.
2. Run `pnpm exec vitest run test/core/templates/skill-templates-parity.test.ts` and capture the old final-summary mismatch.
3. Add tests for unresolved user/external decisions and for the absence of a review artifact or persistent approval claim.
4. Re-run the parity test and keep expectations failing until proposal guidance changes.
5. Self-review that the order is observable and does not demand repair before showing the report.

#### Task 3.2: Update propose workflow guidance

1. Locate both skill and command copies of the proposal artifact-completion loop.
2. Run the Task 3.1 parity assertions against the old content.
3. Update both copies to automatically use the review procedure after `applyRequires` are done, publish the report, repair resolvable findings, re-review, and pause when a decision is required.
4. Re-run parity tests and expect lifecycle-order assertions to pass.
5. Self-review that readiness language follows the successful re-review only and that no `review.md` is proposed.

#### Task 3.3: Preserve apply behavior and final implementation review

1. Identify all proposal-review language in `apply-change.ts` and existing final-review/Test Hardening guidance.
2. Run focused template tests to establish whether apply currently implies a repeat preflight review.
3. State explicitly that apply does not auto-repeat proposal review, offers `/sp:review` only as voluntary action, and retains final integration review plus Test Hardening after implementation.
4. Re-run focused template tests and expect no-repeat and separation assertions to pass.
5. Self-review that the apply task loop and existing completion requirements remain unchanged.

#### Task 3.4: Update onboarding without adding automation to continue

1. Locate workflow diagrams, command tables, and transition narration in `onboard.ts`.
2. Run onboarding/parity tests to identify old phase descriptions.
3. Add proposal-review-before-apply explanation and a clear contrast with post-implementation integration review; leave `/sp:continue` as a manual-review suggestion at most.
4. Re-run focused tests and expect onboarding wording assertions to pass.
5. Self-review that review remains automatic only in `/sp:propose`.

#### Task 3.5: Verify lifecycle template parity

1. Inspect all changed workflow templates for a consistent review vocabulary and ordering.
2. Run the generated-template parity and workflow-instruction tests.
3. Update intentional template hashes only after reviewing every changed generated payload.
4. Re-run the focused tests and expect parity to pass.
5. Self-review that unrelated workflow template hashes did not change.

### `# 4. agent4 — Cross-package validation and final review`

#### Task 4.1: Run focused verification

1. Assemble the focused review, profile, init/update, generation, and parity test command from the changed test files.
2. Run the command after blocks 1–3 integrate.
3. Investigate every failure as stale expectation, registration omission, or user-visible workflow inconsistency.
4. Re-run the command and expect all focused tests to pass.
5. Record exact command output and any justified deferral in `test-plan.md`.

#### Task 4.2: Run full project validation

1. Build current TypeScript with `pnpm run build`.
2. Run `pnpm run lint` and `pnpm test` after a successful build.
3. Resolve failures attributable to the review workflow; separate unrelated pre-existing failures with evidence.
4. Re-run all three commands and expect build, lint, and full tests to pass.
5. Update `test-plan.md` with final evidence and remaining justified manual gaps.

#### Task 4.3: Perform final cross-package implementation review

1. Compare the integrated diff with this proposal, all delta specs, design decisions, tasks, and this execution plan.
2. Verify the generated review workflow is automatic only after `/sp:propose`, outputs before repair, fixes resolvable blockers, and does not persist a review state.
3. Verify `/sp:apply` does not auto-review and the implementation final integration review remains distinct and present.
4. Resolve blocking findings and run targeted verification without restarting a complete review unless a reviewer requests a specific confirmation.
5. Record the result and mark the change ready only after validation passes.

## Final Integration Review and Validation

After all work packages are complete and integrated, perform one implementation review of the full diff. Confirm that the proposal-review workflow is automatic only in `/sp:propose`; its report is emitted before repair; resolvable blockers are repaired and re-reviewed; no review state is persisted; and `/sp:apply` does not repeat proposal review. Also confirm that the existing final cross-package implementation review and Test Hardening are still separate. Run focused tests, `pnpm run build`, `pnpm run lint`, and `pnpm test` before completion.
