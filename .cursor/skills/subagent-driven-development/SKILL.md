---
name: subagent-driven-development
description: Use when executing implementation plans with independent tasks in the current session
---

# Subagent-Driven Development

Execute a change plan through logical dispatch units. Detailed checkboxes track progress; a complete dispatch unit is the unit of dispatch, handoff, and integration.

**Core principle:** Coherent dispatch units + worker self-review + one final cross-unit integration review = focused execution without repetitive local reviews.

**Continuous execution:** Do not pause to check in with your human partner between tasks. Execute all tasks from the plan without stopping. The only reasons to stop are: BLOCKED status you cannot resolve, ambiguity that genuinely prevents progress, or all tasks complete. "Should I continue?" prompts and progress summaries waste their time — they asked you to execute the plan, so execute it.

## When to Use

**Use when:**
```
digraph when_to_use {
    "Have change proposal?" [shape=diamond];
    "Dispatch units have safe boundaries?" [shape=diamond];
    "Stay in this session?" [shape=diamond];
    "subagent-driven-development" [shape=box];
    "Manual execution or explore first" [shape=box];

    "Have change proposal?" -> "Dispatch units have safe boundaries?" [label="yes"];
    "Have change proposal?" -> "Manual execution or explore first" [label="no"];
    "Dispatch units have safe boundaries?" -> "Stay in this session?" [label="yes"];
    "Dispatch units have safe boundaries?" -> "sequential execute" [label="no - tightly coupled"];
    "Stay in this session?" -> "subagent-driven-development" [label="yes"];
    "Stay in this session?" -> "sequential execute" [label="no"];
}
```

## The Process

### Setup

1. Read the proposal, specs, design, `tasks.md`, and `execution-plan.md` once.
2. Use `execution-plan.md` to identify ownership, dependencies, and safe parallelism.
3. In `tasks.md`, a heading in the form `# <number>. <scope>` is a logical dispatch-unit boundary, not a promise to dispatch a particular live subagent. 
4. If an existing task list has no dispatch-unit heading, preserve it and treat all incomplete tasks as one sequential dispatch unit.


### Per Dispatch Unit

1. Dispatch the complete dispatch unit with its task text, dependencies, ownership boundaries, assignee policy, and verification expectations. The coordinator may assign one unit to one subagent, combine compatible dispatch units in one assignment, or execute all dispatch units sequentially itself.
2. If a worker asks questions, resolve them before implementation.
3. The worker implements every detailed checkbox in the block, runs the planned checks, self-reviews, and reports changed files, verification, and concerns.
4. Integrate the completed package and mark its detailed checkboxes only after its own verification succeeds.
5. Dispatch in parallel only when the execution plan declares disjoint ownership and no unmet dependency. Serialize any overlap.

### Completion

After all dispatch units are integrated:
1. Dispatch one final cross-unit integration review for the complete diff, requirements, unit interactions, code quality, and test coverage.
2. Fix blocking findings and run targeted verification. Do not start a second complete review unless the reviewer explicitly requests confirmation of a specified finding.
3. Run the full verification defined by the change, then use `superpowers: verification-before-completion` and `superpowers: finishing-a-development-branch`.

## Prompt Templates

Each dispatch needs:
- **Implementer:** The full dispatch unit, context, dependencies, ownership boundaries, assignee policy, and verification commands.
- **Final reviewer:** The complete integrated diff, all dispatch-unit reports, original requirements, and change-level base/head SHAs.

## Red Flags

**Never:**
- Start implementation on main/master branch without explicit user consent
- Skip worker verification, self-review, or the final integration review
- Proceed with unfixed blocking findings
- Dispatch parallel dispatch units with overlapping ownership or unmet dependencies
- Make a worker infer its dispatch unit instead of providing its full text
- Treat a dispatch-unit heading or legacy `agent<logical-id>` label as a required subagent identity

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

**Subagents should use:**
- **superpowers:test-driven-development** — Subagents follow TDD for each task

## Advantages vs Manual Execution

- Dispatch-unit context stays coherent while detailed progress remains visible
- The coordinator can safely choose parallel, combined, or inline execution
- Workers surface questions before changing code
- Self-review catches local issues before integration
- One final review focuses on the interactions that local reviews cannot see
