---
name: requesting-code-review
description: Use when completing tasks, implementing major features, or before merging to verify work meets requirements
---

# Requesting Code Review

Dispatch a code-reviewer subagent to catch issues before they cascade.

**Core principle:** Review at a meaningful delivery boundary with enough integrated context to assess real risk.

## When to Request Review

**Mandatory:**
- Once after all dispatch units are integrated in subagent-driven development
- After completing major feature
- Before merge to main

**Optional but valuable:**
- When stuck (fresh perspective)
- Before refactoring (baseline check)
- After fixing complex bug

## How to Request

**1. Get git SHAs:**
```bash
BASE_SHA=$(git rev-parse HEAD~1)  # or origin/main
HEAD_SHA=$(git rev-parse HEAD)
```

**2. Dispatch code-reviewer subagent with context:**

Provide:
- `WHAT_WAS_IMPLEMENTED` - What you just built
- `PLAN_OR_REQUIREMENTS` - What it should do (reference `superpowers/changes/<change-name>/` for proposals)
- `BASE_SHA` - Starting commit
- `HEAD_SHA` - Ending commit
- `DESCRIPTION` - Brief summary

**3. Act on feedback:**
- Fix Critical issues immediately
- Fix Important issues before proceeding
- Note Minor issues for later
- Push back if reviewer is wrong (with reasoning)

## Integration with Workflows

**Subagent-Driven Development:**
- Workers verify and self-review their own complete dispatch units.
- Review once after all dispatch units are integrated.
- Fix blocking findings and run targeted verification; do not restart a complete review unless the reviewer explicitly requests confirmation of a specified finding.

**Applying Changes (`/sp:apply`):**
- Review after each batch (3 tasks)
- Get feedback, apply, continue

**Ad-Hoc Development:**
- Review before merge
- Review when stuck

## Red Flags

**Never:**
- Skip review because "it's simple"
- Ignore Critical issues
- Proceed with unfixed Important issues
- Argue with valid technical feedback

**If reviewer wrong:**
- Push back with technical reasoning
- Show code/tests that prove it works
- Request clarification
