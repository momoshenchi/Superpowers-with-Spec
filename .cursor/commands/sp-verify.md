---
name: /sp-verify
id: sp-verify
category: Workflow
description: Verify implementation matches change artifacts before archiving
---

Verify that an implementation matches the change artifacts (specs, tasks, design).

**Input**: Optionally specify a change name after `/sp:verify` (e.g., `/sp:verify add-auth`). If omitted, check if it can be inferred from conversation context. If vague or ambiguous you MUST prompt for available changes.

## Steps

1. **If no change name provided, prompt for selection**

   Run `superpowers list --json` to get available changes. Use the **AskUserQuestion tool** to let the user select.

   Show changes that have implementation tasks (tasks artifact exists).
   Include the schema used for each change if available.
   Mark changes with incomplete tasks as "(In Progress)".

   **IMPORTANT**: Do NOT guess or auto-select a change. Always let the user choose.

2. **Check status and load artifacts**

   ```bash
   superpowers status --change "<name>" --json
   ```

   Parse the JSON to understand:
   - `schemaName`: The workflow being used (e.g., "spec-driven")
   - Which artifacts exist for this change

   ```bash
   superpowers instructions apply --change "<name>" --json
   ```

   This returns the change directory, context files, and attachment files. Read all available artifacts from `contextFiles`, and read or inspect files from `attachmentFiles` when present. Treat artifacts as the source of normative meaning for each attachment.



3. **Initialize verification report structure**

   Create a report structure with three dimensions:
   - **Completeness**: Track tasks, spec coverage, scenario mapping, and test-plan coverage
   - **Correctness**: Track test-suite preflight and Manual Coverage (including browser methods)
   - **Coherence**: Track design adherence and pattern consistency

   Each dimension can have `P0`, `P1`, or `P2` findings.

4. **Verify Completeness**

   **Task Completion**:
   - If tasks.md exists in contextFiles, read it
   - Review each task individually for actual completion; do not rely on checkbox state alone — `- [x]` does not prove the work is done. Judge completion from evidence in the actual code implementation.
   - If incomplete tasks exist:
     - Add a `P0` finding for each incomplete task
     - Recommendation: "Complete task: <description>" or "Mark as done if already implemented"

   **Spec Coverage**:
   - If delta specs exist in `superpowers/changes/<name>/specs/`:
     - Extract all requirements (marked with "### Requirement:")
     - For each requirement:
       - Search codebase for keywords related to the requirement
       - Assess if implementation likely exists
       - Assess if implementation matches requirement intent
     - If divergence detected:
       - Add `P1`: "Implementation may diverge from spec: <details>"
       - Recommendation: "Review <file>:<lines> against requirement X"
     - If requirements appear unimplemented:
       - Add `P0`: "Requirement not found: <requirement name>"
       - Recommendation: "Implement requirement X: <description>"
     - For each scenario in delta specs (marked with "#### Scenario:"):
       - Check if conditions are handled in code
       - Check if tests exist covering the scenario
       - If scenario appears uncovered:
         - Add `P1`: "Scenario not covered: <scenario name>"
         - Recommendation: "Add test or implementation for scenario: <description>"

   **Test Coverage**:
   - Read and follow the `full-qa-test` skill. If it is unavailable, use the closest test-coverage skill in the environment.
   - Treat `design.md`, delta specs, `test-plan.md`, and the current implementation as the input set. Assess whether `test-plan.md` still adequately covers the change:
     - Map requirements, scenarios, design decisions, and identified risk paths to concrete rows or matrix entries in `test-plan.md`.
     - Find missing coverage: spec or implementation scope with no corresponding automated, manual, or justified deferred row.
     - Find stale coverage: rows that no longer match the implementation, were superseded by code changes, or describe tests that should be updated or removed.
     - Find shallow coverage: happy-path-only rows where delta specs or design call for boundaries, errors, permissions, state transitions, or integration paths.
   - When using `full-qa-test`, use its dimensions as a gap-analysis lens and read them off the `test-plan.md` `## Six-Dimension Case Matrix` (one table per dimension) and `## Dimension Coverage Summary`, which carry the same D1–D6 codes. Use `## Test Scope Register` to check coverage per `### Requirement:`, not a homemade feature list: Object is the Requirement ID, Entry Point is the system under test, and Spec Scenarios are the import list. The `## Requirement And Scenario Coverage Matrix` is an index from each imported Scenario to a D1 Case ID, not a second case list. A registered Requirement with no case in an applicable dimension is a coverage gap, as is a dimension left blank in that summary. Check that each case names a form (`unit` / `integration` / `E2E` / `manual`) and that the form is the lowest layer that can observe the behavior. During Verify, assess the plan and existing tests; do not claim full six-dimensional execution unless the active skill phase requires it.
   - When gaps, stale rows, or unjustified deferrals are found:
     - Add `P1`: "Test plan gap: <details>"
     - Recommendation: "Add or update test-plan.md for <requirement/scenario/risk>; cite the missing case or dimension"
   - The Verify worker reports findings by default; do not edit `test-plan.md` unless the host workflow explicitly authorizes repair.

