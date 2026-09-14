## ADDED Requirements

### Requirement: Apply SHALL own dispatch-unit execution
Proposal-path dispatch (combine, inline, or spawn a worker for a dispatch unit) SHALL be described in Apply. Superpowers SHALL NOT install a separate live `subagent-driven-development` skill as an implementation entry.

#### Scenario: Apply contains dispatch rules
- **WHEN** `/sp:apply` executes a spec-driven change with dispatch-unit headings
- **THEN** Apply instructions SHALL tell the coordinator how to assign, combine, or inline units
- **AND** the agent SHALL NOT be required to read `skills/subagent-driven-development/SKILL.md`

#### Scenario: Init removes the SDD skill directory
- **WHEN** `superpowers init` or `superpowers update` configures a tool
- **THEN** it SHALL NOT copy a live `subagent-driven-development/SKILL.md`
- **AND** it SHALL remove that skill directory from the tool skills root if it already exists

### Requirement: using-superpowers SHALL own code-review timing
When to dispatch an integrated code review SHALL be stated in `using-superpowers`. On Proposal → Review → Apply, Apply’s final code-review gate SHALL be the single integrated code review. Superpowers SHALL NOT install a separate live `when-to-dispatch-code-review` skill.

#### Scenario: Direct Modification timing stays in the router
- **WHEN** the agent is in Direct Modification and the user did not ask for review
- **THEN** `using-superpowers` SHALL say small local edits do not require automatic review
- **AND** it SHALL still allow review on explicit request, merge-ready high risk, or repository policy

#### Scenario: Init removes the dispatch-timing skill
- **WHEN** `superpowers init` or `superpowers update` configures a tool
- **THEN** it SHALL NOT copy a live `when-to-dispatch-code-review/SKILL.md`
- **AND** it SHALL remove that skill directory from the tool skills root if it already exists

### Requirement: using-superpowers SHALL own completion-evidence
Matching-stage evidence before a completion claim SHALL live in `using-superpowers`. Superpowers SHALL NOT install a separate live `verification-before-completion` skill.

#### Scenario: Router states matching-stage evidence
- **WHEN** the agent is about to claim a Direct Modification or Apply task is complete
- **THEN** `using-superpowers` SHALL require a fresh run of the current-stage command (focused, Git-aware, or registered `test-plan` rows)
- **AND** it SHALL NOT define evidence as a complete canonical suite

#### Scenario: Init removes the VBC skill
- **WHEN** `superpowers init` or `superpowers update` configures a tool
- **THEN** it SHALL NOT copy a live `verification-before-completion/SKILL.md`
- **AND** it SHALL remove that skill directory from the tool skills root if it already exists

### Requirement: Apply SHALL not restate a second complete review
Apply SHALL NOT instruct the agent to perform a separate complete integration review before or after Apply’s Final Quality Gates code-review gate. Worker self-review of a dispatch unit remains required.

#### Scenario: Guardrails do not add a full validation review
- **WHEN** dispatch units are integrated and Test Hardening is complete
- **THEN** Apply SHALL proceed to the ordered Final Quality Gates
- **AND** it SHALL NOT require an additional “complete integration review” or “full validation” pass around that gate

### Requirement: Apply pause text SHALL match the router
Apply SHALL pause only for product-ambiguous acceptance, unsatisfiable artifacts, irreversible Git or production operations, or user interrupt. It SHALL NOT tell the agent to pause and wait for guidance on every implementation issue.

#### Scenario: In-scope compile error continues
- **WHEN** a compile or focused test fails because of the current authorized Apply diff
- **THEN** Apply SHALL tell the agent to fix and recheck without waiting
- **AND** the same file SHALL NOT also say to pause and present options for that class of issue

### Requirement: Remaining skills SHALL not point at retired skills
Live bundled skills that remain installed SHALL NOT require reading `verification-before-completion`, `subagent-driven-development`, or `when-to-dispatch-code-review`. Pointers SHALL move to `using-superpowers` or Apply, or be deleted.

#### Scenario: finishing-a-branch does not require VBC or SDD
- **WHEN** `finishing-a-development-branch` is loaded after those skills are retired
- **THEN** it SHALL NOT tell the agent to see `verification-before-completion` or `subagent-driven-development`
- **AND** matching-stage evidence MAY point at `using-superpowers`

#### Scenario: debug and worktrees do not require retired skills
- **WHEN** `systematic-debugging` or `using-git-worktrees` is loaded
- **THEN** they SHALL NOT list `verification-before-completion` or `subagent-driven-development` as required background
- **AND** `using-superpowers` SHALL NOT tell Direct Modification to apply the retired VBC skill file

### Requirement: Default discovery SHALL omit host maps and debug authoring debris
Default skill discovery SHALL NOT include `using-superpowers/reference/codex-tools.md`, `copilot-tools.md`, or `gemini-tools.md` as files an agent is told to read for ordinary work. `systematic-debugging/CREATION-LOG.md` and `test-pressure-*.md` SHALL NOT remain in the live skill directory that init copies.

#### Scenario: Router does not point at host tool maps
- **WHEN** the agent reads `using-superpowers` to choose a work mode
- **THEN** the root skill SHALL NOT require reading Codex, Copilot, or Gemini tool-mapping files
- **AND** those files SHALL NOT be present under the copied `using-superpowers/reference/` directory

#### Scenario: Debug skill copy omits pressure tests
- **WHEN** init copies `systematic-debugging` into a tool skills directory
- **THEN** the copied directory SHALL include the root skill and technique references needed for unknown-cause debugging
- **AND** it SHALL NOT include `CREATION-LOG.md` or `test-pressure-*.md`

## Attachments

None.
