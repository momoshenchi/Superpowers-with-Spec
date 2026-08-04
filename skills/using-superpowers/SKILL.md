---
name: using-superpowers
description: Use when starting any conversation to select the proportional Superpowers work mode, decide whether and how to bound Change Proposals
---

# Use Superpowers

Check relevant or explicitly requested skills before any response or action, including clarification and repository inspection. Then select the work mode from risk, scope, workload, ambiguity, reversibility, and verification needs.

## Select one of exactly two work modes

Exactly two work modes exist:

1. **Direct Modification** — Implement low-risk, local, unambiguous, reversible work directly, then run relevant checks and apply `verification-before-completion` before claiming success.
2. **Proposal → Review → Apply** — Create the required artifacts, review them, and run `/sp:apply`. Apply retains schema-aware review, Test Hardening, and the final gate order: host-native code review → Simplify → Verify → Design Verify.

A requested plan is an execution aid inside the selected mode, not a third mode. If the work still qualifies for Direct Modification after a plan is written or approved, execute it directly. Do not add a Plan Mode artifact or schema.

Prompt length and file count are not selection rules. A short request can be high risk; a long request can still be one local edit.

### Use Direct Modification only when all applicable conditions hold

- The requested outcome is clear and bounded.
- The edit is local, reversible, and low risk.
- It does not introduce an externally visible capability, public contract, migration, or cross-module architecture change.
- It does not alter authentication, authorization, billing, persisted data integrity, recovery behavior, or another security/data boundary.
- Its workload remains below the Proposal boundary and has a clear verification path.

Direct work still requires applicable unit, integration, E2E, and visual checks. For a direct UI change, exercise the runnable user journey and inspect applicable visual-design rules without pretending that an Apply artifact lifecycle was completed.

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

### Diagnostic context boundaries during investigation

Repeated broad diagnostic rereads are a context-boundary signal even when the
work is still read-only. Before another diagnostic reread, create or update a
Debug Checkpoint with the current track statuses, Evidence IDs, exact anchors,
and one next decisive experiment. If the next step is only recovery, hand the
checkpoint to a fresh context; if the next step is implementation, use the
existing Proposal → Review → Apply or Direct Modification decision. 

## Size Proposals by workload

Estimate each logical capability separately across six dimensions. Assign `0–3` on every dimension using these common anchors: **0 = no meaningful contribution**, **1 = one local and familiar concern**, **2 = several related concerns or one non-trivial risk**, and **3 = broad, cross-boundary, or highly uncertain**.

| Dimension | 0 | 1 | 2 | 3 |
| --- | --- | --- | --- | --- |
| Implementation surface | No code change | One local implementation surface | Several related files/components | Broad or cross-module implementation |
| Layer breadth | One layer is unaffected | One familiar layer | Two or three connected layers | Many layers or system boundaries |
| Behavior complexity | No behavior logic | Straight-line familiar behavior | Branching, state, or non-trivial errors | Complex lifecycle, concurrency, or uncertain behavior |
| Verification cost | No new verification | One focused check | Several suites or one integration/E2E path | Broad suites, environments, or many E2E/risk paths |
| Orchestration cost | No coordination | One owner and no dependency | Several owners/units or one dependency wave | Multiple ownership boundaries or dependency waves |
| Context churn | No additional context | One small familiar area | Several related areas must be reread | Repeated broad rereads or likely context reconstruction |

Sum the six scores for each logical capability:

- `0–5`: small
- `6–10`: medium
- `11–14`: large
- `15+`: very large

These bands calibrate judgment; they are not a mechanical file-count gate. Estimate uncertainty honestly and prefer the higher anchor when an unknown is itself likely to consume context.

### Aggregate a practical Proposal budget

Sum compatible capability scores when considering one Proposal. Count a shared foundation once, at the boundary where it is actually implemented; dependent capabilities count only their incremental work.

A Proposal normally targets:

- a combined score of 14 or less;
- 3–5 Dispatch Units at most; and
- 2–3 dependency waves at most.

These are soft limits. Exceeding any one triggers reevaluation and likely splitting, while an atomic, independently untestable boundary may justify a documented exception.

### Combine or split by total work, not feature count

