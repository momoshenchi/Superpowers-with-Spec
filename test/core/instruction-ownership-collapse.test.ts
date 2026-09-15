import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { OBSOLETE_BUNDLED_SKILL_DIRS } from '../../src/core/shared/index.js';
import {
  getApplyChangeSkillTemplate,
  getSpApplyCommandTemplate,
} from '../../src/core/templates/skill-templates.js';

const root = process.cwd();

describe('instruction-ownership-collapse', () => {
  it('init removes verification-before-completion', () => {
    expect([...OBSOLETE_BUNDLED_SKILL_DIRS]).toEqual(
      expect.arrayContaining([
        'verification-before-completion',
        'subagent-driven-development',
        'when-to-dispatch-code-review',
      ])
    );
    expect(existsSync(path.join(root, 'skills', 'verification-before-completion', 'SKILL.md'))).toBe(
      false
    );
  });

  it('apply has no extra complete integration review', () => {
    expect(getApplyChangeSkillTemplate().instructions).not.toMatch(
      /Keep the final integration review separate/
    );
  });

  it('apply does not pause on every implementation issue', () => {
    const text =
      getApplyChangeSkillTemplate().instructions + getSpApplyCommandTemplate().content;
    expect(text).not.toMatch(/If implementation reveals issues, pause/);
  });

  it('using-superpowers reference has no host tool maps', () => {
    expect(
      existsSync(path.join(root, 'skills', 'using-superpowers', 'reference', 'codex-tools.md'))
    ).toBe(false);
    expect(
      existsSync(path.join(root, 'skills', 'using-superpowers', 'reference', 'copilot-tools.md'))
    ).toBe(false);
    expect(
      existsSync(path.join(root, 'skills', 'using-superpowers', 'reference', 'gemini-tools.md'))
    ).toBe(false);
  });

  it('systematic-debugging live dir has no CREATION-LOG', () => {
    expect(existsSync(path.join(root, 'skills', 'systematic-debugging', 'CREATION-LOG.md'))).toBe(
      false
    );
    expect(
      existsSync(path.join(root, 'skills', 'systematic-debugging', 'test-pressure-4.md'))
    ).toBe(false);
  });

  it('using-superpowers states matching-stage evidence', () => {
    const usingSuperpowers = readFileSync(
      path.join(root, 'skills', 'using-superpowers', 'SKILL.md'),
      'utf8'
    );
    expect(usingSuperpowers).toMatch(/fresh run of the current-stage command|matching-stage/);
    expect(usingSuperpowers).not.toMatch(/GPT6-guide/);
  });

  it('finishing-a-branch does not require VBC or SDD', () => {
    const finish = readFileSync(
      path.join(root, 'skills', 'finishing-a-development-branch', 'SKILL.md'),
      'utf8'
    );
    expect(finish).not.toMatch(/verification-before-completion/);
    expect(finish).not.toMatch(/subagent-driven-development/);
  });

  it('debug and worktrees do not require retired skills', () => {
    const debug = readFileSync(path.join(root, 'skills', 'systematic-debugging', 'SKILL.md'), 'utf8');
    const worktrees = readFileSync(path.join(root, 'skills', 'using-git-worktrees', 'SKILL.md'), 'utf8');
    for (const text of [debug, worktrees]) {
      expect(text).not.toMatch(/verification-before-completion/);
      expect(text).not.toMatch(/subagent-driven-development/);
      expect(text).not.toMatch(/when-to-dispatch-code-review/);
    }
  });

  it('apply continues reversible in-scope repairs', () => {
    const text =
      getApplyChangeSkillTemplate().instructions + getSpApplyCommandTemplate().content;
    expect(text).toMatch(/Continue reversible in-scope repairs/);
    expect(text).toMatch(/Compile or test errors caused by the current authorized diff are fixed/);
  });

  it('using-superpowers owns Direct Modification review timing', () => {
    const usingSuperpowers = readFileSync(
      path.join(root, 'skills', 'using-superpowers', 'SKILL.md'),
      'utf8'
    );
    expect(usingSuperpowers).toMatch(/Small local Direct Modification edits do not require automatic code review/);
  });
});