5. **Verify Correctness**


    **Canonical non-visual test-suite preflight (verify)**

    - Discover the complete canonical non-visual suite from repository test scripts, CI configuration, testing documentation, and the active `test-plan.md`.
    - Record every selected command, its source of authority, and explicitly visual-only checks excluded. A convenient or partial test script is not full validation without repository evidence.
    - Run every selected command and record fresh results. If the suite is ambiguous, unavailable, cannot run, or fails, report `blocked` or `failed`; do not complete verify or continue to Manual Coverage.



    **Manual Coverage execution (verify)**

    - Read the active `test-plan.md` `## Manual Coverage` table separately from `## Deferred Coverage`. A Manual Coverage row is an executable check. Deferred Coverage is not execution evidence and must not be reported as passed or run.
    - After the canonical non-visual preflight, execute every applicable Manual Coverage row, including `agent-browser` rows deferred from Test Hardening, through its stated normal entry point, method, and safe environment. Record the performed steps, method/environment, actions, observed outcome, and inspectable evidence in the row or report.
- Treat every concrete Manual Coverage status row as required coverage. Classify each concrete Manual Coverage row as `passed`, `failed`, `blocked`, or scope-backed `not applicable`. An unexecuted, blank, `planned`, or placeholder row is incomplete. Any unexecuted, failed, or blocked applicable manual row prevents verify from passing; name remediation or the missing prerequisite rather than guessing.
- When this is final-quality Verify, a `blocked` Manual Coverage row makes the gate outcome `blocked` immediately and does not consume the Verify retry round; a repairable manual failure retries from Verify under the existing four-round limit.
    - Do not move a required manual row into Deferred Coverage merely to avoid execution. Use `not applicable` only with concrete scope evidence and use Deferred Coverage only for intentionally postponed work with a specific reason and safer follow-up.
    - Treat browser and other runnable end-to-end journeys as Manual Coverage methods, not as a separate Verify gate. Declare the method in the row's Execution Method and Environment field.
    - Distinguish two browser-control modes and record which one each row uses:
      - `programmatic-browser`: repository E2E runners such as Playwright/Cypress — faster, scripted, CI-friendly; evidence is command output, assertions, traces, and useful screenshots.
      - `agent-browser`: agent-controlled real UI — slower, human-like clicks/keyboard/navigation; evidence is route/URL transitions, DOM or pane dumps, step actions, screenshots, and relevant console/failed-network signals. An API call or curl request is not a substitute for either interactive browser mode. Reserve `agent-browser` execution for Verify rather than Test Hardening.
    - Method selection: honor an explicit method declared in the Manual Coverage row. When undeclared, apply risk layering — prefer `programmatic-browser` for low-risk/happy paths when a stable script exists; require `agent-browser` for high-risk, interaction-heavy, permission, destructive, or state-transition paths. A change's Critical Path may require both modes; overlapping coverage of the same path is allowed and both rows must pass.
    - Any `agent-browser` execution for a change that has a Critical Path MUST exercise that Critical Path; running only peripheral journeys does not satisfy agent-browser coverage.
    - Drive destructive flows only against a documented safe target, fixture, dry run, or disposable environment. If none exists, report the affected row as `blocked` rather than risking real data or systems. Memory alone is not evidence. Source inspection, screenshots, and unaided human checks never substitute for executing an applicable Manual Coverage row.

