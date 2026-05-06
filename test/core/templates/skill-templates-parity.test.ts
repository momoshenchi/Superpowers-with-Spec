import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';

import {
  type SkillTemplate,
  getApplyChangeSkillTemplate,
  getArchiveChangeSkillTemplate,
  getBulkArchiveChangeSkillTemplate,
  getContinueChangeSkillTemplate,
  getExploreSkillTemplate,
  getFeedbackSkillTemplate,
  getFfChangeSkillTemplate,
  getNewChangeSkillTemplate,
  getOnboardSkillTemplate,
  getSpApplyCommandTemplate,
  getSpArchiveCommandTemplate,
  getSpBulkArchiveCommandTemplate,
  getSpContinueCommandTemplate,
  getSpExploreCommandTemplate,
  getSpFfCommandTemplate,
  getSpNewCommandTemplate,
  getSpOnboardCommandTemplate,
  getSpSyncCommandTemplate,
  getSpProposeCommandTemplate,
  getSpProposeSkillTemplate,
  getSpVerifyCommandTemplate,
  getSyncSpecsSkillTemplate,
  getVerifyChangeSkillTemplate,
} from '../../../src/core/templates/skill-templates.js';
import { generateSkillContent } from '../../../src/core/shared/skill-generation.js';

const EXPECTED_FUNCTION_HASHES: Record<string, string> = {
  getExploreSkillTemplate: '20c84bc0bc8300855bb7049728fb1086d1e442dea4fa61f33b106d7f3a42d235',
  getNewChangeSkillTemplate: '60f5546609a2d20970d31d9d454dc60bf6c536a4cb1fc9bcebca16e3a6b6024b',
  getContinueChangeSkillTemplate: 'a840e67b9c5cff5bbdae51bb1ee1b47de436efc7e031299bb273a3ca8d6a0d87',
  getApplyChangeSkillTemplate: '7251de2e9e883ce94e09d1d662a93df919c323353edd4258173f954639d87155',
  getFfChangeSkillTemplate: 'e5f12b96dde36e5ffa5ddc650d86fa30efbc59f3c4c2bb236d89f2d2a809bed1',
  getSyncSpecsSkillTemplate: 'd158b5176b331162fb744ea399ffb86e4fc34295f615cc66ea1fd8a43e3cd986',
  getOnboardSkillTemplate: 'b051313db779e60416e54201e2f51dd08a80152f26523ca5be30b2ee417e72bf',
  getSpExploreCommandTemplate: '9cdb21995721fee9ab1cd2fb0444f3f36ddab1431703732af658658fc3366128',
  getSpNewCommandTemplate: '5804ef98248eb0361cfd06f92a99417c9fcca4c41caa588ab8827f65b99747f1',
  getSpContinueCommandTemplate: '311d1b7118553a3348aed6ae129dbefc7bf636dc8008869225f96ede6f98a2a4',
  getSpApplyCommandTemplate: 'ba1d1afd0fe8ff385f8f633e715f8d0d21bfc69d63b80087fab977615bf17355',
  getSpFfCommandTemplate: '8bc59d622ee13749706e7b80dc692860922e8fa625a635daaa1ef876d1632586',
  getArchiveChangeSkillTemplate: 'aadb596f4c1787809290603f7bd02d0fdfec40489fde03c5f0b40048682d33d1',
  getBulkArchiveChangeSkillTemplate: '5f80cc40af4beb29180d7a0266dc6aa21d62ee1826182623d21acbb35e8d376c',
  getSpSyncCommandTemplate: 'cc1ff958f3b66201e1b044c5fc4ab74c542d22520a8ab6338cf24bc50937aeb4',
  getVerifyChangeSkillTemplate: 'a4352d9cbda37982ffff35973dc31a32ff65710bfa744fb8c4ba8a2f31beaa82',
  getSpArchiveCommandTemplate: 'a6d8bbbfd0de892f525e720bd1b32d5f8ec548ad27bfab7df4f803137180d3d0',
  getSpOnboardCommandTemplate: 'e47484f59d0960b52b3669665dbf54909a40da819dbac320f784f6d339b58136',
  getSpBulkArchiveCommandTemplate: 'f8ad96bf71f2c8e5c5c24d31d25054974e24219ee910aa1ddee25ce9f3c843c1',
  getSpVerifyCommandTemplate: '7d2dee4432c24cc984537ea0fdb5c1fba64ab563789d3ceebb1589eb8ac65d03',
  getSpProposeSkillTemplate: '29d356d03a2632631512777afe6aa752a136988aa814d79d33a6d71994a7870b',
  getSpProposeCommandTemplate: 'f47343d7fa743f2eb548ed1f81d245918a51604db4e9a950b46cc66191ff4c33',
  getFeedbackSkillTemplate: '37b0bc6e1344a1973222d91ef29f84eddfc349e64e72f047bef22c614dd0fad9',
};

