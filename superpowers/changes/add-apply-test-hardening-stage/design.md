## Context

The current default spec-driven workflow is proposal -> specs -> design -> tasks -> execution-plan -> apply. `execution-plan.md` intentionally gives agents a detailed implementation guide with red-green TDD sequencing. This improves task-level correctness, but it still leaves a gap after implementation: red tests are written from the planned behavior before production code exists, while many bugs emerge from the final code shape, integration choices, omitted branches, and non-critical paths discovered during implementation.

TapCanvas change history shows `execution-plan.md` can be long, and that is acceptable for coding accuracy. The new goal is not to shrink execution plans. The goal is to separate "tests that guide implementation" from "tests that attack the completed implementation" and make the latter unavoidable inside `/sp:apply`.

## Goals / Non-Goals

**Goals:**

- Add `test-plan.md` as a first-class spec-driven artifact after `execution-plan.md`.
- Create `test-plan.md` before implementation starts so agents have a coverage map while coding.
- Update `test-plan.md` after implementation tasks complete with Test Hardening evidence from the actual diff.
- Update `/sp:apply` completion semantics so task completion transitions into Test Hardening instead of immediately suggesting archive.
- Preserve detailed `execution-plan.md` guidance, including red tests before production code.
- Make the distinction between TDD red tests and Test Hardening explicit in templates and generated workflow text.

**Non-Goals:**

- No `/sp:verify` behavior changes.
- No `/sp:archive` template, instruction, or explicit gate changes. Archive may naturally observe the new schema artifact through existing artifact status checks.
- No new standalone CLI command for test hardening.
- No coverage percentage enforcement or universal requirement to add E2E tests for every change.
- No attempt to make `superpowers status` parse arbitrary test-plan checklist completion for artifact status.

## Decisions

### 1. Add `test-plan` after `execution-plan`

**Decision:** Add a schema artifact:

```yaml
- id: test-plan
  generates: test-plan.md
  description: Test coverage plan and post-implementation hardening record
  template: test-plan.md
  requires:
    - execution-plan
```

Then set the default spec-driven apply block to:

```yaml
apply:
  requires: [test-plan]
  tracks: tasks.md
```

**Rationale:** The test plan needs specs, design, tasks, and execution-plan context. It should be present before apply begins, but task progress should still come from the compact `tasks.md` checklist.

**Alternative considered:** Create `test-plan.md` only at the end of apply. Rejected because it would not improve coding accuracy during implementation and would be easier to skip.

### 2. Treat `test-plan.md` as a two-phase artifact

**Decision:** `test-plan.md` starts as a pre-implementation draft and is updated into a post-implementation hardening record.

Initial draft responsibilities:

- Requirement/scenario coverage matrix.
- Planned unit, integration, E2E, manual, or not-applicable coverage.
- Known risks and abnormal paths to remember while coding.
- Exact unchecked Test Hardening completion marker: `- [ ] Test Hardening complete`.

Post-implementation responsibilities:

- Actual diff audit.
- Added or modified test files.
- Boundary/abnormal/non-critical-path coverage results.
- Verification commands and outcomes.
- Explicit deferrals with reasons.
- Checked Test Hardening completion marker, exactly `- [x] Test Hardening complete`, only after evidence exists.

**Rationale:** This avoids a second long implementation plan while still giving agents a concrete testing contract before coding starts.

### 3. Keep `execution-plan.md` large when useful

**Decision:** Do not try to shrink `execution-plan.md` as part of this change. Update it only to clarify boundaries:

- Red tests in `execution-plan.md` drive implementation.
- Broad test coverage matrices and post-diff hardening evidence belong in `test-plan.md`.

**Rationale:** The user explicitly accepts large execution plans when they improve code accuracy. The process failure is not that execution plans are long; it is that final diff hardening is not a required apply phase.

### 4. Add hardening state inside `test-plan.md`, not artifact status

**Decision:** `superpowers status` should treat `test-plan.md` as done once the file exists, consistent with other artifacts. The apply workflow instructions should inspect the exact marker `- [x] Test Hardening complete` inside `test-plan.md` to decide whether apply is complete. Any other wording or unchecked marker, including `- [ ] Test Hardening complete`, means hardening is incomplete.

