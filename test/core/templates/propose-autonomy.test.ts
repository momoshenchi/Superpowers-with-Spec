import { describe, expect, it } from 'vitest';

import {
  getSpProposeCommandTemplate,
  getSpProposeSkillTemplate,
} from '../../../src/core/templates/workflows/propose.js';

function proposeContents(): string[] {
  return [getSpProposeSkillTemplate().instructions, getSpProposeCommandTemplate().content];
}

describe('Propose autonomy templates', () => {
  it('batches high-impact decisions and does not require one-at-a-time waiting', () => {
    for (const content of proposeContents()) {
      expect(content).not.toContain('Ask one decision question at a time and wait for the answer');
      expect(content).not.toMatch(/one-question-at-a-time/);
    }
  });

  it('does not require a TodoWrite progress loop', () => {
    for (const content of proposeContents()) {
      expect(content).not.toMatch(/Use the \*\*TodoWrite tool\*\* to track progress/);
    }
  });

  it('authorizes writes after an explicit create request', () => {
    for (const content of proposeContents()) {
      expect(content).toMatch(/explicit create request|already asked to create/i);
      expect(content).not.toContain(
        'The confirm-and-create outcome is required even when there were zero interview questions'
      );
    }
  });

  it('still forbids inventing user Choices', () => {
    for (const content of proposeContents()) {
      expect(content).toContain('Do not present a model-inferred result as a user Choice');
      expect(content).toMatch(/never labeled as user Choices/);
    }
  });
});
