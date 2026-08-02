import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import {
  type SkillTemplate,
  getApplyChangeSkillTemplate,
  getArchiveChangeSkillTemplate,
  getBulkArchiveChangeSkillTemplate,
  getChangeReviewSkillTemplate,
  getContinueChangeSkillTemplate,
  getExploreSkillTemplate,
  getFeedbackSkillTemplate,
  getFfChangeSkillTemplate,
  getNewChangeSkillTemplate,
  getOnboardSkillTemplate,
  getSpApplyCommandTemplate,
  getSpArchiveCommandTemplate,
  getSpBulkArchiveCommandTemplate,
  getSpReviewCommandTemplate,
  getSpContinueCommandTemplate,
  getSpExploreCommandTemplate,
  getSpFfCommandTemplate,
  getSpNewCommandTemplate,
  getSpOnboardCommandTemplate,
  getSpSyncCommandTemplate,
  getSpProposeCommandTemplate,
  getSpProposeSkillTemplate,
  getSpVerifyCommandTemplate,
  getSpSimplifyCommandTemplate,
  getSpDesignVerifyCommandTemplate,
  getSyncSpecsSkillTemplate,
  getVerifyChangeSkillTemplate,
  getSimplifySkillTemplate,
  getDesignVerifySkillTemplate,
} from '../../../src/core/templates/skill-templates.js';
import { generateSkillContent } from '../../../src/core/shared/skill-generation.js';

const EXPECTED_FUNCTION_HASHES: Record<string, string> = {
  getExploreSkillTemplate: '4cf1f0a23da5234a5e3d2ee4bfa9b3e83ac9289bcc470b8cdb271f6a087ad023',
  getNewChangeSkillTemplate: '60f5546609a2d20970d31d9d454dc60bf6c536a4cb1fc9bcebca16e3a6b6024b',
  getContinueChangeSkillTemplate: 'a20b37ab5f70315351edbd4883fe6031a844cf8c067943379c70cadb23610f4a',
  getApplyChangeSkillTemplate: 'ad34dfede606671f98e0c1c02b44ec3abbfdcb161b650b0dc55a4af0a007dab7',
  getFfChangeSkillTemplate: '2444090df905be139ca257cf9bbb6c6ec9156a1f76e893dc1ef07b9a87418c28',
  getSyncSpecsSkillTemplate: 'd158b5176b331162fb744ea399ffb86e4fc34295f615cc66ea1fd8a43e3cd986',
  getOnboardSkillTemplate: 'cb44c89f7b66c3991134b0f4b2d04c591deccdf3c92ce255af6b0caabcdfa86f',
  getSpExploreCommandTemplate: '35ad7b98f94d71af061571dd03bb42d1bc7ceaa3d7b850ec51cb245c3cc9aafa',
  getSpNewCommandTemplate: '5804ef98248eb0361cfd06f92a99417c9fcca4c41caa588ab8827f65b99747f1',
  getSpContinueCommandTemplate: '6d77d9c35d82ffed073692445237d0e0af38bb47e5a8ac546f2dfca7b7b38e94',
  getSpApplyCommandTemplate: '804fbaefc094290ac60f25197c755414abc29d38b122dba716377e96b1325a59',
  getSpFfCommandTemplate: 'a1f27b1120565937907ed8bd7209bfd3682e23aa07cc1b4da0a501bd8cd8d158',
  getArchiveChangeSkillTemplate: 'aadb596f4c1787809290603f7bd02d0fdfec40489fde03c5f0b40048682d33d1',
  getBulkArchiveChangeSkillTemplate: '5f80cc40af4beb29180d7a0266dc6aa21d62ee1826182623d21acbb35e8d376c',
  getSpSyncCommandTemplate: 'cc1ff958f3b66201e1b044c5fc4ab74c542d22520a8ab6338cf24bc50937aeb4',
  getVerifyChangeSkillTemplate: 'e180f91b00e8ed384bc1f901a6fc9c41a8bcde85d073aff252174e4ca81d0afb',
  getSpArchiveCommandTemplate: 'a6d8bbbfd0de892f525e720bd1b32d5f8ec548ad27bfab7df4f803137180d3d0',
  getSpOnboardCommandTemplate: '0367f6a87f32d992e6bd7e2413cef097d77bc4ac791bc92c89d4df0ae7892e60',
  getSpBulkArchiveCommandTemplate: 'f8ad96bf71f2c8e5c5c24d31d25054974e24219ee910aa1ddee25ce9f3c843c1',
  getSpVerifyCommandTemplate: 'db71b3cfce288a6d990f80595ee33b622f46df5279d40ca3a116263951ba5139',
  getSimplifySkillTemplate: '26e7a93aff3744eb6df3ea4268bd0d9c92bb2b91f5d48cf62b61a2267ec3e9a5',
  getSpSimplifyCommandTemplate: '6b2cbe5bfaf2de3912de7f8a252f7481121d76ebfe29a1cd32e4edfd4faa26a9',
  getDesignVerifySkillTemplate: '4920e25dce697b90b8031620b63085856bf09cfc275d1fec45d7873dcef7c14b',
  getSpDesignVerifyCommandTemplate: '65f9b0ea063d942aed1d148781f1022007de0d38a0cb7502e6375a5fa3ffa7cd',
  getSpProposeSkillTemplate: 'f6210e7d15883d5462d43b694491c3fda6643789fc5a695d606f0c9fb2ec1332',
  getSpProposeCommandTemplate: '5d7a1211870b84c3332b8912f93ede837a43f46f58b505532579e07d08db1148',
  getFeedbackSkillTemplate: '37b0bc6e1344a1973222d91ef29f84eddfc349e64e72f047bef22c614dd0fad9',
  getChangeReviewSkillTemplate: '6457d5d4d92220c0efcd9babe1db4439b0e11b506047ebf53345f8a43e51b148',
  getSpReviewCommandTemplate: '3d4b6c475b389556d75a2f384bef97aa214606dfb28b4c2a0c615c8994d83f09',
};

