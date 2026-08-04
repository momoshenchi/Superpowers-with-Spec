import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import {
  getExploreSkillTemplate,
  getSpExploreCommandTemplate,
} from '../../src/core/templates/skill-templates.js';

const readWorkspaceFile = (...parts: string[]) =>
  readFileSync(path.join(process.cwd(), ...parts), 'utf8');

const checkpointContract = [
  'Debug Checkpoint',
  'Scope and Track Map',
  'Current Phase and Exit Criteria',
  'Facts and Decisions',
  'Evidence Ledger',
  'Working-vs-Broken Comparison',
  'Hypotheses',
  'Verification',
  'Visual Analysis',
  'Reread Budget and No-Progress Log',
  'Handoff / Next Action',
  'OPEN',
  'CONFIRMED',
  'BLOCKED',
  'HANDED_OFF',
  'PROPOSED',
  'TESTING',
  'REFUTED',
  'source',
  'test',
  'runtime',
  'log',
  'image',
  'diagram',
  'Evidence ID',
  'Mermaid',
  'ASCII',
  'flowchart',
  'data-flow',
  'one next decisive experiment',
  'two consecutive investigation actions',
  'does not replace executable verification',
];

const exploreCheckpointSummary = [
  'Debug Checkpoint',
  'context compaction',
  'fresh-worker handoff',
  'reread loop',
  'before handoff',
  'recovery source of truth',
];

const expectContract = (content: string) => {
  for (const term of checkpointContract) {
    expect(content, `missing checkpoint contract term: ${term}`).toContain(term);
  }
};

describe('debug investigation checkpoint guidance', () => {
  it('defines the evidence-rich checkpoint contract in systematic debugging', () => {
    const skill = readWorkspaceFile('skills', 'systematic-debugging', 'SKILL.md');

    expectContract(skill);
    expect(skill).toContain('Track statuses');
    expect(skill).toContain('Hypothesis statuses');
    expect(skill).toContain('changed revision');
    expect(skill).toContain('new symbol/line range');
    expect(skill).toContain('hypothesis slice');
    expect(skill).toContain('short one-turn investigation');
    expect(skill).toContain('read-only');
  });

  it('defines diagnostic context-churn recovery without creating a third work mode', () => {
    const skill = readWorkspaceFile('skills', 'using-superpowers', 'SKILL.md');

    expect(skill).toContain('diagnostic rereads');
    expect(skill).toContain('Debug Checkpoint');
    expect(skill).toContain('fresh context');
    expect(skill).toContain('not a third mode');
  });

  it('keeps the generated explore skill and command semantically aligned', () => {
    const generatedSkill = getExploreSkillTemplate().instructions;
    const generatedCommand = getSpExploreCommandTemplate().content;

    for (const content of [generatedSkill, generatedCommand]) {
      for (const term of exploreCheckpointSummary) {
        expect(content, `missing explore checkpoint summary term: ${term}`).toContain(term);
      }
    }
  });

  it('requires representative evidence and diagram links to be inspectable', () => {
    const design = readWorkspaceFile(
      'superpowers',
      'changes',
      'add-debug-investigation-checkpoints',
      'design.md'
    );

    expect(design).toContain('| E1 | source |');
    expect(design).toContain('| E2 | test |');
    expect(design).toContain('| E3 | runtime |');
    expect(design).toContain('| E4 | image |');
    expect(design).toContain('<!-- diagram evidence ID -->');
    expect(design).toContain('E1');
    expect(design).toContain('observed edges');
    expect(design).toContain('inferred edges');
  });

  it('uses platform-safe path guidance for source and image references', () => {
    const checkpointPath = path.join('debug-checkpoints', 'incident', 'checkpoint.md');
    const checkpointRoot = path.resolve(process.cwd(), 'debug-checkpoints', 'incident');
    const sourceReference = path.resolve(checkpointRoot, '..', 'src', 'mapper.ts');
    const imageReference = path.resolve(checkpointRoot, '..', 'artifacts', 'status.png');
    const windowsDisplayPath = String.raw`C:\workspace\debug-checkpoints\incident\checkpoint.md`;
    const skill = readWorkspaceFile('skills', 'systematic-debugging', 'SKILL.md');

    expect(checkpointPath).toBe(path.join('debug-checkpoints', 'incident', 'checkpoint.md'));
    expect(path.isAbsolute(sourceReference)).toBe(true);
    expect(path.isAbsolute(imageReference)).toBe(true);
    expect(path.relative(checkpointRoot, sourceReference)).toBe(path.join('..', 'src', 'mapper.ts'));
    expect(path.relative(checkpointRoot, imageReference)).toBe(
      path.join('..', 'artifacts', 'status.png')
    );
    expect(windowsDisplayPath).toContain('\\');
    expect(skill).toContain('Windows');
    expect(skill).toContain('path.join()');
    expect(skill).toContain('path.resolve()');
  });

  it('includes a compaction/no-progress pressure scenario', () => {
    const scenarioPath = path.join(
      process.cwd(),
      'skills',
      'systematic-debugging',
      'test-pressure-4.md'
    );

    const scenarioExists = existsSync(scenarioPath);
    expect(scenarioExists).toBe(true);
    if (!scenarioExists) return;

    const scenario = readFileSync(scenarioPath, 'utf8');
    for (const term of [
      'context compaction',
      'CONFIRMED',
      'OPEN',
      'Evidence ID',
      'no-progress',
      'fresh context',
      'one next decisive experiment',
    ]) {
      expect(scenario, `pressure scenario missing term: ${term}`).toContain(term);
    }
  });
});
