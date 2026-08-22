import { describe, it, expect } from 'vitest';
import { parseDeltaSpec } from '../../../src/core/parsers/requirement-blocks.js';
import { checkDeltaOperationsAgainstMainSpec } from '../../../src/core/validation/delta-operations.js';

function check(delta: string, mainSpec: string | null) {
  return checkDeltaOperationsAgainstMainSpec('alpha/spec.md', 'alpha', parseDeltaSpec(delta), mainSpec);
}

const MAIN_SPEC = `# alpha Specification

## Purpose

Existing capability.

## Requirements

### Requirement: Existing Behavior

The system SHALL do the existing thing.

#### Scenario: Works

- **WHEN** invoked
- **THEN** it works

### Requirement: Another Behavior

The system SHALL also do another thing.

#### Scenario: Also works

- **WHEN** invoked
- **THEN** it works
`;

function added(name: string): string {
  return `## ADDED Requirements

### Requirement: ${name}

The system SHALL do a new thing.

#### Scenario: New

- **WHEN** invoked
- **THEN** it works
`;
}

function modified(name: string): string {
  return `## MODIFIED Requirements

### Requirement: ${name}

The system SHALL do the changed thing.

#### Scenario: Changed

- **WHEN** invoked
- **THEN** it works
`;
}

describe('checkDeltaOperationsAgainstMainSpec', () => {
  describe('against an existing main spec', () => {
    it('accepts ADDED for a requirement that does not exist yet', () => {
      expect(check(added('Brand New Behavior'), MAIN_SPEC)).toEqual([]);
    });

    it('accepts MODIFIED for a requirement that already exists', () => {
      expect(check(modified('Existing Behavior'), MAIN_SPEC)).toEqual([]);
    });

    it('rejects ADDED for a requirement that already exists and points at MODIFIED', () => {
      const issues = check(added('Existing Behavior'), MAIN_SPEC);
      expect(issues).toHaveLength(1);
      expect(issues[0].level).toBe('ERROR');
      expect(issues[0].path).toBe('alpha/spec.md');
      expect(issues[0].message).toContain('ADDED "Existing Behavior"');
      expect(issues[0].message).toContain('already exists');
      expect(issues[0].message).toContain('## MODIFIED Requirements');
    });

    it('rejects MODIFIED for a requirement that does not exist and points at ADDED', () => {
      const issues = check(modified('Brand New Behavior'), MAIN_SPEC);
      expect(issues).toHaveLength(1);
      expect(issues[0].level).toBe('ERROR');
      expect(issues[0].message).toContain('MODIFIED "Brand New Behavior"');
      expect(issues[0].message).toContain('## ADDED Requirements');
    });

    it('suggests the closest existing name when a MODIFIED header looks like a typo', () => {
      const issues = check(modified('Existing Behaviour'), MAIN_SPEC);
      expect(issues).toHaveLength(1);
      expect(issues[0].message).toContain('Existing Behavior');
      expect(issues[0].message).toMatch(/closest existing requirement/i);
    });

    it('rejects REMOVED for a requirement that does not exist', () => {
      const issues = check(
        `## REMOVED Requirements\n\n### Requirement: Ghost Behavior\n`,
        MAIN_SPEC
      );
      expect(issues).toHaveLength(1);
      expect(issues[0].message).toContain('REMOVED "Ghost Behavior"');
      expect(issues[0].message).toContain('not found');
    });

    it('rejects RENAMED when the source does not exist', () => {
      const issues = check(
        `## RENAMED Requirements\n\n- FROM: \`### Requirement: Ghost Behavior\`\n- TO: \`### Requirement: New Name\`\n`,
        MAIN_SPEC
      );
      expect(issues).toHaveLength(1);
      expect(issues[0].message).toContain('RENAMED FROM "Ghost Behavior"');
    });

    it('rejects RENAMED when the target name is already taken', () => {
      const issues = check(
        `## RENAMED Requirements\n\n- FROM: \`### Requirement: Existing Behavior\`\n- TO: \`### Requirement: Another Behavior\`\n`,
        MAIN_SPEC
      );
      expect(issues).toHaveLength(1);
      expect(issues[0].message).toContain('RENAMED TO "Another Behavior"');
      expect(issues[0].message).toContain('already exists');
    });

    it('accepts MODIFIED under the new name after a RENAME in the same delta', () => {
      const delta = `## RENAMED Requirements

- FROM: \`### Requirement: Existing Behavior\`
- TO: \`### Requirement: Renamed Behavior\`

${modified('Renamed Behavior')}`;
      expect(check(delta, MAIN_SPEC)).toEqual([]);
    });

    it('accepts ADDED that reuses a name freed by REMOVED in the same delta', () => {
      const delta = `## REMOVED Requirements

### Requirement: Existing Behavior

${added('Existing Behavior')}`;
      expect(check(delta, MAIN_SPEC)).toEqual([]);
    });

    it('ignores case and surrounding whitespace when matching requirement names', () => {
      expect(check(modified('  existing behavior  '), MAIN_SPEC)).toEqual([]);
    });
  });

  describe('when the main spec does not exist yet', () => {
    it('accepts ADDED requirements for a brand new capability', () => {
      expect(check(added('Brand New Behavior'), null)).toEqual([]);
    });

    it('rejects MODIFIED because there is nothing to modify', () => {
      const issues = check(modified('Anything'), null);
      expect(issues).toHaveLength(1);
      expect(issues[0].level).toBe('ERROR');
      expect(issues[0].message).toContain('has no main spec');
      expect(issues[0].message).toContain('## ADDED Requirements');
    });

    it('rejects RENAMED because there is nothing to rename', () => {
      const issues = check(
        `## RENAMED Requirements\n\n- FROM: \`### Requirement: A\`\n- TO: \`### Requirement: B\`\n`,
        null
      );
      expect(issues).toHaveLength(1);
      expect(issues[0].level).toBe('ERROR');
      expect(issues[0].message).toContain('has no main spec');
    });

    it('warns rather than errors for REMOVED because apply ignores it', () => {
      const issues = check(`## REMOVED Requirements\n\n### Requirement: Ghost\n`, null);
      expect(issues).toHaveLength(1);
      expect(issues[0].level).toBe('WARNING');
      expect(issues[0].message).toContain('Ghost');
    });
  });
});