const EXPECTED_GENERATED_SKILL_CONTENT_HASHES: Record<string, string> = {
  'superpowers-explore': 'dfe6acac65d333da8de5e5e17ff73910b178699cd76202860563118b6786f310',
  'superpowers-new-change': '74e6fc6809b287130812466d98103b6703932292e2500c3a8cb6e1375a471f7f',
  'superpowers-continue-change': '36eff4415269cbcbf734b6efcc742f5ac0deb268c1d4503f9937bb6e146b93c2',
  'superpowers-apply-change': '476f69879fe42c7d99e9567dcef7bf1bf3f43be08192a194c610b2567a99cb37',
  'superpowers-ff-change': '7e1f0c6de24c77e200794327617d93abeb6a12620d48e5aa133183cad69b71f2',
  'superpowers-sync-specs': '54907c51ef35a7ad02a07d2c5efb9619d1932828fa06f69a484d509addfa6ea2',
  'superpowers-archive-change': 'a50623f1936b93f63d405038cc05bdd04fbe4c0c51b0dc9bf0d64c79a8822920',
  'superpowers-bulk-archive-change': '62e0d64f3b80cf3f7c29073dcd4842c00a2c55d139eb3f7b52bdd3aa59cfecd0',
  'superpowers-verify-change': 'ecffb65daad86d0bacf90beca636d7da07d5bb59c347a26ce69ad438f71923ed',
  'superpowers-onboard': 'f54aaddb0cb4daa025b1db0ca7d21bf5af546fd33ac82b48cbc020cba269d863',
  'superpowers-propose': 'b75b0fef361931fa728e0b4de347249a76471f1766ae208d82880fccb5e5cf4f',
};

