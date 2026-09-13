# 1. Static skills and project agent docs

## Entry, TDD, debug, verification

- [x] 1.1 Rewrite `skills/using-superpowers/SKILL.md` as a work-mode router: load skills on demand, keep Direct vs Proposal and promotion rules, move schema/scoring dumps to `skills/using-superpowers/reference/`. Delete Direct Modification `fall closed to the complete suite`; pin Git-aware / matching-stage instead.
- [x] 1.2 Narrow `skills/test-driven-development/SKILL.md` to observable automated behavior; remove Iron Law / delete-and-restart / always-on any-feature trigger.
- [x] 1.3 Narrow `skills/systematic-debugging/SKILL.md` so localized failures skip the four-phase gate; keep unknown-cause investigation and move long phase text to existing reference files. Delete `read every line` / `read reference implementation COMPLETELY`; do not copy them into `reference/`.
- [x] 1.4 Rewrite `skills/verification-before-completion/SKILL.md` so evidence matches the current stage (focused / Git-aware / registered test-plan rows), not a complete suite.

## Dispatch, install surface, CLAUDE.md

- [x] 1.5 Shrink `skills/subagent-driven-development/SKILL.md` to Apply dispatch guidance only (no five-artifact preload, no restated Final Quality Gates).
- [x] 1.6 Stop shipping `writing-plan/SKILL.md` as a live skill: move it to `docs/archive/` (or equivalent retired path) so default discovery cannot load it. Do not pin `SKILL_NAMES`, which already omits it.
- [x] 1.7 Remove `dispatching-parallel-agents` from `CLAUDE.md` and list only skills that exist under `skills/`. Leave root `AGENTS.md` empty. Do not require `GPT6-guide.md`. Do not regenerate `superpowers/AGENTS.md`.
- [x] 1.8 Narrow the YAML `description` of `skills/security-review/SKILL.md` so it triggers only on an explicit security or vulnerability request. Do not edit `skills/full-qa-test/SKILL.md` or `.cursor/skills/full-qa-test/SKILL.md`.

## Overlapping catalog skills

- [x] 1.9 Slim `skills/when-to-dispatch-code-review/SKILL.md` to timing-only: Apply's final code-review gate is the single integrated review on the Proposal path; keep Direct Modification dispatch timing; do not restate Apply severity or retry policy.
- [x] 1.10 Rewrite Step 1 of `skills/finishing-a-development-branch/SKILL.md` to Git-aware / matching-stage verification. Keep merge, PR, keep-branch, and discard. Do not require a complete `npm test` / `cargo test` / `pytest` / `go test ./...` suite.
- [x] 1.11 Split Explore from systematic debugging in `src/core/templates/workflows/explore.ts` descriptions (and debug description if it still claims every investigation). Explore thinks and clarifies without implementing; debug owns unknown-cause failures. Do not merge the two skills.
- [x] 1.12 Update `skills/using-git-worktrees/SKILL.md` so a missing directory defaults to project-local `.worktrees/` with a gitignore check. Do not pause for a two-option location prompt. Keep existing-directory and CLAUDE.md preference order.

# 2. Propose, Apply, and quality-gate templates

## Propose and Apply context

- [x] 2.1 Update `src/core/templates/workflows/propose.ts` so high-impact questions may be batched, an explicit create request authorizes writes, and one-question-at-a-time, mandatory three-state confirm, and required TodoWrite loops are gone.
- [x] 2.2 Update `src/core/templates/workflows/apply-change.ts` so Apply reads the current unit slice, continues reversible in-scope repairs, and still invokes `full-qa-test` during Test Hardening.
- [x] 2.3 Update `src/core/templates/workflows/final-quality-gates.ts` so missing spawn uses labeled same-context fallback, and the non-`test-plan` suite stage uses Git-aware tests without complete-suite fail-closed. Also replace the independent Correctness sentence in `src/core/templates/workflows/verify-change.ts` that still says Git-aware otherwise the complete suite.

# 3. Verify, archive, sync, and docs

## Targeting and documentation

- [x] 3.1 Update verify, archive, and sync templates so they auto-select an unambiguous change and still confirm archive when applicable gates are incomplete.
- [x] 3.2 Update `src/core/templates/workflows/change-review.ts` spawn-blocked wording to the same-context fallback.
- [x] 3.3 Align `docs/workflows.md` and `docs/commands.md` with on-demand loading, persist-until-done, Git-aware-outside-test-plan, and spawn fallback. Do not restate full gate recipes.
- [x] 3.4 Update `src/core/templates/workflows/change-review.ts` so an unfinished 10→10→10 batch is not a proposal completeness Must include / BLOCKER. Keep dimension and gap-register checks. Do not weaken Hardening's 10→10→10 bind.

# 4. Tests and projection refresh

## Pins and parity

- [x] 4.1 Update guidance and template tests that pin removed sentences (`before any response`, `fall closed to the complete suite`, `Ask one decision question`, TodoWrite must-track, `cannot launch a subagent` → blocked, complete-suite fail-closed, `investigating problems` on Explore, complete `npm test` on finishing-a-branch, `read every line`, worktree location prompt, change-review 10→10→10 Must include) to the new contracts, including I1–I9.
- [x] 4.2 Refresh generated command/skill projections only through the existing TS → parity path. Do not add a DRY architecture task.
