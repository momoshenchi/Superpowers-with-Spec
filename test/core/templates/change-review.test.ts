import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import {
  getChangeReviewSkillTemplate,
  getApplyChangeSkillTemplate,
  getSpApplyCommandTemplate,
  getSpProposeCommandTemplate,
  getSpProposeSkillTemplate,
  getSpReviewCommandTemplate,
} from '../../../src/core/templates/skill-templates.js';

describe('change review workflow templates', () => {
  it('provides a schema-aware manual review skill and optional change command', () => {
    const skill = getChangeReviewSkillTemplate();
    const command = getSpReviewCommandTemplate();

    expect(skill.name).toBe('superpowers-change-review');
    expect(command.name).toBe('SP: Review');
    expect(command.content).toContain('/sp:review <change>');

    for (const content of [skill.instructions, command.content]) {
      expect(content).toContain('superpowers status --change "<name>" --json');
      expect(content).toContain('superpowers validate <name>');
      expect(content).toContain('BLOCKER');
      expect(content).toContain('WARNING');
      expect(content).toContain('SUGGESTION');
      expect(content).toContain('Step 1–5');
      expect(content).toContain('final integration review');
      expect(content).toContain('dispatch unit');
    }
  });

  it('defines report-before-repair and blocker-gated re-review boundaries', () => {
    const content = getChangeReviewSkillTemplate().instructions;

    expect(content.indexOf('present the complete review report')).toBeGreaterThan(-1);
    expect(content.indexOf('repair every resolvable BLOCKER')).toBeGreaterThan(
      content.indexOf('present the complete review report')
    );
    expect(content).toContain('re-run review only after repairing one or more BLOCKERs');
    expect(content).toContain(
      'Do not re-run full proposal review solely because WARNING or SUGGESTION findings were present or repaired'
    );
    expect(content).toContain('SUGGESTION findings are non-blocking');
    expect(content).toContain('no unresolved BLOCKER remains');
    expect(content).not.toContain('repair every resolvable BLOCKER and WARNING');
    expect(content).not.toContain('no unresolved BLOCKER or WARNING remains');
    expect(content).toContain('Do not create `review.md`');
    expect(content).toContain('does not automatically repeat proposal review');
    expect(content).toContain('# <number>. <scope>');
    expect(content).toContain('legacy');
    expect(content).toContain('Dispatch Coordination');
    expect(content).toContain('assignee policy');
  });

  it('runs the automatic loop from propose, but never repeats it from apply', () => {
    for (const template of [getSpProposeSkillTemplate(), getSpProposeCommandTemplate()]) {
      const content = 'instructions' in template ? template.instructions : template.content;
      expect(content).toContain('present the complete review report');
      expect(content).toContain('Repair every resolvable BLOCKER.');
      expect(content).toContain('re-run review only after repairing one or more BLOCKERs');
      expect(content).toContain('Do not create `review.md`');
      expect(content).toContain('Dispatch Units in tasks.md');
      expect(content).toContain('# <number>. <scope>');
      expect(content).not.toContain('Repair every resolvable BLOCKER and WARNING');
    }

    for (const template of [getApplyChangeSkillTemplate(), getSpApplyCommandTemplate()]) {
      const content = 'instructions' in template ? template.instructions : template.content;
      expect(content).toContain('Do not automatically repeat proposal review before starting');
      expect(content).toContain('Keep the final integration review separate');
    }
  });

  it('keeps review out of the spec-driven schema artifact graph', () => {
    const schema = fs.readFileSync(
      path.join(process.cwd(), 'schemas', 'spec-driven', 'schema.yaml'),
      'utf8'
    );

    expect(schema).not.toMatch(/^\s*-\s+id:\s*review\s*$/m);
    expect(schema).not.toContain('review.md');
  });

  it('includes design convention checks for Current system, Contracts, pointers, scale-aware decisions, and visual DESIGN.md', () => {
    for (const content of [
      getChangeReviewSkillTemplate().instructions,
      getSpReviewCommandTemplate().content,
    ]) {
      expect(content).toContain('Design convention checks');
      expect(content).toContain('## Current system');
      expect(content).toContain('## Contracts');
      expect(content).toContain('N/A — no API/state/error surface change');
      expect(content).toContain('Pointer');
      expect(content).toContain('visual DESIGN.md');
      expect(content).toContain('google-labs');
      expect(content).toMatch(/≥3 options/);
      expect(content).toContain('Minor');
      expect(content).toContain('not a finding');
    }
  });
});
