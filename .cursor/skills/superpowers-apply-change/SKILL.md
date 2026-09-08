---
name: superpowers-apply-change
description: Implement tasks from an Superpowers change. Use when the user wants to start implementing, continue implementation, or work through tasks.
license: MIT
compatibility: Requires superpowers CLI.
metadata:
  author: superpowers
  version: "1.0"
  generatedBy: "1.0.11"
---

Implement tasks from an Superpowers change.

**Input**: Optionally specify a change name. If omitted, check if it can be inferred from conversation context. If vague or ambiguous you MUST prompt for available changes.

**Steps**

1. **Select the change**

   If a name is provided, use it. Otherwise:
   - Infer from conversation context if the user mentioned a change
   - Auto-select if only one active change exists
   - If ambiguous, run `superpowers list --json` to get available changes and use the **AskUserQuestion tool** to let the user select

   Always announce: "Using change: <name>" and how to override (e.g., `/sp:apply <other>`).

2. **Check status to understand the schema**
   ```bash
   superpowers status --change "<name>" --json
   ```
   Parse the JSON to understand:
   - `schemaName`: The workflow being used (e.g., "spec-driven")
   - Which artifact contains the tasks (typically "tasks" for spec-driven, check status for others)

3. **Get apply instructions**

   ```bash
   superpowers instructions apply --change "<name>" --json
   ```

   This returns:
   - Context file paths (varies by schema - for spec-driven this includes proposal, specs, design, tasks, execution-plan, and test-plan when present)
   - Attachment file paths in `attachmentFiles` when completed artifacts explicitly reference supported files under `attachments/`
   - Progress (total, complete, remaining)
   - Task list with status
   - Dynamic instruction based on current state
   - For spec-driven changes, `tasks.md` is the detailed progress checklist, `execution-plan.md` contains dispatch-unit coordination plus Step 1–5 execution guidance for each detailed task and final validation, and `test-plan.md` is the coverage draft plus Test Hardening record.

   **Handle states:**
   - If `state: "blocked"` (missing artifacts): show message, suggest using superpowers-continue-change
   - If `state: "all_done"`: read `test-plan.md` when present, confirm every concrete Test Hardening row outside `## Final Quality Gates` is complete **and** that the `## Final Quality Gates` record contains fresh integrated outcomes for every gate (each applicable gate passed; every `not applicable` result is justified). If the record is missing, failed, or applicable-blocked, run or resume final quality gates instead of suggesting archive.
   - Otherwise: proceed to implementation

4. **Read context files**

   Read the files listed in `contextFiles` from the apply instructions output.
   Read or inspect files listed in `attachmentFiles` when present. Treat the artifacts in `contextFiles` as the source of normative meaning for each attachment.
   The files depend on the schema being used:
   - **spec-driven**: proposal, specs, design, tasks, execution-plan, test-plan
   - Other schemas: follow the contextFiles from CLI output
   - When `execution-plan.md` contains `Implementation Notes`, read them as non-normative context for the relevant task. They preserve findings and reasoning, but do not define progress or completion.

5. **Show current progress**

   Display:
   - Schema being used
   - Progress: "N/M tasks complete"
   - Remaining tasks overview
   - Dynamic instruction from CLI

6. **Runtime Before capture (predicted UI only).** Before the first implementation edit, decide whether the capture window is `open`. It is `open` only when all of: predicted UI scope; this invocation has not edited implementation yet; **UI-baseline evidence** holds. Predicted UI: a completed context artifact describes a rendered route, component, or responsive/state UI, or an owned path ends with one of `.html`, `.css`, `.scss`, `.sass`, `.less`, `.vue`, `.svelte`, `.jsx`, `.tsx` (explicit suffix list lookup, not regex). UI-baseline evidence: the union of `git diff --name-only <merge-base> HEAD`, `git diff --name-only`, and `git diff --name-only --cached` contains **no paths at all**, and `git status --porcelain` is empty. Any dirty or committed implementation change closes the window, including template/non-suffix UI, so a resumed After is never stored as runtime Before. Reusing an existing worktree defaults to `closed` unless that evidence holds. If this invocation created the worktree and evidence holds, the window is `open`. If merge-base cannot be determined or those commands cannot be run, the window is `closed` (fail-closed). Non-UI predicted scope skips Before capture.

