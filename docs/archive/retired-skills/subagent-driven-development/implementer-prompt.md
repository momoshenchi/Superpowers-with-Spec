# Implementer Subagent Prompt Template

Use this template when dispatching an implementer subagent.

```
Task tool (general-purpose):
  description: "Implement dispatch unit [number]: [scope]"
  prompt: |
    You are implementing a complete dispatch unit: [number] [scope]

    ## Complete Dispatch Unit

    [FULL TEXT from the `# <number>. <scope>` heading (or legacy `# <number>. agent<logical-id> — <scope>`) through every detailed checkbox; paste it here, don't make the worker read the plan file]

    ## Context

    [Scene-setting: where this fits, dependencies, architectural context, file ownership boundaries, and verification commands]

    ## Before You Begin

    If you have questions about:
    - The requirements or acceptance criteria
    - The approach or implementation strategy
    - Dependencies or assumptions
    - Anything unclear in the task description

    **Ask them now.** Raise any concerns before starting work.

    ## Your Job

    Once you're clear on requirements:
    1. Implement every detailed task in this complete dispatch unit
    2. Write and run the tests required by the block
    3. Verify the dispatch-unit outcome
    4. Commit your work when the repository workflow requires it
    5. Self-review (see below)
    6. Report back for integration; do not request a formal review after individual checkboxes

    **Implementation Notes while working:**
    - Read any existing `Implementation Notes` in this dispatch unit before starting; they are non-normative context, not progress state.
    - Keep `tasks.md` as the only progress source; notes explain the work but do not define completion.
    - After each Step 1–5, append concise notes directly below that step when the work produces a useful finding, reasoning point, viewpoint / trade-off, or summary / takeaway.
    - Use the labels `Findings`, `Reasoning`, `Viewpoints / Trade-offs`, and `Summary / Takeaway` when they make the insight easy to review.
    - Do not turn notes into a status tracker, add task checkboxes, or rewrite the planned steps. Use exact file, symbol, command, or test anchors when they make a note auditable.
    - When dispatch units run in parallel, do not overwrite another dispatch unit's notes. Return note content to the coordinator when shared-file writes must be serialized.

    Work from: [directory]

    **While you work:** If you encounter something unexpected or unclear, **ask questions**.
    It's always OK to pause and clarify. Don't guess or make assumptions.

    ## Before Reporting Back: Self-Review

    Review your work with fresh eyes. Ask yourself:

    **Completeness:**
    - Did I fully implement every detailed checkbox and relevant requirement in this dispatch unit?
    - Did I miss any requirements?
    - Are there edge cases I didn't handle?

    **Quality:**
    - Is this my best work?
    - Are names clear and accurate (match what things do, not how they work)?
    - Is the code clean and maintainable?

    **Discipline:**
    - Did I avoid overbuilding (YAGNI)?
    - Did I only build what was requested?
    - Did I follow existing patterns in the codebase?
    - Did I capture the meaningful implementation insights under the relevant steps without turning them into progress state?

    **Testing:**
    - Do tests actually verify behavior (not just mock behavior)?
    - Did I follow TDD if required?
    - Are tests comprehensive?

    If you find issues during self-review, fix them now before reporting.

    ## Report Format

    When done, report:
    - What you implemented
    - What you tested and test results
    - Files changed
    - Implementation insights: findings, reasoning, viewpoints / trade-offs, and summary / takeaway
    - Self-review findings (if any)
    - Any issues or concerns
```
