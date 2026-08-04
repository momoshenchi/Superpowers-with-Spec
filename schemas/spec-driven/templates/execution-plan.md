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

### 1. [scope]

#### Task 1.1: [Detailed task description]

**Files:**
- Create / Modify / Test: `project-relative/path` — [responsibility]

1. **Step 1: Write or extend focused tests** — Cover the behavior, error paths, and acceptance criteria for Task 1.1.
2. **Step 2: Run the focused tests** — Record the expected failing behavior or the verified baseline when no new failing test is applicable.
3. **Step 3: Implement Task 1.1** — Make the complete change described by the detailed task.
4. **Step 4: Run focused verification** — Run the exact focused command and state the expected passing result.
5. **Step 5: Self-review and handoff** — Check the task against its requirements, report files and verification, then continue with the next detailed task in this dispatch unit.

#### Task 1.2: [Detailed task description]

Repeat Steps 1–5 with concrete files, tests, commands, expected results, and implementation detail for Task 1.2.


