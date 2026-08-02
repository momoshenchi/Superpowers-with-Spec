---
name: superpowers-change-review
description: Review a complete Superpowers proposal before implementation. Use manually with /sp:review or automatically after /sp:propose creates all required artifacts.
license: MIT
compatibility: Requires superpowers CLI.
metadata:
  author: superpowers
  version: "1.0"
  generatedBy: "1.0.7"
---

Review a complete Superpowers change before implementation.

**Input**: Optionally specify a change name. If omitted, infer it only from clear conversation context; otherwise run `superpowers list --json` and ask the user to choose.

## Roles

- **Coordinator** (default: the agent running `/sp:propose` or `/sp:review`): dispatches each review round to a fresh subagent, **present the complete review report** from the worker before editing proposal artifacts, **repair every resolvable BLOCKER**, and re-dispatch only after BLOCKER repair. Does not perform dimensional artifact assessment in the coordinator context when the host can launch subagents.
- **Change reviewer** (fresh subagent): read-only proposal review — runs CLI checks, reads artifacts, applies the four review dimensions, returns a structured report. Does not edit proposal artifacts or announce readiness.

## Dispatch

Do not reuse a review worker across rounds. Do not perform inspection and dimensional assessment in the coordinator context when the host can launch subagents.
If the host cannot launch a subagent, mark proposal review `blocked`, name the missing host capability, and pause; do not silently substitute an inline coordinator review.

## Coordinator loop

When running automatically from `/sp:propose` after every `applyRequires` artifact is complete, or manually from `/sp:review`:

A **round** is one fresh reviewer dispatch plus its integrated report. Proposal review allows at most **three rounds** total.

1. Dispatch one fresh change reviewer subagent (round 1).
2. **Present the complete review report** from the worker before editing any proposal artifact in response to findings.
3. Then **repair every resolvable BLOCKER** in the coordinator context. WARNING findings are recommended repairs: you may fix them after the report, but they do not block readiness by themselves. SUGGESTION findings are non-blocking and may remain visible in the report.
4. **Re-dispatch a fresh reviewer only after repairing one or more BLOCKERs** (re-run review only after repairing one or more BLOCKERs). Each re-dispatch starts the next numbered round. Do not re-run full proposal review solely because WARNING or SUGGESTION findings were present or repaired.
5. If round three still reports unresolved BLOCKERs, pause and report the remaining BLOCKERs; do not start a fourth round or claim readiness.
6. Announce readiness only when no unresolved BLOCKER remains within the three-round limit. Residual WARNING and SUGGESTION notes may stay visible.
7. If a repair needs a product, security, schema, or external-dependency decision, report the blocker and pause; do not guess or claim readiness.

Do not create `review.md`, approval metadata, or a review artifact. Proposal review is ephemeral. `/sp:apply` does not automatically repeat proposal review; users may invoke `/sp:review <change>` voluntarily.

## Change reviewer procedure

1. Run `superpowers status --change "<name>" --json`. Read `schemaName`, `applyRequires`, and `artifacts[]` (`id`, `outputPath`, `status`). Cross-check `.superpowers.yaml` `schema:` when helpful. Do not assume every schema has delta specs.
2. Run `superpowers validate <name>` (or `--json`). Treat every validation ERROR as a BLOCKER. Do not invent delta specs for schemas without a `specs` artifact.
3. Read only artifacts required or generated for the selected schema, plus `attachments/` referenced from those artifacts. Optionally run `superpowers instructions <artifact-id> --change "<name>" --json` for template/section expectations.
4. When the schema includes a `specs` artifact, compare `Modified Capabilities` against `superpowers/specs/<capability>/spec.md` master specs.
5. Assess the four dimensions below. Report every finding as BLOCKER, WARNING, or SUGGESTION with artifact location and a concrete repair.
6. For spec-driven tasks, treat top-level `# <number>. <scope>` headings as logical **dispatch unit** boundaries. Accept legacy `# <number>. agent<logical-id> — <scope>` headings as equivalent dispatch units. Verify `execution-plan.md` Dispatch Coordination covers each unit's ownership, dependencies, assignee policy, parallel eligibility, and handoff evidence, and that every detailed task has concrete Step 1–5 execution guidance under clean `### <number>. <scope>` headings. Do not require per-checkbox delegation, per-checkbox formal review, or 2–5 minute work units.

## Review dimensions

Judge every finding against one dimension and one severity:

| Severity | Meaning |
| --- | --- |
| **BLOCKER** | Cannot implement without ambiguity, or implementation would violate product/architecture constraints |
| **WARNING** | Likely rework, omission, or inconsistent interpretation if left unfixed |
| **SUGGESTION** | Wording, structure, or maintainability improvement; does not block implementation |

### 1. Completeness

Completeness has two layers: **structural** (`validate`, schema-aware) and **content** (this review).