6. **Verify Coherence**

   **Design Adherence**:
   - If design.md exists in contextFiles:
     - Extract key decisions (look for sections like "Decision:", "Approach:", "Architecture:")
     - Verify implementation follows those decisions
     - If contradiction detected:
       - Add `P1`: "Design decision not followed: <decision>"
       - Recommendation: "Update implementation or revise design.md to match reality"
   - If no design.md: Skip design adherence check, note "No design.md to verify against"

   **Invariants**:
   - If `design.md` contains `## Invariants` that is not `N/A — no cross-path invariants`:
     - For each invariant ID, check the owner test/check when available
     - Owner check failure or implementation that breaks the stated invariant → add **`P0`** citing the invariant ID; recommend restore invariant or update design with explicit rationale
     - Soft documentary drift while the owner check still passes → `P1` only (do not escalate to `P0` solely on soft drift)
   - If Invariants is an explicit N/A line: do not fail coherence solely for lack of invariant rows


   **Code Pattern Consistency**:
   - Review new code for consistency with project patterns
   - Check file naming, directory structure, coding style
   - If significant deviations found:
     - Add `P2`: "Code pattern deviation: <details>"
     - Recommendation: "Consider following project pattern: <example>"

7. **Generate Verification Report**

   **Summary Scorecard**:
   ```
   ## Verification Report: <change-name>

   ### Summary
   | Dimension    | Status           |
   |--------------|------------------|
   | Completeness | X/Y tasks, N reqs|
   | Correctness  | M/N reqs covered |
   | Manual Coverage | M/N rows, methods, evidence |
   | Coherence    | Followed/Issues  |
   ```

   **Issues by Severity** (use the shared `P0`/`P1`/`P2` scale; do not introduce other severity words):

   1. **`P0`** (Must fix before archive):
      - Incomplete tasks
      - Missing requirement implementations
      - Broken stated invariants
      - Each with specific, actionable recommendation

   2. **`P1`** (Should fix):
      - Spec/design divergences
      - Missing scenario coverage
      - Test plan gaps or stale test rows
      - Each with specific recommendation

   3. **`P2`** (Nice to fix):
      - Pattern inconsistencies
      - Minor improvements
      - Each with specific recommendation

   **Final Assessment**:
   - If any applicable Manual Coverage row is `blocked` or `failed`: "Verify blocked/failed: resolve the Manual Coverage outcome before archiving." Do not report Correctness as passed.
   - If `P0` findings: "X P0 finding(s). Fix before archiving."
   - If only `P1`/`P2`: "No P0 findings. Y lower-severity finding(s) to consider. Ready for archive (with noted improvements)."
   - If all clear: "All checks passed. Ready for archive."

## Other Rules

**Severity model (single source).** Superpowers has exactly two grading vocabularies. They answer different questions, so never map one onto the other and never mix their words.

- **Defect severity — `P0`, `P1`, `P2`.** The only scale for grading a finding. Every activity that reports findings uses it: code review, proposal review, Verify, Design verify, and any security review feeding them. `P0` must be repaired before the activity can pass or announce readiness. `P1` is a real defect: repair it in the active round, but it does not by itself demand another round. `P2` is an optional improvement. Do not label findings `CRITICAL`, `HIGH`, `MEDIUM`, `LOW`, `INFO`, `WARNING`, or `SUGGESTION`; report the equivalent `P` level instead.
- **Gate outcome — `passed`, `failed`, `blocked`, or `not applicable`.** These say what happened to a Final Quality Gate, not how bad a finding is. `blocked` means a missing prerequisite or an external decision the worker cannot make: it names the prerequisite, pauses the affected gate immediately, and does not consume a round. A gate outcome is never a priority level, and `blocked` never substitutes for `P0`.

