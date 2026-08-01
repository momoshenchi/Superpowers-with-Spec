import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { runCLI } from '../helpers/run-cli.js';

describe('artifact-workflow CLI commands', () => {
  let tempDir: string;
  let changesDir: string;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'superpowers-artifact-workflow-'));
    changesDir = path.join(tempDir, 'superpowers', 'changes');
    await fs.mkdir(changesDir, { recursive: true });
  });

  afterEach(async () => {
    if (tempDir) {
      await fs.rm(tempDir, { recursive: true, force: true });
    }
  });

  /**
   * Gets combined output from CLI result (ora outputs to stdout).
   */
  function getOutput(result: { stdout: string; stderr: string }): string {
    return result.stdout + result.stderr;
  }

  /**
   * Normalizes path separators to forward slashes for cross-platform assertions.
   */
  function normalizePaths(str: string): string {
    return str.replace(/\\/g, '/');
  }

  function draftTestPlanContent(): string {
    return [
      '# Test Plan',
      '',
      '## Testing Gap Analysis',
      '',
      'Earlier tests are not broad enough yet; this draft records planned hardening coverage.',
      '',
      '## Requirement And Scenario Coverage Matrix',
      '',
      '| Requirement / Scenario | Planned Coverage | Status | Notes |',
      '| --- | --- | --- | --- |',
      '| Example requirement | unit | planned | pending hardening |',
    ].join('\n');
  }

  function completeTestPlanContent(): string {
    return [
      '# Test Plan',
      '',
      '## Testing Gap Analysis',
      '',
      'Earlier tests missed status-table completion semantics; this hardening stage added coverage for incomplete and complete table rows.',
      '',
      '## Requirement And Scenario Coverage Matrix',
      '',
      '| Requirement / Scenario | Planned Coverage | Status | Notes |',
      '| --- | --- | --- | --- |',
      '| Example requirement | unit | covered | test/commands/artifact-workflow.test.ts |',
      '| Optional manual case | not applicable | not applicable | no runtime surface |',
      '',
      '## Boundary And Abnormal Case Sweep',
      '',
      '| Surface | Cases Attacked | Coverage Decision | Status |',
      '| --- | --- | --- | --- |',
      '| Apply state | Complete task list with table-complete test plan | automated | passed |',
      '',
      '## Manual Coverage',
      '',
      '| Check / scenario | Execution method and environment | Status | Evidence |',
      '| --- | --- | --- | --- |',
      '| Generated workflow verification | Focused Vitest in repository workspace | passed | 7 tests passed |',
    ].join('\n');
  }

  /**
   * Creates a test change with the specified artifacts completed.
   * Note: An "active" change requires at least a proposal.md file to be detected.
   * If no artifacts are specified, we create an empty proposal to make it detectable.
   */
  async function createTestChange(
    changeName: string,
    artifacts: ('proposal' | 'design' | 'specs' | 'tasks' | 'execution-plan' | 'test-plan')[] = []
  ): Promise<string> {
    const changeDir = path.join(changesDir, changeName);
    await fs.mkdir(changeDir, { recursive: true });

    // Always create proposal.md for the change to be detected as active
    // Content varies based on whether 'proposal' is in artifacts list
    const proposalContent = artifacts.includes('proposal')
      ? '## Why\nTest proposal content that is long enough.\n\n## What Changes\n- **test:** Something'
      : '## Why\nMinimal proposal.\n\n## What Changes\n- **test:** Placeholder';
    await fs.writeFile(path.join(changeDir, 'proposal.md'), proposalContent);

    if (artifacts.includes('design')) {
      await fs.writeFile(path.join(changeDir, 'design.md'), '# Design\n\nTechnical design.');
    }

    if (artifacts.includes('specs')) {
      // specs artifact uses glob pattern "specs/*.md" - files directly in specs/ directory
      const specsDir = path.join(changeDir, 'specs');
      await fs.mkdir(specsDir, { recursive: true });
      await fs.writeFile(path.join(specsDir, 'test-spec.md'), '## Purpose\nTest spec.');
    }

    if (artifacts.includes('tasks')) {
      await fs.writeFile(path.join(changeDir, 'tasks.md'), '## Tasks\n- [ ] Task 1');
    }

    if (artifacts.includes('execution-plan')) {
      await fs.writeFile(
        path.join(changeDir, 'execution-plan.md'),
        '# Test Change Implementation Plan\n\n**Goal:** Implement the test change.'
      );
    }

    if (artifacts.includes('test-plan')) {
      await fs.writeFile(path.join(changeDir, 'test-plan.md'), draftTestPlanContent());
    }

    return changeDir;
  }

  async function createCompleteTestChange(changeName: string): Promise<string> {
    return createTestChange(changeName, [
      'proposal',
      'design',
      'specs',
      'tasks',
      'execution-plan',
      'test-plan',
    ]);
  }

  async function writeAttachment(
    changeDir: string,
    relativePath: string,
    content = 'attachment-content'
  ): Promise<void> {
    const fullPath = path.join(changeDir, ...relativePath.split('/'));
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, content);
  }

  describe('status command', () => {
    it('shows status for scaffolded change without proposal.md', async () => {
      // Create empty change directory (no proposal.md)
      const changeDir = path.join(changesDir, 'scaffolded-change');
      await fs.mkdir(changeDir, { recursive: true });

      const result = await runCLI(['status', '--change', 'scaffolded-change'], { cwd: tempDir });
      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('scaffolded-change');
      expect(result.stdout).toContain('0/6 artifacts complete');
    });

    it('shows status for a change with proposal only', async () => {
      // createTestChange always creates proposal.md, so this has 1 artifact complete
      await createTestChange('minimal-change');

      const result = await runCLI(['status', '--change', 'minimal-change'], { cwd: tempDir });
      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('minimal-change');
      expect(result.stdout).toContain('spec-driven');
      expect(result.stdout).toContain('1/6 artifacts complete');
    });

    it('shows status for a change with proposal and design', async () => {
      await createTestChange('partial-change', ['proposal', 'design']);

      const result = await runCLI(['status', '--change', 'partial-change'], { cwd: tempDir });
      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('2/6 artifacts complete');
      expect(result.stdout).toContain('[x]');
    });

    it('outputs JSON when --json flag is used', async () => {
      await createTestChange('json-change', ['proposal', 'design']);

      const result = await runCLI(['status', '--change', 'json-change', '--json'], {
        cwd: tempDir,
      });
      expect(result.exitCode).toBe(0);

      const json = JSON.parse(result.stdout);
      expect(json.changeName).toBe('json-change');
      expect(json.schemaName).toBe('spec-driven');
      expect(json.isComplete).toBe(false);
      expect(Array.isArray(json.artifacts)).toBe(true);
      expect(json.artifacts).toHaveLength(6);

      const proposalArtifact = json.artifacts.find((a: any) => a.id === 'proposal');
      expect(proposalArtifact.status).toBe('done');
    });

    it('shows complete status when all artifacts are done', async () => {
      await createTestChange('complete-change', [
        'proposal',
        'design',
        'specs',
        'tasks',
        'execution-plan',
        'test-plan',
      ]);

      const result = await runCLI(['status', '--change', 'complete-change'], { cwd: tempDir });
      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('6/6 artifacts complete');
      expect(result.stdout).toContain('All artifacts complete!');
    });

    it('shows execution-plan blocked before tasks, ready after tasks, and done when execution-plan.md exists', async () => {
      await createTestChange('execution-plan-status', ['proposal', 'design', 'specs']);

      const blockedResult = await runCLI(
        ['status', '--change', 'execution-plan-status', '--json'],
        { cwd: tempDir }
      );
      expect(blockedResult.exitCode).toBe(0);
      const blockedJson = JSON.parse(blockedResult.stdout);
      const blockedExecutionPlan = blockedJson.artifacts.find((a: any) => a.id === 'execution-plan');
      expect(blockedExecutionPlan).toMatchObject({
        id: 'execution-plan',
        outputPath: 'execution-plan.md',
        status: 'blocked',
        missingDeps: ['tasks'],
      });

      const changeDir = path.join(changesDir, 'execution-plan-status');
      await fs.writeFile(path.join(changeDir, 'tasks.md'), '## Tasks\n- [ ] Task 1');

      const readyResult = await runCLI(
        ['status', '--change', 'execution-plan-status', '--json'],
        { cwd: tempDir }
      );
      expect(readyResult.exitCode).toBe(0);
      const readyJson = JSON.parse(readyResult.stdout);
      const readyExecutionPlan = readyJson.artifacts.find((a: any) => a.id === 'execution-plan');
      expect(readyExecutionPlan).toMatchObject({
        id: 'execution-plan',
        outputPath: 'execution-plan.md',
        status: 'ready',
      });

      await fs.writeFile(
        path.join(changeDir, 'execution-plan.md'),
        '# Execution Plan\n\n**Goal:** Test path-safe completion detection.'
      );

      const doneResult = await runCLI(
        ['status', '--change', 'execution-plan-status', '--json'],
        { cwd: tempDir }
      );
      expect(doneResult.exitCode).toBe(0);
      const doneJson = JSON.parse(doneResult.stdout);
      const doneExecutionPlan = doneJson.artifacts.find((a: any) => a.id === 'execution-plan');
      expect(doneExecutionPlan).toMatchObject({
        id: 'execution-plan',
        outputPath: 'execution-plan.md',
        status: 'done',
      });
      const readyTestPlan = doneJson.artifacts.find((a: any) => a.id === 'test-plan');
      expect(readyTestPlan).toMatchObject({
        id: 'test-plan',
        outputPath: 'test-plan.md',
        status: 'ready',
      });
      expect(doneJson.isComplete).toBe(false);
    });

    it('outputs JSON status with test-plan apply requirement', async () => {
      await createTestChange('json-apply-requires', ['proposal', 'design', 'specs', 'tasks']);

      const result = await runCLI(['status', '--change', 'json-apply-requires', '--json'], {
        cwd: tempDir,
      });
      expect(result.exitCode).toBe(0);

      const json = JSON.parse(result.stdout);
      expect(json.applyRequires).toEqual(['test-plan']);
      expect(json.artifacts.map((artifact: any) => artifact.id)).toEqual([
        'proposal',
        'design',
        'specs',
        'tasks',
        'execution-plan',
        'test-plan',
      ]);
      expect(json.artifacts.find((artifact: any) => artifact.id === 'execution-plan')).toMatchObject({
        outputPath: 'execution-plan.md',
        status: 'ready',
      });
      expect(json.artifacts.find((artifact: any) => artifact.id === 'test-plan')).toMatchObject({
        outputPath: 'test-plan.md',
        status: 'blocked',
        missingDeps: ['execution-plan'],
      });
    });

    it('exits gracefully when no changes exist', async () => {
      const result = await runCLI(['status'], { cwd: tempDir });
      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('No active changes');
      expect(result.stdout).toContain('superpowers new change');
    });

    it('exits gracefully with JSON when no changes exist', async () => {
      const result = await runCLI(['status', '--json'], { cwd: tempDir });
      expect(result.exitCode).toBe(0);

      const json = JSON.parse(result.stdout);
      expect(json.changes).toEqual([]);
      expect(json.message).toBe('No active changes.');
    });

    it('errors when --change is missing and lists available changes', async () => {
      await createTestChange('some-change');

      const result = await runCLI(['status'], { cwd: tempDir });
      expect(result.exitCode).toBe(1);
      const output = getOutput(result);
      expect(output).toContain('Missing required option --change');
      expect(output).toContain('some-change');
    });

    it('errors for unknown change name and lists available changes', async () => {
      await createTestChange('existing-change');

      const result = await runCLI(['status', '--change', 'nonexistent'], { cwd: tempDir });
      expect(result.exitCode).toBe(1);
      const output = getOutput(result);
      expect(output).toContain("Change 'nonexistent' not found");
      expect(output).toContain('existing-change');
    });

    it('supports --schema option', async () => {
      await createTestChange('schema-change');

      const result = await runCLI(['status', '--change', 'schema-change', '--schema', 'spec-driven'], {
        cwd: tempDir,
      });
      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('spec-driven');
    });

    it('errors for unknown schema', async () => {
      await createTestChange('test-change');

      const result = await runCLI(['status', '--change', 'test-change', '--schema', 'unknown'], {
        cwd: tempDir,
      });
      expect(result.exitCode).toBe(1);
      const output = getOutput(result);
      expect(output).toContain("Schema 'unknown' not found");
    });

    it('rejects path traversal in change name', async () => {
      const result = await runCLI(['status', '--change', '../foo'], { cwd: tempDir });
      expect(result.exitCode).toBe(1);
      const output = getOutput(result);
      expect(output).toContain('Invalid change name');
    });

    it('rejects absolute path in change name', async () => {
      const result = await runCLI(['status', '--change', '/etc/passwd'], { cwd: tempDir });
      expect(result.exitCode).toBe(1);
      const output = getOutput(result);
      expect(output).toContain('Invalid change name');
    });

    it('rejects slashes in change name', async () => {
      const result = await runCLI(['status', '--change', 'foo/bar'], { cwd: tempDir });
      expect(result.exitCode).toBe(1);
      const output = getOutput(result);
      expect(output).toContain('Invalid change name');
    });
  });

  describe('instructions command', () => {
    it('shows instructions for proposal on scaffolded change', async () => {
      // Create empty change directory (no proposal.md)
      const changeDir = path.join(changesDir, 'scaffolded-change');
      await fs.mkdir(changeDir, { recursive: true });

      const result = await runCLI(['instructions', 'proposal', '--change', 'scaffolded-change'], {
        cwd: tempDir,
      });
      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('<artifact id="proposal"');
      expect(result.stdout).toContain('proposal.md');
      expect(result.stdout).toContain('<template>');
    });

    it('shows instructions for design artifact', async () => {
      await createTestChange('instr-change');

      const result = await runCLI(['instructions', 'design', '--change', 'instr-change'], {
        cwd: tempDir,
      });
      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('<artifact id="design"');
      expect(result.stdout).toContain('design.md');
      expect(result.stdout).toContain('<template>');
    });

    it('shows blocked warning for artifact with unmet dependencies', async () => {
      // tasks depends on design and specs, which are not done yet
      await createTestChange('blocked-change');

      const result = await runCLI(['instructions', 'tasks', '--change', 'blocked-change'], {
        cwd: tempDir,
      });
      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('<warning>');
      expect(result.stdout).toContain('status="missing"');
    });

    it('outputs JSON for instructions', async () => {
      await createTestChange('json-instr', ['proposal']);

      const result = await runCLI(['instructions', 'design', '--change', 'json-instr', '--json'], {
        cwd: tempDir,
      });
      expect(result.exitCode).toBe(0);

      const json = JSON.parse(result.stdout);
      expect(json.artifactId).toBe('design');
      expect(json.outputPath).toContain('design.md');
      expect(typeof json.template).toBe('string');
      expect(Array.isArray(json.dependencies)).toBe(true);
    });

    it('errors when artifact argument is missing', async () => {
      await createTestChange('test-change');

      const result = await runCLI(['instructions', '--change', 'test-change'], { cwd: tempDir });
      expect(result.exitCode).toBe(1);
      const output = getOutput(result);
      expect(output).toContain('Missing required argument <artifact>');
      expect(output).toContain('Valid artifacts');
    });

    it('errors for unknown artifact', async () => {
      await createTestChange('test-change');

      const result = await runCLI(['instructions', 'unknown-artifact', '--change', 'test-change'], {
        cwd: tempDir,
      });
      expect(result.exitCode).toBe(1);
      const output = getOutput(result);
      expect(output).toContain("Artifact 'unknown-artifact' not found");
      expect(output).toContain('Valid artifacts');
    });

    it('includes attachment reference guidance for attachment-aware artifacts', async () => {
      await createTestChange('guidance-change', ['proposal', 'design', 'specs', 'tasks']);

      for (const artifactId of ['proposal', 'design', 'specs', 'execution-plan']) {
        const result = await runCLI(
          ['instructions', artifactId, '--change', 'guidance-change', '--json'],
          { cwd: tempDir }
        );
        expect(result.exitCode).toBe(0);

        const json = JSON.parse(result.stdout);
        const combinedGuidance = `${json.instruction}\n${json.template}`.toLowerCase();
        expect(combinedGuidance).toContain('attachments/');
        expect(combinedGuidance).toContain('explain');
        expect(combinedGuidance).toContain('why');
        expect(combinedGuidance).toContain('normative');
        expect(combinedGuidance).toContain('illustrative');
      }
    });
  });

  describe('templates command', () => {
    it('shows template paths for default schema', async () => {
      const result = await runCLI(['templates'], { cwd: tempDir });
      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('Schema: spec-driven');
      expect(result.stdout).toContain('proposal:');
      expect(result.stdout).toContain('design:');
      expect(result.stdout).toContain('specs:');
      expect(result.stdout).toContain('tasks:');
      expect(result.stdout).toContain('execution-plan:');
      expect(result.stdout).toContain('test-plan:');
    });

    it('shows template paths for specified schema', async () => {
      const result = await runCLI(['templates', '--schema', 'spec-driven'], { cwd: tempDir });
      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('Schema: spec-driven');
      expect(result.stdout).toContain('proposal:');
      expect(result.stdout).toContain('design:');
    });

    it('outputs JSON mapping of templates', async () => {
      const result = await runCLI(['templates', '--json'], { cwd: tempDir });
      expect(result.exitCode).toBe(0);

      const json = JSON.parse(result.stdout);
      expect(json.proposal).toBeDefined();
      expect(json.proposal.path).toContain('proposal.md');
      expect(json.proposal.source).toBe('package');
      expect(normalizePaths(json['execution-plan'].path)).toContain(
        normalizePaths(path.join('schemas', 'spec-driven', 'templates', 'execution-plan.md'))
      );
      expect(normalizePaths(json['test-plan'].path)).toContain(
        normalizePaths(path.join('schemas', 'spec-driven', 'templates', 'test-plan.md'))
      );
    });

    it('errors for unknown schema', async () => {
      const result = await runCLI(['templates', '--schema', 'nonexistent'], { cwd: tempDir });
      expect(result.exitCode).toBe(1);
      const output = getOutput(result);
      expect(output).toContain("Schema 'nonexistent' not found");
    });
  });

  describe('new change command', () => {
    it('creates a new change directory', async () => {
      const result = await runCLI(['new', 'change', 'my-new-feature'], { cwd: tempDir });
      expect(result.exitCode).toBe(0);
      const output = getOutput(result);
      expect(output).toContain("Created change 'my-new-feature'");

      const changeDir = path.join(changesDir, 'my-new-feature');
      const stat = await fs.stat(changeDir);
      expect(stat.isDirectory()).toBe(true);
    });

    it('creates README.md when --description is provided', async () => {
      const result = await runCLI(
        ['new', 'change', 'described-feature', '--description', 'This is a test feature'],
        { cwd: tempDir }
      );
      expect(result.exitCode).toBe(0);

      const readmePath = path.join(changesDir, 'described-feature', 'README.md');
      const content = await fs.readFile(readmePath, 'utf-8');
      expect(content).toContain('described-feature');
      expect(content).toContain('This is a test feature');
    });

    it('errors for invalid change name with spaces', async () => {
      const result = await runCLI(['new', 'change', 'invalid name'], { cwd: tempDir });
      expect(result.exitCode).toBe(1);
      const output = getOutput(result);
      expect(output).toContain('Error');
    });

    it('errors for duplicate change name', async () => {
      await createTestChange('existing-change');

      const result = await runCLI(['new', 'change', 'existing-change'], { cwd: tempDir });
      expect(result.exitCode).toBe(1);
      const output = getOutput(result);
      expect(output).toContain('exists');
    });

    it('errors when name argument is missing', async () => {
      const result = await runCLI(['new', 'change'], { cwd: tempDir });
      expect(result.exitCode).toBe(1);
    });
  });

  describe('instructions apply command', () => {
    describe('attachment references', () => {
      it('discovers Markdown image and link attachment targets in apply JSON', async () => {
        const changeDir = await createCompleteTestChange('attachment-change');
        await fs.writeFile(
          path.join(changeDir, 'proposal.md'),
          [
            '## Why',
            'The target dashboard screenshot is normative for layout.',
            '',
            '![Desktop target](attachments/desktop-target.png)',
          ].join('\n')
        );
        await fs.writeFile(
          path.join(changeDir, 'design.md'),
          [
            '# Design',
            'These visual notes are background context for implementation.',
            '',
            '[Visual notes](attachments/visual-notes.md)',
          ].join('\n')
        );
        await writeAttachment(changeDir, 'attachments/desktop-target.png', 'png-bytes');
        await writeAttachment(changeDir, 'attachments/visual-notes.md', '# Visual notes');

        const result = await runCLI(
          ['instructions', 'apply', '--change', 'attachment-change', '--json'],
          { cwd: tempDir }
        );
        expect(result.exitCode).toBe(0);

        const json = JSON.parse(result.stdout);
        expect(json.attachmentFiles).toBeDefined();
        expect(normalizePaths(json.attachmentFiles['attachments/desktop-target.png'])).toContain(
          normalizePaths(
            path.join(
              'superpowers',
              'changes',
              'attachment-change',
              'attachments',
              'desktop-target.png'
            )
          )
        );
        expect(normalizePaths(json.attachmentFiles['attachments/visual-notes.md'])).toContain(
          normalizePaths(
            path.join(
              'superpowers',
              'changes',
              'attachment-change',
              'attachments',
              'visual-notes.md'
            )
          )
        );
      });

      it('filters, deduplicates, safely resolves, and stably orders referenced attachments', async () => {
        const changeDir = await createCompleteTestChange('attachment-filtering');
        const specPath = path.join(changeDir, 'specs', 'test-spec.md');
        const supportedPaths = [
          'attachments/supported/reference.csv',
          'attachments/supported/reference.gif',
          'attachments/supported/reference.jpeg',
          'attachments/supported/reference.jpg',
          'attachments/supported/reference.markdown',
          'attachments/supported/reference.md',
          'attachments/supported/reference.png',
          'attachments/supported/reference.svg',
          'attachments/supported/reference.txt',
          'attachments/supported/reference.webp',
          'attachments/execution-plan-target.txt',
          'attachments/screens/mobile/home.png',
          'attachments/shared.png',
        ];

        for (const relativePath of supportedPaths) {
          await writeAttachment(changeDir, relativePath);
        }
        await writeAttachment(changeDir, 'attachments/prose-only.png');
        await writeAttachment(changeDir, 'attachments/reference.pdf');
        await writeAttachment(changeDir, 'attachments/reference.bin');

        await fs.writeFile(
          path.join(changeDir, 'proposal.md'),
          [
            '## Why',
            'Plain prose says see attachments/prose-only.png but that is not a Markdown target.',
            '',
            '![Shared](attachments/shared.png)',
            '![Shared again](attachments/shared.png)',
            '[Unsafe](attachments/../proposal.md)',
          ].join('\n')
        );
        await fs.writeFile(
          path.join(changeDir, 'design.md'),
          [
            '# Design',
            ...supportedPaths
              .filter((relativePath) => relativePath !== 'attachments/shared.png')
              .map((relativePath) => `[${relativePath}](${relativePath})`),
          ].join('\n')
        );
        await fs.writeFile(
          specPath,
          [
            '## ADDED Requirements',
            '',
            '### Requirement: Attachment references',
            'The system SHALL surface linked attachments.',
            '',
            '#### Scenario: Spec reference',
            '- **WHEN** specs link to [Nested](attachments/screens/mobile/home.png)',
            '- **THEN** the attachment is discoverable.',
          ].join('\n')
        );
        await fs.writeFile(
          path.join(changeDir, 'execution-plan.md'),
          [
            '# Execution Plan',
            '[Execution plan target](attachments/execution-plan-target.txt)',
            '[Missing](attachments/missing.png)',
            '[PDF](attachments/reference.pdf)',
            '[Unknown](attachments/reference.bin)',
          ].join('\n')
        );

        const result = await runCLI(
          ['instructions', 'apply', '--change', 'attachment-filtering', '--json'],
          { cwd: tempDir }
        );
        expect(result.exitCode).toBe(0);

        const json = JSON.parse(result.stdout);
        expect(Object.keys(json.attachmentFiles)).toEqual([...supportedPaths].sort());
        expect(json.attachmentFiles['attachments/prose-only.png']).toBeUndefined();
        expect(json.attachmentFiles['attachments/missing.png']).toBeUndefined();
        expect(json.attachmentFiles['attachments/reference.pdf']).toBeUndefined();
        expect(json.attachmentFiles['attachments/reference.bin']).toBeUndefined();
        expect(json.attachmentFiles['attachments/../proposal.md']).toBeUndefined();
        expect(normalizePaths(json.attachmentFiles['attachments/screens/mobile/home.png'])).toContain(
          normalizePaths(
            path.join(
              'superpowers',
              'changes',
              'attachment-filtering',
              'attachments',
              'screens',
              'mobile',
              'home.png'
            )
          )
        );
        expect(json.state).toBe('ready');
        expect(json.applyRequires).toEqual(['test-plan']);
      });

      it('keeps attachments separate from contextFiles and apply readiness', async () => {
        const changeDir = await createCompleteTestChange('attachment-context');
        await fs.writeFile(
          path.join(changeDir, 'proposal.md'),
          '## Why\n![Desktop target](attachments/desktop-target.png)'
        );
        await writeAttachment(changeDir, 'attachments/desktop-target.png', 'png-bytes');

        const applyResult = await runCLI(
          ['instructions', 'apply', '--change', 'attachment-context', '--json'],
          { cwd: tempDir }
        );
        expect(applyResult.exitCode).toBe(0);

        const applyJson = JSON.parse(applyResult.stdout);
        expect(applyJson.contextFiles.proposal).toBeDefined();
        expect(applyJson.contextFiles['attachments/desktop-target.png']).toBeUndefined();
        expect(applyJson.attachmentFiles['attachments/desktop-target.png']).toBeDefined();
        expect(applyJson.applyRequires).toEqual(['test-plan']);
        expect(applyJson.state).toBe('ready');

        const statusResult = await runCLI(
          ['status', '--change', 'attachment-context', '--json'],
          { cwd: tempDir }
        );
        expect(statusResult.exitCode).toBe(0);
        const statusJson = JSON.parse(statusResult.stdout);
        expect(statusJson.artifacts.map((artifact: any) => artifact.id)).not.toContain(
          'attachments'
        );
      });

      it('renders an Attachment Files section only when referenced attachments exist', async () => {
        const changeDir = await createCompleteTestChange('attachment-text');
        await fs.writeFile(
          path.join(changeDir, 'proposal.md'),
          '## Why\n![Desktop target](attachments/desktop-target.png)'
        );
        await writeAttachment(changeDir, 'attachments/desktop-target.png', 'png-bytes');

        const textResult = await runCLI(
          ['instructions', 'apply', '--change', 'attachment-text'],
          { cwd: tempDir }
        );
        expect(textResult.exitCode).toBe(0);
        expect(textResult.stdout).toContain('### Attachment Files');
        expect(normalizePaths(textResult.stdout)).toContain('attachments/desktop-target.png');

        await createCompleteTestChange('no-attachment-text');
        const noReferenceDir = path.join(changesDir, 'no-attachment-text');
        await fs.writeFile(
          path.join(noReferenceDir, 'proposal.md'),
          [
            '## Why',
            '',
            'Empty and malformed attachment-adjacent input should stay quiet.',
            '[Malformed](attachments/not-closed.png',
            '[External](images/not-an-attachment.png)',
          ].join('\n')
        );
        const noReferenceResult = await runCLI(
          ['instructions', 'apply', '--change', 'no-attachment-text'],
          { cwd: tempDir }
        );
        expect(noReferenceResult.exitCode).toBe(0);
        expect(noReferenceResult.stdout).not.toContain('### Attachment Files');

        const noReferenceJsonResult = await runCLI(
          ['instructions', 'apply', '--change', 'no-attachment-text', '--json'],
          { cwd: tempDir }
        );
        expect(noReferenceJsonResult.exitCode).toBe(0);
        const noReferenceJson = JSON.parse(noReferenceJsonResult.stdout);
        expect(noReferenceJson.attachmentFiles).toBeUndefined();
        expect(noReferenceJson.state).toBe('ready');
      });
    });

    it('shows apply instructions for spec-driven schema with tasks, execution plan, and test plan', async () => {
      await createTestChange('apply-change', [
        'proposal',
        'design',
        'specs',
        'tasks',
        'execution-plan',
        'test-plan',
      ]);

      const result = await runCLI(['instructions', 'apply', '--change', 'apply-change'], {
        cwd: tempDir,
      });
      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('## Apply: apply-change');
      expect(result.stdout).toContain('Schema: spec-driven');
      expect(result.stdout).toContain('### Context Files');
      expect(result.stdout).toContain('### Instruction');
    });

    it('shows blocked state when required artifacts are missing', async () => {
      // Only create proposal - missing test-plan (required by spec-driven apply block)
      await createTestChange('blocked-apply', ['proposal']);

      const result = await runCLI(['instructions', 'apply', '--change', 'blocked-apply'], {
        cwd: tempDir,
      });
      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('Blocked');
      expect(result.stdout).toContain('Missing artifacts: test-plan');
    });

    it('blocks apply when execution-plan exists but test-plan.md is missing', async () => {
      await createTestChange('blocked-test-plan', [
        'proposal',
        'design',
        'specs',
        'tasks',
        'execution-plan',
      ]);

      const result = await runCLI(
        ['instructions', 'apply', '--change', 'blocked-test-plan', '--json'],
        { cwd: tempDir }
      );
      expect(result.exitCode).toBe(0);

      const json = JSON.parse(result.stdout);
      expect(json.state).toBe('blocked');
      expect(json.missingArtifacts).toEqual(['test-plan']);
      expect(normalizePaths(json.contextFiles.tasks)).toContain(
        normalizePaths(path.join('superpowers', 'changes', 'blocked-test-plan', 'tasks.md'))
      );
      expect(normalizePaths(json.contextFiles['execution-plan'])).toContain(
        normalizePaths(path.join('superpowers', 'changes', 'blocked-test-plan', 'execution-plan.md'))
      );
      expect(json.contextFiles['test-plan']).toBeUndefined();
      expect(json.progress).toEqual({ total: 1, complete: 0, remaining: 1 });
    });

    it('outputs JSON for apply instructions', async () => {
      await createTestChange('json-apply', [
        'proposal',
        'design',
        'specs',
        'tasks',
        'execution-plan',
        'test-plan',
      ]);

      const result = await runCLI(
        ['instructions', 'apply', '--change', 'json-apply', '--json'],
        { cwd: tempDir }
      );
      expect(result.exitCode).toBe(0);

      const json = JSON.parse(result.stdout);
      expect(json.changeName).toBe('json-apply');
      expect(json.schemaName).toBe('spec-driven');
      expect(json.state).toBe('ready');
      expect(json.contextFiles).toBeDefined();
      expect(typeof json.contextFiles).toBe('object');
      expect(normalizePaths(json.contextFiles.tasks)).toContain(
        normalizePaths(path.join('superpowers', 'changes', 'json-apply', 'tasks.md'))
      );
      expect(normalizePaths(json.contextFiles['execution-plan'])).toContain(
        normalizePaths(path.join('superpowers', 'changes', 'json-apply', 'execution-plan.md'))
      );
      expect(normalizePaths(json.contextFiles['test-plan'])).toContain(
        normalizePaths(path.join('superpowers', 'changes', 'json-apply', 'test-plan.md'))
      );
      expect(json.progress).toEqual({ total: 1, complete: 0, remaining: 1 });
      expect(json.applyRequires).toEqual(['test-plan']);
      expect(json.instruction).toContain('Test Hardening');
      expect(json.instruction).toContain('every concrete Test Hardening row outside `## Final Quality Gates`');
    });

    it('shows schema instruction from apply block', async () => {
      await createTestChange('instr-apply', [
        'proposal',
        'design',
        'specs',
        'tasks',
        'execution-plan',
        'test-plan',
      ]);

      const result = await runCLI(['instructions', 'apply', '--change', 'instr-apply'], {
        cwd: tempDir,
      });
      expect(result.exitCode).toBe(0);
      // Should show the instruction from spec-driven schema apply block
      expect(result.stdout).toContain('work through pending tasks');
      expect(result.stdout).toContain('Test Hardening');
    });

    it('resumes Test Hardening when all tasks are complete but test-plan rows are incomplete', async () => {
      const changeDir = await createTestChange('done-apply', [
        'proposal',
        'design',
        'specs',
        'tasks',
        'execution-plan',
        'test-plan',
      ]);
      // Overwrite tasks with all completed
      await fs.writeFile(
        path.join(changeDir, 'tasks.md'),
        '## Tasks\n- [x] Task 1\n- [x] Task 2'
      );

      const result = await runCLI(['instructions', 'apply', '--change', 'done-apply', '--json'], {
        cwd: tempDir,
      });
      expect(result.exitCode).toBe(0);
      const json = JSON.parse(result.stdout);
      expect(json.state).toBe('ready');
      expect(json.progress).toEqual({ total: 2, complete: 2, remaining: 0 });
      expect(json.instruction).toContain('Continue into Test Hardening');
      expect(json.instruction).toContain(
        'every concrete testing/hardening status row outside `## Final Quality Gates`'
      );
      expect(json.instruction).toContain('## Manual Coverage');
      expect(json.instruction).toContain('`## Deferred Coverage` is not execution evidence');
      expect(json.instruction).toContain('planned');
      expect(json.instruction).toContain('earlier tests were insufficient');
      expect(json.instruction).toContain('Failing hardening tests');
    });

    it('shows all_done state only when tasks and Test Hardening are complete', async () => {
      const changeDir = await createTestChange('hardened-apply', [
        'proposal',
        'design',
        'specs',
        'tasks',
        'execution-plan',
        'test-plan',
      ]);
      await fs.writeFile(
        path.join(changeDir, 'tasks.md'),
        '## Tasks\n- [x] Task 1\n- [x] Task 2'
      );
      await fs.writeFile(path.join(changeDir, 'test-plan.md'), completeTestPlanContent());

      const result = await runCLI(['instructions', 'apply', '--change', 'hardened-apply'], {
        cwd: tempDir,
      });
      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('complete ✓');
      expect(result.stdout).toContain('implementation tasks and Test Hardening are complete');
    });

    it('does not count planned Final Quality Gates rows as unfinished Test Hardening', async () => {
      const changeDir = await createTestChange('hardened-before-final-gates', [
        'proposal',
        'design',
        'specs',
        'tasks',
        'execution-plan',
        'test-plan',
      ]);
      await fs.writeFile(path.join(changeDir, 'tasks.md'), '## Tasks\n- [x] Task 1');
      await fs.writeFile(
        path.join(changeDir, 'test-plan.md'),
        `${completeTestPlanContent()}\n\n## Final Quality Gates\n\n| Gate | Status | Evidence |\n| --- | --- | --- |\n| Verify | planned | Awaiting worker |`
      );

      const result = await runCLI(
        ['instructions', 'apply', '--change', path.basename(changeDir)],
        { cwd: tempDir }
      );
      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('implementation tasks and Test Hardening are complete');
    });

    it.each([
      ['planned', 'pending execution'],
      ['failed', 'focused test failed'],
      ['blocked', 'safe runtime unavailable'],
      ['passed', ''],
    ])(
      'keeps apply in Test Hardening while a Manual Coverage row is %s with evidence %j',
      async (status, evidence) => {
        const changeDir = await createTestChange(
          `manual-coverage-${status}-${evidence ? 'evidence' : 'no-evidence'}`,
          ['proposal', 'design', 'specs', 'tasks', 'execution-plan', 'test-plan']
        );
        await fs.writeFile(path.join(changeDir, 'tasks.md'), '## Tasks\n- [x] Task 1');
        const pendingPlan = completeTestPlanContent().replace(
          '| Generated workflow verification | Focused Vitest in repository workspace | passed | 7 tests passed |',
          `| Generated workflow verification | Focused Vitest in repository workspace | ${status} | ${evidence} |`
        );
        await fs.writeFile(path.join(changeDir, 'test-plan.md'), pendingPlan);

        const result = await runCLI(
          ['instructions', 'apply', '--change', path.basename(changeDir)],
          { cwd: tempDir }
        );
        expect(result.exitCode).toBe(0);
        expect(result.stdout).toContain('Continue into Test Hardening');
      }
    );

    it('uses spec-driven schema apply configuration', async () => {
      // Create a spec-driven style change with all artifacts
      await createTestChange('apply-schema-test', [
        'proposal',
        'design',
        'specs',
        'tasks',
        'execution-plan',
        'test-plan',
      ]);

      const result = await runCLI(
        ['instructions', 'apply', '--change', 'apply-schema-test', '--schema', 'spec-driven'],
        { cwd: tempDir }
      );
      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('Schema: spec-driven');
    });

    it('spec-driven schema uses apply block configuration', async () => {
      // Verify that spec-driven schema uses its apply block (requires: [test-plan])
      await createTestChange('apply-config-test', [
        'proposal',
        'design',
        'specs',
        'tasks',
        'execution-plan',
        'test-plan',
      ]);

      const result = await runCLI(
        ['instructions', 'apply', '--change', 'apply-config-test', '--json'],
        { cwd: tempDir }
      );
      expect(result.exitCode).toBe(0);

      const json = JSON.parse(result.stdout);
      // spec-driven schema has apply block with requires: [test-plan], so should be ready
      expect(json.schemaName).toBe('spec-driven');
      expect(json.state).toBe('ready');
      expect(json.applyRequires).toEqual(['test-plan']);
    });

    it('fallback: requires all artifacts when schema has no apply block', async () => {
      // Create a minimal schema without an apply block in user schemas dir
      const userDataDir = path.join(tempDir, 'user-data');
      const noApplySchemaDir = path.join(userDataDir, 'superpowers', 'schemas', 'no-apply');
      const templatesDir = path.join(noApplySchemaDir, 'templates');
      await fs.mkdir(templatesDir, { recursive: true });

      // Minimal schema with 2 artifacts, no apply block
      const schemaContent = `
name: no-apply
version: 1
description: Test schema without apply block
artifacts:
  - id: first
    generates: first.md
    description: First artifact
    template: first.md
    requires: []
  - id: second
    generates: second.md
    description: Second artifact
    template: second.md
    requires: [first]
`;
      await fs.writeFile(path.join(noApplySchemaDir, 'schema.yaml'), schemaContent);
      await fs.writeFile(path.join(templatesDir, 'first.md'), '# First\n');
      await fs.writeFile(path.join(templatesDir, 'second.md'), '# Second\n');

      // Create a change with only the first artifact (missing second)
      const changeDir = path.join(changesDir, 'no-apply-test');
      await fs.mkdir(changeDir, { recursive: true });
      await fs.writeFile(path.join(changeDir, 'first.md'), '# First artifact content');

      // Run with XDG_DATA_HOME pointing to our temp user data dir
      const result = await runCLI(
        ['instructions', 'apply', '--change', 'no-apply-test', '--schema', 'no-apply', '--json'],
        {
          cwd: tempDir,
          env: { XDG_DATA_HOME: userDataDir },
        }
      );
      expect(result.exitCode).toBe(0);

      const json = JSON.parse(result.stdout);
      // Without apply block, fallback requires ALL artifacts - second is missing
      expect(json.schemaName).toBe('no-apply');
      expect(json.state).toBe('blocked');
      expect(json.missingArtifacts).toContain('second');
    });

    it('fallback: ready when all artifacts exist for schema without apply block', async () => {
      // Create a minimal schema without an apply block
      const userDataDir = path.join(tempDir, 'user-data-2');
      const noApplySchemaDir = path.join(userDataDir, 'superpowers', 'schemas', 'no-apply-full');
      const templatesDir = path.join(noApplySchemaDir, 'templates');
      await fs.mkdir(templatesDir, { recursive: true });

      const schemaContent = `
name: no-apply-full
version: 1
description: Test schema without apply block
artifacts:
  - id: only
    generates: only.md
    description: Only artifact
    template: only.md
    requires: []
`;
      await fs.writeFile(path.join(noApplySchemaDir, 'schema.yaml'), schemaContent);
      await fs.writeFile(path.join(templatesDir, 'only.md'), '# Only\n');

      // Create a change with the artifact present
      const changeDir = path.join(changesDir, 'no-apply-full-test');
      await fs.mkdir(changeDir, { recursive: true });
      await fs.writeFile(path.join(changeDir, 'only.md'), '# Content');

      const result = await runCLI(
        ['instructions', 'apply', '--change', 'no-apply-full-test', '--schema', 'no-apply-full', '--json'],
        {
          cwd: tempDir,
          env: { XDG_DATA_HOME: userDataDir },
        }
      );
      expect(result.exitCode).toBe(0);

      const json = JSON.parse(result.stdout);
      // All artifacts exist, should be ready with default instruction
      expect(json.schemaName).toBe('no-apply-full');
      expect(json.state).toBe('ready');
      expect(json.instruction).toContain('All required artifacts complete');
    });
  });

  describe('help text', () => {
    it('status command help shows description', async () => {
      const result = await runCLI(['status', '--help']);
      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('Display artifact completion status');
    });

    it('instructions command help shows description', async () => {
      const result = await runCLI(['instructions', '--help']);
      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('Output enriched instructions');
    });

    it('templates command help shows description', async () => {
      const result = await runCLI(['templates', '--help']);
      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('Show resolved template paths');
    });

    it('new command help shows description', async () => {
      const result = await runCLI(['new', '--help']);
      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('Create new items');
    });
  });

  describe('experimental command (deprecated alias for init)', () => {
    it('shows deprecation notice', async () => {
      const result = await runCLI(['experimental', '--tool', 'claude'], { cwd: tempDir });
      // May succeed or fail depending on setup, but should show deprecation notice
      const output = getOutput(result);
      expect(output).toContain('deprecated');
    });

    it('errors for unknown tool', async () => {
      const result = await runCLI(['experimental', '--tool', 'unknown-tool'], {
        cwd: tempDir,
      });
      expect(result.exitCode).toBe(1);
      const output = getOutput(result);
      expect(output).toContain('Invalid tool(s): unknown-tool');
    });

    it('errors for tool without skillsDir', async () => {
      // Using 'agents' which doesn't have skillsDir configured
      const result = await runCLI(['experimental', '--tool', 'agents'], {
        cwd: tempDir,
      });
      expect(result.exitCode).toBe(1);
      const output = getOutput(result);
      expect(output).toContain('Invalid tool(s): agents');
    });

    it('creates skills for Claude tool', async () => {
      const result = await runCLI(['experimental', '--tool', 'claude'], {
        cwd: tempDir,
      });
      expect(result.exitCode).toBe(0);
      const output = normalizePaths(getOutput(result));
      expect(output).toContain('Claude Code');
      expect(output).toContain('.claude/');

      // Verify skill files were created
      const skillFile = path.join(tempDir, '.claude', 'skills', 'superpowers-explore', 'SKILL.md');
      const stat = await fs.stat(skillFile);
      expect(stat.isFile()).toBe(true);
    });

    it('creates skills for Cursor tool', async () => {
      const result = await runCLI(['experimental', '--tool', 'cursor'], {
        cwd: tempDir,
      });
      expect(result.exitCode).toBe(0);
      const output = normalizePaths(getOutput(result));
      expect(output).toContain('Cursor');
      expect(output).toContain('.cursor/');

      // Verify skill files were created
      const skillFile = path.join(tempDir, '.cursor', 'skills', 'superpowers-explore', 'SKILL.md');
      const stat = await fs.stat(skillFile);
      expect(stat.isFile()).toBe(true);

      // Verify commands were created with Cursor format
      const commandFile = path.join(tempDir, '.cursor', 'commands', 'sp-explore.md');
      const content = await fs.readFile(commandFile, 'utf-8');
      expect(content).toContain('name: /sp-explore');
    });

    it('creates skills for Windsurf tool', async () => {
      const result = await runCLI(['experimental', '--tool', 'windsurf'], {
        cwd: tempDir,
      });
      expect(result.exitCode).toBe(0);
      const output = normalizePaths(getOutput(result));
      expect(output).toContain('Windsurf');
      expect(output).toContain('.windsurf/');

      // Verify skill files were created
      const skillFile = path.join(tempDir, '.windsurf', 'skills', 'superpowers-explore', 'SKILL.md');
      const stat = await fs.stat(skillFile);
      expect(stat.isFile()).toBe(true);
    });
  });

  describe('project config integration', () => {
    describe('new change uses config schema', () => {
      it('creates change with schema from project config', async () => {
        // Create project config with spec-driven schema
        // Note: changesDir is already at tempDir/superpowers/changes (created in beforeEach)
        await fs.writeFile(
          path.join(tempDir, 'superpowers', 'config.yaml'),
          'schema: spec-driven\n'
        );

        // Create a new change without specifying schema
        const result = await runCLI(['new', 'change', 'test-change'], { cwd: tempDir, timeoutMs: 30000 });
        expect(result.exitCode).toBe(0);

        // Verify the change was created with spec-driven schema
        const metadataPath = path.join(changesDir, 'test-change', '.superpowers.yaml');
        const metadata = await fs.readFile(metadataPath, 'utf-8');
        expect(metadata).toContain('schema: spec-driven');
      }, 60000);

      it('CLI schema overrides config schema', async () => {
        // Create project config with spec-driven schema
        // Note: superpowers directory already exists (from changesDir creation in beforeEach)
        await fs.writeFile(
          path.join(tempDir, 'superpowers', 'config.yaml'),
          'schema: spec-driven\n'
        );

        // Create change with explicit schema
        const result = await runCLI(
          ['new', 'change', 'override-test', '--schema', 'spec-driven'],
          { cwd: tempDir, timeoutMs: 30000 }
        );
        expect(result.exitCode).toBe(0);

        // Verify the change uses the CLI-specified schema
        const metadataPath = path.join(changesDir, 'override-test', '.superpowers.yaml');
        const metadata = await fs.readFile(metadataPath, 'utf-8');
        expect(metadata).toContain('schema: spec-driven');
      }, 60000);
    });

    describe('instructions command with config', () => {
      it('injects context and rules from config into instructions', async () => {
        // Create project config with context and rules
        // Note: superpowers directory already exists (from changesDir creation in beforeEach)
        await fs.writeFile(
          path.join(tempDir, 'superpowers', 'config.yaml'),
          `schema: spec-driven
context: |
  Tech stack: TypeScript, React
  API style: RESTful
rules:
  proposal:
    - Include rollback plan
    - Identify affected teams
`
        );

        // Create a test change
        await createTestChange('config-test');

        // Get instructions for proposal
        const result = await runCLI(
          ['instructions', 'proposal', '--change', 'config-test'],
          { cwd: tempDir, timeoutMs: 30000 }
        );
        expect(result.exitCode).toBe(0);

        // Verify context is injected
        expect(result.stdout).toContain('Tech stack: TypeScript, React');
        expect(result.stdout).toContain('API style: RESTful');

        // Verify rules are injected for proposal
        expect(result.stdout).toContain('Include rollback plan');
        expect(result.stdout).toContain('Identify affected teams');
      }, 60000);

      it('does not inject rules for non-matching artifact', async () => {
        // Create project config with rules only for proposal
        // Note: superpowers directory already exists (from changesDir creation in beforeEach)
        await fs.writeFile(
          path.join(tempDir, 'superpowers', 'config.yaml'),
          `schema: spec-driven
rules:
  proposal:
    - Include rollback plan
`
        );

        // Create a test change
        await createTestChange('non-matching-test');

        // Get instructions for design (not proposal)
        const result = await runCLI(
          ['instructions', 'design', '--change', 'non-matching-test'],
          { cwd: tempDir, timeoutMs: 30000 }
        );
        expect(result.exitCode).toBe(0);

        // Verify rules are NOT injected for design
        expect(result.stdout).not.toContain('Include rollback plan');
      }, 60000);
    });

    describe('backwards compatibility', () => {
      it('existing changes work without config file', async () => {
        // Create change without any config file
        await createTestChange('no-config-change', ['proposal']);

        // Status command should work
        const statusResult = await runCLI(
          ['status', '--change', 'no-config-change'],
          { cwd: tempDir, timeoutMs: 30000 }
        );
        expect(statusResult.exitCode).toBe(0);
        expect(statusResult.stdout).toContain('no-config-change');
        expect(statusResult.stdout).toContain('spec-driven'); // Default schema

        // Instructions command should work
        const instrResult = await runCLI(
          ['instructions', 'design', '--change', 'no-config-change'],
          { cwd: tempDir, timeoutMs: 30000 }
        );
        expect(instrResult.exitCode).toBe(0);
        expect(instrResult.stdout).toContain('<artifact');
      }, 60000);

      it('changes with metadata work without config file', async () => {
        // Create change with explicit schema in metadata
        const changeDir = await createTestChange('metadata-only-change');
        await fs.writeFile(
          path.join(changeDir, '.superpowers.yaml'),
          'schema: spec-driven\ncreated: "2025-01-05"\n'
        );

        // Status should use schema from metadata
        const result = await runCLI(
          ['status', '--change', 'metadata-only-change'],
          { cwd: tempDir, timeoutMs: 30000 }
        );
        expect(result.exitCode).toBe(0);
        expect(result.stdout).toContain('spec-driven');
      }, 60000);
    });

    describe('config changes reflected immediately', () => {
      it('config changes are reflected without restart', async () => {
        // Create initial config
        // Note: superpowers directory already exists (from changesDir creation in beforeEach)
        await fs.writeFile(
          path.join(tempDir, 'superpowers', 'config.yaml'),
          `schema: spec-driven
context: Initial context
`
        );

        // Create a test change
        await createTestChange('immediate-test');

        // Get instructions - should have initial context
        const result1 = await runCLI(
          ['instructions', 'proposal', '--change', 'immediate-test'],
          { cwd: tempDir, timeoutMs: 30000 }
        );
        expect(result1.exitCode).toBe(0);
        expect(result1.stdout).toContain('Initial context');

        // Update config
        await fs.writeFile(
          path.join(tempDir, 'superpowers', 'config.yaml'),
          `schema: spec-driven
context: Updated context
`
        );

        // Get instructions again - should have updated context
        const result2 = await runCLI(
          ['instructions', 'proposal', '--change', 'immediate-test'],
          { cwd: tempDir, timeoutMs: 30000 }
        );
        expect(result2.exitCode).toBe(0);
        expect(result2.stdout).toContain('Updated context');
        expect(result2.stdout).not.toContain('Initial context');
      }, 60000);
    });
  });
});
