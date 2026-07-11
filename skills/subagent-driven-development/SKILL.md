---
name: subagent-driven-development
description: Use when executing implementation plans with independent tasks in the current session
---

# Subagent-Driven Development

Execute plan by dispatching fresh subagent per task, with two-stage review after each: spec compliance review first, then code quality review.

**Core principle:** Fresh subagent per task + two-stage review (spec then quality) = high quality, fast iteration

**Continuous execution:** Do not pause to check in with your human partner between tasks. Execute all tasks from the plan without stopping. The only reasons to stop are: BLOCKED status you cannot resolve, ambiguity that genuinely prevents progress, or all tasks complete. "Should I continue?" prompts and progress summaries waste their time — they asked you to execute the plan, so execute it.

## When to Use

**Use when:**
```
digraph when_to_use {
    "Have change proposal?" [shape=diamond];
    "Tasks mostly independent?" [shape=diamond];
    "Stay in this session?" [shape=diamond];
    "subagent-driven-development" [shape=box];
    "Manual execution or explore first" [shape=box];

    "Have change proposal?" -> "Tasks mostly independent?" [label="yes"];
    "Have change proposal?" -> "Manual execution or explore first" [label="no"];
    "Tasks mostly independent?" -> "Stay in this session?" [label="yes"];
    "Tasks mostly independent?" -> "sequential execute" [label="no - tightly coupled"];
    "Stay in this session?" -> "subagent-driven-development" [label="yes"];
    "Stay in this session?" -> "sequential execute" [label="no"];
}
```

## The Process

### Setup

1. Read plan file (`superpowers/changes/<change-name>/`) once
2. 思考并检查任务之间的独立性


### Per Task

1. **Dispatch implementer subagent** with full task text + context
2. If subagent asks questions → answer clearly, then re-dispatch
3. Implementer implements, tests, commits, self-reviews
4. **Dispatch spec compliance reviewer** — confirms code matches spec
   - Issues found? Implementer fixes → reviewer reviews again
   - ✅ Spec compliant? Continue
5. **Dispatch code quality reviewer** — reviews code quality
   - Issues found? Implementer fixes → reviewer reviews again
   - ✅ Approved? Mark task complete
6. Move to next task

### Completion

After all tasks:
1. Dispatch final code reviewer for entire implementation
2. Use `superpowers: verification-before-completion` to verify everything is ready for completion
3. Use `superpowers: finishing-a-development-branch` to complete the development branch

## Prompt Templates

Each subagent dispatch needs:
- **Implementer:** Full task text, context, location in plan
- **Spec reviewer:** What was implemented, original spec/requirements
- **Code quality reviewer:** git SHAs (base and head), what was built

## Red Flags

**Never:**
- Start implementation on main/master branch without explicit user consent
- Skip reviews (spec compliance OR code quality)
- Proceed with unfixed issues
- Dispatch multiple implementation subagents in parallel (conflicts)
- Make subagent read plan file (provide full text instead)
- Accept "close enough" on spec compliance
- Skip review loops (reviewer found issues = implementer fixes = review again)
- **Start code quality review before spec compliance is ✅**

**If subagent asks questions:**
- Answer clearly and completely
- Don't rush them into implementation

**If reviewer finds issues:**
- Implementer (same subagent) fixes them
- Reviewer reviews again
- Repeat until approved

## Integration

**Required:**
- **superpowers:using-git-worktrees** — REQUIRED: Set up isolated workspace before starting
- `/sp:propose` — Creates the plan this skill executes
- **superpowers:requesting-code-review** — Code review template for reviewer subagents
- `/sp:archive` — Complete development after all tasks

**Subagents should use:**
- **superpowers:test-driven-development** — Subagents follow TDD for each task

## Advantages vs Manual Execution

- Subagents follow TDD naturally
- Fresh context per task (no confusion)
- Questions surfaced before work begins
- Self-review catches issues before handoff
- Two-stage review prevents over/under-building
