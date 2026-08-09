import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const readGuidance = (...parts: string[]) =>
  readFileSync(path.join(process.cwd(), ...parts), 'utf8');

describe('using-superpowers work-mode guidance', () => {
  const skill = () => readGuidance('skills', 'using-superpowers', 'SKILL.md');

  it('defines exactly two work modes and treats a requested plan as an execution aid', () => {
    const content = skill();
    const geminiTools = readGuidance(
      'skills',
      'using-superpowers',
      'reference',
      'gemini-tools.md'
    );

    expect(content).toContain('Exactly two work modes');
    expect(content).toContain('Direct Modification');
    expect(content).toContain('Proposal → Review → Apply');
    expect(content).toContain('A requested plan is an execution aid');
    expect(content).toContain('not a third mode');
    expect(content).toContain('verification-before-completion');
    expect(geminiTools).toContain('Optional host research controls');
    expect(geminiTools).toContain('do not create a third Superpowers work mode');
  });

  it('requires a Proposal for explicit requests and risk or contract overrides', () => {
    const content = skill();

    expect(content).toContain('Explicit Proposal request');
    expect(content).toContain('new externally visible capability');
    expect(content).toContain('public contract');
    expect(content).toContain('authentication or authorization');
    expect(content).toContain('billing');
    expect(content).toContain('data integrity or recovery');
    expect(content).toContain('Prompt length and file count are not selection rules');
  });

  it('promotes direct work before further edits when the discovered scope crosses a boundary', () => {
    const content = skill();

    expect(content).toContain('Promote before further edits');
    expect(content).toContain('migration');
    expect(content).toContain('multiple large implementation surfaces');
    expect(content).toContain('multiple dependency waves');
    expect(content).toContain('exceeds the Proposal budget');
  });

  it('defines six scored workload dimensions, anchors, and calibrated bands', () => {
    const content = skill();

    for (const dimension of [
      'Implementation surface',
      'Layer breadth',
      'Behavior complexity',
      'Verification cost',
      'Orchestration cost',
      'Context churn',
    ]) {
      expect(content).toContain(dimension);
    }

    expect(content).toContain('0 = no meaningful contribution');
    expect(content).toContain('3 = broad, cross-boundary, or highly uncertain');
    expect(content).toContain('`0–5`: small');
    expect(content).toContain('`6–10`: medium');
    expect(content).toContain('`11–14`: large');
    expect(content).toContain('`15+`: very large');
  });

  it('uses a combined workload budget and counts shared foundations once', () => {
    const content = skill();

    expect(content).toContain('Count a shared foundation once');
    expect(content).toContain('combined score of 14 or less');
    expect(content).toContain('3–5 Dispatch Units');
    expect(content).toContain('2–3 dependency waves');
    expect(content).toContain('soft limits');
  });

  it('combines bounded fixes while splitting large or stable milestone work', () => {
    const content = skill();

    expect(content).toContain('Combine small and medium work');
    expect(content).toContain('Split multiple large capabilities');
    expect(content).toContain('Keep a small companion fix');
    expect(content).toContain('Stage one very large capability');
    expect(content).toContain('single-Proposal exception');
  });

  it('keeps small cross-feature fixes together while protecting large-task context', () => {
    const content = skill();

    expect(content).toContain('correcting canvas generation');
    expect(content).toContain('unblocking a stuck notification');
    expect(content).toContain('canvas-management UI');
    expect(content).toContain('message send/receive delivery');
    expect(content).toContain('foundation, core flow, and UI/integration Proposals');
    expect(content).toContain('completing one does not create an independently archivable Proposal');
  });

  it('distinguishes Proposal boundaries from Dispatch Unit boundaries', () => {
    const content = skill();

    expect(content).toContain('context, workload, acceptance, and archive boundary');
    expect(content).toContain('ownership, dependency, and safe-parallelism boundary');
    expect(content).toContain('not a live agent identity');
    expect(content).toContain('not independently archivable');
    expect(content).toContain('not a checkbox-sized timebox');
  });

  it('preserves dependency contracts across long-running Proposal sets', () => {
    const content = skill();

    expect(content).toContain('prerequisite');
    expect(content).toContain('unblocks');
    expect(content).toContain('stable interface');
    expect(content).toContain('independently testable and substantial');
    expect(content).toContain('no unmet dependency and no shared mutable ownership');
    expect(content).toContain('serialize');
  });

  it('retains the established Proposal quality lifecycle without inventing artifacts', () => {
    const content = skill();

    expect(content).toContain('Test Hardening');
    expect(content).toContain('code review → Simplify → Verify → Design Verify');
    expect(content).toContain('Do not add a Plan Mode artifact or schema');
  });
});
