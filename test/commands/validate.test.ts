import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import { runCLI } from '../helpers/run-cli.js';

describe('top-level validate command', () => {
  const projectRoot = process.cwd();
  const testDir = path.join(projectRoot, 'test-validate-command-tmp');
  const changesDir = path.join(testDir, 'superpowers', 'changes');
  const specsDir = path.join(testDir, 'superpowers', 'specs');

  beforeEach(async () => {
    await fs.mkdir(changesDir, { recursive: true });
    await fs.mkdir(specsDir, { recursive: true });

    // Create a valid spec
    const specContent = [
      '## Purpose',
      'This spec ensures the validation harness exercises a deterministic alpha module for automated tests.',
      '',
      '## Requirements',
      '',
      '### Requirement: Alpha module SHALL produce deterministic output',
      'The alpha module SHALL produce a deterministic response for validation.',
      '',
      '#### Scenario: Deterministic alpha run',
      '- **GIVEN** a configured alpha module',
      '- **WHEN** the module runs the default flow',
      '- **THEN** the output matches the expected fixture result',
    ].join('\n');
    await fs.mkdir(path.join(specsDir, 'alpha'), { recursive: true });
    await fs.writeFile(path.join(specsDir, 'alpha', 'spec.md'), specContent, 'utf-8');

    // Create a simple change with bullets (parser supports this)
    const changeContent = `# Test Change\n\n## Why\nBecause reasons that are sufficiently long for validation.\n\n## What Changes\n- **alpha:** Add something`;
    await fs.mkdir(path.join(changesDir, 'c1'), { recursive: true });
    await fs.writeFile(path.join(changesDir, 'c1', 'proposal.md'), changeContent, 'utf-8');
    const deltaContent = [
      '## ADDED Requirements',
      '### Requirement: Validator SHALL support alpha change deltas',
      'The validator SHALL accept deltas provided by the test harness.',
      '',
      '#### Scenario: Apply alpha delta',
      '- **GIVEN** the test change delta',
      '- **WHEN** superpowers validate runs',
      '- **THEN** the validator reports the change as valid',
    ].join('\n');
    const c1DeltaDir = path.join(changesDir, 'c1', 'specs', 'alpha');
    await fs.mkdir(c1DeltaDir, { recursive: true });
    await fs.writeFile(path.join(c1DeltaDir, 'spec.md'), deltaContent, 'utf-8');
    await writeRequiredArtifacts(path.join(changesDir, 'c1'));

    // Duplicate name for ambiguity test
    await fs.mkdir(path.join(changesDir, 'dup'), { recursive: true });
    await fs.writeFile(path.join(changesDir, 'dup', 'proposal.md'), changeContent, 'utf-8');
    const dupDeltaDir = path.join(changesDir, 'dup', 'specs', 'dup');
    await fs.mkdir(dupDeltaDir, { recursive: true });
    await fs.writeFile(path.join(dupDeltaDir, 'spec.md'), deltaContent, 'utf-8');
    await writeRequiredArtifacts(path.join(changesDir, 'dup'));
    await fs.mkdir(path.join(specsDir, 'dup'), { recursive: true });
    await fs.writeFile(path.join(specsDir, 'dup', 'spec.md'), specContent, 'utf-8');
  });

  afterEach(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
  });

  it('prints a helpful hint when no args in non-interactive mode', async () => {
    const result = await runCLI(['validate'], { cwd: testDir });
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain('Nothing to validate. Try one of:');
  });

  it('validates all with --all and outputs JSON summary', async () => {
    const result = await runCLI(['validate', '--all', '--json'], { cwd: testDir });
    expect(result.exitCode).toBe(0);
    const output = result.stdout.trim();
    expect(output).not.toBe('');
    const json = JSON.parse(output);
    expect(Array.isArray(json.items)).toBe(true);
    expect(json.summary?.totals?.items).toBeDefined();
    expect(json.version).toBe('1.0');
  });

  it('fails direct change validation when a schema artifact is missing', async () => {
    const changeDir = path.join(changesDir, 'missing-test-plan');
    await createCompleteChange(changeDir);
    await fs.rm(path.join(changeDir, 'test-plan.md'));

    const result = await runCLI(['validate', 'missing-test-plan'], { cwd: testDir });

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain('artifact:test-plan');
    expect(result.stderr).toContain('test-plan.md');
    expect(result.stderr).toContain('Create or regenerate any missing schema artifacts');
  });

  it('treats an existing change directory without proposal.md as a change', async () => {
    const changeDir = path.join(changesDir, 'scaffolded');
    await createCompleteChange(changeDir);
    await fs.rm(path.join(changeDir, 'proposal.md'));

    const result = await runCLI(['validate', 'scaffolded', '--json'], { cwd: testDir });

    expect(result.exitCode).toBe(1);
    const json = JSON.parse(result.stdout);
    expect(json.items[0].type).toBe('change');
    expect(json.items[0].issues).toContainEqual(expect.objectContaining({
      level: 'ERROR',
      path: 'artifact:proposal',
      message: expect.stringContaining('proposal.md'),
    }));
    expect(result.stderr).not.toContain('Unknown item');
  });

  it('includes missing artifact issues in bulk --changes JSON output', async () => {
    const changeDir = path.join(changesDir, 'bulk-missing-execution');
    await createCompleteChange(changeDir);
    await fs.rm(path.join(changeDir, 'execution-plan.md'));

    const result = await runCLI(['validate', '--changes', '--json'], { cwd: testDir });

    expect(result.exitCode).toBe(1);
    const json = JSON.parse(result.stdout);
    const item = json.items.find((entry: any) => entry.id === 'bulk-missing-execution');
    expect(item.valid).toBe(false);
    expect(item.issues).toContainEqual(expect.objectContaining({
      path: 'artifact:execution-plan',
      message: expect.stringContaining('execution-plan'),
    }));
  });

  it('includes existing change directories without proposal.md in bulk validation', async () => {
    const changeDir = path.join(changesDir, 'bulk-scaffolded');
    await createCompleteChange(changeDir);
    await fs.rm(path.join(changeDir, 'proposal.md'));

    const changesResult = await runCLI(['validate', '--changes', '--json'], { cwd: testDir });
    expect(changesResult.exitCode).toBe(1);
    const changesJson = JSON.parse(changesResult.stdout);
    const changesItem = changesJson.items.find((entry: any) => entry.id === 'bulk-scaffolded');
    expect(changesItem).toEqual(expect.objectContaining({
      type: 'change',
      valid: false,
    }));
    expect(changesItem.issues).toContainEqual(expect.objectContaining({
      level: 'ERROR',
      path: 'artifact:proposal',
      message: expect.stringContaining('proposal.md'),
    }));

    const allResult = await runCLI(['validate', '--all', '--json'], { cwd: testDir });
    expect(allResult.exitCode).toBe(1);
    const allJson = JSON.parse(allResult.stdout);
    const allItem = allJson.items.find((entry: any) => entry.id === 'bulk-scaffolded');
    expect(allItem).toEqual(expect.objectContaining({
      type: 'change',
      valid: false,
    }));
    expect(allItem.issues).toContainEqual(expect.objectContaining({
      path: 'artifact:proposal',
    }));
  });

  it('includes schema artifact issues in --all JSON output while still validating specs', async () => {
    const changeDir = path.join(changesDir, 'all-missing-test-plan');
    await createCompleteChange(changeDir);
    await fs.rm(path.join(changeDir, 'test-plan.md'));

    const result = await runCLI(['validate', '--all', '--json'], { cwd: testDir });

    expect(result.exitCode).toBe(1);
    const json = JSON.parse(result.stdout);
    expect(json.items.some((entry: any) => entry.type === 'spec' && entry.id === 'alpha' && entry.valid)).toBe(true);
    const item = json.items.find((entry: any) => entry.id === 'all-missing-test-plan');
    expect(item.issues).toContainEqual(expect.objectContaining({
      level: 'ERROR',
      path: 'artifact:test-plan',
    }));
  });

  it('validates only specs with --specs and respects --concurrency', async () => {
    const result = await runCLI(['validate', '--specs', '--json', '--concurrency', '1'], { cwd: testDir });
    expect(result.exitCode).toBe(0);
    const output = result.stdout.trim();
    expect(output).not.toBe('');
    const json = JSON.parse(output);
    expect(json.items.every((i: any) => i.type === 'spec')).toBe(true);
  });

  it('errors on ambiguous item names and suggests type override', async () => {
    const result = await runCLI(['validate', 'dup'], { cwd: testDir });
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain('Ambiguous item');
  });

  it('accepts change proposals saved with CRLF line endings', async () => {
    const changeId = 'crlf-change';
    const toCrlf = (segments: string[]) => segments.join('\n').replace(/\n/g, '\r\n');

    const crlfContent = toCrlf([
      '# CRLF Proposal',
      '',
      '## Why',
      'This change verifies validation works with Windows line endings.',
      '',
      '## What Changes',
      '- **alpha:** Ensure validation passes on CRLF files',
    ]);

    await fs.mkdir(path.join(changesDir, changeId), { recursive: true });
    await fs.writeFile(path.join(changesDir, changeId, 'proposal.md'), crlfContent, 'utf-8');

    const deltaContent = toCrlf([
      '## ADDED Requirements',
      '### Requirement: Parser SHALL accept CRLF change proposals',
      'The parser SHALL accept CRLF change proposals without manual edits.',
      '',
      '#### Scenario: Validate CRLF change',
      '- **GIVEN** a change proposal saved with CRLF line endings',
      '- **WHEN** a developer runs superpowers validate on the proposal',
      '- **THEN** validation succeeds without section errors',
    ]);

    const deltaDir = path.join(changesDir, changeId, 'specs', 'alpha');
    await fs.mkdir(deltaDir, { recursive: true });
    await fs.writeFile(path.join(deltaDir, 'spec.md'), deltaContent, 'utf-8');
    await writeRequiredArtifacts(path.join(changesDir, changeId));

    const result = await runCLI(['validate', changeId], { cwd: testDir });
    expect(result.exitCode).toBe(0);
  });

  it('respects --no-interactive flag passed via CLI', async () => {
    // This test ensures Commander.js --no-interactive flag is correctly parsed
    // and passed to the validate command. The flag sets options.interactive = false
    // (not options.noInteractive = true) due to Commander.js convention.
    const result = await runCLI(['validate', '--specs', '--no-interactive'], {
      cwd: testDir,
      // Don't set OPEN_SPEC_INTERACTIVE to ensure we're testing the flag itself
      env: { ...process.env, OPEN_SPEC_INTERACTIVE: undefined },
    });
    expect(result.exitCode).toBe(0);
    // Should complete without hanging and without prompts
    expect(result.stderr).not.toContain('What would you like to validate?');
  });

  async function createCompleteChange(changeDir: string): Promise<void> {
    await fs.mkdir(path.join(changeDir, 'specs', 'alpha'), { recursive: true });
    await fs.writeFile(
      path.join(changeDir, 'proposal.md'),
      `# Test Change\n\n## Why\nBecause this change fixture is complete.\n\n## What Changes\n- **alpha:** Add behavior`,
      'utf-8'
    );
    await fs.writeFile(
      path.join(changeDir, 'specs', 'alpha', 'spec.md'),
      [
        '## ADDED Requirements',
        '',
        '### Requirement: CLI validation SHALL inspect artifacts',
        'The CLI validation path SHALL report missing schema artifacts.',
        '',
        '#### Scenario: Missing artifact is reported',
        '- **GIVEN** a schema-incomplete change',
        '- **WHEN** validation runs',
        '- **THEN** the missing artifact is reported',
      ].join('\n'),
      'utf-8'
    );
    await writeRequiredArtifacts(changeDir);
  }

  async function writeRequiredArtifacts(changeDir: string): Promise<void> {
    await fs.writeFile(path.join(changeDir, 'design.md'), '## Context\nDesign context.\n', 'utf-8');
    await fs.writeFile(path.join(changeDir, 'tasks.md'), '## 1. Tasks\n\n- [x] 1.1 Done\n', 'utf-8');
    await fs.writeFile(path.join(changeDir, 'execution-plan.md'), '## Task Plan\n\n- [x] Step 1\n', 'utf-8');
    await fs.writeFile(path.join(changeDir, 'test-plan.md'), '## Testing Gap Analysis\n\nCovered.\n', 'utf-8');
  }
});
