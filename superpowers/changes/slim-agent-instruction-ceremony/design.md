## Context

Superpowers tells coding agents how to choose Direct vs Proposal work, write artifacts, implement through Apply, and close quality gates. Those contracts live in static `skills/` files and in TypeScript workflow templates that init copies into host command/skill files. Stronger instruction-following models treat overlapping MUST/Iron Law/pause/complete-suite sentences as blocking. This change rewrites that guidance so the product constraints stay and the ceremony drops.

## Current system

`skills/using-superpowers/SKILL.md` is described as a start-of-conversation skill. It requires checking skills before any reply, then choosing a work mode, then loading schema YAML and a six-dimension Proposal scoring table in the same file.

`/sp:propose` (`src/core/templates/workflows/propose.ts`) runs a read-only preflight, then an interview that waits for one answer at a time, then a three-state confirmation gate even when the user already asked to create the change.

`/sp:apply` reads every `contextFiles` path, follows per-task Step 1–5, invokes `full-qa-test` during Test Hardening (kept), then runs Final Quality Gates. `getCanonicalNonVisualSuiteInstructions` in `src/core/templates/workflows/final-quality-gates.ts` prefers Git-aware tests and fail-closes to the complete canonical suite. If the host cannot spawn a subagent, the gate is `blocked`.

`/sp:verify`, archive, and sync refuse to auto-select a change. `skills/test-driven-development/SKILL.md` applies to any feature or bugfix. `skills/systematic-debugging/SKILL.md` requires four phases before any fix. `skills/verification-before-completion/SKILL.md` equates evidence with a full command / complete suite. `skills/subagent-driven-development/SKILL.md` restates Apply gates and demands a one-time read of five artifacts. `writing-plan/SKILL.md` is an orphan plan recipe. `when-to-dispatch-code-review` still restates Apply review policy around the same gate. `finishing-a-development-branch` Step 1 still requires a complete `npm test` / `cargo test` / `pytest` / `go test ./...` suite. Explore's generated description includes "investigating problems," which overlaps systematic debugging. `using-superpowers` Direct Modification still says fall closed to the complete suite. Debug Phase 2 still requires reading a reference implementation every line. Propose still requires a TodoWrite progress loop. `using-git-worktrees` pauses for a two-option directory prompt. change-review still lists 10→10→10 as a test-plan Must include before implementation. `CLAUDE.md` still lists `dispatching-parallel-agents`. Root `AGENTS.md` is empty; `docs-agent-instructions` still requires template dumps in `superpowers/AGENTS.md`.

Unarchived changes already landed interview, work-mode, and gate sentences in these same template files. This change edits those live sources and supersedes conflicting sentences; it does not wait for those folders to archive.

### Relationship to existing tech

| Existing capability | Relation | Pointer | Note |
|---|---|---|---|
| Work-mode selection | extend | `skills/using-superpowers/SKILL.md` | Keep two modes; shorten root file |
| Propose interview gate | replace conflicting sentences | `src/core/templates/workflows/propose.ts` | Keep high-impact questions; drop one-at-a-time lock |
| Final quality gates | extend | `src/core/templates/workflows/final-quality-gates.ts` | Keep order and remediations; change spawn fallback and suite stage |
| full-qa-test | reuse | `skills/full-qa-test/SKILL.md` | Hardening binding unchanged |
| Skill/command projections | reuse | `src/core/templates/skill-templates.ts` | Edit TS source; do not redesign dual projection |
| Cursor full-qa-test copy | boundary | `.cursor/skills/full-qa-test/SKILL.md` | Out of scope as a sync target |

## Goals / Non-Goals

**Goals:**

- Agents continue authorized, reversible work to the requested outcome.
- Skills and workflow files load by task, not by ritual.
- Test Hardening still uses `full-qa-test`. Hardening/Verify still run registered `test-plan.md` rows. Git-aware tests replace complete-suite theater for everything else.
- Product contracts remain: artifact graph, remediations, Manual Coverage, P0/P1/P2 vs gate outcomes, Propose vs Dispatch Unit.
- Overlapping catalog skills collapse to one owner each: Apply owns Proposal-path code review; Git-aware / matching-stage owns finishing-branch verification; Explore thinks, debug investigates unknown-cause failures.

**Non-Goals:**

- A model-named always-on ruleset (`GPT6-guide.md` in `AGENTS.md` or `using-superpowers`).
- Splitting or rewriting the `full-qa-test` 10→10→10 / six-dimension procedure.
- Editing `.cursor/skills/full-qa-test/SKILL.md` as a dedicated sync.
- Collapsing command.md / skill.md / `workflows/*.ts` into a new single-file architecture.
- Changing CLI flags, `applyRequires`, or archive merge mechanics.

## Decisions

### 1. User-confirmed exceptions to the audit

