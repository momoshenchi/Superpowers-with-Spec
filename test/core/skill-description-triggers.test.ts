import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const sec = readFileSync(path.join(process.cwd(), 'skills/security-review/SKILL.md'), 'utf8');
const descriptionLine = sec.split('\n').find((l) => l.startsWith('description:'))!;

describe('skill description triggers', () => {
  it('security-review description requires an explicit security request', () => {
    expect(sec).toMatch(/^description:.*security/m);
    expect(descriptionLine.length).toBeLessThan(400);
    expect(descriptionLine).not.toMatch(/find bugs/);
    expect(descriptionLine).toMatch(/explicit|asked|request/i);
  });
});
