## Context

Superpowers tells coding agents how to choose Direct vs Proposal work, write artifacts, implement through Apply, and close quality gates. `slim-agent-instruction-ceremony` already rewrote the always-on router and stopped complete-suite fail-closed. A follow-up audit found the remaining load: generated Apply/Propose/Verify files still inline every later stage, Apply still chain-reads TDD and verification-before-completion, SessionStart still pastes `using-superpowers`, and three catalog skills still share owners with Apply or the router.

The audit named four work packages (see `proposal.md` **Packages**): **A** stop false triggers, **B** disclose by stage, **C** one owner per task, **D** keep product contracts but drop leftover implementation-format recipes. This change implements **A, B, and C only**. Product contracts (artifact graph, Hardening’s `full-qa-test` bind, four gates, Manual Coverage, P0/P1/P2) stay. Package **D** leftovers stay for a later change: execution-plan Step 1–5 filling, Explore’s one-question stance, Propose’s derived-assumption MUST list, and the worktrees Step 4 complete-suite baseline (still `npm test` / `cargo test` / `pytest` / `go test ./...` even though Direct Modification and Hardening suite stages are already Git-aware).

## Current system

Agent-facing text has three emitters.

Static skills live under repository `skills/` and are recursively copied into each host’s skills directory on init/update. YAML `description` fields are always visible to the host catalog. `full-qa-test` still matches generic test-plan writing. `using-git-worktrees` still claims it is REQUIRED before Apply. `finishing-a-development-branch` matches “implementation complete, all tests pass.” `verification-before-completion`, `subagent-driven-development`, and `when-to-dispatch-code-review` remain live skills even after slim narrowed their bodies.

Workflow skills and slash commands are two projections of TypeScript templates (`src/core/templates/workflows/*.ts` → `generateSkillContent` / `generateCommand`). Apply’s `buildApplyInstructions` concatenates current-unit guidance, runtime-Before capture, Test Hardening, Manual Coverage, and `getFinalQualityGateInstructions()` into one string. The generated Cursor Apply skill is about 5800 words. The command file is the same dump. A sentence at the top says to read later sections on demand, but the host injects the whole file when `/sp:apply` runs. Propose and Verify do the same: Propose keeps the interview plus the artifact loop in one file; Verify still says to read all `contextFiles`.

Always-on load is separate. Claude Code `hooks/session-start` reads `skills/using-superpowers/SKILL.md` and wraps it in `EXTREMELY_IMPORTANT` JSON. Cursor workspace rules inject `CLAUDE.md`, which still lists every bundled skill. `using-superpowers` already says to load skills by task, then the hook undoes that by pasting the router, and `CLAUDE.md` invites scanning the catalog.

Overlap: Apply Guardrails both continue reversible repairs and “pause if implementation reveals issues.” The same guardrail block still asks for a separate complete integration review, which `when-to-dispatch-code-review` forbids around Apply’s gate. `subagent-driven-development` restates the two work modes. Host-specific `codex-tools.md` / `copilot-tools.md` / `gemini-tools.md` and systematic-debugging `CREATION-LOG.md` / `test-pressure-*.md` sit in directories init copies.

Unarchived `slim-agent-instruction-ceremony` allowed Final Quality Gates to remain later in the same generated file. That sentence is the defect this change replaces.

### Relationship to existing tech

| Existing capability | Relation | Pointer | Note |
|---|---|---|---|
| Work-mode router | extend | `skills/using-superpowers/SKILL.md` | Keep two modes; add evidence and review-timing sentences; move 8-step decompose to reference |
| Apply / Propose / Verify templates | extend | `src/core/templates/workflows/apply-change.ts` and siblings | Root becomes index; stage bodies stay in TS modules but emit to `reference/` |
| Final quality gates | reuse | `src/core/templates/workflows/final-quality-gates.ts` | Do not change gate order, outcomes, or Hardening `full-qa-test` bind |
| Dual projection | reuse | `src/core/templates/workflows/projection.ts` | Still edit TS; still generate command + skill; no new single-file architecture |
| Bundled skill copy | extend | `copyBundledStaticSkills` / `OBSOLETE_BUNDLED_SKILL_DIRS` | Add retired names; stop copying host maps and debug debris |
| SessionStart hook | replace conflicting behavior | `hooks/session-start` | Name the router; do not embed SKILL.md |
| Slim ceremony change | supersede one sentence | `slim-agent-instruction-ceremony` spec `Root skills SHALL disclose detail on demand` | Same-file “MAY remain later” is withdrawn for Apply/Propose/Verify |
| full-qa-test procedure | boundary | `skills/full-qa-test/SKILL.md` | Description only; do not rewrite 10→10→10 |
| Cursor full-qa-test copy | boundary | `.cursor/skills/full-qa-test/SKILL.md` | Not a sync target |

