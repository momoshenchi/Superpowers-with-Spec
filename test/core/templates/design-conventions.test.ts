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
  '## Invariants',
  'N/A — no API/state/error surface change',
  'N/A — no cross-path invariants',
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

function expectImplementableDetail(content: string) {
  expect(content).toContain('Do not add required extra headings');
  expect(content).toContain('Authors MAY add extra subsections');
  expect(content).toContain('implementable detail');
  expect(content).toContain('worked example');
  expect(content).toContain('mapping rules');
}

function expectUserRealChoiceRules(content: string) {
  expect(content).toContain('user actually chose');
  expect(content).toMatch(/agent-owned/i);
  expect(content).toContain('MAY include an A/B/C');
  expect(content).toContain('strict, detailed analysis');
  expect(content).toContain('Do not present a model-inferred result as a user Choice');
}

const DERIVED_SCAN_DIMENSIONS = [
  'Actor, permission, and ownership',
  'Empty, deny, error, and fail-closed behavior',
  'Lifecycle: create, update, cancel, retry, and idempotency',
  'Compatibility and migration',
  'Data shape and contracts',
  'Important product-direction forks implied by the confirmed goal',
] as const;

function expectDerivedImplicationScan(content: string) {
  expect(content).not.toMatch(/^#{2,3} Derived implications/m);
  expect(content).toContain('## Decisions');
  expect(content).toContain('## Contracts');
  expect(content).toContain('## Invariants');
  for (const dimension of DERIVED_SCAN_DIMENSIONS) {
    expect(content).toContain(dimension);
  }
}

function expectProposeDerivedImplicationRules(content: string) {
  expectDerivedImplicationScan(content);
  expect(content).toContain('agent-owned derived assumptions');
  expect(content).toContain('non-boundary derived implications');
  expect(content).toContain('security, persisted-data, billing, or public-contract');
  expect(content).toContain('observable user behavior');
  expect(content).toContain('delta spec');
  expect(content).toContain('Implementation-only mappings may stay in design.md');
  expect(content).toContain('re-scan only dependent dimensions');
  expect(content).not.toContain('### Derived implications');
  expect(content.indexOf('Ask the user only when a derived implication')).toBeLessThan(
    content.indexOf('1. Confirm and create')
  );
}

function expectReviewDerivedImplicationRules(content: string) {
  expectDerivedImplicationScan(content);
  expect(content).toContain('Closed implication scan');
  expect(content).toContain('derived-implication gap');
  expect(content).toContain('never `P0` solely for a derived-implication gap');
  expect(content).toContain('delta-spec trace');
  expect(content).not.toMatch(/optional `### Derived implications`/i);
}

describe('change design conventions sources', () => {
  it('package design template includes Current system, Relationship, Contracts, Invariants, user-real choice, and ordered sections', () => {
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
      '## Invariants',
      '## Attachments',
      '## Risks / Trade-offs',
    ]);

    expect(template).toContain('Pointer');
    expect(template).toContain('reuse | extend | replace | boundary | retire');
    expect(template).toContain('N/A — no API/state/error surface change');
    expect(template).toContain('N/A — no cross-path invariants');
    expect(template).toMatch(/falsif/i);
    expect(template).toMatch(/owner (test|check)/i);
    expectCurrentSystemOnboarding(template);
    expectUserRealChoiceRules(template);
    expectImplementableDetail(template);
    expect(template).not.toContain('## Target flow');
    expect(template).toContain('**User selection:**');
    expect(template).toContain('### 2. <!-- Agent-owned implementation decision -->');
    expect(template).not.toMatch(/Major decisions[\s\S]{0,200}at least three/i);
    expect(template).not.toContain('do not invent three fake alternatives');
    expectDerivedImplicationScan(template);
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
    expect(instruction).toContain('## Invariants');
    expect(instruction).toContain('N/A — no cross-path invariants');
    expect(instruction).toMatch(/falsif/i);
    expect(instruction).toMatch(/owner (test|check)/i);
    expect(instruction).not.toMatch(/Target flow or Invariants/);
    expectUserRealChoiceRules(instruction);
    expectImplementableDetail(instruction);
    expect(instruction).not.toContain('## Target flow');
    expect(instruction).not.toContain('record a comparison of **at least three** options');
    expect(instruction).toContain('visual DESIGN.md');
    expect(instruction).toContain('google-labs');
    expect(instruction).toContain('attachments/');
    expect(instruction).toContain('@google/design.md');
    expect(instruction).not.toContain('docs/detailed_doc');
    expect(instruction).toContain('which choices the user actually made');
    expectDerivedImplicationScan(instruction);
    expect(instruction).toContain('never P0 solely for a derived-implication gap');
    expect(instruction).toContain('delta spec');
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
      '## Invariants',
      '## Attachments',
      '## Risks / Trade-offs',
      '## Migration Plan',
      '## Open Questions',
    ]);

    expect(fallback).toContain('Pointer');
    expect(fallback).toContain('N/A — no API/state/error surface change');
    expect(fallback).toContain('N/A — no cross-path invariants');
    expectCurrentSystemOnboarding(fallback);
    expectUserRealChoiceRules(fallback);
    expectImplementableDetail(fallback);
    expect(fallback).not.toContain('## Target flow');
    expect(fallback).toContain('**User selection:**');
    expect(fallback).toContain('Agent-owned');
    expect(fallback).toContain('### API / CLI');
    expect(fallback).not.toMatch(/compare >=3 options/i);
    expectDerivedImplicationScan(fallback);
  });

  it('explore skill and command diverge in conversation and record comparison only after user choice', () => {
    for (const template of [getExploreSkillTemplate(), getSpExploreCommandTemplate()]) {
      const content = 'instructions' in template ? template.instructions : template.content;
      expect(content).toMatch(/at least three approaches/i);
      expect(content).toContain('only if the user chose');
      expect(content).toContain('MAY include an A/B/C');
      expect(content).toContain('strict, detailed analysis');
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
      expect(content).toContain('shallow rationale');
      expect(content).toContain('misattributed user Choice');
      expect(content).toContain('user actually chose');
      expect(content).toContain('**User selection:**');
      expect(content).toContain('agent-owned');
      expect(content).toContain('strict, detailed analysis');
      expect(content).toContain('implementable detail');
      expect(content).toContain('worked example');
      expect(content).toContain('principle-only');
      expect(content).toContain('not a finding');
      expect(content).toContain('## Invariants');
      expect(content).toContain('N/A — no cross-path invariants');
      expect(content).toMatch(/missing.*Invariants.*`P0`|Invariants.*`P0`/i);
      expect(content).not.toMatch(/major decisions need \*\*≥3 options\*\* recorded/i);
      expect(content).not.toContain('Do not invent A/B/C');
      expectReviewDerivedImplicationRules(content);
    }
  });

  it('Propose records user-confirmed tables and allows agent-owned A/B/C with strict analysis', () => {
    for (const template of [getSpProposeSkillTemplate(), getSpProposeCommandTemplate()]) {
      const content = 'instructions' in template ? template.instructions : template.content;
      expect(content).toContain('route confirmed product decisions into proposal.md');
      expect(content).toContain('Route each high-impact technical decision into design.md');
      expect(content).toContain('user actually chose');
      expect(content).toContain('MAY include an A/B/C');
      expect(content).toContain('strict, detailed analysis');
      expect(content).toContain('agent-owned');
      expect(content).toContain('implementable detail');
      expect(content).toContain('Authors MAY add extra subsections');
      expect(content).toContain('Do not add required extra headings');
      expect(content).not.toContain('major decisions must compare at least three options');
      expect(content).not.toContain('Do not invent A/B/C');
      expectProposeDerivedImplicationRules(content);
    }
  });
});