**Problem:** The audit recommended dropping Hardening's `full-qa-test` bind, DRYing command/skill/TS, and syncing `.cursor/skills/full-qa-test/SKILL.md`.

**User selection:** Keep the Hardening `full-qa-test` bind and six-dimension / 10→10→10 rules. Use Git-aware tests for the non-`test-plan` suite stage so agents do not run a complete suite. Do not handle command/skill/TS sameness as a cleanup, and do not process `.cursor/skills/full-qa-test/SKILL.md`. Decisions 5–18 are the other agreed audit items.

| Option | Coverage | Instruction volume | User lock |
|---|---|---|---|
| A. Drop Hardening → full-qa-test bind | Weaker saturation | Smaller Apply | Rejected |
| B. Keep bind; Git-aware only outside test-plan | Saturation on registered rows; related tests elsewhere | Apply stays long at Hardening | Selected |
| C. Keep complete-suite fail-closed | Saturation plus unused suite | Highest cost | Rejected |

**Choice:** B.

**Trade-offs / cost:** Apply still loads `full-qa-test` at Hardening. Cursor's installed full-qa-test copy may drift from `skills/full-qa-test` until a later init/update; this change will not spend a task on that copy.

### 2. Single source for instruction text

**Problem:** Workflow text exists in TypeScript and in generated host files.

| Option | Drift | Scope | Fits non-goal |
|---|---|---|---|
| A. Invent a new single markdown source | Low later | Large unrelated refactor | No |
| B. Keep editing `workflows/*.ts` and refresh projections through existing parity | Matches today | Owned by this change | Yes |
| C. Edit only `.cursor/commands` and leave TS | Immediate drift | Looks small | No |

**Choice:** B.

**Rationale:** A is the cleanup the user excluded. C would fail `skill-templates-parity` and leave `superpowers init` shipping old text. B changes behavior where the product already generates files. Mapping: every Propose/Apply/Verify/Archive/Sync/gate sentence change starts in the corresponding `src/core/templates/workflows/*.ts` export; then run existing generation or parity updates so installed projections match. Static skills under `skills/` are edited in place; tool copies under `.cursor/skills` and `.codex/skills` refresh only when those files are already generated from `skills/` or when tests require the repo-local copies used in CI. Do not add a new generator. Worked example: replace `Ask one decision question at a time` in `propose.ts`; parity tests that pin that string change to the batched-decision wording.

### 3. Spawn fallback vs blocked

**Problem:** Missing subagent spawn currently blocks gates.

| Option | Completion | Independence | Risk |
|---|---|---|---|
| A. Keep blocked | Stops the task | Highest | Conflicts with persist-until-done |
| B. Same-context fallback, labeled | Task can finish | Lower | Coordinator bias |
| C. Skip the gate | Fast | None | Drops the product contract |

**Choice:** B.

**Rationale:** C deletes the gate; A is the pause this change exists to remove. B keeps the four-gate contract and the prefer-fresh-worker rule. Fail-closed: if spawn exists, using the coordinator instead of a worker is still a defect. If spawn does not exist, omitting the review mode label is a defect. Worked example: Final Quality Gates table gains a Review mode column or evidence field with `fresh-worker` or `same-context fallback`.

### 4. Git-aware empty selection

**Problem:** Today's fail-closed runs the complete suite when Git-aware is empty.

**Choice:** Record the limitation and still require registered `test-plan.md` rows. Do not require a complete-suite command as the pass for that stage.

**Rationale:** The user locked Git-aware as the protection against complete-suite waste. Substituting `pnpm test` would restore the waste. Empty related selection is not a pass for the non-`test-plan` stage; it is a recorded skip of that stage, not a skip of `test-plan` rows.

Fail-closed: claiming Hardening passed with unexecuted applicable `test-plan` rows remains invalid.

### 5. Load skills only for the current task

**Problem:** `using-superpowers` triggers on every conversation and requires checking skills before any reply.

**Choice:** Root skill is a Direct vs Proposal router. Read a skill when the task matches its description or the user names it. Do not inspect the whole library first.

**Trade-offs / cost:** A matching Apply/Propose request still loads that workflow skill before acting.

### 6. Persist until the requested outcome

**Problem:** Agents stop after a first draft or a natural phase to ask whether to continue.

**Choice:** After implement / fix / check / continue, keep going until that outcome is done or a pause in Decision 7 applies. Do not ask "should I continue?" between clear tasks.

### 7. Pause only for irreversible or product gaps

**Problem:** Apply and related skills pause on reversible errors and wait for guidance.

**Choice:** Pause for Git history rewrite, force push, production, unrecoverable publish, or missing information that would change product, security, billing, or public-contract decisions. Do not pause for read-only search, in-scope edits, local build, tests, repairing failures from this change, or already authorized git add/commit/push.

### 8. TDD, debug, and completion evidence

