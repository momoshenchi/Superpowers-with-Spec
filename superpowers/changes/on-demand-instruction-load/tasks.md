# 1. Stop false triggers

## Descriptions and always-on load

- [x] 1.1 Add failing guidance tests: `full-qa-test` / `using-git-worktrees` / `finishing-a-development-branch` descriptions exclude neighboring tasks; SessionStart does not embed `using-superpowers`; `CLAUDE.md` has no skill catalog list; Apply does not `refer to` TDD or verification-before-completion skill files.
- [x] 1.2 Narrow those three YAML descriptions. Remove Apply REQUIRED / “before executing any tasks” from `using-git-worktrees`. Do not change worktrees’ full-suite baseline command. Do not rewrite `full-qa-test` procedure. Do not edit `.cursor/skills/full-qa-test/SKILL.md`.
- [x] 1.3 Change `hooks/session-start` to name `using-superpowers` without concatenating `SKILL.md`. Delete the Skills merchandising list from `CLAUDE.md`; keep stack, commands, directories, Node version, CLI, and slash-command facts. Leave `AGENTS.md` empty. Do not require `GPT6-guide.md`.
- [x] 1.4 Replace Apply “please refer to `test-driven-development` / `verification-before-completion`” with in-place TDD applicability and matching-stage evidence sentences.

# 2. Disclose by stage

## Generator and workflow indexes

- [x] 2.1 Add failing tests: Apply/Propose/Verify roots omit FQG remediations field list and Verify “Read all available artifacts”; Hardening/FQG companions exist; missing companion is not a pass; TDD root omits the rationalization table; systematic-debugging root omits the checkpoint ledger; `using-superpowers` root omits the numbered eight-step decompose.
- [x] 2.2 Extend skill generation so Apply (and Propose/Verify as needed) emit `reference/*.md` via `path.join` on init/update. Dual projection stays. Do not invent a markdown-only source tree.
- [x] 2.3 Split `apply-change.ts`: root index (select change, current-unit read, pause list, stage pointers). Move runtime Before, Test Hardening (keep `full-qa-test` bind), Manual Coverage, and Final Quality Gates into `reference/runtime-before.md`, `reference/test-hardening.md`, and `reference/final-quality-gates.md`. Emit dispatch guidance as `reference/dispatch-units.md` (pointer only in the root).
- [x] 2.4 Split `propose.ts` and `verify-change.ts` the same way: Propose loop → `reference/artifact-loop.md`; Verify report body → `reference/verify-report.md`. Verify treats `contextFiles` as a catalog.
- [x] 2.5 Move TDD examples/rationalizations, systematic-debugging four-phase and checkpoint bodies, and `using-superpowers` eight-step decompose into existing or new `reference/` files. Keep when-to-use in each root.

# 3. Collapse overlapping owners

## Retire live skills and delete conflicts

- [x] 3.1 Add failing tests: init/update do not install `verification-before-completion`, `subagent-driven-development`, or `when-to-dispatch-code-review`; Apply has no “pause if implementation reveals issues” / extra “complete integration review”; host tool maps and `CREATION-LOG.md` / `test-pressure-*.md` are absent from copied skill dirs.
- [x] 3.2 Fold matching-stage evidence and Direct Modification review timing into `using-superpowers`. Fold dispatch-unit assignment into Apply `reference/dispatch-units.md`. Move `code-reviewer.md` under `using-superpowers/reference/`. Stop shipping the three live SKILL.md files (archive or delete); add them to `OBSOLETE_BUNDLED_SKILL_DIRS` in init and update. Sweep remaining live skills (`finishing-a-development-branch`, `systematic-debugging`, `using-git-worktrees`, `using-superpowers`) so they do not require those retired files.
- [x] 3.3 Delete the two Apply Guardrails conflicts. Do not add a third clarifying rule.
- [x] 3.4 Remove `codex-tools.md`, `copilot-tools.md`, and `gemini-tools.md` from default `using-superpowers/reference/`. Remove systematic-debugging `CREATION-LOG.md` and `test-pressure-*.md` from the live skill directory.

# 4. Pins and projections

## Redirect tests and refresh generated files

- [x] 4.1 Retarget guidance tests that still read retired skill paths (`verification-before-completion-guidance`, `subagent-work-package-guidance`, `sdd-guidance`, `when-to-dispatch-code-review-guidance`, `code-review-dispatch-guidance`, `using-superpowers-guidance`, git-related completion pins) to the new owners. Pin I1–I8.
- [x] 4.2 Refresh generated command/skill projections only through the existing TS → parity path. Do not add a DRY architecture task. Do not edit `.cursor/skills/full-qa-test/SKILL.md`.
