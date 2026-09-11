## ADDED Requirements

### Requirement: Skills SHALL load only for the current task
Agent-facing Superpowers skills SHALL instruct the agent to read a skill when the current task matches that skill's description or the user explicitly requests it. They SHALL NOT require checking or reading skills before every reply, clarification, or repository inspection.

#### Scenario: A matching skill is needed
- **WHEN** the user asks to implement a Superpowers change
- **THEN** the agent SHALL read the Apply skill (or the host equivalent) before implementing tasks
- **AND** it SHALL NOT first read unrelated skills such as security-review or writing-skills

#### Scenario: Entry skill does not preload the library
- **WHEN** a conversation starts without a Superpowers workflow request
- **THEN** `using-superpowers` SHALL NOT require the agent to inspect every installed skill before answering
- **AND** the agent MAY answer or inspect the repository using only the files the current question needs

### Requirement: Root skills SHALL disclose detail on demand
A root `SKILL.md` SHALL state when to use the skill, when not to use it, and which referenced file to read for the current stage. Stage recipes, schema dumps, and long matrices SHALL live in referenced files, not in the root file that always loads.

#### Scenario: Apply root file stays an index
- **WHEN** the agent opens the Apply skill to start implementation
- **THEN** the opening of that file SHALL identify the completion definition and which later section to read for the current stage
- **AND** Final Quality Gates, Manual Coverage, and shape-review MAY remain later in the same generated file
- **AND** the agent SHALL NOT treat those later sections as required reading before the matching stage

#### Scenario: using-superpowers keeps mode selection in root
- **WHEN** the agent needs to choose Direct Modification or Proposal → Review → Apply
- **THEN** the root `using-superpowers` skill SHALL contain that choice and the promotion rules
- **AND** schema YAML, artifact directory trees, and the six-dimension scoring table SHALL be referenced rather than required reading for every mode choice

### Requirement: Agents SHALL persist until the requested outcome
When the user asks to implement, fix, check, or continue work, agent instructions SHALL require the agent to keep going until that outcome is done or a pause condition in this capability applies. They SHALL NOT stop after a first draft or a natural phase solely to ask whether to continue.

#### Scenario: Authorized implementation continues
- **WHEN** the user has asked to implement remaining Apply tasks and the next task is clear
- **THEN** the agent SHALL start the next pending task without asking for permission to continue
- **AND** it SHALL NOT emit a "should I continue?" prompt between tasks

### Requirement: Pause only for irreversible or product gaps
Agent instructions SHALL pause for confirmation when the next step would rewrite Git history, force-push, change production, publish something that cannot be easily withdrawn, or when missing information would change a product, security, billing, or public-contract decision. They SHALL NOT pause for read-only search, in-scope code edits, local build, tests, repairing failures caused by this change, or already authorized git add/commit/push.

#### Scenario: A test failure from this change is repaired
- **WHEN** a focused test fails because of an edit made in the current authorized task
- **THEN** the agent SHALL fix the failure and re-run the affected tests
- **AND** it SHALL NOT wait for the user to approve that repair

#### Scenario: Force push remains paused
- **WHEN** completing the task would require `git push --force` or a history rewrite
- **THEN** the agent SHALL stop and ask before that step
- **AND** it MAY finish every reversible preparation that does not perform the rewrite

### Requirement: TDD SHALL cover observable automated behavior
The test-driven-development skill SHALL apply when the change introduces or alters observable behavior that should have an automated test. It SHALL NOT require a failing test before configuration-only, generated, copy-only, or type-narrowing edits, and it SHALL NOT require deleting already-written production code as a precondition.

#### Scenario: A behavior change uses red-green
- **WHEN** the agent adds a new CLI flag with user-visible behavior
- **THEN** it SHALL write a failing test for that behavior before production code
- **AND** it SHALL watch that test fail for the right reason

#### Scenario: A copy-only edit skips TDD
- **WHEN** the agent corrects comments or documentation with no behavior change
- **THEN** it SHALL NOT be required to write a failing test first
- **AND** it SHALL NOT be required to ask the user for a TDD exception

### Requirement: Debugging SHALL skip four-phase gates when localized
Systematic debugging SHALL apply when the root cause is unknown, reproduction is unstable, or previous patches failed. It SHALL NOT require completing every debug phase before fixing a failure whose cause is already identified in the current test output or compiler diagnostic.

