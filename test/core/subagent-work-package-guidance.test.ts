import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const readGuidance = (...parts: string[]) =>
  readFileSync(path.join(process.cwd(), ...parts), 'utf8');

describe('subagent work-package guidance', () => {
  it('dispatches logical work packages and supports legacy task lists', () => {
    const skill = readGuidance('skills', 'subagent-driven-development', 'SKILL.md');
    const prompt = readGuidance('skills', 'subagent-driven-development', 'implementer-prompt.md');

    expect(skill).toContain('# <work-package-number>. agent<logical-id> — <scope>');
    expect(skill).toContain('logical work-package');
    expect(skill).toContain('combine compatible work packages');
    expect(skill).toContain('execute all work packages sequentially');
    expect(skill).toContain('one sequential work package');
    expect(skill).not.toContain('fresh subagent per task');
    expect(prompt).toContain('complete work-package block');
  });

  it('uses one final integration review with targeted verification after fixes', () => {
    const development = readGuidance('skills', 'subagent-driven-development', 'SKILL.md');
    const review = readGuidance('skills', 'requesting-code-review', 'SKILL.md');
    const reviewer = readGuidance(
      'skills',
      'subagent-driven-development',
      'code-quality-reviewer-prompt.md'
    );

    expect(development).toContain('one final cross-package integration review');
    expect(development).toContain('targeted verification');
    expect(development).not.toContain('two-stage review');
    expect(review).toContain('after all work packages are integrated');
    expect(review).not.toContain('Review after EACH task');
    expect(reviewer).toContain('all work packages are integrated');
  });
});
