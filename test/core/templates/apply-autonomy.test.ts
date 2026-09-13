import { describe, expect, it } from 'vitest';

import {
  getApplyChangeSkillTemplate,
  getSpApplyCommandTemplate,
} from '../../../src/core/templates/workflows/apply-change.js';

function applyContents(): string[] {
  return [getApplyChangeSkillTemplate().instructions, getSpApplyCommandTemplate().content];
}

describe('Apply autonomy templates', () => {
  it('still invokes full-qa-test during Test Hardening', () => {
    for (const text of applyContents()) {
      expect(text).toContain('full-qa-test');
      expect(text).toMatch(/6 dimensions|six coverage dimensions|10\*\* test cases/);
    }
  });

  it('treats contextFiles as a catalog and reads the current dispatch unit', () => {
    for (const text of applyContents()) {
      expect(text).not.toMatch(/Always read context files before starting/);
      expect(text).toMatch(/current dispatch unit|current-unit/i);
    }
  });

  it('continues reversible in-scope repairs instead of waiting on every error', () => {
    for (const text of applyContents()) {
      expect(text).toMatch(/reversible in-scope repairs|Continue reversible/i);
      expect(text).not.toContain('Error or blocker encountered → report and wait for guidance');
      expect(text).not.toMatch(/should I continue\?/i);
    }
  });

  it('points later Hardening and Final Quality Gates sections from the opening', () => {
    const text = getApplyChangeSkillTemplate().instructions;
    const opening = text.slice(0, text.indexOf('**Steps**'));
    expect(opening).toMatch(/Test Hardening/);
    expect(opening).toMatch(/Final Quality Gates/);
  });

  it('runs full-qa-test expansion before Git-aware selection', () => {
    const text = getApplyChangeSkillTemplate().instructions;
    const hardening = text.slice(text.indexOf('Run Test Hardening'));
    const land = hardening.search(
      /land (new |those )?tests|write.*executable `form=unit`|before (running )?Git-aware/i,
    );
    const git = hardening.indexOf('Canonical non-visual test-suite preflight');
    expect(hardening).toMatch(/full-qa-test/);
    expect(land).toBeGreaterThan(-1);
    expect(git).toBeGreaterThan(land);
    expect(hardening).toMatch(
      /tree that contains those tests|selection can include tests added/i,
    );
  });
});