When `open`, start or use the documented application runtime and available browser. Capture each predicted route/state: the union of routes named in design, proposal, specs, and test-plan Manual Coverage; if none are named, capture the smallest documented app entry route once and record that limitation. Write files with `path.join(changeDir, 'attachments', 'visual-diff', 'before', fileName)` so Markdown targets begin `attachments/visual-diff/before/`. Label them Before kind `runtime`. Do not overwrite existing files in that directory. If runtime, credentials, or browser are missing, continue implementation and do not block apply. Do not reconstruct Before with a second git worktree or `git checkout` of merge-base.

Explained current-product images under `attachments/` are Before kind `illustrative` only when the referencing artifact names source, route or state, and that the file is illustrative. Unexplained images are not Before.

7. **Implement tasks (loop until done or blocked)**

   In most cases, test-driven development should be used. Please refer to the `test-driven-development` skill.
   After the focused RED/GREEN test for the current task, run Git-related tests rather than the full suite when the test runner supports Git-aware selection. Do not require the complete canonical suite at task level.

   For each pending task:
   - Show which task is being worked on
   - Follow the task's planned Step 1–5 sequence and append concise `Implementation Notes` after a step when it produces a useful finding, reasoning point, viewpoint / trade-off, or summary / takeaway. Notes are narrative context, not status fields or a second checklist.
   - Mark task complete in the tasks file: `- [ ]` → `- [x]`
   - Continue to next task
   - Do not stop after a fixed batch size unless a blocker, ambiguity, or user interruption appears.
   - Keep switching directly to the next pending task so the run stays continuous.

   **Pause if:**
   - Task is unclear → ask for clarification
   - Implementation reveals a design issue → suggest updating artifacts
   - Error or blocker encountered → report and wait for guidance
   - User interrupts

8. **Run Test Hardening after implementation tasks are complete**

   For spec-driven changes with `test-plan.md`:
   - Task completion transitions into Test Hardening; it is not apply completion by itself.
   - Read `test-plan.md` and treat Test Hardening as complete only when every concrete testing/hardening status row outside `## Final Quality Gates` is complete. Final-gate rows are evaluated separately only after Test Hardening.
   - Write statuses as `planned`, `passed`, `failed`, `blocked`, or `not applicable`. Complete rows are `passed` or scope-backed `not applicable`; `planned`, `failed`, `blocked`, blank, or placeholder rows keep hardening incomplete. Do not write legacy aliases such as `covered` or `failing` in new rows (readers may still accept them on older plans).
   - When adding or expanding rows, keep case IDs as `TC-R<object>-D<dimension>-<seq>` and Manual IDs as `MC-R<object>-<seq>` (or `MC-<seq>`); dimension summary Status uses `planned` / `passed` / `not applicable`. Details stay in the test-plan template and `full-qa-test` skill.
   - Distinguish worker-level verification in detailed `tasks.md` from post-integration Test Hardening in `test-plan.md`; passing worker-level tests is necessary but not sufficient for final apply completion.
   - Analyze which earlier tests were insufficient or not broad enough, then decide which supplemental tests are needed. If the full-qa-test skill exists, invoke it and add comprehensive tests according to its rules. Run mutation testing only after every planned `unit` case is executable and green; record results in `## Mutation Testing`.
   - If the full-qa-test skill is unavailable, add comprehensive tests for all requirements. Coverage must include: requirements and business scenarios; code and branch coverage; data and input-space coverage; state transitions and timing; non-functional and error-prevention coverage; and environment and context dependencies. For each of these 6 dimensions, first write **10** test cases; if after deduplication this batch still contains logically non-duplicate valid cases, write another **10**; continue this way up to a maximum of **30 cases per object per dimension**.
   - Record which tests this stage added or strengthened and any justified deferrals in `test-plan.md`.
   - Failing hardening tests or unresolved product defects block apply completion; fix them and rerun verification, or pause as blocked with the failing command, failure summary, affected files, and recommended next action.
   - Mark the relevant table rows complete only after evidence exists and no hardening failures or unresolved defects remain.


    **Canonical non-visual test-suite preflight (Test Hardening)**

    - Discover the project's canonical non-visual test runner from repository test scripts, CI configuration, testing documentation, and the active `test-plan.md`. Record explicitly visual-only checks excluded. A convenient or guessed command is not validation without repository evidence.
    - Prefer Git-related tests when the runner itself supports Git-aware selection. Detect that capability from the lockfile, runner config, or runner help — for example Vitest `--changed`, Jest `--changedSince` / `--onlyChanged`, or pytest-picked. The project's package script does not need to already mention those flags.
    - Git baseline: prefer files changed since the current branch's merge-base with the default branch (for example `vitest run --changed origin/main`). If merge-base cannot be determined, use the runner's default working-tree-versus-HEAD mode. If the runner does not support Git-aware selection, the Git baseline remains unclear, related selection is empty or ambiguous, or the related command cannot be confirmed, fail-closed and run the complete canonical non-visual suite.
    - Record the exact selected command, runner-capability evidence, Git baseline used, and whether fallback to the complete suite occurred.
    - Run the selected command and record fresh results. Empty related selection is not a pass. If the selected command fails, cannot run, or the suite cannot be determined, report `blocked` or `failed`; do not complete Test Hardening or continue to Manual Coverage.



    **Manual Coverage execution (Test Hardening)**

    - Read the active `test-plan.md` `## Manual Coverage` table separately from `## Deferred Coverage`. A Manual Coverage row is an executable check. Deferred Coverage is not execution evidence and must not be reported as passed or run.
    - After the canonical non-visual preflight, execute every applicable Manual Coverage row except `agent-browser` rows through its stated normal entry point, method, and safe environment. Record the performed steps, method/environment, actions, observed outcome, and inspectable evidence in the row or report.