Define what "complete" means from the schema first. Artifacts outside the selected schema are **not** missing and must not become BLOCKERs.

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
| `design.md` | all | Context, **Current system** (may be short), Relationship pointers, Goals/Non-Goals, Decisions (major: ≥3-option comparison; minor: rationale only), **Contracts** (N/A allowed when no surface change), Risks | missing Current system/Contracts; major decision without comparison; reuse without pointer; options without Non-Goals |
| `specs/<capability>/spec.md` | `spec-driven` | ADDED/MODIFIED/REMOVED Requirements; each Requirement has ≥1 Scenario | Requirement without Scenario; unclear delta vs master spec |
| `tasks.md` | `spec-driven` | checkable tasks with concrete file paths | tasks too large; missing verification steps |
| `execution-plan.md` | `spec-driven` | File Structure; stepwise Task Plan (red test → implement → verify) | drift from `tasks.md`; missing commands and expected signals |
| `test-plan.md` | all | Testing Gap Analysis; Requirement/Scenario coverage matrix aligned to delta spec; edge/exception scan; post-implementation Test Hardening notes when applicable | happy path only; matrix missing key scenarios |

### 2. Clarity

Can an implementer derive **what to do, where, and how to verify** directly from the artifacts?

**Must be unambiguous:**

- **Scope**: Goals and Non-Goals are mutually exclusive and testable; no "TBD"/"as needed" without an explicit defer note.
- **Decisions**: each Decision names the chosen option. **Major** decisions (new source of truth, cross-subsystem, security/billing/idempotency/recovery, irreversible migration, important dependency, user-declared module-scale work) need a **≥3-option comparison** with trade-offs. **Minor** decisions (local rename, single helper, file placement) need one-line rationale only—do **not** flag missing three-option tables for minor work.
- **File targets**: Create/Modify/Test use real repo paths, not "relevant module" or "appropriate location."
- **Task granularity**: each checkbox maps to Step 1–5 guidance in `execution-plan.md` with concrete test files, implementation files, commands, and **expected pass/fail signals**. Assignee policy lives in Dispatch Coordination, not in task headings. (`test-harden`: judge matrix rows and harness; `spec-driven`: judge `tasks.md` + `execution-plan.md`.)
- **Testable requirements**: `spec-driven` Requirements use SHALL/MUST; Scenarios use WHEN/THEN/AND with observable THEN assertions. `test-harden` matrix rows name primary assertions and recommended test layer.
- **Data and contracts**: API fields, error codes, state machines, enums, and i18n keys use stable names and examples—not intent-only prose.
- **Edges and exceptions**: cover null/unknown input, mid-flow failure, duplicate operations, auth/ownership, timeout/cancel, and legacy compatibility when applicable.

**Ambiguity signals (usually WARNING; BLOCKER when they block implementation):**

- Same concept named differently across proposal/design/spec with no mapping.
- "Reuse existing logic" / "keep current behavior" without a navigable entry point (WARNING; BLOCKER across trust boundaries).
- Tables/maps ending in "etc." without closure rules.
- Tasks like "add validation" or "improve error handling" without concrete rules or test assertions.

**Design convention checks (when `design.md` is present):**

Apply in addition to general clarity checks. Default **WARNING**; escalate to **BLOCKER** only when missing landscape or contracts would block a cross-cutting change.

- **Current system and Contracts**: expect exact `## Current system` (technical slice for this change; short OK) and `## Contracts` (accept `N/A — no API/state/error surface change` when specs/tasks show no API/CLI/state/error change; escalate if Contracts says N/A but specs add surface behavior).
- **Relationship / reuse pointers**: prefer a Relationship table with `reuse | extend | replace | boundary | retire` and a **Pointer** column (path, symbol, command, or documented section). Bare reuse without pointer → WARNING; BLOCKER across module or trust boundaries.
- **Scale-aware comparisons**: major decisions need **≥3 options** recorded; minor decisions need rationale only; ambiguous scale → WARNING asking author to classify.
- **Visual DESIGN.md** (UI identity; not change `design.md`): google-labs-style YAML tokens + prose identity at repo `DESIGN.md`/`design.md`, `docs/DESIGN.md`, or project-context paths. UI change + file exists but uncited → WARNING; look-and-feel token changes need a task to update that file. Non-UI change or no visual DESIGN.md found → **not a finding**.

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
- `test-harden`: design says test-only, but test-plan steps modify production behavior or schema → BLOCKER.

### 4. Implementability

Can work start **now**, not "when the design is perfect"?

**Shared readiness:**

1. No BLOCKERs (including `validate` ERRORs). WARNING/SUGGESTION alone do not block ready.
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

**Legitimate deferrals (not BLOCKERs when explicit):**

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

### BLOCKER
1. ...

### WARNING
1. ...

### SUGGESTION
1. ...

```

