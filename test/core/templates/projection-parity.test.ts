import { describe, expect, it } from 'vitest';

import {
  getApplyChangeSkillTemplate,
  getArchiveChangeSkillTemplate,
  getBulkArchiveChangeSkillTemplate,
  getChangeReviewSkillTemplate,
  getContinueChangeSkillTemplate,
  getDesignVerifySkillTemplate,
  getExploreSkillTemplate,
  getFfChangeSkillTemplate,
  getNewChangeSkillTemplate,
  getOnboardSkillTemplate,
  getShapeReviewSkillTemplate,
  getSimplifySkillTemplate,
  getSpApplyCommandTemplate,
  getSpArchiveCommandTemplate,
  getSpBulkArchiveCommandTemplate,
  getSpContinueCommandTemplate,
  getSpDesignVerifyCommandTemplate,
  getSpExploreCommandTemplate,
  getSpFfCommandTemplate,
  getSpNewCommandTemplate,
  getSpOnboardCommandTemplate,
  getSpProposeCommandTemplate,
  getSpProposeSkillTemplate,
  getSpReviewCommandTemplate,
  getSpShapeReviewCommandTemplate,
  getSpSimplifyCommandTemplate,
  getSpSyncCommandTemplate,
  getSpVerifyCommandTemplate,
  getSyncSpecsSkillTemplate,
  getVerifyChangeSkillTemplate,
} from '../../../src/core/templates/skill-templates.js';

const PROJECTION_PAIRS: Array<[string, () => { instructions: string }, () => { content: string }]> = [
  ['explore', getExploreSkillTemplate, getSpExploreCommandTemplate],
  ['new', getNewChangeSkillTemplate, getSpNewCommandTemplate],
  ['continue', getContinueChangeSkillTemplate, getSpContinueCommandTemplate],
  ['apply', getApplyChangeSkillTemplate, getSpApplyCommandTemplate],
  ['ff', getFfChangeSkillTemplate, getSpFfCommandTemplate],
  ['sync', getSyncSpecsSkillTemplate, getSpSyncCommandTemplate],
  ['archive', getArchiveChangeSkillTemplate, getSpArchiveCommandTemplate],
  ['bulk-archive', getBulkArchiveChangeSkillTemplate, getSpBulkArchiveCommandTemplate],
  ['verify', getVerifyChangeSkillTemplate, getSpVerifyCommandTemplate],
  ['simplify', getSimplifySkillTemplate, getSpSimplifyCommandTemplate],
  ['design-verify', getDesignVerifySkillTemplate, getSpDesignVerifyCommandTemplate],
  ['propose', getSpProposeSkillTemplate, getSpProposeCommandTemplate],
  ['review', getChangeReviewSkillTemplate, getSpReviewCommandTemplate],
  ['shape-review', getShapeReviewSkillTemplate, getSpShapeReviewCommandTemplate],
  ['onboard', getOnboardSkillTemplate, getSpOnboardCommandTemplate],
];

function tally(lines: string[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const line of lines) {
    counts.set(line, (counts.get(line) ?? 0) + 1);
  }
  return counts;
}

/**
 * Lines carried by one projection but not the other, as a multiset difference.
 * Relocating a line within a projection is not drift; gaining or losing one is.
 */
function projectionDrift(skill: string, command: string): { skillOnly: string[]; commandOnly: string[] } {
  const skillLines = skill.split('\n').filter((line) => line.trim() !== '');
  const commandLines = command.split('\n').filter((line) => line.trim() !== '');

  const remainingCommand = tally(commandLines);
  const skillOnly: string[] = [];
  for (const line of skillLines) {
    const available = remainingCommand.get(line) ?? 0;
    if (available > 0) remainingCommand.set(line, available - 1);
    else skillOnly.push(line);
  }

  const remainingSkill = tally(skillLines);
  const commandOnly: string[] = [];
  for (const line of commandLines) {
    const available = remainingSkill.get(line) ?? 0;
    if (available > 0) remainingSkill.set(line, available - 1);
    else commandOnly.push(line);
  }

  return { skillOnly, commandOnly };
}

describe('skill and command projection parity', () => {
  it('records every line that differs between the two projections of each workflow', () => {
    const drift = Object.fromEntries(
      PROJECTION_PAIRS.map(([id, skillFactory, commandFactory]) => {
        const { skillOnly, commandOnly } = projectionDrift(
          skillFactory().instructions,
          commandFactory().content
        );
        return [id, { skillOnly, commandOnly }];
      })
    );

    expect(drift).toMatchSnapshot();
  });

  it('keeps workflows built from a single shared body perfectly identical', () => {
    const singleBodyWorkflows = ['bulk-archive', 'simplify', 'design-verify'];

    for (const id of singleBodyWorkflows) {
      const pair = PROJECTION_PAIRS.find(([name]) => name === id);
      if (!pair) throw new Error(`Unknown workflow in parity list: ${id}`);
      const [, skillFactory, commandFactory] = pair;

      expect(skillFactory().instructions, id).toBe(commandFactory().content);
    }
  });
});
