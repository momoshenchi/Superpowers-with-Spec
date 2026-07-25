## MODIFIED Requirements

### Requirement: Skill Generation
The command SHALL generate Agent Skills for selected AI tools according to the active workflow profile and delivery mode. The core workflow profile SHALL include `propose`, `explore`, `review`, `apply`, and `archive`; its generated skill set SHALL therefore include `superpowers-change-review/SKILL.md` alongside the selected core workflow skills. A custom profile SHALL generate only its selected workflows.

#### Scenario: Generating skills for a core-profile tool

- **WHEN** a supported tool is selected during initialization with the core profile and skills delivery is enabled
- **THEN** the tool's skills directory SHALL contain generated skills for `propose`, `explore`, `review`, `apply`, and `archive`
- **AND** it SHALL include `superpowers-change-review/SKILL.md` with YAML frontmatter, a schema-aware manual review procedure, and the shared proposal-review behavior used by `/sp:propose`
- **AND** each generated SKILL.md SHALL contain its workflow instructions

#### Scenario: Generating skills for a custom profile

- **WHEN** a supported tool is initialized or updated with a custom profile that does not select `review`
- **THEN** it SHALL not generate or retain a Superpowers-managed `superpowers-change-review` skill for that profile
- **AND** it SHALL preserve the selected workflow skills and unmanaged user content

### Requirement: Slash Command Generation
The command SHALL generate sp slash commands for selected AI tools according to the active workflow profile and delivery mode. The core workflow profile SHALL include a `/sp:review` command whose optional argument is a change identifier; a custom profile SHALL generate it only when `review` is selected.

#### Scenario: Generating commands for a core-profile tool

- **WHEN** a supported tool is selected during initialization with the core profile and commands delivery is enabled
- **THEN** its tool-specific command location SHALL contain commands for `propose`, `explore`, `review`, `apply`, and `archive`
- **AND** the generated `/sp:review` command SHALL accept an optional change identifier and use the tool-specific frontmatter format

#### Scenario: Generating commands for a custom profile without review

- **WHEN** a supported tool is initialized or updated with a custom profile that does not select `review`
- **THEN** it SHALL not generate or retain a Superpowers-managed `/sp:review` command for that profile
- **AND** it SHALL preserve the selected workflow commands and unmanaged user content