When a finding's severity is uncertain, prefer `P2` over `P1`, and `P1` over `P0`.

### Final-quality Verify retries:
   - When Verify is delegated by `/sp:apply`, label the report `Verify round 1` through `Verify round 4`. The first attempt after Simplify is round 1; every attempt, including a retry, uses a fresh subagent.
   - Every round reruns this complete canonical non-visual preflight before requirement/scenario assessment and applicable Manual Coverage. Preserve separate command and Manual Coverage evidence for every numbered round.
   - Before round four, the worker reports each resolvable failed check, applicable Manual Coverage failure, or `P0` finding. When the coordinator repairs an accepted failure or `P0` finding, retry from Verify with a fresh worker. Do not restart code review or Simplify solely for this retry.
   - A missing runtime, credential, browser capability, dependency, or other prerequisite is `blocked`: report it, name it, pause immediately, and do not consume a round. If round four still has a failed check, applicable Manual Coverage failure, or `P0` finding, report `failed`; do not begin a fifth round or recommend archive.

### Verification Heuristics

- **Completeness**: Focus on objective checklist items (tasks, requirements, scenarios) and test-plan gap analysis against design, specs, and implementation
- **Correctness**: Run the canonical test suite and Manual Coverage (including `programmatic-browser` / `agent-browser` methods); use inspectable evidence rather than inference alone
- **Coherence**: Look for glaring inconsistencies, don't nitpick style
- **False Positives**: Calibrate down when uncertain, per the severity model above
- **Actionability**: Every issue must have a specific recommendation with file/line references where applicable
**Adversarial hunt intent:** Hunt for as many real issues as possible. Assume remaining gaps, spec or design divergences, missing coverage, and failed journeys exist until evidence proves otherwise. Continue after the first finding. Report every reproducible, actionable issue with file/line or runtime evidence. Do not invent findings. Severity calibration is unchanged and follows the shared severity model.

### Remediations
   - Probe `superpowers/changes/<name>/remediations.md` on the change directory even when it is absent from schema `contextFiles`
   - When the file exists (especially on Verify retry rounds after coordinator repairs): read entries as repair context
   - A P0 entry marked `resolved` without a Guard → incomplete repair evidence; do not treat that finding as fully closed from the status label alone
   - An entry with Status `open` → incomplete for that finding; do not treat the finding as closed for gate success
   - Absent `remediations.md` on a first Verify with no accepted P0/P1 repairs yet → proceed without requiring the file

**Repair ownership**

- The Verify worker is read-only by default. Report findings and evidence before any implementation changes; include severity, affected files or journeys, reproduction details, and a specific recommendation.
- The coordinator evaluates and repairs accepted product, architecture, or workflow findings, then runs targeted verification. A host-native workflow may authorize worker self-repair only when that authorization is explicit.
- If a finding cannot be reproduced or its required repair is ambiguous, investigate or clarify before editing. Do not modify the implementation merely to make the report appear clean.
- In final-quality Verify, a repair ends the current worker's result. The coordinator starts the next required fresh Verify round; the reporting worker does not silently approve its own repair.

**Graceful Degradation**

- If only tasks.md exists: verify task completion only, skip spec/design checks
- If tasks + specs exist: verify completeness and correctness, skip design
- If full artifacts: verify all three dimensions
- Always note which checks were skipped and why

## Output Format

Use clear markdown with:
- Table for summary scorecard
- Grouped lists for issues (`P0`/`P1`/`P2`)
- When running as an apply final-quality gate: `Verify round: <1-4>`, `Fresh worker: <identity>`, retry disposition, canonical preflight/Manual Coverage evidence for that round, and the terminal `failed` or `blocked` reason where applicable
- Repair ownership: findings reported without edits by default; coordinator remediation and targeted-validation evidence when applicable
- Code references in format: `file.ts:123`
- Specific, actionable recommendations
- No vague suggestions like "consider reviewing"
