import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { validateChange } from '../../../src/core/validation/change-validator.js';
import { formatChangeStatus, loadChangeContext } from '../../../src/core/artifact-graph/index.js';

describe('schema-aware change validation', () => {
  let projectRoot: string;

  beforeEach(async () => {
    projectRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'superpowers-change-validation-'));
    await fs.mkdir(path.join(projectRoot, 'superpowers', 'changes'), { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(projectRoot, { recursive: true, force: true });
  });

  it('returns artifact errors when a schema artifact is missing', async () => {
    await createSpecDrivenChange('incomplete', { omit: ['test-plan.md'] });

    const report = await validateChange('incomplete', { projectRoot });

    expect(report.valid).toBe(false);
    expect(report.issues).toContainEqual(expect.objectContaining({
      level: 'ERROR',
      path: 'artifact:test-plan',
      message: expect.stringContaining('test-plan.md'),
    }));
  });

  it('passes when all schema artifacts and delta specs are valid', async () => {
    await createSpecDrivenChange('complete');

    const report = await validateChange('complete', { projectRoot });

    expect(report.valid).toBe(true);
    expect(report.issues).toEqual([]);
  });

  it('resolves schema from change metadata', async () => {
    await createSchema('custom-flow', [
      { id: 'proposal', generates: 'proposal.md' },
      { id: 'audit', generates: 'audit.md', requires: ['proposal'] },
    ]);
    const changeDir = await createChangeDir('metadata-schema');
    await fs.writeFile(path.join(changeDir, '.superpowers.yaml'), 'schema: custom-flow\n');
    await fs.writeFile(path.join(changeDir, 'proposal.md'), '# Proposal\n');

    const report = await validateChange('metadata-schema', { projectRoot });

    expect(report.valid).toBe(false);
    expect(report.issues).toContainEqual(expect.objectContaining({
      path: 'artifact:audit',
      message: expect.stringContaining('audit.md'),
    }));
    expect(report.issues).not.toContainEqual(expect.objectContaining({ path: 'artifact:test-plan' }));
  });

  it('falls back to project default schema when metadata is absent', async () => {
    await createSchema('project-default-flow', [
      { id: 'proposal', generates: 'proposal.md' },
      { id: 'handoff', generates: 'handoff.md', requires: ['proposal'] },
    ]);
    await fs.writeFile(path.join(projectRoot, 'superpowers', 'config.yaml'), 'schema: project-default-flow\n');
    const changeDir = await createChangeDir('project-default');
    await fs.writeFile(path.join(changeDir, 'proposal.md'), '# Proposal\n');

    const report = await validateChange('project-default', { projectRoot });

    expect(report.valid).toBe(false);
    expect(report.issues).toContainEqual(expect.objectContaining({
      path: 'artifact:handoff',
      message: expect.stringContaining('handoff.md'),
    }));
  });

  it('falls back like status when change metadata is invalid', async () => {
    await createSchema('fallback-flow', [
      { id: 'proposal', generates: 'proposal.md' },
      { id: 'fallback-note', generates: 'fallback-note.md', requires: ['proposal'] },
    ]);
    await fs.writeFile(path.join(projectRoot, 'superpowers', 'config.yaml'), 'schema: fallback-flow\n');
    const changeDir = await createChangeDir('bad-metadata');
    await fs.writeFile(path.join(changeDir, '.superpowers.yaml'), 'schema: [');
    await fs.writeFile(path.join(changeDir, 'proposal.md'), '# Proposal\n');

    const status = formatChangeStatus(loadChangeContext(projectRoot, 'bad-metadata'));
    const report = await validateChange('bad-metadata', { projectRoot });

    expect(status.schemaName).toBe('fallback-flow');
    expect(report.issues).toContainEqual(expect.objectContaining({
      path: 'artifact:fallback-note',
    }));
    expect(report.issues.map(issue => issue.message).join('\n')).not.toContain('Invalid YAML');
  });

  it('uses status glob semantics for generated artifacts', async () => {
    await createSchema('glob-flow', [
      { id: 'proposal', generates: 'proposal.md' },
      { id: 'specs', generates: 'specs/**/*.md', requires: ['proposal'] },
    ]);
    await fs.writeFile(path.join(projectRoot, 'superpowers', 'config.yaml'), 'schema: glob-flow\n');
    const changeDir = await createChangeDir('glob-change');
    await fs.writeFile(path.join(changeDir, 'proposal.md'), '# Proposal\n');

    let report = await validateChange('glob-change', { projectRoot });
    expect(report.issues).toContainEqual(expect.objectContaining({ path: 'artifact:specs' }));

    await fs.mkdir(path.join(changeDir, 'specs', 'alpha'), { recursive: true });
    await fs.writeFile(path.join(changeDir, 'specs', 'alpha', 'spec.md'), validDeltaSpec(), 'utf-8');
    report = await validateChange('glob-change', { projectRoot });
    expect(report.issues).not.toContainEqual(expect.objectContaining({ path: 'artifact:specs' }));
  });

  it('reports missing proposal for an existing change directory', async () => {
    await createSpecDrivenChange('no-proposal', { omit: ['proposal.md'] });

    const report = await validateChange('no-proposal', { projectRoot });

    expect(report.valid).toBe(false);
    expect(report.issues).toContainEqual(expect.objectContaining({
      path: 'artifact:proposal',
      message: expect.stringContaining('proposal.md'),
    }));
  });

  it('combines schema artifact errors with delta validation errors', async () => {
    const changeDir = await createSpecDrivenChange('bad-delta', { omit: ['test-plan.md'] });
    await fs.writeFile(path.join(changeDir, 'specs', 'alpha', 'spec.md'), '## ADDED Requirements\n', 'utf-8');

    const report = await validateChange('bad-delta', { projectRoot });

    expect(report.valid).toBe(false);
    expect(report.issues).toContainEqual(expect.objectContaining({ path: 'artifact:test-plan' }));
    expect(report.issues).toContainEqual(expect.objectContaining({
      path: 'alpha/spec.md',
      message: expect.stringContaining('no requirement entries parsed'),
    }));
  });

  it('reports extra files outside schema artifacts, specs, and attachments', async () => {
    const changeDir = await createSpecDrivenChange('extra-file');
    await fs.writeFile(path.join(changeDir, 'notes.md'), 'private notes\n', 'utf-8');

    const report = await validateChange('extra-file', { projectRoot });

    expect(report.valid).toBe(false);
    expect(report.issues).toContainEqual(expect.objectContaining({
      level: 'ERROR',
      path: 'notes.md',
      message: expect.stringContaining('Unexpected change file "notes.md"'),
    }));
  });

  it('allows supplemental files under specs and attachments', async () => {
    const changeDir = await createSpecDrivenChange('allowed-extra-files');
    await fs.writeFile(path.join(changeDir, 'specs', 'notes.txt'), 'spec background\n', 'utf-8');
    await fs.mkdir(path.join(changeDir, 'attachments'), { recursive: true });
    await fs.writeFile(path.join(changeDir, 'attachments', 'diagram.txt'), 'diagram\n', 'utf-8');

    const report = await validateChange('allowed-extra-files', { projectRoot });

    expect(report.valid).toBe(true);
    expect(report.issues).toEqual([]);
  });

  async function createSpecDrivenChange(
    name: string,
    options: { omit?: string[] } = {}
  ): Promise<string> {
    const omit = new Set(options.omit ?? []);
    const changeDir = await createChangeDir(name);
    await fs.writeFile(path.join(changeDir, '.superpowers.yaml'), 'schema: spec-driven\n');

    const files = new Map<string, string>([
      ['proposal.md', '# Proposal\n\n## Why\nBecause this fixture needs complete workflow artifacts.\n\n## What Changes\n- **alpha:** Add behavior\n'],
      ['design.md', '## Context\nDesign context.\n'],
      ['tasks.md', '## 1. Tasks\n\n- [x] 1.1 Done\n'],
      ['execution-plan.md', '## Task Plan\n\n- [x] Step 1\n'],
      ['test-plan.md', '## Testing Gap Analysis\n\nCovered.\n'],
    ]);

    for (const [file, content] of files) {
      if (!omit.has(file)) {
        await fs.writeFile(path.join(changeDir, file), content, 'utf-8');
      }
    }

    await fs.mkdir(path.join(changeDir, 'specs', 'alpha'), { recursive: true });
    await fs.writeFile(path.join(changeDir, 'specs', 'alpha', 'spec.md'), validDeltaSpec(), 'utf-8');
    return changeDir;
  }

  async function createChangeDir(name: string): Promise<string> {
    const changeDir = path.join(projectRoot, 'superpowers', 'changes', name);
    await fs.mkdir(changeDir, { recursive: true });
    return changeDir;
  }

  async function createSchema(
    name: string,
    artifacts: Array<{ id: string; generates: string; requires?: string[] }>
  ): Promise<void> {
    const schemaDir = path.join(projectRoot, 'superpowers', 'schemas', name);
    await fs.mkdir(schemaDir, { recursive: true });
    const artifactYaml = artifacts.map(artifact => [
      `  - id: ${artifact.id}`,
      `    generates: "${artifact.generates}"`,
      `    description: ${artifact.id} artifact`,
      `    template: ${artifact.id}.md`,
      `    requires: [${(artifact.requires ?? []).join(', ')}]`,
    ].join('\n')).join('\n');
    await fs.writeFile(
      path.join(schemaDir, 'schema.yaml'),
      [
        `name: ${name}`,
        'version: 1',
        'description: Test schema',
        'artifacts:',
        artifactYaml,
      ].join('\n'),
      'utf-8'
    );
  }
});

function validDeltaSpec(): string {
  return [
    '## ADDED Requirements',
    '',
    '### Requirement: Alpha validation SHALL work',
    'The alpha validation path SHALL accept complete change fixtures.',
    '',
    '#### Scenario: Alpha validation passes',
    '- **GIVEN** a complete change fixture',
    '- **WHEN** schema-aware validation runs',
    '- **THEN** validation succeeds',
  ].join('\n');
}
