import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import { getChangeReviewSkillTemplate } from '../../src/core/templates/skill-templates.js';

describe('change review guidance contract', () => {
  it('keeps repository-local guidance aligned with generated review behavior', () => {
    const rootSkill = fs.readFileSync(
      path.join(process.cwd(), 'skills', 'change-review', 'SKILL.md'),
      'utf8'
    );
    const generated = getChangeReviewSkillTemplate().instructions;

    for (const requirement of [
      'BLOCKER',
      'WARNING',
      'SUGGESTION',
      'present the complete review report',
      'repair every resolvable BLOCKER',
      're-run review only after repairing one or more BLOCKERs',
      'Step 1–5',
      'final integration review',
      'Do not create `review.md`',
      'dispatch unit',
    ]) {
      expect(rootSkill).toContain(requirement);
      expect(generated).toContain(requirement);
    }

    expect(rootSkill.toLowerCase()).toContain('assignee policy');
    expect(generated.toLowerCase()).toContain('assignee policy');
    expect(generated).toContain('Dispatch Coordination');
    expect(rootSkill).not.toContain('repair every resolvable BLOCKER and WARNING');
    expect(generated).not.toContain('repair every resolvable BLOCKER and WARNING');
    expect(rootSkill).not.toContain('2–20 minutes');
    expect(generated).not.toContain('2–20 minutes');
  });
});
