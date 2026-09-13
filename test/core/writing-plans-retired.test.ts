import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

describe('writing-plans retired from default discovery', () => {
  it('does not keep writing-plan/SKILL.md as a discoverable skill', () => {
    expect(existsSync(path.join(process.cwd(), 'writing-plan/SKILL.md'))).toBe(false);
    expect(existsSync(path.join(process.cwd(), 'docs/archive/writing-plans-skill.md'))).toBe(
      true
    );
  });

  it('does not expose skill frontmatter that hosts would auto-discover', () => {
    const archived = readFileSync(
      path.join(process.cwd(), 'docs/archive/writing-plans-skill.md'),
      'utf8'
    );
    expect(archived).not.toMatch(/^name:\s*writing-plan/m);
    expect(archived).not.toMatch(/^description:\s*Use when/m);
  });
});
