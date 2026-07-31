# Final Integration Reviewer Prompt Template

Use this template when dispatching the single formal reviewer after all dispatch units are integrated.

**Purpose:** Verify the integrated change satisfies requirements and that package boundaries work together cleanly, safely, and maintainably.

**Only dispatch after all dispatch units are integrated and their local verification has passed.**

```
Task tool (superpowers:code-reviewer):
  Use template at requesting-code-review/code-reviewer.md

  WHAT_WAS_IMPLEMENTED: [summaries from every integrated dispatch unit]
  PLAN_OR_REQUIREMENTS: [proposal, specs, design, tasks.md, and execution-plan.md]
  BASE_SHA: [commit before the change]
  HEAD_SHA: [current commit]
  DESCRIPTION: [integrated change summary and package interaction points]
```

**Reviewer returns:** Strengths, Issues (Critical/Important/Minor), Assessment, and any explicitly requested targeted confirmation after fixes. The coordinator runs targeted verification for fixes; a second complete review is not automatic.
