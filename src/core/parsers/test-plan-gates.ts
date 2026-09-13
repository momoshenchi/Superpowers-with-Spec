/**
 * Reads the `## Final Quality Gates` record that `/sp:apply` writes into a
 * change's `test-plan.md`, so archive can tell a completed quality chain from
 * one that was skipped.
 */

export type GateOutcome = 'passed' | 'failed' | 'blocked' | 'not applicable' | 'planned';

export interface GateRow {
  gate: string;
  outcome: GateOutcome;
  evidence: string;
}

export interface FinalQualityGateReport {
  /** False when `test-plan.md` has no `## Final Quality Gates` section at all. */
  sectionPresent: boolean;
  rows: GateRow[];
  /** Rows that block archive readiness: `failed`, applicable `blocked`, or never run. */
  unresolved: GateRow[];
}

const SECTION_HEADING = /^##\s+Final Quality Gates\s*$/i;
const ANY_HEADING = /^##\s+/;
const OUTCOMES: GateOutcome[] = ['passed', 'failed', 'blocked', 'not applicable', 'planned'];

function splitRow(line: string): string[] {
  return line
    .replace(/^\s*\|/, '')
    .replace(/\|\s*$/, '')
    .split('|')
    .map((cell) => cell.trim());
}

function isSeparatorRow(cells: string[]): boolean {
  return cells.every((cell) => /^:?-{3,}:?$/.test(cell));
}

/**
 * Unfilled template rows still carry their `<!-- ... -->` placeholder, which
 * lists every outcome word. Treat those as `planned` rather than matching the
 * first word that happens to appear inside the comment.
 */
function readOutcome(cell: string): GateOutcome {
  const withoutComments = cell.replace(/<!--[\s\S]*?-->/g, '').trim();
  if (!withoutComments) return 'planned';

  const normalized = withoutComments.toLowerCase();
  const matches = OUTCOMES.filter((outcome) => normalized.includes(outcome));
  if (matches.length !== 1) return 'planned';
  return matches[0];
}

export function parseFinalQualityGates(testPlanContent: string): FinalQualityGateReport {
  const lines = testPlanContent.replace(/\r\n?/g, '\n').split('\n');
  const start = lines.findIndex((line) => SECTION_HEADING.test(line));

  if (start === -1) {
    return { sectionPresent: false, rows: [], unresolved: [] };
  }

  const rows: GateRow[] = [];
  for (let i = start + 1; i < lines.length; i++) {
    const line = lines[i];
    if (ANY_HEADING.test(line)) break;
    if (!line.trim().startsWith('|')) continue;

    const cells = splitRow(line);
    if (cells.length < 2 || isSeparatorRow(cells)) continue;

    const gate = cells[0].replace(/`/g, '').trim();
    if (!gate || gate.toLowerCase() === 'gate') continue;

    rows.push({ gate, outcome: readOutcome(cells[1]), evidence: cells[2] ?? '' });
  }

  const unresolved = rows.filter(
    (row) => row.outcome !== 'passed' && row.outcome !== 'not applicable'
  );

  return { sectionPresent: true, rows, unresolved };
}

/**
 * Human-readable reason the quality chain is not complete, or `null` when the
 * recorded gates are all resolved. A change with no `test-plan.md` at all has
 * no gate contract to check and yields `null`.
 */
export function describeUnresolvedGates(report: FinalQualityGateReport): string | null {
  if (!report.sectionPresent) {
    return 'test-plan.md has no "## Final Quality Gates" record, so the final code review, Simplify, Design Verify, and Verify gates cannot be confirmed';
  }

  if (report.rows.length === 0) {
    return 'the "## Final Quality Gates" section records no gate rows';
  }

  if (report.unresolved.length === 0) return null;

  const detail = report.unresolved.map((row) => `${row.gate}: ${row.outcome}`).join(', ');
  return `${report.unresolved.length} final quality gate(s) not passed (${detail})`;
}
