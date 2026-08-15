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
  getExploreSkillTemplate: '1d25e7f242d47d0d19410072e929eda25f720f6e3b489c0cc767350646b9a0ad',
  getNewChangeSkillTemplate: '60f5546609a2d20970d31d9d454dc60bf6c536a4cb1fc9bcebca16e3a6b6024b',
  getContinueChangeSkillTemplate: 'd2a03cab2a3adc303a223718d574c8f74b28acdf2a11baa0dea916db2ab3d2aa',
  getApplyChangeSkillTemplate: '0c7bf516afcabec24f1bf5a3ee318c20ab076e5cbbbe85a231fc9a9a7c24ecaf',
  getFfChangeSkillTemplate: '2444090df905be139ca257cf9bbb6c6ec9156a1f76e893dc1ef07b9a87418c28',
  getSyncSpecsSkillTemplate: 'd158b5176b331162fb744ea399ffb86e4fc34295f615cc66ea1fd8a43e3cd986',
  getOnboardSkillTemplate: 'bf39ddec86960f599d857fc6ec68ab32f420bd7ee2d2f272b59a05c7d79773fa',
  getSpExploreCommandTemplate: '76f20d227059b07330fe41bbf4b91955194ec31876888a2f80dd7a2e1c13152e',
  getSpNewCommandTemplate: '5804ef98248eb0361cfd06f92a99417c9fcca4c41caa588ab8827f65b99747f1',
  getSpContinueCommandTemplate: 'a5bff71ba5ea053d61aad846d9d39053a185ba3aeb993bcadfe15b00779b158e',
  getSpApplyCommandTemplate: 'e3056c593ae816e748ac063a41f3cfdb9777e6ff1fa82cfe1ed34faf0c59bf77',
  getSpFfCommandTemplate: 'a1f27b1120565937907ed8bd7209bfd3682e23aa07cc1b4da0a501bd8cd8d158',
  getArchiveChangeSkillTemplate: 'aadb596f4c1787809290603f7bd02d0fdfec40489fde03c5f0b40048682d33d1',
  getBulkArchiveChangeSkillTemplate: '5f80cc40af4beb29180d7a0266dc6aa21d62ee1826182623d21acbb35e8d376c',
  getSpSyncCommandTemplate: 'cc1ff958f3b66201e1b044c5fc4ab74c542d22520a8ab6338cf24bc50937aeb4',
  getVerifyChangeSkillTemplate: '3a334da79db1038a57112f33a7a468300611fcd76d49d091aa92011b52ce87d3',
  getSpArchiveCommandTemplate: 'a6d8bbbfd0de892f525e720bd1b32d5f8ec548ad27bfab7df4f803137180d3d0',
  getSpOnboardCommandTemplate: '83ecbdb7c05c0b485b9a4911853e689468b421970bed45b96d19d9dc087a7745',
  getSpBulkArchiveCommandTemplate: 'f8ad96bf71f2c8e5c5c24d31d25054974e24219ee910aa1ddee25ce9f3c843c1',
  getSpVerifyCommandTemplate: 'e5fa082a101da3ca9a5007c40938af275f73680ff9ce9762514aa95441c4b97f',
  getSimplifySkillTemplate: '5d26571f977ae20e01afeec54037a6fabeb84fdb8a492a18f4acdfbcb1551ca5',
  getSpSimplifyCommandTemplate: 'ea0ca542aff154ff51bbf2d6169540dc4d8d51d1d3fd1676bd9c09e1313d592a',
  getDesignVerifySkillTemplate: '4920e25dce697b90b8031620b63085856bf09cfc275d1fec45d7873dcef7c14b',
  getSpDesignVerifyCommandTemplate: '65f9b0ea063d942aed1d148781f1022007de0d38a0cb7502e6375a5fa3ffa7cd',
  getSpProposeSkillTemplate: '1cd7d4a73a02a62d1c74cea1812a477208f230704c250ba05d0d34e2c6147087',
  getSpProposeCommandTemplate: '04eabc2936bd35eeff5709e9409aa7b1490395d9348200eeb0107ee146e5015a',
  getFeedbackSkillTemplate: '37b0bc6e1344a1973222d91ef29f84eddfc349e64e72f047bef22c614dd0fad9',
  getChangeReviewSkillTemplate: '47650e8ad1bb1beb353da5f2288224f720ca586431dd3234ca3e2f1655e34714',
  getSpReviewCommandTemplate: '60003cf9c03d1c1e589b7ed3b95ed225c20f15121ddf0a478f2e002e80fe711d',
};

