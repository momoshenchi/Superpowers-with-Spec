## Testing Gap Analysis

Worker tests in `execution-plan.md` pin individual strings (descriptions, hook body, Apply referrals, FQG dump in the root, retired skill paths). They do not prove: (1) Hardening’s `full-qa-test` bind still exists after the Apply split; (2) a missing companion cannot be recorded as passed; (3) init and update both remove all three retired skill dirs; (4) `.cursor/skills/full-qa-test/SKILL.md` is not edited; (5) `GPT6-guide.md` stays out of always-on files.

Name each remaining gap:

- R1 / D2: description YAML vs body still saying REQUIRED
- R3 / D4: SessionStart still valid JSON after dropping `cat SKILL.md`
- R6 / D6: missing `reference/final-quality-gates.md` must `blocked`, not skip
- R8 / D4: update of an already-initialized tool removes leftover SDD/VBC/when-to-dispatch dirs
- I1 / D1: Hardening companion still names `full-qa-test` and 10→10→10

## Test Scope Register

| Object | Requirement | Spec Scenarios to import | Entry Point | Diff Anchor | Risk Hypothesis |
| --- | --- | --- | --- | --- | --- |
| R1 | `Requirement: Catalog descriptions SHALL state when not to use the skill` | full-qa-test does not fire on a focused unit test; worktrees does not fire on every Apply; finishing-a-branch waits for an integration request | `skills/*/SKILL.md` YAML `description` | `full-qa-test/SKILL.md`, `using-git-worktrees/SKILL.md`, `finishing-a-development-branch/SKILL.md` | Body still says REQUIRED while description is narrowed |
| R2 | `Requirement: Apply SHALL NOT chain-read TDD or completion-evidence skills` | Apply starts a behavior task without loading TDD.md; Apply completes a task without loading VBC.md | `getApplyChangeSkillTemplate().instructions` | `apply-change.ts` | Index still `Please refer to` after split |
| R3 | `Requirement: SessionStart SHALL not inject the using-superpowers body` | Session start names the router | `hooks/session-start` stdout JSON | `hooks/session-start` | Pointer accidentally includes concatenated SKILL.md |
| R4 | `Requirement: Agent docs SHALL not merchandize the skill catalog` | CLAUDE.md omits the skill pitch list | root `CLAUDE.md` | `CLAUDE.md` | Slash Commands section is deleted with Skills |
| R5 | `Requirement: Workflow roots SHALL be stage indexes` | Apply root does not contain Final Quality Gates; Propose root defers artifact-loop detail; Verify root does not dump every artifact | generated Apply/Propose/Verify SKILL.md and commands | `apply-change.ts`, `propose.ts`, `verify-change.ts` | FQG string still concatenated into root |
| R6 | `Requirement: Stage contracts SHALL live in referenced files` | Hardening loads its contract when the stage starts; Missing companion does not skip the gate | init-written `reference/*.md`; Apply index missing-file sentence | `skill-generation.ts`, `init.ts`, `update.ts` | Missing file silently inlines the recipe |
| R7 | `Requirement: Long technique skills SHALL keep procedure off the root` | Localized failure does not load debug procedure; TDD root stays the rule not the lecture | `skills/systematic-debugging/SKILL.md`, `skills/test-driven-development/SKILL.md`, `skills/using-superpowers/SKILL.md` | those roots + `reference/` | Eight-step decompose left in router root |
| R8 | `Requirement: Apply SHALL own dispatch-unit execution` | Apply contains dispatch rules; Init removes the SDD skill directory | Apply dispatch text; `superpowers init` / `update` | `apply-change.ts`, `init.ts`, `update.ts` | Init removes but update leaves leftovers |
| R9 | `Requirement: using-superpowers SHALL own code-review timing` | Direct Modification timing stays in the router; Init removes the dispatch-timing skill | `using-superpowers/SKILL.md`; init | `using-superpowers/SKILL.md`, obsolete dirs | Timing skill stub remains discoverable |
| R10 | `Requirement: using-superpowers SHALL own completion-evidence` | Router states matching-stage evidence; Init removes the VBC skill | `using-superpowers/SKILL.md`; init | same | Iron Law file remains under `skills/` |
| R11 | `Requirement: Apply SHALL not restate a second complete review` | Guardrails do not add a full validation review | Apply index Guardrails | `apply-change.ts` | Sentence survives in command projection only |
| R12 | `Requirement: Apply pause text SHALL match the router` | In-scope compile error continues | Apply index pause list | `apply-change.ts` | Both “continue repairs” and “pause on issues” remain |
| R13 | `Requirement: Default discovery SHALL omit host maps and debug authoring debris` | Router does not point at host tool maps; Debug skill copy omits pressure tests | copied `using-superpowers/reference/`; copied `systematic-debugging/` | those directories | `cp` of `skills/` still copies CREATION-LOG |
| R14 | `Requirement: Remaining skills SHALL not point at retired skills` | finishing-a-branch does not require VBC or SDD; debug and worktrees do not require retired skills | remaining bundled SKILL.md files | finishing/debug/worktrees/using-superpowers | Pointers survive after obsolete-dir removal |
| R14 | `Requirement: Remaining skills SHALL not point at retired skills` | finishing-a-branch does not require VBC or SDD; debug and worktrees do not require retired skills | remaining `skills/*/SKILL.md` | finishing, debug, worktrees, using-superpowers | 3.2 retires dirs but leaves see-also pointers |

