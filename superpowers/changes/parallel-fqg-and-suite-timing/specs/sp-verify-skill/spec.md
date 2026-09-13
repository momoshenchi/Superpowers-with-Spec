## ADDED Requirements

### Requirement: Verify suite preflight SHALL reuse unchanged Hardening Git-aware evidence
When Verify runs as an Apply Final Quality Gate, reuse and re-run are one closed rule. Apply-FQG Verify SHALL read the Hardening suite-stage record, the implementation diff since that record, and whether the Git baseline changed. When implementation and Git baseline are both unchanged since a recorded Hardening `ran-git-aware`, `git-aware-unavailable-recorded`, `git-aware-empty-expected`, or `ran-complete-suite-optional`, Verify SHALL reuse that Hardening suite-stage record and SHALL NOT re-run the same Git-aware or complete-suite command solely to repeat preflight. When code review, Design verify, Simplify, or a Verify repair changed implementation after that record, or the Git baseline changed, Verify SHALL re-execute the canonical non-visual suite preflight (Git-aware when supported, or record the limitation) and SHALL NOT treat the Hardening suite-stage log as current correctness evidence. Reuse SHALL NOT skip registered `test-plan.md` rows that Verify still owns, and SHALL NOT skip `agent-browser` Manual Coverage deferred from Test Hardening. This Apply-FQG reuse supersedes in-flight slim-agent wording that Verify SHALL always run Git-aware at the non-`test-plan` stage; two-layer split and no-default-complete-suite remain.

#### Scenario: Zero implementation diff and unchanged baseline
- **WHEN** Verify round 1 starts after the pre-Verify wave
- **AND** no code-review, Design-verify, Simplify, or Verify repair changed implementation since the Hardening suite-stage record
- **AND** the Git baseline is unchanged
- **AND** Hardening recorded `ran-git-aware` (or `git-aware-unavailable-recorded` / `git-aware-empty-expected` / `ran-complete-suite-optional`)
- **THEN** Verify SHALL cite that Hardening suite-stage evidence
- **AND** it SHALL NOT run the Git-aware or complete-suite command again for that round
- **AND** it SHALL still execute registered `test-plan.md` rows that Verify still owns
- **AND** it SHALL still execute applicable Manual Coverage including deferred `agent-browser` rows

#### Scenario: Simplify changed implementation
- **WHEN** Simplify changed implementation after Hardening
- **THEN** Verify SHALL run the canonical non-visual suite preflight again
- **AND** it SHALL NOT treat the Hardening Git-aware log as current correctness evidence

#### Scenario: Code review or Design verify repair changed implementation
- **WHEN** a code-review or Design-verify P0 repair changed implementation after the Hardening suite-stage record
- **AND** Verify then starts
- **THEN** Verify SHALL run the canonical non-visual suite preflight again
- **AND** it SHALL NOT reuse Hardening `ran-git-aware` as current correctness evidence

#### Scenario: Verify repair changed implementation
- **WHEN** a prior Apply-FQG Verify round repaired implementation
- **AND** the next Verify round starts
- **THEN** that next round SHALL run the canonical non-visual suite preflight again
- **AND** it SHALL NOT reuse the Hardening suite-stage record as current correctness evidence

#### Scenario: Git baseline changed after Hardening
- **WHEN** the Git baseline used for related selection changed after the Hardening suite-stage record
- **THEN** Verify SHALL run the canonical non-visual suite preflight again
- **AND** it SHALL NOT reuse the Hardening suite-stage record as current correctness evidence

#### Scenario: Standalone verify always preflights
- **WHEN** `/sp:verify` is invoked outside Apply's Final Quality Gates
- **THEN** the agent SHALL run the canonical non-visual suite preflight in that invocation
- **AND** it SHALL NOT require a Hardening record to exist
