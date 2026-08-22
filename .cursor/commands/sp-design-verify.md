---
name: /sp-design-verify
id: sp-design-verify
category: Workflow
description: Verify runtime UI conformance for a Superpowers change
---

Verify an active Superpowers change's runtime UI with `/sp:design-verify` against the repository visual design source.

**Input:** Optional change name. Load its status, apply instructions, context artifacts, and implementation diff before deciding scope.

**Repair ownership:** The Design Verify worker is read-only by default. Report rule-cited findings before any implementation changes, including the affected route/state, runtime evidence, governing rule, implementation location, and specific remediation. The coordinator evaluates and repairs accepted UI findings, then runs targeted validation. A host-native workflow may authorize worker self-repair only when that authorization is explicit. If a finding or intended visual result is ambiguous, investigate or clarify before editing rather than changing the UI merely to make the report pass.

## Execution

1. **Establish scope.** Inspect the change artifacts and implementation diff to decide whether it affects a user-facing UI: a rendered route, component, interaction, or responsive/state behavior. If it does not, stop and report `not applicable` with concrete diff/artifact evidence; this is not a visual pass.
2. **Find the visual source.** For UI scope, discover repository visual `DESIGN.md` or `design.md` in the repository root, `docs/`, or relevant project context. Distinguish it from change-local `design.md`, and identify the rules that apply to each affected route or state.
3. **Prepare runtime inspection.** Start or use the documented application runtime and available browser automation or agent-controlled browser. If runtime, credentials, dependencies, or browser capability are missing, stop and report `blocked` with the missing prerequisite. Source inspection alone cannot pass.
4. **Inspect affected UI.** Exercise each affected route, changed interaction, and applicable responsive/state variant. Compare rendered output against explicit tokens, component rules, Do's/Don'ts, and accessibility/responsive rules. Capture inspectable runtime evidence and cite the precise rule for every finding.
5. **Capture After and consume Before.** For UI scope, write After screenshots with `path.join(changeDir, 'attachments', 'visual-diff', 'after', fileName)` so Markdown targets begin `attachments/visual-diff/after/`. Discover runtime Before under `attachments/visual-diff/before/` and illustrative Before from artifact-explained current-product images that name source, route or state, and that the file is illustrative (unexplained images are not Before). Present a visual-diff table with one row per route or state. Default comparison is `runtime` when both kinds exist unless an artifact names illustrative as source of truth; show illustrative as supplemental. If Before is missing for a row, record `Before: missing` or `route did not exist` and still capture After (After-only). **Before summary:** `present | mixed | missing | not applicable`. Missing Before does not fail or block. Do not reconstruct Before with a second git worktree or `git checkout` of merge-base. Before/After images never substitute for Manual Coverage. Missing runtime or repository visual `DESIGN.md` still `blocked`.
6. **Handle a missing visual source.** If UI scope has no repository visual design source, report `blocked`: formal conformance is unassessable without the governing rules. Compare relevant existing components or CSS patterns when possible, but never claim a formal pass or proceed to archive until a visual source is supplied or the UI scope is removed.
7. **Classify and report.** Report `passed`, `failed`, `blocked`, or `not applicable` separately from functional verification. A `passed` result requires a discovered visual source and identifies assessed rules and deliberately unassessed areas; `failed` identifies every nonconformance; `blocked` names the prerequisite; and `not applicable` includes scope evidence.

## Apply final-quality retries

**Severity model (single source).** Superpowers has exactly two grading vocabularies. They answer different questions, so never map one onto the other and never mix their words.

- **Defect severity — `P0`, `P1`, `P2`.** The only scale for grading a finding. Every activity that reports findings uses it: code review, proposal review, Verify, Design verify, and any security review feeding them. `P0` must be repaired before the activity can pass or announce readiness. `P1` is a real defect: repair it in the active round, but it does not by itself demand another round. `P2` is an optional improvement. Do not label findings `CRITICAL`, `HIGH`, `MEDIUM`, `LOW`, `INFO`, `WARNING`, or `SUGGESTION`; report the equivalent `P` level instead.
- **Gate outcome — `passed`, `failed`, `blocked`, or `not applicable`.** These say what happened to a Final Quality Gate, not how bad a finding is. `blocked` means a missing prerequisite or an external decision the worker cannot make: it names the prerequisite, pauses the affected gate immediately, and does not consume a round. A gate outcome is never a priority level, and `blocked` never substitutes for `P0`.

When a finding's severity is uncertain, prefer `P2` over `P1`, and `P1` over `P0`.

When Design verify is delegated by `/sp:apply`, number every attempt
`Design verify round 1` through `Design verify round 4`; each attempt uses
a fresh subagent and retains distinct route, rule, and runtime evidence. Before
round four, when the coordinator repairs an accepted visual nonconformance,
retry **only** Design
verify with a fresh worker. Do not restart code review, Simplify, or Verify
solely because of a design-verification retry. A missing runtime, credential,
browser capability, visual design source, or external decision is `blocked`:
report it, name the prerequisite, pause immediately, and do not consume
an attempt. If round four still reports a visual nonconformance, report
`failed`; do not start a fifth attempt or recommend archive. A scope-backed
non-UI `not applicable` result is not a retry and remains non-blocking.

## Output format

```markdown
## Design Verification: <change-name>

**Outcome:** passed | failed | blocked | not applicable
**Design verify round:** <1-4 when delegated by apply, otherwise standalone>
**Fresh worker:** <identity when delegated by apply, otherwise standalone>
**UI scope:** <affected routes/states, or concrete non-UI evidence>
**Visual source:** <DESIGN.md path and applicable rules | not found>
**Runtime evidence:** <commands, browser routes/states, screenshots/logs, or blocking prerequisite>
**Before summary:** present | mixed | missing | not applicable
**Repair ownership:** <findings reported without edits by default; coordinator remediation and targeted-validation evidence when applicable>

| Route / state | Before kind | Before | After | Default comparison |
| --- | --- | --- | --- | --- |
| <route/state> | runtime \| illustrative \| missing \| route did not exist | <markdown target or —> | <markdown target or not captured> | runtime \| illustrative \| After-only |

| Route / state | Rule | Evidence | Implementation location | Outcome / remediation |
| --- | --- | --- | --- | --- |
| <route/state> | <quoted rule or pattern> | <inspectable evidence> | <file:line> | <pass, failure and specific fix, or not assessed> |

**Deliberately unassessed:** <none or reason>
```
