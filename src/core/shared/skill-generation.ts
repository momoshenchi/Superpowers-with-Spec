/**
 * Skill Generation Utilities
 *
 * Shared utilities for generating skill and command files.
 */

import {
  getExploreSkillTemplate,
  getNewChangeSkillTemplate,
  getContinueChangeSkillTemplate,
  getApplyChangeSkillTemplate,
  getFfChangeSkillTemplate,
  getSyncSpecsSkillTemplate,
  getArchiveChangeSkillTemplate,
  getBulkArchiveChangeSkillTemplate,
  getVerifyChangeSkillTemplate,
  getOnboardSkillTemplate,
  getSpProposeSkillTemplate,
  getSpExploreCommandTemplate,
  getSpNewCommandTemplate,
  getSpContinueCommandTemplate,
  getSpApplyCommandTemplate,
  getSpFfCommandTemplate,
  getSpSyncCommandTemplate,
  getSpArchiveCommandTemplate,
  getSpBulkArchiveCommandTemplate,
  getSpVerifyCommandTemplate,
  getSpOnboardCommandTemplate,
  getSpProposeCommandTemplate,
  type SkillTemplate,
} from '../templates/skill-templates.js';
import type { CommandContent } from '../command-generation/index.js';

/**
 * Skill template with directory name and workflow ID mapping.
 */
export interface SkillTemplateEntry {
  template: SkillTemplate;
  dirName: string;
  workflowId: string;
}

/**
 * Command template with ID mapping.
 */
export interface CommandTemplateEntry {
  template: ReturnType<typeof getSpExploreCommandTemplate>;
  id: string;
}

/**
 * Gets skill templates with their directory names, optionally filtered by workflow IDs.
 *
 * @param workflowFilter - If provided, only return templates whose workflowId is in this array
 */
export function getSkillTemplates(workflowFilter?: readonly string[]): SkillTemplateEntry[] {
  const all: SkillTemplateEntry[] = [
    { template: getExploreSkillTemplate(), dirName: 'superpowers-explore', workflowId: 'explore' },
    { template: getNewChangeSkillTemplate(), dirName: 'superpowers-new-change', workflowId: 'new' },
    { template: getContinueChangeSkillTemplate(), dirName: 'superpowers-continue-change', workflowId: 'continue' },
    { template: getApplyChangeSkillTemplate(), dirName: 'superpowers-apply-change', workflowId: 'apply' },
    { template: getFfChangeSkillTemplate(), dirName: 'superpowers-ff-change', workflowId: 'ff' },
    { template: getSyncSpecsSkillTemplate(), dirName: 'superpowers-sync-specs', workflowId: 'sync' },
    { template: getArchiveChangeSkillTemplate(), dirName: 'superpowers-archive-change', workflowId: 'archive' },
    { template: getBulkArchiveChangeSkillTemplate(), dirName: 'superpowers-bulk-archive-change', workflowId: 'bulk-archive' },
    { template: getVerifyChangeSkillTemplate(), dirName: 'superpowers-verify-change', workflowId: 'verify' },
    { template: getOnboardSkillTemplate(), dirName: 'superpowers-onboard', workflowId: 'onboard' },
    { template: getSpProposeSkillTemplate(), dirName: 'superpowers-propose', workflowId: 'propose' },
  ];

  if (!workflowFilter) return all;

  const filterSet = new Set(workflowFilter);
  return all.filter(entry => filterSet.has(entry.workflowId));
}

/**
 * Gets command templates with their IDs, optionally filtered by workflow IDs.
 *
 * @param workflowFilter - If provided, only return templates whose id is in this array
 */
export function getCommandTemplates(workflowFilter?: readonly string[]): CommandTemplateEntry[] {
  const all: CommandTemplateEntry[] = [
    { template: getSpExploreCommandTemplate(), id: 'explore' },
    { template: getSpNewCommandTemplate(), id: 'new' },
    { template: getSpContinueCommandTemplate(), id: 'continue' },
    { template: getSpApplyCommandTemplate(), id: 'apply' },
    { template: getSpFfCommandTemplate(), id: 'ff' },
    { template: getSpSyncCommandTemplate(), id: 'sync' },
    { template: getSpArchiveCommandTemplate(), id: 'archive' },
    { template: getSpBulkArchiveCommandTemplate(), id: 'bulk-archive' },
    { template: getSpVerifyCommandTemplate(), id: 'verify' },
    { template: getSpOnboardCommandTemplate(), id: 'onboard' },
    { template: getSpProposeCommandTemplate(), id: 'propose' },
  ];

  if (!workflowFilter) return all;

  const filterSet = new Set(workflowFilter);
  return all.filter(entry => filterSet.has(entry.id));
}

/**
 * Converts command templates to CommandContent array, optionally filtered by workflow IDs.
 *
 * @param workflowFilter - If provided, only return contents whose id is in this array
 */
export function getCommandContents(workflowFilter?: readonly string[]): CommandContent[] {
  const commandTemplates = getCommandTemplates(workflowFilter);
  return commandTemplates.map(({ template, id }) => ({
    id,
    name: template.name,
    description: template.description,
    category: template.category,
    tags: template.tags,
    body: template.content,
  }));
}

/**
 * Generates skill file content with YAML frontmatter.
 *
 * @param template - The skill template
 * @param generatedByVersion - The Superpowers version to embed in the file
 * @param transformInstructions - Optional callback to transform the instructions content
 */
export function generateSkillContent(
  template: SkillTemplate,
  generatedByVersion: string,
  transformInstructions?: (instructions: string) => string
): string {
  const instructions = transformInstructions
    ? transformInstructions(template.instructions)
    : template.instructions;

  return `---
name: ${template.name}
description: ${template.description}
license: ${template.license || 'MIT'}
compatibility: ${template.compatibility || 'Requires superpowers CLI.'}
metadata:
  author: ${template.metadata?.author || 'superpowers'}
  version: "${template.metadata?.version || '1.0'}"
  generatedBy: "${generatedByVersion}"
---

${instructions}
`;
}