**Rationale:** Artifact status answers "does this planning artifact exist?" Apply completion answers "is implementation plus hardening done?" Those are related but different state machines.

```text
Artifact graph:
proposal -> specs/design -> tasks -> execution-plan -> test-plan -> apply can start

Apply progress:
implementation tasks incomplete -> implement tasks
implementation tasks complete + hardening incomplete -> Test Hardening
implementation tasks complete + hardening complete -> apply complete
```

**Alternative considered:** Extend CLI status parsing to understand a `test-plan.md` checklist. Rejected for this change because the user asked not to broaden the scope into verify/archive behavior, and schema artifact completion currently stays file-existence based.

### 5. Define hardening failure behavior

**Decision:** A failing hardening test or defect found during Test Hardening blocks apply completion. The agent must either fix the implementation and rerun verification, or pause as blocked with the failing command, failure summary, affected files, and recommended next action. It must not check `- [x] Test Hardening complete` while hardening tests fail or product defects remain unresolved.

**Rationale:** Test Hardening only reduces bugs if it has teeth. A test-plan record with known failing evidence would make apply completion less trustworthy than the current workflow.

### 6. Audit only the relevant diff

**Decision:** Test Hardening should begin by inspecting the current working-tree diff using repository-native commands such as `git diff --stat` and `git diff`. The agent should map changed files to `tasks.md`, `execution-plan.md`, and `test-plan.md`, ignore clearly unrelated user changes, and pause if unrelated or ambiguous changes affect the hardening judgment.

**Rationale:** Many Codex/Superpowers worktrees may be dirty. Without a diff-scope rule, the hardening pass could either miss files from the change or accidentally take responsibility for unrelated user edits.

### 7. Keep verify and archive templates unchanged

**Decision:** Do not modify `/sp:verify` or `/sp:archive` templates or specs in this change.

**Rationale:** The smallest useful cut is inside `/sp:apply`. Once `test-plan.md` is a schema artifact, archive naturally sees it as an artifact file through existing artifact status behavior, but this change does not add new archive-specific checks or new verify dimensions.

## Risks / Trade-offs

- [Risk] Agents may mark `test-plan.md` as hardening complete too casually. -> Template must require command evidence, added/reviewed tests, and specific deferrals before checking completion.
- [Risk] Apply can still appear "all done" from task progress alone in some instruction output. -> Generated apply workflow text must override that interpretation by reading the Test Hardening checklist before final completion messaging.
- [Risk] Multiple hardening completion phrasings cause inconsistent implementation. -> Define the exact marker as `- [ ] Test Hardening complete` / `- [x] Test Hardening complete` and test for that string.
- [Risk] The new artifact adds more process weight. -> Keep `test-plan.md` matrix-oriented and focused on testing evidence, not a duplicated implementation script.
- [Risk] Existing in-progress changes under the default schema become blocked until `test-plan.md` exists. -> This follows the prior execution-plan migration pattern; missing artifact messages should explicitly say to create the test plan with `/sp:continue`.
- [Risk] Tests that require browsers, external services, or platform-specific environments may be infeasible. -> `test-plan.md` allows manual or deferred coverage only with explicit rationale and safer alternative verification where possible.
- [Risk] Dirty worktrees make diff auditing ambiguous. -> Hardening instructions must scope to relevant diff and pause when unrelated changes cannot be separated safely.

## Migration Plan

1. Add failing tests for schema graph ordering, status/apply requirements, template discovery, and apply context including `test-plan`.
2. Add failing tests for generated apply workflow text, including Test Hardening stage and TDD-vs-hardening distinction.
3. Add failing tests for schema init selecting `test-plan`.
4. Add `test-plan` to the default schema and template set.
5. Update execution-plan and workflow templates.
6. Update schema init support.
7. Update user-facing docs for `/sp:apply` completion semantics.
8. Run targeted tests, then full suite.

Rollback is straightforward: remove the `test-plan` artifact and template, restore `apply.requires: [execution-plan]`, and revert generated workflow/schema-init text changes.

## Open Questions

None for the initial implementation.
