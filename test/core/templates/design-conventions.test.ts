import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import {
  getChangeReviewSkillTemplate,
  getExploreSkillTemplate,
  getSpExploreCommandTemplate,
  getSpReviewCommandTemplate,
} from '../../../src/core/templates/skill-templates.js';

const ROOT = process.cwd();

const DESIGN_CONVENTION_ANCHORS = [
  '## Current system',
  '## Contracts',
  'N/A — no API/state/error surface change',
  'Pointer',
  'visual DESIGN.md',
  'google-labs',
] as const;

function expectSectionOrder(content: string, headings: string[]) {
  let cursor = -1;
  for (const heading of headings) {
    const index = content.indexOf(heading);
    expect(index, `missing section ${heading}`).toBeGreaterThan(-1);
    expect(index, `section order broken at ${heading}`).toBeGreaterThan(cursor);
    cursor = index;
  }
}

describe('change design conventions sources', () => {
  it('package design template includes Current system, Relationship, Contracts, minor placeholder, and ordered sections', () => {
    const template = fs.readFileSync(
      path.join(ROOT, 'schemas', 'spec-driven', 'templates', 'design.md'),
      'utf8'
    );

    expectSectionOrder(template, [
      '## Context',
      '## Current system',
      '### Relationship to existing tech',
      '## Goals / Non-Goals',
      '## Decisions',
      '## Contracts',
      '## Attachments',
      '## Risks / Trade-offs',
    ]);

    expect(template).toContain('Pointer');
    expect(template).toContain('reuse | extend | replace | boundary | retire');
    expect(template).toContain('N/A — no API/state/error surface change');
    expect(template).toContain('Major decisions');
    expect(template).toMatch(/≥3|at least three|>=3/i);
    expect(template).toContain('Minor decisions');
    expect(template).toContain('### 2. <!-- Minor decision name -->');
    expect(template).toContain('delete the table');
    expect(template).toContain('no three-option table');
  });

  it('schema design instruction requires Current system, Contracts, pointers, major/minor rules, and visual DESIGN.md handling', () => {
    const schema = fs.readFileSync(
      path.join(ROOT, 'schemas', 'spec-driven', 'schema.yaml'),
      'utf8'
    );

    const designBlockStart = schema.indexOf('- id: design');
    const tasksBlockStart = schema.indexOf('- id: tasks');
    expect(designBlockStart).toBeGreaterThan(-1);
    expect(tasksBlockStart).toBeGreaterThan(designBlockStart);
    const instruction = schema.slice(designBlockStart, tasksBlockStart);

    expect(instruction).toContain('Current system');
    expect(instruction).toContain('Title is exactly `## Current system`');
    expect(instruction).toContain('Relationship to existing tech');
    expect(instruction).toContain('Pointer');
    expect(instruction).toContain('reuse | extend | replace | boundary | retire');
    expect(instruction).toContain('Contracts');
    expect(instruction).toContain('N/A — no API/state/error surface change');
    expect(instruction).toContain('at least three');
    expect(instruction).toContain('Minor');
    expect(instruction).toContain('visual DESIGN.md');
    expect(instruction).toContain('google-labs');
    expect(instruction).toContain('attachments/');
    expect(instruction).toContain('@google/design.md');
    expect(instruction).not.toContain('docs/detailed_doc');
  });

  it('schema-init design fallback stays aligned with package skeleton shape', () => {
    const schemaTs = fs.readFileSync(path.join(ROOT, 'src', 'commands', 'schema.ts'), 'utf8');
    const caseStart = schemaTs.indexOf("case 'design':");
    const caseEnd = schemaTs.indexOf("case 'tasks':", caseStart);
    expect(caseStart).toBeGreaterThan(-1);
    expect(caseEnd).toBeGreaterThan(caseStart);
    const fallback = schemaTs.slice(caseStart, caseEnd);

    expectSectionOrder(fallback, [
      '## Context',
      '## Current system',
      '### Relationship to existing tech',
      '## Goals / Non-Goals',
      '## Decisions',
      '## Contracts',
      '## Attachments',
      '## Risks / Trade-offs',
      '## Migration Plan',
      '## Open Questions',
    ]);

    expect(fallback).toContain('Pointer');
    expect(fallback).toContain('N/A — no API/state/error surface change');
    expect(fallback).toMatch(/>=3|≥3|Major decision/i);
    expect(fallback).toContain('Minor decision');
    expect(fallback).toContain('do not invent fake alternatives');
    expect(fallback).toContain('### API / CLI');
  });

  it('explore skill and command both require major ≥3 diverge and design converge', () => {
    for (const template of [getExploreSkillTemplate(), getSpExploreCommandTemplate()]) {
      const content = 'instructions' in template ? template.instructions : template.content;
      expect(content).toMatch(/at least three approaches/i);
      expect(content).toMatch(/Design later \*\*converges\*\*|design later \*\*converges\*\*/i);
      expect(content).toMatch(/comparison table/i);
      expect(content).toMatch(/[Mm]inor/);
      expect(content).toMatch(/do not invent three fake alternatives/i);
      expect(content).toContain('DESIGN.md');
      expect(content).not.toContain('propose 2-3 approaches');
    }
  });

  it('generated change-review templates enforce design convention criteria with scale-aware severities', () => {
    for (const content of [
      getChangeReviewSkillTemplate().instructions,
      getSpReviewCommandTemplate().content,
    ]) {
      for (const anchor of DESIGN_CONVENTION_ANCHORS) {
        expect(content).toContain(anchor);
      }
      expect(content).toContain('Design convention checks');
      expect(content).toMatch(/reuse \| extend \| replace \| boundary \| retire/);
      expect(content).toMatch(/≥3 options/);
      expect(content).toContain('Minor');
      expect(content).toContain('not a finding');
    }
  });

  it('repo change-review skill stays aligned with generated review design-convention anchors', () => {
    const skill = fs.readFileSync(path.join(ROOT, 'skills', 'change-review', 'SKILL.md'), 'utf8');
    const generated = getChangeReviewSkillTemplate().instructions;

    for (const anchor of DESIGN_CONVENTION_ANCHORS) {
      expect(skill, `repo skill missing ${anchor}`).toContain(anchor);
      expect(generated, `generated review missing ${anchor}`).toContain(anchor);
    }

    // Scale-aware minor rule must exist on both sides (wording may differ by language).
    expect(skill).toMatch(/不得.*三方案|细节.*仅需理由|不成问题/);
    expect(generated).toContain('not a finding');
    expect(skill).toContain('Pointer');
    expect(skill).toMatch(/≥3|>=3/);
    expect(skill).toContain('视觉 DESIGN.md');
  });
});
