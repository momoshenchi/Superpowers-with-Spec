## ADDED Requirements

### Requirement: Simplify SHALL Hand Off Changed Scope To Verify
When `/sp:simplify` runs as an apply final-quality gate, it SHALL repair or revert uncertain cleanup before reporting. If it applies a behavior-preserving cleanup or resolves a repairable cleanup failure, `/sp:apply` SHALL continue at Verify rather than restarting code review or Simplify. A `blocked` or unresolvable `failed` Simplify result SHALL pause apply.

#### Scenario: Simplify changes implementation safely
- **WHEN** Simplify applies a behavior-preserving cleanup and fresh affected verification passes
- **THEN** Simplify SHALL report its cleanup evidence
- **AND** `/sp:apply` SHALL start Verify round one

#### Scenario: Simplify cannot complete
- **WHEN** Simplify cannot resolve its scope or cannot make a cleanup behavior-preserving after repair or revert
- **THEN** it SHALL report `blocked` or `failed` with evidence
- **AND** `/sp:apply` SHALL pause rather than start a retry loop from Simplify

## Attachments

None.
