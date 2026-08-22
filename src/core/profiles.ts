/**
 * Profile System
 *
 * Defines workflow profiles that control which workflows are installed.
 * Profiles determine WHICH workflows; delivery (in global config) determines HOW.
 */

import type { Profile } from './global-config.js';

/**
 * Core workflows included in the 'core' profile.
 * These provide the streamlined experience for new users.
 *
 * `simplify`, `verify`, and `design-verify` are included because `/sp:apply`
 * runs them as mandatory Final Quality Gates. Apply embeds a runnable contract
 * for each gate, so a deselected workflow never disables a gate; shipping them
 * by default just means the gate worker can follow the full standalone
 * contract instead of the embedded minimum.
 */
export const CORE_WORKFLOWS = [
  'propose',
  'explore',
  'review',
  'apply',
  'archive',
  'verify',
  'simplify',
  'design-verify',
] as const;

/**
 * All available workflows in the system.
 */
export const ALL_WORKFLOWS = [
  'propose',
  'explore',
  'review',
  'new',
  'continue',
  'apply',
  'ff',
  'sync',
  'archive',
  'bulk-archive',
  'verify',
  'simplify',
  'design-verify',
  'shape-review',
  'onboard',
] as const;

export type WorkflowId = (typeof ALL_WORKFLOWS)[number];
export type CoreWorkflowId = (typeof CORE_WORKFLOWS)[number];

/**
 * Resolves which workflows should be active for a given profile configuration.
 *
 * - 'core' profile always returns CORE_WORKFLOWS
 * - 'custom' profile returns the provided customWorkflows, or empty array if not provided
 */
export function getProfileWorkflows(
  profile: Profile,
  customWorkflows?: string[]
): readonly string[] {
  if (profile === 'custom') {
    return customWorkflows ?? [];
  }
  return CORE_WORKFLOWS;
}
