---
name: /sp-shape-review
id: sp-shape-review
category: Workflow
description: "Review Surface, Boundaries, Model, and Composition for a Superpowers change"
---

`/sp:shape-review → 4 shape agents in parallel → report suggestions`
You are reviewing the shape of the changed code: Surface, Boundaries, Model, and
Composition. Produce modification suggestions. Do not hunt for correctness bugs
and do not apply structural edits in this review pass.

**Repair ownership:** The shape-review worker is read-only by default. Report
findings before any implementation or artifact changes. Do not repair product
correctness, requirements, visual-design, or simplify-eligible cleanup here.

## Phase -0 — Resolve Superpowers change scope

When a `<change-name>` is supplied, resolve it before gathering a diff:

1. Run `superpowers status --change "<change-name>" --json`.
2. Run `superpowers instructions apply --change "<change-name>" --json`.
3. Read the returned context files and use the change's implementation/artifact
   paths plus its owned diff as the review scope.

Do not absorb unrelated working-tree changes. If the owned paths or diff cannot be
separated from unrelated dirty changes, pause and ask for a narrower target rather
than guessing. Without a change name, require an explicit PR, branch, or file/diff
target before reviewing unless this conversation just completed
`/sp:apply` for one identifiable change; do not silently treat the whole dirty
working tree as the target. Path handling is platform-neutral: use the paths
returned by Superpowers CLI rather than hardcoded slashes.

### Gather the diff

Run `git diff @{upstream}...HEAD` (or `git diff main...HEAD` /
`git diff HEAD~1` if there's no upstream) to get the unified diff under review.
If there are uncommitted changes, or the range diff is empty, also run
`git diff HEAD` and include only the explicit target or the resolved
change-owned working-tree changes in scope. If a PR number, branch name, or
file path was passed as an argument, review that target instead. Treat this
diff as the review scope.

## Phase 1 — Review (4 shape agents in parallel)

When the host provides an agent-spawning tool, launch **4 independent review
agents** in a single message so they run concurrently. Pass each agent the
diff and one of the four angles below. Each returns findings with `file`,
`line` or symbol, a one-line `summary`, the concrete `cost`, and severity
`P0` / `P1` / `P2`. Do not let fan-out workers assign
`expand-current-change` vs `new-proposal`; that is the summarizing pass.

When an agent-spawning tool is unavailable, work through all four angles in
this same context in one pass — do not skip an angle for lack of fan-out.
State in the final summary that this was a single-pass review, not the four-agent fan-out.

Always run all four angles. If the diff has no evidence for a layer, that
angle is `not applicable` with concrete scope evidence; do not omit the angle.

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

**Severity model (single source).** Superpowers has exactly two grading vocabularies. They answer different questions, so never map one onto the other and never mix their words.

- **Defect severity — `P0`, `P1`, `P2`.** The only scale for grading a finding. Every activity that reports findings uses it: code review, proposal review, Verify, Design verify, and any security review feeding them. `P0` must be repaired before the activity can pass or announce readiness. `P1` is a real defect: repair it in the active round, but it does not by itself demand another round. `P2` is an optional improvement. Do not label findings `CRITICAL`, `HIGH`, `MEDIUM`, `LOW`, `INFO`, `WARNING`, or `SUGGESTION`; report the equivalent `P` level instead.
- **Gate outcome — `passed`, `failed`, `blocked`, or `not applicable`.** These say what happened to a Final Quality Gate, not how bad a finding is. `blocked` means a missing prerequisite or an external decision the worker cannot make: it names the prerequisite, pauses the affected gate immediately, and does not consume a round. A gate outcome is never a priority level, and `blocked` never substitutes for `P0`.

When a finding's severity is uncertain, prefer `P2` over `P1`, and `P1` over `P0`.

Grade every `simplify` and `structural` finding, and each of Surface,
Boundaries, Model, and Composition, on that shared scale:

| Severity | Meaning here |
| --- | --- |
| **`P0`** | Public surface, trust/module boundary, or invalid-state model defect that should not remain the shipped shape |
| **`P1`** | Real shape defect that will cause rework or inconsistent ownership if left |
| **`P2`** | Optional composition or altitude improvement |

An angle's result is the highest-severity finding on that angle, `passed`
when the angle was assessed with no findings, or `not applicable` with
evidence. Shape-review is not a Final Quality Gate: a `P0` does not fail Outcome
or block archive.

Wait for all four agents to complete, dedup findings that point at the same
line or mechanism, and classify each remaining finding as `simplify`,
`structural`, or `skip`.

- `simplify`: behavior-preserving local cleanup. Destination `simplify`.
  Do not apply it here; route to `/sp:simplify`.
- `structural`: would change a public surface, data contract, module
  boundary, type/state model, or composition seam. The summarizing pass, not
  fan-out workers, assigns destination from **this conversation** using the
  session rule.
- `skip`: false positive, lacks evidence, or requires changes well outside
  the reviewed diff. Destination `skip`. Note the skip rather than arguing.

Session rule (same-session wins; slash-after-apply remaining same-session):

- Same-session after apply when this conversation contains an apply completion
  for change N, applicable final quality gates passed, and the user then asks
  to run shape-review or accepts the invitation, including
  `/sp:shape-review`, `/sp:shape-review N`, or natural language. N must still
  be an active change directory.
- New session when this conversation has no apply-completion evidence for N.
- Conflict: if both appear to match, same-session wins. "Fresh request" means
  this conversation lacks apply-completion evidence, not that the user typed
  the slash command.
- fail-closed: uncertain membership → treat as new session / `new-proposal`.

When the user accepts `structural` suggestions:

- Same-session: expand the current change in place; withdraw archive until
  expanded work and applicable gates complete again. If specs or design
  changed, run `/sp:review` before implementing the expansion.
- New session: create a new change with the prior change as prerequisite; do
  not edit the prior artifacts.

Do not apply structural edits during this review pass.

## Output format

End with this compact report:

```
## Shape Review Result
Outcome: passed | failed | blocked
Scope: <change name and owned paths, or explicit target>
Review mode: four-agent fan-out | single-pass fallback
Session routing: same-session apply-after | new-session | not accepting
Angles: Surface=<P0|P1|P2|passed|n/a+evidence> | Boundaries=<...> | Model=<...> | Composition=<...>
Suggestions: <angle, P0|P1|P2, file:line or symbol, summary, cost, classification, destination>
Skipped: <finding and reason, or none>
Evidence: <diff/review inputs>
```

Use `blocked` only when the requested scope cannot safely be resolved or an
explicit target is missing. Use `failed` only when the review process itself
cannot complete after the scope is resolved. Do not use `failed` because
`P0` findings or structural suggestions exist. `passed` means the review
completed and reported, including when it produced `P0` or structural
suggestions; it does not block archive by itself. `not applicable` is a
per-angle result with scope evidence, not the default whole-review outcome.

