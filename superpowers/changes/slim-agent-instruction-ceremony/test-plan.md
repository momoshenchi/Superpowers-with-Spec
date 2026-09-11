## Testing Gap Analysis

Worker tests in `execution-plan.md` pin individual strings (`before any response`, `Ask one decision question`, complete-suite fail-closed, spawn-blocked). They do not prove: (1) Hardening still invokes `full-qa-test` after those string edits; (2) Git-aware-unavailable does not resurrect complete-suite as a pass; (3) archive still confirms on failed gates after auto-select is allowed; (4) `GPT6-guide.md` stays out of always-on files; (5) `.cursor/skills/full-qa-test/SKILL.md` is not edited.

Gaps to close in Hardening:

- R19 / D1: `full-qa-test` bind survives Apply prose edits
- R21 / D2: `getCanonicalNonVisualSuiteInstructions` both Git-aware-present and Git-aware-absent branches
- R17 / D2: spawn-present vs spawn-absent gate wording
- R18 / D1: sole change vs two changes vs failed-gate archive
- R11 / D2: AGENTS.md and using-superpowers never require GPT6-guide
- R32 / D1: Apply remains the single Proposal-path code review
- R33 / D2: finishing-a-development-branch no longer requires a complete suite
- R34 / D2: Explore description no longer matches failing-test investigations
- R35 / D2: using-superpowers Direct Modification no longer fall-closes to a complete suite
- R36 / D2: debug does not require reading every line (including reference/)
- R37 / D2: Propose does not require a TodoWrite loop
- R38 / D1: worktrees default to `.worktrees/` without a location prompt
- R39 / D2: change-review does not count 10→10→10 as proposal completeness; I1 still holds

## Test Scope Register

| Object | Requirement | Spec Scenarios to import | Entry Point | Diff Anchor | Risk Hypothesis |
| --- | --- | --- | --- | --- | --- |
| R1 | `Requirement: Skills SHALL load only for the current task` | A matching skill is needed; Entry skill does not preload the library | `skills/using-superpowers/SKILL.md` description | `skills/using-superpowers/SKILL.md` | Router still says check every skill first |
| R2 | `Requirement: Root skills SHALL disclose detail on demand` | Apply root file stays an index; using-superpowers keeps mode selection in root | `skills/using-superpowers/SKILL.md` | same + `apply-change.ts` | Apply stays one 300-line dump |
| R3 | `Requirement: Agents SHALL persist until the requested outcome` | Authorized implementation continues | Apply task loop | `apply-change.ts` pause list | "should I continue" returns |
| R4 | `Requirement: Pause only for irreversible or product gaps` | A test failure from this change is repaired; Force push remains paused | Apply pause rules | `apply-change.ts` | Every error still waits |
| R5 | `Requirement: TDD SHALL cover observable automated behavior` | A behavior change uses red-green; A copy-only edit skips TDD | `skills/test-driven-development/SKILL.md` | TDD skill | Iron Law still always-on |
| R6 | `Requirement: Debugging SHALL skip four-phase gates when localized` | A typed assertion failure is fixed directly; An unknown flake still requires investigation | `skills/systematic-debugging/SKILL.md` | debug skill | Any test failure still four-phase |
| R7 | `Requirement: Verification SHALL use matching-stage evidence` | Task completion cites the focused command | `skills/verification-before-completion/SKILL.md` | verification skill | FULL command = complete suite |
| R8 | `Requirement: SDD SHALL not duplicate Apply` | Dispatch uses Apply completion rules | `skills/subagent-driven-development/SKILL.md` | SDD skill | Gates restated and five-file preload |
| R9 | `Requirement: Default installs SHALL omit writing-plans` | A new init does not copy writing-plans | `superpowers init` skill copy | `writing-plan/SKILL.md`, init helpers | Orphan SKILL.md still discovered |
| R10 | `Requirement: Project docs SHALL not list missing skills` | CLAUDE.md matches the skills directory | `CLAUDE.md` | `CLAUDE.md` | Stale skill bullet remains |
| R11 | `Requirement: No Astra-only agent ruleset` | GPT6-guide stays optional | `AGENTS.md`, `using-superpowers` | those files | Guide injected as MUST-read |
| R12 | `Requirement: Propose SHALL ask only unresolved high-impact decisions` | A clear create request has no interview; Open decisions may be batched | Propose skill | `propose.ts` | One-question-at-a-time remains |
| R13 | `Requirement: Explicit create requests authorize artifact writes` | User says create the proposal; Missing product information still pauses | Propose skill | `propose.ts` | Three-state widget still blocks writes |
| R14 | `Requirement: Propose SHALL not serialize reversible discovery` | Preflight runs before questions | Propose skill | `propose.ts` | Questions precede discovery |
| R15 | `Requirement: Apply SHALL load current-unit context` | First task reads its slice; Later stages still read their contracts | Apply skill | `apply-change.ts` | Always read all contextFiles |
| R16 | `Requirement: Apply SHALL continue reversible in-scope work` | Compile error from this task is fixed; Design contradiction still pauses | Apply skill | `apply-change.ts` | Wait for guidance on every error |
| R17 | `Requirement: Quality gates SHALL fall back without spawn` | Host can spawn gate workers; Host cannot spawn a worker | `getFinalQualityGateInstructions` | `final-quality-gates.ts` | Missing spawn = blocked |
| R18 | `Requirement: Change targeting SHALL auto-select when unambiguous` | Sole active change is used; Ambiguous names still prompt; Incomplete gates still block quiet archive | verify/archive/sync templates | those TS files | Auto-select also silences gate warnings |
| R19 | `Requirement: Hardening SHALL keep the full-qa-test binding` | Hardening invokes full-qa-test; Fallback still covers six dimensions | Apply Test Hardening | `apply-change.ts` | Bind accidentally deleted while slimming |
| R20 | `Requirement: Hardening and Verify SHALL run registered test-plan rows` | Hardening runs non-agent-browser manual rows; Verify runs deferred agent-browser rows | Apply/Verify Manual Coverage | apply + verify TS | Git-aware used as substitute for test-plan rows |
| R21 | `Requirement: Non-test-plan suite stage SHALL use Git-aware tests` | Git-aware runner selects related tests; Git-aware unavailable does not require complete suite | `getCanonicalNonVisualSuiteInstructions` | `final-quality-gates.ts` | Fail-closed complete suite remains |
| R22 | `Requirement: Task-level checks SHALL stay focused` | A dispatch-unit task uses focused tests | execution-plan Step 4 | `execution-plan.md` template + apply task loop | Per-task full matrix |
| R23 | `Requirement: Quick Reference Placement` | Loading templates at the top | `docs/workflows.md` | `docs/workflows.md` | Intro still pastes full templates |
| R24 | `Requirement: Embedded Templates and Examples` | Providing file templates | schema templates | `schemas/spec-driven/templates/` | Templates duplicated into docs |
| R25 | `Requirement: Pre-validation Checklist` | Highlighting common validation failures | `docs/workflows.md` / `CLAUDE.md` | those files | Checklist deleted instead of shortened |
| R26 | `Requirement: Progressive Disclosure of Workflow Guidance` | Organizing beginner and advanced sections | `docs/workflows.md` | `docs/workflows.md` | Docs keep full Apply recipe |
| R27 | `Requirement: Verify SHALL resolve the change without guessing` | Verify with change name provided; Verify infers a sole active change; Verify prompts when several changes match | `/sp:verify` | `verify-change.ts` | Still "always let the user choose" |
| R28 | `Requirement: Verify SHALL split test-plan rows from Git-aware tests` | Verify executes registered test-plan rows; Verify uses Git-aware tests outside test-plan | `/sp:verify` correctness | `verify-change.ts` | Complete suite still required to pass |
| R29 | `Requirement: Verify Skill Invocation` | Change has no tasks | `/sp:verify` | `verify-change.ts` | Empty tasks path regresses |
| R30 | `Requirement: Workers SHALL receive current-unit context` | First unit starts with a slice; Integration still sees the combined diff | SDD/Apply dispatch | SDD skill + apply | Five-artifact preload remains |
| R31 | `Requirement: Flexible work-package allocation` | Main agent executes all work packages; One subagent receives multiple work packages; Host cannot spawn subagents | SDD/Apply | `subagent-work-package-execution` + apply | Inline path marked blocked |
| R32 | `Requirement: Code-review dispatch SHALL not duplicate Apply` | Apply owns the integrated review; Direct work may still request review | `skills/when-to-dispatch-code-review/SKILL.md` | that skill | Second complete review around Apply |
| R33 | `Requirement: Branch finish SHALL not require a complete suite` | Tests are checked with Git-aware selection; Integration choices remain | `skills/finishing-a-development-branch/SKILL.md` | that skill | Complete `npm test` still required |
| R34 | `Requirement: Explore SHALL not own failure debugging` | A failing test uses debug not explore; Thinking through a feature uses explore | `explore.ts` + debug skill | those files | Explore description still "investigating problems" |
| R35 | `Requirement: Direct work SHALL not fall closed to a suite` | Direct edit uses Git-aware tests; Direct UI still exercises the journey | `skills/using-superpowers/SKILL.md` | that skill | Fall closed to complete suite remains |
| R36 | `Requirement: Debugging SHALL not require reading every line` | A named compiler error is fixed without a full read; Unknown-cause work may still compare examples | `skills/systematic-debugging/SKILL.md` | root + `reference/` | Sentence moved into reference instead of deleted |
| R37 | `Requirement: Propose SHALL not require a TodoWrite loop` | Authorized writes proceed without TodoWrite; Optional tracking does not block writes | `propose.ts` | that file | TodoWrite still a required step |
| R38 | `Requirement: Worktrees SHALL default without asking location` | Missing directory uses project-local default; Existing directory or docs still win | `skills/using-git-worktrees/SKILL.md` | that skill | Two-option prompt remains |
| R39 | `Requirement: Review SHALL not count 10-per-dimension batches` | A draft test-plan without a 10-batch still reviews; Hardening still owns 10→10→10 | `change-review.ts` | that file | Review still BLOCKS on unfinished 10→10→10 |

