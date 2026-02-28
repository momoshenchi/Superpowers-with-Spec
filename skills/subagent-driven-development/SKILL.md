---
name: subagent-driven-development
description: Use when executing implementation plans with independent tasks in the current session
---

# Subagent-Driven Development

Execute plan by dispatching fresh subagent per task, with two-stage review after each: spec compliance review first, then code quality review.

**Core principle:** Fresh subagent per task + two-stage review (spec then quality) = high quality, fast iteration

## When to Use

**Use when:**
- You have an independent tasks
- Tasks can be worked on sequentially without tight coupling
- You want to stay in the current session (vs. parallel agents)

**vs. Parallel Agents:**
- Same session (no context switch)
- Fresh subagent per task (no context pollution)
- Two-stage review after each task: spec compliance first, then code quality
- Faster iteration (no human-in-loop between tasks)

## The Process

### Setup

1. Read plan file (`superpowers/changes/<change-name>/`) once
2. Extract all tasks with full text and context
3. Create task list with all tasks

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
ß
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
