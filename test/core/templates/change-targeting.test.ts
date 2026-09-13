import { describe, expect, it } from 'vitest';

import {
  getArchiveChangeSkillTemplate,
  getSpArchiveCommandTemplate,
} from '../../../src/core/templates/workflows/archive-change.js';
import {
  getSpSyncCommandTemplate,
  getSyncSpecsSkillTemplate,
} from '../../../src/core/templates/workflows/sync-specs.js';
import {
  getSpVerifyCommandTemplate,
  getVerifyChangeSkillTemplate,
} from '../../../src/core/templates/workflows/verify-change.js';

const banned = 'Do NOT guess or auto-select a change. Always let the user choose.';

const targetingContents = [
  getVerifyChangeSkillTemplate().instructions,
  getSpVerifyCommandTemplate().content,
  getArchiveChangeSkillTemplate().instructions,
  getSpArchiveCommandTemplate().content,
  getSyncSpecsSkillTemplate().instructions,
  getSpSyncCommandTemplate().content,
];

describe('change targeting auto-select', () => {
  it('verify, archive, and sync do not forbid auto-select when the change is unambiguous', () => {
    for (const text of targetingContents) {
      expect(text).not.toContain(banned);
      expect(text).not.toContain('If no change name provided, prompt for selection');
      expect(text).toMatch(
        /only active change|sole active change|conversation-bound|conversation context/i
      );
    }
  });

  it('verify still reports empty tasks after selection', () => {
    for (const text of [
      getVerifyChangeSkillTemplate().instructions,
      getSpVerifyCommandTemplate().content,
    ]) {
      expect(text).toContain('No tasks to verify');
    }
  });

  it('archive still warns and confirms when applicable gates are incomplete', () => {
    for (const text of [
      getArchiveChangeSkillTemplate().instructions,
      getSpArchiveCommandTemplate().content,
    ]) {
      expect(text).toMatch(/unresolved gate/i);
      expect(text).toMatch(/confirm/i);
      expect(text).not.toContain('Always prompt for change selection if not provided');
    }
  });

  it('sync reports ineligible when no active change has delta specs', () => {
    for (const text of [
      getSyncSpecsSkillTemplate().instructions,
      getSpSyncCommandTemplate().content,
    ]) {
      expect(text).toMatch(/nothing is eligible to sync|no active change has delta specs/i);
    }
  });
});
