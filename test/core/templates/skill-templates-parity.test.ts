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
  getExploreSkillTemplate: 'b726b91732703a521542b1aaec67111254e030e2e90c671ae873594d760dc4ef',
  getNewChangeSkillTemplate: '6f82fabd296e8bf0c10b030fe74f19242a1afd77ea2d58cbc25dec03b8795658',
  getContinueChangeSkillTemplate: '2a9c08437286d47848cfe0b23ad9925a7037592fbca817cd22c8ed0eed0b4dcc',
  getApplyChangeSkillTemplate: '121836c9e8decefd72dbae4844af89e6ed4aa8ec631e053faf634fe69b5e3242',
  getFfChangeSkillTemplate: 'f8adab19cc05826798888927f072db525bfa7c7e4fe682a1386c4699fa03a4a4',
  getSyncSpecsSkillTemplate: 'd158b5176b331162fb744ea399ffb86e4fc34295f615cc66ea1fd8a43e3cd986',
  getOnboardSkillTemplate: 'fbd64a8d1b671edc603ae0a6296b249351d6bf6fd8b7ef9ee2b205675474f1a9',
  getSpExploreCommandTemplate: 'fcc1a60361b9652a20904f2c7781106870fe4d5b32afd1a612acf1bcc097711a',
  getSpNewCommandTemplate: '4db8c1c960504ce288e8f00f21e2cfb4d6aaa293552ccbb6ed1cee3f7eedd062',
  getSpContinueCommandTemplate: '44717b2bda8b8be3efbc81d3be5cca6c8d3cb28bea66e6274d11ee842339f8ef',
  getSpApplyCommandTemplate: '1408638105964d1facc5ea979e1a1747b9de8ee4ed124c79e53e412605bddc67',
  getSpFfCommandTemplate: 'c6eb8bf38e11a236369e7c1a13a53a629fa61704ff7fcb7e602ce62a31d36aa3',
  getArchiveChangeSkillTemplate: '5858dd84b8cb9f5e33ce08769063c290f23306e553bd15ffdc449dc7259e458e',
  getBulkArchiveChangeSkillTemplate: '5f80cc40af4beb29180d7a0266dc6aa21d62ee1826182623d21acbb35e8d376c',
  getSpSyncCommandTemplate: '5f081ec332c8aa91c141555782a9b97935a3c0a313a56e29314d65e847fe795b',
  getVerifyChangeSkillTemplate: 'a4352d9cbda37982ffff35973dc31a32ff65710bfa744fb8c4ba8a2f31beaa82',
  getSpArchiveCommandTemplate: '30112250c71dee616e16ddb8928b52419e8970c2e767706784216d04c22159d5',
  getSpOnboardCommandTemplate: 'df6581a77ce94c4e699030f76d58ed2d7ccc8bc9ae38b8fa4e5d9ad6c98e10ef',
  getSpBulkArchiveCommandTemplate: 'f8ad96bf71f2c8e5c5c24d31d25054974e24219ee910aa1ddee25ce9f3c843c1',
  getSpVerifyCommandTemplate: '98f3a409cf2b7003badc4d482d44b30e04be9f915391681aec13f65e6c142a73',
  getSpProposeSkillTemplate: 'daabb21941ae302b3e8974d8c9b2713389c0c47d36f6388b1da7d7481d845bff',
  getSpProposeCommandTemplate: 'df9aa392d647ea5202c52529b32b0a1ff54263c33963c6a2304fadd211163c51',
  getFeedbackSkillTemplate: '37b0bc6e1344a1973222d91ef29f84eddfc349e64e72f047bef22c614dd0fad9',
};

const EXPECTED_GENERATED_SKILL_CONTENT_HASHES: Record<string, string> = {
  'superpowers-explore': '2a315019f73dee7de96a75cec6e42b49b84ffa32a8d413b7925445a128e4a438',
  'superpowers-new-change': 'd9dbf94db2d654fa1bab522296083187acea9cf02d63dc707539ca977932cad5',
  'superpowers-continue-change': '87d0a16a702ce3cf3b2e71629c1b8582881b39895ee53e4086819160a53989a7',
  'superpowers-apply-change': '6e666bb9294d123648c9b2587d9288a5316f3891772eaa030840ac1b205685b9',
  'superpowers-ff-change': '5de1af276ae90282b4cdd0cc8381acb8653c14d105be92c22a4dce91d7bda833',
  'superpowers-sync-specs': '54907c51ef35a7ad02a07d2c5efb9619d1932828fa06f69a484d509addfa6ea2',
  'superpowers-archive-change': 'e8faff6d5fca2d3b4b384090e985226876eb535fe567678436932f594ac84c77',
  'superpowers-bulk-archive-change': '62e0d64f3b80cf3f7c29073dcd4842c00a2c55d139eb3f7b52bdd3aa59cfecd0',
  'superpowers-verify-change': 'ecffb65daad86d0bacf90beca636d7da07d5bb59c347a26ce69ad438f71923ed',
  'superpowers-onboard': '394dcbbe5985e66cf083368a0eee1a6fb2d3ea64864de6abbee664a8a4b94e5b',
  'superpowers-propose': 'cbb1adc4cb0699e7d3928abd8fe9098f19a575713cfda04bcb28c4cddf0e53a5',
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