**Problem:** TDD, four-phase debug, and verification-before-completion all fire as always-on Iron Laws, and they disagree with Git-aware / `test-plan` scope.

**Choice:** TDD for observable behavior that should have an automated test; not for copy-only, generated, config, or type-narrowing edits. Four-phase debug only when the cause is unknown, reproduction is unstable, or patches already failed. Completion claims need a fresh run of the current-stage command (focused, Git-aware, or registered `test-plan` rows), not a complete suite.

### 9. Propose asks high-impact questions, then writes when asked to create

**Problem:** Propose waits one question at a time and blocks writes on a three-state widget even after the user asked to create the change.

**Choice:** Ask only unresolved high-impact product or technical decisions; batch them. A request to create a proposal authorizes artifact writes after a short understanding summary. Still pause when two product scopes would change acceptance. Do not invent user Choices.

### 10. Apply reads the current unit, not every context file first

**Problem:** Apply requires reading all `contextFiles` before the first edit.

**Choice:** `contextFiles` is the catalog. Each task reads that dispatch unit plus the spec/design slices it cites. Hardening still reads `test-plan.md` and `full-qa-test` when that stage starts.

### 11. Apply continues reversible in-scope repairs

**Problem:** Any compile or test error becomes "report and wait for guidance."

**Choice:** Failures caused by the current authorized diff are fixed and rechecked without waiting. Pause when the design cannot be satisfied or the task is product-ambiguous (Decision 7).

### 12. Verify, archive, and sync auto-select when unambiguous

**Problem:** Verify/archive/sync forbid guessing even when one eligible change exists.

**Choice:** Explicit name, else conversation binding, else the sole eligible change, else prompt. Archive still warns and confirms when applicable quality gates are incomplete. Sync with zero delta-spec changes reports ineligible and stops.

### 13. Progressive disclosure without a new file architecture

**Problem:** Root skills dump every stage recipe into the always-loaded body.

**Choice:** The opening states when to use the skill and which later section to read. Stage contracts (Final Quality Gates, Manual Coverage, schema/scoring dumps) may stay later in the same generated file or in `reference/`. Do not split command.md / skill.md / `workflows/*.ts` into a new single-source layout (Decision 1 and 2).

### 14. Skill catalog cleanup

**Problem:** Overlapping and stale skills fight the router.

**Choice:** `subagent-driven-development` becomes Apply dispatch guidance only. Retire `writing-plan` / `writing-plans` from discovery (move off a live `SKILL.md`). Remove `dispatching-parallel-agents` from `CLAUDE.md`. Narrow `skills/security-review/SKILL.md` description to an explicit security request. Do not rewrite `full-qa-test` procedure text. Do not inject `GPT6-guide.md` into `AGENTS.md` or `using-superpowers`. Keep root `AGENTS.md` empty or limited to short project constraints.

### 15. Agent docs link to schema templates

**Problem:** `docs-agent-instructions` still requires copy-paste templates inside `superpowers/AGENTS.md`, a path legacy cleanup already removed.

**Choice:** Schema templates under `schemas/` are the copy source. `docs/workflows.md` and `CLAUDE.md` name artifacts and link out. Do not regenerate `superpowers/AGENTS.md`.

### 16. Keep product contracts; delete the duplicate rule

**Problem:** Slimming must not erase Superpowers behavior, and conflicting sentences must not be patched with a third rule.

**Choice:** Keep Direct vs Proposal, Proposal vs Dispatch Unit, artifact graph, remediations, Manual Coverage vs Deferred, `agent-browser` on Verify, P0/P1/P2 vs gate outcomes, and the four-gate order. Where two instructions conflict, keep one sentence and delete the other.

### 17. Remaining overlapping skills stay separate owners

**Problem:** Catalog cleanup (Decision 14) retired writing-plans and narrowed SDD and security-review, but three live overlaps still fight the router: Apply vs `when-to-dispatch-code-review`, complete-suite vs `finishing-a-development-branch`, and Explore vs systematic debugging.

**Choice:** Keep three files; do not merge them.

- `when-to-dispatch-code-review` is timing-only. On Proposal → Review → Apply, Apply's final code-review gate is the single integrated review. Do not add another complete review per task, per unit, or around that gate. Direct Modification may still dispatch review on user request, merge-ready high risk, or repository policy. Do not restate Apply severity or retry policy.
- `finishing-a-development-branch` keeps merge / PR / keep / discard. Step 1 uses Git-aware related tests (or the same non-`test-plan` suite stage as Decision 4). It does not require a complete `npm test` / `cargo test` / `pytest` / `go test ./...` pass.
- Explore (`src/core/templates/workflows/explore.ts`) is thinking and requirement clarification without implementing. Systematic debugging is unknown-cause failure investigation. Explore descriptions must not trigger on "investigating problems" that are actually bugs or failing tests. Do not merge Explore and debug into one skill.