## Design Contract And Invariant Coverage

| Object | Contract / Invariant | Case IDs | Notes |
| --- | --- | --- | --- |
| R6 | I1 Hardening still requires `full-qa-test` | TC-R6-D1-003 | Companion, not root |
| R5 | I2 Roots omit remediations field list | TC-R5-D1-001, TC-R5-D2-001 | Skill and command |
| R3 | I3 SessionStart does not embed body | TC-R3-D1-001 | |
| R8 | I4 Retired skills are not installed | TC-R8-D1-002, TC-R8-D4-001, TC-R9-D1-002, TC-R10-D1-002 | Three names |
| R10 | I5 No GPT6 required read | TC-R10-D5-001 | |
| R2 | I6 Apply does not chain-read TDD or VBC | TC-R2-D1-001 | |
| R1 | I7 `full-qa-test` procedure not rewritten | TC-R1-D2-002 | Diff of procedure section |
| R6 | I8 Dual projection remains | TC-R6-D2-002 | generateSkillContent + generateCommand still both exist |
| R6 | Missing companion → `blocked` | TC-R6-D6-001 | |
| R12 | Decision 6 delete not patch | TC-R12-D1-001 | |

## Requirement And Scenario Coverage Matrix

| Object | Requirement | Spec Scenario | D1 Case ID | Related Case IDs | Notes |
| --- | --- | --- | --- | --- | --- |
| R1 | Catalog descriptions SHALL state when not to use the skill | full-qa-test does not fire on a focused unit test | TC-R1-D1-001 | TC-R1-D2-001 | |
| R1 | Catalog descriptions SHALL state when not to use the skill | worktrees does not fire on every Apply | TC-R1-D1-002 | TC-R1-D2-001 | |
| R1 | Catalog descriptions SHALL state when not to use the skill | finishing-a-branch waits for an integration request | TC-R1-D1-003 | | |
| R2 | Apply SHALL NOT chain-read TDD or completion-evidence skills | Apply starts a behavior task without loading TDD.md | TC-R2-D1-001 | TC-R2-D2-001 | |
| R2 | Apply SHALL NOT chain-read TDD or completion-evidence skills | Apply completes a task without loading VBC.md | TC-R2-D1-002 | TC-R2-D2-001 | |
| R3 | SessionStart SHALL not inject the using-superpowers body | Session start names the router | TC-R3-D1-001 | TC-R3-D4-001 | |
| R4 | Agent docs SHALL not merchandize the skill catalog | CLAUDE.md omits the skill pitch list | TC-R4-D1-001 | TC-R4-D2-001 | |
| R5 | Workflow roots SHALL be stage indexes | Apply root does not contain Final Quality Gates | TC-R5-D1-001 | TC-R5-D2-001 | |
| R5 | Workflow roots SHALL be stage indexes | Propose root defers artifact-loop detail | TC-R5-D1-002 | | |
| R5 | Workflow roots SHALL be stage indexes | Verify root does not dump every artifact | TC-R5-D1-003 | | |
| R6 | Stage contracts SHALL live in referenced files | Hardening loads its contract when the stage starts | TC-R6-D1-001 | TC-R6-D1-003 | |
| R6 | Stage contracts SHALL live in referenced files | Missing companion does not skip the gate | TC-R6-D1-002 | TC-R6-D6-001 | |
| R6 | Stage contracts SHALL live in referenced files | Apply dispatch lives in a named companion | TC-R6-D1-004 | | |
| R7 | Long technique skills SHALL keep procedure off the root | Localized failure does not load debug procedure | TC-R7-D1-001 | | |
| R7 | Long technique skills SHALL keep procedure off the root | TDD root stays the rule not the lecture | TC-R7-D1-002 | TC-R7-D2-001 | |
| R8 | Apply SHALL own dispatch-unit execution | Apply contains dispatch rules | TC-R8-D1-001 | | |
| R8 | Apply SHALL own dispatch-unit execution | Init removes the SDD skill directory | TC-R8-D1-002 | TC-R8-D4-001 | |
| R9 | using-superpowers SHALL own code-review timing | Direct Modification timing stays in the router | TC-R9-D1-001 | | |
| R9 | using-superpowers SHALL own code-review timing | Init removes the dispatch-timing skill | TC-R9-D1-002 | TC-R8-D4-001 | |
| R10 | using-superpowers SHALL own completion-evidence | Router states matching-stage evidence | TC-R10-D1-001 | | |
| R10 | using-superpowers SHALL own completion-evidence | Init removes the VBC skill | TC-R10-D1-002 | TC-R8-D4-001 | |
| R11 | Apply SHALL not restate a second complete review | Guardrails do not add a full validation review | TC-R11-D1-001 | TC-R11-D2-001 | |
| R12 | Apply pause text SHALL match the router | In-scope compile error continues | TC-R12-D1-001 | | |
| R13 | Default discovery SHALL omit host maps and debug authoring debris | Router does not point at host tool maps | TC-R13-D1-001 | TC-R13-D2-001 | |
| R13 | Default discovery SHALL omit host maps and debug authoring debris | Debug skill copy omits pressure tests | TC-R13-D1-002 | TC-R13-D2-001 | |
| R14 | Remaining skills SHALL not point at retired skills | finishing-a-branch does not require VBC or SDD | TC-R14-D1-001 | | |
| R14 | Remaining skills SHALL not point at retired skills | debug and worktrees do not require retired skills | TC-R14-D1-002 | | |
| R7 | Long technique skills SHALL keep procedure off the root | using-superpowers root omits eight-step decompose | TC-R7-D1-003 | | was gap; now imported |
| R8 | Apply owns dispatch-unit execution text | Coordinator follows Apply not a second skill | TC-R8-D1-001 | | Same as Apply contains dispatch rules |
| R8 | Single final integration review | Review after all work packages are integrated | TC-R11-D1-001 | | Same gate; D1 imported on R11 |

