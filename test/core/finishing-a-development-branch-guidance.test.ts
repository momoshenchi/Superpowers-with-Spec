import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const finish = readFileSync(
  path.join(process.cwd(), 'skills/finishing-a-development-branch/SKILL.md'),
  'utf8'
);

describe('finishing-a-development-branch guidance', () => {
  it('does not require npm test cargo test pytest go test before options', () => {
    expect(finish).not.toMatch(/npm test \/ cargo test \/ pytest \/ go test \.\/\.\.\./);
    expect(finish).toMatch(/Git-aware|related tests/i);
  });

  it('still offers merge PR keep discard', () => {
    expect(finish).toMatch(/Merge back to/);
    expect(finish).toMatch(/Discard this work/);
    expect(finish).toMatch(/Pull Request/);
    expect(finish).toMatch(/Keep the branch/i);
  });
});
