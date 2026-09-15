import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { getApplyChangeReferences } from '../../src/core/templates/skill-templates.js';

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
    const apply = readGuidance('src', 'core', 'templates', 'workflows', 'apply-change.ts');
    const dispatch =
      getApplyChangeReferences().find((file) => file.relativePath.endsWith('dispatch-units.md'))
        ?.content ?? '';

    for (const content of [apply, dispatch]) {
      expect(content).toContain('Implementation Notes');
    }

    expect(apply).toContain('non-normative');
    expect(apply).toContain('tasks.md');
    expect(dispatch).toContain('Findings');
    expect(dispatch).toContain('Reasoning');
    expect(dispatch).toContain('Viewpoints / Trade-offs');
    expect(dispatch).toContain('Summary / Takeaway');
  });

  it('protects shared execution-plan notes when dispatch units run in parallel', () => {
    const apply = readGuidance('src', 'core', 'templates', 'workflows', 'apply-change.ts');
    const dispatch =
      getApplyChangeReferences().find((file) => file.relativePath.endsWith('dispatch-units.md'))
        ?.content ?? '';

    expect(apply).toMatch(/serialized when dispatch units run in parallel/i);
    expect(dispatch).toMatch(/do not overwrite another dispatch unit's notes/i);
  });
});
