import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import {
  getApplyChangeReferences,
  getApplyChangeSkillTemplate,
  getSpApplyCommandTemplate,
  getVerifyChangeReferences,
} from '../../src/core/templates/skill-templates.js';

const readGuidance = (...parts: string[]) =>
  readFileSync(path.join(process.cwd(), ...parts), 'utf8');

const GIT_RELATED_PHRASES = [
  'Prefer Git-related tests',
  'Git-aware selection',
  'merge-base',
  'git-aware-unavailable-recorded',
  'Empty related selection is not a pass',
] as const;

describe('git-related test selection guidance', () => {
  it('applies Git-related selection in apply and verify canonical preflight', () => {
    const applyHardening =
      getApplyChangeReferences().find((file) => file.relativePath.endsWith('test-hardening.md'))
        ?.content ?? '';
    const verifyReport =
      getVerifyChangeReferences().find((file) => file.relativePath.endsWith('verify-report.md'))
        ?.content ?? '';
    for (const content of [applyHardening, verifyReport]) {
      for (const phrase of GIT_RELATED_PHRASES) {
        expect(content).toContain(phrase);
      }
      expect(content).not.toMatch(/fail-closed and run the complete canonical non-visual suite/);
    }
  });

  it('uses Git-related tests for apply task verification instead of requiring the full suite', () => {
    for (const template of [getApplyChangeSkillTemplate(), getSpApplyCommandTemplate()]) {
      const content = 'instructions' in template ? template.instructions : template.content;
      expect(content).toContain('After the focused RED/GREEN test');
      expect(content).toContain('Do not require the complete canonical suite at task level');
    }
  });

  it('tells Direct Modification and TDD to prefer Git-related tests', () => {
    const usingSuperpowers = readGuidance('skills', 'using-superpowers', 'SKILL.md');
    const tdd = readGuidance('skills', 'test-driven-development', 'SKILL.md');
    const executionPlan = readGuidance(
      'schemas',
      'spec-driven',
      'templates',
      'execution-plan.md'
    );

    expect(usingSuperpowers).toContain('Git-related tests');
    expect(usingSuperpowers).toContain('Git-aware selection');
    expect(tdd).toContain('Git-related tests');
    expect(tdd).toContain('do not require the full suite');
    expect(usingSuperpowers).toContain('matching-stage');
    expect(executionPlan).toContain('Git-related tests');
  });
});
