---
name: subagent-driven-development
description: Use when executing Apply dispatch units during `/sp:apply` (combine, inline, or spawn). Do not use as an independent implementation entry outside Apply.
---

# Subagent-Driven Development

Execute a change plan through logical dispatch units. Detailed checkboxes track progress; a complete dispatch unit is the unit of dispatch, handoff, and integration.

**Core principle:** Coherent dispatch units + worker self-review + Apply-owned Final Quality Gates = focused execution without duplicate complete reviews.

**Continuous execution:** Do not pause to check in with your human partner between tasks. Execute all tasks from the plan without stopping. The only reasons to stop are: BLOCKED status you cannot resolve, ambiguity that genuinely prevents progress, or all tasks complete. "Should I continue?" prompts and progress summaries waste their time — they asked you to execute the plan, so execute it.

## When to Use

**Use when:**
```
digraph when_to_use {
    "Have change proposal?" [shape=diamond];
    "Dispatch units have safe boundaries?" [shape=diamond];
    "Stay in this session?" [shape=diamond];
    "subagent-driven-development" [shape=box];
    "Manual execution, Explore, or Debug first" [shape=box];

    "Have change proposal?" -> "Dispatch units have safe boundaries?" [label="yes"];
    "Have change proposal?" -> "Manual execution, Explore, or Debug first" [label="no"];
    "Dispatch units have safe boundaries?" -> "Stay in this session?" [label="yes"];
    "Dispatch units have safe boundaries?" -> "sequential execute" [label="no - tightly coupled"];
    "Stay in this session?" -> "subagent-driven-development" [label="yes"];
    "Stay in this session?" -> "sequential execute" [label="no"];
}
```

## Work Mode

Choose one of exactly two work modes before deciding whether SDD dispatch is needed:

1. **Direct Modification** — Implement low-risk, local, unambiguous, reversible work directly, then run relevant checks and apply `verification-before-completion` before claiming success.
2. **Proposal → Review → Apply** — Create the required artifacts, review them, and run `/sp:apply`. Apply retains schema-aware review, Test Hardening, and Apply's Final Quality Gates (`/sp:apply`).

Direct Modification does not create a Change Proposal or Dispatch Unit merely to invoke SDD. Use the SDD dispatch-unit loop only when the selected Proposal → Review → Apply path has assignable implementation units. Proposal → Review → Apply owns Dispatch Unit execution through `/sp:apply`; the coordinator still chooses whether each unit is delegated, combined, or executed inline.

This skill is Apply dispatch guidance only. It is not an independent implementation entry skill. Follow `/sp:apply` for completion rules, Test Hardening, and Final Quality Gates.

### Superpowers apply

#### Setup

1. Give each worker the current-unit context: that unit's ownership, task text, and the spec/design slices it cites. Do not require reading every change artifact before the first unit.
2. Use `execution-plan.md` to identify ownership, dependencies, and safe parallelism.
3. In `tasks.md`, a heading in the form `# <number>. <scope>` is a logical dispatch-unit boundary, not a promise to dispatch a particular live subagent.
4. If an existing task list has no dispatch-unit heading, preserve it and treat all incomplete tasks as one sequential dispatch unit.
5. Read any existing `Implementation Notes` in the relevant dispatch unit as non-normative context. Keep `tasks.md` as the only progress source and do not infer completion from notes.

#### Per Dispatch Unit

1. Dispatch the complete dispatch unit with its task text, dependencies, ownership boundaries, assignee policy, and verification expectations. The coordinator may assign one unit to one subagent, combine compatible dispatch units in one assignment, or execute all dispatch units sequentially itself. Inline execution is valid when the host cannot spawn a worker; do not block the unit on missing spawn.
2. If a worker asks questions, resolve them before implementation.
3. The worker implements every detailed checkbox in the block, runs the planned checks, self-reviews, and reports changed files, verification, and concerns. After each Step 1–5, the worker may append concise `Implementation Notes` directly below the step when there is a meaningful finding, reasoning point, viewpoint / trade-off, or summary / takeaway.
4. The main agent reviews the worker's `Implementation Notes` against the diff, planned verification, and handoff concerns before marking detailed checkboxes. Notes help explain the work but do not substitute for tests, self-review, or acceptance evidence.
5. Dispatch in parallel only when the execution plan declares disjoint ownership and no unmet dependency. Serialize writes to shared execution-plan.md.

After units are integrated, Apply owns Test Hardening and the Final Quality Gates. Do not restate those gates here; follow `/sp:apply`. Do not dispatch a separate complete review before or after Apply's code review gate.

## Prompt Templates

Each dispatch needs:
- **Implementer:** The full dispatch unit, context, dependencies, ownership boundaries, assignee policy, and verification commands.
- **Handoff:** Changed files, verification results, self-review, concerns, and any interaction boundary for the coordinator and Apply quality-gate workers.

## Red Flags

**Never:**
- Start implementation on main/master branch without explicit user consent
- Skip worker verification, self-review, or Apply's Final Quality Gates
- Dispatch a separate complete review before or after Apply's code review gate
- Use `verification-before-completion` or `finishing-a-development-branch` before Apply's applicable Final Quality Gates are complete
- Proceed with unfixed blocking findings
- Dispatch parallel dispatch units with overlapping ownership or unmet dependencies
- Make a worker infer its dispatch unit instead of providing its full text
- Treat a dispatch-unit heading or legacy `agent<logical-id>` label as a required subagent identity

**If subagent asks questions:**
- Answer clearly and completely
- Don't rush them into implementation

**If a quality-gate worker finds issues:**
- Hand the finding to Apply's coordinator-repair path. Do not restate Apply severity or retry policy here.
