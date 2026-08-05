import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const readGuidance = (...parts: string[]) =>
  readFileSync(path.join(process.cwd(), ...parts), 'utf8');

describe('implementation-notes guidance', () => {
  it('defines per-step implementation notes as non-stateful context', () => {
    const template = readGuidance('schemas', 'spec-driven', 'templates', 'execution-plan.md');
    const schema = readGuidance('schemas', 'spec-driven', 'schema.yaml');

    for (const content of [template, schema]) {
      expect(content).toContain('Implementation Notes');
      expect(content).toContain('non-normative');
      expect(content).toContain('Findings');
      expect(content).toContain('Reasoning');
      expect(content).toContain('Viewpoints / Trade-offs');
      expect(content).toContain('Summary / Takeaway');
      expect(content).toContain('tasks.md');
    }

    expect(template).toContain('After any Step 1–5');
    expect(schema).toContain('must not become an execution status tracker');
  });

  it('requires workers to capture insights and coordinators to review them', () => {
    const development = readGuidance('skills', 'subagent-driven-development', 'SKILL.md');
    const prompt = readGuidance(
      'skills',
      'subagent-driven-development',
      'implementer-prompt.md'
    );
    const apply = readGuidance('src', 'core', 'templates', 'workflows', 'apply-change.ts');

    for (const content of [development, prompt, apply]) {
      expect(content).toContain('Implementation Notes');
      expect(content).toContain('non-normative');
      expect(content).toContain('tasks.md');
    }

    expect(development).toContain('main agent reviews');
    expect(prompt).toContain('Findings');
    expect(prompt).toContain('Reasoning');
    expect(prompt).toContain('Viewpoints / Trade-offs');
    expect(prompt).toContain('Summary / Takeaway');
  });

  it('protects shared execution-plan notes when dispatch units run in parallel', () => {
    const development = readGuidance('skills', 'subagent-driven-development', 'SKILL.md');
    const prompt = readGuidance(
      'skills',
      'subagent-driven-development',
      'implementer-prompt.md'
    );

    expect(development).toMatch(/serialize writes to shared execution-plan\.md/i);
    expect(prompt).toContain('do not overwrite another dispatch unit\'s notes');
  });
});