## Design Contract And Invariant Coverage

| Object | Contract / Invariant | Case IDs | Notes |
| --- | --- | --- | --- |
| R19 | I1 Hardening still requires full-qa-test | TC-R19-D1-001, TC-R19-D2-001 | |
| R21 | I2 Non-test-plan stage never requires complete suite | TC-R21-D1-001, TC-R21-D2-001, TC-R21-D2-002 | |
| R17 | I3 Missing spawn does not yield blocked | TC-R17-D1-002, TC-R17-D2-001 | |
| R1 | I4 using-superpowers does not preload skills | TC-R1-D1-002, TC-R1-D2-001 | |
| R11 | I5 No always-on Astra ruleset | TC-R11-D1-001, TC-R11-D2-001 | |
| R13 | I6 User-invented Choices remain forbidden | TC-R13-D1-002 | existing design-convention tests |
| R33 | I7 Finishing a branch does not require a complete suite | TC-R33-D1-001, TC-R33-D2-001 | |
| R35 | I8 Direct Modification does not fall closed to a complete suite | TC-R35-D1-001, TC-R35-D2-001 | |
| R39 | I9 Proposal review does not treat 10→10→10 as completeness | TC-R39-D1-001, TC-R39-D2-001 | I1 still on R19 |

## Requirement And Scenario Coverage Matrix

