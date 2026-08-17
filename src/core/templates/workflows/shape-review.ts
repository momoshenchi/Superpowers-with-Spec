import type { CommandTemplate, SkillTemplate } from '../types.js';

export const SHAPE_REVIEW_CONTRACT = `\`/sp:shape-review → 4 shape agents in parallel → report suggestions\`
You are reviewing the shape of the changed code: Surface, Boundaries, Model, and
Composition. Produce modification suggestions. Do not hunt for correctness bugs
and do not apply structural edits in this review pass.

**Repair ownership:** The shape-review worker is read-only by default. Report
findings before any implementation or artifact changes. Do not repair product
correctness, requirements, visual-design, or simplify-eligible cleanup here.

## Phase -0 — Resolve Superpowers change scope

When a \`<change-name>\` is supplied, resolve it before gathering a diff:

1. Run \`superpowers status --change "<change-name>" --json\`.
2. Run \`superpowers instructions apply --change "<change-name>" --json\`.
3. Read the returned context files and use the change's implementation/artifact
   paths plus its owned diff as the review scope.

Do not absorb unrelated working-tree changes. If the owned paths or diff cannot be
separated from unrelated dirty changes, pause and ask for a narrower target rather
than guessing. Without a change name, require an explicit PR, branch, or file/diff
target before reviewing unless this conversation just completed
\`/sp:apply\` for one identifiable change; do not silently treat the whole dirty
working tree as the target. Path handling is platform-neutral: use the paths
returned by Superpowers CLI rather than hardcoded slashes.

### Gather the diff

Run \`git diff @{upstream}...HEAD\` (or \`git diff main...HEAD\` /
\`git diff HEAD~1\` if there's no upstream) to get the unified diff under review.
If there are uncommitted changes, or the range diff is empty, also run
\`git diff HEAD\` and include only the explicit target or the resolved
change-owned working-tree changes in scope. If a PR number, branch name, or
file path was passed as an argument, review that target instead. Treat this
diff as the review scope.

## Phase 1 — Review (4 shape agents in parallel)

When the host provides an agent-spawning tool, launch **4 independent review
agents** in a single message so they run concurrently. Pass each agent the
diff and one of the four angles below. Each returns findings with \`file\`,
\`line\` or symbol, a one-line \`summary\`, and the concrete \`cost\`. Do not let
fan-out workers assign \`expand-current-change\` vs \`new-proposal\`; that is
the summarizing pass.

When an agent-spawning tool is unavailable, work through all four angles in
this same context in one pass — do not skip an angle for lack of fan-out.
State in the final summary that this was a single-pass review, not the four-agent fan-out.

Always run all four angles. If the diff has no evidence for a layer, that
angle is \`not applicable\` with concrete scope evidence; do not omit the angle.

### Surface
Inspect public API, CLI, events, flags, wire/DTO/error shapes, compatibility
seams, and command taxonomy.

### Boundaries
Inspect module cohesion and coupling, layering, dependency direction,
trust-boundary placement, and ownership versus file topology.

### Model
Inspect representable invalid states, domain vs transport vs persistence types,
explicit lifecycle versus flag soup, and stable identifiers.

### Composition
Inspect where rules live, missing versus premature extension points,
wiring/lifecycle, testability ports, and sync/async protocol between parts.

## Phase 2 — Classify, route, and report

Wait for all four agents to complete, dedup findings that point at the same
line or mechanism, and classify each remaining finding as \`simplify\`,
\`structural\`, or \`skip\`.

- \`simplify\`: behavior-preserving local cleanup. Destination \`simplify\`.
  Do not apply it here; route to \`/sp:simplify\`.
- \`structural\`: would change a public surface, data contract, module
  boundary, type/state model, or composition seam. The summarizing pass, not
  fan-out workers, assigns destination from **this conversation** using the
  session rule.
- \`skip\`: false positive, lacks evidence, or requires changes well outside
  the reviewed diff. Destination \`skip\`. Note the skip rather than arguing.

Session rule (same-session wins; slash-after-apply remaining same-session):

- Same-session after apply when this conversation contains an apply completion
  for change N, applicable final quality gates passed, and the user then asks
  to run shape-review or accepts the invitation, including
  \`/sp:shape-review\`, \`/sp:shape-review N\`, or natural language. N must still
  be an active change directory.
- New session when this conversation has no apply-completion evidence for N.
- Conflict: if both appear to match, same-session wins. "Fresh request" means
  this conversation lacks apply-completion evidence, not that the user typed
  the slash command.
- fail-closed: uncertain membership → treat as new session / \`new-proposal\`.

When the user accepts \`structural\` suggestions:

- Same-session: expand the current change in place; withdraw archive until
  expanded work and applicable gates complete again. If specs or design
  changed, run \`/sp:review\` before implementing the expansion.
- New session: create a new change with the prior change as prerequisite; do
  not edit the prior artifacts.

Do not apply structural edits during this review pass.

## Output format

End with this compact report:

\`\`\`
## Shape Review Result
Outcome: passed | failed | blocked
Scope: <change name and owned paths, or explicit target>
Review mode: four-agent fan-out | single-pass fallback
Session routing: same-session apply-after | new-session | not accepting
Angles: Surface=<passed|n/a+evidence> | Boundaries=<...> | Model=<...> | Composition=<...>
Suggestions: <angle, file:line or symbol, summary, cost, classification, destination>
Skipped: <finding and reason, or none>
Evidence: <diff/review inputs>
\`\`\`

Use \`blocked\` only when the requested scope cannot safely be resolved or an
explicit target is missing. Use \`failed\` only when the review process itself
cannot complete after the scope is resolved. Do not use \`failed\` because
structural suggestions exist. \`passed\` means the review completed and
reported, including when it produced structural suggestions; it does not
block archive by itself. \`not applicable\` is a per-angle result with scope
evidence, not the default whole-review outcome.
`;

