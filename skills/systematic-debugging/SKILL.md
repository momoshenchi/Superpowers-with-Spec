---
name: systematic-debugging
description: Use when the root cause is unknown, reproduction is unstable, or previous patches failed. Skip four-phase when the failing test or compiler already identified the cause; still re-run the failing test after the fix.
---

# Systematic Debugging

## Overview

Random fixes waste time and create new bugs. Quick patches mask underlying issues.

**Core principle:** When the cause is unknown, find root cause before stacking patches. Symptom-only guessing is failure.

## When to Use

Use the four-phase process when:
- The root cause is unknown
- Reproduction is unstable or intermittent
- Previous patches already failed

**Skip four-phase when the cause is already identified** in the current test output or compiler diagnostic (for example a named assertion that points at the edited function and expected value). Fix that cause directly. Still re-run the failing test after the fix. Do not write a four-phase checkpoint for a one-turn localized failure.

**Use four-phase ESPECIALLY when:**
- Under time pressure (emergencies make guessing tempting)
- "Just one quick fix" seems obvious but you cannot name the cause
- You've already tried multiple fixes
- Previous fix didn't work
- You don't fully understand the issue

Keep the Debug Checkpoint for multi-turn unknown-cause work, context compaction, or a fresh-worker handoff. A short one-turn investigation of an already-identified failure may omit it.

## The Four Phases

When four-phase investigation applies, complete each phase before proceeding to the next. See `root-cause-tracing.md` in this directory for the backward-tracing technique. Do not use four-phase as a gate on an already-identified, localized failure.

Four-phase procedure and Debug Checkpoint ledgers live in [reference/four-phase-and-checkpoint.md](reference/four-phase-and-checkpoint.md). Do not load that file for an already-identified localized failure.