| Object | Requirement | Spec Scenario | D1 Case ID | Related Case IDs | Notes |
| --- | --- | --- | --- | --- | --- |
| R1 | Skills SHALL load only for the current task | A matching skill is needed | TC-R1-D1-001 | TC-R1-D2-001 | |
| R1 | Skills SHALL load only for the current task | Entry skill does not preload the library | TC-R1-D1-002 | TC-R1-D2-001 | |
| R2 | Root skills SHALL disclose detail on demand | Apply root file stays an index | TC-R2-D1-001 | TC-R2-D2-001 | |
| R2 | Root skills SHALL disclose detail on demand | using-superpowers keeps mode selection in root | TC-R2-D1-002 | | |
| R3 | Agents SHALL persist until the requested outcome | Authorized implementation continues | TC-R3-D1-001 | TC-R3-D2-001 | |
| R4 | Pause only for irreversible or product gaps | A test failure from this change is repaired | TC-R4-D1-001 | TC-R4-D2-001 | |
| R4 | Pause only for irreversible or product gaps | Force push remains paused | TC-R4-D1-002 | TC-R4-D5-001 | |
| R5 | TDD SHALL cover observable automated behavior | A behavior change uses red-green | TC-R5-D1-001 | | |
| R5 | TDD SHALL cover observable automated behavior | A copy-only edit skips TDD | TC-R5-D1-002 | TC-R5-D2-001 | |
| R6 | Debugging SHALL skip four-phase gates when localized | A typed assertion failure is fixed directly | TC-R6-D1-001 | TC-R6-D2-001 | |
| R6 | Debugging SHALL skip four-phase gates when localized | An unknown flake still requires investigation | TC-R6-D1-002 | | |
| R7 | Verification SHALL use matching-stage evidence | Task completion cites the focused command | TC-R7-D1-001 | TC-R7-D2-001 | |
| R8 | SDD SHALL not duplicate Apply | Dispatch uses Apply completion rules | TC-R8-D1-001 | TC-R8-D2-001 | |
| R9 | Default installs SHALL omit writing-plans | A new init does not copy writing-plans | TC-R9-D1-001 | TC-R9-D2-001 | |
| R10 | Project docs SHALL not list missing skills | CLAUDE.md matches the skills directory | TC-R10-D1-001 | TC-R10-D2-001 | |
| R11 | No Astra-only agent ruleset | GPT6-guide stays optional | TC-R11-D1-001 | TC-R11-D2-001 | |
| R12 | Propose SHALL ask only unresolved high-impact decisions | A clear create request has no interview | TC-R12-D1-001 | TC-R12-D2-001 | |
| R12 | Propose SHALL ask only unresolved high-impact decisions | Open decisions may be batched | TC-R12-D1-002 | | |
| R13 | Explicit create requests authorize artifact writes | User says create the proposal | TC-R13-D1-001 | TC-R13-D2-001 | |
| R13 | Explicit create requests authorize artifact writes | Missing product information still pauses | TC-R13-D1-002 | | |
| R14 | Propose SHALL not serialize reversible discovery | Preflight runs before questions | TC-R14-D1-001 | | |
| R15 | Apply SHALL load current-unit context | First task reads its slice | TC-R15-D1-001 | TC-R15-D2-001 | |
| R15 | Apply SHALL load current-unit context | Later stages still read their contracts | TC-R15-D1-002 | TC-R19-D1-001 | Hardening still reads test-plan |
| R16 | Apply SHALL continue reversible in-scope work | Compile error from this task is fixed | TC-R16-D1-001 | | |
| R16 | Apply SHALL continue reversible in-scope work | Design contradiction still pauses | TC-R16-D1-002 | | |
| R17 | Quality gates SHALL fall back without spawn | Host can spawn gate workers | TC-R17-D1-001 | | |
| R17 | Quality gates SHALL fall back without spawn | Host cannot spawn a worker | TC-R17-D1-002 | TC-R17-D2-001 | |
| R18 | Change targeting SHALL auto-select when unambiguous | Sole active change is used | TC-R18-D1-001 | TC-R18-D2-001 | |
| R18 | Change targeting SHALL auto-select when unambiguous | Ambiguous names still prompt | TC-R18-D1-002 | | |
| R18 | Change targeting SHALL auto-select when unambiguous | Incomplete gates still block quiet archive | TC-R18-D1-003 | TC-R18-D4-001 | |
| R19 | Hardening SHALL keep the full-qa-test binding | Hardening invokes full-qa-test | TC-R19-D1-001 | TC-R19-D2-001 | |
| R19 | Hardening SHALL keep the full-qa-test binding | Fallback still covers six dimensions | TC-R19-D1-002 | | |
| R20 | Hardening and Verify SHALL run registered test-plan rows | Hardening runs non-agent-browser manual rows | TC-R20-D1-001 | | |
| R20 | Hardening and Verify SHALL run registered test-plan rows | Verify runs deferred agent-browser rows | TC-R20-D1-002 | | |
| R21 | Non-test-plan suite stage SHALL use Git-aware tests | Git-aware runner selects related tests | TC-R21-D1-001 | TC-R21-D2-001 | |
| R21 | Non-test-plan suite stage SHALL use Git-aware tests | Git-aware unavailable does not require complete suite | TC-R21-D1-002 | TC-R21-D2-002 | |
| R22 | Task-level checks SHALL stay focused | A dispatch-unit task uses focused tests | TC-R22-D1-001 | | |
| R23 | Quick Reference Placement | Loading templates at the top | TC-R23-D1-001 | | |
| R24 | Embedded Templates and Examples | Providing file templates | TC-R24-D1-001 | | |
| R25 | Pre-validation Checklist | Highlighting common validation failures | TC-R25-D1-001 | | |
| R26 | Progressive Disclosure of Workflow Guidance | Organizing beginner and advanced sections | TC-R26-D1-001 | | |
| R27 | Verify SHALL resolve the change without guessing | Verify with change name provided | TC-R27-D1-001 | | |
| R27 | Verify SHALL resolve the change without guessing | Verify infers a sole active change | TC-R27-D1-002 | TC-R18-D1-001 | Shared targeting |
| R27 | Verify SHALL resolve the change without guessing | Verify prompts when several changes match | TC-R27-D1-003 | TC-R18-D1-002 | |
| R28 | Verify SHALL split test-plan rows from Git-aware tests | Verify executes registered test-plan rows | TC-R28-D1-001 | TC-R20-D1-002 | |
| R28 | Verify SHALL split test-plan rows from Git-aware tests | Verify uses Git-aware tests outside test-plan | TC-R28-D1-002 | TC-R21-D1-001 | |
| R29 | Verify Skill Invocation | Change has no tasks | TC-R29-D1-001 | | |
| R30 | Workers SHALL receive current-unit context | First unit starts with a slice | TC-R30-D1-001 | TC-R15-D1-001 | |
| R30 | Workers SHALL receive current-unit context | Integration still sees the combined diff | TC-R30-D1-002 | | |
| R31 | Flexible work-package allocation | Main agent executes all work packages | TC-R31-D1-001 | | |
| R31 | Flexible work-package allocation | One subagent receives multiple work packages | TC-R31-D1-002 | | |
| R31 | Flexible work-package allocation | Host cannot spawn subagents | TC-R31-D1-003 | TC-R17-D1-002 | |
| R32 | Code-review dispatch SHALL not duplicate Apply | Apply owns the integrated review | TC-R32-D1-001 | TC-R32-D2-001 | |
| R32 | Code-review dispatch SHALL not duplicate Apply | Direct work may still request review | TC-R32-D1-002 | | |
| R33 | Branch finish SHALL not require a complete suite | Tests are checked with Git-aware selection | TC-R33-D1-001 | TC-R33-D2-001 | I7 |
| R33 | Branch finish SHALL not require a complete suite | Integration choices remain | TC-R33-D1-002 | | |
| R34 | Explore SHALL not own failure debugging | A failing test uses debug not explore | TC-R34-D1-001 | TC-R34-D2-001 | |
| R34 | Explore SHALL not own failure debugging | Thinking through a feature uses explore | TC-R34-D1-002 | | |
| R35 | Direct work SHALL not fall closed to a suite | Direct edit uses Git-aware tests | TC-R35-D1-001 | TC-R35-D2-001 | I8 |
| R35 | Direct work SHALL not fall closed to a suite | Direct UI still exercises the journey | TC-R35-D1-002 | | |
| R36 | Debugging SHALL not require reading every line | A named compiler error is fixed without a full read | TC-R36-D1-001 | TC-R36-D2-001 | |
| R36 | Debugging SHALL not require reading every line | Unknown-cause work may still compare examples | TC-R36-D1-002 | | |
| R37 | Propose SHALL not require a TodoWrite loop | Authorized writes proceed without TodoWrite | TC-R37-D1-001 | TC-R37-D2-001 | |
| R37 | Propose SHALL not require a TodoWrite loop | Optional tracking does not block writes | TC-R37-D1-002 | | |
| R38 | Worktrees SHALL default without asking location | Missing directory uses project-local default | TC-R38-D1-001 | TC-R38-D2-001 | |
| R38 | Worktrees SHALL default without asking location | Existing directory or docs still win | TC-R38-D1-002 | | |
| R39 | Review SHALL not count 10-per-dimension batches | A draft test-plan without a 10-batch still reviews | TC-R39-D1-001 | TC-R39-D2-001 | I9 |
| R39 | Review SHALL not count 10-per-dimension batches | Hardening still owns 10→10→10 | TC-R39-D1-002 | TC-R19-D1-001 | I1 |

