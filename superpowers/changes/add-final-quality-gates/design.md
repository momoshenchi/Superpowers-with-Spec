## Context

The current spec-driven apply path already separates task implementation from post-integration Test Hardening. It deliberately asks agents to consider E2E, visual, accessibility, or manual coverage where relevant, but it neither requires a discovered full non-visual test suite nor has an ordered final quality gate. `/sp:verify` separately maps implementation to tasks, specs, and change-local engineering decisions; it does not run a full test suite or require an executable E2E result for a changed user journey. The repository's visual `DESIGN.md` convention is currently checked while proposing a change, not against the implemented runtime UI.

This change introduces an apply-completion quality gate that must work in generated workflows on OpenCode, Codex, Claude Code, and other supported hosts. It preserves a host's native code-review capability instead of distributing a competing Superpowers command. Claude Code already owns `/simplify`, `/verify`, and `/code-review`, so generated Superpowers commands remain namespaced as `/sp:*`.

## Current system

```text
schema.yaml test-plan + apply instructions
           │
           ▼
getApplyChangeSkillTemplate / getSpApplyCommandTemplate
           │
           ▼
generated skills and commands for each configured tool
           │
           ├── standalone /sp:verify (expanded profile)
           └── apply completion → Test Hardening → archive suggestion

```

The workflow registry is duplicated intentionally across template generation, profile selection, init/update cleanup, drift detection, command metadata, and tests. A new standalone workflow therefore needs explicit registration in every name-based registry. Existing `verify-change.ts` provides both generated skill and command templates; `apply-change.ts` contains duplicated skill/command prose and is the only reliable automatic completion path for users who selected only the core profile.

### Relationship to existing tech

| Existing capability | Relation | Pointer | Note |
|---|---|---|---|
| Test Hardening | extend | `src/core/templates/workflows/apply-change.ts`, `schemas/spec-driven/schema.yaml` `apply` | Final gates start only after its concrete rows are complete. |
| Verify workflow | extend | `src/core/templates/workflows/verify-change.ts` | Add E2E acceptance inside correctness; retain artifact mapping. |
| Visual design conventions | reuse | `schemas/spec-driven/schema.yaml` `id: design`; `src/core/templates/workflows/change-review.ts` | Reuse existing visual `DESIGN.md` discovery semantics; do not confuse it with change-local design. |
| Workflow generation | extend | `src/core/shared/skill-generation.ts`, `src/core/shared/tool-detection.ts` | Register `simplify` and `design-verify` by explicit workflow ID. |
| Profile and synchronization | extend | `src/core/profiles.ts`, `src/core/profile-sync-drift.ts`, `src/core/init.ts`, `src/core/update.ts` | New standalone workflows remain selectable and synchronizable. |
| Host-native code review | boundary | host skill/command discovery at apply runtime | Superpowers requests/reuses it but does not generate `code-review`. |

## Goals / Non-Goals

**Goals:**

- Make final quality checks mandatory in `/sp:apply` after implementation and Test Hardening.
- Preserve the exact primary order: native code review → simplify → verify → design-verify.
- Define E2E and visual verification in terms of reproducible runtime evidence and explicit outcomes.
- Provide standalone `/sp:simplify` and `/sp:design-verify` workflows for supported tools without command-name collisions.
- Keep final gate behavior available from `/sp:apply` even if those standalone workflows are not selected in the user profile.

**Non-Goals:**

- Generate, emulate by name, or override a host-native `code-review` command or skill.
- Add Playwright, a browser runner, visual-regression service, screenshot baseline system, or any new runtime dependency.
- Require E2E or visual verification for non-runnable or non-UI changes; those require explicit `not applicable` evidence instead.
- Add a new schema artifact, CLI lifecycle state, or permanent approval file.

## Decisions

### 0. Port Claude Code 2.1.220's simplify workflow under the `/sp:` namespace

**Decision:** The standalone `/sp:simplify` instructions use Claude Code 2.1.220's complete two-phase simplify workflow: diff gathering; parallel review across reuse, simplification, efficiency, and altitude; followed by deduplicating and applying safe cleanup findings. A portable pre-phase resolves an optional Superpowers change into its owned paths/artifacts and pauses on dirty-worktree ambiguity; without a change name, an explicit PR, branch, file, or diff target is required. The other portability changes are the `/sp:simplify` namespace and replacing Claude Code's `Go` tool name with a host-neutral agent-spawning capability plus its documented single-pass fallback.

