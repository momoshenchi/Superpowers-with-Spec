---
name: /sp-apply
id: sp-apply
category: Workflow
description: Implement tasks from an Superpowers change
---

Implement tasks from an Superpowers change.

**Input**: Optionally specify a change name (e.g., `/sp:apply add-auth`). If omitted, check if it can be inferred from conversation context. If vague or ambiguous you MUST prompt for available changes.

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
   - Context file paths (varies by schema)
   - Attachment file paths in `attachmentFiles` when completed artifacts explicitly reference supported files under `attachments/`
   - Progress (total, complete, remaining)
   - Task list with status
   - Dynamic instruction based on current state

   **Handle states:**
   - If `state: "blocked"` (missing artifacts): show message, suggest using `/sp:continue`
   - If `state: "all_done"`: read `test-plan.md` when present, confirm every concrete Test Hardening row outside `## Final Quality Gates` is complete **and** that the `## Final Quality Gates` record contains fresh integrated outcomes for every gate (each applicable gate passed; every `not applicable` result is justified). If the record is missing, failed, or applicable-blocked, run or resume final quality gates instead of suggesting archive.
   - Otherwise: proceed to implementation

4. **Read context files**

   Read the files listed in `contextFiles` from the apply instructions output.
   Read or inspect files listed in `attachmentFiles` when present. Treat the artifacts in `contextFiles` as the source of normative meaning for each attachment.
   The files depend on the schema being used:
   - **spec-driven**: proposal, specs, design, tasks, execution-plan, test-plan
   - Other schemas: follow the contextFiles from CLI output

5. **Show current progress**

   Display:
   - Schema being used
   - Progress: "N/M tasks complete"
   - Remaining tasks overview
   - Dynamic instruction from CLI

6. **Implement tasks (loop until done or blocked)**

   For each pending task:
   - Show which task is being worked on
   - Make the code changes required
   - Keep changes minimal and focused
   - Mark task complete in the tasks file: `- [ ]` → `- [x]`
   - Continue to next task

   **Pause if:**
   - Task is unclear → ask for clarification
   - Implementation reveals a design issue → suggest updating artifacts
   - Error or blocker encountered → report and wait for guidance
   - User interrupts

7. **Run Test Hardening after implementation tasks are complete**

   For spec-driven changes with `test-plan.md`:
   - Task completion transitions into Test Hardening; it is not apply completion by itself.
   - Read `test-plan.md` and treat Test Hardening as complete only when every concrete testing/hardening status row outside `## Final Quality Gates` is complete. Final-gate rows are evaluated separately only after Test Hardening.
   - Use complete statuses such as `covered`, `passed`, or `not applicable`; `planned`, `failing`, blank, or placeholder rows keep hardening incomplete.
   - Distinguish worker-level verification in detailed `tasks.md` from post-integration Test Hardening in `test-plan.md`; passing worker-level tests is necessary but not sufficient for final apply completion.
   - Analyze which earlier tests were insufficient or not broad enough, then decide which supplemental tests are needed.
   - Add feasible missing tests for boundary cases, abnormal/error cases, non-critical paths, empty/missing/invalid states, permission/ownership failures, repeated actions, integration points, E2E flows, and cross-platform path behavior where relevant.
   - Record which tests this stage added or strengthened and any justified deferrals in `test-plan.md`.
   - Failing hardening tests or unresolved product defects block apply completion; fix them and rerun verification, or pause as blocked with the failing command, failure summary, affected files, and recommended next action.
   - Mark the relevant table rows complete only after evidence exists and no hardening failures or unresolved defects remain.


**Canonical non-visual test-suite preflight (Test Hardening)**

- Discover the complete canonical non-visual suite from repository test scripts, CI configuration, testing documentation, and the active `test-plan.md`.
- Record every selected command, its source of authority, and explicitly visual-only checks excluded. A convenient or partial test script is not full validation without repository evidence.
- Run every selected command and record fresh results. If the suite is ambiguous, unavailable, cannot run, or fails, report `blocked` or `failed`; do not complete Test Hardening or continue to E2E.


8. **Run final quality gates**


## Final Quality Gates

After Test Hardening is complete, run these gates in exactly this order. **Delegate each gate to one fresh, distinct subagent through the host's agent-spawning or delegation mechanism.** Do not reuse a gate worker, perform a gate in the coordinator context, or start a later gate before the current worker has completed and its result is integrated. Give every worker the change name, scoped owned diff/paths, relevant context artifacts, and fresh earlier-gate/Test Hardening evidence. Require a structured report with its outcome (`passed`, `failed`, `blocked`, or `not applicable`), commands/runtime evidence, files/routes/states reviewed, findings and resolution, every `not applicable` reason, and whether it changed implementation.

**Severity, availability, and round rules:** `P0` is equivalent to Verify's `CRITICAL` severity. `P1` and `P2` are non-P0 findings: record and repair every resolvable one in the active round, but they do not by themselves request another round. `BLOCKER` is not a priority level: it means a missing prerequisite or external decision, immediately pauses the affected gate, and does not consume a round. A **round** is one fresh delegated worker's complete execution plus its integrated, numbered report. Preserve the report and remediation/validation evidence for every round in `test-plan.md`.

If the host cannot launch a subagent, mark the applicable final-quality stage `blocked`, name the missing host capability, and pause; do not silently substitute a same-context review. In a host where workers are isolated from the coordinator workspace, obtain and apply or merge the worker's concrete patch or resolution before counting that gate as integrated.

