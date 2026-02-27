/**
 * Agent Skill Templates
 *
 * Compatibility facade that re-exports split workflow template modules.
 */

export type { SkillTemplate, CommandTemplate } from './types.js';

export { getExploreSkillTemplate, getSpExploreCommandTemplate } from './workflows/explore.js';
export { getNewChangeSkillTemplate, getSpNewCommandTemplate } from './workflows/new-change.js';
export { getContinueChangeSkillTemplate, getSpContinueCommandTemplate } from './workflows/continue-change.js';
export { getApplyChangeSkillTemplate, getSpApplyCommandTemplate } from './workflows/apply-change.js';
export { getFfChangeSkillTemplate, getSpFfCommandTemplate } from './workflows/ff-change.js';
export { getSyncSpecsSkillTemplate, getSpSyncCommandTemplate } from './workflows/sync-specs.js';
export { getArchiveChangeSkillTemplate, getSpArchiveCommandTemplate } from './workflows/archive-change.js';
export { getBulkArchiveChangeSkillTemplate, getSpBulkArchiveCommandTemplate } from './workflows/bulk-archive-change.js';
export { getVerifyChangeSkillTemplate, getSpVerifyCommandTemplate } from './workflows/verify-change.js';
export { getOnboardSkillTemplate, getSpOnboardCommandTemplate } from './workflows/onboard.js';
export { getSpProposeSkillTemplate, getSpProposeCommandTemplate } from './workflows/propose.js';
export { getFeedbackSkillTemplate } from './workflows/feedback.js';
