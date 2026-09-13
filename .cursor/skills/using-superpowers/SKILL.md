---
name: using-superpowers
description: Use when choosing Direct Modification vs Proposal → Review → Apply, and when deciding whether and how to bound Change Proposals
---

# Use Superpowers

Load a skill when the current task matches that skill's description or the user names it. Do not inspect the whole skill library before answering, clarifying, or inspecting the repository.

Then select the work mode from risk, scope, workload, ambiguity, reversibility, and verification needs. Schema YAML, artifact directory trees, and the six-dimension scoring table live in [reference/schema-and-workload.md](reference/schema-and-workload.md); read that file when sizing a Proposal, not for every mode choice.

## Select one of exactly two work modes

Exactly two work modes exist:

1. **Direct Modification** — Implement low-risk, local, unambiguous, reversible work directly, then run relevant checks and apply `verification-before-completion` before claiming success.
2. **Proposal → Review → Apply** — Create the required artifacts, review them, and run `/sp:apply`. Apply retains schema-aware review, Test Hardening, and Apply's Final Quality Gates (`/sp:apply`).

A requested plan is an execution aid inside the selected mode, not a third mode. If the work still qualifies for Direct Modification after a plan is written or approved, execute it directly. Do not add a Plan Mode artifact or schema.

Prompt length and file count are not selection rules. A short request can be high risk; a long request can still be one local edit.

### Use Direct Modification only when all applicable conditions hold

- The requested outcome is clear and bounded.
- The edit is local, reversible, and low risk.
- It does not introduce an externally visible capability, public contract, migration, or cross-module architecture change.
- It does not alter authentication, authorization, billing, persisted data integrity, recovery behavior, or another security/data boundary.
- Its workload remains below the Proposal boundary and has a clear verification path.

Direct work still requires applicable unit, integration, E2E, and visual checks. For automated tests, prefer Git-related tests when the runner supports Git-aware selection. If Git-aware selection is unavailable, record that limitation and use the matching-stage focused command; do not require a complete suite. For a direct UI change, exercise the runnable user journey and inspect applicable visual-design rules without pretending that an Apply artifact lifecycle was completed.

### Require Proposal → Review → Apply for any override

- **Explicit Proposal request:** create a Proposal whenever the user asks for one.
- Add a new externally visible capability or change a public contract.
- Change a persisted data model or migration, authentication or authorization, billing, data integrity or recovery, or another security boundary.
- Introduce high-risk, cross-cutting, ambiguous, or difficult-to-reverse behavior.
- Introduce a material multi-agent ownership surface, require substantial coordination, or exceed the workload budget below.

Risk and contract overrides require a Proposal even when the numeric workload score is small.

### Promote before further edits

While working directly, stop and promote to one or more Proposals before further edits when investigation reveals:

- a new public contract, migration, authentication or authorization, billing, data integrity or recovery concern;
- multiple large implementation surfaces or multiple dependency waves;
- repeated broad context rereads, uncertain cross-boundary behavior, or workload that exceeds the Proposal budget.

Preserve what was learned, explain the boundary that was crossed, and do not silently continue expanding the direct session.

## Persist until the requested outcome

When the user asks to implement, fix, check, or continue, keep going until that outcome is done or a pause condition below applies. Do not stop after a first draft or a natural phase solely to ask whether to continue.

Pause for confirmation when the next step would rewrite Git history, force-push, change production, publish something that cannot be easily withdrawn, or when missing information would change a product, security, billing, or public-contract decision. Do not pause for read-only search, in-scope code edits, local build, tests, repairing failures caused by this change, or already authorized git add/commit/push.

## Keep Change Proposals and Dispatch Units distinct

A **Change Proposal** is the context, workload, acceptance, and archive boundary. It groups a coherent outcome that can be reviewed and completed without context rot.

A **Dispatch Unit** is an ownership, dependency, and safe-parallelism boundary inside one Proposal. It may span several detailed task checkboxes. It is not a live agent identity, not a checkbox-sized timebox, and not independently archivable. Creating another worker is an execution choice; it does not create another Dispatch Unit or Proposal.

First partition the request into workload-bounded Proposals. Only then define each Proposal's Dispatch Units in `tasks.md` and its ownership, dependencies, parallelism, and handoff in `execution-plan.md`.

Do not promote an implementation slice to a Proposal merely to assign a different worker. Promote it only when it needs its own workload/context and acceptance/archive boundary.

## Decompose long-running work

For a large or multi-session request:

1. Inventory logical capabilities and score each across all six dimensions (see [reference/schema-and-workload.md](reference/schema-and-workload.md)).
2. Apply risk/contract overrides before numeric grouping.
3. Combine compatible bounded work and split multiple large capabilities.
4. Find stable, independently testable milestones for every very large capability; document any atomic single-Proposal exception.
5. For every Proposal in the set, record its **prerequisite**, what it **unblocks**, and the **stable interface** or artifact handed to dependents.
6. Put a shared foundation in its own Proposal only when independently testable and substantial; otherwise implement it in the first dependent Proposal and reference that prerequisite later.
7. Define Dispatch Units within each Proposal by owned paths, dependency waves, and integration handoffs.
8. Run Proposals in parallel only when there is no unmet dependency and no shared mutable ownership. If integration or shared files introduce a dependency, serialize the affected work.

Reassess boundaries when estimates materially change. Update an active Proposal when intent stays the same and the revised work still fits; create or stage another Proposal when the workload/context boundary no longer holds.