## Six-Dimension Case Matrix

### D1 — Requirements and business scenarios

| ID | Object | Source | Scenario Type | Steps | Expected | Form | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TC-R1-D1-001 | R1 | imported: full-qa-test does not fire on a focused unit test | happy path | Read `full-qa-test` YAML description | Does not match generic “writing comprehensive test plans for features” | unit | passed | Task 1.1 |
| TC-R1-D1-002 | R1 | imported: worktrees does not fire on every Apply | happy path | Read worktrees description + Integration | Not REQUIRED before Apply | unit | passed | Task 1.2 |
| TC-R1-D1-003 | R1 | imported: finishing-a-branch waits for an integration request | happy path | Read finishing-a-branch description | Does not trigger solely on “implementation complete, all tests pass” | unit | passed | Task 1.2 |
| TC-R1-D1-004 | R1 | gap: Hardening still names full-qa-test | implicit | After Apply split, open Hardening reference | Contains `full-qa-test` invocation | unit | passed | Task 2.3 I1 |
| TC-R2-D1-001 | R2 | imported: Apply starts a behavior task without loading TDD.md | happy path | Read Apply root | No `Please refer to the test-driven-development skill` | unit | passed | Task 1.4 |
| TC-R2-D1-002 | R2 | imported: Apply completes a task without loading VBC.md | happy path | Read Apply root | No refer to verification-before-completion skill | unit | passed | Task 1.4 |
| TC-R3-D1-001 | R3 | imported: Session start names the router | happy path | Read `hooks/session-start` | Names using-superpowers; omits “Select one of exactly two work modes” | unit | passed | Task 1.3 I3 |
| TC-R4-D1-001 | R4 | imported: CLAUDE.md omits the skill pitch list | happy path | Read `CLAUDE.md` | No `## Skills` list; `npm test` still present | unit | passed | Task 1.3 |
| TC-R5-D1-001 | R5 | imported: Apply root does not contain Final Quality Gates | happy path | Read Apply skill+command roots | No `≥2 meaningfully different Solutions` | unit | passed | Task 2.3 I2 |
| TC-R5-D1-002 | R5 | imported: Propose root defers artifact-loop detail | happy path | Read Propose root | No `superpowers instructions <artifact-id>` loop | unit | passed | Task 2.4 |
| TC-R5-D1-003 | R5 | imported: Verify root does not dump every artifact | happy path | Read Verify instructions | No `Read all available artifacts from contextFiles` | unit | passed | Task 2.4 |
| TC-R6-D1-001 | R6 | imported: Hardening loads its contract when the stage starts | happy path | Init fixture; read Apply index | Index names `reference/test-hardening.md`; file exists | unit | passed | Task 2.2–2.3 |
| TC-R6-D1-002 | R6 | imported: Missing companion does not skip the gate | exception | Read Apply index missing-file sentence | Instructs `blocked`, not skip or inline | unit | passed | Task 2.3 |
| TC-R6-D1-003 | R6 | gap: I1 Hardening bind | implicit | Read `reference/test-hardening.md` | Mentions `full-qa-test` and 10→10→10 or six dimensions | unit | passed | Task 2.3 |
| TC-R6-D1-004 | R6 | imported: Apply dispatch lives in a named companion | happy path | Read Apply root and `reference/dispatch-units.md` | Root names `reference/dispatch-units.md`; loop not inlined | unit | passed | Task 2.3 / 3.2 |
| TC-R7-D1-001 | R7 | imported: Localized failure does not load debug procedure | happy path | Read systematic-debugging root | Skip-four-phase rule present; no Evidence ledger | unit | passed | Task 2.5 |
| TC-R7-D1-002 | R7 | imported: TDD root stays the rule not the lecture | happy path | Read TDD root | Has when-to-use + red-green; no Common Rationalizations | unit | passed | Task 2.5 |
| TC-R8-D1-001 | R8 | imported: Apply contains dispatch rules | happy path | Read Apply index or dispatch reference | Combine/inline/spawn language present | unit | passed | Task 3.2 |
| TC-R8-D1-002 | R8 | imported: Init removes the SDD skill directory | happy path | Init fixture skills dir | No `subagent-driven-development/SKILL.md` | unit | passed | Task 3.2 I4 |
| TC-R9-D1-001 | R9 | imported: Direct Modification timing stays in the router | happy path | Read using-superpowers | Small local edits do not require automatic review | unit | passed | Task 3.2 |
| TC-R9-D1-002 | R9 | imported: Init removes the dispatch-timing skill | happy path | Init fixture | No `when-to-dispatch-code-review/SKILL.md` | unit | passed | Task 3.2 |
| TC-R10-D1-001 | R10 | imported: Router states matching-stage evidence | happy path | Read using-superpowers | Matching-stage / focused / Git-aware / test-plan rows | unit | passed | Task 3.2 |
| TC-R10-D1-002 | R10 | imported: Init removes the VBC skill | happy path | Init fixture | No `verification-before-completion/SKILL.md` | unit | passed | Task 3.2 |
| TC-R11-D1-001 | R11 | imported: Guardrails do not add a full validation review | happy path | Read Apply root | No “Keep the final integration review separate” | unit | passed | Task 3.3 |
| TC-R12-D1-001 | R12 | imported: In-scope compile error continues | happy path | Read Apply pause list | Has reversible repair continue; no “If implementation reveals issues, pause” | unit | passed | Task 3.3 |
| TC-R13-D1-001 | R13 | imported: Router does not point at host tool maps | happy path | List `skills/using-superpowers/reference/` | No codex/copilot/gemini-tools.md | unit | passed | Task 3.4 |
| TC-R13-D1-002 | R13 | imported: Debug skill copy omits pressure tests | happy path | List `skills/systematic-debugging/` | No CREATION-LOG.md or test-pressure-*.md | unit | passed | Task 3.4 |
| TC-R7-D1-003 | R7 | imported: using-superpowers root omits eight-step decompose | implicit | Read using-superpowers root | No “Inventory logical capabilities”; schema-and-workload still has scoring | unit | passed | Task 2.5 |
| TC-R14-D1-001 | R14 | imported: finishing-a-branch does not require VBC or SDD | happy path | Read finishing-a-development-branch | No verification-before-completion or subagent-driven-development | unit | passed | Task 3.2 |
| TC-R14-D1-002 | R14 | imported: debug and worktrees do not require retired skills | happy path | Read systematic-debugging and using-git-worktrees | No retired skill REQUIRED/see-also | unit | passed | Task 3.2 |

