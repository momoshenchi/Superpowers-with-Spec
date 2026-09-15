import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import {
  getApplyChangeReferences,
  getChangeReviewSkillTemplate,
  getSpVerifyCommandTemplate,
  getVerifyChangeReferences,
  getVerifyChangeSkillTemplate,
} from '../../../src/core/templates/skill-templates.js';
import { getFinalQualityGateInstructions } from '../../../src/core/templates/workflows/final-quality-gates.js';

const ROOT = process.cwd();

/** Shared open-status incomplete-evidence wording (FQG + Verify). */
const OPEN_STATUS_INCOMPLETE =
  /Status `open`|Status \`open\`|open` →|open\` →/i;

describe('invariants and remediations conventions', () => {
  it('keeps legacy covered alias in Test Hardening completeness set', () => {
    const src = fs.readFileSync(
      path.join(ROOT, 'src', 'commands', 'workflow', 'instructions.ts'),
      'utf8'
    );
    expect(src).toMatch(/COMPLETE_TEST_PLAN_STATUSES[\s\S]*?'covered'/);
  });

  it('ships a remediations.md template with required repair fields', () => {
    const template = fs.readFileSync(
      path.join(ROOT, 'schemas', 'spec-driven', 'templates', 'remediations.md'),
      'utf8'
    );

    for (const field of [
      'Finding',
      'Solutions',
      'Choice',
      'Rationale',
      'Root cause',
      'Fix',
      'Guard',
      'Evidence',
      'Status',
    ]) {
      expect(template).toContain(field);
    }
    expect(template).toMatch(/RM-1|## RM-1/);
    expect(template).not.toMatch(/^## R1\b/m);
    expect(template).toMatch(/≥2|at least two|two meaningfully/i);
  });

  it('Final Quality Gates require remediations before accepted code-review/Verify P0/P1 repairs', () => {
    const fqg = getFinalQualityGateInstructions();
    const applyFqg =
      getApplyChangeReferences().find((file) =>
        file.relativePath.endsWith('final-quality-gates.md')
      )?.content ?? '';

    for (const content of [fqg, applyFqg]) {
      expect(content).toContain('remediations.md');
      expect(content).toMatch(/create or append|create\/append|create-or-append/i);
      expect(content).toMatch(/before .*edit|before implementation/i);
      expect(content).toMatch(/P0|P1/);
      expect(content).toMatch(/Solutions|≥2|at least two/i);
      expect(content).toMatch(/N\/A — no accepted P0\/P1 repairs|omit.*remediations/i);
      expect(content).toMatch(/Design Verify|P2/);
      expect(content).toMatch(/Guard/);
      expect(content).toMatch(/change directory|change-dir|changes\/<name>\/remediations/i);
      expect(content).toMatch(/RM#|Remediation:/);
      expect(content).toMatch(/Finding/);
      expect(content).toMatch(OPEN_STATUS_INCOMPLETE);
      expect(content).toMatch(/code review.*Verify workers MUST probe|code review\*\* and \*\*Verify\*\* workers MUST probe/i);
    }
  });

  it('Verify probes change-dir remediations and treats invariant owner-check failure as P0', () => {
    const verify = [
      getVerifyChangeSkillTemplate().instructions,
      ...getVerifyChangeReferences().map((file) => file.content),
    ].join('\n');
    const verifyCmd = [
      getSpVerifyCommandTemplate().content,
      ...getVerifyChangeReferences().map((file) => file.content),
    ].join('\n');

    for (const content of [verify, verifyCmd]) {
      expect(content).toContain('## Invariants');
      expect(content).toContain('N/A — no cross-path invariants');
      expect(content).toMatch(/`P0`/);
      expect(content).toContain('remediations.md');
      expect(content).toMatch(/change directory|changes\/<name>\/remediations|probe/i);
      expect(content).toMatch(/contextFiles/);
      expect(content).toMatch(/Guard/);
      expect(content).toMatch(/owner check|owner test/i);
      expect(content).toMatch(OPEN_STATUS_INCOMPLETE);
    }
  });

  it('change-review still exposes Invariants P0 wording via generated templates', () => {
    const review = getChangeReviewSkillTemplate().instructions;
    expect(review).toContain('## Invariants');
    expect(review).toMatch(/missing.*Invariants.*`P0`|Invariants.*`P0`/i);
  });

  it('applyRequires in package schema still excludes remediations', () => {
    const schema = fs.readFileSync(path.join(ROOT, 'schemas', 'spec-driven', 'schema.yaml'), 'utf8');
    expect(schema).toMatch(/apply:\s*\n\s*requires:\s*\[[^\]]*test-plan[^\]]*\]/);
    expect(schema).not.toMatch(/apply:\s*\n\s*requires:[^\n]*remediations/);
  });
});
