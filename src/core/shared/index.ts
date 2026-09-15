/**
 * Shared Utilities
 *
 * Common code shared between init and update commands.
 */

export {
  SKILL_NAMES,
  type SkillName,
  COMMAND_IDS,
  type CommandId,
  type ToolSkillStatus,
  type ToolVersionStatus,
  getToolsWithSkillsDir,
  getToolSkillStatus,
  getToolStates,
  extractGeneratedByVersion,
  getToolVersionStatus,
  getConfiguredTools,
  getAllToolVersionStatus,
} from './tool-detection.js';

export {
  OBSOLETE_BUNDLED_SKILL_DIRS,
  removeObsoleteBundledSkillDirs,
  removeObsoleteBundledSkillFiles,
} from './obsolete-bundled-skills.js';

export {
  type SkillTemplateEntry,
  type CommandTemplateEntry,
  getSkillTemplates,
  getCommandTemplates,
  getCommandContents,
  companionSkillTemplates,
  generateSkillContent,
  writeGeneratedSkill,
  writeGeneratedSkills,
  skillReferenceDest,
} from './skill-generation.js';
