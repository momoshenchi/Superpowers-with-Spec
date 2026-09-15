import { promises as fs } from 'node:fs';
import path from 'node:path';

export const OBSOLETE_BUNDLED_SKILL_DIRS = [
  'requesting-code-review',
  'verification-before-completion',
  'subagent-driven-development',
  'when-to-dispatch-code-review',
] as const;

export const OBSOLETE_BUNDLED_SKILL_FILES = [
  'using-superpowers/reference/codex-tools.md',
  'using-superpowers/reference/copilot-tools.md',
  'using-superpowers/reference/gemini-tools.md',
  'systematic-debugging/CREATION-LOG.md',
  'systematic-debugging/test-pressure-1.md',
  'systematic-debugging/test-pressure-2.md',
  'systematic-debugging/test-pressure-3.md',
  'systematic-debugging/test-pressure-4.md',
] as const;

export async function removeObsoleteBundledSkillDirs(destSkillsDir: string): Promise<void> {
  await Promise.all(
    OBSOLETE_BUNDLED_SKILL_DIRS.map((obsoleteDirName) =>
      fs.rm(path.join(destSkillsDir, obsoleteDirName), {
        recursive: true,
        force: true,
      })
    )
  );
}

export async function removeObsoleteBundledSkillFiles(destSkillsDir: string): Promise<void> {
  await Promise.all(
    OBSOLETE_BUNDLED_SKILL_FILES.map((relativePath) =>
      fs.rm(path.join(destSkillsDir, ...relativePath.split('/')), { force: true })
    )
  );
}
