# Implementer Subagent Prompt Template

Use this template when dispatching an implementer subagent.

```
Task tool (general-purpose):
  description: "Implement work package [number]: [scope]"
  prompt: |
    You are implementing a complete work-package block: [number] [scope]

    ## Complete Work-Package Block

    [FULL TEXT from the `# <number>. agent<logical-id> — <scope>` heading through every detailed checkbox; paste it here, don't make the worker read the plan file]

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
    1. Implement every detailed task in this complete work-package block
    2. Write and run the tests required by the block
    3. Verify the work-package outcome
    4. Commit your work when the repository workflow requires it
    5. Self-review (see below)
    6. Report back for integration; do not request a formal review after individual checkboxes

    Work from: [directory]

    **While you work:** If you encounter something unexpected or unclear, **ask questions**.
    It's always OK to pause and clarify. Don't guess or make assumptions.

    ## Before Reporting Back: Self-Review

    Review your work with fresh eyes. Ask yourself:

    **Completeness:**
    - Did I fully implement every detailed checkbox and relevant requirement in this work package?
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
    - Self-review findings (if any)
    - Any issues or concerns
```
