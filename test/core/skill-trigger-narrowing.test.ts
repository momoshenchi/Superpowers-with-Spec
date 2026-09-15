import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  getApplyChangeSkillTemplate,
  getSpApplyCommandTemplate,
} from '../../src/core/templates/skill-templates.js';

const root = process.cwd();

function readSkill(name: string): string {
  return readFileSync(path.join(root, 'skills', name, 'SKILL.md'), 'utf8');
}

function yamlDescription(content: string): string {
  return content.split('\n').find((line) => line.startsWith('description:')) ?? '';
}

const qa = readSkill('full-qa-test');
const wt = readSkill('using-git-worktrees');
const finish = readSkill('finishing-a-development-branch');
const hook = readFileSync(path.join(root, 'hooks', 'session-start'), 'utf8');
const claude = readFileSync(path.join(root, 'CLAUDE.md'), 'utf8');

describe('skill-trigger-narrowing', () => {
  it('full-qa-test description does not match generic unit-test writing', () => {
    const desc = yamlDescription(qa);
    expect(desc).not.toMatch(/writing comprehensive test plans or cases for features/i);
  });

  it('session-start does not embed using-superpowers body', () => {
    expect(hook).not.toMatch(/cat "\$\{PLUGIN_ROOT\}\/skills\/using-superpowers\/SKILL.md"/);
    expect(hook).not.toMatch(/Select one of exactly two work modes/);
    expect(hook).toMatch(/using-superpowers/);
  });

  it('apply does not refer to the TDD skill file', () => {
    const text = getApplyChangeSkillTemplate().instructions + getSpApplyCommandTemplate().content;
    expect(text).not.toMatch(/Please refer to the `test-driven-development` skill/);
  });

  it('apply does not refer to the TDD or VBC skill files', () => {
    const text = getApplyChangeSkillTemplate().instructions + getSpApplyCommandTemplate().content;
    expect(text).not.toMatch(/Please refer to the `test-driven-development` skill/);
    expect(text).not.toMatch(/verification-before-completion` skill/);
    expect(text).toMatch(/matching-stage|observable automated behavior/);
  });

  it('CLAUDE.md has no Skills merchandising list', () => {
    expect(claude).not.toMatch(/^## Skills$/m);
    expect(claude).toMatch(/npm test/);
  });

  it('worktrees description is not an Apply precondition', () => {
    expect(wt).not.toMatch(/REQUIRED before executing any tasks/);
  });

  it('finishing-a-branch description waits for an integration request', () => {
    const desc = yamlDescription(finish);
    expect(desc).not.toMatch(/implementation is complete, all tests pass/i);
  });

  it('catalog descriptions stay non-empty and name when not to use', () => {
    for (const desc of [yamlDescription(qa), yamlDescription(wt), yamlDescription(finish)]) {
      const value = desc.replace(/^description:\s*/, '').trim();
      expect(value.length).toBeGreaterThan(20);
      expect(value).toMatch(/do not use|not for|only when|when the user/i);
    }
  });

  it('CLAUDE.md keeps Slash Commands after dropping Skills', () => {
    expect(claude).toMatch(/^## Slash Commands$/m);
  });

  it('session-start emits valid JSON without embedding the router body', () => {
    const stdout = execFileSync('bash', [path.join(root, 'hooks', 'session-start')], {
      encoding: 'utf8',
      env: { ...process.env, HOME: process.env.HOME ?? '/tmp' },
    });
    const payload = JSON.parse(stdout);
    expect(payload.additional_context).toMatch(/using-superpowers/);
    expect(payload.additional_context).not.toMatch(/Select one of exactly two work modes/);
    expect(payload.hookSpecificOutput.additionalContext).toMatch(/using-superpowers/);
  });

  it('full-qa-test procedure body is unchanged besides the YAML description', () => {
    const stripFrontmatter = (text: string) => text.replace(/^---\n[\s\S]*?\n---\n/, '');
    const current = stripFrontmatter(qa);
    const main = stripFrontmatter(
      execFileSync('git', ['show', 'main:skills/full-qa-test/SKILL.md'], {
        encoding: 'utf8',
        cwd: root,
      })
    );
    expect(current).toBe(main);
  });
});