- Do not execute `agent-browser` rows during Test Hardening; leave them `planned` with evidence noting deferral to Verify. Those deferred rows do not block Test Hardening completion and must not be moved into Deferred Coverage.
- Treat every other concrete Manual Coverage status row as required coverage for Test Hardening. Classify each executed row as `passed`, `failed`, `blocked`, or scope-backed `not applicable`. An unexecuted, blank, `planned`, or placeholder non-`agent-browser` row is incomplete. Any unexecuted, failed, or blocked applicable non-`agent-browser` manual row prevents Test Hardening from passing; name remediation or the missing prerequisite rather than guessing.
    - Do not move a required manual row into Deferred Coverage merely to avoid execution. Use `not applicable` only with concrete scope evidence and use Deferred Coverage only for intentionally postponed work with a specific reason and safer follow-up.
    - Treat browser and other runnable end-to-end journeys as Manual Coverage methods, not as a separate Verify gate. Declare the method in the row's Execution Method and Environment field.
    - Distinguish two browser-control modes and record which one each row uses:
      - `programmatic-browser`: repository E2E runners such as Playwright/Cypress — faster, scripted, CI-friendly; evidence is command output, assertions, traces, and useful screenshots.
      - `agent-browser`: agent-controlled real UI — slower, human-like clicks/keyboard/navigation; evidence is route/URL transitions, DOM or pane dumps, step actions, screenshots, and relevant console/failed-network signals. An API call or curl request is not a substitute for either interactive browser mode. Reserve `agent-browser` execution for Verify rather than Test Hardening.
    - Method selection: honor an explicit method declared in the Manual Coverage row. When undeclared, apply risk layering — prefer `programmatic-browser` for low-risk/happy paths when a stable script exists; require `agent-browser` for high-risk, interaction-heavy, permission, destructive, or state-transition paths. A change's Critical Path may require both modes; overlapping coverage of the same path is allowed and both rows must pass.
    - Any `agent-browser` execution for a change that has a Critical Path MUST exercise that Critical Path; running only peripheral journeys does not satisfy agent-browser coverage.
    - Drive destructive flows only against a documented safe target, fixture, dry run, or disposable environment. If none exists, report the affected row as `blocked` rather than risking real data or systems. Memory alone is not evidence. Source inspection, screenshots, and unaided human checks never substitute for executing an applicable Manual Coverage row.

9. **Run final quality gates**


## Final Quality Gates