#### Scenario: A typed assertion failure is fixed directly
- **WHEN** a unit test fails on an assertion that names the edited function and expected value
- **THEN** the agent MAY fix that cause without writing a four-phase checkpoint
- **AND** it SHALL still re-run the failing test after the fix

#### Scenario: An unknown flake still requires investigation
- **WHEN** a test fails intermittently and the agent cannot name the cause
- **THEN** the agent SHALL investigate before proposing a patch
- **AND** it SHALL NOT stack unrelated edits hoping the flake disappears

### Requirement: Verification SHALL use matching-stage evidence
verification-before-completion SHALL require a fresh run of the command that belongs to the current stage before a pass or completion claim. That command SHALL be the focused or Git-aware selection for task-level work, and the registered `test-plan.md` plus Git-aware non-`test-plan` stage for Hardening and Verify. It SHALL NOT define "fresh evidence" as the complete canonical suite.

#### Scenario: Task completion cites the focused command
- **WHEN** the agent claims a detailed Apply task is done
- **THEN** it SHALL have run the task's focused tests in the same turn
- **AND** a prior green run from an earlier turn SHALL NOT satisfy the claim

### Requirement: SDD SHALL not duplicate Apply
`subagent-driven-development` SHALL describe only how a coordinator may dispatch, combine, or inline Apply dispatch units. It SHALL NOT restate the Final Quality Gates contract, SHALL NOT require reading every change artifact before the first unit, and SHALL NOT be an independent implementation entry skill.

#### Scenario: Dispatch uses Apply completion rules
- **WHEN** a coordinator delegates two disjoint dispatch units
- **THEN** each worker SHALL receive that unit's ownership, tasks, and relevant spec/design slices
- **AND** Final Quality Gates SHALL still run once after integration under Apply

### Requirement: Default installs SHALL omit writing-plans
Superpowers SHALL NOT install `writing-plan` or `writing-plans` as a default skill. Agents SHALL plan inside schema artifacts (`execution-plan.md`, `tasks.md`) rather than `docs/superpowers/plans/`.

#### Scenario: A new init does not copy writing-plans
- **WHEN** `superpowers init` configures an AI tool with the default skill set
- **THEN** the tool skill directory SHALL NOT contain a `writing-plans` or `writing-plan` skill
- **AND** existing schema plan artifacts SHALL remain the planning surface

### Requirement: Project docs SHALL not list missing skills
`CLAUDE.md` and equivalent project agent docs SHALL list only skills that exist in `skills/`. They SHALL NOT name retired skills such as `dispatching-parallel-agents`.

#### Scenario: CLAUDE.md matches the skills directory
- **WHEN** an author updates the Skills section of `CLAUDE.md`
- **THEN** every named skill SHALL exist under `skills/`
- **AND** `dispatching-parallel-agents` SHALL NOT appear

### Requirement: No Astra-only agent ruleset
Superpowers SHALL NOT add a GPT-6 Astra (or other model-named) rule file to always-on agent instructions such as `AGENTS.md` or the `using-superpowers` root skill. Model-specific vendor guides MAY remain human-readable documentation.

#### Scenario: GPT6-guide stays optional
- **WHEN** `GPT6-guide.md` exists in the repository
- **THEN** generated and always-on agent instruction files SHALL NOT require the agent to read it
- **AND** `AGENTS.md` SHALL remain empty or limited to short project constraints

### Requirement: Code-review dispatch SHALL not duplicate Apply
`when-to-dispatch-code-review` SHALL only decide when an integrated review is warranted. On Proposal → Review → Apply, Apply's final code-review gate SHALL be the single integrated code-review entry. The skill SHALL NOT schedule another complete review before, during, or after that gate, and SHALL NOT restate Apply severity or retry policy.

#### Scenario: Apply owns the integrated review
- **WHEN** `/sp:apply` is implementing a Proposal
- **THEN** the agent SHALL use Apply's code-review gate after Test Hardening
- **AND** it SHALL NOT dispatch a separate complete code review per task, per dispatch unit, or around that gate

#### Scenario: Direct work may still request review
- **WHEN** the work is Direct Modification and the user asks for review, or the change is merge-ready and high risk
- **THEN** the agent MAY dispatch an integrated review
- **AND** small local low-risk edits SHALL NOT require automatic review unless the user or repository policy asks for it

### Requirement: Branch finish SHALL not require a complete suite
`finishing-a-development-branch` SHALL present merge, pull request, keep-branch, and discard options after matching-stage verification. It SHALL run Git-aware related tests when the runner supports them, or the same non-`test-plan` suite stage as test-scope-selection. It SHALL NOT require `npm test` / `cargo test` / `pytest` / `go test ./...` as a complete-suite pass before offering those options.

