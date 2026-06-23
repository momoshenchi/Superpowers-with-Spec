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
  getContinueChangeSkillTemplate: 'a20b37ab5f70315351edbd4883fe6031a844cf8c067943379c70cadb23610f4a',
  getApplyChangeSkillTemplate: '9afbede6a74ec72900a099b6a4d327f52cf93d91397b18691badf43b6209b7ff',
  getFfChangeSkillTemplate: '2444090df905be139ca257cf9bbb6c6ec9156a1f76e893dc1ef07b9a87418c28',
  getSyncSpecsSkillTemplate: 'd158b5176b331162fb744ea399ffb86e4fc34295f615cc66ea1fd8a43e3cd986',
  getOnboardSkillTemplate: 'f0aa8eee7225f7e34f5e3b1aa90117c6786516eeff930a85309ee5cafd8560dc',
  getSpExploreCommandTemplate: '9cdb21995721fee9ab1cd2fb0444f3f36ddab1431703732af658658fc3366128',
  getSpNewCommandTemplate: '5804ef98248eb0361cfd06f92a99417c9fcca4c41caa588ab8827f65b99747f1',
  getSpContinueCommandTemplate: '6d77d9c35d82ffed073692445237d0e0af38bb47e5a8ac546f2dfca7b7b38e94',
  getSpApplyCommandTemplate: 'db04a746deb7200e7656a03f83f746d41c2fd04279bc5df994ee5ffc9b5c9c1b',
  getSpFfCommandTemplate: 'a1f27b1120565937907ed8bd7209bfd3682e23aa07cc1b4da0a501bd8cd8d158',
  getArchiveChangeSkillTemplate: 'aadb596f4c1787809290603f7bd02d0fdfec40489fde03c5f0b40048682d33d1',
  getBulkArchiveChangeSkillTemplate: '5f80cc40af4beb29180d7a0266dc6aa21d62ee1826182623d21acbb35e8d376c',
  getSpSyncCommandTemplate: 'cc1ff958f3b66201e1b044c5fc4ab74c542d22520a8ab6338cf24bc50937aeb4',
  getVerifyChangeSkillTemplate: '0dbc8f52e8e667c2fa66e27aa1ed6e4c187ab219e46e9164f0c2dd1a3314f975',
  getSpArchiveCommandTemplate: 'a6d8bbbfd0de892f525e720bd1b32d5f8ec548ad27bfab7df4f803137180d3d0',
  getSpOnboardCommandTemplate: '41b9af9a944ce2d5d25eb2fcfb864f46d9ee52e3fad12a7d4ab86cd86ee7e882',
  getSpBulkArchiveCommandTemplate: 'f8ad96bf71f2c8e5c5c24d31d25054974e24219ee910aa1ddee25ce9f3c843c1',
  getSpVerifyCommandTemplate: '4f4927f529632c5c5a95325b7651d8600801059548b70a8a8b9fdb8e235ca881',
  getSpProposeSkillTemplate: 'a82537aee82e17a3514b5a74ad4c447ae12646ecf0ef7ba699fa72549d43c8a3',
  getSpProposeCommandTemplate: '1138fcd1e6b7a386a82c66b626d20c2411259dc5de72dae61d1cc4c24803a7dd',
  getFeedbackSkillTemplate: '37b0bc6e1344a1973222d91ef29f84eddfc349e64e72f047bef22c614dd0fad9',
};