function stableStringify(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(',')}]`;
  }

  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, item]) => `${JSON.stringify(key)}:${stableStringify(item)}`);

    return `{${entries.join(',')}}`;
  }

  return JSON.stringify(value);
}

function hash(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

describe('skill templates split parity', () => {
  it('describes execution-plan in generated workflow instructions', () => {
    for (const template of [
      getSpProposeSkillTemplate(),
      getSpProposeCommandTemplate(),
      getFfChangeSkillTemplate(),
      getSpFfCommandTemplate(),
    ]) {
      const content = 'instructions' in template ? template.instructions : template.content;
      expect(content).toContain('execution-plan.md');
      expect(content).toContain('applyRequires');
      expect(content).toContain('superpowers status --change "<name>" --json');
    }

    for (const template of [getContinueChangeSkillTemplate(), getSpContinueCommandTemplate()]) {
      const content = 'instructions' in template ? template.instructions : template.content;
      expect(content).toContain('execution-plan');
      expect(content).toContain('schema artifact');
      expect(content).toContain('Read any completed dependency files for context');
    }

    for (const template of [getApplyChangeSkillTemplate(), getSpApplyCommandTemplate()]) {
      const content = 'instructions' in template ? template.instructions : template.content;
      expect(content).toContain('superpowers instructions apply --change "<name>" --json');
      expect(content).toContain('execution-plan');
      expect(content).toContain('context');
      expect(content).toContain('tasks.md');
      expect(content).toContain('progress-tracking');
      expect(content).not.toContain('Default to executing in batches of 3 tasks');
    }

    const applySkillInstructions = getApplyChangeSkillTemplate().instructions;
    expect(applySkillInstructions).toContain(
      'Do not stop after a fixed batch size unless a blocker, ambiguity, or user interruption appears.'
    );
    expect(applySkillInstructions).toContain(
      'Keep switching directly to the next pending task so the run stays continuous.'
    );
    expect(applySkillInstructions).toContain(
      'Keep the task loop continuous by default; only pause when blocked, unclear, or explicitly asked to stop'
    );

    const onboarding = getOnboardSkillTemplate().instructions;
    expect(onboarding).toContain('proposal → specs → design → tasks → execution plan');
    expect(onboarding).toContain('tasks.md');
    expect(onboarding).toContain('execution-plan.md');
    expect(onboarding).toContain('detailed implementation plan');
    expect(onboarding).toContain('`tasks.md` stays the progress checklist');
    expect(onboarding).toContain(
      '`execution-plan.md` carries the file map, TDD steps, exact commands, and test-review gate'
    );
  });

  it('preserves all template function payloads exactly', () => {
    const functionFactories: Record<string, () => unknown> = {
      getExploreSkillTemplate,
      getNewChangeSkillTemplate,
      getContinueChangeSkillTemplate,
      getApplyChangeSkillTemplate,
      getFfChangeSkillTemplate,
      getSyncSpecsSkillTemplate,
      getOnboardSkillTemplate,
      getSpExploreCommandTemplate,
      getSpNewCommandTemplate,
      getSpContinueCommandTemplate,
      getSpApplyCommandTemplate,
      getSpFfCommandTemplate,
      getArchiveChangeSkillTemplate,
      getBulkArchiveChangeSkillTemplate,
      getSpSyncCommandTemplate,
      getVerifyChangeSkillTemplate,
      getSpArchiveCommandTemplate,
      getSpOnboardCommandTemplate,
      getSpBulkArchiveCommandTemplate,
      getSpVerifyCommandTemplate,
      getSpProposeSkillTemplate,
      getSpProposeCommandTemplate,
      getFeedbackSkillTemplate,
    };

    const actualHashes = Object.fromEntries(
      Object.entries(functionFactories).map(([name, fn]) => [name, hash(stableStringify(fn()))])
    );

    expect(actualHashes).toEqual(EXPECTED_FUNCTION_HASHES);
  });

  it('preserves generated skill file content exactly', () => {
    // Intentionally excludes getFeedbackSkillTemplate: skillFactories only models templates
    // deployed via generateSkillContent, while feedback is covered in function payload parity.
    const skillFactories: Array<[string, () => SkillTemplate]> = [
      ['superpowers-explore', getExploreSkillTemplate],
      ['superpowers-new-change', getNewChangeSkillTemplate],
      ['superpowers-continue-change', getContinueChangeSkillTemplate],
      ['superpowers-apply-change', getApplyChangeSkillTemplate],
      ['superpowers-ff-change', getFfChangeSkillTemplate],
      ['superpowers-sync-specs', getSyncSpecsSkillTemplate],
      ['superpowers-archive-change', getArchiveChangeSkillTemplate],
      ['superpowers-bulk-archive-change', getBulkArchiveChangeSkillTemplate],
      ['superpowers-verify-change', getVerifyChangeSkillTemplate],
      ['superpowers-onboard', getOnboardSkillTemplate],
      ['superpowers-propose', getSpProposeSkillTemplate],
    ];

    const actualHashes = Object.fromEntries(
      skillFactories.map(([dirName, createTemplate]) => [
        dirName,
        hash(generateSkillContent(createTemplate(), 'PARITY-BASELINE')),
      ])
    );

    expect(actualHashes).toEqual(EXPECTED_GENERATED_SKILL_CONTENT_HASHES);
  });
});
