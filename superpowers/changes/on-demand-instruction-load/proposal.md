## Why

`slim-agent-instruction-ceremony` already stopped “scan every skill first” and complete-suite theater, but agents still load the whole Apply/Propose/Verify recipe, chain TDD and verification-before-completion, and hit overlapping catalog skills. Stronger instruction-following models stall on those leftovers. A follow-up instruction-system audit split the remainder into four packages (A–D below). This change ships **A, B, and C only**. It does not add an Astra-only ruleset.

## Packages (from the audit)

These letters name **work packages**, not Superpowers workflows.

| Package | Name | Problem it solves | In this change? |
| --- | --- | --- | --- |
| **A** | Stop false triggers | Skills and always-on docs load for the wrong task: YAML descriptions are too broad, SessionStart pastes `using-superpowers`, Apply says “please read the TDD/VBC skill files,” and `CLAUDE.md` lists every bundled skill. | Yes |
| **B** | Disclose by stage | `/sp:apply`, Propose, and Verify inject the entire later-stage recipe in one file, so “read later sections on demand” never saves context. Long TDD and debug procedure also sits in the root skill. | Yes |
| **C** | One owner per task | Dispatch, code-review timing, and completion evidence each have two live skills. Apply both continues reversible repairs and tells the agent to pause on every issue. Host-tool maps and debug authoring debris still ship in default discovery. | Yes |
| **D** | Keep contracts, drop remaining recipes | After A–C, some **implementation-format** recipes still remain: every `execution-plan` task must fill Step 1–5 paste-ready skeletons; Explore still prefers one question at a time; Propose still MUST list six derived-assumption dimensions in every summary; `using-git-worktrees` Step 4 still runs a complete `npm test` / `cargo test` / `pytest` / `go test ./...` baseline even though `slim-agent-instruction-ceremony` already made Direct Modification and Hardening suite stages Git-aware. Product contracts (two work modes, artifact graph, four gates, Hardening’s `full-qa-test` bind, Manual Coverage, P0/P1/P2, no invented User Choice) stay either way. | **No — later change** |

## What Changes

**A — Stop false triggers.** Narrow YAML descriptions so `full-qa-test`, `using-git-worktrees`, and `finishing-a-development-branch` fire only on their real job. Apply no longer tells the agent to read the full TDD or verification-before-completion skill files. SessionStart names `using-superpowers` instead of injecting the file. `CLAUDE.md` keeps project facts and drops the skill-catalog merchandising list.

**B — Disclose by stage.** Apply, Propose, and Verify roots become indexes: when to use, how to select the change, what the current unit reads, and when to pause. Test Hardening, Final Quality Gates, Manual Coverage, and runtime Before live in referenced files loaded at that stage. `systematic-debugging` and `test-driven-development` keep when-to-use in the root and move phase/example bodies to `reference/`.

**C — One owner per task.** Fold `subagent-driven-development` into Apply dispatch guidance. Fold code-review timing into `using-superpowers`. Fold verification-before-completion into the router as a short evidence rule. Delete Apply’s conflicting “pause on any issue” and “another complete integration review” sentences. Stop shipping host-tool mapping files and `systematic-debugging` creation-log / pressure-test files in default discovery.

**D is out of scope.** This change does **not** relax execution-plan Step 1–5 slot filling, Explore’s one-question stance, or Propose’s derived-assumption MUST list. It also does **not** retarget `using-git-worktrees` Step 4: last round already replaced Direct Modification / Hardening complete-suite fail-closed with Git-aware related tests, but worktrees still asks for a project-wide baseline and pauses on failure. That leftover conflict stays until a later D pass. Package A only drops worktrees’ Apply REQUIRED trigger.

## Capabilities

### New Capabilities

- `skill-trigger-narrowing`: When catalog skills and always-on docs load; SessionStart injection; Apply must not chain-read TDD/VBC bodies.
- `stage-file-disclosure`: Root command/skill files are indexes; stage contracts load from referenced files. Supersedes the unarchived slim sentence that Final Quality Gates MAY remain later in the same generated file.
- `instruction-ownership-collapse`: One live owner each for dispatch, review timing, and completion evidence; retired skills leave the install catalog.

### Modified Capabilities

- `docs-agent-instructions`: Project agent docs must not advertise the full skill catalog as required reading.
- `subagent-work-package-execution`: Dispatch guidance lives in Apply; the single integrated code review is Apply’s final code-review gate.

## Attachments

None.

## Impact

- Static skills under `skills/` (`using-superpowers`, TDD, systematic-debugging, verification-before-completion, subagent-driven-development, when-to-dispatch-code-review, using-git-worktrees, finishing-a-development-branch, full-qa-test description only).
- `hooks/session-start` and hook tests if present.
- `CLAUDE.md`.
- Workflow sources `src/core/templates/workflows/apply-change.ts`, `propose.ts`, `verify-change.ts`, `final-quality-gates.ts`; skill/command generation so init/update emit Apply/Propose/Verify `reference/` companions without collapsing command.md / skill.md / `workflows/*.ts` into a new architecture.
- Init/update obsolete bundled skill removal (`OBSOLETE_BUNDLED_SKILL_DIRS` and tests in `test/core/init.test.ts`, `test/core/update.test.ts`).
- Guidance pins: `test/core/using-superpowers-guidance.test.ts`, `test/core/verification-before-completion-guidance.test.ts`, `test/core/subagent-work-package-guidance.test.ts`, `test/core/when-to-dispatch-code-review-guidance.test.ts`, `test/core/code-review-dispatch-guidance.test.ts`, `test/core/templates/skill-templates-parity.test.ts`.
- Unarchived `slim-agent-instruction-ceremony` remains the prior ceremony pass; this change supersedes its “stage contracts MAY stay in the same generated file” sentence. It does not wait for that folder to archive.
- **Non-impact:** CLI flags, `applyRequires`, artifact graph, Hardening’s `full-qa-test` six-dimension / 10→10→10 bind, Manual Coverage vs Deferred, P0/P1/P2 vs gate outcomes, execution-plan Step 1–5 template, Explore one-question-at-a-time, Propose derived-assumption MUST list, worktrees complete-suite baseline, `GPT6-guide.md` injection, `.cursor/skills/full-qa-test/SKILL.md` as a dedicated sync target.
