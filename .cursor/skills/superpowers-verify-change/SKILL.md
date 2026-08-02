---
name: superpowers-verify-change
description: Verify implementation matches change artifacts. Use when the user wants to validate that implementation is complete, correct, and coherent before archiving.
license: MIT
compatibility: Requires superpowers CLI.
metadata:
  author: superpowers
  version: "1.0"
  generatedBy: "1.0.7"
---

Verify that an implementation matches the change artifacts (specs, tasks, design).

**Input**: Optionally specify a change name. If omitted, check if it can be inferred from conversation context. If vague or ambiguous you MUST prompt for available changes.

**Steps**

1. **If no change name provided, prompt for selection**

   Run `superpowers list --json` to get available changes. Use the **AskUserQuestion tool** to let the user select.

   Show changes that have implementation tasks (tasks artifact exists).
   Include the schema used for each change if available.
   Mark changes with incomplete tasks as "(In Progress)".

   **IMPORTANT**: Do NOT guess or auto-select a change. Always let the user choose.

2. **Check status to understand the schema**
   ```bash
   superpowers status --change "<name>" --json
   ```
   Parse the JSON to understand:
   - `schemaName`: The workflow being used (e.g., "spec-driven")
   - Which artifacts exist for this change

3. **Get the change directory and load artifacts**

   ```bash
   superpowers instructions apply --change "<name>" --json
   ```

   This returns the change directory, context files, and attachment files. Read all available artifacts from `contextFiles`, and read or inspect files from `attachmentFiles` when present. Treat artifacts as the source of normative meaning for each attachment.

4. **Initialize verification report structure**

   Create a report structure with three dimensions:
   - **Completeness**: Track tasks and spec coverage
   - **Correctness**: Track requirement implementation and scenario coverage
   - **Coherence**: Track design adherence and pattern consistency

   Each dimension can have CRITICAL, WARNING, or SUGGESTION issues.

**Repair ownership**

- The Verify worker is read-only by default. Report findings and evidence before any implementation changes; include severity, affected files or journeys, reproduction details, and a specific recommendation.
- The coordinator evaluates and repairs accepted product, architecture, or workflow findings, then runs targeted verification. A host-native workflow may authorize worker self-repair only when that authorization is explicit.
- If a finding cannot be reproduced or its required repair is ambiguous, investigate or clarify before editing. Do not modify the implementation merely to make the report appear clean.
- In final-quality Verify, a repair ends the current worker's result. The coordinator starts the next required fresh Verify round; the reporting worker does not silently approve its own repair.

5. **Verify Completeness**

   **Task Completion**:
   - If tasks.md exists in contextFiles, read it
   - Parse checkboxes: `- [ ]` (incomplete) vs `- [x]` (complete)
   - Count complete vs total tasks
   - If incomplete tasks exist:
     - Add CRITICAL issue for each incomplete task
     - Recommendation: "Complete task: <description>" or "Mark as done if already implemented"

   **Spec Coverage**:
   - If delta specs exist in `superpowers/changes/<name>/specs/`:
     - Extract all requirements (marked with "### Requirement:")
     - For each requirement:
       - Search codebase for keywords related to the requirement
       - Assess if implementation likely exists
     - If requirements appear unimplemented:
       - Add CRITICAL issue: "Requirement not found: <requirement name>"
       - Recommendation: "Implement requirement X: <description>"

6. **Verify Correctness**


**Canonical non-visual test-suite preflight (verify)**

- Discover the complete canonical non-visual suite from repository test scripts, CI configuration, testing documentation, and the active `test-plan.md`.
- Record every selected command, its source of authority, and explicitly visual-only checks excluded. A convenient or partial test script is not full validation without repository evidence.
- Run every selected command and record fresh results. If the suite is ambiguous, unavailable, cannot run, or fails, report `blocked` or `failed`; do not complete verify or continue to E2E.



**Manual Coverage execution (verify)**

