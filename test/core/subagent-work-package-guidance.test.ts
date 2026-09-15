import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { getApplyChangeReferences } from '../../src/core/templates/skill-templates.js';

const readGuidance = (...parts: string[]) =>
  readFileSync(path.join(process.cwd(), ...parts), 'utf8');

const dispatch = () =>
  getApplyChangeReferences().find((file) => file.relativePath.endsWith('dispatch-units.md'))
    ?.content ?? '';

describe('subagent dispatch-unit guidance', () => {
  it('selects one of the two work modes before invoking SDD execution', () => {
    const skill = readGuidance('skills', 'using-superpowers', 'SKILL.md');

    expect(skill).toContain('Direct Modification');
    expect(skill).toContain('Proposal → Review → Apply');
    expect(skill).toContain('matching-stage');
  });

  it('dispatches logical dispatch units and supports legacy task lists', () => {
    const text = dispatch();

    expect(text).toContain('# <number>. <scope>');
    expect(text).toMatch(/logical dispatch-unit/i);
    expect(text).toMatch(/combine compatible/i);
    expect(text).toMatch(/execute all units sequentially|execute all dispatch units sequentially/i);
    expect(text).not.toContain('fresh subagent per task');
  });

  it('hands final quality gates and completion sequencing to Apply', () => {
    const text = dispatch();
    const review = readGuidance('skills', 'using-superpowers', 'SKILL.md');

    expect(text).toMatch(/Test Hardening/);
    expect(text).toContain('Do not dispatch a separate complete review');
    expect(review).toMatch(/single integrated code review/);
    expect(text).not.toContain('one final cross-unit integration review');
    expect(review).not.toContain('one final cross-unit integration review');
  });

  it('routes Explore and Debug investigation before implementation dispatch', () => {
    const skill = readGuidance('skills', 'using-superpowers', 'SKILL.md');

    expect(skill).toContain('Direct Modification');
    expect(skill).toContain('Proposal → Review → Apply');
  });
});
