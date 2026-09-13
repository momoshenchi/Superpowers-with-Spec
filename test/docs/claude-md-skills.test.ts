import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const claude = readFileSync(path.join(process.cwd(), 'CLAUDE.md'), 'utf8');
const agents = readFileSync(path.join(process.cwd(), 'AGENTS.md'), 'utf8');

describe('CLAUDE.md skills list', () => {
  it('does not list dispatching-parallel-agents', () => {
    expect(claude).not.toContain('dispatching-parallel-agents');
  });

  it('does not require GPT6-guide', () => {
    expect(agents).not.toMatch(/GPT6-guide/);
    expect(claude).not.toMatch(/GPT6-guide/);
  });

  it('lists only skills that exist under skills/', () => {
    const named = [...claude.matchAll(/^- `([a-z0-9-]+)` —/gm)].map((m) => m[1]);
    expect(named.length).toBeGreaterThan(0);
    for (const name of named) {
      expect(
        existsSync(path.join(process.cwd(), 'skills', name, 'SKILL.md')),
        `listed skill missing from skills/: ${name}`
      ).toBe(true);
    }
  });

  it('does not tell using-superpowers to check skills before any response', () => {
    expect(claude).not.toMatch(/check skills before any response/i);
  });
});
