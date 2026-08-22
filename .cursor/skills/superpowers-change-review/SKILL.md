---
name: superpowers-change-review
description: Review a complete Superpowers proposal before implementation. Use manually with /sp:review or automatically after /sp:propose creates all required artifacts.
license: MIT
compatibility: Requires superpowers CLI.
metadata:
  author: superpowers
  version: "1.0"
  generatedBy: "1.0.9"
---

Review a complete Superpowers change before implementation.

**Input**: Optionally specify a change name. If omitted, infer it only from clear conversation context; otherwise run `superpowers list --json` and ask the user to choose.

## Roles

- **Coordinator** (default: the agent running `/sp:propose` or `/sp:review`): dispatches each review round to a fresh subagent, **present the complete review report** from the worker before editing proposal artifacts, **repair every resolvable P0**, and re-dispatch only after P0 repair. Does not perform dimensional artifact assessment in the coordinator context when the host can launch subagents.
- **Change reviewer** (fresh subagent): read-only proposal review — runs CLI checks, reads artifacts, applies the four review dimensions, returns a structured report. Does not edit proposal artifacts or announce readiness.

## Dispatch

Do not reuse a review worker across rounds. Do not perform inspection and dimensional assessment in the coordinator context when the host can launch subagents.
If the host cannot launch a subagent, mark proposal review `blocked`, name the missing host capability, and pause; do not silently substitute an inline coordinator review.

## Coordinator loop

When running automatically from `/sp:propose` after every `applyRequires` artifact is complete, or manually from `/sp:review`:

A **round** is one fresh reviewer dispatch plus its integrated report. Under normal conditions, proposal review allows at most **two rounds** total.

1. Dispatch one fresh change reviewer subagent (round 1).
2. **Present the complete review report** from the worker before editing any proposal artifact in response to findings.
3. Then **repair every resolvable P0** in the coordinator context. `P1` findings are recommended repairs: you may fix them after the report, but they do not block readiness by themselves. `P2` findings are non-blocking and may remain visible in the report.
4. **Re-dispatch a fresh reviewer only after repairing one or more P0 findings** (re-run review only after repairing one or more P0 findings). Each re-dispatch starts the next numbered round. Do not re-run full proposal review solely because `P1` or `P2` findings were present or repaired.
5. If round two still reports unresolved P0 findings, pause and report the remaining ones; do not start a third round for additional P0 repairs or claim readiness.
6. **Infrastructure failure extension**: If a round fails to complete normally — network error, subagent timeout, or an incomplete or missing review report — you may dispatch one additional fresh reviewer, for at most **three rounds** total. Use this extension only to recover from incomplete rounds, not to add another P0-repair cycle after round two.
7. Announce readiness only when no unresolved P0 remains within the applicable round limit. Residual `P1` and `P2` notes may stay visible.
8. If a repair needs a product, security, schema, or external-dependency decision, report that finding and pause; do not guess or claim readiness.

Do not create `review.md`, approval metadata, or a review artifact. Proposal review is ephemeral. `/sp:apply` does not automatically repeat proposal review; users may invoke `/sp:review <change>` voluntarily.

## Change reviewer procedure

1. Run `superpowers status --change "<name>" --json`. Read `schemaName`, `applyRequires`, and `artifacts[]` (`id`, `outputPath`, `status`). Cross-check `.superpowers.yaml` `schema:` when helpful. Do not assume every schema has delta specs.
2. Run `superpowers validate <name>` (or `--json`). Treat every validation ERROR as a `P0`. Do not invent delta specs for schemas without a `specs` artifact.
3. Read only artifacts required or generated for the selected schema, plus `attachments/` referenced from those artifacts. Optionally run `superpowers instructions <artifact-id> --change "<name>" --json` for template/section expectations.
4. When the schema includes a `specs` artifact, `validate` has already decided ADDED vs MODIFIED vs REMOVED vs RENAMED mechanically against `superpowers/specs/<capability>/spec.md`, and reports a mislabeled operation as an ERROR. Do not re-derive those labels by hand. Read the master specs only to judge whether each delta captures the right behavior change and whether `Modified Capabilities` is complete.
5. Assess the four dimensions below. Report every finding as `P0`, `P1`, or `P2` with artifact location and a concrete repair. Proposal review is not a Final Quality Gate: its findings never consume a gate round, and it never reports a gate outcome.
6. For spec-driven tasks, treat top-level `# <number>. <scope>` headings as logical **dispatch unit** boundaries. Accept legacy `# <number>. agent<logical-id> — <scope>` headings as equivalent dispatch units. Verify `execution-plan.md` Dispatch Coordination covers each unit's ownership, dependencies, assignee policy, parallel eligibility, and handoff evidence, and that every detailed task has concrete Step 1–5 execution guidance under clean `### <number>. <scope>` headings with all Step 1 slots filled — including a paste-ready test skeleton and expected-red failure signature — and all five Step 3 slots filled. A Step 1 that only says "cover the behavior", or a Step 3 that only restates the task title, is a `P1`. Do not require per-checkbox delegation, per-checkbox formal review, or 2–5 minute work units. When existing `Implementation Notes` are present, read them as non-normative implementation context and do not treat them as task completion evidence.