After Test Hardening is complete, run these gates in exactly this order. **Delegate each gate to one fresh, distinct subagent through the host's agent-spawning or delegation mechanism.** Do not reuse a gate worker, perform a gate in the coordinator context, or start a later gate before the current worker has completed and its result is integrated. Give every worker the change name, scoped owned diff/paths, relevant context artifacts, and fresh earlier-gate/Test Hardening evidence. Require a structured report with its outcome (`passed`, `failed`, `blocked`, or `not applicable`), commands/runtime evidence, files/routes/states reviewed, findings and resolution, every `not applicable` reason, and whether it changed implementation.

**These gates do not depend on installed workflows.** Each numbered gate below is a complete, runnable contract on its own. Where a gate names a standalone workflow (`/sp:simplify`, `/sp:verify`, `/sp:design-verify`), the worker follows that workflow when it is discoverable and otherwise executes the gate paragraph below exactly as written. Never skip a gate, downgrade it, or mark it `not applicable` because its standalone workflow was not selected in the active profile; `not applicable` always requires concrete scope evidence.

**Severity model (single source).** Superpowers has exactly two grading vocabularies. They answer different questions, so never map one onto the other and never mix their words.

- **Defect severity — `P0`, `P1`, `P2`.** The only scale for grading a finding. Every activity that reports findings uses it: code review, proposal review, Verify, Design verify, and any security review feeding them. `P0` must be repaired before the activity can pass or announce readiness. `P1` is a real defect: repair it in the active round, but it does not by itself demand another round. `P2` is an optional improvement. Do not label findings `CRITICAL`, `HIGH`, `MEDIUM`, `LOW`, `INFO`, `WARNING`, or `SUGGESTION`; report the equivalent `P` level instead.
- **Gate outcome — `passed`, `failed`, `blocked`, or `not applicable`.** These say what happened to a Final Quality Gate, not how bad a finding is. `blocked` means a missing prerequisite or an external decision the worker cannot make: it names the prerequisite, pauses the affected gate immediately, and does not consume a round. A gate outcome is never a priority level, and `blocked` never substitutes for `P0`.

When a finding's severity is uncertain, prefer `P2` over `P1`, and `P1` over `P0`.

**Round rules:** `P1` and `P2` are non-P0 findings: record and repair every resolvable one in the active round, but they do not by themselves request another round. A **round** is one fresh delegated worker's complete execution plus its integrated, numbered report. Preserve the report and remediation/validation evidence for every round in `test-plan.md`.

**Repair ownership:** Code review, Verify, and Design Verify workers are read-only by default: each worker reports evidence-backed findings and readiness before implementation changes. The coordinator evaluates and repairs accepted findings, then runs targeted validation and starts the gate's next fresh round when its retry rule requires one. A host-native worker may self-repair only when that capability is explicitly available and the active workflow explicitly authorizes it. Simplify is the only gate authorized to edit by default, and only within its behavior-preserving cleanup boundary.

**Remediations (`remediations.md`):** Before editing implementation for an accepted **code review** or **Verify** finding with severity **P0 or P1**, the coordinator MUST create or append `superpowers/changes/<name>/remediations.md` (copy `schemas/spec-driven/templates/remediations.md` when creating). Probe that change-directory path; do **not** rely on schema `contextFiles` / artifact-graph membership. Each entry MUST include Finding (gate/round, severity, summary), Root cause, **≥2 meaningfully different Solutions**, **Choice**, **Rationale**, Fix, Guard, Evidence, and Status. P0 MUST NOT be marked `resolved` without a Guard (failing-then-passing test and/or invariant `I#`). An entry with Status `open` MUST NOT be treated as closing that finding for gate success. Design Verify-only findings, **P2**-only findings, and Simplify-only cleanups do **not** by themselves require remediations entries. If the change never accepts any code-review/Verify P0/P1 repairs, omit `remediations.md` or write exactly `N/A — no accepted P0/P1 repairs`. Final Quality Gates table rows MAY cite `Remediation: RM#`; long-form solution comparison lives in `remediations.md`. Clone/duplicate solutions that differ only by wording are incomplete. When `remediations.md` exists, **code review** and **Verify** workers MUST probe the change-directory path and read it as repair context (including retry rounds), even if it is absent from `contextFiles`.

