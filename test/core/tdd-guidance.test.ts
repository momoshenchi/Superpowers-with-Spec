import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const tdd = readFileSync(
  path.join(process.cwd(), 'skills/test-driven-development/SKILL.md'),
  'utf8'
);

describe('test-driven-development guidance', () => {
  it('scopes TDD to observable automated behavior', () => {
    expect(tdd).toMatch(/observable behavior/i);
    expect(tdd).not.toMatch(/Use when implementing any feature or bugfix/);
    expect(tdd).not.toMatch(/Fall closed to the complete suite/);
  });

  it('does not apply Iron Law to every feature', () => {
    expect(tdd).not.toMatch(/NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST/);
  });

  it('allows documentation-only edits without a failing test', () => {
    expect(tdd).toMatch(/copy-only|documentation/i);
    expect(tdd).toMatch(/without asking|without asking the user/i);
    expect(tdd).toContain('Git-related tests');
    expect(tdd).toContain('do not require the full suite');
  });
});