### D2 — Code and branch coverage

| ID | Object | Code Anchor | Coverage Type | Trigger Input | Expected | Form | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TC-R1-D2-001 | R1 | `using-git-worktrees/SKILL.md` Integration REQUIRED lines | diff line | Apply start | REQUIRED sentences absent | unit | passed | Task 1.2 |
| TC-R1-D2-002 | R1 | `full-qa-test/SKILL.md` 10→10→10 section | diff line | this change diff | Procedure section unchanged (I7) | unit | passed | Task 1.2 / 4.2 |
| TC-R2-D2-001 | R2 | `apply-change.ts` implement-loop and Guardrails refer lines | branch | generated skill vs command | Both projections omit skill referrals (I6) | unit | passed | Task 1.4 / 4.2 |
| TC-R4-D2-001 | R4 | `CLAUDE.md` `## Skills` vs `## Slash Commands` | condition combo | file read | Skills gone; Slash Commands kept | unit | passed | Task 1.3 |
| TC-R5-D2-001 | R5 | `buildApplyInstructions` concatenation | branch | root vs `getFinalQualityGateInstructions` | Root does not include helper output; reference does | unit | passed | Task 2.3 |
| TC-R6-D2-001 | R6 | init write loop `path.join(applyDir, 'reference', fileName)` | diff line | fixture init | companions exist | unit | passed | Task 2.2 |
| TC-R6-D2-002 | R6 | `generateSkillContent` and `generateCommand` still exported | diff line | parity test | I8 three emitters remain | unit | passed | Task 4.2 |
| TC-R7-D2-001 | R7 | TDD `## Common Rationalizations` heading | diff line | TDD root | Heading only in reference | unit | passed | Task 2.5 |
| TC-R11-D2-001 | R11 | Apply Guardrails “final integration review” bullet | diff line | skill+command | Absent from both | unit | passed | Task 3.3 / 4.2 |
| TC-R13-D2-001 | R13 | `copyBundledStaticSkills` source tree | diff line | listed debris paths | `existsSync` false under `skills/` | unit | passed | Task 3.4 |