## Six-Dimension Case Matrix

10→10→10 stop: each object is instruction text. Unique WHEN/THEN pairs are the imported scenarios above. Batch 1 exhausted unique cases; no batch 2.

### D1 — Requirements and business scenarios

| ID | Object | Source | Scenario Type | Steps | Expected | Form | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TC-R1-D1-001 | R1 | imported: A matching skill is needed | happy path | Read Apply skill for `/sp:apply`; do not open security-review | Apply skill read; security-review unread | unit | planned | Task 1.1 test |
| TC-R1-D1-002 | R1 | imported: Entry skill does not preload the library | branch | Open using-superpowers | No "before any response" | unit | planned | Task 1.1 test |
| TC-R2-D1-001 | R2 | imported: Apply root file stays an index | happy path | Open Apply root | Opening names completion definition and which later section to read; FQG/MC may stay later in the same file | unit | planned | Task 2.2 |
| TC-R2-D1-002 | R2 | imported: using-superpowers keeps mode selection in root | happy path | Open using-superpowers | Direct + Proposal present; schema YAML absent from root | unit | planned | Task 1.1 |
| TC-R3-D1-001 | R3 | imported: Authorized implementation continues | happy path | Two pending Apply tasks | No continue prompt between them | unit | planned | Task 2.2 |
| TC-R4-D1-001 | R4 | imported: A test failure from this change is repaired | happy path | Task test fails from this edit | Repair + rerun, no wait | unit | planned | Task 2.2 |
| TC-R4-D1-002 | R4 | imported: Force push remains paused | exception | Next step is force push | Pause | unit | planned | Task 2.2 |
| TC-R5-D1-001 | R5 | imported: A behavior change uses red-green | happy path | New CLI flag | Failing test first | unit | planned | Task 1.2 |
| TC-R5-D1-002 | R5 | imported: A copy-only edit skips TDD | branch | Comment-only edit | No failing test required | unit | planned | Task 1.2 |
| TC-R6-D1-001 | R6 | imported: A typed assertion failure is fixed directly | happy path | Named assertion fail | Fix without four-phase MUST | unit | planned | Task 1.3 |
| TC-R6-D1-002 | R6 | imported: An unknown flake still requires investigation | branch | Intermittent fail, no cause | Investigate before patch | unit | planned | Task 1.3 |
| TC-R7-D1-001 | R7 | imported: Task completion cites the focused command | happy path | Claim task done | Same-turn focused test output | unit | planned | Task 1.4 |
| TC-R8-D1-001 | R8 | imported: Dispatch uses Apply completion rules | happy path | Read SDD | No gate restatement; points at Apply | unit | planned | Task 1.5 |
| TC-R9-D1-001 | R9 | imported: A new init does not copy writing-plans | happy path | Inspect default skill set | writing-plans absent | unit | planned | Task 1.6 |
| TC-R10-D1-001 | R10 | imported: CLAUDE.md matches the skills directory | happy path | Read CLAUDE.md | No dispatching-parallel-agents | unit | planned | Task 1.7 |
| TC-R11-D1-001 | R11 | imported: GPT6-guide stays optional | happy path | Read AGENTS.md and using-superpowers | No required GPT6-guide read | unit | planned | Task 1.7 |
| TC-R12-D1-001 | R12 | imported: A clear create request has no interview | happy path | Propose with complete request | Zero interview questions | unit | planned | Task 2.1 |
| TC-R12-D1-002 | R12 | imported: Open decisions may be batched | branch | Two high-impact forks | One message may contain both | unit | planned | Task 2.1 |
| TC-R13-D1-001 | R13 | imported: User says create the proposal | happy path | User asked to create | Artifacts written without three-state lock | unit | planned | Task 2.1 |
| TC-R13-D1-002 | R13 | imported: Missing product information still pauses | exception | Two acceptance scopes | Ask; no invented Choice | unit | planned | Task 2.1 |
| TC-R14-D1-001 | R14 | imported: Preflight runs before questions | happy path | Propose starts | Read-only discovery first | unit | planned | Task 2.1 |
| TC-R15-D1-001 | R15 | imported: First task reads its slice | happy path | Start unit 1 | execution-plan unit + cited spec; not full test-plan | unit | planned | Task 2.2 |
| TC-R15-D1-002 | R15 | imported: Later stages still read their contracts | branch | Hardening begins | test-plan + full-qa-test read | unit | planned | Task 2.2 |
| TC-R16-D1-001 | R16 | imported: Compile error from this task is fixed | happy path | tsc fails on edited file | Fix without wait | unit | planned | Task 2.2 |
| TC-R16-D1-002 | R16 | imported: Design contradiction still pauses | exception | Design cannot be met | Pause for artifact update | unit | planned | Task 2.2 |
| TC-R17-D1-001 | R17 | imported: Host can spawn gate workers | happy path | Spawn available | Four distinct workers in order | unit | planned | Task 2.3 |
| TC-R17-D1-002 | R17 | imported: Host cannot spawn a worker | branch | No spawn | same-context fallback; not blocked | unit | planned | Task 2.3 |
| TC-R18-D1-001 | R18 | imported: Sole active change is used | happy path | `/sp:verify` no name, one change | Verifies that change | unit | planned | Task 3.1 |
| TC-R18-D1-002 | R18 | imported: Ambiguous names still prompt | branch | Two active changes | Prompt; no guess | unit | planned | Task 3.1 |
| TC-R18-D1-003 | R18 | imported: Incomplete gates still block quiet archive | exception | Archive + failed gates | Warn + confirm | unit | planned | Task 3.1 |
| TC-R19-D1-001 | R19 | imported: Hardening invokes full-qa-test | happy path | Apply Hardening text | Contains full-qa-test invoke | unit | planned | Task 2.2 I1 |
| TC-R19-D1-002 | R19 | imported: Fallback still covers six dimensions | branch | Skill missing | 10→10→10 fallback remains | unit | planned | Task 2.2 |
| TC-R20-D1-001 | R20 | imported: Hardening runs non-agent-browser manual rows | happy path | Manual Coverage programmatic-browser | Execute in Hardening | unit | planned | existing Manual Coverage instructions |
| TC-R20-D1-002 | R20 | imported: Verify runs deferred agent-browser rows | happy path | Deferred agent-browser | Execute in Verify | unit | planned | verify template |
| TC-R21-D1-001 | R21 | imported: Git-aware runner selects related tests | happy path | Runner supports --changed | Related-test command recorded | unit | planned | Task 2.3 |
| TC-R21-D1-002 | R21 | imported: Git-aware unavailable does not require complete suite | exception | No Git-aware | Limitation recorded; complete suite not required | unit | planned | Task 2.3 I2 |
| TC-R22-D1-001 | R22 | imported: A dispatch-unit task uses focused tests | happy path | Task Step 4 | Focused + Git-aware; no full matrix | unit | planned | Task 2.2 |
| TC-R23-D1-001 | R23 | imported: Loading templates at the top | happy path | docs-agent-instructions delta | Links not full templates | unit | planned | spec file |
| TC-R24-D1-001 | R24 | imported: Providing file templates | happy path | schema templates remain source | AGENTS.md not required to embed fences | unit | planned | spec file |
| TC-R25-D1-001 | R25 | imported: Highlighting common validation failures | happy path | Checklist MAY exist | `#### Scenario:` reminder kept | unit | planned | spec file |
| TC-R26-D1-001 | R26 | imported: Organizing beginner and advanced sections | happy path | docs/workflows.md | No full Apply recipe dump | unit | planned | Task 3.3 |
| TC-R27-D1-001 | R27 | imported: Verify with change name provided | happy path | `/sp:verify foo` | Uses foo | unit | planned | Task 3.1 |
| TC-R27-D1-002 | R27 | imported: Verify infers a sole active change | happy path | same as R18 sole | Same expected | unit | planned | Task 3.1 |
| TC-R27-D1-003 | R27 | imported: Verify prompts when several changes match | branch | same as R18 ambiguous | Prompt | unit | planned | Task 3.1 |
| TC-R28-D1-001 | R28 | imported: Verify executes registered test-plan rows | happy path | Verify correctness | test-plan rows run | unit | planned | Task 3.1 |
| TC-R28-D1-002 | R28 | imported: Verify uses Git-aware tests outside test-plan | happy path | Verify suite stage | Git-aware, not complete suite | unit | planned | Task 2.3 |
| TC-R29-D1-001 | R29 | imported: Change has no tasks | exception | Empty tasks.md | "No tasks to verify" | unit | planned | verify template |
| TC-R30-D1-001 | R30 | imported: First unit starts with a slice | happy path | First dispatch | Unit package only | unit | planned | Task 1.5 |
| TC-R30-D1-002 | R30 | imported: Integration still sees the combined diff | happy path | All units done | Integrated review + gates | unit | planned | Apply |
| TC-R31-D1-001 | R31 | imported: Main agent executes all work packages | happy path | No subagents | Inline valid | unit | planned | Task 1.5 |
| TC-R31-D1-002 | R31 | imported: One subagent receives multiple work packages | happy path | Two compatible units | Combined assignment allowed | unit | planned | existing SDD |
| TC-R31-D1-003 | R31 | imported: Host cannot spawn subagents | branch | No spawn | Inline; not blocked | unit | planned | Task 2.3 |
| TC-R32-D1-001 | R32 | imported: Apply owns the integrated review | happy path | `/sp:apply` Proposal path | Apply gate is the review; no extra complete review | unit | planned | Task 1.9 |
| TC-R32-D1-002 | R32 | imported: Direct work may still request review | branch | Direct Modification + user asks review | Dispatch allowed | unit | planned | Task 1.9 |
| TC-R33-D1-001 | R33 | imported: Tests are checked with Git-aware selection | happy path | finishing-a-development-branch Step 1 | Git-aware; no complete npm test | unit | planned | Task 1.10 I7 |
| TC-R33-D1-002 | R33 | imported: Integration choices remain | happy path | verification passed | merge / PR / keep / discard still offered | unit | planned | Task 1.10 |
| TC-R34-D1-001 | R34 | imported: A failing test uses debug not explore | happy path | unit test fails | debug or direct fix; Explore not entered | unit | planned | Task 1.11 |
| TC-R34-D1-002 | R34 | imported: Thinking through a feature uses explore | happy path | user asks to think through approaches | Explore; no production implementation | unit | planned | Task 1.11 |
| TC-R35-D1-001 | R35 | imported: Direct edit uses Git-aware tests | happy path | Direct Modification automated tests | Git-aware; no fall closed to complete suite | unit | planned | Task 1.1 I8 |
| TC-R35-D1-002 | R35 | imported: Direct UI still exercises the journey | branch | Direct UI path change | Journey + visual rules; not Apply lifecycle | unit | planned | Task 1.1 |
| TC-R36-D1-001 | R36 | imported: A named compiler error is fixed without a full read | happy path | compiler names file and type | Fix without complete reference read | unit | planned | Task 1.3 |
| TC-R36-D1-002 | R36 | imported: Unknown-cause work may still compare examples | branch | unknown cause + similar path | Compare differing slices; no every-line MUST | unit | planned | Task 1.3 |
| TC-R37-D1-001 | R37 | imported: Authorized writes proceed without TodoWrite | happy path | user asked to create | Artifacts written; TodoWrite not required | unit | planned | Task 2.1 |
| TC-R37-D1-002 | R37 | imported: Optional tracking does not block writes | branch | host has todo tool | Optional; missing TodoWrite does not stop | unit | planned | Task 2.1 |
| TC-R38-D1-001 | R38 | imported: Missing directory uses project-local default | happy path | no worktree dir, no docs path | `.worktrees/` + gitignore; no prompt | unit | planned | Task 1.12 |
| TC-R38-D1-002 | R38 | imported: Existing directory or docs still win | branch | `.worktrees/` exists | Use it after gitignore check | unit | planned | Task 1.12 |
| TC-R39-D1-001 | R39 | imported: A draft test-plan without a 10-batch still reviews | happy path | test-plan has register, no 10-batch | Completeness does not fail for missing batches | unit | planned | Task 3.4 I9 |
| TC-R39-D1-002 | R39 | imported: Hardening still owns 10→10→10 | exception | Apply Hardening | full-qa-test / fallback remains | unit | planned | Task 2.2 I1 |

