## ADDED Requirements

### Requirement: Apply SHALL Invite Shape Review After Successful Final Quality Gates
After implementation, Test Hardening, and every applicable final quality gate are complete, `/sp:apply` SHALL invite `/sp:shape-review` in the same completion message that invites `/sp:archive`. The invitation SHALL be optional. Apply SHALL NOT run shape-review automatically. A missing, skipped, or declined shape-review SHALL NOT fail apply or prevent the archive recommendation.

#### Scenario: Apply completion invites archive and shape-review
- **WHEN** all tasks, Test Hardening, and every applicable final quality gate have passed or are scope-backed `not applicable`
- **THEN** `/sp:apply` SHALL show the four-gate outcome summary
- **AND** it SHALL tell the user they can archive with `/sp:archive`
- **AND** it SHALL tell the user they can optionally review shape with `/sp:shape-review`
- **AND** it SHALL state that saying they want a shape review in this conversation is enough if the slash command is not installed
- **AND** it SHALL state that shape-review does not block archive

#### Scenario: Shape-review is not a fifth quality gate
- **WHEN** `/sp:apply` records Final Quality Gates
- **THEN** the gate table SHALL remain code review, simplify, verify, and design-verify
- **AND** shape-review SHALL NOT appear as a required gate row
- **AND** apply SHALL NOT wait for a shape-review outcome before recommending archive

#### Scenario: Failed or paused apply does not invite shape-review
- **WHEN** apply pauses, or an applicable final quality gate is `failed` or `blocked`
- **THEN** `/sp:apply` SHALL NOT invite `/sp:shape-review`
- **AND** it SHALL NOT recommend archive

### Requirement: Apply SHALL Honor Same-Session Shape Review Without The Standalone Command
`/sp:apply` SHALL embed the shape-review contract in its generated instructions. When the completion invitation is accepted in that same conversation, the agent SHALL execute that contract even if the user's profile does not install the standalone `shape-review` workflow.

#### Scenario: Core profile user accepts the invitation
- **WHEN** `/sp:apply` has just completed in a core-profile session
- **AND** the user asks to run shape-review, `/sp:shape-review`, or otherwise accepts the optional invitation in that conversation
- **THEN** the agent SHALL execute the embedded shape-review contract for the change that just completed apply
- **AND** it SHALL NOT require `superpowers config profile` before running that same-session review
- **AND** it SHALL NOT skip the review solely because the standalone command is absent

#### Scenario: Standalone command remains optional
- **WHEN** a profile does not include workflow ID `shape-review`
- **THEN** init and update SHALL still omit the standalone skill and command
- **AND** `/sp:apply` SHALL still include the completion invitation and embedded contract

### Requirement: Same-Session Accepted Suggestions SHALL Reopen Apply Rather Than Archive
If the user accepts structural shape-review suggestions in the same conversation after apply completion, `/sp:apply` SHALL treat the change as no longer complete. The agent SHALL expand the current change in place, withhold archive, continue implementation of the new work, and re-run applicable final quality gates after that implementation changes.

#### Scenario: Archive invitation is withdrawn after in-place expansion
- **WHEN** the user accepts structural suggestions in the post-apply conversation
- **THEN** the agent SHALL update the current change artifacts in place
- **AND** it SHALL stop recommending `/sp:archive` until the expanded tasks, Test Hardening, and applicable final quality gates are complete again

#### Scenario: Implementation changes after expansion
- **WHEN** in-place expansion adds implementation work that is then applied
- **THEN** the agent SHALL re-run affected verification and the existing final quality-gate sequence
- **AND** it SHALL NOT treat the earlier gate pass as still valid

#### Scenario: In-place expansion that changes specs or design
- **WHEN** accepted same-session suggestions update the current change's specs or design
- **THEN** the agent SHALL run the existing `/sp:review` proposal-review loop before implementing the expansion
- **AND** it SHALL NOT treat the earlier final quality-gate pass as still valid
- **AND** it SHALL NOT recommend archive until that review and the later implementation gates complete

#### Scenario: User ignores the invitation
- **WHEN** apply has completed and the user archives without running shape-review
- **THEN** `/sp:archive` SHALL proceed under its existing rules
- **AND** shape-review SHALL NOT be required as a prerequisite

## Attachments

None.