### D3 — Data and input space

| ID | Object | Parameter | Class | Sample Input | Expected | Form | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TC-R1-D3-001 | R1 | skill `description` | empty | `description: ""` | Test fails closed (description must still name when-not-to-use); do not ship empty | unit | passed | Task 1.1 negative |
| TC-R3-D3-001 | R3 | hook JSON payload | dirty data | quotes/newlines in pointer text | `escape_for_json` still produces valid JSON | unit | passed | Task 1.3 |
| TC-R6-D3-001 | R6 | reference relativePath | boundary | `final-quality-gates.md` | Written with `path.join`, never `'reference/final-quality-gates.md'` slash literals in Node APIs | unit | passed | Task 2.2 |
| TC-R8-D3-001 | R8 | obsolete dir name | empty leftover | dir exists without SKILL.md | Still removed by name | unit | passed | Task 3.2 |
| TC-R1-D3-002 | R1 | N/A — no runtime user input | N/A | N/A | Remaining D3 classes (SQL/XSS/over-length) do not apply to YAML descriptions | unit | not applicable | YAML descriptions have no SQL/XSS/over-length runtime input |

### D4 — State transitions and timing

| ID | Object | State / Timing Scenario | Legal? | Operation Sequence | Expected | Form | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TC-R3-D4-001 | R3 | hook emit → agent session start | yes | run session-start; parse JSON | additional_context present; no SKILL body | unit | passed | Task 1.3 |
| TC-R6-D4-001 | R6 | first Apply edit → later Hardening | yes | root loaded first; Hardening file unread until stage | Index does not include Hardening recipe | unit | passed | Task 2.3 |
| TC-R8-D4-001 | R8 | init then update with leftover retired dirs | yes | plant VBC/SDD/when-to-dispatch dirs; run update | All three gone (I4) | unit | passed | Task 3.2 / 4.1 |
| TC-R6-D4-002 | R6 | generate SKILL.md then write references | yes | init order | reference files survive SKILL.md write (not overwritten empty) | unit | passed | Task 2.2 |
| TC-R12-D4-001 | R12 | compile fail during Apply task | yes | fail → fix → recheck | Instructions say continue; no wait-for-guidance | unit | passed | Task 3.3 |

