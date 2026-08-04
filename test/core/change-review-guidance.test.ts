import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import { getChangeReviewSkillTemplate } from '../../src/core/templates/skill-templates.js';

describe('change review guidance contract', () => {
  it('keeps repository-local guidance aligned with generated review behavior', () => {
    const rootSkill = fs.readFileSync(
      path.join(process.cwd(), '.vscode', 'important_skills', 'change-review', 'SKILL.md'),
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
      'fresh subagent',
      'three rounds',
      'Step 1–5',
      'Do not create `review.md`',
      'dispatch unit',
    ]) {
      expect(rootSkill).toContain(requirement);
      expect(generated).toContain(requirement);
    }

    expect(rootSkill).toContain('最多三轮');
    expect(rootSkill.toLowerCase()).toContain('assignee policy');
    expect(generated.toLowerCase()).toContain('assignee policy');
    expect(generated).toContain('Dispatch Coordination');
    expect(rootSkill).toContain('Final Quality Gates');
    expect(generated).toContain('final integration review');
    expect(rootSkill).not.toContain('repair every resolvable BLOCKER and WARNING');
    expect(generated).not.toContain('repair every resolvable BLOCKER and WARNING');
    expect(rootSkill).not.toContain('2–20 minutes');
    expect(generated).not.toContain('2–20 minutes');
  });
});