## Review dimensions

Judge every finding against one dimension and one severity on the shared `P0`/`P1`/`P2` scale:

| Severity | Meaning here |
| --- | --- |
| **`P0`** | Cannot implement without ambiguity, or implementation would violate product/architecture constraints. Withholds readiness. |
| **`P1`** | Likely rework, omission, or inconsistent interpretation if left unfixed |
| **`P2`** | Wording, structure, or maintainability improvement; does not block implementation |

### 1. Completeness

Completeness has two layers: **structural** (`validate`, schema-aware) and **content** (this review).

Define what "complete" means from the schema first. Artifacts outside the selected schema are **not** missing and must not become `P0` findings.

`validate` passing is necessary but not sufficient—empty sections, vague decisions, and missing matrix rows still fail content review.

**Schema boundaries (quick reference; unknown schemas follow `status --json`):**

| Schema | Has `specs` | Typical `applyRequires` | Validate notes |
| --- | --- | --- | --- |
| `spec-driven` | yes | often includes `test-plan`; full changes also `proposal`, `design`, `specs`, `tasks`, `execution-plan` | legal delta specs |
| `test-harden` | no | `design`, `test-plan` | no delta; no `proposal.md`, `tasks.md`, or `execution-plan.md` required |

**Per-artifact content checks (only files in scope for the schema):**

| Artifact | Schemas | Must include | Common gaps |
| --- | --- | --- | --- |
| `proposal.md` | `spec-driven` | Why, What Changes, Capabilities (New/Modified), Impact | motivation without scope; Impact missing key modules |
| `design.md` | all | Context, **Current system** (onboarding prose, not a file-path dump), Relationship pointers, Goals/Non-Goals, Decisions (user-confirmed tables only for choices the user actually made; agent-owned MAY include an A/B/C with strict, detailed analysis and implementable detail), **Contracts** (N/A allowed when no surface change), **Invariants** (N/A allowed: `N/A — no cross-path invariants`), Risks | missing Current system/Contracts/Invariants; Current system is only a path table; misattributed user Choice; agent-owned A/B/C with shallow rationale; principle-only design with no mapping rules or worked example; reuse without pointer; options without Non-Goals; behavioral change missing scan dimension (no rule and no N/A) |
| `specs/<capability>/spec.md` | `spec-driven` | ADDED/MODIFIED/REMOVED Requirements; each Requirement has ≥1 Scenario | Requirement without Scenario; delta restates existing behavior without changing it |
| `tasks.md` | `spec-driven` | checkable tasks with concrete file paths | tasks too large; missing verification steps |
| `execution-plan.md` | `spec-driven` | File Structure; stepwise Task Plan (red test → implement → verify); every Step 1 filling spec bound, form, existing coverage, test location, Arrange/Act/Assert, paste-ready test skeleton, expected red; every Step 3 filling change anchor, design carried, implementation approach, edges and failures, out of scope; optional non-normative Implementation Notes | drift from `tasks.md`; missing commands and expected signals; Step 1 that only says "cover the behavior" or has no skeleton; Step 3 that only restates the task title or leaves a slot empty |
| `test-plan.md` | all | Testing Gap Analysis; Test Scope Register taken from each `### Requirement:` (R1…Rn) with existing `#### Scenario:` titles; Requirement/Scenario coverage matrix that assigns each imported Scenario a form (`unit` / `integration` / `E2E` / `manual`); Six-Dimension Case Matrix split into one table per `full-qa-test` D1–D6 dimension with `TC-R<n>-D<m>-<seq>` IDs, Object, and Form; 10→10→10 run once per Requirement per dimension; Dimension Coverage Summary; post-implementation Test Hardening notes when applicable | happy path only; invents a parallel feature list instead of using spec Requirements; imports Scenarios and stops; shares one batch of ten across several Requirements; cases that never name which Requirement they exercise or which form they use; E2E used where a unit or integration test can observe the behavior; vague expectations such as "invalid input is rejected"; a registered Requirement absent from an applicable dimension without a stated reason |