**Rationale:** The user requested the established Claude Code behavior directly while preserving a non-colliding command name that works on Codex, OpenCode, and other supported hosts. The added scope resolution is necessary for a change-aware Superpowers command to avoid cleaning unrelated dirty work.

### 1. Make final quality gates an apply postcondition, with standalone workflows as manual entry points

**Problem:** The final sequence must run automatically even for users who only installed the core `/sp:apply` workflow, while simplify and design verification also need to be individually invocable.

| Option | Automatic availability | Duplication/drift | Profile semantics |
|---|---|---|---|
| A. Shared final-gate instruction fragments embedded in apply; standalone workflows reuse them | High | Low | Standalone commands remain optional |
| B. Make each gate a core-profile dependency and have apply invoke installed skills | Medium; broken in commands-only or custom setups | Medium | Expands all core installs |
| C. Add a new persistent quality-gates artifact and CLI completion state | High | High | Adds lifecycle/process weight |

**Choice:** A. Introduce shared template fragments for common gate contracts. `apply-change.ts` consumes the ordered orchestration fragment directly; standalone workflow templates consume their applicable contract without becoming runtime dependencies of apply. Each apply gate is delegated to a fresh distinct subagent, and the coordinator waits for and integrates that report before launching the next gate. Existing explicit registries will expose `simplify` and `design-verify` to custom profiles, skill generation, commands, init/update, migration, and drift detection.

**Trade-offs / cost:** Generated prose remains the enforcement mechanism, not a machine-enforced CLI transition. Hosts without delegation capability must block final completion rather than silently fall back to the coordinator. The final summary will be recorded in the existing `test-plan.md` hardening record rather than a new artifact.

### 2. Reuse native code review, but define a portable no-silent-skip fallback

**Problem:** Hosts vary in their slash-command and skill names. Creating Superpowers `code-review` would duplicate and potentially collide with native capabilities, but merely saying “review code” makes the gate easy to skip.

| Option | Host fit | Cross-tool reliability | Collision risk |
|---|---|---|---|
| A. Invoke host-native capability when discoverable; otherwise perform and label equivalent independent review | High | High | None |
| B. Generate `/sp:code-review` everywhere | Medium | High | Competes with native review |
| C. Skip review when no named host command exists | High | Low | None |

**Choice:** A. Apply first requests the host-native `code-review` skill/command. If its name is unavailable, the agent performs an equivalent independent review of the integrated diff, requirement mapping, regressions, and validation evidence, explicitly reporting that fallback. It may never silently omit the review gate.

**Trade-offs / cost:** The exact native invocation is host-dependent and cannot be encoded as one slash-command string. The standardized output contract, ordering, findings, and repair loop remain portable.

### 3. Run canonical non-visual tests before E2E, and keep E2E/design evidence separate

**Problem:** Screenshot inspection cannot prove a flow works, source inspection cannot prove a visual design works in a browser, and an arbitrary `test` script cannot truthfully represent full validation. Combining or guessing these evidence domains would make reports vague and allow manual confidence to masquerade as verification.

| Option | Functional assurance | Visual assurance | Report clarity |
|---|---|---|---|
| A. Discover/run canonical non-visual tests first; E2E in `/sp:verify`; UI conformance in separate `/sp:design-verify` | High | High | High |
| B. Run only task-local tests before E2E | Medium | High | Medium |
| C. Assume a convenient package test command is full validation | Low | Medium | Low |

**Choice:** A. Test Hardening and `/sp:verify` discover the complete canonical non-visual suite from repository scripts, CI, test documentation, and `test-plan.md`, then run it before E2E. `/sp:verify` owns requirement/scenario correctness and executable E2E acceptance for changed runnable user journeys: browser-facing flows use real user-equivalent input, select a concrete driver, preserve inspectable runtime artifacts, exercise applicable interaction risks, and use a safe target for destructive paths. `/sp:design-verify` owns visual `DESIGN.md` conformance and runtime rendering. Both may use an available browser driver, but each produces its own `passed`, `failed`, `blocked`, or `not applicable` result.

**Trade-offs / cost:** The test-suite discovery step can block when repository authority is ambiguous, and UI changes can require two browser-oriented passes. These costs are accepted because neither a partial test run nor a screenshot-only check is sufficient evidence.

### 4. A failing gate invalidates downstream results and restarts the sequence

