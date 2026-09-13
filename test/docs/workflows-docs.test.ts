import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

function readDoc(relativePath: string): string {
  return readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

describe('workflow and command docs', () => {
  const workflows = readDoc('docs/workflows.md');
  const commands = readDoc('docs/commands.md');

  it('workflows.md indexes schema templates instead of embedding them', () => {
    expect(workflows).toContain('proposal.md');
    expect(workflows).toContain('tasks.md');
    expect(workflows).toContain('#### Scenario:');
    expect(workflows).toContain('schemas/spec-driven/templates/');
    expect(workflows).toMatch(/## Artifact templates/);
  });

  it('workflows.md does not require complete suite fail-closed', () => {
    expect(workflows).not.toMatch(/fail-closed runs the complete canonical non-visual suite/);
    expect(workflows).not.toMatch(/a host unable to launch a gate worker blocks completion/);
    expect(workflows).toMatch(/Git-aware|Git-related/);
    expect(workflows).toMatch(/same-context fallback/);
    expect(workflows).toMatch(/parallel|pre-Verify wave/i);
    expect(workflows).toContain('code review ∥ Simplify ∥ Design verify, then Verify');
    expect(workflows).not.toMatch(/the three final quality gates that `\/sp:apply` runs after Test Hardening/);
    expect(workflows).toContain('ran-complete-suite-optional');
    expect(workflows).toContain('Manual Coverage');
  });

  it('commands.md uses Git-aware suite stage and labeled spawn fallback', () => {
    expect(commands).not.toMatch(/fail-closed runs the complete canonical non-visual suite/);
    expect(commands).not.toMatch(/otherwise runs the complete canonical non-visual suite/);
    expect(commands).not.toMatch(/otherwise the complete suite/);
    expect(commands).toMatch(/Git-aware|Git-related/);
    expect(commands).toMatch(/same-context fallback/);
    expect(commands).toContain('git-aware-unavailable-recorded');
    expect(commands).toContain('ran-complete-suite-optional');
    expect(commands).toMatch(/parallel|pre-Verify wave/i);
    expect(commands).toContain('Manual Coverage');
  });
});
