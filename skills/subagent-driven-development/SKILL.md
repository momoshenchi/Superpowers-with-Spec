---
name: subagent-driven-development
description: Use when executing implementation plans with independent tasks in the current session
---

# Subagent-Driven Development

Execute a change plan through logical work packages. Detailed checkboxes track progress; a complete work-package block is the unit of dispatch, handoff, and integration.

**Core principle:** Coherent work packages + worker self-review + one final cross-package integration review = focused execution without repetitive local reviews.

**Continuous execution:** Do not pause to check in with your human partner between tasks. Execute all tasks from the plan without stopping. The only reasons to stop are: BLOCKED status you cannot resolve, ambiguity that genuinely prevents progress, or all tasks complete. "Should I continue?" prompts and progress summaries waste their time — they asked you to execute the plan, so execute it.

## When to Use

**Use when:**
```
digraph when_to_use {
    "Have change proposal?" [shape=diamond];
    "Work packages have safe boundaries?" [shape=diamond];
    "Stay in this session?" [shape=diamond];
    "subagent-driven-development" [shape=box];
    "Manual execution or explore first" [shape=box];

    "Have change proposal?" -> "Work packages have safe boundaries?" [label="yes"];
    "Have change proposal?" -> "Manual execution or explore first" [label="no"];
    "Work packages have safe boundaries?" -> "Stay in this session?" [label="yes"];
    "Work packages have safe boundaries?" -> "sequential execute" [label="no - tightly coupled"];
    "Stay in this session?" -> "subagent-driven-development" [label="yes"];
    "Stay in this session?" -> "sequential execute" [label="no"];
}
```

## The Process

### Setup

1. Read the proposal, specs, design, `tasks.md`, and `execution-plan.md` once.
2. Use `execution-plan.md` to identify ownership, dependencies, and safe parallelism.
3. In `tasks.md`, a heading in the form `# <work-package-number>. agent<logical-id> — <scope>` is a logical work-package boundary, not a promise to dispatch a particular live subagent.
4. If an existing task list has no work-package heading, preserve it and treat all incomplete tasks as one sequential work package.


### Per Work Package

1. Dispatch the complete work-package block with its task text, dependencies, ownership boundaries, and verification expectations. The coordinator may assign one block to one subagent, combine compatible work packages in one assignment, or execute all work packages sequentially itself.
2. If a worker asks questions, resolve them before implementation.
3. The worker implements every detailed checkbox in the block, runs the planned checks, self-reviews, and reports changed files, verification, and concerns.
4. Integrate the completed package and mark its detailed checkboxes only after its own verification succeeds.
5. Dispatch in parallel only when the execution plan declares disjoint ownership and no unmet dependency. Serialize any overlap.

### Completion

After all work packages are integrated:
1. Dispatch one final cross-package integration review for the complete diff, requirements, package interactions, code quality, and test coverage.
2. Fix blocking findings and run targeted verification. Do not start a second complete review unless the reviewer explicitly requests confirmation of a specified finding.
3. Run the full verification defined by the change, then use `superpowers: verification-before-completion` and `superpowers: finishing-a-development-branch`.

## Prompt Templates

Each dispatch needs:
- **Implementer:** The full work-package block, context, dependencies, ownership boundaries, and verification commands.
- **Final reviewer:** The complete integrated diff, all work-package reports, original requirements, and change-level base/head SHAs.

## Red Flags

**Never:**
- Start implementation on main/master branch without explicit user consent
- Skip worker verification, self-review, or the final integration review
- Proceed with unfixed blocking findings
- Dispatch parallel work packages with overlapping ownership or unmet dependencies
- Make a worker infer its work-package block instead of providing its full text
- Treat an `agent<logical-id>` label as a required subagent identity

**If subagent asks questions:**
- Answer clearly and completely
- Don't rush them into implementation

**If the final reviewer finds issues:**
- The coordinator assigns or implements the fix.
- Run the targeted verification named by the finding.
- Request reviewer confirmation only when the reviewer explicitly asked for it; do not repeat a full review by default.

## Integration

**Required:**
- **superpowers:using-git-worktrees** — REQUIRED: Set up isolated workspace before starting
- `/sp:propose` — Creates the plan this skill executes
- **superpowers:requesting-code-review** — Code review template for reviewer subagents
- `/sp:archive` — Complete development after all tasks

**Subagents should use:**
- **superpowers:test-driven-development** — Subagents follow TDD for each task

## Advantages vs Manual Execution

- Work-package context stays coherent while detailed progress remains visible
- The coordinator can safely choose parallel, combined, or inline execution
- Workers surface questions before changing code
- Self-review catches local issues before integration
- One final review focuses on the interactions that local reviews cannot see
