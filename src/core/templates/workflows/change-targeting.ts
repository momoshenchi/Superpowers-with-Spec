import { pick, type Projection } from './projection.js';

type ChangeTargetingKind = 'verify' | 'archive' | 'sync';

const ELIGIBILITY: Record<ChangeTargetingKind, string> = {
  verify:
    'Eligible changes are active changes that have implementation tasks (tasks artifact exists). Include the schema used for each change if available. Mark changes with incomplete tasks as "(In Progress)". When a prompt is required, show only those eligible changes.',
  archive:
    'Eligible changes are active changes (not already archived). Include the schema used for each change if available. When a prompt is required, show only active changes.',
  sync: 'Eligible changes are active changes that have delta specs (under `specs/` directory). When a prompt is required, show only those eligible changes.',
};

const EXTRA: Record<ChangeTargetingKind, string> = {
  verify: '',
  archive: `
   Auto-select does not skip later warnings. Incomplete artifacts, incomplete tasks, and incomplete, failed, or blocked applicable Final Quality Gates still require a warning and confirmation.`,
  sync: `
   If no active change has delta specs, report that nothing is eligible to sync and stop. Do not guess a change that has no delta specs.`,
};

export function getChangeTargetingInput(kind: ChangeTargetingKind, projection: Projection): string {
  return `**Input**: Optionally specify a change name${pick(projection, '', ` after \`/sp:${kind}\` (e.g., \`/sp:${kind} add-auth\`)`)}. Use an explicit name when given; otherwise resolve with the targeting rule in Step 1.`;
}

export function getChangeTargetingStep(kind: ChangeTargetingKind): string {
  return `1. **Resolve the change name**

   Use an explicit change name when provided. Otherwise use the conversation-bound change if conversation already names one. Otherwise, if there is exactly one eligible change, select that sole eligible change. Prompt only when two or more eligible changes could match; do not guess.

   Run \`superpowers list --json\` to list active changes when you need to determine eligibility or prompt. Announce the selected name before continuing.

   ${ELIGIBILITY[kind]}${EXTRA[kind]}`;
}