## Goals / Non-Goals

**Goals:**

- Skills and always-on docs load for the current task, not by ritual.
- Apply/Propose/Verify roots are short indexes; stage contracts load when that stage starts.
- Dispatch, review timing, and completion evidence each have one live owner.
- Product quality gates and Hardening saturation stay.

**Non-Goals:**

- Package D (later): execution-plan Step 1–5 slot filling, Explore one-question-at-a-time, Propose derived-assumption MUST list, and worktrees Step 4 complete-suite baseline. That baseline is the leftover conflict with last round’s Git-aware Direct Modification / Hardening suite stage; this change must not “fix” it by rewriting worktrees verification. Product contracts are not D; they stay in A–C too.
- Rewriting `full-qa-test` six-dimension / 10→10→10 procedure.
- Syncing `.cursor/skills/full-qa-test/SKILL.md` as a dedicated target.
- Collapsing command.md / skill.md / `workflows/*.ts` into a new source layout.
- Injecting `GPT6-guide.md` into `AGENTS.md` or `using-superpowers`.
- CLI flags, `applyRequires`, remediations schema fields, Manual Coverage vs Deferred semantics.

## Decisions

### 1. Scope is packages A+B+C, not D

**Problem:** The audit offered four work packages. Shipping package D in the same change would rewrite Propose/Explore/execution-plan **format** recipes that this pass explicitly left alone. Decision-option letters below are **not** the audit packages.

**User selection:** The user asked to implement packages A, B, and C and to leave package D undone, then to create a change proposal for that slice.

| Option | Scope | Risk to locked contracts |
|---|---|---|
| 1. Packages A+B+C only | Trigger, file split, ownership | Leaves Step 1–5 and Explore cadence |
| 2. Packages A+B+C+D in one Proposal | Full audit | Mixes load reduction with plan-format changes |
| 3. Package A only | Fastest | Leaves 5800-word Apply dump |

**Choice:** Option 1.

**Trade-offs / cost:** execution-plan still demands paste-ready skeletons; Explore still prefers one question at a time; worktrees Step 4 still documents a complete-suite baseline that contradicts Git-aware Direct Modification / Hardening. Those remain known package-D leftovers, not this change’s defects.

### 2. One Proposal, three serial Dispatch Units

**Problem:** A, B, and C all edit Apply templates, `using-superpowers`, and guidance tests. Splitting into three Proposals would triple-touch the same files.

**Choice:** Keep one Change Proposal. Units 1–3 are A, B, and C. Unit 4 is pin retargeting and generated-projection refresh after those three; it is not a fourth capability. Combined workload is large; the exception is that intermediate splits are not independently shippable (narrowed descriptions with the Apply dump still present, or a split Apply that still chain-reads retired skills).

**Why not three Proposals:** A without B still injects 5800 words on `/sp:apply`. B without C still points at VBC/SDD files C deletes. C without B would merge owners into a root that is still a dump.

**Why not A+C then B:** C retires VBC; A’s “stop chain-reading VBC” is a one-liner on Apply that B then turns into an index. Serial A→B→C matches the audit and keeps each unit’s tests meaningful.

### 3. Stage files are generated `reference/` companions, not a new architecture

**Problem:** Slash commands and skills are one file today. True progressive disclosure needs other files, without abandoning TS → dual projection.

| Option | Drift | Fits non-goal |
|---|---|---|
| A. Keep one generated file, say “read later” | Zero generator work | No — already failed |
| B. Emit `reference/*.md` next to the generated SKILL.md from the same TS strings; command index names those paths | One source | Yes |
| C. New markdown-only source replacing `workflows/*.ts` | Low later | No — excluded architecture |

**Choice:** B.

