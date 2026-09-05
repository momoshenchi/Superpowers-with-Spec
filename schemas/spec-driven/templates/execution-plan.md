## File Structure

<!--  List files before task details. Use project-relative paths that are portable across macOS, Linux, and Windows.

- Create:
  - `path/to/new-file.ts` - [Responsibility]
- Modify:
  - `path/to/existing-file.ts` - [Responsibility and expected area of change]
- Test:
  - `test/path/to/test-file.test.ts` - [Behaviors covered]

-->

## Attachments

<!-- Optional. Reference change-local files such as ![Target state](attachments/target-state.png).
Explain what each file is, why it matters, which task or requirement it supports, and whether it is normative, illustrative, or background context. -->

## Dispatch Coordination

`tasks.md` is the source of detailed, checkbox-tracked work. Each top-level `# <number>. <scope>` heading is one **dispatch unit**: a logical allocation boundary the coordinator may assign to one worker/subagent, combine with compatible units, or execute inline. It is not a live subagent identity. Legacy `# <number>. agent<logical-id> — <scope>` headings remain acceptable.

| Unit | Scope | Ownership | Dependencies | Assignee policy | Parallel | Handoff |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | [scope] | `path/to/owned-area` | None | Prefer dedicated worker / may combine / execute inline | Yes / No, with reason | Changed files, verification, self-review report |

## Execution Boundaries

### 1. [scope]

- Deliver every detailed checkbox in this dispatch unit.
- Respect the ownership boundary and dependencies above.
- Run the verification named by the detailed tasks and self-review before handoff.

## Dispatch Execution

Expand every detailed task from `tasks.md` beneath its dispatch unit. These steps explain how to execute a feature-scale task; they are not separate subagent assignments or required 2–5 minute units. Keep checkbox completion only in `tasks.md`. Use clean `### <number>. <scope>` headings — do not nest code-wrapped `# ...` heading text.

## Implementation Notes

After any Step 1–5, a worker MAY append a concise `#### Implementation Notes` subsection directly below that step when the implementation produces useful knowledge. These notes are non-normative narrative context, not an execution status tracker, and do not replace `tasks.md` progress or verification evidence. Do not use task checkboxes or status fields in the notes. Prefer observations that help a later worker or the main agent understand:

- **Findings** — facts discovered in the code, tests, runtime, or tooling
- **Reasoning** — the thought process behind an implementation choice
- **Viewpoints / Trade-offs** — alternatives considered and why one was preferred
- **Summary / Takeaway** — a concise conclusion or reusable tip

Keep planned Step 1–5 instructions intact. Append notes rather than rewriting the plan, and distinguish observed facts from inferences or decisions. When multiple dispatch units execute in parallel, the coordinator SHALL serialize writes to this shared file or append worker-provided notes after handoff; a worker must not overwrite another unit's notes.

### 1. [scope]

#### Task 1.1: [Detailed task description]

**Files:**
- Create / Modify / Test: `project-relative/path` — [responsibility]

1. **Step 1: Write or extend focused tests** — Fill every slot below, including the test skeleton. This is the RED test that drives the task. A Step 1 that only says "cover the behavior" or lists slot names without values is not a plan. Do not write production code in this step. Six-dimension hardening stays in `test-plan.md`.
   - **Spec bound:** quote the `### Requirement:` and `#### Scenario:` this test proves. Map the spec's **WHEN** onto Arrange/Act and the spec's **THEN** onto Assert. If this task has no Scenario yet, name the Requirement and the gap.
   - **Test location:** file to create or extend, plus `describe` / `it` names. One focused test, or a tight cluster that fails for the same missing behavior.
   - **Case table:** when this task proves more than one Scenario, list each case before the skeleton. Columns: Scenario (WHEN/THEN) | Form | `it` name | literal input | assertion. Star the primary RED case; the skeleton below is that case. Other rows wait for later tasks or later `it`s in the same file after green.
   - **Test skeleton:** a paste-ready AAA body in the repo's test style — imports, fixture setup, the `it(...)` block, and assertions. An implementer must be able to type this in and run it without inventing names or values. Omit production implementation; the skeleton is allowed to fail to compile or import.
2. **Step 2: Run the focused tests** — Run the focused tests . Record the actual failure. If it fails for the wrong reason (syntax, wrong file, fixture error) or already passes, stop and fix Step 1; do not start Step 3.
3. **Step 3: Implement Task 1.1** — Fill every slot below. A Step 3 that only restates the task title is not a plan.
   - **Change anchor:** the exact symbol(s) to add or edit, and the call path from the entry point that reaches them.
   - **Design carried:** which `design.md` Decisions, Contracts, and Invariants this task implements, cited by name.
   - **Implementation approach:** the algorithm, data shape, or state transition in enough detail to write the code from — not a restatement of the task title.
   - **Edges and failures:** behavior for empty, missing, invalid, and failure inputs, each traced to the spec Scenario that requires it.
   - **Out of scope:** what this task deliberately does not change, so the worker does not widen the diff.