If the host cannot launch a subagent, mark the applicable final-quality stage `blocked`, name the missing host capability, and pause; do not silently substitute a same-context review. In a host where workers are isolated from the coordinator workspace, integrate the worker's report before coordinator repair; merge a worker patch only for Simplify or another explicitly authorized self-repair before counting that gate as integrated.

1. **code review (rounds 1–4).** Delegate a fresh code-review worker to request or run the code-review skill. If no named skill is discoverable, that worker performs and labels an equivalent independent final review of the integrated diff, requirement mapping, regressions, and validation evidence. Never silently skip this gate and never generate a Superpowers `code-review` workflow. In every round, the worker reports first; the coordinator repairs every accepted resolvable P1/P2 finding in that active round, repairs every accepted resolvable P0 finding before retrying, and runs relevant validation. If the integrated report has no P0, this gate passes and continues to Simplify after those repairs; P1/P2-only findings do not require a second review. If a round reports a P0, the coordinator repairs it and starts the next fresh code-review round. If round four still reports a P0, report this gate `failed`; do not start a fifth review or recommend archive.
2. **Simplify (one pass, then Verify).** Delegate a fresh simplify worker to execute the `/sp:simplify` contract. Its internal four-angle fan-out remains permitted. The four angles are **reuse** (new code re-implementing an existing helper), **simplification** (redundant or derivable state, copy-paste variation, deep nesting, leftover dead code), **efficiency** (redundant computation, repeated I/O, needlessly sequential independent work, long-lived closures retaining large scopes), and **altitude** (special cases layered on shared infrastructure where the underlying mechanism should be generalized instead). Cover all four angles even when no fan-out is available, and say which mode was used. The worker may apply only behavior-preserving cleanup: reuse existing helpers, remove dead/duplicate code or unnecessary abstraction, improve local clarity, or make demonstrable efficiency improvements. Do not change requirements, public contracts, error behavior, or user-visible behavior. After every edit, run fresh affected verification. Repair, revert, or skip an uncertain or failing cleanup. A safely completed Simplify result, including a repaired cleanup, transitions directly to Verify round one; it does not start a Simplify retry loop or restart code review. A `blocked` or unresolvable `failed` Simplify result pauses apply.
3. **Verify (rounds 1–4).** Delegate a fresh, read-only-by-default verify worker. **Adversarial hunt intent:** Hunt for as many real issues as possible. Assume remaining gaps, spec or design divergences, missing coverage, and failed journeys exist until evidence proves otherwise. Continue after the first finding. Report every reproducible, actionable issue with file/line or runtime evidence. Do not invent findings. Severity calibration is unchanged and follows the shared severity model. The worker runs the canonical non-visual test-suite preflight again, then verifies requirements and scenarios and executes every applicable `## Manual Coverage` row with evidence-backed findings, including `agent-browser` rows deferred from Test Hardening. Assess three dimensions: **completeness** (tasks and requirements actually implemented, judged from the code rather than from checkbox state), **correctness** (requirements and scenarios behave as specified, proven by the canonical suite and Manual Coverage), and **coherence** (the implementation follows the recorded design decisions and stated invariants). Browser and other runnable end-to-end journeys are Manual Coverage methods (`programmatic-browser` such as Playwright/Cypress, or `agent-browser` human-like control); honor declared methods, apply risk-layering defaults when undeclared, allow Critical Path overlap across both modes, and require any `agent-browser` run to cover the change's Critical Path. Source inspection, screenshots, and unaided human checks are not Manual Coverage proof. The first Verify worker after Simplify is round one. For each accepted repairable failed verification, applicable Manual Coverage failure, or `P0` finding, the coordinator repairs the issue and starts the next fresh Verify round, including the canonical preflight and applicable Manual Coverage again. A missing prerequisite is `blocked` and pauses immediately. If round four still fails, report Verify `failed`; do not start round five or recommend archive.
4. **Design verify (rounds 1–4).** Delegate a fresh, read-only-by-default design-verification worker to discover repository visual `DESIGN.md`/`design.md` (not the change-local design artifact) for UI scope, inspect the running UI route, interaction and applicable responsive/state variants, cite each applicable rule, and report any nonconformance. For UI scope, capture After screenshots under `attachments/visual-diff/after/` with `path.join`, consume runtime Before under `attachments/visual-diff/before/` and illustrative Before only when the referencing artifact names source, route or state, and that the file is illustrative (unexplained images are not Before). Present a per-route visual-diff table. Default comparison is `runtime` when both kinds exist unless an artifact names illustrative as source of truth. Record **Before summary** `present | mixed | missing | not applicable`. If Before is missing record `Before: missing` and capture After-only — do not fail or block for that omission. Do not reconstruct Before with a second git worktree or merge-base checkout. Screenshots never substitute for Manual Coverage. A non-UI change is `not applicable` with scope evidence. Missing runtime prerequisites are `blocked`; for UI scope, no visual design source is also `blocked` because formal conformance is unassessable and cannot pass. For an accepted repairable visual nonconformance, the coordinator repairs it and starts the next fresh, numbered design-verification round with new rule and runtime evidence. Retry only Design verify: do not restart earlier gates solely for that retry. A `blocked` prerequisite pauses immediately. If round four still fails, report Design verify `failed`; do not start round five or recommend archive.

