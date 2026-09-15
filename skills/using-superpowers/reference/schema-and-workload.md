# Schema, artifacts, and Proposal workload

Read this file when sizing a Proposal, reading the artifact tree, or inspecting schema YAML. Mode selection lives in the root `using-superpowers` skill.

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

## Understand the schema

Schemas define the artifact types and their dependencies for a workflow.

### How Schemas Work

```yaml
# superpowers/schemas/spec-driven/schema.yaml
name: spec-driven
artifacts:
  - id: proposal
    generates: proposal.md
    requires: []              # No dependencies, can create first

  - id: specs
    generates: specs/**/*.md
    requires: [proposal]      # Needs proposal before creating

  - id: design
    generates: design.md
    requires: [proposal]      # Can create in parallel with specs

  - id: tasks
    generates: tasks.md
    requires: [specs, design] # Needs both specs and design first
  
  - id: execution-plan
    generates: execution-plan.md
    requires: [tasks] # Needs tasks

  - id: test-plan
    generates: test-plan.md
    requires: [execution-plan] # Needs execution-plan
```


### Built-in Schemas

**spec-driven** (default)

The standard workflow for spec-driven development:

```
proposal → specs → design → tasks → implement-plan → test-plan → review → apply → final quality gate
```


### Custom Schemas

Create custom schemas for your team's workflow:

```bash
# Create from scratch
superpowers schema init research-first

# Or fork an existing one
superpowers schema fork spec-driven research-first
```

## Decompose long-running work

For a large or multi-session request:

1. Inventory logical capabilities and score each across all six dimensions (see [Size Proposals by workload](#size-proposals-by-workload)).
2. Apply risk/contract overrides before numeric grouping.
3. Combine compatible bounded work and split multiple large capabilities.
4. Find stable, independently testable milestones for every very large capability; document any atomic single-Proposal exception.
5. For every Proposal in the set, record its **prerequisite**, what it **unblocks**, and the **stable interface** or artifact handed to dependents.
6. Put a shared foundation in its own Proposal only when independently testable and substantial; otherwise implement it in the first dependent Proposal and reference that prerequisite later.
7. Define Dispatch Units within each Proposal by owned paths, dependency waves, and integration handoffs.
8. Run Proposals in parallel only when there is no unmet dependency and no shared mutable ownership. If integration or shared files introduce a dependency, serialize the affected work.

Reassess boundaries when estimates materially change. Update an active Proposal when intent stays the same and the revised work still fits; create or stage another Proposal when the workload/context boundary no longer holds.
