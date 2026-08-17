---
name: subagent-driven-development
description: Use when executing implementation plans with independent tasks in the current session
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
2. **Proposal → Review → Apply** — Create the required artifacts, review them, and run `/sp:apply`. Apply retains schema-aware review, Test Hardening, and the final gate order: code review → Simplify → Verify → Design Verify.

Direct Modification does not create a Change Proposal or Dispatch Unit merely to invoke SDD. Use the SDD dispatch-unit loop only when the selected Proposal → Review → Apply path has assignable implementation units. Proposal → Review → Apply owns Dispatch Unit execution through `/sp:apply`; the coordinator still chooses whether each unit is delegated, combined, or executed inline.

### Superpowers apply

#### Setup

1. Read the proposal, specs, design, `tasks.md`, and `execution-plan.md` once.
2. Use `execution-plan.md` to identify ownership, dependencies, and safe parallelism.
3. In `tasks.md`, a heading in the form `# <number>. <scope>` is a logical dispatch-unit boundary, not a promise to dispatch a particular live subagent. 
4. If an existing task list has no dispatch-unit heading, preserve it and treat all incomplete tasks as one sequential dispatch unit.
5. Read any existing `Implementation Notes` in the relevant dispatch unit as non-normative context. Keep `tasks.md` as the only progress source and do not infer completion from notes.

#### Per Dispatch Unit

1. Dispatch the complete dispatch unit with its task text, dependencies, ownership boundaries, assignee policy, and verification expectations. The coordinator may assign one unit to one subagent, combine compatible dispatch units in one assignment, or execute all dispatch units sequentially itself.
2. If a worker asks questions, resolve them before implementation.
3. The worker implements every detailed checkbox in the block, runs the planned checks, self-reviews, and reports changed files, verification, and concerns. After each Step 1–5, the worker may append concise `Implementation Notes` directly below the step when there is a meaningful finding, reasoning point, viewpoint / trade-off, or summary / takeaway. 
4. The main agent reviews the worker's `Implementation Notes` against the diff, planned verification, and handoff concerns before marking detailed checkboxes. Notes help explain the work but do not substitute for tests, self-review, or acceptance evidence.
5. Dispatch in parallel only when the execution plan declares disjoint ownership and no unmet dependency. Serialize writes to shared execution-plan.md.


### Final Quality Gates

Within `/sp:apply`, after all dispatch units are integrated, complete Test Hardening and then delegate the Final Quality Gates in exactly this order:

1. **code review**
2. **Simplify**
3. **Verify**
4. **Design verify**

#### Subagent allocation

These gates apply to Proposal → Review → Apply. The allocation rule is **one gate → one fresh worker**: await and integrate its report before dispatching the next gate. Direct Modification ends with its relevant checks and `verification-before-completion`; it does not inherit Apply's gate sequence.

Code review, Verify, and Design verify workers are read-only by default; the coordinator repairs accepted findings and follows the Apply severity and retry rules. When the coordinator accepts a code-review or Verify P0/P1 and edits implementation, it MUST create or append `remediations.md` under the change directory first (see Apply Final Quality Gates remediations rules). Simplify may edit only within its behavior-preserving cleanup boundary. Do not dispatch a separate complete review before or after Apply's code review gate.

Only after all applicable Final Quality Gates are complete, use `superpowers: verification-before-completion` with fresh evidence, then use `superpowers: finishing-a-development-branch`.

## Prompt Templates

Each dispatch needs:
- **Implementer:** The full dispatch unit, context, dependencies, ownership boundaries, assignee policy, and verification commands.
- **Handoff:** Changed files, verification results, self-review, concerns, and any interaction boundary for the coordinator and Apply quality-gate workers.

## Red Flags

**Never:**
- Start implementation on main/master branch without explicit user consent
- Skip worker verification, self-review, or Apply's Final Quality Gates
- Dispatch a separate complete review before or after Apply's code review gate
- Use `verification-before-completion` or `finishing-a-development-branch` before all applicable Final Quality Gates are complete
- Proceed with unfixed blocking findings
- Dispatch parallel dispatch units with overlapping ownership or unmet dependencies
- Make a worker infer its dispatch unit instead of providing its full text
- Treat a dispatch-unit heading or legacy `agent<logical-id>` label as a required subagent identity

**If subagent asks questions:**
- Answer clearly and completely
- Don't rush them into implementation

**If a quality-gate worker finds issues:**
- The coordinator evaluates and repairs accepted findings.
- Run the targeted verification named by the finding.
- Follow the Apply gate's retry boundary; do not restart earlier gates without an explicit retry rule.