Await and integrate each worker sequentially before spawning the next, and record each numbered report in a `## Final Quality Gates` section of `test-plan.md`: round, fresh-worker identity, outcome (`passed`, `failed`, `blocked`, or `not applicable`), commands/runtime evidence, affected files/routes, findings and resolution, remediation/validation evidence, and every justified `not applicable` reason.

Repairs stay at the earliest affected verification boundary described above: code-review P0 returns to code review, Simplify hands off to Verify, Verify returns to Verify, and Design verify returns to Design verify. Rerun relevant verification after every repair and retain its evidence, but do not impose a global restart from code review. A `failed` or applicable `blocked` gate prevents archive recommendation.


10. **On completion or pause, show status**

   Display:
   - Tasks completed this session
   - Overall progress: "N/M tasks complete"
   - Test Hardening status separately from implementation progress
   - If all tasks, Test Hardening, and every applicable final quality gate are done: show the four-gate outcome/evidence summary below, then suggest archive and optional shape-review
   - If paused: explain why and wait for guidance

**Output During Implementation**

```
## Implementing: <change-name> (schema: <schema-name>)

Working on task 3/7: <task description>
[...implementation happening...]
✓ Task complete

Working on task 4/7: <task description>
[...implementation happening...]
✓ Task complete
```

**Output On Completion**

```
## Implementation Complete

**Change:** <change-name>
**Schema:** <schema-name>
**Progress:** 7/7 tasks complete ✓
**Test Hardening:** complete ✓

### Completed This Session
- [x] Task 1
- [x] Task 2
...

### Test Hardening Summary
- Earlier test gaps: <summary>
- Tests added/strengthened: <summary>
- Verification: <selected checks and outcomes>
- Deferrals: <none or documented reasons>

### Final Quality Gates
| Gate | Outcome | Fresh worker evidence |
| --- | --- | --- |
| code review | passed / failed / blocked / not applicable | <worker report and findings resolution> |
| `/sp:simplify` | passed / failed / blocked / not applicable | <worker report and cleanup/skip summary> |
| `/sp:verify` | passed / failed / blocked / not applicable | <worker report, canonical suite, Manual Coverage disposition> |
| `/sp:design-verify` | passed / failed / blocked / not applicable | <worker report, UI/DESIGN.md disposition> |

Implementation, Test Hardening, and every applicable final quality gate are complete.
You can archive this change with `/sp:archive`.
Optional: review shape with `/sp:shape-review` (does not block archive).
If that command is not installed, say you want a shape review in this conversation.
```

**Output On Pause (Issue Encountered)**

```
## Implementation Paused

**Change:** <change-name>
**Schema:** <schema-name>
**Progress:** 4/7 tasks complete

### Issue Encountered
<description of the issue>

**Options:**
1. <option 1>
2. <option 2>
3. Other approach

What would you like to do?
```