### D5 — Non-functional and fault tolerance

| ID | Object | Quality Attribute | Scenario | Pass Criteria | Form | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| TC-R10-D5-001 | R10 | compatibility / no Astra ruleset | AGENTS.md and using-superpowers scanned | No GPT6-guide MUST (I5) | unit | passed | Task 3.2 / existing slim pin |
| TC-R6-D5-001 | R6 | compatibility | Windows path separators | Node APIs use `path.join` only for companion paths | unit | passed | Task 2.2 |
| TC-R5-D5-001 | R5 | performance / context size | Apply root vs pre-change dump | Root omits remediations list (proxy for dump removal) | unit | passed | I2 |
| TC-R8-D5-001 | R8 | compatibility | already-configured Cursor skills dir | update removes retired skills without requiring full re-init | unit | passed | Task 4.1 update.test.ts |

### D6 — Environment and dependencies

| ID | Object | Dependency | Fault Injection | Expected Isolation / Compensation | Form | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| TC-R6-D6-001 | R6 | Apply `reference/final-quality-gates.md` | file absent | Gate `blocked`; not passed; recipe not inlined | unit | passed | Task 2.3 |
| TC-R3-D6-001 | R3 | `skills/using-superpowers/SKILL.md` | file unreadable | Hook still emits pointer; does not crash the session start JSON | unit | passed | Task 1.3 |
| TC-R8-D6-001 | R8 | bundled `skills/` tree | retired SKILL.md accidentally left in repo | init tests fail I4 | unit | passed | Task 4.1 |
| TC-R13-D6-001 | R13 | `fs.cp` of bundled skills | CREATION-LOG still in source | copied dest also has it → test fails | unit | passed | Task 3.4 |

