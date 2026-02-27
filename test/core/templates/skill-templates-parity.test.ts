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
  getOpsxApplyCommandTemplate,
  getOpsxArchiveCommandTemplate,
  getOpsxBulkArchiveCommandTemplate,
  getOpsxContinueCommandTemplate,
  getOpsxExploreCommandTemplate,
  getOpsxFfCommandTemplate,
  getOpsxNewCommandTemplate,
  getOpsxOnboardCommandTemplate,
  getOpsxSyncCommandTemplate,
  getOpsxProposeCommandTemplate,
  getOpsxProposeSkillTemplate,
  getOpsxVerifyCommandTemplate,
  getSyncSpecsSkillTemplate,
  getVerifyChangeSkillTemplate,
} from '../../../src/core/templates/skill-templates.js';
import { generateSkillContent } from '../../../src/core/shared/skill-generation.js';

const EXPECTED_FUNCTION_HASHES: Record<string, string> = {
  getExploreSkillTemplate: 'ae551c87c1457c967c52e5fdf2f21ddb6f54c3d6758b01593ad9dbba395967c0',
  getNewChangeSkillTemplate: '6f82fabd296e8bf0c10b030fe74f19242a1afd77ea2d58cbc25dec03b8795658',
  getContinueChangeSkillTemplate: '2a9c08437286d47848cfe0b23ad9925a7037592fbca817cd22c8ed0eed0b4dcc',
  getApplyChangeSkillTemplate: '6fe5bffb049751375493535155444e626f3b99ce39c675e529a85bad204395a8',
  getFfChangeSkillTemplate: 'f8adab19cc05826798888927f072db525bfa7c7e4fe682a1386c4699fa03a4a4',
  getSyncSpecsSkillTemplate: 'd158b5176b331162fb744ea399ffb86e4fc34295f615cc66ea1fd8a43e3cd986',
  getOnboardSkillTemplate: 'fbd64a8d1b671edc603ae0a6296b249351d6bf6fd8b7ef9ee2b205675474f1a9',
  getOpsxExploreCommandTemplate: '7e91d2f543baf8d95cff5487db72b842703627a751c97f5112120f5db470e957',
  getOpsxNewCommandTemplate: 'c04cd808a5af218d96aca4b7cfa20c18b915899e11861cf3a33a9691e7607190',
  getOpsxContinueCommandTemplate: '12eaa71c03ef83daf1b753c607781b2a744de8a5906fd1690b3b8979d967cf35',
  getOpsxApplyCommandTemplate: '748e4c7be15408f87238dfaf31e184c3677ae749cf99a11ac7550ab541a3a6fc',
  getOpsxFfCommandTemplate: 'c0d416b027b12602abe6c3fbe4bacc8b41c0fdc30c31ab906c5f8e2c83e592a2',
  getArchiveChangeSkillTemplate: '5858dd84b8cb9f5e33ce08769063c290f23306e553bd15ffdc449dc7259e458e',
  getBulkArchiveChangeSkillTemplate: '5f80cc40af4beb29180d7a0266dc6aa21d62ee1826182623d21acbb35e8d376c',
  getOpsxSyncCommandTemplate: 'ac5feeec948f06aa48afc5d72e0686d5b8a09e1e70ed69c1672b716a4a6dcaf4',
  getVerifyChangeSkillTemplate: 'a4352d9cbda37982ffff35973dc31a32ff65710bfa744fb8c4ba8a2f31beaa82',
  getOpsxArchiveCommandTemplate: '71f40e54fcf25b07e4a293e7434bed7e3aeb2e35a59e2a81ff4c539966975cfd',
  getOpsxOnboardCommandTemplate: '307cdbff8f9b12b6d7dbeea99d48b188841f4b9fdde64e200d23d7c1c3760cb2',
  getOpsxBulkArchiveCommandTemplate: '4a3a8fbd9e9b5087260fc2ca42d4213a65775c37852587a1ea9c8446bd0eb5f9',
  getOpsxVerifyCommandTemplate: '130bf05244923396315b037be0eac4c2e537ccc82cae0c12db0484d36cc61ce2',
  getOpsxProposeSkillTemplate: 'adc1a274cccfd5f5e93a762f2808f047f882c3ed82b1864c58a37cd5c39c449e',
  getOpsxProposeCommandTemplate: '1549041d75cee4ce10b1baef62c25babf05362296f932d468c85f6a879373d86',
  getFeedbackSkillTemplate: '37b0bc6e1344a1973222d91ef29f84eddfc349e64e72f047bef22c614dd0fad9',
};

const EXPECTED_GENERATED_SKILL_CONTENT_HASHES: Record<string, string> = {
  'superpowers-explore': '00e4b7b452ba3ef50f83551c4dc136948d35bc6fd739b15285cf7b306fb8c9a8',
  'superpowers-new-change': 'd9dbf94db2d654fa1bab522296083187acea9cf02d63dc707539ca977932cad5',
  'superpowers-continue-change': '87d0a16a702ce3cf3b2e71629c1b8582881b39895ee53e4086819160a53989a7',
  'superpowers-apply-change': '9553835f1ed7fe46955b73906f56f6e1f6180e594f27d777e5588317dcaad009',
  'superpowers-ff-change': '5de1af276ae90282b4cdd0cc8381acb8653c14d105be92c22a4dce91d7bda833',
  'superpowers-sync-specs': '54907c51ef35a7ad02a07d2c5efb9619d1932828fa06f69a484d509addfa6ea2',
  'superpowers-archive-change': 'e8faff6d5fca2d3b4b384090e985226876eb535fe567678436932f594ac84c77',
  'superpowers-bulk-archive-change': '62e0d64f3b80cf3f7c29073dcd4842c00a2c55d139eb3f7b52bdd3aa59cfecd0',
  'superpowers-verify-change': 'ecffb65daad86d0bacf90beca636d7da07d5bb59c347a26ce69ad438f71923ed',
  'superpowers-onboard': '394dcbbe5985e66cf083368a0eee1a6fb2d3ea64864de6abbee664a8a4b94e5b',
  'superpowers-propose': '159d6163e7b5113c4752ef21accea07db65c88424449c5ad3cd28983f9309991',
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
      getOpsxExploreCommandTemplate,
      getOpsxNewCommandTemplate,
      getOpsxContinueCommandTemplate,
      getOpsxApplyCommandTemplate,
      getOpsxFfCommandTemplate,
      getArchiveChangeSkillTemplate,
      getBulkArchiveChangeSkillTemplate,
      getOpsxSyncCommandTemplate,
      getVerifyChangeSkillTemplate,
      getOpsxArchiveCommandTemplate,
      getOpsxOnboardCommandTemplate,
      getOpsxBulkArchiveCommandTemplate,
      getOpsxVerifyCommandTemplate,
      getOpsxProposeSkillTemplate,
      getOpsxProposeCommandTemplate,
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
      ['superpowers-propose', getOpsxProposeSkillTemplate],
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