const EXPECTED_GENERATED_SKILL_CONTENT_HASHES: Record<string, string> = {
  'superpowers-explore': 'dfe6acac65d333da8de5e5e17ff73910b178699cd76202860563118b6786f310',
  'superpowers-new-change': '74e6fc6809b287130812466d98103b6703932292e2500c3a8cb6e1375a471f7f',
  'superpowers-continue-change': '2c2576679add3482c5f871493d490351baa300f3eee571f8706f3911dac7c7ef',
  'superpowers-apply-change': '93c50270daa0b71cbedf9daf6fb9917dd381b5e74d98189349071de987e36541',
  'superpowers-ff-change': '0ceb62124b4b26a9fe00edcff8576d1e27bb00197794ca4228ab61534a18a299',
  'superpowers-sync-specs': '54907c51ef35a7ad02a07d2c5efb9619d1932828fa06f69a484d509addfa6ea2',
  'superpowers-archive-change': 'a50623f1936b93f63d405038cc05bdd04fbe4c0c51b0dc9bf0d64c79a8822920',
  'superpowers-bulk-archive-change': '62e0d64f3b80cf3f7c29073dcd4842c00a2c55d139eb3f7b52bdd3aa59cfecd0',
  'superpowers-verify-change': 'db513c5d856f560871a25c63cc79c3f6251128f918a60047570197cd356215c7',
  'superpowers-onboard': '93cc1986b547b89fe74ac5de40029c1919082ef89e8d09e6dabeadfcb0a082d9',
  'superpowers-propose': '3999ed9c5f36d3554323e4767fb0c7faf86accd90feb312468ae18bf96c65ac5',
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
      expect(content).toContain('attachments/');
      expect(content).toContain('normative');
      expect(content).toContain('illustrative');
    }

    for (const template of [getApplyChangeSkillTemplate(), getSpApplyCommandTemplate()]) {
      const content = 'instructions' in template ? template.instructions : template.content;
      expect(content).toContain('superpowers instructions apply --change "<name>" --json');
      expect(content).toContain('execution-plan');
      expect(content).toContain('context');
      expect(content).toContain('attachmentFiles');
      expect(content).toContain('source of normative meaning');
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
    expect(onboarding).toContain('test-plan.md');
    expect(onboarding).toContain('detailed implementation plan');
    expect(onboarding).toContain('`tasks.md` stays the progress checklist');
    expect(onboarding).toContain(
      '`execution-plan.md` carries the file map, TDD steps, exact commands, and test-review gate'
    );
    expect(onboarding).toContain('pre-implementation coverage draft and post-implementation Test Hardening record');
  });

  it('describes Test Hardening in generated apply workflow instructions', () => {
    for (const template of [getApplyChangeSkillTemplate(), getSpApplyCommandTemplate()]) {
      const content = 'instructions' in template ? template.instructions : template.content;
      expect(content).toContain('test-plan.md');
      expect(content).toContain('Task completion transitions into Test Hardening');
      expect(content).toContain('pre-implementation red tests in `execution-plan.md`');
      expect(content).toContain('post-implementation Test Hardening in `test-plan.md`');
      expect(content).toContain('passing red tests is necessary but not sufficient');
      expect(content).toContain('every concrete test/status row');
      expect(content).toContain('planned');
      expect(content).toContain('failing');
      expect(content).toContain('placeholder rows keep hardening incomplete');
      expect(content).toContain('earlier tests were insufficient');
      expect(content).toContain('Tests added/strengthened');
      expect(content).toContain('pause on ambiguous unrelated changes');
      expect(content).toContain('Failing hardening tests or unresolved product defects block apply completion');
      expect(content).toContain('Test Hardening Summary');
      expect(content).toContain('Test Hardening status separately from implementation progress');
    }
  });

  it('describes test-plan in default spec-driven artifact flows', () => {
    for (const template of [
      getSpProposeSkillTemplate(),
      getSpProposeCommandTemplate(),
      getContinueChangeSkillTemplate(),
      getSpContinueCommandTemplate(),
      getFfChangeSkillTemplate(),
      getSpFfCommandTemplate(),
      getOnboardSkillTemplate(),
      getSpOnboardCommandTemplate(),
    ]) {
      const content = 'instructions' in template ? template.instructions : template.content;
      expect(content).toContain('test-plan.md');
      expect(content).toContain('pre-implementation coverage draft');
      expect(content).toContain('post-implementation Test Hardening');
    }
  });

  it('describes attachment preservation and handoff in generated workflow instructions', () => {
    for (const template of [getSpProposeSkillTemplate(), getSpProposeCommandTemplate()]) {
      const content = ('instructions' in template ? template.instructions : template.content).toLowerCase();
      expect(content).toContain('attachments/');
      expect(content).toContain('preserve useful references');
      expect(content).toContain('normative');
      expect(content).toContain('illustrative');
    }

    for (const template of [getContinueChangeSkillTemplate(), getSpContinueCommandTemplate()]) {
      const content = ('instructions' in template ? template.instructions : template.content).toLowerCase();
      expect(content).toContain('attachments/');
      expect(content).toContain('preserve useful references');
      expect(content).toContain('normative');
      expect(content).toContain('illustrative');
    }

    for (const template of [
      getApplyChangeSkillTemplate(),
      getSpApplyCommandTemplate(),
      getVerifyChangeSkillTemplate(),
      getSpVerifyCommandTemplate(),
    ]) {
      const content = 'instructions' in template ? template.instructions : template.content;
      expect(content).toContain('attachmentFiles');
      expect(content).toContain('source of normative meaning');
    }
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
