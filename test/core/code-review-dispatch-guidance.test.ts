import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { ALL_WORKFLOWS } from '../../src/core/profiles.js';

const repoPath = (...parts: string[]) => path.join(process.cwd(), ...parts);
const readGuidance = (...parts: string[]) => readFileSync(repoPath(...parts), 'utf8');

describe('code-review dispatch guidance', () => {
  it('uses the timing-oriented source path without a duplicate legacy alias', () => {
    const renamedSkill = repoPath('skills', 'when-to-dispatch-code-review', 'SKILL.md');
    const legacySkill = repoPath('skills', 'requesting-code-review');

    expect(existsSync(renamedSkill)).toBe(true);
    expect(existsSync(legacySkill)).toBe(false);

    const guidance = readFileSync(renamedSkill, 'utf8');
    expect(guidance).toContain('name: when-to-dispatch-code-review');
    expect(guidance).toContain('# When to Dispatch Code Review');
  });

  it('defines mode-specific timing and leaves Apply final-gate orchestration to Apply', () => {
    const guidance = readGuidance('skills', 'when-to-dispatch-code-review', 'SKILL.md');

    expect(guidance).toContain('Direct Modification');
    expect(guidance).toContain('Subagent-Driven Development');
    expect(guidance).toContain('Proposal → Review → Apply');
    expect(guidance).toContain('after Test Hardening');
    expect(guidance).toContain('Apply owns the mandatory host-native code-review gate');
    expect(guidance).not.toContain('one final cross-unit integration review');
    expect(guidance).not.toMatch(/review after (each|every) (task|batch)/i);
    expect(guidance).not.toContain('Review after each batch (3 tasks)');
  });

  it('keeps reviewers read-only by default and assigns accepted repairs to the coordinator', () => {
    const guidance = readGuidance('skills', 'when-to-dispatch-code-review', 'SKILL.md');
    const reviewer = readGuidance(
      'skills',
      'when-to-dispatch-code-review',
      'code-reviewer.md'
    );

    expect(guidance).toContain('read-only by default');
    expect(guidance).toMatch(/coordinator .*repair/i);
    expect(reviewer).toContain('read-only by default');
    expect(reviewer).toMatch(/Do not modify/i);
    expect(reviewer).toContain('complete integrated change');
  });

  it('does not register a generated Superpowers code-review workflow', () => {
    expect(ALL_WORKFLOWS).not.toContain('code-review' as (typeof ALL_WORKFLOWS)[number]);

    const profiles = readGuidance('src', 'core', 'profiles.ts');
    expect(profiles).not.toMatch(/['"]code-review['"]/);
  });
});
