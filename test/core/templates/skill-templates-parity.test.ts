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
  getContinueChangeSkillTemplate: '2a9c08437286d47848cfe0b23ad9925a7037592fbca817cd22c8ed0eed0b4dcc',
  getApplyChangeSkillTemplate: '28c997aa2482b37456110f80059bb0ae3a48975df24f28f491060cd8c8a6141d',
  getFfChangeSkillTemplate: 'f8adab19cc05826798888927f072db525bfa7c7e4fe682a1386c4699fa03a4a4',
  getSyncSpecsSkillTemplate: 'd158b5176b331162fb744ea399ffb86e4fc34295f615cc66ea1fd8a43e3cd986',
  getOnboardSkillTemplate: 'fbd64a8d1b671edc603ae0a6296b249351d6bf6fd8b7ef9ee2b205675474f1a9',
  getSpExploreCommandTemplate: '9cdb21995721fee9ab1cd2fb0444f3f36ddab1431703732af658658fc3366128',
  getSpNewCommandTemplate: '5804ef98248eb0361cfd06f92a99417c9fcca4c41caa588ab8827f65b99747f1',
  getSpContinueCommandTemplate: '8c2b053eb371ce1d0e886f9e365e99989df536ad6a8139ae0c20547d25dc179b',
  getSpApplyCommandTemplate: '5e41d212cb0b369638df137e06e9620b6fa068f530ccb2d5359084869080bc9f',
  getSpFfCommandTemplate: 'b298c14e6bf8224e4fc30d1432c317b4a67427f0be4989005089a70e373a3abf',
  getArchiveChangeSkillTemplate: 'aadb596f4c1787809290603f7bd02d0fdfec40489fde03c5f0b40048682d33d1',
  getBulkArchiveChangeSkillTemplate: '5f80cc40af4beb29180d7a0266dc6aa21d62ee1826182623d21acbb35e8d376c',
  getSpSyncCommandTemplate: 'cc1ff958f3b66201e1b044c5fc4ab74c542d22520a8ab6338cf24bc50937aeb4',
  getVerifyChangeSkillTemplate: 'a4352d9cbda37982ffff35973dc31a32ff65710bfa744fb8c4ba8a2f31beaa82',
  getSpArchiveCommandTemplate: 'a6d8bbbfd0de892f525e720bd1b32d5f8ec548ad27bfab7df4f803137180d3d0',
  getSpOnboardCommandTemplate: 'df6581a77ce94c4e699030f76d58ed2d7ccc8bc9ae38b8fa4e5d9ad6c98e10ef',
  getSpBulkArchiveCommandTemplate: 'f8ad96bf71f2c8e5c5c24d31d25054974e24219ee910aa1ddee25ce9f3c843c1',
  getSpVerifyCommandTemplate: '7d2dee4432c24cc984537ea0fdb5c1fba64ab563789d3ceebb1589eb8ac65d03',
  getSpProposeSkillTemplate: '46f553c75929a2856f611dda2895e79510c453bd43e7cc855124356abbe0dd49',
  getSpProposeCommandTemplate: '4b85d8f7adb531244a82ddeed8ad9a5f64a61cb231e6fad03fee80163a1affc7',
  getFeedbackSkillTemplate: '37b0bc6e1344a1973222d91ef29f84eddfc349e64e72f047bef22c614dd0fad9',
};

const EXPECTED_GENERATED_SKILL_CONTENT_HASHES: Record<string, string> = {
  'superpowers-explore': 'dfe6acac65d333da8de5e5e17ff73910b178699cd76202860563118b6786f310',
  'superpowers-new-change': '74e6fc6809b287130812466d98103b6703932292e2500c3a8cb6e1375a471f7f',
  'superpowers-continue-change': '87d0a16a702ce3cf3b2e71629c1b8582881b39895ee53e4086819160a53989a7',
  'superpowers-apply-change': '8ada150571c31d4a1164feb60eb3d0567b1b3e765250b36165816d1b368e0fdd',
  'superpowers-ff-change': '5de1af276ae90282b4cdd0cc8381acb8653c14d105be92c22a4dce91d7bda833',
  'superpowers-sync-specs': '54907c51ef35a7ad02a07d2c5efb9619d1932828fa06f69a484d509addfa6ea2',
  'superpowers-archive-change': 'a50623f1936b93f63d405038cc05bdd04fbe4c0c51b0dc9bf0d64c79a8822920',
  'superpowers-bulk-archive-change': '62e0d64f3b80cf3f7c29073dcd4842c00a2c55d139eb3f7b52bdd3aa59cfecd0',
  'superpowers-verify-change': 'ecffb65daad86d0bacf90beca636d7da07d5bb59c347a26ce69ad438f71923ed',
  'superpowers-onboard': '394dcbbe5985e66cf083368a0eee1a6fb2d3ea64864de6abbee664a8a4b94e5b',
  'superpowers-propose': '78c48540e820abbad996c254f84472a5c0860116b43fda438bdb56a2f4010583',
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
