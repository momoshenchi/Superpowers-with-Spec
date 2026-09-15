import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { generateCommand } from '../../src/core/command-generation/generator.js';
import {
  companionSkillTemplates,
  generateSkillContent,
  getSkillTemplates,
  skillReferenceDest,
  writeGeneratedSkill,
} from '../../src/core/shared/skill-generation.js';
import {
  getApplyChangeReferences,
  getApplyChangeSkillTemplate,
  getSpApplyCommandTemplate,
  getSpProposeSkillTemplate,
  getVerifyChangeSkillTemplate,
} from '../../src/core/templates/skill-templates.js';

const root = process.cwd();

function yamlDescription(content: string): string {
  return content.split('\n').find((line) => line.startsWith('description:')) ?? '';
}

function referenceContent(
  files: Array<{ relativePath: string; content: string }>,
  suffix: string
): string {
  return files.find((file) => file.relativePath.endsWith(suffix))?.content ?? '';
}

const tdd = readFileSync(path.join(root, 'skills', 'test-driven-development', 'SKILL.md'), 'utf8');
const dbg = readFileSync(path.join(root, 'skills', 'systematic-debugging', 'SKILL.md'), 'utf8');
const sp = readFileSync(path.join(root, 'skills', 'using-superpowers', 'SKILL.md'), 'utf8');

describe('stage-file-disclosure', () => {
  it('apply root omits remediations field list', () => {
    expect(getApplyChangeSkillTemplate().instructions).not.toMatch(/≥2 meaningfully different Solutions/);
    expect(getSpApplyCommandTemplate().content).not.toMatch(/≥2 meaningfully different Solutions/);
  });

  it('apply reference contains final quality gates', () => {
    const fqg = referenceContent(getApplyChangeReferences(), 'final-quality-gates.md');
    expect(fqg).toMatch(/Final Quality Gates/);
  });

  it('hardening reference still invokes full-qa-test', () => {
    const hardening = referenceContent(getApplyChangeReferences(), 'test-hardening.md');
    expect(hardening).toMatch(/full-qa-test/);
    expect(hardening).toMatch(/10/);
  });

  it('verify does not read all contextFiles', () => {
    expect(getVerifyChangeSkillTemplate().instructions).not.toMatch(
      /Read all available artifacts from `contextFiles`/
    );
    expect(getVerifyChangeSkillTemplate().instructions).toMatch(/catalog/);
  });

  it('propose root omits per-artifact instruction loop', () => {
    expect(getSpProposeSkillTemplate().instructions).not.toMatch(/superpowers instructions <artifact-id>/);
  });

  it('tdd root omits rationalization table', () => {
    expect(tdd).not.toMatch(/## Common Rationalizations/);
    expect(yamlDescription(tdd)).toMatch(/observable/);
  });

  it('tdd rationalizations live in the reference file', () => {
    const ref = readFileSync(
      path.join(root, 'skills', 'test-driven-development', 'reference', 'examples-and-rationalizations.md'),
      'utf8'
    );
    expect(ref).toMatch(/## Common Rationalizations/);
  });

  it('debug root omits evidence ledger', () => {
    expect(dbg).not.toMatch(/### Evidence ledger/);
    expect(dbg).toMatch(/already identified/i);
  });

  it('using-superpowers root omits eight-step decompose', () => {
    expect(sp).not.toMatch(/Inventory logical capabilities/);
  });

  it('apply root names companions and blocks when one is missing', () => {
    const rootText =
      getApplyChangeSkillTemplate().instructions + getSpApplyCommandTemplate().content;
    expect(rootText).toMatch(/reference\/runtime-before\.md/);
    expect(rootText).toMatch(/reference\/test-hardening\.md/);
    expect(rootText).toMatch(/reference\/final-quality-gates\.md/);
    expect(rootText).toMatch(/reference\/dispatch-units\.md/);
    expect(rootText).toMatch(/blocked/);
    expect(rootText).toMatch(/Do not skip the stage/);
    expect(rootText).toMatch(/Do not inline the missing recipe/);
  });

  it('hardening companion keeps the full-qa-test 10→10→10 bind', () => {
    const hardening = referenceContent(getApplyChangeReferences(), 'test-hardening.md');
    expect(hardening).toMatch(/full-qa-test/);
    expect(hardening).toMatch(/\*\*10\*\* test cases/);
    expect(hardening).toMatch(/30 cases per object per dimension/);
  });

  it('dispatch companion owns combine/inline/spawn assignment', () => {
    const dispatch = referenceContent(getApplyChangeReferences(), 'dispatch-units.md');
    expect(dispatch).toMatch(/combine compatible units/i);
    expect(dispatch).toMatch(/inline/i);
    expect(dispatch).toMatch(/spawn/i);
  });

  it('apply root does not inline the Hardening recipe', () => {
    expect(getApplyChangeSkillTemplate().instructions).not.toMatch(
      /Task completion transitions into Test Hardening/
    );
  });

  it('writes companions with path.join and keeps both emitters', () => {
    expect(skillReferenceDest('/tmp/skill', 'reference/final-quality-gates.md')).toBe(
      path.join('/tmp/skill', 'reference', 'final-quality-gates.md')
    );
    expect(typeof generateSkillContent).toBe('function');
    expect(typeof generateCommand).toBe('function');
  });

  it('applies the host transformer to companion files, not only SKILL.md', async () => {
    const writes = new Map<string, string>();
    await writeGeneratedSkill(
      path.join('/tmp', 'skill'),
      {
        name: 'demo',
        description: 'd',
        instructions: 'Use /sp:apply',
        references: [{ relativePath: 'reference/gates.md', content: 'Then /sp:verify and /sp:simplify' }],
      },
      '1.0.0',
      async (filePath, content) => {
        writes.set(filePath, content);
      },
      (text) => text.replaceAll('/sp:', '/sp-')
    );
    const companion = writes.get(path.join('/tmp', 'skill', 'reference', 'gates.md')) ?? '';
    expect(companion).toContain('/sp-verify');
    expect(companion).toContain('/sp-simplify');
    expect(companion).not.toMatch(/\/sp:/);
  });

  it('keeps Apply/Propose/Verify companions when delivery is commands-only', () => {
    const companions = companionSkillTemplates(getSkillTemplates());
    expect(companions.map((entry) => entry.dirName).sort()).toEqual([
      'superpowers-apply-change',
      'superpowers-propose',
      'superpowers-verify-change',
    ]);
  });
});
