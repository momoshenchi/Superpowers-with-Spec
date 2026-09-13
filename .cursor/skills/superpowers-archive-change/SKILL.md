---
name: superpowers-archive-change
description: Archive a completed change in the workflow. Use when the user wants to finalize and archive a change after implementation is complete.
license: MIT
compatibility: Requires superpowers CLI.
metadata:
  author: superpowers
  version: "1.0"
  generatedBy: "1.0.11"
---

Archive a completed change in the workflow.

**Input**: Optionally specify a change name. Use an explicit name when given; otherwise resolve with the targeting rule in Step 1.

**Steps**

1. **Resolve the change name**

   Use an explicit change name when provided. Otherwise use the conversation-bound change if conversation already names one. Otherwise, if there is exactly one eligible change, select that sole eligible change. Prompt only when two or more eligible changes could match; do not guess.

   Run `superpowers list --json` to list active changes when you need to determine eligibility or prompt. Announce the selected name before continuing.

   Eligible changes are active changes (not already archived). Include the schema used for each change if available. When a prompt is required, show only active changes.
   Auto-select does not skip later warnings. Incomplete artifacts, incomplete tasks, and incomplete, failed, or blocked applicable Final Quality Gates still require a warning and confirmation.

2. **Check artifact completion status**

   Run `superpowers status --change "<name>" --json` to check artifact completion.

   Parse the JSON to understand:
   - `schemaName`: The workflow being used
   - `artifacts`: List of artifacts with their status (`done` or other)

   **If any artifacts are not `done`:**
   - Display warning listing incomplete artifacts
   - Use **AskUserQuestion tool** to confirm user wants to proceed
   - Proceed if user confirms

3. **Check task completion status**

   Read the tasks file (typically `tasks.md`) to check for incomplete tasks.

   Count tasks marked with `- [ ]` (incomplete) vs `- [x]` (complete).

   **If incomplete tasks found:**
   - Display warning showing count of incomplete tasks
   - Use **AskUserQuestion tool** to confirm user wants to proceed
   - Proceed if user confirms

   **If no tasks file exists:** Proceed without task-related warning.

4. **Check the final quality gate record**

   Read `test-plan.md` when it exists and locate its `## Final Quality Gates` section.

   A gate is resolved when it is `passed`, or `not applicable` with concrete scope evidence. A gate is unresolved when it is `failed`, applicable-`blocked`, still `planned`, or absent.

   **If the section is missing, records no rows, or has any unresolved gate:**
   - Display a warning naming each unresolved gate and its outcome
   - Use **AskUserQuestion tool** to confirm user wants to proceed
   - Proceed if user confirms

   **If no `test-plan.md` exists:** Proceed without gate-related warning; the change has no gate contract.

5. **Assess delta spec sync state**

   Check for delta specs at `superpowers/changes/<name>/specs/`. If none exist, proceed without sync prompt.

   **If delta specs exist:**
   - Compare each delta spec with its corresponding main spec at `superpowers/specs/<capability>/spec.md`
   - Determine what changes would be applied (adds, modifications, removals, renames)
   - Show a combined summary before prompting

   **Prompt options:**
   - If changes needed: "Sync now (recommended)", "Archive without syncing"
   - If already synced: "Archive now", "Sync anyway", "Cancel"

   If user chooses sync, use Task tool (subagent_type: "general-purpose", prompt: "Use Skill tool to invoke superpowers-sync-specs for change '<name>'. Delta spec analysis: <include the analyzed delta spec summary>"). Proceed to archive regardless of choice.

6. **Perform the archive**

   Create the archive directory if it doesn't exist:
   ```bash
   mkdir -p superpowers/changes/archive
   ```

   Generate target name using current date: `YYYY-MM-DD-<change-name>`

   **Check if target already exists:**
   - If yes: Fail with error, suggest renaming existing archive or using different date
   - If no: Move the change directory to archive

   ```bash
   mv superpowers/changes/<name> superpowers/changes/archive/YYYY-MM-DD-<name>
   ```

7. **Display summary**

   Show archive completion summary including:
   - Change name
   - Schema that was used
   - Archive location
   - Spec sync status (synced / sync skipped / no delta specs)
   - Note about any warnings (incomplete artifacts/tasks, unresolved final quality gates)

**Output On Success**

```
## Archive Complete

**Change:** <change-name>
**Schema:** <schema-name>
**Archived to:** superpowers/changes/archive/YYYY-MM-DD-<name>/
**Specs:** ✓ Synced to main specs

All artifacts complete. All tasks complete.
```

**Output On Success (No Delta Specs)**

```
## Archive Complete

**Change:** <change-name>
**Schema:** <schema-name>
**Archived to:** superpowers/changes/archive/YYYY-MM-DD-<name>/
**Specs:** No delta specs

All artifacts complete. All tasks complete.
```

**Output On Success With Warnings**

```
## Archive Complete (with warnings)

**Change:** <change-name>
**Schema:** <schema-name>
**Archived to:** superpowers/changes/archive/YYYY-MM-DD-<name>/
**Specs:** Sync skipped (user chose to skip)

**Warnings:**
- Archived with 2 incomplete artifacts
- Archived with 3 incomplete tasks
- Archived with 1 unresolved final quality gate (`/sp:verify`: failed)
- Delta spec sync was skipped (user chose to skip)

Review the archive if this was not intentional.
```

**Output On Error (Archive Exists)**

```
## Archive Failed

**Change:** <change-name>
**Target:** superpowers/changes/archive/YYYY-MM-DD-<name>/

Target archive directory already exists.

**Options:**
1. Rename the existing archive
2. Delete the existing archive if it's a duplicate
3. Wait until a different date to archive
```

**Guardrails**
- Prompt for change selection only when two or more eligible changes could match
- Use artifact graph (superpowers status --json) for completion checking
- Check the `## Final Quality Gates` record in `test-plan.md` before archiving; never treat a missing record as a passing quality chain
- Don't block archive on warnings - just inform and confirm
- Preserve .superpowers.yaml when moving to archive (it moves with the directory)
- Show clear summary of what happened
- If sync is requested, invoke the `superpowers-sync-specs` skill (agent-driven)
- If delta specs exist, always run the sync assessment and show the combined summary before prompting