### 2. Clarity

Can an implementer derive **what to do, where, and how to verify** directly from the artifacts?

**Must be unambiguous:**

- **Scope**: Goals and Non-Goals are mutually exclusive and testable; no "TBD"/"as needed" without an explicit defer note.
- **Decisions**: each Decision names the chosen approach. Include a **User selection:** comparison table **only** when the user actually chose among those options (explore, interview, or explicit confirmation, including delegated recommendations after seeing alternatives). **Agent-owned** implementation decisions MAY include an A/B/C comparison; the final Choice MUST be a **strict, detailed analysis** of why that option wins and why the others lose. After the choice, expect **implementable detail** (mapping rules, fail-closed paths, a **worked example**) under existing headings. Do **not** present a model-inferred result as a user Choice. Do **not** flag missing three-option tables. Do **not** require extra top-level headings.
- **File targets**: Create/Modify/Test use real repo paths, not "relevant module" or "appropriate location."
- **Task granularity**: each checkbox maps to Step 1–5 guidance in `execution-plan.md` with concrete test files, implementation files, commands, and **expected pass/fail signals**. Assignee policy lives in Dispatch Coordination, not in task headings. (`test-harden`: judge matrix rows and harness; `spec-driven`: judge `tasks.md` + `execution-plan.md`.)
- **Implementation Notes**: if present, use them to understand findings, reasoning, viewpoints / trade-offs, and summaries from prior work; they are non-normative context and never replace checkbox progress or verification.
- **Testable requirements**: `spec-driven` Requirements use SHALL/MUST; Scenarios use WHEN/THEN/AND with observable THEN assertions. `test-harden` matrix rows name primary assertions and recommended test layer.
- **Data and contracts**: API fields, error codes, state machines, enums, and i18n keys use stable names and examples—not intent-only prose.
- **Edges and exceptions**: cover null/unknown input, mid-flow failure, duplicate operations, auth/ownership, timeout/cancel, and legacy compatibility when applicable.

**Ambiguity signals (usually `P1`; `P0` when they block implementation):**

- Same concept named differently across proposal/design/spec with no mapping.
- "Reuse existing logic" / "keep current behavior" without a navigable entry point (`P1`; `P0` across trust boundaries).
- Tables/maps ending in "etc." without closure rules.
- Tasks like "add validation" or "improve error handling" without concrete rules or test assertions.

**Design convention checks (when `design.md` is present):**

Apply in addition to general clarity checks. Default **`P1`**; escalate to **`P0`** only when missing landscape or contracts would block a cross-cutting change.

- **Current system and Contracts**: expect exact `## Current system` that **teaches a new engineer** the relevant current design (what it does, entry points, flow, current behavior, gap/defect). A **file-path dump** (table or bullets of paths with no behavioral prose) is a `P1`; escalate to `P0` on a cross-cutting change. Short is OK only when the prose still explains behavior. Expect `## Contracts` (accept `N/A — no API/state/error surface change` when specs/tasks show no API/CLI/state/error change; escalate if Contracts says N/A but specs add surface behavior).
- **Invariants**: expect exact `## Invariants`. Accept `N/A — no cross-path invariants` when none apply. Missing `## Invariants` heading → **`P0`**. Empty body with neither rows nor N/A → **`P0`**. Non-N/A rows lacking stable ID, falsifiable statement, how-to-falsify, or owner test/check → `P1`. Auth/money/data-integrity changes with only N/A → `P1` (recommend ≥1 invariant).
- **Relationship / reuse pointers**: prefer a Relationship table with `reuse | extend | replace | boundary | retire` and a **Pointer** column (path, symbol, command, or documented section). The table supplements Current system prose; it does not replace it. Bare reuse without pointer → `P1`; `P0` across module or trust boundaries.
- **User-real choices**: `**User selection:**` tables are allowed only for choices the user actually chose. An A/B/C table labeled as user Choice when the user did not choose → `P1` (**misattributed user Choice**). Agent-owned A/B/C is allowed; a one-line or ritual Choice without why winners/losers → `P1` (**shallow rationale**). Agent-owned A/B/C with **strict, detailed analysis** → **not a finding**. Missing three-option tables → **not a finding**.
- **Implementable detail**: a behavioral change whose design is **principle-only** (no target flow, mapping rules, or **worked example**) → `P1`; escalate to `P0` when that would block implementation. Extra subsections under existing headings are welcome. Missing invented top-level headings such as Target flow → **not a finding**.
- **Closed implication scan**: for a behavioral change, expect a derived rule or short N/A for each of: Actor, permission, and ownership; Empty, deny, error, and fail-closed behavior; Lifecycle: create, update, cancel, retry, and idempotency; Compatibility and migration; Data shape and contracts; Important product-direction forks implied by the confirmed goal. Coverage belongs in existing `## Decisions`, `## Contracts`, and `## Invariants`. A displayed Derived implications heading is not required → **not a finding**. A local helper MAY cover the scan with one short N/A. Missing dimension (neither rule nor N/A) → **`P1`**. never `P0` solely for a derived-implication gap. A user-visible derived rule without a delta-spec trace → **`P1`**. Derived items labeled as a user Choice remain **misattributed user Choice**.
- **Visual DESIGN.md** (UI identity; not change `design.md`): google-labs-style YAML tokens + prose identity at repo `DESIGN.md`/`design.md`, `docs/DESIGN.md`, or project-context paths. UI change + file exists but uncited → `P1`; look-and-feel token changes need a task to update that file. Non-UI change or no visual DESIGN.md found → **not a finding**.