### D2 — Code and branch coverage

| ID | Object | Code Anchor | Coverage Type | Trigger Input | Expected | Form | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TC-R1-D2-001 | R1 | `using-superpowers/SKILL.md` description | diff line | description field | No `starting any conversation` | unit | planned | Task 1.1 |
| TC-R2-D2-001 | R2 | `apply-change.ts` Apply opening vs later sections | branch | generated Apply skill | Opening is an index; FQG/MC may remain later in the same generated file | unit | planned | Task 2.2 |
| TC-R3-D2-001 | R3 | `apply-change.ts` pause list | branch false | no blocker | Continuous task loop | unit | planned | Task 2.2 |
| TC-R4-D2-001 | R4 | `apply-change.ts` "wait for guidance" | diff line | error path | Reversible in-scope not wait | unit | planned | Task 2.2 |
| TC-R5-D2-001 | R5 | TDD `description:` | diff line | frontmatter | Not `any feature or bugfix` | unit | planned | Task 1.2 |
| TC-R6-D2-001 | R6 | debug `You MUST complete each phase` | diff line | root skill | Not universal MUST | unit | planned | Task 1.3 |
| TC-R7-D2-001 | R7 | verification `FULL command` | diff line | Tests pattern | Matching-stage wording | unit | planned | Task 1.4 |
| TC-R8-D2-001 | R8 | SDD Setup read-once | diff line | Setup section | Line removed | unit | planned | Task 1.5 |
| TC-R9-D2-001 | R9 | `writing-plan/SKILL.md` discovery | diff line | init copy list / file moved | Not installed | unit | planned | Task 1.6 |
| TC-R10-D2-001 | R10 | `CLAUDE.md` Skills list | diff line | file text | Bullet gone | unit | planned | Task 1.7 |
| TC-R11-D2-001 | R11 | `AGENTS.md` + using-superpowers | diff line | both files | No GPT6-guide MUST | unit | planned | Task 1.7 I5 |
| TC-R12-D2-001 | R12 | `PROPOSE_INTERVIEW_GUIDANCE` | diff line | propose.ts | No one-at-a-time | unit | planned | Task 2.1 |
| TC-R13-D2-001 | R13 | three-state gate paragraph | branch | user already asked to create | Writes allowed | unit | planned | Task 2.1 |
| TC-R15-D2-001 | R15 | Apply "Always read context files" | diff line | apply-change.ts | Slice wording | unit | planned | Task 2.2 |
| TC-R17-D2-001 | R17 | `If the host cannot launch a subagent` | branch true | no spawn | fallback not blocked | unit | planned | Task 2.3 I3 |
| TC-R18-D2-001 | R18 | `Do NOT guess or auto-select` | diff line | verify/archive/sync | Phrase gone; sole-change rule present | unit | planned | Task 3.1 |
| TC-R19-D2-001 | R19 | Apply Hardening `full-qa-test` invoke | diff line | apply-change.ts | String remains | unit | planned | Task 2.2 I1 |
| TC-R21-D2-001 | R21 | `getCanonicalNonVisualSuiteInstructions` Git-aware present | branch true | runner supports --changed | Related tests | unit | planned | Task 2.3 |
| TC-R21-D2-002 | R21 | same helper Git-aware absent | branch false | unsupported | No complete-suite fail-closed | unit | planned | Task 2.3 I2 |
| TC-R31-D2-001 | R31 | N/A — prose-only allocation | N/A | SDD skill | Covered by TC-R8-D2-001 / TC-R17-D2-001 | unit | planned | not applicable as extra symbol |
| TC-R32-D2-001 | R32 | `when-to-dispatch-code-review/SKILL.md` Proposal section | diff line | skill text | Single integrated gate; no Apply retry recipe | unit | planned | Task 1.9 |
| TC-R33-D2-001 | R33 | finishing-a-development-branch Step 1 fence | diff line | `npm test / cargo test` | Phrase gone; Git-aware present | unit | planned | Task 1.10 I7 |
| TC-R34-D2-001 | R34 | `getExploreSkillTemplate().description` | diff line | description | No `investigating problems` | unit | planned | Task 1.11 |
| TC-R35-D2-001 | R35 | `using-superpowers/SKILL.md` Direct Modification | diff line | `fall closed to the complete suite` | Phrase gone | unit | planned | Task 1.1 I8 |
| TC-R36-D2-001 | R36 | debug root + `reference/` | diff line | `read every line` | Phrase gone from skill tree | unit | planned | Task 1.3 |
| TC-R37-D2-001 | R37 | `propose.ts` TodoWrite sentence | diff line | Use the TodoWrite tool | Required loop gone | unit | planned | Task 2.1 |
| TC-R38-D2-001 | R38 | worktrees Ask User block | diff line | `Where should I create worktrees` | Prompt gone; `.worktrees/` default | unit | planned | Task 1.12 |
| TC-R39-D2-001 | R39 | change-review test-plan Must include | diff line | `10→10→10 run once per Requirement` | Phrase gone; Apply still has full-qa-test | unit | planned | Task 3.4 I9 |

