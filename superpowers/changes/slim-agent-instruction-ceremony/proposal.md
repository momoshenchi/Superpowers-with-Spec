## Why

Agent-facing Superpowers skills and workflows currently over-specify step order, preload too much context, pause on reversible work, and treat a complete test suite as the default pass. Stronger instruction-following models stall or over-verify instead of finishing authorized work. The product still needs its artifact contracts and quality gates; it does not need a second Astra-only rule file.

## What Changes

- Make `using-superpowers` a short work-mode router. Skills load when the current task matches; agents do not check every skill before every reply.
- Keep Direct Modification vs Proposal → Review → Apply, Proposal vs Dispatch Unit, and risk/contract promotion. Move schema dumps, directory trees, and the six-dimension scoring table out of the root skill into on-demand reference.
- Calibrate TDD, systematic debugging, and verification-before-completion: observable behavior still uses red-green; already-localized failures do not require a four-phase investigation; do not require reading a reference implementation every line; completion claims need fresh matching-stage evidence, not a complete-suite moral rule. Direct Modification in `using-superpowers` uses the same Git-aware / matching-stage rule and must not fall closed to a complete suite.
- Keep Test Hardening's binding to `full-qa-test` (six dimensions and 10→10→10, including the existing Apply fallback). Hardening and Verify execute registered, applicable `test-plan.md` rows. Git-aware related tests cover the non-`test-plan` suite stage so agents do not run a complete suite to "be thorough."
- Slim Propose: ask only unresolved high-impact decisions, and allow them in one batch. A user request to create a proposal authorizes artifact writes after a summary. Do not require one-question-at-a-time waiting, a three-state confirmation widget, or a TodoWrite progress loop when that authorization is already present. Still pause when missing information would change product, security, or public-contract decisions. Do not invent user Choices.
- Slim Apply: read the current dispatch unit and related spec/design slices, not every `contextFiles` document up front. Continue through reversible failures caused by this change. Pause for irreversible Git history, force push, production or unrecoverable publish, or missing product decisions.
- Prefer a fresh gate worker; if the host cannot spawn one, run an equivalent same-context review and label the review mode. Missing spawn is not by itself a blocked gate.
- Verify, archive, and sync infer the change from conversation or the sole active change; prompt only when several changes could apply. Archive still warns and confirms when applicable quality gates are incomplete.
- Progressive disclosure for long skills (Apply, Propose, Verify, using-superpowers, systematic-debugging): root file states when to use and what to read next; stage-specific contracts stay in referenced files.
- Fold `subagent-driven-development` into Apply dispatch guidance. Stop installing `writing-plan` / `writing-plans`. Remove the stale `dispatching-parallel-agents` mention from `CLAUDE.md`. Keep `AGENTS.md` empty or limited to short project constraints. Do not inject `GPT6-guide.md` into agent-required files.
- Make `when-to-dispatch-code-review` timing-only: Apply's final code-review gate is the single integrated review on the Proposal path; do not add another complete review around Apply.
- Make `finishing-a-development-branch` use matching-stage / Git-aware evidence instead of a complete `npm test` (or equivalent) suite; keep merge / PR / keep / discard as the integration choice.
- Split Explore from systematic debugging: Explore is thinking and requirement clarification without implementing; debugging is for failures whose cause is unknown. Narrow both descriptions so investigating a failing test does not load Explore.
- `using-git-worktrees` keeps the gitignore safety check. If no worktree directory exists, default to project-local `.worktrees/` (and ignore it) instead of pausing for a two-option location prompt.
- Proposal review judges whether the test-plan names risk gaps and dimensions. It does not treat an unfinished 10→10→10 batch as completeness before implementation. Test Hardening still owns 10→10→10 (Decision 1).
- Narrow over-broad skill descriptions so each skill states when not to use it. Do not restructure `full-qa-test` procedure text. Do not add a dedicated DRY of command.md / skill.md / `workflows/*.ts` projections. Do not edit `.cursor/skills/full-qa-test/SKILL.md` as a sync target.

## Capabilities

### New Capabilities

- `agent-instruction-autonomy`: When skills load, how work continues to completion, when to pause, how root skills disclose detail, how overlapping TDD/debug/verification/SDD/code-review/explore guidance collapses to one rule each, how finishing-a-branch and Direct Modification verification match test-scope-selection, and how worktrees pick a default directory.
- `propose-and-apply-autonomy`: Propose confirmation depth (including no required TodoWrite loop), Apply context loading and pause policy, quality-gate worker fallback, change selection for Verify/Archive/Sync, and proposal review not counting 10→10→10 batches as completeness.
- `test-scope-selection`: Split `test-plan` execution (including Hardening's `full-qa-test` binding) from Git-aware related tests for the non-`test-plan` suite stage.

### Modified Capabilities

- `docs-agent-instructions`: Stop requiring `superpowers/AGENTS.md` to embed copy-ready templates and a full workflow dump. Keep schema templates as the copy source; agent instruction docs stay short and link out.
- `sp-verify-skill`: Infer the target change when unambiguous; run registered `test-plan` rows plus Git-aware non-`test-plan` tests instead of requiring a complete suite.
- `sp-archive-skill`: Infer the target change when unambiguous; keep incomplete-artifact, incomplete-task, and delta-spec confirmation.
- `specs-sync-skill`: Infer the target change when unambiguous among changes that have delta specs.
- `subagent-work-package-execution`: Coordinator and workers load the current unit's context, not every artifact once. Sequential inline execution remains valid when the host cannot spawn workers.

## Attachments

None.

## Impact

- Static skills under `skills/` (`using-superpowers`, `test-driven-development`, `systematic-debugging`, `verification-before-completion`, `subagent-driven-development`, `when-to-dispatch-code-review`, `finishing-a-development-branch`, `using-git-worktrees`, `security-review`, and related descriptions). Explore wording lives in `src/core/templates/workflows/explore.ts`. Do not treat `.cursor/skills/full-qa-test/SKILL.md` as an owned sync file.
- Workflow sources `src/core/templates/workflows/*.ts` and `src/core/templates/workflows/final-quality-gates.ts`. Existing init/parity will refresh generated command and skill projections; this change does not redesign that dual-projection architecture.
- `schemas/spec-driven/templates/execution-plan.md` Git-aware wording if it still points at a complete suite fallback.
- Docs: `docs/workflows.md`, `docs/commands.md`, `CLAUDE.md`. Not `GPT6-guide.md` as an always-on agent file.
- Guidance and string-pin tests such as `test/core/using-superpowers-guidance.test.ts`, `test/core/templates/skill-templates-parity.test.ts`, propose/apply/verify template tests, and `test/docs/shape-review-docs.test.ts` if docs strings move.
- Unarchived changes already encode interview, work-mode, and final-gate sentences in the same template files. This change supersedes conflicting sentences there; it does not wait for those folders to archive.
- **Non-impact:** Artifact graph, `applyRequires`, remediations/invariants contracts, Manual Coverage vs Deferred Coverage, `full-qa-test` six-dimension and 10→10→10 procedure, CLI flags, runtime APIs.