1. **Host-native code review (rounds 1–4).** Delegate a fresh code-review worker to request or run the host's native code-review capability. If no named capability is discoverable, that worker performs and labels an equivalent independent final review of the integrated diff, requirement mapping, regressions, and validation evidence. Never silently skip this gate and never generate a Superpowers `code-review` workflow. In every round, repair all resolvable findings and run relevant validation before reporting. If the report has no P0, this gate passes and continues to Simplify; P1/P2-only findings do not require a second review. If a round reports a P0, repair it and start the next fresh code-review round. If round four still reports a P0, report this gate `failed`; do not start a fifth review or recommend archive.
2. **Simplify (one pass, then Verify).** Delegate a fresh simplify worker to execute the `/sp:simplify` contract. Its internal four-angle fan-out remains permitted. Apply only behavior-preserving cleanup: reuse existing helpers, remove dead/duplicate code or unnecessary abstraction, improve local clarity, or make demonstrable efficiency improvements. Do not change requirements, public contracts, error behavior, or user-visible behavior. After every edit, run fresh affected verification. Repair or revert an uncertain or failing cleanup. A safely completed Simplify result, including a repaired cleanup, transitions directly to Verify round one; it does not start a Simplify retry loop or restart code review. A `blocked` or unresolvable `failed` Simplify result pauses apply.
3. **Verify (rounds 1–4).** Delegate a fresh verify worker to run the canonical non-visual test-suite preflight again, then verify requirements and scenarios. For each changed runnable user/browser journey, exercise its normal entry point with repository E2E automation or an agent-controlled browser, verify an observable success outcome plus an applicable risk path, and inspect relevant console and failed-network signals. Source inspection, screenshots, and unaided human checks are not E2E proof. The first Verify worker after Simplify is round one. For each repairable failed verification, applicable E2E failure, or P0/`CRITICAL` finding, repair the issue and run the next fresh Verify round, including the full canonical preflight and applicable E2E again. A `BLOCKER` pauses immediately. If round four still fails, report Verify `failed`; do not start round five or recommend archive.
4. **Design verify (rounds 1–4).** Delegate a fresh design-verification worker to discover repository visual `DESIGN.md`/`design.md` (not the change-local design artifact) for UI scope, inspect the running UI route, interaction and applicable responsive/state variants, and cite each applicable rule. A non-UI change is `not applicable` with scope evidence. Missing runtime prerequisites are `blocked`; for UI scope, no visual design source is also `blocked` because formal conformance is unassessable and cannot pass. For a repairable visual nonconformance, repair it and run the next fresh, numbered design-verification round with new rule and runtime evidence. Retry only Design verify: do not restart earlier gates solely for that retry. A `BLOCKER` pauses immediately. If round four still fails, report Design verify `failed`; do not start round five or recommend archive.

Await and integrate each worker sequentially before spawning the next, and record each numbered report in a `## Final Quality Gates` section of `test-plan.md`: round, fresh-worker identity, outcome (`passed`, `failed`, `blocked`, or `not applicable`), commands/runtime evidence, affected files/routes, findings and resolution, remediation/validation evidence, and every justified `not applicable` reason.

Repairs stay at the earliest affected verification boundary described above: code-review P0 returns to code review, Simplify hands off to Verify, Verify returns to Verify, and Design verify returns to Design verify. Rerun relevant verification after every repair and retain its evidence, but do not impose a global restart from code review. A `failed` or applicable `blocked` gate prevents archive recommendation.


9. **On completion or pause, show status**

   Display:
   - Tasks completed this session
   - Overall progress: "N/M tasks complete"
   - Test Hardening status separately from implementation progress
   - If all tasks, Test Hardening, and every applicable final quality gate are done: show the four-gate outcome/evidence summary below, then suggest archive
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
| Host-native code review | passed / failed / blocked / not applicable | <worker report and findings resolution> |
| `/sp:simplify` | passed / failed / blocked / not applicable | <worker report and cleanup/skip summary> |
| `/sp:verify` | passed / failed / blocked / not applicable | <worker report, canonical suite, E2E disposition> |
| `/sp:design-verify` | passed / failed / blocked / not applicable | <worker report, UI/DESIGN.md disposition> |

Implementation, Test Hardening, and every applicable final quality gate are complete. You can archive this change with `/sp:archive`.
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
- Update task checkbox immediately after completing each task
- Treat execution-plan.md as implementation context and tasks.md as the progress-tracking checklist.
- Treat `tasks.md` completion as the transition into Test Hardening when `test-plan.md` exists.
- Treat Test Hardening as incomplete while any concrete testing/hardening status row outside `## Final Quality Gates` is `planned`, `failing`, blank, or still a placeholder.
- Analyze earlier testing gaps before checking hardening complete; ignore clearly unrelated changes and pause on ambiguous unrelated changes.
- Do not complete apply while hardening tests fail or product defects remain unresolved.
- Do not recommend archive while a final quality gate is failed or an applicable gate is blocked.
- Pause on errors, blockers, or unclear requirements - don't guess
- Use contextFiles and attachmentFiles from CLI output, don't assume specific file names
- Do not automatically repeat proposal review before starting. The normal `/sp:propose` path performs it after creating all required artifacts; users may invoke `/sp:review <change>` voluntarily.
- Keep the final integration review separate: after dispatch units integrate, review cross-unit behavior, the integrated diff, code quality, and full validation before completion.

**Fluid Workflow Integration**

This skill supports the "actions on a change" model:

- **Can be invoked anytime**: Before all artifacts are done (if tasks exist), after partial implementation, interleaved with other actions
- **Allows artifact updates**: If implementation reveals design issues, suggest updating artifacts - not phase-locked, work fluidly