## Dimension Coverage Summary

| Dimension | Must-check items | Status | Case IDs / Rationale |
| --- | --- | --- | --- |
| D1 Requirements and business scenarios | Imported spec Scenarios plus Hardening-bind gap | passed | R1–R14 imported + TC-R1-D1-004, TC-R6-D1-003 |
| D2 Code and branch coverage | Diff anchors for descriptions, concatenation, init write, guardrails | passed | TC-R*-D2-* |
| D3 Data and input space | JSON escape, path.join, empty description, obsolete dir leftover; XSS/SQL N/A | passed | TC-R1-D3-001/002, TC-R3-D3-001, TC-R6-D3-001, TC-R8-D3-001 |
| D4 State transitions and timing | Hook emit, Hardening-after-implement, init-then-update | passed | TC-R3-D4-001, TC-R6-D4-001/002, TC-R8-D4-001, TC-R12-D4-001 |
| D5 Non-functional and fault tolerance | No GPT6 ruleset, Windows paths, update compatibility | passed | TC-R10-D5-001, TC-R6-D5-001, TC-R5-D5-001, TC-R8-D5-001 |
| D6 Environment and dependencies | Missing companion, unreadable SKILL.md, leftover retired files | passed | TC-R6-D6-001, TC-R3-D6-001, TC-R8-D6-001, TC-R13-D6-001 |

## Mutation Testing

Status: passed. Lightweight production mutants (no Stryker in repo) against Apply missing-companion interpolation, `OBSOLETE_BUNDLED_SKILL_DIRS` membership, and Apply-root remediations field-list injection. 3/3 killed by `stage-file-disclosure` / `instruction-ownership-collapse`; sources restored afterward.

| Mutant | Target | Killing test | Result |
| --- | --- | --- | --- |
| Drop `${MISSING_COMPANION_RULE}` from Apply index | `apply-change.ts` concatenation | `apply root names companions and blocks when one is missing` | killed |
| Remove `subagent-driven-development` from obsolete dirs | `obsolete-bundled-skills.ts` | `init removes verification-before-completion` | killed |
| Inject `≥2 meaningfully different Solutions` into Apply root | `apply-change.ts` index | `apply root omits remediations field list` | killed |

## Canonical suite-stage (Test Hardening)

- Canonical runner: `pnpm test` → `vitest run` (`package.json`). Visual-only checks excluded: none registered.
- Git-aware capability: `pnpm exec vitest --help` documents `--changed [since]`.
- Git baseline: merge-base with local `main` `86896e74eb3da43fcfad2603a6fd562353ac26bd` (this branch was cut from local main; `origin/main` `bd92646d1ecf5f35f7f87c0d17cb1a84e5ad2c33` is 10 commits behind local main).
- Command: `pnpm exec vitest run --changed main`
- Suite-stage state: `ran-git-aware`
- Result: 29 files / 401 tests passed.

Hardening added/strengthened: companion-blocked pins, SessionStart JSON parse, I7 procedure identity vs `main`, `path.join` companion dest, leftover retired-dir update, debug/worktrees retired-pointer sweep, and retarget of Apply/Verify recipe assertions onto companions (`apply-autonomy`, `final-quality-gates`, `invariants-remediations`, `change-review`, `skill-templates-parity`). 10→10→10: propose matrix already exhausted unique WHEN/THEN pairs per object×dimension at batch 1; Hardening did not invent duplicate padding. XSS/SQL/over-length remain N/A for instruction YAML (TC-R1-D3-002).

## Manual Coverage

