## ADDED Requirements

### Requirement: Catalog descriptions SHALL state when not to use the skill
Each live bundled skill YAML `description` SHALL name triggering conditions and SHALL exclude at least one neighboring Superpowers task that must not load it. Descriptions SHALL NOT treat ordinary implementation, generic test writing, or “work is complete” as enough to load a specialized skill.

#### Scenario: full-qa-test does not fire on a focused unit test
- **WHEN** the agent adds a focused unit test during Direct Modification or an Apply task
- **AND** the user did not ask for six-dimension / 无死角 coverage and Test Hardening has not started
- **THEN** the `full-qa-test` description SHALL NOT match that task
- **AND** the agent SHALL NOT be required to read `full-qa-test` for that edit

#### Scenario: worktrees does not fire on every Apply
- **WHEN** `/sp:apply` starts on an already isolated workspace
- **AND** the user did not ask to create a git worktree
- **THEN** the `using-git-worktrees` description SHALL NOT treat Apply as an automatic trigger
- **AND** Apply instructions SHALL NOT mark that skill REQUIRED before the first task

#### Scenario: finishing-a-branch waits for an integration request
- **WHEN** Apply implementation, Test Hardening, and applicable Final Quality Gates are complete
- **AND** the user has not asked to merge, open a PR, keep the branch, or discard it
- **THEN** the `finishing-a-development-branch` description SHALL NOT match solely because tests passed
- **AND** Apply MAY suggest archive without loading that skill

### Requirement: Apply SHALL NOT chain-read TDD or completion-evidence skills
Apply instructions SHALL state the TDD applicability rule and the matching-stage evidence rule in place. They SHALL NOT require the agent to open `test-driven-development` or `verification-before-completion` as a precondition for starting or completing a task.

#### Scenario: Apply starts a behavior task without loading TDD.md
- **WHEN** Apply begins a pending task that changes observable automated behavior
- **THEN** it MAY tell the agent to write a failing test first
- **AND** it SHALL NOT say to refer to or read the `test-driven-development` skill file before implementing

#### Scenario: Apply completes a task without loading VBC.md
- **WHEN** Apply is about to mark a task complete
- **THEN** it SHALL require fresh matching-stage evidence for that task
- **AND** it SHALL NOT say to refer to the `verification-before-completion` skill file

### Requirement: SessionStart SHALL not inject the using-superpowers body
Claude Code SessionStart SHALL tell the agent that `using-superpowers` exists for work-mode choice. It SHALL NOT embed the full `skills/using-superpowers/SKILL.md` contents in the hook payload.

#### Scenario: Session start names the router
- **WHEN** a Claude Code session starts with Superpowers hooks enabled
- **THEN** the injected context SHALL name `using-superpowers` as the work-mode skill
- **AND** it SHALL NOT contain the root skill’s mode-selection sections verbatim

## Attachments

None.
