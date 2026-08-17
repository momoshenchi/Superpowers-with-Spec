## ADDED Requirements

### Requirement: Shape Review Skill Invocation And Distribution
The system SHALL provide a generated cross-tool `superpowers-shape-review` skill and `/sp:shape-review` command. It SHALL be distinct from `/sp:review`, `/sp:simplify`, and `/sp:design-verify`. The workflow ID SHALL be `shape-review`. The command SHALL be absent from the core profile and present in `ALL_WORKFLOWS` so a custom profile can select it. It SHALL accept an optional change name using the same change-selection rules as other change-aware workflows.

#### Scenario: User invokes the generated shape-review command
- **WHEN** a user executes `/sp:shape-review <change-name>` on a configured supported tool
- **THEN** the agent SHALL identify the command as `/sp:shape-review`
- **AND** it SHALL scope the review to that change's implementation and artifacts
- **AND** it SHALL NOT treat the command as `/sp:review`, `/sp:simplify`, or `/sp:design-verify`

#### Scenario: Core profile does not install shape-review
- **WHEN** a user uses the core profile
- **THEN** init and update SHALL NOT install the standalone `shape-review` skill or `/sp:shape-review` command
- **AND** the core workflow set SHALL remain propose, explore, review, apply, and archive

#### Scenario: Custom profile selects shape-review
- **WHEN** a custom profile includes workflow ID `shape-review` and the user runs init or update
- **THEN** the system SHALL generate `superpowers-shape-review` and `/sp:shape-review` for the configured tools by explicit workflow-ID lookup
- **AND** deselection SHALL remove those generated files by the same explicit list, not by pattern matching

#### Scenario: Shape review resolves a named change safely
- **WHEN** a user executes `/sp:shape-review <change-name>` in a dirty workspace
- **THEN** the agent SHALL resolve the change through Superpowers status and apply instructions, read its context, and scope review to owned implementation/artifact paths and diff
- **AND** it SHALL pause for a narrower target if that scope cannot be separated from unrelated changes
- **AND** path handling SHALL use platform-neutral joins so the same owned paths work on macOS, Linux, and Windows

#### Scenario: Shape review has no change name
- **WHEN** `/sp:shape-review` is invoked without a change name
- **THEN** the agent SHALL require an explicit PR, branch, file, or diff target before reviewing unless the current conversation just completed `/sp:apply` for one identifiable change
- **AND** it SHALL NOT silently make the entire dirty working tree its scope

### Requirement: Shape Review SHALL Assess Four Structural Angles
The shape-review workflow SHALL gather the relevant diff, then assess all four angles: Surface, Boundaries, Model, and Composition. It SHALL NOT omit an angle. When the host supports agent spawning, it SHALL use four parallel review agents, one angle each. When fan-out is unavailable, it SHALL assess all four angles in one disclosed single pass. An angle SHALL report `not applicable` with concrete scope evidence when the diff has no evidence for that layer. The worker SHALL be read-only by default and SHALL NOT apply code or artifact edits while producing the report.

#### Scenario: Four-angle fan-out
- **WHEN** `/sp:shape-review` runs on a host that can spawn agents
- **THEN** the agent SHALL launch four independent reviewers in one message, one each for Surface, Boundaries, Model, and Composition
- **AND** it SHALL pass each reviewer the scoped diff and that angle's checklist

#### Scenario: Single-pass fallback
- **WHEN** no agent-spawning tool is available
- **THEN** the agent SHALL still assess all four angles in the same context
- **AND** the closing report SHALL state that this was a single-pass review, not the four-agent fan-out

#### Scenario: Angle is not applicable
- **WHEN** the scoped diff has no evidence for an angle (for example no public surface change for Surface)
- **THEN** that angle SHALL be reported `not applicable` with concrete scope evidence
- **AND** the other angles SHALL still run

#### Scenario: Worker remains read-only during review
- **WHEN** the shape-review worker produces findings
- **THEN** it SHALL NOT edit implementation or change artifacts in that review pass
- **AND** it SHALL report each finding with angle, location (`file:line` or symbol), summary, cost, classification (`simplify`, `structural`, or `skip`), and destination (`simplify`, `expand-current-change`, `new-proposal`, or `skip`)

### Requirement: Shape Review SHALL Route Findings Without Absorbing Simplify Or Visual Work
A shape-review finding SHALL be classified as `simplify`, `structural`, or `skip` before session routing. Behavior-preserving local cleanup SHALL be classified `simplify` and routed to `/sp:simplify`. Visual `DESIGN.md` conformance SHALL be left to `/sp:design-verify`. Proposal-artifact completeness SHALL be left to `/sp:review`. For a `structural` finding, destination SHALL be filled from session membership at report time (`expand-current-change` or `new-proposal`) and checked again when the user accepts. The worker SHALL NOT choose expand versus new-proposal without applying the session rule.