| ID | Object | Requirement / Risk | Journey | Method | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| MC-R5-001 | R5 | Apply index is usable when invoked as a slash command | Read generated `sp-apply.md` and confirm it names `reference/test-hardening.md` rather than pasting FQG | file-inspect | passed | `.cursor/commands/sp-apply.md` names all four `reference/*.md` companions and the missing-file `blocked` rule; root has no `≥2 meaningfully different Solutions`; Hardening recipe lives in `.cursor/skills/superpowers-apply-change/reference/test-hardening.md` |
| MC-R3-001 | R3 | SessionStart JSON still parses | Run `hooks/session-start` and parse stdout JSON | script | passed | `bash hooks/session-start` → JSON with `additional_context` + `hookSpecificOutput.hookEventName=SessionStart`; context names `using-superpowers` and omits `Select one of exactly two work modes` |

Method note: this change has no runnable UI. Manual rows are command-output and file inspections, not browser journeys. No `agent-browser` rows.

Method note: this change has no runnable UI. Manual rows are command-output and file inspections, not browser journeys.

## Deferred Coverage

| Item | Reason | Safer follow-up |
| --- | --- | --- |
| Audit D (Step 1–5 slots, Explore one-question, Propose derived MUST, worktrees Step 4 complete-suite baseline vs Git-aware DM/Hardening) | Explicitly out of this Proposal | Later change |
| `full-qa-test` 10→10→10 procedure rewrite | User-locked / I7 | None |
| `.cursor/skills/full-qa-test/SKILL.md` sync | Non-goal | Later init/update of that copy |
| Live agent run of `/sp:apply` on a sample change | Requires a full Apply session | Test Hardening if a fixture change is used |

## Final Quality Gates

Wave-1 pre-Verify ran in parallel (`fresh-worker`): code review ∥ Simplify ∥ Design verify, then Verify. CR P1/P2 repaired in-coordinator (RM-1, RM-2) without a CR retry (no P0). Simplify changed implementation; DV not re-run (no UI-owned paths). Verify rounds 1–2 each had an accepted P1 (RM-3, RM-4); round 3 found none.

| Gate | Outcome | Fresh worker evidence |
| --- | --- | --- |
| code review | passed | Wave-1 / CR round 1, review mode `fresh-worker`, worker [Name](bfd28ef8-5931-41e0-96ad-9ff25a27cb5f). No P0. Accepted P1 RM-1: OpenCode companions now run `transformInstructions`. Accepted P2 RM-2: dest-only host-map/debug debris removed after copy; schema-and-workload self-link fixed. Files: apply/propose/verify templates, skill-generation, init/update, hooks, skills, Cursor projections. Implementation unchanged by the reviewer. |
| `/sp:simplify` | passed | Wave-1 one pass, `fresh-worker`, single-pass fallback, worker [Name](246aa6d7-bd01-4fb0-ab6b-916ff3d49d9e). Extracted `writeGeneratedSkills` / `removeObsoleteBundledSkillDirs`; parallel companion writes; dropped dynamic import in stage-file-disclosure. Verification: focused init/update/disclosure/ownership 140 tests passed. Implementation changed; UI-owned paths: no. |
| `/sp:design-verify` | not applicable | Wave-1 / DV round 1, `fresh-worker`, worker [Name](9a116f29-b2d4-4752-8a4f-d9a81e5d714a). Scope: instruction/CLI/templates/hooks/tests/archive only; zero owned `.html/.css/.jsx/.tsx` (etc.) paths; no repo-root visual DESIGN.md; change-local `design.md` is not a visual source. Before summary: not applicable. No runtime/browser. Implementation unchanged. |
| `/sp:verify` | passed | Round 3, `fresh-worker`, worker [Name](05a4ea10-afbb-4509-804f-580f1da77bce). Git-aware **re-run** (not reused): `pnpm exec vitest run --changed main`, baseline local `main` `86896e74eb3da43fcfad2603a6fd562353ac26bd`, suite-stage `ran-git-aware`, 29 files / 407 tests passed. MC-R5-001 and MC-R3-001 passed. P0 none. Round-1 P1 RM-3 (commands-only companions) and round-2 P1 RM-4 (commands-only drift) repaired before this round. I1–I8 hold. Implementation unchanged by the reviewer. |