Objects R14, R16, R20, R22–R30 without unique symbols: D2 N/A — behavior is the D1 string/contract; no extra branch. Stop reason: unique anchors exhausted in batch 1.

### D3 — Data and input space

Instruction files are not parameterized APIs. Unique inputs are change-name strings and "no name".

| ID | Object | Parameter | Class | Sample Input | Expected | Form | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TC-R18-D3-001 | R18 | change name | empty | `` (omitted) + 1 active | Auto-select | unit | planned | Task 3.1 |
| TC-R18-D3-002 | R18 | change name | empty | `` + 2 active | Prompt | unit | planned | Task 3.1 |
| TC-R27-D3-001 | R27 | change name | valid | `slim-agent-instruction-ceremony` | Use that name | unit | planned | Task 3.1 |
| TC-R29-D3-001 | R29 | tasks.md | empty | no checkboxes | No tasks to verify | unit | planned | verify template |

All other objects: D3 `not applicable` — no extra input classes beyond imported scenarios. Stop: unique parameters exhausted.

### D4 — State transitions and timing

| ID | Object | State / Timing Scenario | Legal? | Operation Sequence | Expected | Form | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TC-R13-D4-001 | R13 | request-create -> write artifacts | yes | user asks to create → summary → write | No extra confirm state required | unit | planned | Task 2.1 |
| TC-R15-D4-001 | R15 | implement -> hardening | yes | tasks done → read test-plan | Hardening not skipped | unit | planned | Task 2.2 |
| TC-R17-D4-001 | R17 | code review -> simplify -> verify -> design-verify | yes | spawn available | Order unchanged | unit | planned | Task 2.3 |
| TC-R18-D4-001 | R18 | verify auto-select -> archive failed gates | no silent archive | auto-select then archive with failed gates | Warn + confirm | unit | planned | Task 3.1 |
| TC-R3-D4-001 | R3 | task N complete -> task N+1 | yes | mark checkbox → next task | No continue question | unit | planned | Task 2.2 |

