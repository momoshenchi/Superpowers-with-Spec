import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const readGuidance = (...parts: string[]) =>
  readFileSync(path.join(process.cwd(), ...parts), 'utf8');

describe('subagent dispatch-unit guidance', () => {
  it('selects one of the two work modes before invoking SDD execution', () => {
    const skill = readGuidance('skills', 'subagent-driven-development', 'SKILL.md');

    expect(skill).toContain('## Work Mode');
    expect(skill).toContain(
      '1. **Direct Modification** — Implement low-risk, local, unambiguous, reversible work directly, then run relevant checks and apply `verification-before-completion` before claiming success.'
    );
    expect(skill).toContain(
      '2. **Proposal → Review → Apply** — Create the required artifacts, review them, and run `/sp:apply`. Apply retains schema-aware review, Test Hardening, and the final gate order: code review → Simplify → Verify → Design Verify.'
    );
    expect(skill).toContain('Direct Modification does not create a Change Proposal');
    expect(skill).toContain('Proposal → Review → Apply owns Dispatch Unit execution');
  });

  it('dispatches logical dispatch units and supports legacy task lists', () => {
    const skill = readGuidance('skills', 'subagent-driven-development', 'SKILL.md');
    const prompt = readGuidance('skills', 'subagent-driven-development', 'implementer-prompt.md');

    expect(skill).toContain('# <number>. <scope>');
    expect(skill).toContain('logical dispatch-unit');
    expect(skill).toContain('combine compatible dispatch units');
    expect(skill).toContain('execute all dispatch units sequentially');
    expect(skill).toContain('one sequential dispatch unit');
    expect(skill).toContain('legacy');
    expect(skill).not.toContain('fresh subagent per task');
    expect(prompt).toContain('complete dispatch unit');
  });

  it('hands final quality gates and completion sequencing to Apply', () => {
    const development = readGuidance('skills', 'subagent-driven-development', 'SKILL.md');
    const review = readGuidance('skills', 'when-to-dispatch-code-review', 'SKILL.md');

    expect(development).toContain('/sp:apply');
    expect(development).not.toContain('one final cross-unit integration review');
    expect(development).not.toContain('final integration review');
    expect(development).toContain('### Final Quality Gates');
    expect(development).toContain('code review');
    expect(development).toContain('Simplify');
    expect(development).toContain('Verify');
    expect(development).toContain('Design verify');
    expect(development).toContain('read-only by default');
    expect(development).toContain('Do not dispatch a separate complete review');
    expect(development).toContain('#### Subagent allocation');
    expect(development).toContain('one gate → one fresh worker');
    expect(development).toContain('await and integrate its report before dispatching the next');

    const gatesIndex = development.indexOf('### Final Quality Gates');
    const verificationIndex = development.indexOf('verification-before-completion', gatesIndex);
    const finishingIndex = development.indexOf('finishing-a-development-branch', verificationIndex);
    expect(verificationIndex).toBeGreaterThan(gatesIndex);
    expect(finishingIndex).toBeGreaterThan(verificationIndex);

    expect(review).toContain('Apply owns the mandatory code review gate');
    expect(review).not.toContain('one final cross-unit integration review');
    expect(review).not.toContain('After all units are integrated and local verification passes');
  });

  it('routes Explore and Debug investigation before implementation dispatch', () => {
    const development = readGuidance('skills', 'subagent-driven-development', 'SKILL.md');

    expect(development).toContain('Manual execution, Explore, or Debug first');
    expect(development).toContain('## Work Mode');
    expect(development).toContain('Direct Modification');
    expect(development).toContain('Proposal → Review → Apply');
  });
});