- Read the active `test-plan.md` `## Manual Coverage` table separately from `## Deferred Coverage`. A Manual Coverage row is an executable check. Deferred Coverage is not execution evidence and must not be reported as passed or run.
- After the canonical non-visual preflight, execute every applicable Manual Coverage row through its stated normal entry point, method, and safe environment. Record the performed steps, method/environment, actions, observed outcome, and inspectable evidence in the row or report.
- Treat every concrete Manual Coverage status row as required coverage. Classify each concrete Manual Coverage row as `passed`, `failed`, `blocked`, or scope-backed `not applicable`. An unexecuted, blank, `planned`, or placeholder row is incomplete. Any unexecuted, failed, or blocked applicable manual row prevents verify from passing; name remediation or the missing prerequisite rather than guessing.
- Do not move a required manual row into Deferred Coverage merely to avoid execution. Use `not applicable` only with concrete scope evidence and use Deferred Coverage only for intentionally postponed work with a specific reason and safer follow-up.
- When this is final-quality Verify, a Manual Coverage `BLOCKER` is an immediate `blocked` outcome and does not consume the Verify retry round; a repairable manual failure retries from Verify under the existing four-round limit.

   **Requirement Implementation Mapping**:
   - For each requirement from delta specs:
     - Search codebase for implementation evidence
     - If found, note file paths and line ranges
     - Assess if implementation matches requirement intent
     - If divergence detected:
       - Add WARNING: "Implementation may diverge from spec: <details>"
       - Recommendation: "Review <file>:<lines> against requirement X"

   **Scenario Coverage**:
   - For each scenario in delta specs (marked with "#### Scenario:"):
     - Check if conditions are handled in code
     - Check if tests exist covering the scenario
     - If scenario appears uncovered:
       - Add WARNING: "Scenario not covered: <scenario name>"
       - Recommendation: "Add test or implementation for scenario: <description>"

   **End-to-end acceptance**:
   - Classify changed requirements/scenarios as runnable user, browser, or end-to-end journeys.
   - After the canonical preflight passes, exercise every affected runnable journey through its normal entry point using repository E2E automation or an equivalent agent-controlled browser. For browser-facing journeys, drive the real UI with the same clicks, keyboard input, and navigation a user uses; an API call or curl request is not a substitute for an interactive UI flow.
   - Select a concrete available driver (repository E2E runner, Playwright/browser automation, or agent-controlled browser), wait for the application to be ready, and capture inspectable evidence: command output, route/URL transitions, relevant DOM or response assertions, screenshots or pane dumps where useful, and relevant console and failed-network signals. Memory alone is not evidence.
   - Verify the observable success outcome plus applicable risk paths. Consider error, empty, permission, repeat-operation, refresh/navigation, invalid or missing input, rapid repeated interaction, and resize/responsive behavior when they apply to the changed journey.
   - Drive destructive flows only against a documented safe target, fixture, dry run, or disposable environment. If none exists, report the affected path as `blocked` rather than risking real data or systems.
   - A plan containing only build, typecheck, or isolated test commands is a CI rerun, not E2E verification. Find a step that reaches the changed surface or report it `blocked`.
   - Report E2E as `passed`, `failed`, `blocked`, or `not applicable`: include route/entry point, environment/command, selected driver, exercised states, and captured evidence. An unexpected observable outcome or relevant console/network failure is `failed` and must include remediation; missing runtime, credentials, dependencies, or browser capability is `blocked`; non-runnable scope is `not applicable` with a concrete reason. Source inspection, screenshots, and unaided human checks never substitute for an applicable E2E pass.
   - An applicable E2E journey reported `blocked` or `failed` makes both Correctness and the overall Verify outcome `blocked` or `failed`; resolve it before archive. Only a concrete, scope-backed `not applicable` outcome is non-blocking.

   **Final-quality Verify retries**:
   - When Verify is delegated by `/sp:apply`, label the report `Verify round 1` through `Verify round 4`. The first attempt after Simplify is round 1; every attempt, including a retry, uses a fresh subagent.
   - Every round reruns this complete canonical non-visual preflight before requirement/scenario assessment and applicable E2E acceptance. Preserve separate command and E2E evidence for every numbered round.
   - Treat `CRITICAL` as `P0` for final-quality retry decisions. Before round four, the worker reports each resolvable failed check, applicable E2E failure, or P0/CRITICAL finding. When the coordinator repairs an accepted failure or CRITICAL finding, retry from Verify with a fresh worker. Do not restart code review or Simplify solely for this retry.
   - A missing runtime, credential, browser capability, dependency, or other prerequisite is `BLOCKER`: report `blocked`, name it, pause immediately, and do not consume a round. If round four still has a failed check, applicable E2E failure, or P0/CRITICAL finding, report `failed`; do not begin a fifth round or recommend archive.