Other objects: D4 `not applicable` — no runtime state machine. Stop: unique transitions exhausted.

### D5 — Non-functional and fault tolerance

| ID | Object | Quality Attribute | Scenario | Pass Criteria | Form | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| TC-R4-D5-001 | R4 | safety | force push / history rewrite | Must pause | unit | planned | Task 2.2 |
| TC-R11-D5-001 | R11 | compatibility | stronger instruction-following models | No extra Astra ruleset | unit | planned | Task 1.7 |
| TC-R17-D5-001 | R17 | resilience | host spawn missing | Gate still runs via fallback | unit | planned | Task 2.3 |
| TC-R21-D5-001 | R21 | performance | complete-suite temptation | Git-aware or recorded skip, not full suite | unit | planned | Task 2.3 |

Other objects: D5 `not applicable` — no authz/SLO surface. Stop: unique attributes exhausted.

### D6 — Environment and dependencies

| ID | Object | Dependency | Fault Injection | Expected Isolation / Compensation | Form | Status | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| TC-R17-D6-001 | R17 | host subagent spawn | spawn API absent | same-context fallback labeled | unit | planned | Task 2.3 |
| TC-R21-D6-001 | R21 | test runner Git-aware flags | flags unsupported | record limitation; test-plan rows still run | unit | planned | Task 2.3 |
| TC-R19-D6-001 | R19 | full-qa-test skill file | skill absent | six-dimension fallback still in Apply | unit | planned | Task 2.2 |

Other objects: D6 `not applicable` — no network/DB. Stop: unique dependencies exhausted.

## Dimension Coverage Summary

| Dimension | Must-check items | Status | Case IDs / Rationale |
| --- | --- | --- | --- |
| D1 Requirements and business scenarios | Imported spec Scenarios | planned | All imported scenarios have TC-R*-D1-* IDs. 10→10→10 batch 1 exhausted unique cases. |
| D2 Code and branch coverage | Diff anchors on skills/templates | planned | Unique file:symbol rows listed; remaining objects N/A as D1-only prose. Mutation deferred. |
| D3 Data and input space | Change-name empty/valid | planned | R18/R27/R29 only; others N/A no parameters |
| D4 State transitions and timing | Propose write auth, Apply stages, gate order, archive warning | planned | TC-R13-D4-001, TC-R15-D4-001, TC-R17-D4-001, TC-R18-D4-001, TC-R3-D4-001 |
| D5 Non-functional and fault tolerance | Irreversible git, no Astra ruleset, spawn fallback, no complete suite | planned | TC-R4-D5-001, TC-R11-D5-001, TC-R17-D5-001, TC-R21-D5-001 |
| D6 Environment and dependencies | Spawn missing, Git-aware missing, full-qa-test missing | planned | TC-R17-D6-001, TC-R21-D6-001, TC-R19-D6-001 |

### Requirement × Dimension Coverage