const EXPECTED_GENERATED_SKILL_CONTENT_HASHES: Record<string, string> = {
  'superpowers-explore': 'bcfe8ad716d221ea206b594a787f101ec0606be7241ec61fc0470189e815a494',
  'superpowers-new-change': '74e6fc6809b287130812466d98103b6703932292e2500c3a8cb6e1375a471f7f',
  'superpowers-continue-change': '28a0c25d94b03a658e2a5b9291d8a11b469b2709ac080017604f324d46056fe7',
  'superpowers-apply-change': '2564b3194da7a01a266578f47f7c4633f80ac777bfa87747b715b0f0f5667ed5',
  'superpowers-ff-change': '0ceb62124b4b26a9fe00edcff8576d1e27bb00197794ca4228ab61534a18a299',
  'superpowers-sync-specs': '54907c51ef35a7ad02a07d2c5efb9619d1932828fa06f69a484d509addfa6ea2',
  'superpowers-archive-change': 'a50623f1936b93f63d405038cc05bdd04fbe4c0c51b0dc9bf0d64c79a8822920',
  'superpowers-bulk-archive-change': '62e0d64f3b80cf3f7c29073dcd4842c00a2c55d139eb3f7b52bdd3aa59cfecd0',
  'superpowers-verify-change': '388994fdc2713aa71752edebeb297f76ccec08f7446439573bd9b4da4c2c5d10',
  'superpowers-simplify': '85d6860d6567fe2ad1738f9f4648e074f6793c670de1aa07b2466447e293505d',
  'superpowers-design-verify': '50a6a25f20bd749bfee135b384702ae4aa7adcc0fb06345c18de0902f505bab7',
  'superpowers-onboard': '736257835836c326f0286e0da55232799a9809a29a2ed2b63d1f9beee9bf6a34',
  'superpowers-propose': '8f940c7af2d0c93c3746baa4136bc0db8f52612c676b47f1bd4fcfcbb3bb9565',
  'superpowers-change-review': '1b7ef9807c231ebdd9f1e83b35ca56015a7074ca81cdb5e33fc771c3c267e8c2',
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
  it('describes the adaptive Propose interview gate in both projections', () => {
    for (const template of [getSpProposeSkillTemplate(), getSpProposeCommandTemplate()]) {
      const content = 'instructions' in template ? template.instructions : template.content;

      expect(content).toContain('Before any change creation or artifact write');
      expect(content).toContain('A clear low-risk request may have zero interview questions');
      expect(content).toContain('product decisions about the problem and urgency');
      for (const trigger of [
        'architecture',
        'data or migration',
        'public API or CLI contracts',
        'security',
        'reliability or recovery',
        'performance',
        'compatibility',
        'deployment or operations',
        'important dependency',
      ]) {
        expect(content).toContain(trigger);
      }

      expect(content).toContain('Ask one decision question at a time and wait for the answer');
      expect(content).toContain('Known facts');
      expect(content).toContain('Decision to resolve and why it matters');
      expect(content).toContain('Recommended answer and its trade-off');
      expect(content).toContain('Two or three meaningful alternatives');
      expect(content).toContain('free-form response invitation');
      expect(content).toContain('ordinary natural-language conversation');
      expect(content).toContain('If AskUserQuestion is unavailable, ask the same open-ended question in ordinary conversation');
      expect(content).toContain('If AskUserQuestion is unavailable, ask the clarification in ordinary conversation');
      expect(content).toContain('If the user delegates a decision');
      expect(content).toContain('re-evaluate dependent decisions');

      expect(content).toContain('one complete final understanding summary');
      expect(content).toContain('confirmed decisions from agent-owned implementation assumptions');
      expect(content).toContain('Offer exactly three semantic final outcomes');
      expect(content).toContain('1. Confirm and create');
      expect(content).toContain('2. Request changes');
      expect(content).toContain('3. Stop without creating');
      expect(content).toContain('The confirm-and-create outcome is required even when there were zero interview questions');

      expect(content).toContain('route confirmed product decisions into proposal.md');
      expect(content).toContain('Route each high-impact technical decision into design.md');
      expect(content).toContain('selected choice, meaningful alternatives, rationale, and trade-offs');
      expect(content).toContain('major decisions must compare at least three options');
      expect(content).toContain('Do not create interview.md');

      const confirmationIndex = content.indexOf('1. Confirm and create —');
      const creationIndex = content.indexOf('superpowers new change "<name>"');
      const reviewIndex = content.indexOf('Dispatch a fresh change reviewer subagent');
      expect(confirmationIndex).toBeGreaterThan(-1);
      expect(creationIndex).toBeGreaterThan(confirmationIndex);
      expect(reviewIndex).toBeGreaterThan(creationIndex);
    }
  });

  it('keeps the Propose quick-reference documentation aligned with the gate', () => {
    const workflows = readFileSync(path.join(process.cwd(), 'docs', 'workflows.md'), 'utf8');

    expect(workflows).toContain(
      '| `/sp:propose` | Run the adaptive understanding gate, then create change and planning artifacts after confirmation |'
    );
  });

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
      expect(content).toContain('every other concrete Manual Coverage status row');
      expect(content).toContain('## Deferred Coverage');
      expect(content).toContain('Deferred Coverage is not execution evidence');
      expect(content).toContain('unexecuted, failed, or blocked applicable non-`agent-browser` manual row');
      expect(content).toContain('complete canonical non-visual suite');
      expect(content).toContain('code review');
      expect(content).toContain('Simplify (one pass, then Verify)');
      expect(content).toContain('Verify (rounds 1–4)');
      expect(content).toContain('Design verify (rounds 1–4)');
      expect(content).toContain('`P0` is equivalent to Verify\'s `CRITICAL` severity');
      expect(content).toContain('`P1` and `P2` are non-P0 findings');
      expect(content).toContain('`BLOCKER` is not a priority level');
      expect(content).toContain('does not consume a round');
      expect(content).toContain('code review (rounds 1–4)');
      expect(content).toContain('If round four still reports a P0');
      expect(content).toContain('do not start a fifth review');
      expect(content).toContain('Simplify (one pass, then Verify)');
      expect(content).toContain('transitions directly to Verify round one');
      expect(content).toContain('Verify (rounds 1–4)');
      expect(content).toContain('including the full canonical preflight and applicable Manual Coverage again');
      expect(content).toContain('Design verify (rounds 1–4)');
      expect(content).toContain('Retry only Design verify');
      expect(content).toContain('do not impose a global restart from code review');
      expect(content).not.toContain('restart this sequence from code review');
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
      expect(content).toContain('canonical suite, Manual Coverage disposition');
      expect(content).toContain('`programmatic-browser`');
      expect(content).toContain('`agent-browser`');
      expect(content).toContain('Critical Path may require both modes');
      expect(content).toContain('agent-browser` execution for a change that has a Critical Path MUST exercise that Critical Path');
      expect(content).toContain('Do not execute `agent-browser` rows during Test Hardening');
      expect(content).toContain('leave them `planned` with evidence noting deferral to Verify');
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
    expect(verify).toContain('`programmatic-browser`');
    expect(verify).toContain('`agent-browser`');
    expect(verify).toContain('Playwright/Cypress');
    expect(verify).toContain('Memory alone is not evidence');
    expect(verify).toContain('documented safe target, fixture, dry run');
    expect(verify).toContain('browser and other runnable end-to-end journeys as Manual Coverage methods');
    expect(verify).not.toContain('**End-to-end acceptance**');
    expect(verify).toContain('Manual Coverage | M/N rows, methods, evidence');
    expect(verify).toContain('`passed`, `failed`, `blocked`, or scope-backed `not applicable`');
    expect(verify).toContain('Critical Path may require both modes');
    expect(verify).toContain('agent-browser` execution for a change that has a Critical Path MUST exercise that Critical Path');
    expect(verify).toContain('execute every applicable Manual Coverage row, including `agent-browser`');
    expect(verify).toContain('resolve the Manual Coverage outcome before archiving');
    expect(verify).toContain('## Manual Coverage');
    expect(verify).toContain('After the canonical non-visual preflight');
    expect(verify).toContain('execute every applicable Manual Coverage row, including `agent-browser`');
    expect(verify).toContain('through its stated normal entry point');
    expect(verify).toContain('method/environment, actions, observed outcome, and inspectable evidence');
    expect(verify).toContain('unexecuted, failed, or blocked');
    expect(verify).toContain('Deferred Coverage is not execution evidence');
    expect(verify).toContain('Manual Coverage status');
    expect(verify).toContain('### Final-quality Verify retries');
    expect(verify).toContain('**Test Coverage**');
    expect(verify).toContain('full-qa-test');
    expect(verify).toContain('Verify round 1');
    expect(verify).toContain('every attempt, including a retry, uses a fresh subagent');
    expect(verify).toContain('Every round reruns this complete canonical non-visual preflight');
    expect(verify).toContain('applicable Manual Coverage');
    expect(verify).toContain('Treat `CRITICAL` as `P0`');
    expect(verify).toContain('do not consume a round');
    expect(verify).toContain('do not begin a fifth round');
    expect(verify).toContain('`Verify round: <1-4>`');
  });

  it('gives verify workers an evidence-driven adversarial hunt intent', () => {
    const huntPhrases = [
      'Adversarial hunt intent',
      'as many real issues as possible',
      'until evidence proves otherwise',
      'Continue after the first finding',
      'Do not invent findings',
    ];

    for (const template of [
      getVerifyChangeSkillTemplate(),
      getSpVerifyCommandTemplate(),
      getApplyChangeSkillTemplate(),
      getSpApplyCommandTemplate(),
    ]) {
      const content = 'instructions' in template ? template.instructions : template.content;
      for (const phrase of huntPhrases) {
        expect(content).toContain(phrase);
      }
    }

    const verify = [getVerifyChangeSkillTemplate().instructions, getSpVerifyCommandTemplate().content].join('\n');
    expect(verify).toContain('When uncertain, prefer SUGGESTION over WARNING, WARNING over CRITICAL');
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
