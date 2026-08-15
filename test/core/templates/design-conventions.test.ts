import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import {
  getChangeReviewSkillTemplate,
  getExploreSkillTemplate,
  getSpExploreCommandTemplate,
  getSpProposeCommandTemplate,
  getSpProposeSkillTemplate,
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

function expectCurrentSystemOnboarding(content: string) {
  expect(content).toContain('Teach a new engineer');
  expect(content).toContain('A table or bullet list of file paths is not Current system');
  expect(content).toMatch(/prose still explains behavior/i);
}

function expectUserRealChoiceRules(content: string) {
  expect(content).toContain('user actually chose');
  expect(content).toContain('Do not invent A/B/C');
  expect(content).toMatch(/agent-owned/i);
}

describe('change design conventions sources', () => {
  it('package design template includes Current system, Relationship, Contracts, user-real choice, and ordered sections', () => {
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
    expectCurrentSystemOnboarding(template);
    expectUserRealChoiceRules(template);
    expect(template).toContain('**User selection:**');
    expect(template).toContain('### 2. <!-- Agent-owned implementation decision -->');
    expect(template).not.toMatch(/Major decisions[\s\S]{0,200}at least three/i);
    expect(template).not.toContain('do not invent three fake alternatives');
  });

  it('schema design instruction requires Current system onboarding, Contracts, pointers, user-real choices, and visual DESIGN.md handling', () => {
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
    expectCurrentSystemOnboarding(instruction);
    expect(instruction).toContain('Relationship to existing tech');
    expect(instruction).toContain('Pointer');
    expect(instruction).toContain('reuse | extend | replace | boundary | retire');
    expect(instruction).toContain('Contracts');
    expect(instruction).toContain('N/A — no API/state/error surface change');
    expectUserRealChoiceRules(instruction);
    expect(instruction).not.toContain('record a comparison of **at least three** options');
    expect(instruction).toContain('visual DESIGN.md');
    expect(instruction).toContain('google-labs');
    expect(instruction).toContain('attachments/');
    expect(instruction).toContain('@google/design.md');
    expect(instruction).not.toContain('docs/detailed_doc');
    expect(instruction).toContain('which choices the user actually made');
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
    expectCurrentSystemOnboarding(fallback);
    expectUserRealChoiceRules(fallback);
    expect(fallback).toContain('**User selection:**');
    expect(fallback).toContain('Agent-owned');
    expect(fallback).toContain('### API / CLI');
    expect(fallback).not.toMatch(/compare >=3 options/i);
  });

  it('explore skill and command diverge in conversation and record comparison only after user choice', () => {
    for (const template of [getExploreSkillTemplate(), getSpExploreCommandTemplate()]) {
      const content = 'instructions' in template ? template.instructions : template.content;
      expect(content).toMatch(/at least three approaches/i);
      expect(content).toContain('only if the user chose');
      expect(content).toContain('Do not invent A/B/C');
      expect(content).toMatch(/[Mm]inor/);
      expect(content).toContain('DESIGN.md');
      expect(content).not.toContain('propose 2-3 approaches');
      expect(content).not.toMatch(/Design later \*\*converges\*\*: record the comparison table/i);
    }
  });

  it('generated change-review templates enforce Current system onboarding and user-real choice', () => {
    for (const content of [
      getChangeReviewSkillTemplate().instructions,
      getSpReviewCommandTemplate().content,
    ]) {
      for (const anchor of DESIGN_CONVENTION_ANCHORS) {
        expect(content).toContain(anchor);
      }
      expect(content).toContain('Design convention checks');
      expect(content).toMatch(/reuse \| extend \| replace \| boundary \| retire/);
      expect(content).toContain('file-path dump');
      expect(content).toContain('invented alternatives');
      expect(content).toContain('user actually chose');
      expect(content).toContain('**User selection:**');
      expect(content).toContain('agent-owned');
      expect(content).toContain('not a finding');
      expect(content).not.toMatch(/major decisions need \*\*≥3 options\*\* recorded/i);
    }
  });

  it('repo change-review skill stays aligned with generated review design-convention anchors', () => {
    const skill = fs.readFileSync(
      path.join(ROOT, '.vscode', 'important_skills', 'change-review', 'SKILL.md'),
      'utf8'
    );
    const generated = getChangeReviewSkillTemplate().instructions;

    for (const anchor of DESIGN_CONVENTION_ANCHORS) {
      expect(skill, `repo skill missing ${anchor}`).toContain(anchor);
      expect(generated, `generated review missing ${anchor}`).toContain(anchor);
    }

    expect(skill).toMatch(/不得.*三方案|细节.*仅需理由|不成问题/);
    expect(skill).toMatch(/真实选择|用户.*选择/);
    expect(skill).toMatch(/文件路径|路径表|文件清单/);
    expect(generated).toContain('not a finding');
    expect(generated).toContain('invented alternatives');
    expect(skill).toContain('Pointer');
    expect(skill).toContain('视觉 DESIGN.md');
  });

  it('Propose records option tables only for user-confirmed choices', () => {
    for (const template of [getSpProposeSkillTemplate(), getSpProposeCommandTemplate()]) {
      const content = 'instructions' in template ? template.instructions : template.content;
      expect(content).toContain('route confirmed product decisions into proposal.md');
      expect(content).toContain('Route each high-impact technical decision into design.md');
      expect(content).toContain('user actually chose');
      expect(content).toContain('Do not invent A/B/C');
      expect(content).toContain('agent-owned');
      expect(content).not.toContain('major decisions must compare at least three options');
    }
  });
});