- **Combine small and medium work:** keep compatible fixes or features in one Proposal when their combined workload fits, one acceptance narrative remains coherent, and no risk/lifecycle boundary requires separation. Cross-feature names alone do not require separate Proposals.
- **Split multiple large capabilities:** normally create one bounded Proposal per large capability before planning Dispatch Units. Do not keep two large capabilities together merely because they ship in the same product.
- **Keep a small companion fix:** a large capability may absorb an adjacent small fix when it does not add a distinct coordination, verification, release, or environment burden.
- **Stage one very large capability:** split it into ordered, independently testable milestone Proposals when stable handoffs exist. Typical milestones are a foundation contract, core flow, and UI/integration.
- **Document a single-Proposal exception:** if milestone splitting would leave intermediate states untestable or misleading, keep one Proposal with staged Dispatch Units and dependency waves; do not add another large capability.
- Make shared foundation work its own Proposal only when it is independently testable and substantial. Otherwise place it in the first dependent Proposal.

Concrete calibration examples:

- Two small cross-feature fixes, such as correcting canvas generation and unblocking a stuck notification, may share one Proposal when their combined score and acceptance story fit.
- Two large capabilities, such as a canvas-management UI and message send/receive delivery, normally become two Proposals before their Dispatch Units are planned.
- A large capability may include a small companion fix when the companion adds no separate coordination or verification burden.
- A very large capability can be staged as foundation, core flow, and UI/integration Proposals when each milestone has a stable, testable handoff.
- Dispatch Units remain internal allocation boundaries: completing one does not create an independently archivable Proposal.

## Keep Change Proposals and Dispatch Units distinct

A **Change Proposal** is the context, workload, acceptance, and archive boundary. It groups a coherent outcome that can be reviewed and completed without context rot.

A **Dispatch Unit** is an ownership, dependency, and safe-parallelism boundary inside one Proposal. It may span several detailed task checkboxes. It is not a live agent identity, not a checkbox-sized timebox, and not independently archivable. Creating another worker is an execution choice; it does not create another Dispatch Unit or Proposal.

First partition the request into workload-bounded Proposals. Only then define each Proposal's Dispatch Units in `tasks.md` and its ownership, dependencies, parallelism, and handoff in `execution-plan.md`.

Do not promote an implementation slice to a Proposal merely to assign a different worker. Promote it only when it needs its own workload/context and acceptance/archive boundary.

## Decompose long-running work

For a large or multi-session request:

1. Inventory logical capabilities and score each across all six dimensions.
2. Apply risk/contract overrides before numeric grouping.
3. Combine compatible bounded work and split multiple large capabilities.
4. Find stable, independently testable milestones for every very large capability; document any atomic single-Proposal exception.
5. For every Proposal in the set, record its **prerequisite**, what it **unblocks**, and the **stable interface** or artifact handed to dependents.
6. Put a shared foundation in its own Proposal only when independently testable and substantial; otherwise implement it in the first dependent Proposal and reference that prerequisite later.
7. Define Dispatch Units within each Proposal by owned paths, dependency waves, and integration handoffs.
8. Run Proposals in parallel only when there is no unmet dependency and no shared mutable ownership. If integration or shared files introduce a dependency, serialize the affected work.

Reassess boundaries when estimates materially change. Update an active Proposal when intent stays the same and the revised work still fits; create or stage another Proposal when the workload/context boundary no longer holds.

## Understand the artifacts


After running `superpowers init`, your project has this structure:

```
superpowers/
├── specs/              # Source of truth (your system's behavior)
│   └── <domain>/
│       └── spec.md
├── changes/            # Proposed updates (one folder per change)
│   └── <change-name>/
│       ├── proposal.md
│       ├── design.md
│       ├── tasks.md
│       ├── implementation-plan.md
│       ├── test-plan.md
│       └── specs/      # Delta specs (what's changing)
│           └── <domain>/
│               └── spec.md
└── config.yaml         # Project configuration (optional)
```

The Proposal lifecycle stores durable intent and evidence under `superpowers/changes/<change-name>/`. In the spec-driven schema, this normally includes `proposal.md`, delta specs, `design.md`, `tasks.md`, `execution-plan.md`, and `test-plan.md`. Do not invent artifacts; follow `superpowers status` and the schema instructions.

Repository specs under `superpowers/specs/<capability>/spec.md` remain the source of truth for behavior. Requirements state what must happen; scenarios provide concrete verifiable cases.

