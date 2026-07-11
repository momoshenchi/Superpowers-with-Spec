import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { ChangeCommand } from '../../../src/commands/change.js';
import path from 'path';
import { promises as fs } from 'fs';
import os from 'os';

describe('ChangeCommand.show/validate', () => {
  let cmd: ChangeCommand;
  let changeName: string;
  let tempRoot: string;
  let originalCwd: string;

  beforeAll(async () => {
    cmd = new ChangeCommand();
    originalCwd = process.cwd();
    tempRoot = path.join(os.tmpdir(), `superpowers-change-command-${Date.now()}`);
    const changesDir = path.join(tempRoot, 'superpowers', 'changes', 'sample-change');
    await fs.mkdir(changesDir, { recursive: true });
    const proposal = `# Change: Sample Change\n\n## Why\nConsistency in tests.\n\n## What Changes\n- **auth:** Add requirement`;
    await fs.writeFile(path.join(changesDir, 'proposal.md'), proposal, 'utf-8');
    await fs.writeFile(path.join(changesDir, 'design.md'), '## Context\nDesign context.\n', 'utf-8');
    await fs.writeFile(path.join(changesDir, 'tasks.md'), '## 1. Tasks\n\n- [x] 1.1 Done\n', 'utf-8');
    await fs.writeFile(path.join(changesDir, 'execution-plan.md'), '## Task Plan\n\n- [x] Step 1\n', 'utf-8');
    await fs.writeFile(path.join(changesDir, 'test-plan.md'), '## Testing Gap Analysis\n\nCovered.\n', 'utf-8');
    const specDir = path.join(changesDir, 'specs', 'auth');
    await fs.mkdir(specDir, { recursive: true });
    await fs.writeFile(path.join(specDir, 'spec.md'), validDeltaSpec(), 'utf-8');
    process.chdir(tempRoot);
    changeName = 'sample-change';
  });

  afterAll(async () => {
    process.chdir(originalCwd);
    await fs.rm(tempRoot, { recursive: true, force: true });
  });

  it('show --json prints JSON including deltas', async () => {
    const logs: string[] = [];
    const origLog = console.log;
    try {
      console.log = (msg?: any, ...args: any[]) => {
        logs.push([msg, ...args].filter(Boolean).join(' '));
      };

      await cmd.show(changeName, { json: true });

      const output = logs.join('\n');
      const parsed = JSON.parse(output);
      expect(parsed).toHaveProperty('deltas');
      expect(Array.isArray(parsed.deltas)).toBe(true);
    } finally {
      console.log = origLog;
    }
  });

  it('error when no change specified: prints available IDs', async () => {
    const logsErr: string[] = [];
    const origErr = console.error;
    try {
      console.error = (msg?: any, ...args: any[]) => {
        logsErr.push([msg, ...args].filter(Boolean).join(' '));
      };
      await cmd.show(undefined as unknown as string, { json: false } as any);
      // Should have set exit code and printed hint
      expect(process.exitCode).toBe(1);
      const errOut = logsErr.join('\n');
      expect(errOut).toMatch(/No change specified/);
      expect(errOut).toMatch(/Available IDs/);
    } finally {
      console.error = origErr;
      process.exitCode = 0;
    }
  });

  it('show --json --requirements-only returns minimal object with deltas (deprecated alias)', async () => {
    const logs: string[] = [];
    const origLog = console.log;
    try {
      console.log = (msg?: any, ...args: any[]) => {
        logs.push([msg, ...args].filter(Boolean).join(' '));
      };

      await cmd.show(changeName, { json: true, requirementsOnly: true });

      const output = logs.join('\n');
      const parsed = JSON.parse(output);
      expect(parsed).toHaveProperty('deltas');
      expect(Array.isArray(parsed.deltas)).toBe(true);
      if (parsed.deltas.length > 0) {
        expect(parsed.deltas[0]).toHaveProperty('spec');
        expect(parsed.deltas[0]).toHaveProperty('operation');
        expect(parsed.deltas[0]).toHaveProperty('description');
      }
    } finally {
      console.log = origLog;
    }
  });

  it('validate --strict --json returns a report with valid boolean', async () => {
    const logs: string[] = [];
    const origLog = console.log;
    try {
      console.log = (msg?: any, ...args: any[]) => {
        logs.push([msg, ...args].filter(Boolean).join(' '));
      };

      await cmd.validate(changeName, { strict: true, json: true });

      const output = logs.join('\n');
      const parsed = JSON.parse(output);
      expect(parsed).toHaveProperty('valid');
      expect(parsed.valid).toBe(true);
      expect(parsed).toHaveProperty('issues');
      expect(Array.isArray(parsed.issues)).toBe(true);
    } finally {
      console.log = origLog;
      process.exitCode = 0;
    }
  });

  it('validate --json reports missing schema artifacts like top-level validate', async () => {
    const changeDir = path.join(tempRoot, 'superpowers', 'changes', 'missing-test-plan');
    await fs.mkdir(path.join(changeDir, 'specs', 'auth'), { recursive: true });
    await fs.writeFile(path.join(changeDir, 'proposal.md'), '# Change\n\n## Why\nBecause this fixture needs validation.\n\n## What Changes\n- **auth:** Add requirement\n', 'utf-8');
    await fs.writeFile(path.join(changeDir, 'design.md'), '## Context\nDesign context.\n', 'utf-8');
    await fs.writeFile(path.join(changeDir, 'tasks.md'), '## 1. Tasks\n\n- [x] 1.1 Done\n', 'utf-8');
    await fs.writeFile(path.join(changeDir, 'execution-plan.md'), '## Task Plan\n\n- [x] Step 1\n', 'utf-8');
    await fs.writeFile(path.join(changeDir, 'specs', 'auth', 'spec.md'), validDeltaSpec(), 'utf-8');

    const logs: string[] = [];
    const origLog = console.log;
    try {
      console.log = (msg?: any, ...args: any[]) => {
        logs.push([msg, ...args].filter(Boolean).join(' '));
      };

      await cmd.validate('missing-test-plan', { json: true });

      const parsed = JSON.parse(logs.join('\n'));
      expect(parsed.valid).toBe(false);
      expect(parsed.issues).toContainEqual(expect.objectContaining({
        level: 'ERROR',
        path: 'artifact:test-plan',
        message: expect.stringContaining('test-plan.md'),
      }));
      expect(process.exitCode).toBe(1);
    } finally {
      console.log = origLog;
      process.exitCode = 0;
    }
  });
});

function validDeltaSpec(): string {
  return [
    '## ADDED Requirements',
    '',
    '### Requirement: Auth validation SHALL work',
    'The auth validation path SHALL accept complete change fixtures.',
    '',
    '#### Scenario: Auth validation passes',
    '- **GIVEN** a complete change fixture',
    '- **WHEN** validation runs',
    '- **THEN** validation succeeds',
  ].join('\n');
}
