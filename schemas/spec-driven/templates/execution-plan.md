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

## Work-Package Coordination

`tasks.md` is the source of detailed, checkbox-tracked work. The agent headings in that file are logical work-package identifiers, not mandatory subagent identities. The coordinator may dispatch one block, combine compatible blocks, or execute every block sequentially.

| Task block | Ownership boundary | Dependencies | Parallel eligibility | Handoff evidence |
| --- | --- | --- | --- | --- |
| `# 1. agent1 — [scope]` | `path/to/owned-area` | None | Yes / No, with reason | Changed files, verification, self-review report |

## Execution Boundaries

### `# 1. agent1 — [scope]`

- Deliver every detailed checkbox in this task block.
- Respect the ownership boundary and dependencies above.
- Run the verification named by the detailed tasks and self-review before handoff.

## Work-Package Execution

Expand every detailed task from `tasks.md` beneath its work package. These steps explain how to execute a feature-scale task; they are not separate subagent assignments or required 2–5 minute units. Keep checkbox completion only in `tasks.md`.

### `# 1. agent1 — [scope]`

#### Task 1.1: [Detailed task description]

**Files:**
- Create / Modify / Test: `project-relative/path` — [responsibility]

1. **Step 1: Write or extend focused tests** — Cover the behavior, error paths, and acceptance criteria for Task 1.1.
2. **Step 2: Run the focused tests** — Record the expected failing behavior or the verified baseline when no new failing test is applicable.
3. **Step 3: Implement Task 1.1** — Make the complete change described by the detailed task.
4. **Step 4: Run package verification** — Run the exact focused command and state the expected passing result.
5. **Step 5: Self-review and handoff** — Check the task against its requirements, report files and verification, then continue with the next detailed task in this work package.

#### Task 1.2: [Detailed task description]

Repeat Steps 1–5 with concrete files, tests, commands, expected results, and implementation detail for Task 1.2.

## Final Integration Review and Validation

- Integrate all work packages before formal review.
- Perform one cross-package review of requirements, interactions, code quality, test coverage, and full-change verification.
- Fix blocking findings and run targeted verification. Do not restart a complete review unless the reviewer explicitly requests confirmation of a specified finding.
- Record post-implementation coverage gaps and Test Hardening evidence in `test-plan.md`.