**Decision:** Any code edit made to resolve review/verify/design findings or by simplify invalidates downstream evidence. The agent reruns affected tests and Test Hardening evidence, then restarts from the native code-review gate with new distinct gate subagents. `design-verify` runs only after functional verification passes. A blocked applicable E2E or design check pauses completion; a non-applicable check must include scope evidence.

**Rationale:** A native review before simplify is otherwise stale as soon as cleanup changes the code. Restarting is more expensive but is the only truthful conclusion for a required final sequence.

### 5. Keep status durable in test-plan, not a new artifact

**Decision:** Add a compact `## Final Quality Gates` section to the active change's existing `test-plan.md`. It records each gate's outcome, commands/runtime evidence, changed files or routes, and justified `not applicable` reason. The schema artifact graph remains unchanged; apply instructions, rather than `superpowers status`, evaluate these final outcomes before making an archive recommendation.

**Rationale:** `test-plan.md` already distinguishes a plan from post-implementation hardening evidence. A separate file-presence artifact cannot represent unresolved review findings without additional lifecycle machinery.

## Contracts

### API / CLI

| Surface | Change | Compatibility |
|---|---|---|
| Generated workflows | Add IDs `simplify` and `design-verify`; generate `/sp:simplify` and `/sp:design-verify` | Additive, profile-selected standalone commands |
| `/sp:apply` | Final quality-gate postcondition and report | Existing command gains required completion behavior |
| `/sp:verify` | Add E2E correctness evidence | Existing command gains an applicable-check outcome |
| Native `code-review` | Reused by host; never generated by Superpowers | No command namespace claim |

### States

```text
tasks complete
  → canonical non-visual suite passes during Test Hardening
  → code-review subagent → integrate result
  → simplify subagent → integrate result
  → canonical non-visual suite passes during verify
  → verify subagent (including applicable E2E) → integrate result
  → design-verify subagent (UI only) → integrate result
  → archive recommendation

any failed / blocked applicable gate
  → repair or pause
  → affected tests + Test Hardening
  → code-review (restart)
```

Each gate result is exactly `passed`, `failed`, `blocked`, or `not applicable`. `not applicable` is not a pass and requires scope evidence; `blocked` prevents apply completion.

### Errors

| Condition | Apply behavior |
|---|---|
| Native review is unnamed/unavailable | Perform labeled equivalent review; do not skip. |
| Host cannot delegate a final gate | Mark that gate blocked and pause; do not perform it in the coordinator context. |
| Canonical non-visual suite is ambiguous, unavailable, or failing | Keep Test Hardening/verify blocked or failed; name the commands or authority needed. |
| Required runtime/browser/credential missing | Mark relevant E2E or design gate `blocked`, name prerequisite, pause. |
| UI has no visual DESIGN.md | Mark design verification blocked because formal conformance is unassessable; inspect existing patterns where possible; never claim formal pass or recommend archive. |
| Simplify cannot prove equivalence | Do not apply or repair/revert; restart gates if code changed. |

## Attachments

None.

## Risks / Trade-offs

- [Risk] The stricter loop is slow after a small cleanup. → Mitigation: simplify is narrowly behavior-preserving and must avoid speculative edits.
- [Risk] A host does not expose a structured native review command. → Mitigation: require a labeled equivalent independent review, never a silent omission.
- [Risk] Agent browser availability differs by host. → Mitigation: use repository E2E tooling or host browser drivers when available; block applicable checks otherwise.
- [Risk] Existing dirty worktrees make the review scope ambiguous. → Mitigation: use active artifacts and diff ownership; pause when the active change cannot be separated safely.
- [Risk] Generated instructions drift across skill and command forms. → Mitigation: shared final-gate fragments and focused parity/registry tests.

## Migration Plan

1. Add failing registry and generation tests for `simplify` and `design-verify`, including profile sync and command paths for supported tools.
2. Add failing template-contract tests for the ordered apply gate, host-native review fallback, E2E rules, design result semantics, and no generated code-review ID.
3. Implement shared quality-gate template fragments, canonical non-visual suite discovery/run rules, standalone workflow templates, registry additions, and apply/verify integration.
4. Update docs and template hashes/snapshots.
5. Run focused tests, then `pnpm run build`, `pnpm run lint`, and the full test suite.

Rollback removes the two additive workflow IDs and restores the former apply completion text. Existing changes need no migration because the final-gate report is agent-managed text in an already-existing `test-plan.md`.

## Open Questions

None. Project-specific authentication and browser setup remain evidence prerequisites, not Superpowers configuration fields in this scope.