4. **Step 4: Run focused verification** — Re-run the exact command from Step 2. Then run Git-related tests when the runner supports Git-aware selection; do not require the full suite in that case. Record the passing result. If a new failure appears outside this task's test, name it — do not silently expand the diff to chase it.
5. **Step 5: Self-review and handoff** — Confirm the Step 1 assertions now pass for the right reason, the Step 3 slots were followed, no extra files leaked in, and the `tasks.md` checkbox can be marked. Report files changed, the verification command, and then continue with the next detailed task in this dispatch unit.

   Append `#### Implementation Notes` after any of the five steps when there is a meaningful finding, reasoning note, viewpoint/trade-off, or summary/takeaway. Notes are optional and explanatory; they are not a second task checklist.

#### Task 1.2: [Detailed task description]

Repeat Steps 1–5 with every slot filled for Task 1.2.

---

### Worked example (format reference — replace with the real plan)

> Dispatch unit: `1. delta operation validation`. Task: report a mislabeled ADDED/MODIFIED delta during `validate`.

#### Task 1.1: Cross-check delta operations against the capability's main spec

**Files:**
- Create: `src/core/validation/delta-operations.ts` — pure operation check, no filesystem access
- Modify: `src/core/validation/validator.ts` — call the check inside the per-spec delta loop
- Test: `test/core/validation/delta-operations.test.ts` — operation-labeling behaviors

1. **Step 1: Write or extend focused tests**
   - **Spec bound:** `Requirement: Validator reports mislabeled delta operations` / `Scenario: ADDED names an existing requirement`. Spec WHEN = a delta lists `### Requirement: Existing Behavior` under `## ADDED Requirements` while the main spec already has that header. Spec THEN = validate emits ERROR telling the author to move it under `## MODIFIED Requirements`.
   - **Test location:** create `test/core/validation/delta-operations.test.ts`. Primary `it('rejects ADDED for a requirement that already exists and points at MODIFIED')`.
   - **Case table:**

     | Scenario (WHEN → THEN) | Form | `it` name | Primary |
     | --- | --- | --- | --- |
     | ADDED header already in main spec → ERROR pointing at MODIFIED | unit | `rejects ADDED for a requirement that already exists and points at MODIFIED` | ★ |
     | MODIFIED header absent from main spec → ERROR pointing at ADDED | unit | `rejects MODIFIED for a requirement that does not exist and points at ADDED` | next `it` after green |
     | MODIFIED typo near an existing name → ERROR names the closest requirement | unit | `suggests the closest existing name when a MODIFIED header looks like a typo` | next `it` after green |

   - **Test skeleton:**

     ```ts
     it('rejects ADDED for a requirement that already exists and points at MODIFIED', () => {
       const issues = checkDeltaOperationsAgainstMainSpec(
         'alpha/spec.md',
         'alpha',
         parseDeltaSpec(added('Existing Behavior')),
         MAIN_SPEC
       );
       expect(issues).toHaveLength(1);
       expect(issues[0].level).toBe('ERROR');
       expect(issues[0].path).toBe('alpha/spec.md');
       expect(issues[0].message).toContain('ADDED "Existing Behavior"');
       expect(issues[0].message).toContain('already exists');
       expect(issues[0].message).toContain('## MODIFIED Requirements');
     });
     ```

     `added()` and `MAIN_SPEC` are test-local helpers defined in the same file. The import of `checkDeltaOperationsAgainstMainSpec` is expected to fail until Step 3.
2. **Step 2: Run the focused tests** — `npx vitest run test/core/validation/delta-operations.test.ts`. Expect `Cannot find module '.../delta-operations.js'`. Any other failure means Step 1 is wrong.
3. **Step 3: Implement Task 1.1**
   - **Change anchor:** new `checkDeltaOperationsAgainstMainSpec(entryPath, specName, plan, mainSpecContent)`; called from `Validator.validateChangeDeltaSpecs` inside the existing `for (const entry of entries)` loop, after the intra-file RENAMED checks.
   - **Design carried:** Decision "operation labeling is mechanical, so validate owns it, not proposal review"; Invariant "validate never mutates artifacts"; Contract "every mislabeled operation is an ERROR-level `ValidationIssue`".
   - **Implementation approach:** build a `Map<matchKey, displayName>` from the main spec's requirement headers, then replay the operations in the same order `specs-apply` uses — RENAMED, REMOVED, MODIFIED, ADDED — mutating the map as each one applies. Match keys are lower-cased and trimmed so a casing slip reads as a typo.
   - **Edges and failures:** absent main spec → MODIFIED and RENAMED are ERROR pointing at `## ADDED Requirements`, REMOVED is WARNING because apply ignores it. A near-miss name suggests the closest existing requirement only when edit distance is under a quarter of the shorter name.
   - **Out of scope:** intra-file duplicate checks already in `validator.ts`, and the throwing checks in `specs-apply.ts`.
4. **Step 4: Run focused verification** — `npx vitest run test/core/validation/delta-operations.test.ts test/core/validation`. Expect all tests passing. A failure in `archive.test.ts` is out of this task — report it, do not expand the diff.
5. **Step 5: Self-review and handoff** — Confirm ERROR messages name the operation, the requirement, and the section to move it to. Report changed files and the verification command.