**Why B wins:** `final-quality-gates.ts` already owns Hardening/FQG/Manual Coverage strings. Apply root stops concatenating them. Init/update write companions with `path.join(projectPath, tool.skillsDir, 'skills', dirName, 'reference', fileName)`. Markdown indexes name skill-relative paths such as `` `reference/test-hardening.md` ``; they do not paste `path.join` into the command body. Propose and Verify get the same treatment for their long tails. Skill and command roots stay dual projections of a short index via existing `pick`.

**Why A loses:** Cursor and Claude inject the whole command. Later sections are already in context.

**Why C loses:** User/audit excluded a new single-source layout; `skill-templates-parity` already pins TS as source.

**Mapping:** Add optional `references: { relativePath: string, content: string }[]` on `SkillTemplate` (or a sibling export `getApplyChangeReferences()`). `init.ts` / `update.ts` mkdir and write each file after `generateSkillContent`. Parity tests: Apply root MUST NOT match remediations field list / FQG table header dump; `reference/final-quality-gates.md` MUST.

**Fail-closed:** If FQG starts and the companion is missing, the gate is `blocked` with the missing path. Do not skip. Do not inline the recipe back into the root as a silent fallback (that restores the dump). Regeneration path is `superpowers update` / re-init.

**Worked example:** `buildApplyInstructions` returns select-change, status, current-unit read, pause list, and “when Hardening starts, read `reference/test-hardening.md`”. `getCanonicalNonVisualSuiteInstructions('Test Hardening')` plus Manual Coverage plus Hardening bullets go to `reference/test-hardening.md`. `APPLY_RUNTIME_BEFORE_CAPTURE` goes to `reference/runtime-before.md`. `getFinalQualityGateInstructions()` goes to `reference/final-quality-gates.md`. Dispatch-unit assignment goes to `reference/dispatch-units.md`. Propose artifact generation goes to `reference/artifact-loop.md`. Verify report/correctness body goes to `reference/verify-report.md`.

### 4. Retire overlapping skills from the install catalog

**Problem:** Narrowing descriptions is not enough if the files still exist for hosts to auto-offer.

| Option | Catalog size | Test churn |
|---|---|---|
| A. Keep stub SKILL.md that only points at the owner | Still visible | Low |
| B. Stop copying live SKILL.md; add dirs to `OBSOLETE_BUNDLED_SKILL_DIRS`; move remaining portable prompts into the owner’s `reference/` | Three fewer catalog entries | Guidance tests move |

**Choice:** B for `verification-before-completion`, `subagent-driven-development`, and `when-to-dispatch-code-review`.

**Why B wins:** Cursor lists every SKILL.md description. Stubs still trigger. Slim already used “move off a live SKILL.md” for writing-plan.

**Why A loses:** The audit’s C is “one owner,” not “two files that agree.”

**Mapping:** Fold matching-stage evidence (three sentences, no Iron Law) into `using-superpowers`. Fold Direct Modification review timing into the same root; Proposal path points at Apply’s gate. Move dispatch loop into Apply `reference/dispatch-units.md` only — do not put that loop in the Apply root. Move `when-to-dispatch-code-review/code-reviewer.md` to `skills/using-superpowers/reference/code-reviewer.md`. Sweep remaining live skills (`finishing-a-development-branch`, `systematic-debugging`, `using-git-worktrees`, `using-superpowers`) so they do not require the retired skill files. Update `test/core/*guidance.test.ts` including `sdd-guidance.test.ts` to read the new owners. Extend `OBSOLETE_BUNDLED_SKILL_DIRS` in both `init.ts` and `update.ts`. Do not pin `SKILL_NAMES` (workflow ids only).

**Fail-closed:** After update, a remaining `verification-before-completion/SKILL.md` in a configured tool skills dir is a product defect.

### 5. SessionStart points; CLAUDE.md drops the catalog

**Problem:** On-demand loading cannot survive a hook that pastes the router and a project file that lists every skill.

**Choice:** SessionStart injects a short pointer (skill name + “read it when choosing Direct vs Proposal”), not `cat SKILL.md`. `CLAUDE.md` keeps Development Commands, Project Structure, Coding Conventions, CLI Usage, Slash Commands. Delete the Skills bullet merchandising list.

**Why not delete the hook:** Claude Code users still need a reminder that Superpowers is installed. Naming the skill is enough.

**Fail-closed:** Hook JSON that includes the string `Select one of exactly two work modes` (or the full Persist section) is a defect.

