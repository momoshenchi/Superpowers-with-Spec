import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import {
  parseFinalQualityGates,
  describeUnresolvedGates,
} from '../../../src/core/parsers/test-plan-gates.js';

function sectionWith(rows: string[]): string {
  return [
    '## Deferred Coverage',
    '',
    '| Gap | Reason | Follow-up |',
    '| --- | --- | --- |',
    '',
    '## Final Quality Gates',
    '',
    '| Gate | Outcome | Fresh worker evidence |',
    '| --- | --- | --- |',
    ...rows,
    '',
  ].join('\n');
}

describe('parseFinalQualityGates', () => {
  it('reports the section as absent when test-plan.md never recorded gates', () => {
    const report = parseFinalQualityGates('## Testing Gap Analysis\n\nCovered.\n');

    expect(report.sectionPresent).toBe(false);
    expect(report.rows).toEqual([]);
    expect(describeUnresolvedGates(report)).toContain('no "## Final Quality Gates" record');
  });

  it('treats every gate as resolved when each row passed or is justified not applicable', () => {
    const report = parseFinalQualityGates(
      sectionWith([
        '| code review | passed | round 1, fresh worker, no P0 |',
        '| `/sp:simplify` | passed | single pass, 2 cleanups |',
        '| `/sp:verify` | passed | round 1, suite green |',
        '| `/sp:design-verify` | not applicable | non-UI change, diff has no UI paths |',
      ])
    );

    expect(report.rows).toHaveLength(4);
    expect(report.unresolved).toEqual([]);
    expect(describeUnresolvedGates(report)).toBeNull();
  });

  it('flags failed and blocked gates with their names', () => {
    const report = parseFinalQualityGates(
      sectionWith([
        '| code review | passed | round 2 |',
        '| `/sp:simplify` | blocked | scope could not be resolved |',
        '| `/sp:verify` | failed | round 4 still failing |',
        '| `/sp:design-verify` | passed | conforms |',
      ])
    );

    expect(report.unresolved.map((row) => row.gate)).toEqual(['/sp:simplify', '/sp:verify']);

    const message = describeUnresolvedGates(report);
    expect(message).toContain('2 final quality gate(s) not passed');
    expect(message).toContain('/sp:simplify: blocked');
    expect(message).toContain('/sp:verify: failed');
  });

  it('treats an unfilled template placeholder row as planned, not as its first listed word', () => {
    const template = fs.readFileSync(
      path.join(process.cwd(), 'schemas', 'spec-driven', 'templates', 'test-plan.md'),
      'utf-8'
    );

    const report = parseFinalQualityGates(template);

    expect(report.sectionPresent).toBe(true);
    expect(report.rows.map((row) => row.gate)).toEqual([
      'code review',
      '/sp:simplify',
      '/sp:verify',
      '/sp:design-verify',
    ]);
    expect(report.rows.every((row) => row.outcome === 'planned')).toBe(true);
    expect(describeUnresolvedGates(report)).toContain('4 final quality gate(s) not passed');
  });

  it('stops reading at the next section heading', () => {
    const content = [
      '## Final Quality Gates',
      '',
      '| Gate | Outcome | Fresh worker evidence |',
      '| --- | --- | --- |',
      '| code review | passed | round 1 |',
      '',
      '## Appendix',
      '',
      '| Gate | Outcome | Fresh worker evidence |',
      '| --- | --- | --- |',
      '| something else | failed | should be ignored |',
    ].join('\n');

    const report = parseFinalQualityGates(content);

    expect(report.rows).toHaveLength(1);
    expect(report.unresolved).toEqual([]);
  });

  it('reports an empty gate table rather than claiming the gates passed', () => {
    const report = parseFinalQualityGates(sectionWith([]));

    expect(report.sectionPresent).toBe(true);
    expect(report.rows).toEqual([]);
    expect(describeUnresolvedGates(report)).toContain('records no gate rows');
  });
});
