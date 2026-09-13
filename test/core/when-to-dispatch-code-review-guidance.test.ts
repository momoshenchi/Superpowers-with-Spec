import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const review = readFileSync(
  path.join(process.cwd(), 'skills/when-to-dispatch-code-review/SKILL.md'),
  'utf8'
);

describe('when-to-dispatch-code-review guidance', () => {
  it('does not schedule another complete review around Apply', () => {
    expect(review).toMatch(/single integrated/i);
    expect(review).toMatch(/Direct Modification/);
    expect(review).not.toMatch(/P0|retry the gate|severity scale of Apply/i);
  });
});
