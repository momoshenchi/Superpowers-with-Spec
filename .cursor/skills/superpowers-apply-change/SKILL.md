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

Read later sections on demand from this skill directory. `contextFiles` is the catalog of normative artifacts. Each task reads the current dispatch unit plus the spec and design slices that unit cites.

Stage companions (read when that stage starts, not before the first edit):
- Runtime Before: `reference/runtime-before.md`
- Dispatch units: `reference/dispatch-units.md`
- Test Hardening: `reference/test-hardening.md`
- Final Quality Gates: `reference/final-quality-gates.md`

If a named companion is missing, that stage is `blocked` with the missing path. Tell the user to run `superpowers update` or re-init. Do not skip the stage. Do not inline the missing recipe into this root file.

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
   - If `state: "all_done"`: read `test-plan.md` when present, confirm every concrete Test Hardening row outside `## Final Quality Gates` is complete **and** that the `## Final Quality Gates` record contains fresh integrated outcomes for every gate (each applicable gate passed; every `not applicable` result is justified). If the record is missing, failed, or applicable-blocked, run or resume final quality gates instead of suggesting archive — load `reference/final-quality-gates.md` for the recipe, not this root.
   - Otherwise: proceed to implementation

4. **Read current-unit context**

   Treat `contextFiles` as the catalog of normative artifacts, not a mandatory read-all list. For the current dispatch unit, read that unit's section in `execution-plan.md` / `tasks.md` plus the spec and design slices the unit cites. Do not require reading every listed context file in full before the first edit.
   Read or inspect files listed in `attachmentFiles` when the current unit needs them. Treat the artifacts in `contextFiles` as the source of normative meaning for each attachment.
   The files depend on the schema being used:
   - **spec-driven**: proposal, specs, design, tasks, execution-plan, test-plan
   - Other schemas: follow the contextFiles from CLI output
   - When `execution-plan.md` contains `Implementation Notes`, read them as non-normative context for the relevant task. They preserve findings and reasoning, but do not define progress or completion.
   When executing dispatch units, read `reference/dispatch-units.md`. Hardening still reads `test-plan.md` and `full-qa-test` when that stage starts — load `reference/test-hardening.md` then. Final Quality Gates still run after Hardening — load `reference/final-quality-gates.md` then.

5. **Show current progress**

   Display:
   - Schema being used
   - Progress: "N/M tasks complete"
   - Remaining tasks overview
   - Dynamic instruction from CLI

6. **Runtime Before capture** — predicted UI only. Before the first implementation edit, read `reference/runtime-before.md` and follow it. Skip when scope is not predicted UI.

7. **Implement tasks (loop until done or blocked)**

   For observable automated behavior, write a failing test first, then the minimal code to pass. Skip TDD for copy-only, generated, config, or type-narrowing edits.
   After the focused RED/GREEN test for the current task, run Git-related tests rather than the full suite when the test runner supports Git-aware selection. Do not require the complete canonical suite at task level.

   For each pending task:
   - Show which task is being worked on
   - Follow the task's planned Step 1–5 sequence and append concise `Implementation Notes` after a step when it produces a useful finding, reasoning point, viewpoint / trade-off, or summary / takeaway. Notes are narrative context, not status fields or a second checklist.
   - Mark task complete in the tasks file: `- [ ]` → `- [x]`
   - Continue to next task
   - Do not stop after a fixed batch size unless a blocker, ambiguity, or user interruption appears.
   - Keep switching directly to the next pending task so the run stays continuous.

   **Pause if:**
   - Task is product-ambiguous in a way that would change acceptance, security, billing, or a public contract → ask before implementing
   - Implementation shows recorded design or artifacts cannot be satisfied → pause and propose an artifact update
   - Irreversible Git history rewrite, force push, production, or unrecoverable publish → pause
   - User interrupts

   Continue reversible in-scope repairs from this change. Compile or test errors caused by the current authorized diff are fixed and rechecked without waiting. Do not stop after a batch to ask whether to continue.

8. **Run Test Hardening after implementation tasks are complete** — read `reference/test-hardening.md`. Do not continue from memory of a previous Apply dump.

9. **Run final quality gates** — after Test Hardening is complete, read `reference/final-quality-gates.md`.

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
| `/sp:design-verify` | passed / failed / blocked / not applicable | <worker report, UI/DESIGN.md disposition> |
| `/sp:verify` | passed / failed / blocked / not applicable | <worker report, canonical suite, Manual Coverage disposition> |

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
- Treat `contextFiles` as the catalog; read the current dispatch unit plus cited spec/design slices before editing that unit
- If task is ambiguous, pause and ask before implementing
- Keep code changes minimal and scoped to each task
- Before claiming a task is completed, require a fresh matching-stage evidence run for that task
- Update task checkbox immediately after completing each task
- Treat execution-plan.md as implementation context and tasks.md as the progress-tracking checklist.
- Treat `Implementation Notes` in execution-plan.md as non-normative narrative context. Read them when resuming or reviewing a task, but never infer task status from them or use them instead of verification.
- Keep writes to shared execution-plan.md serialized when dispatch units run in parallel; workers may return notes to the coordinator for append after handoff.
- Treat completion independently: `tasks.md` completion means implementation tasks are done; `test-plan.md` testing/hardening table statuses outside `## Final Quality Gates` mean hardening is done.
- Treat Test Hardening as incomplete while any concrete testing/hardening status row outside `## Final Quality Gates` is `planned`, `failed`, `blocked`, blank, or still a placeholder.
- Analyze earlier testing gaps before checking hardening complete; ignore clearly unrelated changes and pause on ambiguous unrelated changes.
- Do not complete apply while hardening tests fail or product defects remain unresolved.
- Do not recommend archive while a final quality gate is failed or an applicable gate is blocked.
- Pause on product-ambiguous tasks, wrong artifacts, or irreversible Git/production operations - don't guess; continue reversible in-scope repairs without waiting
- Use contextFiles and attachmentFiles from CLI output, don't assume specific file names
- Never start implementation on main/master branch without explicit user consent
- Do not automatically repeat proposal review before starting. The normal `/sp:propose` path performs it after creating all required artifacts; users may invoke `/sp:review <change>` voluntarily.
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
Suggestions: none, or one table row per remaining simplify/structural finding:

| Sev | Angle | Location | Problem | Suggestion |
| --- | --- | --- | --- | --- |
| P0 / P1 / P2 | Surface / Boundaries / Model / Composition | file:line or symbol | one-line problem (why the current shape is wrong) | one-line shape change to make |

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


