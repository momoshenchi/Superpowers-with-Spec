# 1. Work-mode and workload-boundary guidance

## Root skill

- [x] 1.1 Add guidance-contract tests for Direct Modification, Proposal → Review → Apply, no independent Plan Mode, risk overrides, six workload dimensions, score bands, multi-Proposal rules, and Change-versus-Dispatch Unit distinctions in `test/core/using-superpowers-guidance.test.ts`.
- [x] 1.2 Rewrite `skills/using-superpowers/SKILL.md` to describe the two work modes, treat a requested plan as an execution aid, preserve the new-capability/public-contract Proposal override, and define promotion triggers before further direct edits.
- [x] 1.3 Add workload-first Proposal sizing to `skills/using-superpowers/SKILL.md`: six 0–3 dimensions with scoring anchors, `0–5`/`6–10`/`11–14`/`15+` bands, shared-foundation counted-once aggregation, a practical combined budget, and explicit rules for combining small fixes, splitting multiple large capabilities, and staging one very large capability.
- [x] 1.4 Add the Change Proposal versus Dispatch Unit contract and long-running decomposition procedure to `skills/using-superpowers/SKILL.md`; state that Dispatch Units are logical allocation boundaries, not live agent identities or archive units.
- [x] 1.5 Run `pnpm exec vitest run test/core/using-superpowers-guidance.test.ts` and self-review the root skill for contradictions with `schemas/spec-driven/templates/tasks.md`, `schemas/spec-driven/templates/execution-plan.md`, and the existing Apply final-gate order.

# 2. Code-review dispatch skill rename and boundary

## Skill and references

- [x] 2.1 Add failing guidance assertions covering the new `when-to-dispatch-code-review` path, absence of the old per-batch Apply rule, Direct/SDD/Apply timing, read-only reviewer ownership, and no generated `/sp:code-review` workflow in `test/core/code-review-dispatch-guidance.test.ts`.
- [x] 2.2 Rename `skills/requesting-code-review/` to `skills/when-to-dispatch-code-review/`, update frontmatter and rewrite `SKILL.md` around dispatch timing, integrated review scope, mode-specific behavior, and duplicate-review prevention.
- [x] 2.3 Update `skills/when-to-dispatch-code-review/code-reviewer.md` to describe the integrated review input/output and read-only reviewer boundary without changing host-native agent identity.
- [x] 2.4 Update live references in `CLAUDE.md`, `skills/subagent-driven-development/SKILL.md`, `skills/subagent-driven-development/code-quality-reviewer-prompt.md`, and all relevant guidance tests to use the new path and preserve one final SDD integration review.
- [x] 2.5 Extend bundled-static-asset synchronization in `src/core/init.ts` and `src/core/update.ts` so the renamed skill is copied to configured tool roots and an installed `requesting-code-review` directory is removed; update `test/core/init.test.ts` and `test/core/update.test.ts` with clean-install, upgrade, multi-tool, and Windows-safe `path.join()` coverage without retaining a duplicate alias directory.
- [x] 2.6 Run `pnpm exec vitest run test/core/code-review-dispatch-guidance.test.ts test/core/subagent-work-package-guidance.test.ts` and confirm no live source reference still prescribes `/sp:apply` review after a fixed task batch.

# 3. Final-gate repair ownership and workflow alignment

## Generated workflows

- [x] 3.1 Add focused parity assertions for the repair matrix: code review/Verify/Design Verify report by default and coordinator repairs; Simplify may apply only behavior-preserving cleanup; `receiving-code-review` evaluates feedback before implementation.
- [x] 3.2 Update `src/core/templates/workflows/final-quality-gates.ts` so final-gate prompts distinguish worker reports from coordinator repairs, preserve fresh-worker retries and existing gate-local retry boundaries, and do not create a new code-review workflow.
- [x] 3.3 Add the `sp-verify-skill` delta and update `src/core/templates/workflows/simplify.ts`, `src/core/templates/workflows/verify-change.ts`, and `src/core/templates/workflows/design-verify.ts` so their standalone and Apply instructions match the repair matrix and retain the existing evidence/output contracts.
- [x] 3.4 Align `skills/receiving-code-review/SKILL.md` and `skills/verification-before-completion/SKILL.md` references only where needed to state their boundaries; do not turn either skill into another final-quality gate.
- [x] 3.5 Run `pnpm exec vitest run test/core/templates/skill-templates-parity.test.ts test/core/code-review-dispatch-guidance.test.ts` and review generated skill/command payload changes before updating intentional parity hashes.

# 4. Integrated documentation and validation

## Documentation and regression coverage

- [x] 4.1 Update `docs/workflows.md` and `docs/commands.md`; inspect `src/core/templates/workflows/onboard.ts` explicitly and change it only if it presents the global two-mode decision as a user-facing rule. Preserve its deliberate full-cycle tutorial behavior if it is only teaching onboarding.
- [x] 4.2 Add regression cases for: two small cross-feature fixes in one Proposal, two large capabilities split into Proposals, one large capability with a small companion fix, a very large feature staged by stable milestones, and Dispatch Units remaining non-archivable.
- [x] 4.3 Run `superpowers validate define-work-modes-and-proposal-boundaries --json` and `git diff --check`; resolve all validation errors and path/reference drift.
- [x] 4.4 Run `pnpm run build`, `pnpm run lint`, and `pnpm test`; record fresh outcomes and any justified manual/deferred coverage in the change test plan.
- [x] 4.5 Perform the final integrated review of the root skill, renamed static skill, Verify delta, generated workflow contracts, references, cross-platform paths, and tests; mark the change ready only when all required artifacts and validation evidence agree.
