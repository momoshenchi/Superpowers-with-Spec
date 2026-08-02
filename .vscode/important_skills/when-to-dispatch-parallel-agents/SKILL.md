---
name: when-to-dispatch-parallel-agents
description: Use when deciding whether to parallelize 2+ independent investigations or Dispatch Units under Direct Modification or Proposal → Review → Apply
---

# When to Dispatch Parallel Agents

**Core principle:** Parallelize only across disjoint ownership with no unmet dependencies. First pick the work mode; then decide whether and how to dispatch.

## Choose the Work Mode First

Exactly two modes (see `using-superpowers`):

| Mode | When | Parallel agents? |
| --- | --- | --- |
| **Direct Modification** | Clear, local, reversible, low-risk; no new public contract / security-data boundary / migration | Rare — only for independent investigations (e.g. unrelated failing test files) |
| **Proposal → Review → Apply** | New capability, public contract, security/data boundary, ambiguous/cross-cutting, or workload above the Proposal budget | Default path for multi-unit work: define Dispatch Units, then dispatch |

If Direct work hits a Proposal trigger (contract, migration, multi-wave ownership, context rot), **stop editing and promote** — do not “parallelize your way out” of the boundary.

## When to Use

**Direct Modification — use parallel agents when:**
- 3+ failing test files / subsystems with different root causes
- Each problem is understandable without the others’ context
- No shared mutable files or resources between investigations
- Scope stays inside Direct Modification after the fix

**Proposal → Review → Apply — use parallel agents when:**
- `tasks.md` has 2+ Dispatch Units (`# <number>. <scope>`) with disjoint owned paths
- `execution-plan.md` marks them parallel-eligible and dependencies are satisfied
- Each unit has a coherent handoff and its own verification

**Recommended assignee policy (Proposal):** **one Dispatch Unit → one subagent.** Record this in the Dispatch Coordination table. Do not split a unit across agents, and do not treat checkbox tasks as separate dispatches. Combining units or running inline remains a fallback when parallelism is unsafe or cost exceeds benefit — not the default recommendation when units are already well-bounded.

## When NOT to Use

| Signal | Do this instead |
| --- | --- |
| Related failures (fixing one may fix others) | Investigate together first |
| Shared files / overlapping ownership | Serialize or redefine units |
| Unmet dependency between units | Wait for the prerequisite unit |
| Exploratory / unknown root cause | Explore sequentially until domains separate |
| Still qualifies as one small Direct edit | Stay Direct; no Proposal, no parallel circus |
| Should be a Proposal but none exists yet | `/sp:propose` first; dispatch only at Apply |
| Tempted to parallelize to avoid promoting | Promote — parallelism is not a substitute for a Change Proposal |

## After Agents Return

1. Review each summary — what changed and why
2. Check for ownership conflicts — same files edited?
3. Run the full relevant suite — fixes must compose
4. Spot-check — agents can share systematic mistakes
5. On Proposal Apply: one final cross-unit integration review after all units integrate (see `when-to-dispatch-code-review`)
