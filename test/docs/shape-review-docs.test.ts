import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

function readDoc(relativePath: string): string {
  return readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

describe('shape-review docs', () => {
  const commands = readDoc('docs/commands.md');
  const workflows = readDoc('docs/workflows.md');
  const supportedTools = readDoc('docs/supported-tools.md');

  it('documents /sp:shape-review as optional and distinct from /sp:review', () => {
    for (const doc of [commands, workflows, supportedTools]) {
      expect(doc).toContain('/sp:shape-review');
      expect(doc).toContain('/sp:review');
    }

    expect(commands).toContain('does not block archive');
    expect(commands).toContain('say you want a shape review in this conversation');
    expect(commands).toContain('`/sp:review` is not an abbreviation');
    expect(commands).toContain('not included in the default `core` profile');

    expect(workflows).toContain('does not block archive');
    expect(workflows).toContain('say you want a shape review in this conversation');
    expect(workflows).toContain('`/sp:review` is not an abbreviation');

    expect(supportedTools).toContain('shape-review');
    expect(supportedTools).toContain('superpowers-shape-review');
  });

  it('lists core without shape-review and custom lists with it', () => {
    expect(supportedTools).toContain('**Core profile (default):** `propose`, `explore`, `review`, `apply`, `archive`');
    expect(supportedTools).toMatch(/Custom selection:[\s\S]*`shape-review`/);
    expect(supportedTools).not.toMatch(/\*\*Core profile \(default\):\*\*[^\n]*shape-review/);

    expect(commands).toContain('| `/sp:review` | Review proposal artifacts before implementation |');
    expect(commands).toContain('| `/sp:shape-review` | Optional read-only Surface / Boundaries / Model / Composition review |');
    expect(workflows).toContain('- `/sp:review`');
    expect(workflows).toContain('`/sp:shape-review`');
  });
});
