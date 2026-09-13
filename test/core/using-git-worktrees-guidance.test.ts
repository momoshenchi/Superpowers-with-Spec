import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const wt = readFileSync(
  path.join(process.cwd(), 'skills/using-git-worktrees/SKILL.md'),
  'utf8'
);

describe('using-git-worktrees guidance', () => {
  it('does not ask where to create worktrees', () => {
    expect(wt).not.toMatch(/Where should I create worktrees/);
    expect(wt).not.toMatch(/Which would you prefer/);
    expect(wt).toMatch(/\.worktrees\//);
    expect(wt).toMatch(/check-ignore|gitignore/i);
  });
});
