## ADDED Requirements

### Requirement: Design Verify Skill Invocation And Scope Detection
The system SHALL provide a generated cross-tool `superpowers-design-verify` skill and `/sp:design-verify` command. It SHALL inspect the active change's artifacts and implementation diff to determine whether the change affects a user-facing UI.

#### Scenario: User invokes design verification for a UI change
- **WHEN** a user executes `/sp:design-verify <change-name>` and the change affects a user-facing UI
- **THEN** the agent SHALL inspect the relevant implementation and running UI
- **AND** it SHALL produce a design-conformance report

#### Scenario: Change has no user-facing UI scope
- **WHEN** the artifacts and implementation diff show no user-facing UI change
- **THEN** the agent SHALL mark design verification as `not applicable`
- **AND** it SHALL state the evidence for that classification without treating it as a visual pass

### Requirement: Design Verify SHALL Use The Repository Visual Design Source
For a UI change, the design verification workflow SHALL discover the repository visual `DESIGN.md` or `design.md` using the established repository-root, `docs/`, and project-context locations. It SHALL distinguish that visual identity file from a change-local `design.md`.

#### Scenario: Visual DESIGN.md exists
- **WHEN** a UI change has a discovered visual `DESIGN.md`
- **THEN** the agent SHALL evaluate explicit applicable tokens, component rules, Do's/Don'ts, and accessibility or responsive rules against the running UI
- **AND** it SHALL cite the relevant section or rule for every reported conformance issue

#### Scenario: UI change lacks a visual DESIGN.md
- **WHEN** a UI change has no discovered visual `DESIGN.md`
- **THEN** the agent SHALL report design verification as blocked because formal visual conformance is unassessable
- **AND** it SHALL compare against relevant existing components or CSS patterns when available
- **AND** it SHALL NOT claim that the UI conforms to a nonexistent formal design source or recommend archive

### Requirement: Design Verify SHALL Inspect Runtime States
For each affected UI journey, the workflow SHALL use available browser automation or an equivalent agent-controlled browser driver to inspect the relevant rendered route, changed interaction, and applicable responsive or state variants.

#### Scenario: Required runtime evidence is available
- **WHEN** the affected UI can be run and inspected
- **THEN** the agent SHALL verify the rendered result at the relevant viewport and interaction state
- **AND** it SHALL record screenshots or equivalent inspectable runtime evidence for material findings

#### Scenario: Required runtime evidence is unavailable
- **WHEN** a UI change cannot be run because a required environment, credential, browser capability, or dependency is unavailable
- **THEN** the agent SHALL report design verification as `blocked`
- **AND** it SHALL identify the missing prerequisite and SHALL NOT report a pass from source inspection alone

### Requirement: Design Verify SHALL Produce An Actionable Report
The workflow SHALL report `passed`, `failed`, `blocked`, or `not applicable` separately from functional verification and SHALL group every issue by affected route or state, violated rule, evidence, and remediation.

#### Scenario: Explicit design rule is violated
- **WHEN** runtime evidence contradicts an explicit visual design rule
- **THEN** the agent SHALL report a failed finding with the rule reference and affected implementation location
- **AND** it SHALL recommend a specific corrective action

#### Scenario: All applicable explicit rules conform
- **WHEN** all applicable explicit rules have runtime evidence of conformance
- **THEN** the agent SHALL report design verification as passed
- **AND** it SHALL identify any deliberately unassessed areas and why they are out of scope

## Attachments

None.