export const SHAPE_REVIEW_APPLY_HANDOFF = `
## Optional shape-review after apply completion

When implementation, Test Hardening, and every applicable final quality gate
are complete, invite archive and an optional shape review. Do not auto-run
shape-review. Do not add it as a fifth Final Quality Gates row. A \`passed\`
shape-review does not block archive.

Completion copy:

\`\`\`
Implementation, Test Hardening, and every applicable final quality gate are complete.
You can archive this change with \`/sp:archive\`.
Optional: review shape with \`/sp:shape-review\` (does not block archive).
If that command is not installed, say you want a shape review in this conversation.
\`\`\`

If apply paused, or an applicable gate is \`failed\` or \`blocked\`, do not invite
\`/sp:shape-review\` and do not recommend archive.

When the user accepts that invitation in this conversation — including by
typing \`/sp:shape-review\`, \`/sp:shape-review <name>\`, or saying they want a
shape review — execute the following contract from these apply instructions.
Do not require \`superpowers config profile\`. Do not skip because the
standalone \`shape-review\` skill or command is absent. Do not point at
\`superpowers-shape-review\` or an uninstalled \`/sp:shape-review\` file.

**Runnable minimum (self-contained in apply):**

1. Resolve scope from the change that just completed apply. Pause if owned
   paths cannot be separated from unrelated dirty changes. Do not scan the
   whole working tree.
2. Always run all four angles by name: Surface, Boundaries, Model,
   Composition. Missing layer evidence is per-angle \`not applicable\` plus
   evidence. Do not omit an angle.
3. Remain read-only during the review pass. Classify findings
   \`simplify\`, \`structural\`, or \`skip\`.
4. The summarizing pass, not fan-out workers, assigns \`structural\`
   destination from **this conversation** using the session rule:
   same-session wins; slash-after-apply remaining same-session; fail-closed
   uncertain membership creates a new change (\`new-proposal\`).
5. Report with:

\`\`\`
## Shape Review Result
Outcome: passed | failed | blocked
Scope: <change name and owned paths, or explicit target>
Review mode: four-agent fan-out | single-pass fallback
Session routing: same-session apply-after | new-session | not accepting
Angles: Surface=<passed|n/a+evidence> | Boundaries=<...> | Model=<...> | Composition=<...>
Suggestions: <angle, file:line or symbol, summary, cost, classification, destination>
Skipped: <finding and reason, or none>
Evidence: <diff/review inputs>
\`\`\`

6. If the user accepts \`structural\` suggestions in this same post-apply
   conversation, expand the current change in place, stop recommending
   \`/sp:archive\` until the expanded tasks, Test Hardening, and applicable
   final quality gates are complete again, run \`/sp:review\` before
   implementing spec/design expansion, and re-run final quality gates after
   implementation changes. If this is a new session, create a new change with
   a prerequisite instead of editing the prior artifacts.
`;

const instructions = SHAPE_REVIEW_CONTRACT;

export function getShapeReviewSkillTemplate(): SkillTemplate {
  return {
    name: 'superpowers-shape-review',
    description: 'Review Surface, Boundaries, Model, and Composition shape for a Superpowers change.',
    instructions,
    license: 'MIT',
    compatibility: 'Requires superpowers CLI.',
    metadata: { author: 'superpowers', version: '1.0' },
  };
}

export function getSpShapeReviewCommandTemplate(): CommandTemplate {
  return {
    name: 'SP: Shape Review',
    description: 'Review Surface, Boundaries, Model, and Composition for a Superpowers change',
    category: 'Workflow',
    tags: ['workflow', 'quality', 'design'],
    content: instructions,
  };
}
