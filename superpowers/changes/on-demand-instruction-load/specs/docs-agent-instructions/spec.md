## ADDED Requirements

### Requirement: Agent docs SHALL not merchandize the skill catalog
Root `CLAUDE.md` and other always-on project agent docs SHALL state project constraints. They SHALL NOT list bundled Superpowers skills as a catalog the agent must inspect or load.

#### Scenario: CLAUDE.md omits the skill pitch list
- **WHEN** root `CLAUDE.md` is updated for this change
- **THEN** it MAY keep stack, commands, directory map, and Node version
- **AND** it SHALL NOT include a bullet list of skill names with one-line descriptions

## Attachments

None.