7. **Verify Coherence**

   **Design Adherence**:
   - If design.md exists in contextFiles:
     - Extract key decisions (look for sections like "Decision:", "Approach:", "Architecture:")
     - Verify implementation follows those decisions
     - If contradiction detected:
       - Add WARNING: "Design decision not followed: <decision>"
       - Recommendation: "Update implementation or revise design.md to match reality"
   - If no design.md: Skip design adherence check, note "No design.md to verify against"

   **Code Pattern Consistency**:
   - Review new code for consistency with project patterns
   - Check file naming, directory structure, coding style
   - If significant deviations found:
     - Add SUGGESTION: "Code pattern deviation: <details>"
     - Recommendation: "Consider following project pattern: <example>"

8. **Generate Verification Report**

   **Summary Scorecard**:
   ```
   ## Verification Report: <change-name>

   ### Summary
   | Dimension    | Status           |
   |--------------|------------------|
   | Completeness | X/Y tasks, N reqs|
   | Correctness  | M/N reqs covered |
   | E2E evidence | Outcome, driver, states, artifacts |
   | Coherence    | Followed/Issues  |
   ```

   **Issues by Priority**:

   1. **CRITICAL** (Must fix before archive):
      - Incomplete tasks
      - Missing requirement implementations
      - Each with specific, actionable recommendation

   2. **WARNING** (Should fix):
      - Spec/design divergences
      - Missing scenario coverage
      - Each with specific recommendation

   3. **SUGGESTION** (Nice to fix):
      - Pattern inconsistencies
      - Minor improvements
      - Each with specific recommendation

   **Final Assessment**:
   - If any applicable E2E journey is `blocked` or `failed`: "Verify blocked/failed: resolve the E2E outcome before archiving." Do not report Correctness as passed.
   - If CRITICAL issues: "X critical issue(s) found. Fix before archiving."
   - If only warnings: "No critical issues. Y warning(s) to consider. Ready for archive (with noted improvements)."
   - If all clear: "All checks passed. Ready for archive."

**Verification Heuristics**

- **Completeness**: Focus on objective checklist items (checkboxes, requirements list)
- **Correctness**: Use keyword search, file path analysis, reasonable inference - don't require perfect certainty
- **Coherence**: Look for glaring inconsistencies, don't nitpick style
- **False Positives**: When uncertain, prefer SUGGESTION over WARNING, WARNING over CRITICAL
- **Actionability**: Every issue must have a specific recommendation with file/line references where applicable

**Graceful Degradation**

- If only tasks.md exists: verify task completion only, skip spec/design checks
- If tasks + specs exist: verify completeness and correctness, skip design
- If full artifacts: verify all three dimensions
- Always note which checks were skipped and why

**Output Format**

Use clear markdown with:
- Table for summary scorecard
- Grouped lists for issues (CRITICAL/WARNING/SUGGESTION)
- When running as an apply final-quality gate: `Verify round: <1-4>`, `Fresh worker: <identity>`, retry disposition, canonical preflight/E2E evidence for that round, and the terminal `failed` or `blocked` reason where applicable
- Repair ownership: findings reported without edits by default; coordinator remediation and targeted-validation evidence when applicable
- Code references in format: `file.ts:123`
- Specific, actionable recommendations
- No vague suggestions like "consider reviewing"
