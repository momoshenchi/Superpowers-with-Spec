import type { CommandTemplate, SkillTemplate } from '../types.js';

const instructions = `\`/sp:simplify → 4 cleanup agents in parallel → apply the fixes\`
You are improving the quality of the changed code, not hunting for bugs. Review
it for reuse, simplification, efficiency, and altitude issues, then fix what you
find. Do not look for correctness bugs — that is what host-native code review is for.

**Repair ownership:** Simplify is authorized to edit the reviewed scope directly, but only for behavior-preserving cleanup. Do not repair product correctness, requirements, architecture, or visual-design findings; report those outside-scope concerns for the coordinator instead. If a proposed cleanup is uncertain, crosses the resolved scope, or changes observable behavior, revert or skip it and report the reason.

## Phase -1 — Resolve Superpowers change scope

When a \`<change-name>\` is supplied, resolve it before gathering a diff:

1. Run \`superpowers status --change "<change-name>" --json\`.
2. Run \`superpowers instructions apply --change "<change-name>" --json\`.
3. Read the returned context files and use the change's implementation/artifact paths plus its owned diff as the cleanup scope.

Do not absorb unrelated working-tree changes. If the owned paths or diff cannot be
separated from unrelated dirty changes, pause and ask for a narrower target rather
than guessing. Without a change name, require an explicit PR, branch, or file/diff
target before reviewing; do not silently treat the whole working tree as the target.

## Phase 0 — Gather the diff

Run \`git diff @{upstream}...HEAD\` (or \`git diff main...HEAD\` / \`git diff HEAD~1\`
if there's no upstream) to get the unified diff under review. If there are
uncommitted changes, or the range diff is empty, also run \`git diff HEAD\` and
include only the explicit target or the resolved change-owned working-tree changes
in scope — the review often runs before the commit. If a PR number, branch name,
or file path was passed as an argument, review that target instead. Treat this diff
as the review scope.

## Phase 1 — Review (4 cleanup agents in parallel)

When the host provides an agent-spawning tool, launch **4 independent review
agents** in a single message so they run concurrently. Pass each agent the diff
and one of the four angles below. Each returns its findings with \`file\`, \`line\`,
a one-line \`summary\`, and the concrete cost (what is duplicated, wasted, or
harder to maintain).

When an agent-spawning tool is unavailable, work through all four angles in this
same context in one pass — do not skip an angle for lack of fan-out. State in the
final summary that this was a single-pass review, not the four-agent fan-out.

### Reuse
Flag new code that re-implements something the codebase already has — Grep
shared/utility modules and files adjacent to the change, and name the existing
helper to call instead.

### Simplification
Flag unnecessary complexity the diff adds: redundant or derivable state,
copy-paste with slight variation, deep nesting, dead code left behind. Name
the simpler form that does the same job.

### Efficiency
Flag wasted work the diff introduces: redundant computation or repeated I/O,
independent operations run sequentially, blocking work added to startup or
hot paths. Also flag long-lived objects built from closures or captured
environments — they keep the entire enclosing scope alive for the object's
lifetime (a memory leak when that scope holds large values); prefer a
class/struct that copies only the fields it needs. Name the cheaper
alternative.

### Altitude
Check that each change is implemented at the right depth, not as a fragile
bandaid. Special cases layered on shared infrastructure are a sign the fix
isn't deep enough — prefer generalizing the underlying mechanism over adding
special cases.

## Phase 2 — Apply the fixes

Wait for all four agents to complete, dedup findings that point at the same
line or mechanism, and apply each remaining behavior-preserving cleanup directly. Skip any finding whose
fix would change intended behavior, require changes well outside the reviewed
diff, or that you judge to be a false positive — note the skip rather than
arguing with it. Finish with a brief summary of what was fixed and what was
skipped (or confirm the code was already clean).

## Apply final-quality handoff

When this workflow runs as the Simplify gate inside \`/sp:apply\`, it has no
independent retry loop. Repair a safe cleanup or revert an uncertain cleanup,
then run fresh affected verification. A safely completed result (whether it
changed code or found nothing to change) hands off directly to **Verify round
one**; do not restart Simplify or code review. If scope resolution is blocked,
or cleanup cannot be made behavior-preserving after repair or revert, report
\`blocked\` or \`failed\` and pause apply rather than consuming a hidden
Simplify retry attempt.

## Output format

End with this compact report:

\`\`\`
## Simplify Result
Outcome: passed | failed | blocked | not applicable
Scope: <change name and owned paths, or explicit target>
Review mode: four-agent fan-out | single-pass fallback
Applied: <file:line and behavior-preserving cleanup, or none>
Skipped: <finding and reason, or none>
Evidence: <diff/review inputs and any validation run>
Apply handoff: <Verify round 1 | paused: blocked/failed | not running inside apply>
\`\`\`

Use \`blocked\` only when the requested scope cannot safely be resolved or an
explicit target is missing. Use \`failed\` when a cleanup validation cannot be
made behavior-preserving after repair or revert. Use \`not applicable\` only
when the resolved scope has no implementation eligible for cleanup, with a
concrete scope reason. Do not use \`passed\` to conceal unrelated changes that
were excluded from the review.

This is \`/sp:simplify\`, not a replacement for a host-native \`/simplify\` command.`;

export function getSimplifySkillTemplate(): SkillTemplate {
  return { name: 'superpowers-simplify', description: 'Perform behavior-preserving cleanup for a Superpowers change.', instructions, license: 'MIT', compatibility: 'Requires superpowers CLI.', metadata: { author: 'superpowers', version: '1.0' } };
}

export function getSpSimplifyCommandTemplate(): CommandTemplate {
  return { name: 'SP: Simplify', description: 'Perform behavior-preserving cleanup for a Superpowers change', category: 'Workflow', tags: ['workflow', 'quality'], content: instructions };
}
