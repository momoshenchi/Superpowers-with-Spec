---
name: superpowers-verify-change
description: Verify implementation matches change artifacts. Use when the user wants to validate that implementation is complete, correct, and coherent before archiving.
license: MIT
compatibility: Requires superpowers CLI.
metadata:
  author: superpowers
  version: "1.0"
  generatedBy: "1.0.11"
---

Verify that an implementation matches the change artifacts (specs, tasks, design).

**Input**: Optionally specify a change name. Use an explicit name when given; otherwise resolve with the targeting rule in Step 1.

## Steps

1. **Resolve the change name**

   Use an explicit change name when provided. Otherwise use the conversation-bound change if conversation already names one. Otherwise, if there is exactly one eligible change, select that sole eligible change. Prompt only when two or more eligible changes could match; do not guess.

   Run `superpowers list --json` to list active changes when you need to determine eligibility or prompt. Announce the selected name before continuing.

   Eligible changes are active changes that have implementation tasks (tasks artifact exists). Include the schema used for each change if available. Mark changes with incomplete tasks as "(In Progress)". When a prompt is required, show only those eligible changes.

2. **Check status and load artifacts**

   ```bash
   superpowers status --change "<name>" --json
   ```

   Parse the JSON to understand:
   - `schemaName`: The workflow being used (e.g., "spec-driven")
   - Which artifacts exist for this change

   If the selected change has no tasks.md or tasks are empty, report "No tasks to verify" and suggest running `/sp:continue` to create tasks.

   ```bash
   superpowers instructions apply --change "<name>" --json
   ```

   This returns the change directory, context files, and attachment files. Treat `contextFiles` as a catalog. Read the artifacts needed for the current Verify dimensions; do not read every `contextFiles` path in full before the first check. Read or inspect files from `attachmentFiles` when present. Treat artifacts as the source of normative meaning for each attachment.

   When Completeness, Correctness, or Coherence reporting starts, read `reference/verify-report.md`. If that file is missing, report Verify `blocked` with the missing path; do not skip. Do not inline the report body here.