const EXPECTED_GENERATED_SKILL_CONTENT_HASHES: Record<string, string> = {
  'superpowers-explore': 'a2b1df6784a1712104e6bf6fca58c571488cc156ce10beb135e03c8bcb7699c3',
  'superpowers-new-change': '74e6fc6809b287130812466d98103b6703932292e2500c3a8cb6e1375a471f7f',
  'superpowers-continue-change': '2c2576679add3482c5f871493d490351baa300f3eee571f8706f3911dac7c7ef',
  'superpowers-apply-change': 'ba0bee0e283d49608c577876fbe83111d3df354121787c761d98d36f98a73b9a',
  'superpowers-ff-change': '0ceb62124b4b26a9fe00edcff8576d1e27bb00197794ca4228ab61534a18a299',
  'superpowers-sync-specs': '54907c51ef35a7ad02a07d2c5efb9619d1932828fa06f69a484d509addfa6ea2',
  'superpowers-archive-change': 'a50623f1936b93f63d405038cc05bdd04fbe4c0c51b0dc9bf0d64c79a8822920',
  'superpowers-bulk-archive-change': '62e0d64f3b80cf3f7c29073dcd4842c00a2c55d139eb3f7b52bdd3aa59cfecd0',
  'superpowers-verify-change': 'c3e97e9bb3ffc76cdcc749d9e9ae6e008c3465faa16cd01cef620c1f6dc87d87',
  'superpowers-simplify': 'ded11077d5f03a74fd393307599a3339e221677a54b04bfbbcd7195ae41b0c8b',
  'superpowers-design-verify': '50a6a25f20bd749bfee135b384702ae4aa7adcc0fb06345c18de0902f505bab7',
  'superpowers-onboard': '1e40083eae207872b397d141c4f2660e9d8ec3a705f46ab6a0e2b3a0facab580',
  'superpowers-propose': '11d6ebe0ddf106ba04adeaf75210652842fb374d273044feb33373a4456088fe',
  'superpowers-change-review': '6e5be70bde3038d216934e8ca071ad597e173837bb9a1aa0b15252aed84e65d0',
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
    expect(onboarding).toContain('dispatch-unit coordination and final validation plan');
    expect(onboarding).toContain('`tasks.md` stays the progress checklist');
    expect(onboarding).toContain(
      '`execution-plan.md` carries file ownership, dependencies, safe parallelism, integration order, Step 1–5 execution guidance for every detailed task, and final review guidance'
    );
    expect(onboarding).toContain('pre-implementation coverage draft and post-implementation Test Hardening record');
  });

  it('describes Test Hardening in generated apply workflow instructions', () => {
    for (const template of [getApplyChangeSkillTemplate(), getSpApplyCommandTemplate()]) {
      const content = 'instructions' in template ? template.instructions : template.content;
      expect(content).toContain('test-plan.md');
      expect(content).toContain('Task completion transitions into Test Hardening');
      expect(content).toContain('worker-level verification in detailed `tasks.md`');
      expect(content).toContain('post-integration Test Hardening in `test-plan.md`');
      expect(content).toContain('passing worker-level tests is necessary but not sufficient');
      expect(content).toContain('every concrete testing/hardening status row outside `## Final Quality Gates`');
      expect(content).toContain('Final-gate rows are evaluated separately only after Test Hardening');
      expect(content).toContain('planned');
      expect(content).toContain('failing');
      expect(content).toContain('placeholder rows keep hardening incomplete');
      expect(content).toContain('earlier tests were insufficient');
      expect(content).toContain('Tests added/strengthened');
      expect(content).toContain('pause on ambiguous unrelated changes');
      expect(content).toContain('Failing hardening tests or unresolved product defects block apply completion');
      expect(content).toContain('Test Hardening Summary');
      expect(content).toContain('Test Hardening status separately from implementation progress');
      expect(content).toContain('## Manual Coverage');
      expect(content).toContain('every concrete Manual Coverage status row');
      expect(content).toContain('## Deferred Coverage');
      expect(content).toContain('Deferred Coverage is not execution evidence');
      expect(content).toContain('unexecuted, failed, or blocked applicable manual row');
      expect(content).toContain('complete canonical non-visual suite');
      expect(content).toContain('Host-native code review');
      expect(content).toContain('Simplify (one pass, then Verify)');
      expect(content).toContain('Verify (rounds 1–4)');
      expect(content).toContain('Design verify (rounds 1–4)');
      expect(content).toContain('`P0` is equivalent to Verify\'s `CRITICAL` severity');
      expect(content).toContain('`P1` and `P2` are non-P0 findings');
      expect(content).toContain('`BLOCKER` is not a priority level');
      expect(content).toContain('does not consume a round');
      expect(content).toContain('Host-native code review (rounds 1–4)');
      expect(content).toContain('If round four still reports a P0');
      expect(content).toContain('do not start a fifth review');
      expect(content).toContain('Simplify (one pass, then Verify)');
      expect(content).toContain('transitions directly to Verify round one');
      expect(content).toContain('Verify (rounds 1–4)');
      expect(content).toContain('including the full canonical preflight and applicable E2E again');
      expect(content).toContain('Design verify (rounds 1–4)');
      expect(content).toContain('Retry only Design verify');
      expect(content).toContain('do not impose a global restart from code review');
      expect(content).not.toContain('restart this sequence from host-native code review');
      expect(content).toContain('never generate a Superpowers `code-review` workflow');
      expect(content).toContain('fresh, distinct subagent');
      expect(content).toContain('Do not reuse a gate worker');
      expect(content).toContain('before the current worker has completed and its result is integrated');
      expect(content).toContain('If the host cannot launch a subagent');
      expect(content).toContain('do not silently substitute a same-context review');
      expect(content).toContain('record each numbered report');
      expect(content).toContain('state: "all_done"');
      expect(content).toContain('fresh integrated outcomes for every gate');
      expect(content).toContain('run or resume final quality gates instead of suggesting archive');
      expect(content).toContain('### Final Quality Gates');
      expect(content).toContain('| Gate | Outcome | Fresh worker evidence |');
      expect(content).toContain('canonical suite, E2E disposition');
    }
  });

  it('provides explicit standalone quality workflow contracts', () => {
    const simplify = [getSimplifySkillTemplate().instructions, getSpSimplifyCommandTemplate().content].join('\n');
    expect(simplify).toContain('/sp:simplify');
    expect(simplify).toContain('Phase -1 — Resolve Superpowers change scope');
    expect(simplify).toContain('superpowers status --change "<change-name>" --json');
    expect(simplify).toContain('superpowers instructions apply --change "<change-name>" --json');
    expect(simplify).toContain('Do not absorb unrelated working-tree changes');
    expect(simplify).toContain('require an explicit PR, branch, or file/diff');
    expect(simplify).toContain('Phase 0 — Gather the diff');
    expect(simplify).toContain('Phase 1 — Review (4 cleanup agents in parallel)');
    expect(simplify).toContain('### Reuse');
    expect(simplify).toContain('### Simplification');
    expect(simplify).toContain('### Efficiency');
    expect(simplify).toContain('### Altitude');
    expect(simplify).toContain('single-pass review, not the four-agent fan-out');
    expect(simplify).toContain('brief summary of what was fixed and what was');
    expect(simplify).toContain('## Output format');
    expect(simplify).toContain('## Simplify Result');
    expect(simplify).toContain('Outcome: passed | failed | blocked | not applicable');
    expect(simplify).toContain('Review mode: four-agent fan-out | single-pass fallback');
    expect(simplify).toContain('## Apply final-quality handoff');
    expect(simplify).toContain('it has no\nindependent retry loop');
    expect(simplify).toContain('hands off directly to **Verify round\none**');
    expect(simplify).toContain('Apply handoff: <Verify round 1');

    const designVerify = [getDesignVerifySkillTemplate().instructions, getSpDesignVerifyCommandTemplate().content].join('\n');
    expect(designVerify).toContain('/sp:design-verify');
    expect(designVerify).toContain('DESIGN.md');
    expect(designVerify).toContain('not applicable');
    expect(designVerify).toContain('blocked');
    expect(designVerify).toContain('If UI scope has no repository visual design source, report `blocked`');
    expect(designVerify).toContain('requires a discovered visual source');
    expect(designVerify).toContain('## Execution');
    expect(designVerify).toContain('## Output format');
    expect(designVerify).toContain('| Route / state | Rule | Evidence | Implementation location | Outcome / remediation |');
    expect(designVerify).toContain('## Apply final-quality retries');
    expect(designVerify).toContain('Design verify round 1');
    expect(designVerify).toContain('each attempt uses\na fresh subagent');
    expect(designVerify).toContain('retry **only** Design\nverify');
    expect(designVerify).toContain('If round four still reports a visual nonconformance');
    expect(designVerify).toContain('**Design verify round:** <1-4 when delegated by apply, otherwise standalone>');

    const verify = [getVerifyChangeSkillTemplate().instructions, getSpVerifyCommandTemplate().content].join('\n');
    expect(verify).toContain('complete canonical non-visual suite');
    expect(verify).toContain('failed-network signals');
    expect(verify).toContain('unaided human checks never substitute');
    expect(verify).toContain('API call or curl request is not a substitute');
    expect(verify).toContain('Playwright/browser automation');
    expect(verify).toContain('Memory alone is not evidence');
    expect(verify).toContain('rapid repeated interaction');
    expect(verify).toContain('documented safe target, fixture, dry run');
    expect(verify).toContain('CI rerun, not E2E verification');
    expect(verify).toContain('E2E evidence | Outcome, driver, states, artifacts');
    expect(verify).toContain('`passed`, `failed`, `blocked`, or `not applicable`');
    expect(verify).toContain('relevant console/network failure is `failed`');
    expect(verify).toContain('makes both Correctness and the overall Verify outcome');
    expect(verify).toContain('resolve the E2E outcome before archiving');
    expect(verify).toContain('## Manual Coverage');
    expect(verify).toContain('After the canonical non-visual preflight');
    expect(verify).toContain('execute every applicable Manual Coverage row');
    expect(verify).toContain('through its normal entry point');
    expect(verify).toContain('method/environment, actions, observed outcome, and inspectable evidence');
    expect(verify).toContain('unexecuted, failed, or blocked');
    expect(verify).toContain('Deferred Coverage is not execution evidence');
    expect(verify).toContain('Manual Coverage status');
    expect(verify).toContain('**Final-quality Verify retries**');
    expect(verify).toContain('Verify round 1');
    expect(verify).toContain('every attempt, including a retry, uses a fresh subagent');
    expect(verify).toContain('Every round reruns this complete canonical non-visual preflight');
    expect(verify).toContain('Treat `CRITICAL` as `P0`');
    expect(verify).toContain('do not consume a round');
    expect(verify).toContain('do not begin a fifth round');
    expect(verify).toContain('`Verify round: <1-4>`');
  });

  it('defines report-first gate workers and coordinator-owned repairs', () => {
    const apply = [getApplyChangeSkillTemplate().instructions, getSpApplyCommandTemplate().content].join('\n');
    expect(apply).toContain('Code review, Verify, and Design Verify workers are read-only by default');
    expect(apply).toContain('The coordinator evaluates and repairs accepted findings');
    expect(apply).toContain('Simplify is the only gate authorized to edit by default');
    expect(apply).toContain('worker reports first; the coordinator repairs');
    expect(apply).toContain('coordinator repairs every accepted resolvable P1/P2 finding');
    expect(apply).toContain('coordinator repairs the issue and starts the next fresh Verify round');
    expect(apply).toContain('coordinator repairs it and starts the next fresh, numbered design-verification round');

    const simplify = [getSimplifySkillTemplate().instructions, getSpSimplifyCommandTemplate().content].join('\n');
    expect(simplify).toContain('Simplify is authorized to edit the reviewed scope directly');
    expect(simplify).toContain('only for behavior-preserving cleanup');
    expect(simplify).toContain('Do not repair product correctness, requirements, architecture, or visual-design findings');
    expect(simplify).toContain('revert or skip it and report the reason');

    const verify = [getVerifyChangeSkillTemplate().instructions, getSpVerifyCommandTemplate().content].join('\n');
    expect(verify).toContain('The Verify worker is read-only by default');
    expect(verify).toContain('Report findings and evidence before any implementation changes');
    expect(verify).toContain('The coordinator evaluates and repairs accepted product, architecture, or workflow findings');
    expect(verify).toContain('investigate or clarify before editing');
    expect(verify).toContain('coordinator repairs an accepted failure or CRITICAL finding');

    const designVerify = [getDesignVerifySkillTemplate().instructions, getSpDesignVerifyCommandTemplate().content].join('\n');
    expect(designVerify).toContain('The Design Verify worker is read-only by default');
    expect(designVerify).toContain('Report rule-cited findings before any implementation changes');
    expect(designVerify).toContain('The coordinator evaluates and repairs accepted UI findings');
    expect(designVerify).toContain('coordinator repairs an accepted visual nonconformance');

    const receiving = readFileSync(
      path.join(process.cwd(), 'skills', 'receiving-code-review', 'SKILL.md'),
      'utf8'
    );
    expect(receiving).toContain('feedback-evaluation protocol');
    expect(receiving).toContain('not a code-review worker or an additional final-quality gate');

    const completion = readFileSync(
      path.join(process.cwd(), 'skills', 'verification-before-completion', 'SKILL.md'),
      'utf8'
    );
    expect(completion).toContain('evidence-before-claims guardrail');
    expect(completion).toContain('not a substitute for substantive Verify, code review, or any Apply final-quality gate');
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
      getSimplifySkillTemplate,
      getDesignVerifySkillTemplate,
      getSpArchiveCommandTemplate,
      getSpOnboardCommandTemplate,
      getSpBulkArchiveCommandTemplate,
      getSpVerifyCommandTemplate,
      getSpSimplifyCommandTemplate,
      getSpDesignVerifyCommandTemplate,
      getSpProposeSkillTemplate,
      getSpProposeCommandTemplate,
      getFeedbackSkillTemplate,
      getChangeReviewSkillTemplate,
      getSpReviewCommandTemplate,
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
      ['superpowers-simplify', getSimplifySkillTemplate],
      ['superpowers-design-verify', getDesignVerifySkillTemplate],
      ['superpowers-onboard', getOnboardSkillTemplate],
      ['superpowers-propose', getSpProposeSkillTemplate],
      ['superpowers-change-review', getChangeReviewSkillTemplate],
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
