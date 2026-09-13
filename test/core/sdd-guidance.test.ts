import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const sdd = readFileSync(
  path.join(process.cwd(), 'skills/subagent-driven-development/SKILL.md'),
  'utf8'
);

describe('subagent-driven-development guidance', () => {
  it('triggers only as Apply dispatch guidance, not as an independent implementation entry', () => {
    const descriptionLine = sdd.split('\n').find((l) => l.startsWith('description:'))!;
    expect(descriptionLine).toMatch(/\/sp:apply/);
    expect(descriptionLine).not.toMatch(/independent tasks in the current session/);
    expect(sdd).toContain('This skill is Apply dispatch guidance only');
  });
  it('does not require reading all artifacts once', () => {
    expect(sdd).not.toMatch(
      /Read the proposal, specs, design, `tasks.md`, and `execution-plan.md` once/
    );
    expect(sdd).toMatch(/dispatch unit/i);
  });

  it('keeps persist-until-done and allows inline execution when spawn is missing', () => {
    expect(sdd).toMatch(/Do not pause to check in|Continuous execution|persist/i);
    expect(sdd).toMatch(/inline/i);
  });
});