### 18. Remaining delete and rewrite leftovers

**Problem:** Decision 8, 9, 12, and 17 covered the main overlaps, but five audit sentences were still only implied: Direct Modification complete-suite fall-closed, debug line-by-line reads, Propose TodoWrite ceremony, worktree location prompt, and change-review counting 10→10→10 as proposal completeness.

**Choice:** Delete those sentences; do not patch them with a third rule.

- `using-superpowers` Direct Modification uses Git-aware / matching-stage verification. Delete `fall closed to the complete suite`. Pin it in Task 1.1, not only as a side effect of thinning the file.
- Delete `read reference implementation COMPLETELY` and `Don't skim - read every line` from systematic-debugging. Do not move them into `reference/`.
- Propose writes artifacts in dependency order. TodoWrite is optional host bookkeeping, not a required loop.
- `using-git-worktrees` keeps gitignore. Missing directory defaults to `.worktrees/`. Do not pause for `.worktrees/` vs global config.
- change-review judges whether the test-plan names gaps and dimensions. An unfinished 10→10→10 batch is not a completeness BLOCKER. Hardening still owns 10→10→10 (Decision 1 / I1).

## Contracts

### API / CLI

N/A — no CLI flag, JSON field, or command name change. `superpowers status` / `instructions` / `validate` keep current shapes. `contextFiles` remains the catalog; Apply guidance changes how much of each file is read, not the CLI payload.

### States

Propose: `authorized-to-write` when the user asked to create a proposal and no product-decision pause applies. The labeled three-state widget is optional UX, not a required state.

Quality gates: outcomes stay `passed` | `failed` | `blocked` | `not applicable`. `blocked` is only for missing runtime, credentials, visual design source, or an external product decision — not for missing spawn.

Non-`test-plan` suite stage: `ran-git-aware` | `git-aware-unavailable-recorded`. Neither state implies `test-plan` rows passed.

### Errors

Unambiguous change targeting: no error; select and announce.

Ambiguous change targeting: prompt; do not guess.

Git-aware unavailable: record in Hardening/Verify evidence; do not fail the stage solely for that recording.

Force push / history rewrite / production / unrecoverable publish: pause; do not proceed.

## Invariants

| ID | Invariant | How to falsify | Owner test / check |
|---|---|---|---|
| I1 | Hardening still requires `full-qa-test` six-dimension / 10→10→10 rules (or the Apply fallback). | Apply Hardening guidance omits `full-qa-test` invocation and the six-dimension fallback. | String pin in apply template tests |
| I2 | Non-`test-plan` suite stage never requires a complete canonical suite to pass. | `getCanonicalNonVisualSuiteInstructions` still fail-closes to the complete suite as a pass condition. | `final-quality-gates.ts` unit assertion |
| I3 | Missing spawn does not by itself yield gate outcome `blocked`. | Apply/review templates still say mark blocked and pause when the host cannot launch a subagent. | Parity test on fallback wording |
| I4 | `using-superpowers` does not require reading skills before every reply. | Root skill still says check skills before any response or action. | `using-superpowers-guidance` test |
| I5 | No always-on Astra ruleset is added. | `AGENTS.md` or `using-superpowers` gains a required `GPT6-guide.md` read. | File content assertion |
| I6 | User-invented Choices remain forbidden. | Propose writes a `**User selection:**` table for an option the user never saw. | Existing design-convention tests stay green |
| I7 | Finishing a branch does not require a complete canonical suite. | `finishing-a-development-branch` still lists `npm test / cargo test / pytest / go test ./...` as required before merge/PR options. | String pin on that skill |
| I8 | Direct Modification does not fall closed to a complete suite. | `using-superpowers` still contains `fall closed to the complete suite`. | `using-superpowers-guidance` test |
| I9 | Proposal review does not treat 10→10→10 as pre-implementation completeness. | `change-review.ts` still lists `10→10→10 run once per Requirement per dimension` under Must include. | change-review template pin; I1 still green |

## Attachments

None.

## Risks / Trade-offs

- Same-context gate reviews can rubber-stamp coordinator work → Mitigation: require the review-mode label and keep adversarial Verify intent.
- Cursor `full-qa-test` copy may drift → Mitigation: accepted; `skills/full-qa-test` remains the source this change will not rewrite.
- Unarchived interview/gate specs will disagree with new templates until archived → Mitigation: this change's specs are the new behavior; later archive of old changes must not restore deleted sentences.

## Migration Plan

Edit static skills and TypeScript templates in this repository; existing tests that pin old strings update in the same change. Users pick up generated host files on `superpowers update` / re-init. No data migration. Rollback is reverting the instruction files.

## Open Questions

None. User-confirmed forks are Decision 1 plus Decisions 5–18. Implementation forks are Decisions 2–4.