#### Scenario: Finding is behavior-preserving local cleanup
- **WHEN** a finding can be fixed without changing intended behavior, public contracts, module boundaries, or observable lifecycle
- **THEN** the report SHALL classify it `simplify` with destination `simplify`
- **AND** shape-review SHALL skip applying it

#### Scenario: Finding changes seams or contracts
- **WHEN** a finding would change a public surface, data contract, module boundary, type/state model, or composition seam
- **THEN** the report SHALL classify it `structural`
- **AND** destination SHALL be `expand-current-change` when this conversation just completed apply for that change, otherwise `new-proposal`
- **AND** the agent SHALL NOT apply it as simplify cleanup

#### Scenario: Finding is a false positive or out of scope
- **WHEN** a proposed suggestion is a false positive, lacks evidence, or requires changes well outside the reviewed diff
- **THEN** the agent SHALL classify it `skip` with destination `skip`
- **AND** it SHALL note the skip rather than arguing with the finding

### Requirement: Accepted Suggestions SHALL Follow Session Routing
When the user accepts one or more structural suggestions, the coordinator SHALL extend the current change in place if this conversation is still in the post-apply phase for that change. It SHALL create a new change only when the acceptance happens in a new session, or when same-session membership cannot be established.

#### Scenario: Same-session acceptance after apply
- **WHEN** `/sp:apply` has just completed applicable final quality gates for a change in this conversation
- **AND** the user accepts structural shape-review suggestions for that same change before starting a new conversation
- **THEN** the agent SHALL update that change's proposal, design, specs, tasks, execution-plan, and test-plan in place as needed
- **AND** it SHALL withdraw the archive recommendation until the expanded work and applicable final quality gates complete again
- **AND** it SHALL NOT create a new change directory for those accepted suggestions
- **AND** invoking `/sp:shape-review` or equivalent natural language in that same conversation SHALL still count as same-session, not as a new session

#### Scenario: Slash command after apply completion stays in session
- **WHEN** `/sp:apply` has just completed applicable final quality gates for a change in this conversation
- **AND** the user then invokes `/sp:shape-review` for that same change, including with an explicit change name
- **THEN** accepted structural suggestions SHALL expand that change in place
- **AND** the agent SHALL NOT treat the slash invocation as a new-session fresh request

#### Scenario: New-session acceptance
- **WHEN** the user accepts structural shape-review suggestions in a conversation that did not just complete `/sp:apply` for that change
- **THEN** the agent SHALL create a new change whose proposal records the prior change as prerequisite
- **AND** it SHALL NOT edit the prior change's artifacts to absorb those suggestions

#### Scenario: Session membership is uncertain
- **WHEN** the agent cannot establish that this conversation just completed apply for the named change
- **THEN** it SHALL treat the acceptance as a new session
- **AND** it SHALL create a new change rather than guessing that in-place expansion is safe

#### Scenario: No suggestions are accepted
- **WHEN** the review finds nothing, or the user accepts none of the structural suggestions
- **THEN** the agent SHALL leave the current change unchanged
- **AND** if apply had completed, the existing `/sp:archive` invitation SHALL remain valid

### Requirement: Shape Review SHALL Summarize Its Outcome
The workflow SHALL finish with a stable report containing its `passed`, `failed`, or `blocked` outcome, scope, review mode, per-angle results, findings, routing destinations, and evidence. `passed` means the review completed and reported, including when it produced structural suggestions; it SHALL NOT mean the shape is ideal, and it SHALL NOT block archive by itself. `blocked` means the requested scope cannot be resolved safely. `failed` means the review process itself cannot complete after the scope is resolved. `not applicable` is a per-angle result with scope evidence, not the default whole-review outcome.

#### Scenario: Review completes with suggestions
- **WHEN** one or more structural suggestions are reported
- **THEN** the report SHALL list each finding's angle, location, summary, and destination
- **AND** Outcome SHALL be `passed`
- **AND** that `passed` result SHALL NOT by itself prevent an archive recommendation

#### Scenario: No structural suggestions
- **WHEN** all four angles find no structural candidate after routing simplify-eligible items away
- **THEN** the agent SHALL confirm that no shape suggestions were produced
- **AND** it SHALL identify whether it used four-agent fan-out or the single-pass fallback

#### Scenario: Review process cannot complete
- **WHEN** the scope is resolved but the four-angle review cannot be completed
- **THEN** the agent SHALL report `failed`
- **AND** it SHALL NOT treat structural suggestions as a `failed` outcome

#### Scenario: Scope cannot be resolved
- **WHEN** the requested scope cannot be separated from unrelated dirty changes, or no explicit target exists
- **THEN** the agent SHALL report `blocked`
- **AND** it SHALL NOT review the whole working tree

## Attachments

None.
