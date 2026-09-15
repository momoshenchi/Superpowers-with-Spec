import { existsSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { getApplyChangeReferences } from '../../src/core/templates/skill-templates.js';

const dispatch = () =>
  getApplyChangeReferences().find((file) => file.relativePath.endsWith('dispatch-units.md'))
    ?.content ?? '';

describe('subagent-driven-development guidance', () => {
  it('retired SDD skill is not a live path', () => {
    expect(existsSync(path.join(process.cwd(), 'skills', 'subagent-driven-development', 'SKILL.md'))).toBe(
      false
    );
  });

  it('triggers only as Apply dispatch guidance, not as an independent implementation entry', () => {
    const text = dispatch();
    expect(text).toMatch(/dispatch unit/i);
    expect(text).toMatch(/inline/i);
    expect(text).not.toMatch(/independent implementation entry/i);
  });

  it('does not require reading all artifacts once', () => {
    expect(dispatch()).not.toMatch(
      /Read the proposal, specs, design, `tasks.md`, and `execution-plan.md` once/
    );
    expect(dispatch()).toMatch(/dispatch unit/i);
  });

  it('keeps persist-until-done and allows inline execution when spawn is missing', () => {
    expect(dispatch()).toMatch(/inline/i);
    expect(dispatch()).toMatch(/cannot spawn/i);
  });
});