#### Scenario: Tests are checked with Git-aware selection
- **WHEN** implementation is complete and the agent uses finishing-a-development-branch
- **THEN** it SHALL verify with Git-aware related tests when supported
- **AND** it SHALL NOT treat a full-project test command as required to present merge or PR options

#### Scenario: Integration choices remain
- **WHEN** that verification passes
- **THEN** the agent SHALL still offer merge locally, push and open a pull request, keep the branch, or discard
- **AND** discard SHALL still require explicit confirmation

### Requirement: Explore SHALL not own failure debugging
Explore SHALL apply when the user wants to think through ideas, scope, or requirements without implementing. Systematic debugging SHALL apply to a failing test, build, or unexpected runtime whose cause is unknown. Explore's description SHALL NOT trigger on every "investigating problems" phrase that is actually a bug.

#### Scenario: A failing test uses debug not explore
- **WHEN** a unit test fails and the user has not asked to explore product direction
- **THEN** the agent SHALL use systematic-debugging (or a direct fix when the cause is already identified)
- **AND** it SHALL NOT enter Explore or treat Explore's no-implement rule as blocking the fix

#### Scenario: Thinking through a feature uses explore
- **WHEN** the user asks to think through approaches before deciding whether to build
- **THEN** the agent SHALL use Explore
- **AND** it SHALL NOT write production implementation while Explore is active

### Requirement: Direct work SHALL not fall closed to a suite
`using-superpowers` Direct Modification SHALL require verification that matches the change: focused tests, Git-aware related tests when the runner supports them, or the same non-`test-plan` suite stage as test-scope-selection. It SHALL NOT tell the agent to fall closed to the complete canonical suite when Git-aware selection is unavailable.

#### Scenario: Direct edit uses Git-aware tests
- **WHEN** the agent implements a low-risk Direct Modification with automated tests
- **THEN** it SHALL prefer Git-aware related tests when the runner supports them
- **AND** it SHALL NOT treat `fall closed to the complete suite` as the required pass

#### Scenario: Direct UI still exercises the journey
- **WHEN** Direct Modification changes a runnable UI path
- **THEN** the agent SHALL exercise that journey and applicable visual-design rules
- **AND** it SHALL NOT pretend an Apply artifact lifecycle was completed

### Requirement: Debugging SHALL not require reading every line
Systematic debugging SHALL NOT require reading a reference implementation completely, or reading every line, before a fix. When a working example is useful, the agent MAY read the slices that explain the difference. Those sentences SHALL be deleted from the root skill and SHALL NOT be copied into `reference/` files.

#### Scenario: A named compiler error is fixed without a full read
- **WHEN** the compiler names the file and the missing type
- **THEN** the agent MAY fix that diagnostic without reading an entire reference implementation
- **AND** `skills/systematic-debugging/SKILL.md` and its `reference/` files SHALL NOT contain `read every line` or `read reference implementation COMPLETELY`

#### Scenario: Unknown-cause work may still compare examples
- **WHEN** the cause is unknown and a similar working path exists
- **THEN** the agent MAY compare the differing slices
- **AND** it SHALL NOT be required to finish a line-by-line read of the whole reference before investigating

### Requirement: Worktrees SHALL default without asking location
`using-git-worktrees` SHALL keep the requirement that a project-local worktree directory is gitignored before use. When no worktree directory exists and `CLAUDE.md` (or equivalent project docs) does not name a location, the agent SHALL create `.worktrees/` in the project, ensure it is ignored, and continue. It SHALL NOT pause for a two-option prompt between `.worktrees/` and a global config path.

#### Scenario: Missing directory uses project-local default
- **WHEN** the agent needs a worktree and neither `.worktrees/` nor `worktrees/` exists
- **AND** project docs do not name a worktree directory
- **THEN** it SHALL use `.worktrees/` and verify it is gitignored (adding an ignore rule if needed)
- **AND** it SHALL NOT ask the user to choose `.worktrees/` versus `~/.config/superpowers/worktrees/`

#### Scenario: Existing directory or docs still win
- **WHEN** `.worktrees/` or `worktrees/` already exists, or project docs name a directory
- **THEN** the agent SHALL use that existing or documented path after the gitignore check
- **AND** `.worktrees/` SHALL still win if both local directories exist

## Attachments

None.
