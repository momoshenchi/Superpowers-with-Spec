import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const v = readFileSync(
  path.join(process.cwd(), 'skills/verification-before-completion/SKILL.md'),
  'utf8'
);

describe('verification-before-completion guidance', () => {
  it('does not define evidence as the complete canonical suite', () => {
    expect(v).toMatch(/matching-stage|current stage/i);
    expect(v).not.toMatch(/Execute the FULL command \(fresh, complete\)/);
    expect(v).not.toMatch(/complete canonical suite/);
    expect(v).toContain('Git-related selection');
    expect(v).toMatch(/Empty related selection is not a (task )?pass/i);
  });
});
