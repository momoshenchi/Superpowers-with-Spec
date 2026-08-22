import type { ValidationIssue } from './types.js';
import {
  extractRequirementsSection,
  normalizeRequirementName,
  type DeltaPlan,
} from '../parsers/requirement-blocks.js';

/**
 * Cross-file check of delta operations against the capability's main spec.
 *
 * Deciding whether a requirement belongs under ADDED or MODIFIED is a mechanical
 * comparison against the main spec, so it is resolved here instead of during
 * proposal review. `specs-apply` enforces the same rules when it writes the merge,
 * but only at apply/sync/archive time; running them during validation surfaces a
 * mislabeled operation before the implementation is built on top of it.
 *
 * Operations are simulated in the same order `specs-apply` uses
 * (RENAMED -> REMOVED -> MODIFIED -> ADDED) so that legitimate combinations such as
 * "rename then modify under the new name" do not report false positives.
 */
export function checkDeltaOperationsAgainstMainSpec(
  entryPath: string,
  specName: string,
  plan: DeltaPlan,
  mainSpecContent: string | null
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const error = (message: string) => issues.push({ level: 'ERROR', path: entryPath, message });

  if (mainSpecContent === null) {
    for (const block of plan.modified) {
      error(
        `MODIFIED "${block.name}" targets capability "${specName}", which has no main spec yet. ` +
          `Move it under "## ADDED Requirements".`
      );
    }
    for (const pair of plan.renamed) {
      error(
        `RENAMED FROM "${pair.from}" targets capability "${specName}", which has no main spec yet. ` +
          `Define the requirement under "## ADDED Requirements" instead of renaming.`
      );
    }
    for (const name of plan.removed) {
      issues.push({
        level: 'WARNING',
        path: entryPath,
        message:
          `REMOVED "${name}" targets capability "${specName}", which has no main spec yet. ` +
          `The operation will be ignored when specs are applied.`,
      });
    }
    return issues;
  }

  // Keyed by the case-insensitive match key, valued by the name as written in the
  // main spec so that near-match suggestions echo the author's original casing.
  const existing = new Map<string, string>();
  for (const block of extractRequirementsSection(mainSpecContent).bodyBlocks) {
    existing.set(matchKey(block.name), normalizeRequirementName(block.name));
  }

  for (const pair of plan.renamed) {
    const from = matchKey(pair.from);
    const to = matchKey(pair.to);
    if (!existing.has(from)) {
      error(
        `RENAMED FROM "${pair.from}" is not found in the main spec for "${specName}".` +
          suffixForMissing(pair.from, existing)
      );
      continue;
    }
    if (existing.has(to)) {
      error(
        `RENAMED TO "${pair.to}" already exists in the main spec for "${specName}". ` +
          `Choose a name that is not already taken.`
      );
      continue;
    }
    existing.delete(from);
    existing.set(to, normalizeRequirementName(pair.to));
  }

  for (const name of plan.removed) {
    const key = matchKey(name);
    if (!existing.has(key)) {
      error(
        `REMOVED "${name}" is not found in the main spec for "${specName}".` +
          suffixForMissing(name, existing)
      );
      continue;
    }
    existing.delete(key);
  }

  for (const block of plan.modified) {
    const key = matchKey(block.name);
    if (!existing.has(key)) {
      error(
        `MODIFIED "${block.name}" is not found in the main spec for "${specName}". ` +
          `If this requirement is new, move it under "## ADDED Requirements".` +
          suffixForMissing(block.name, existing)
      );
      continue;
    }
    existing.set(key, normalizeRequirementName(block.name));
  }

  for (const block of plan.added) {
    const key = matchKey(block.name);
    if (existing.has(key)) {
      error(
        `ADDED "${block.name}" already exists in the main spec for "${specName}". ` +
          `If you are changing it, move it under "## MODIFIED Requirements".`
      );
      continue;
    }
    existing.set(key, normalizeRequirementName(block.name));
  }

  return issues;
}

/**
 * Requirement headers are matched case-insensitively so that a capitalization slip
 * is reported as a near-match typo rather than as a genuinely new requirement.
 */
function matchKey(name: string): string {
  return normalizeRequirementName(name).toLowerCase();
}

function suffixForMissing(name: string, existing: Map<string, string>): string {
  const closest = findClosestName(matchKey(name), existing);
  return closest ? ` The closest existing requirement is "${closest}".` : '';
}

/**
 * Returns the nearest existing requirement name when the difference is small enough
 * to look like a typo rather than a different requirement.
 */
function findClosestName(target: string, existing: Map<string, string>): string | null {
  let bestKey: string | null = null;
  let bestDistance = Infinity;

  for (const key of existing.keys()) {
    const distance = levenshtein(target, key);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestKey = key;
    }
  }

  if (bestKey === null) return null;
  const threshold = Math.max(1, Math.floor(Math.min(target.length, bestKey.length) / 4));
  return bestDistance <= threshold ? existing.get(bestKey)! : null;
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  let previous = Array.from({ length: b.length + 1 }, (_, i) => i);

  for (let i = 1; i <= a.length; i++) {
    const current = [i];
    for (let j = 1; j <= b.length; j++) {
      const substitution = previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1);
      current[j] = Math.min(current[j - 1] + 1, previous[j] + 1, substitution);
    }
    previous = current;
  }

  return previous[b.length];
}