### 6. Apply conflict sentences are deleted, not patched

**Problem:** Apply says continue reversible repairs and also pause when implementation reveals issues; it also asks for a separate complete integration review.

**Choice:** Delete those two guardrail sentences. Keep the pause list already aligned with `using-superpowers` (product-ambiguous, unsatisfiable artifacts, irreversible Git/production, user interrupt). Do not add a third clarifying sentence.

### 7. Host maps and debug debris leave default copy

**Choice:** Remove `codex-tools.md`, `copilot-tools.md`, and `gemini-tools.md` from `skills/using-superpowers/reference/` (archive under `docs/archive/` if a later host-specific change wants them). Remove `systematic-debugging/CREATION-LOG.md` and `test-pressure-*.md` from the live skill directory (tests that author skills can live under `test/` if still needed). Keep `root-cause-tracing.md`, `defense-in-depth.md`, and `condition-based-waiting.md` as on-demand technique files.

## Contracts

### API / CLI

No flag, JSON field, or command name change. `superpowers instructions apply` payload still lists `contextFiles`; Verify/Apply guidance changes how much of each file to read.

Generated layout addition (init/update), using `path.join(projectPath, tool.skillsDir, 'skills', dirName, 'reference', fileName)`:

- Apply `dirName` `superpowers-apply-change`: `test-hardening.md`, `runtime-before.md`, `final-quality-gates.md`, `dispatch-units.md`
- Propose `dirName` `superpowers-propose`: `artifact-loop.md`
- Verify `dirName` `superpowers-verify-change`: `verify-report.md`

Command files remain one path per workflow (`sp-apply.md`). Their bodies name those skill-relative markdown paths. Node write paths use `path.join`; markdown pointers do not.

### States

Unchanged gate outcomes: `passed` | `failed` | `blocked` | `not applicable`.

New fail-closed: missing stage companion → `blocked` for that stage, never `passed`.

Retired skill dirs: absent after init/update.

### Errors

Missing reference file: report path, tell the user to run init/update, do not skip Hardening/FQG.

Ambiguous change targeting: unchanged (prompt).

## Invariants

| ID | Invariant | How to falsify | Owner test / check |
|---|---|---|---|
| I1 | Hardening still requires `full-qa-test` six-dimension / 10→10→10 (or Apply fallback) once that stage starts | Hardening reference omits `full-qa-test` invocation | Apply reference string pin |
| I2 | Apply/Propose/Verify roots do not contain the FQG remediations field list | Root SKILL.md / command.md still includes `≥2 meaningfully different Solutions` | Parity / guidance pin |
| I3 | SessionStart does not embed `using-superpowers` body | Hook stdout contains `Select one of exactly two work modes` | Hook unit test |
| I4 | Retired skills are not installed | init fixture still has `verification-before-completion/SKILL.md` | init/update tests |
| I5 | No `GPT6-guide.md` required read | `AGENTS.md` or `using-superpowers` gains a GPT6 MUST | Existing slim pin stays green |
| I6 | Apply does not chain-read TDD or VBC skill files | Apply root still says `Please refer to the \`test-driven-development\` skill` | Apply template pin |
| I7 | `full-qa-test` procedure text is not rewritten | 10→10→10 section in `skills/full-qa-test/SKILL.md` changes in this diff | Diff / explicit non-touch test |
| I8 | Dual projection remains | command.md / skill.md / workflows/*.ts collapsed to one source tree | Architecture: still three emitters |

## Risks / Trade-offs

- Same-context hosts that only inject the slash command may fail to Read sibling skill files → Mitigation: command index uses an explicit Read path under the host skills directory; missing file is `blocked`, not skip.
- Guidance tests that pin retired paths will fail until redirected → Mitigation: owned by Unit 3; update pins to the new owner in the same unit.
- Unarchived slim specs still say FQG MAY stay in the same file → Mitigation: this change’s `stage-file-disclosure` is the new behavior; later archive of slim must not restore the MAY sentence.

## Migration Plan

Users pick up generated files and bundled skill copy on `superpowers update` / re-init. Obsolete skill directories are deleted from configured tool roots. No data migration. Rollback is reverting the instruction and generator files.

## Open Questions

None. User-confirmed fork is Decision 1. Implementation forks are Decisions 2–7.
