import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const readGuidance = (...parts: string[]) =>
  readFileSync(path.join(process.cwd(), ...parts), 'utf8');

describe('subagent dispatch-unit guidance', () => {
  it('dispatches logical dispatch units and supports legacy task lists', () => {
    const skill = readGuidance('skills', 'subagent-driven-development', 'SKILL.md');
    const prompt = readGuidance('skills', 'subagent-driven-development', 'implementer-prompt.md');

    expect(skill).toContain('# <number>. <scope>');
    expect(skill).toContain('logical dispatch-unit');
    expect(skill).toContain('combine compatible dispatch units');
    expect(skill).toContain('execute all dispatch units sequentially');
    expect(skill).toContain('one sequential dispatch unit');
    expect(skill).toContain('Legacy');
    expect(skill).not.toContain('fresh subagent per task');
    expect(prompt).toContain('complete dispatch unit');
  });

  it('uses one final integration review with targeted verification after fixes', () => {
    const development = readGuidance('skills', 'subagent-driven-development', 'SKILL.md');
    const review = readGuidance('skills', 'when-to-dispatch-code-review', 'SKILL.md');
    const reviewer = readGuidance(
      'skills',
      'subagent-driven-development',
      'code-quality-reviewer-prompt.md'
    );

    expect(development).toContain('one final cross-unit integration review');
    expect(development).toContain('targeted verification');
    expect(development).not.toContain('two-stage review');
    expect(review).toContain('After all units are integrated');
    expect(review).toContain('one final cross-unit integration review');
    expect(review).not.toContain('Review after EACH task');
    expect(reviewer).toContain('all dispatch units are integrated');
    expect(reviewer).toContain('read-only by default');
  });
});