### 3. Coherence

Are artifacts internally consistent and aligned with project constraints?

**`spec-driven` cross-document checks:**

- Every `proposal.Capabilities` item has a matching delta spec under `specs/`.
- Every `design.Decisions` item leaves a trace in spec Requirements or tasks.
- `proposal.Impact` modules/files appear in `execution-plan.md` File Structure.
- User-visible behavior, routing, AI tooling, or auth/billing changes include living-docs update tasks when the repo expects them.

**`test-harden` cross-document checks:**

- Every `design.Decisions` item maps to a `test-plan.md` matrix row or Implementation Record entry.
- `design.Non-Goals` (e.g., no product/schema changes) echo in test-plan Scope.
- Each `missing` / `planned` matrix row names test layer, target file or harness, and observable assertion.
- Do not require `proposal → specs → tasks` linkage.

**Project constraints (when applicable):**

- `AGENTS.md`, README, and relevant living docs: auth/billing/ownership, security surfaces, schema migrations, and doc-update obligations must match what the change proposes.
- `test-harden`: design says test-only, but test-plan steps modify production behavior or schema → `P0`.

### 4. Implementability

Can work start **now**, not "when the design is perfect"?

**Shared readiness:**

1. No `P0` findings (including `validate` ERRORs). `P1`/`P2` alone do not block ready.
2. Every `applyRequires` artifact is `done` and passes clarity/coherence checks above.
3. No unresolved decision forks; external dependencies name blocking relationships and fallback strategy.

**`spec-driven` additionally:**

4. Each New/Modified Capability has a complete delta spec and matching tasks.
5. `execution-plan` includes at least one executable red-test path (command, file, expected failure).
6. `test-plan` covers core Requirements with concrete cases—not only "add tests."

**`test-harden` additionally:**

4. Each `missing` / `planned` matrix row has target test file or new path, test layer (unit/component/E2E), observable assertion, and suggested run command.
5. `design` states test scope boundaries (in/out) with rationale against existing tests.
6. Red-test path in `execution-plan` is not required; if design embeds case steps in Decisions, test-plan must be sufficient to write tests directly.

**Legitimate deferrals (not `P0` when explicit):**

- Items listed in Non-Goals with follow-up task or reference.
- Dependency on another in-progress change with named interface boundary.
- Schema/auth/billing decisions paused pending user confirmation.

## Keep review contracts separate

- **Proposal review** happens before implementation and judges whether artifacts can be implemented without ambiguity.
- The **final integration review** happens after dispatch units integrate and judges cross-unit behavior, the integrated diff, code quality, and full validation. It is not a rerun of proposal review.

## Output

```markdown
## Change Review: <change-name>

### Summary
| Dimension | Result |
| --- | --- |
| Completeness | ... |
| Clarity | ... |
| Coherence | ... |
| Implementability | ... |

**Readiness:** ready / needs repair / blocked for a decision

### P0
1. ...

### P1
1. ...

### P2
1. ...

```