**Guardrails**
- Keep going through tasks until done or blocked
- Always read context files before starting (from the apply instructions output)
- If task is ambiguous, pause and ask before implementing
- If implementation reveals issues, pause and suggest artifact updates
- Keep code changes minimal and scoped to each task
- Before claiming a task is completed, please refer to `verification-before-completion` skill
- Update task checkbox immediately after completing each task
- Treat execution-plan.md as implementation context and tasks.md as the progress-tracking checklist.
- Treat `Implementation Notes` in execution-plan.md as non-normative narrative context. Read them when resuming or reviewing a task, but never infer task status from them or use them instead of verification.
- Keep writes to shared execution-plan.md serialized when dispatch units run in parallel; workers may return notes to the coordinator for append after handoff.
- Treat completion independently: `tasks.md` completion means implementation tasks are done; `test-plan.md` testing/hardening table statuses outside `## Final Quality Gates` mean hardening is done.
- Treat Test Hardening as incomplete while any concrete testing/hardening status row outside `## Final Quality Gates` is `planned`, `failed`, `blocked`, blank, or still a placeholder.
- Analyze earlier testing gaps before checking hardening complete; ignore clearly unrelated changes and pause on ambiguous unrelated changes.
- Do not complete apply while hardening tests fail or product defects remain unresolved.
- Do not recommend archive while a final quality gate is failed or an applicable gate is blocked.
- Pause on errors, blockers, or unclear requirements - don't guess
- Use contextFiles and attachmentFiles from CLI output, don't assume specific file names
- Never start implementation on main/master branch without explicit user consent
- Do not automatically repeat proposal review before starting. The normal `/sp:propose` path performs it after creating all required artifacts; users may invoke `/sp:review <change>` voluntarily.
- Keep the final integration review separate: after dispatch units integrate, review cross-unit behavior, the integrated diff, code quality, and full validation before completion.
- Keep the task loop continuous by default; only pause when blocked, unclear, or explicitly asked to stop

**Fluid Workflow Integration**

This skill supports the "actions on a change" model:

- **Can be invoked anytime**: Before all artifacts are done (if tasks exist), after partial implementation, interleaved with other actions
- **Allows artifact updates**: If implementation reveals design issues, suggest updating artifacts - not phase-locked, work fluidly

## Optional shape-review after apply completion

When implementation, Test Hardening, and every applicable final quality gate
are complete, invite archive and an optional shape review. Do not auto-run
shape-review. Do not add it as a fifth Final Quality Gates row. A `passed`
shape-review does not block archive.

Completion copy:

```
Implementation, Test Hardening, and every applicable final quality gate are complete.
You can archive this change with `/sp:archive`.
Optional: review shape with `/sp:shape-review` (does not block archive).
If that command is not installed, say you want a shape review in this conversation.
```

If apply paused, or an applicable gate is `failed` or `blocked`, do not invite
`/sp:shape-review` and do not recommend archive.

When the user accepts that invitation in this conversation — including by
typing `/sp:shape-review`, `/sp:shape-review <name>`, or saying they want a
shape review — execute the following contract from these apply instructions.
Do not require `superpowers config profile`. Do not skip because the
standalone `shape-review` skill or command is absent. Do not point at
`superpowers-shape-review` or an uninstalled `/sp:shape-review` file.

**Runnable minimum (self-contained in apply):**

1. Resolve scope from the change that just completed apply. Pause if owned
   paths cannot be separated from unrelated dirty changes. Do not scan the
   whole working tree.
2. Always run all four angles by name: Surface, Boundaries, Model,
   Composition. Missing layer evidence is per-angle `not applicable` plus
   evidence. Do not omit an angle.
3. Remain read-only during the review pass. Grade each `simplify` and
   `structural` finding `P0` / `P1` / `P2`. Classify findings
   `simplify`, `structural`, or `skip`. Each angle result is the
   highest-severity finding on that angle, `passed` if none, or
   `not applicable` with evidence. A `P0` does not fail Outcome or block archive.
4. The summarizing pass, not fan-out workers, assigns `structural`
   destination from **this conversation** using the session rule:
   same-session wins; slash-after-apply remaining same-session; fail-closed
   uncertain membership creates a new change (`new-proposal`).
5. Report with:

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

6. If the user accepts `structural` suggestions in this same post-apply
   conversation, expand the current change in place, stop recommending
   `/sp:archive` until the expanded tasks, Test Hardening, and applicable
   final quality gates are complete again, run `/sp:review` before
   implementing spec/design expansion, and re-run final quality gates after
   implementation changes. If this is a new session, create a new change with
   a prerequisite instead of editing the prior artifacts.


