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
  getShapeReviewSkillTemplate,
  getSpShapeReviewCommandTemplate,
  SHAPE_REVIEW_APPLY_HANDOFF,
  SHAPE_REVIEW_CONTRACT,
} from '../../../src/core/templates/skill-templates.js';
import { generateSkillContent, getSkillTemplates } from '../../../src/core/shared/skill-generation.js';
import {
  getCanonicalNonVisualSuiteInstructions,
  getFinalQualityGateInstructions,
} from '../../../src/core/templates/workflows/final-quality-gates.js';

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

      expect(content).toContain('present them together in one message');
      expect(content).not.toContain('Ask one decision question at a time and wait for the answer');
      expect(content).not.toMatch(/Use the \*\*TodoWrite tool\*\* to track progress/);
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
      expect(content).toContain('three semantic outcomes as optional UX');
      expect(content).toContain('1. Confirm and create');
      expect(content).toContain('2. Request changes');
      expect(content).toContain('3. Stop without creating');
      expect(content).toContain('An explicit create request');
      expect(content).not.toContain('The confirm-and-create outcome is required even when there were zero interview questions');

      expect(content).toContain('route confirmed product decisions into proposal.md');
      expect(content).toContain('Route each high-impact technical decision into design.md');
      expect(content).toContain('user actually chose');
      expect(content).toContain('MAY include an A/B/C');
      expect(content).toContain('strict, detailed analysis');
      expect(content).toContain('agent-owned');
      expect(content).toContain('implementable detail');
      expect(content).toContain('Authors MAY add extra subsections');
      expect(content).toContain('Do not add required extra headings');
      expect(content).not.toContain('major decisions must compare at least three options');
      expect(content).not.toContain('Do not invent A/B/C');
      expect(content).toContain('Do not create interview.md');
      expect(content).toContain('agent-owned derived assumptions');
      expect(content).toContain('## Decisions');
      expect(content).toContain('## Contracts');
      expect(content).toContain('## Invariants');
      expect(content).not.toContain('### Derived implications');
      expect(content).toContain('Actor, permission, and ownership');
      expect(content).toContain('non-boundary derived implications');
      expect(content).toContain('observable user behavior');
      expect(content).toContain('delta spec');
      expect(content).toContain('Implementation-only mappings may stay in design.md');

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
      '| `/sp:propose` | Run the adaptive understanding gate, then create change and planning artifacts after an explicit create request |'
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
      expect(content).toContain(
        'Run mutation testing only after every planned `unit` case is executable and green'
      );
      expect(content).toContain('## Mutation Testing');
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
      expect(content).toContain('Write statuses as `planned`, `passed`, `failed`, `blocked`, or `not applicable`');
      expect(content).toContain('TC-R<object>-D<dimension>-<seq>');
      expect(content).toContain('MC-R<object>-<seq>');
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
      expect(content).toContain('git-aware-unavailable-recorded');
      expect(content).not.toMatch(/fail-closed and run the complete canonical non-visual suite/);
      expect(content).toContain('full-qa-test');
      expect(content).toContain('code review');
      expect(content).toContain('Simplify (one pass)');
      expect(content).toContain('Verify (rounds 1–4)');
      expect(content).toContain('Design verify (rounds 1–4)');
      expect(content).toContain('The only scale for grading a finding');
      expect(content).toContain('`P1` and `P2` are non-P0 findings');
      expect(content).toContain('A gate outcome is never a priority level, and `blocked` never substitutes for `P0`');
      expect(content).toContain('does not consume a round');
      expect(content).toContain('code review (rounds 1–4)');
      expect(content).toContain('If round four still reports a P0');
      expect(content).toContain('do not start a fifth review');
      expect(content).toContain('pre-Verify wave');
      expect(content).toContain('retry only the unresolved');
      expect(content).toContain('cite that Hardening suite-stage evidence');
      expect(content).toContain('Design verify (rounds 1–4)');
      expect(content).toContain('Retry Design verify inside the pre-Verify wave');
      expect(content).toContain('do not impose a global restart from code review');
      expect(content).not.toContain('restart this sequence from code review');
      expect(content).toContain('never generate a Superpowers `code-review` workflow');
      expect(content).toContain('fresh, distinct subagent');
      expect(content).not.toContain('Do not reuse a gate worker');
      expect(content).not.toContain('run these gates in exactly this order');
      expect(content).toContain('If the host cannot launch a subagent');
      expect(content).toContain('same-context fallback');
      expect(content).not.toContain('do not silently substitute a same-context review');
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
    expect(verify).toContain('git-aware-unavailable-recorded');
    expect(verify).not.toMatch(/otherwise the complete suite/);
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
    expect(verify).toContain('Standalone `/sp:verify` always runs this canonical non-visual preflight');
    expect(verify).toContain('does not require a Hardening record');
    expect(verify).toContain('cite unchanged Hardening evidence');
    expect(verify).toContain('applicable Manual Coverage');
    expect(verify).toContain('or `P0` finding, retry from Verify with a fresh worker');
    expect(verify).toContain('do not consume a round');
    expect(verify).toContain('do not begin a fifth round');
    expect(verify).toContain('`Verify round: <1-4>`');
  });

  it('provides an explicit shape-review contract', () => {
    const shapeReview = [getShapeReviewSkillTemplate().instructions, getSpShapeReviewCommandTemplate().content].join('\n');
    expect(shapeReview).toContain('/sp:shape-review');
    expect(shapeReview).toContain('Phase -0 — Resolve Superpowers change scope');
    expect(shapeReview).toContain('superpowers status --change "<change-name>" --json');
    expect(shapeReview).toContain('superpowers instructions apply --change "<change-name>" --json');
    expect(shapeReview).toContain('Do not absorb unrelated working-tree changes');
    expect(shapeReview).toContain('require an explicit PR, branch, or file/diff');
    expect(shapeReview).toContain('### Gather the diff');
    expect(shapeReview).toContain('Phase 1 — Review (4 shape agents in parallel)');
    expect(shapeReview).toContain('### Surface');
    expect(shapeReview).toContain('### Boundaries');
    expect(shapeReview).toContain('### Model');
    expect(shapeReview).toContain('### Composition');
    expect(shapeReview).toContain('single-pass review, not the four-agent fan-out');
    expect(shapeReview).toContain('public API, CLI, events, flags');
    expect(shapeReview).toContain('module cohesion');
    expect(shapeReview).toContain('representable invalid states');
    expect(shapeReview).toContain('where rules live');
    expect(shapeReview).toContain('read-only by default');
    expect(shapeReview).toContain('simplify');
    expect(shapeReview).toContain('structural');
    expect(shapeReview).toContain('skip');
    expect(shapeReview).toContain('expand-current-change');
    expect(shapeReview).toContain('new-proposal');
    expect(shapeReview).toContain('slash-after-apply remaining same-session');
    expect(shapeReview).toContain('same-session wins');
    expect(shapeReview).toContain('summarizing pass');
    expect(shapeReview).toContain('fail-closed');
    expect(shapeReview).toContain('## Shape Review Result');
    expect(shapeReview).toContain('Outcome: passed | failed | blocked');
    expect(shapeReview).toContain('file:line or symbol');
    expect(shapeReview).toContain('P0');
    expect(shapeReview).toContain('P1');
    expect(shapeReview).toContain('P2');
    expect(shapeReview).toContain(
      'Angles: Surface=<P0|P1|P2|passed|n/a+evidence> | Boundaries=<...> | Model=<...> | Composition=<...>'
    );
    expect(shapeReview).toContain('| Sev | Angle | Location | Problem | Suggestion |');
    expect(shapeReview).toContain('one-line shape change');
    expect(shapeReview).toContain('why the current shape is wrong');
    expect(shapeReview).not.toContain('| Sev | Angle | Location | Suggestion | Destination |');
    expect(shapeReview).not.toContain(
      'Suggestions: <angle, P0|P1|P2, file:line or symbol, summary, cost, classification, destination>'
    );
    expect(shapeReview).not.toContain('the concrete `cost`');
    expect(shapeReview).toContain('highest-severity');
    expect(shapeReview).not.toContain(
      'Angles: Surface=<passed|n/a+evidence> | Boundaries=<...> | Model=<...> | Composition=<...>'
    );
    expect(shapeReview).toContain('does not fail Outcome');
    expect(shapeReview).toContain('does not block archive');
    expect(shapeReview).not.toContain('apply each remaining behavior-preserving cleanup directly');
    expect(shapeReview).toContain('/sp:shape-review');
    expect(shapeReview).toContain('/sp:review');

    expect(SHAPE_REVIEW_CONTRACT).toContain('### Surface');
    expect(SHAPE_REVIEW_CONTRACT).toContain('public API, CLI, events, flags');
    expect(SHAPE_REVIEW_APPLY_HANDOFF).toContain('/sp:shape-review');
    expect(SHAPE_REVIEW_APPLY_HANDOFF).toContain('Surface');
    expect(SHAPE_REVIEW_APPLY_HANDOFF).toContain('Boundaries');
    expect(SHAPE_REVIEW_APPLY_HANDOFF).toContain('Model');
    expect(SHAPE_REVIEW_APPLY_HANDOFF).toContain('Composition');
    expect(SHAPE_REVIEW_APPLY_HANDOFF).toContain('Always run all four');
    expect(SHAPE_REVIEW_APPLY_HANDOFF).toContain('not applicable');
    expect(SHAPE_REVIEW_APPLY_HANDOFF).toContain('read-only');
    expect(SHAPE_REVIEW_APPLY_HANDOFF).toContain('## Shape Review Result');
    expect(SHAPE_REVIEW_APPLY_HANDOFF).toContain(
      'Angles: Surface=<P0|P1|P2|passed|n/a+evidence> | Boundaries=<...> | Model=<...> | Composition=<...>'
    );
    expect(SHAPE_REVIEW_APPLY_HANDOFF).toContain('| Sev | Angle | Location | Problem | Suggestion |');
    expect(SHAPE_REVIEW_APPLY_HANDOFF).not.toContain('| Sev | Angle | Location | Suggestion | Destination |');
    expect(SHAPE_REVIEW_APPLY_HANDOFF).not.toContain(
      'Suggestions: <angle, P0|P1|P2, file:line or symbol, summary, cost, classification, destination>'
    );
    expect(SHAPE_REVIEW_APPLY_HANDOFF).toContain('same-session wins');
    expect(SHAPE_REVIEW_APPLY_HANDOFF).toContain('say you want a shape review in this conversation');
    expect(SHAPE_REVIEW_APPLY_HANDOFF).toContain('does not block archive');
    expect(SHAPE_REVIEW_APPLY_HANDOFF).toContain('summarizing pass');
    expect(SHAPE_REVIEW_APPLY_HANDOFF).not.toContain('public API, CLI, events, flags');
    expect(SHAPE_REVIEW_APPLY_HANDOFF).not.toContain('module cohesion');
    expect(SHAPE_REVIEW_APPLY_HANDOFF).not.toContain('representable invalid states');
    expect(SHAPE_REVIEW_APPLY_HANDOFF).not.toContain('where rules live');
  });

  it('invites optional shape-review after apply completion without making it a gate', () => {
    for (const template of [getApplyChangeSkillTemplate(), getSpApplyCommandTemplate()]) {
      const content = 'instructions' in template ? template.instructions : template.content;
      const completion = content.split('**Output On Completion**')[1].split('**Output On Pause')[0];
      expect(completion).toContain('You can archive this change with `/sp:archive`.');
      expect(completion).toContain('Optional: review shape with `/sp:shape-review` (does not block archive).');
      expect(completion).toContain('If that command is not installed, say you want a shape review in this conversation.');

      const gates = content.split('### Final Quality Gates')[1].split('Implementation, Test Hardening')[0];
      expect(gates).toContain('| `/sp:simplify` |');
      expect(gates).toContain('| `/sp:verify` |');
      expect(gates).toContain('| `/sp:design-verify` |');
      expect(gates.indexOf('| `/sp:simplify` |')).toBeLessThan(gates.indexOf('| `/sp:design-verify` |'));
      expect(gates.indexOf('| `/sp:design-verify` |')).toBeLessThan(gates.indexOf('| `/sp:verify` |'));
      expect(gates).not.toContain('shape-review');

      const pause = content.split('**Output On Pause')[1].split('**Guardrails**')[0];
      expect(pause).not.toContain('/sp:shape-review');
      expect(pause).not.toContain('Optional: review shape');
    }
  });

  it('requires design-verify After capture, Before consumption, and After-only fallback', () => {
    const designVerify = [getDesignVerifySkillTemplate().instructions, getSpDesignVerifyCommandTemplate().content].join('\n');
    expect(designVerify).toContain('attachments/visual-diff/after/');
    expect(designVerify).toContain('path.join');
    expect(designVerify).toContain('runtime');
    expect(designVerify).toContain('illustrative');
    expect(designVerify).toContain('source, route or state');
    expect(designVerify).toContain('source of truth');
    expect(designVerify).toContain('unexplained');
    expect(designVerify).toContain('not Before');
    expect(designVerify).toContain('| Route / state | Before kind | Before | After | Default comparison |');
    expect(designVerify).toContain('**Before summary:**');
    expect(designVerify).toContain('present | mixed | missing | not applicable');
    expect(designVerify).toContain('Before: missing');
    expect(designVerify).toContain('route did not exist');
    expect(designVerify).toContain('After-only');
    expect(designVerify).toContain('does not fail or block');
    expect(designVerify).not.toContain('git worktree add');
    expect(designVerify).toContain('Do not reconstruct');
    expect(designVerify).toContain('merge-base');
    expect(designVerify).toContain('never substitute');
    expect(designVerify).toContain('If UI scope has no repository visual design source, report `blocked`');
    expect(designVerify).not.toContain('missing Before is `blocked`');
    expect(designVerify).not.toContain('missing Before is `failed`');
  });

  it('requires apply fail-closed runtime Before capture before UI edits', () => {
    for (const template of [getApplyChangeSkillTemplate(), getSpApplyCommandTemplate()]) {
      const content = 'instructions' in template ? template.instructions : template.content;
      expect(content).toContain('attachments/visual-diff/before/');
      expect(content).toContain('path.join');
      expect(content).toContain('.html');
      expect(content).toContain('.css');
      expect(content).toContain('.scss');
      expect(content).toContain('.sass');
      expect(content).toContain('.less');
      expect(content).toContain('.vue');
      expect(content).toContain('.svelte');
      expect(content).toContain('.jsx');
      expect(content).toContain('.tsx');
      expect(content).toContain('git diff --name-only');
      expect(content).toContain('--cached');
      expect(content).toContain('no paths at all');
      expect(content).toContain('git status --porcelain');
      expect(content).toContain('defaults to `closed`');
      expect(content).toContain('fail-closed');
      expect(content).toContain('do not block apply');
      expect(content).toContain('illustrative');
      expect(content).toContain('Unexplained');
      expect(content).toContain('not Before');
      expect(content).toContain('documented app entry');
      expect(content).toContain('union of routes named');
      expect(content).toContain('source, route or state');
      expect(content).toContain('template/non-suffix');
      expect(content).toContain('6. **Runtime Before capture');
      expect(content).toContain('7. **Implement tasks (loop until done or blocked)**');
      expect(content).toContain('8. **Run Test Hardening after implementation tasks are complete**');
      expect(content).toContain('9. **Run final quality gates**');
      expect(content).toContain('10. **On completion or pause, show status**');
      expect(content).not.toContain('6. **Implement tasks (loop until done or blocked)**');
      const progressIdx = content.indexOf('5. **Show current progress**');
      const captureIdx = content.indexOf('6. **Runtime Before capture');
      const implementIdx = content.indexOf('7. **Implement tasks (loop until done or blocked)**');
      expect(progressIdx).toBeGreaterThan(-1);
      expect(captureIdx).toBeGreaterThan(progressIdx);
      expect(implementIdx).toBeGreaterThan(captureIdx);
      expect(content).not.toContain('git worktree add');
      const gates = content.split('### Final Quality Gates')[1].split('Implementation, Test Hardening')[0];
      expect(gates).not.toContain('visual-diff');
    }
  });

  it('embeds visual-diff rules in the apply-delegated Design verify gate', () => {
    const apply = [getApplyChangeSkillTemplate().instructions, getSpApplyCommandTemplate().content].join('\n');
    const dvGate = apply.split('3. **Design verify (rounds 1–4).**')[1].split('4. **Verify (rounds 1–4).**')[0];
    expect(dvGate).toContain('attachments/visual-diff/after/');
    expect(dvGate).toContain('attachments/visual-diff/before/');
    expect(dvGate).toContain('source, route or state');
    expect(dvGate).toContain('source of truth');
    expect(dvGate).toContain('present | mixed | missing');
    expect(dvGate).toContain('Before: missing');
    expect(dvGate).toContain('Do not reconstruct');
    expect(apply).toContain('Design verify (rounds 1–4)');
  });

  it('embeds a runnable same-session shape-review contract in apply', () => {
    for (const template of [getApplyChangeSkillTemplate(), getSpApplyCommandTemplate()]) {
      const content = 'instructions' in template ? template.instructions : template.content;
      expect(content).toContain(SHAPE_REVIEW_APPLY_HANDOFF.trim());
      expect(content).toContain('suggest archive and optional shape-review');
      expect(content).toContain('slash-after-apply remaining same-session');
      expect(content).toContain('same-session wins');
      expect(content).toContain('fail-closed');
      expect(content).toContain('expand the current change in place');
      expect(content).toContain('stop recommending');
      expect(content).toContain('run `/sp:review` before');
      expect(content).toContain('create a new change with');
      expect(content).toContain('a prerequisite');
      expect(content).toContain('re-run final quality gates after');
      expect(content).toContain('Do not require `superpowers config profile`');
      expect(content).toContain('Do not skip because the');
      expect(content).toContain('Do not point at');
      expect(content).not.toContain('read `superpowers-shape-review`');
      expect(content).not.toContain('public API, CLI, events, flags');
      expect(content).not.toContain('module cohesion');
      expect(content).not.toContain('representable invalid states');
      expect(content).not.toContain('where rules live');
    }
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
    expect(verify).toContain('prefer `P2` over `P1`, and `P1` over `P0`');
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
    expect(verify).toContain('coordinator repairs an accepted failure or `P0` finding');

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

    for (const template of [getSpProposeSkillTemplate(), getSpProposeCommandTemplate()]) {
      const content = 'instructions' in template ? template.instructions : template.content;
      expect(content).toContain('When creating `test-plan.md`');
      expect(content).toContain('TC-R<object>-D<dimension>-<seq>');
      expect(content).toContain('MC-R<object>-<seq>');
      expect(content).toContain('planned` / `passed` / `failed` / `blocked` / `not applicable');
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

  it('pins I1–I9 autonomy contracts on generated templates', () => {
    const apply = getApplyChangeSkillTemplate().instructions;
    const usingSuperpowers = readFileSync(
      path.join(process.cwd(), 'skills', 'using-superpowers', 'SKILL.md'),
      'utf8'
    );
    const finishing = readFileSync(
      path.join(process.cwd(), 'skills', 'finishing-a-development-branch', 'SKILL.md'),
      'utf8'
    );
    const debug = readFileSync(
      path.join(process.cwd(), 'skills', 'systematic-debugging', 'SKILL.md'),
      'utf8'
    );
    const worktrees = readFileSync(
      path.join(process.cwd(), 'skills', 'using-git-worktrees', 'SKILL.md'),
      'utf8'
    );
    const agents = readFileSync(path.join(process.cwd(), 'AGENTS.md'), 'utf8');

    expect(apply).toContain('full-qa-test');
    expect(apply).toContain('**10** test cases');
    expect(getCanonicalNonVisualSuiteInstructions('Test Hardening')).not.toMatch(
      /fail-closed and run the complete canonical non-visual suite/
    );
    expect(getFinalQualityGateInstructions()).toMatch(/same-context fallback/);
    expect(usingSuperpowers).not.toMatch(/before any response or action/i);
    expect(usingSuperpowers).not.toMatch(/GPT6-guide/);
    expect(agents).not.toMatch(/GPT6-guide/);
    expect(getSpProposeSkillTemplate().instructions).toContain('never labeled as user Choices');
    expect(finishing).not.toMatch(/npm test \/ cargo test \/ pytest \/ go test \.\/\.\.\./);
    expect(usingSuperpowers).not.toMatch(/fall closed to the complete suite/i);
    expect(getChangeReviewSkillTemplate().instructions).not.toMatch(
      /10→10→10 run once per Requirement per dimension/
    );
    expect(getExploreSkillTemplate().description).not.toMatch(/investigating problems/i);
    expect(debug).not.toMatch(/read every line/i);
    expect(worktrees).not.toMatch(/Where should I create worktrees/);
  });

  it('does not treat cursor full-qa-test as a projection of workflows/*.ts', () => {
    expect(getSkillTemplates().map((entry) => entry.dirName)).not.toContain('full-qa-test');
    expect(getSkillTemplates().map((entry) => entry.dirName)).not.toContain(
      'superpowers-full-qa-test'
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
      getShapeReviewSkillTemplate,
      getSpShapeReviewCommandTemplate,
    };

    const actualHashes = Object.fromEntries(
      Object.entries(functionFactories).map(([name, fn]) => [name, hash(stableStringify(fn()))])
    );

    expect(actualHashes).toMatchSnapshot();
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
      ['superpowers-shape-review', getShapeReviewSkillTemplate],
    ];

    const actualHashes = Object.fromEntries(
      skillFactories.map(([dirName, createTemplate]) => [
        dirName,
        hash(generateSkillContent(createTemplate(), 'PARITY-BASELINE')),
      ])
    );

    expect(actualHashes).toMatchSnapshot();
  });
});