| Object | D1 | D2 | D3 | D4 | D5 | D6 |
| --- | --- | --- | --- | --- | --- | --- |
| R1 | TC-R1-D1-001/002 | TC-R1-D2-001 | N/A no params | N/A | N/A | N/A |
| R2 | TC-R2-D1-001/002 | TC-R2-D2-001 | N/A | N/A | N/A | N/A |
| R3 | TC-R3-D1-001 | TC-R3-D2-001 | N/A | TC-R3-D4-001 | N/A | N/A |
| R4 | TC-R4-D1-001/002 | TC-R4-D2-001 | N/A | N/A | TC-R4-D5-001 | N/A |
| R5 | TC-R5-D1-001/002 | TC-R5-D2-001 | N/A | N/A | N/A | N/A |
| R6 | TC-R6-D1-001/002 | TC-R6-D2-001 | N/A | N/A | N/A | N/A |
| R7 | TC-R7-D1-001 | TC-R7-D2-001 | N/A | N/A | N/A | N/A |
| R8 | TC-R8-D1-001 | TC-R8-D2-001 | N/A | N/A | N/A | N/A |
| R9 | TC-R9-D1-001 | TC-R9-D2-001 | N/A | N/A | N/A | N/A |
| R10 | TC-R10-D1-001 | TC-R10-D2-001 | N/A | N/A | N/A | N/A |
| R11 | TC-R11-D1-001 | TC-R11-D2-001 | N/A | N/A | TC-R11-D5-001 | N/A |
| R12 | TC-R12-D1-001/002 | TC-R12-D2-001 | N/A | N/A | N/A | N/A |
| R13 | TC-R13-D1-001/002 | TC-R13-D2-001 | N/A | TC-R13-D4-001 | N/A | N/A |
| R14 | TC-R14-D1-001 | N/A same as R12 prose | N/A | N/A | N/A | N/A |
| R15 | TC-R15-D1-001/002 | TC-R15-D2-001 | N/A | TC-R15-D4-001 | N/A | N/A |
| R16 | TC-R16-D1-001/002 | N/A same Apply pause | N/A | N/A | N/A | N/A |
| R17 | TC-R17-D1-001/002 | TC-R17-D2-001 | N/A | TC-R17-D4-001 | TC-R17-D5-001 | TC-R17-D6-001 |
| R18 | TC-R18-D1-001/002/003 | TC-R18-D2-001 | TC-R18-D3-001/002 | TC-R18-D4-001 | N/A | N/A |
| R19 | TC-R19-D1-001/002 | TC-R19-D2-001 | N/A | N/A | N/A | TC-R19-D6-001 |
| R20 | TC-R20-D1-001/002 | N/A existing coverage helper | N/A | N/A | N/A | N/A |
| R21 | TC-R21-D1-001/002 | TC-R21-D2-001/002 | N/A | N/A | TC-R21-D5-001 | TC-R21-D6-001 |
| R22 | TC-R22-D1-001 | N/A apply task loop | N/A | N/A | N/A | N/A |
| R23 | TC-R23-D1-001 | N/A spec-only | N/A | N/A | N/A | N/A |
| R24 | TC-R24-D1-001 | N/A spec-only | N/A | N/A | N/A | N/A |
| R25 | TC-R25-D1-001 | N/A spec-only | N/A | N/A | N/A | N/A |
| R26 | TC-R26-D1-001 | N/A docs | N/A | N/A | N/A | N/A |
| R27 | TC-R27-D1-001/002/003 | N/A shared R18 | TC-R27-D3-001 | N/A | N/A | N/A |
| R28 | TC-R28-D1-001/002 | N/A shared R20/R21 | N/A | N/A | N/A | N/A |
| R29 | TC-R29-D1-001 | N/A | TC-R29-D3-001 | N/A | N/A | N/A |
| R30 | TC-R30-D1-001/002 | N/A shared R15 | N/A | N/A | N/A | N/A |
| R31 | TC-R31-D1-001/002/003 | TC-R31-D2-001 | N/A | N/A | N/A | N/A |
| R32 | TC-R32-D1-001/002 | TC-R32-D2-001 | N/A | N/A | N/A | N/A |
| R33 | TC-R33-D1-001/002 | TC-R33-D2-001 | N/A | N/A | N/A | N/A |
| R34 | TC-R34-D1-001/002 | TC-R34-D2-001 | N/A | N/A | N/A | N/A |
| R35 | TC-R35-D1-001/002 | TC-R35-D2-001 | N/A | N/A | N/A | N/A |
| R36 | TC-R36-D1-001/002 | TC-R36-D2-001 | N/A | N/A | N/A | N/A |
| R37 | TC-R37-D1-001/002 | TC-R37-D2-001 | N/A | N/A | N/A | N/A |
| R38 | TC-R38-D1-001/002 | TC-R38-D2-001 | N/A | N/A | N/A | N/A |
| R39 | TC-R39-D1-001/002 | TC-R39-D2-001 | N/A | N/A | N/A | N/A |

## Mutation Testing

| Scope | Mutation Score | Surviving Mutants | Follow-Up Case IDs / Equivalence Rationale |
| --- | --- | --- | --- |
| deferred — instruction-string change; no production runtime to mutate until unit pins exist and are green | n/A | n/A | Defer to Hardening after Task 4.1 pins are executable. Target `final-quality-gates.ts` helpers if a mutator is available. |

## Manual Coverage

| ID | Check / Scenario | Execution Method and Environment | Status | Evidence |
| --- | --- | --- | --- | --- |
| MC-R12-001 | Author reads generated Propose skill after TS edit and confirms batched questions + create-authorizes-write | cli; open generated skill file | planned | file excerpt |
| MC-R15-001 | Author reads generated Apply skill and confirms current-unit loading + full-qa-test Hardening bind | cli | planned | file excerpt |
| MC-R17-001 | Author reads Final Quality Gates text for same-context fallback label | cli | planned | file excerpt |

No UI Critical Path. `agent-browser` not applicable.

## Deferred Coverage

| Gap | Reason Deferred | Safer Alternative / Follow-Up |
| --- | --- | --- |
| Live multi-host spawn vs fallback E2E | Requires Cursor and a spawn-less host | Unit string pins + MC-R17-001 |
| Mutation of `final-quality-gates.ts` | No green unit suite yet | Hardening after Task 4.1 |
| Syncing `.cursor/skills/full-qa-test/SKILL.md` | User excluded this file | `skills/full-qa-test/SKILL.md` remains source |

## Final Quality Gates

| Gate | Outcome | Fresh worker evidence |
| --- | --- | --- |
| code review | planned | |
| `/sp:simplify` | planned | |
| `/sp:verify` | planned | |
| `/sp:design-verify` | planned | Non-UI instruction change; expect `not applicable` with scope evidence |
