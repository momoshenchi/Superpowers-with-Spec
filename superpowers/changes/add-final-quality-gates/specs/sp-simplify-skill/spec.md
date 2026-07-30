## ADDED Requirements

### Requirement: Simplify Skill Invocation And Distribution
The system SHALL provide a generated cross-tool `superpowers-simplify` skill and `/sp:simplify` command. It SHALL be distinct from host-native commands such as Claude Code's `/simplify` and SHALL accept an optional change name using the same change-selection rules as other change-aware workflows.

#### Scenario: User invokes the generated simplify command
- **WHEN** a user executes `/sp:simplify <change-name>` on a configured supported tool
- **THEN** the agent SHALL scope cleanup to that change's implementation and artifacts
- **AND** it SHALL identify the command as `/sp:simplify`, not as a replacement for a host-native `/simplify`

#### Scenario: Simplify resolves a named change safely
- **WHEN** a user executes `/sp:simplify <change-name>` in a dirty workspace
- **THEN** the agent SHALL resolve the change through Superpowers status and apply instructions, read its context, and scope cleanup to owned implementation/artifact paths and diff
- **AND** it SHALL pause for a narrower target if that scope cannot be separated from unrelated changes

#### Scenario: Simplify has no change name
- **WHEN** `/sp:simplify` is invoked without a change name
- **THEN** the agent SHALL require an explicit PR, branch, file, or diff target before reviewing
- **AND** it SHALL NOT silently make the entire dirty working tree its scope

#### Scenario: Apply invokes simplify without the standalone workflow selected
- **WHEN** `/sp:apply` reaches its final quality-gate sequence in a profile that does not expose `/sp:simplify` as a standalone command
- **THEN** the agent SHALL still execute the same simplify contract from the apply workflow
- **AND** it SHALL NOT skip cleanup solely because the standalone command is absent

### Requirement: Simplify SHALL Port Claude Code's Cleanup Workflow
The simplify workflow SHALL port Claude Code 2.1.220's two-phase cleanup workflow under the `/sp:simplify` namespace: gather the relevant diff, assess reuse, simplification, efficiency, and altitude with four parallel review agents when the host supports agent spawning, then deduplicate and apply safe cleanup findings. When fan-out is unavailable, it SHALL assess all four angles in a single pass and say so in its final summary.

#### Scenario: Candidate cleanup is safe
- **WHEN** a cleanup finding can be applied without changing intended behavior or reaching well outside the reviewed diff
- **THEN** the agent MAY apply the cleanup
- **AND** it SHALL report the applied change in its closing summary

#### Scenario: Candidate cleanup is unsuitable
- **WHEN** a proposed cleanup would change intended behavior, require changes well outside the reviewed diff, or is a false positive
- **THEN** the agent SHALL skip it
- **AND** it SHALL note the skip rather than arguing with the finding

### Requirement: Simplify SHALL Summarize Its Outcome
The simplify workflow SHALL finish with a brief summary of what it fixed and skipped, or confirm that the reviewed code was already clean. It SHALL explicitly identify a single-pass fallback when no agent-spawning tool was available and provide a stable report containing its `passed`, `failed`, `blocked`, or evidence-backed `not applicable` outcome, scope, review mode, applied/skipped findings, and evidence.

#### Scenario: No cleanup is required
- **WHEN** all four cleanup angles find no safe candidate
- **THEN** the agent SHALL confirm that the reviewed code was already clean
- **AND** it SHALL identify whether it used four-agent fan-out or the single-pass fallback

## Attachments

None.
