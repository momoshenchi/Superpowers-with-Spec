## Testing Gap Analysis

Existing tests cover generated workflow templates, content hashes, skill/command generation, profile drift, init/update behavior, and the current Test Hardening wording. They do not prove a post-hardening ordered gate, host-native review reuse without a generated code-review ID, profile-independent apply behavior, E2E evidence semantics, or runtime visual-design verification semantics. This change is instruction and registry heavy, so deterministic template/registry tests are the primary automated layer; it must also verify command output for representative supported adapters.

Workers run focused tests from their dispatch units. After integration, Test Hardening must attack agreement among shared fragments, the two forms of every generated workflow, all workflow registries, profile selection/removal, and docs. Passing a single template suite is necessary but not sufficient because a missing ID in init/update or an accidental code-review registration could still ship.

## Requirement And Scenario Coverage Matrix

| Requirement / Scenario | Planned Coverage | Status | Notes |
| --- | --- | --- | --- |
| Simplify: generated `/sp:simplify` invocation, named change scope, and apply availability without standalone selection | template/unit + generation/profile integration | passed | Parity, generation, init, and update tests cover standalone and apply-owned contracts; scope-resolution assertions passed in the focused and full suites. |
| Simplify: Claude Code two-phase cleanup flow and closing summary | template/unit | passed | Template contract asserts Phase 0 diff gathering, all four cleanup angles, portable parallel/single-pass execution, and four-state closing report contract. |
| Design verify: UI detection and non-UI `not applicable` | template/unit | passed | Template contract distinguishes non-UI scope from a visual pass. |
| Design verify: visual DESIGN.md discovery and runtime evidence | template/unit | passed | Generated instructions require discovery, rule citations, runtime evidence, and blocked prerequisites. |
| Design verify: actionable result report | template/unit | passed | Generated instructions require numbered execution, `passed` / `failed` / `blocked` / `not applicable`, route/state evidence, and a stable report table. |
| Test Hardening: canonical non-visual suite before quality gates | template/unit | passed | Apply templates require authoritative discovery, fresh execution, recorded exclusions, and block on ambiguity/failure. |
| Verify: canonical non-visual suite before E2E | template/unit | passed | Verify templates require the same preflight before changed-journey acceptance. |
| Post-apply gates: exact native review → simplify → verify → design-verify order | template/unit | passed | Both apply forms are contract-tested for the ordered shared gate fragment. |
| Post-apply gates: no standalone profile dependency | template/unit + profile integration | passed | Apply embeds gates directly; standalone templates remain filtered by profile. |
| Post-apply gates: host-native review reuse and unnamed fallback | template/unit | passed | Tests assert fallback wording and no generated `code-review` identifier. |
| Post-apply gates: failure restart, `all_done` resume, and final output | template/unit | passed | Shared fragment and parity tests require rerun/restart semantics, durable outcome inspection, and evidence recording. |
| Verify: runnable journey E2E acceptance | template/unit | passed | Verify templates require real UI input, concrete driver, risk path, console/network signals, destructive-flow safety, and inspectable evidence. |
| Verify: unavailable, failed, or non-applicable E2E | template/unit | passed | Verify templates distinguish blocked prerequisites and failed applicable E2E from non-runnable scope, and block Correctness/Verify for applicable failure. |
| Workflow registration and supported command adapters | unit/integration | passed | 1,408-test suite covers registries; added representative Claude/Codex/OpenCode adapter paths and deselection detection. |
| Documentation inventory and terminology | documentation review + tests where available | passed | Docs distinguish proposal review, host-native final review, and the two `/sp:` workflows. |

## Boundary And Abnormal Case Sweep

| Surface | Cases To Attack | Coverage Decision | Status |
| --- | --- | --- | --- |
| Apply state | Tasks incomplete; canonical test suite ambiguous/failing; Test Hardening rows planned/failing; planned final-gate rows must not block hardening entry; missing final-gate record in `all_done`; gate failure after cleanup; blocked UI verification | template/unit | passed |
| Workflow registration | New IDs omitted from one explicit map; unwanted `code-review` ID; profile deselection cleanup | unit/integration | passed |
| Host variation | Native reviewer present, native reviewer unnamed, no browser driver, commands-only delivery | template/unit + init/update integration | passed |
| E2E evidence | Source-only inspection, screenshot-only claim, missing credential/runtime, failed applicable journey, non-runnable CLI-only change | template/unit | passed |
| Design verification | Non-UI diff, UI with visual DESIGN.md, UI with no design source, missing runtime, responsive/state rule | template/unit | passed |
| Paths | Generated command paths for OpenCode, Codex, Claude and representative adapters; deselection path cleanup | integration | passed |

## Non-Critical Path Sweep

| Path | Why It Matters | Coverage / Rationale |
| --- | --- | --- |
| Skills-only or commands-only delivery | Apply must retain automatic contracts even when standalone command/skill is absent | Init/update/profile integration tests |
| Existing custom profiles | New workflow IDs must be selectable without silently changing existing core/custom selections | Profile and drift tests |
| No code changes after native review | Simplify may report no cleanup while final verify/design gates still run | Apply and simplify template tests |
| Agent fan-out unavailable | Simplify must assess all four cleanup angles in one context and disclose the fallback | Simplify template contract |
| Missing visual DESIGN.md | Formal visual conformance cannot be claimed, but existing patterns may still be inspected | Design-verify template tests |
| Existing unrelated dirty diff | Final review scope must not absorb user-owned changes | Apply final-gate contract test |
| Ambiguous full test command | A partial package script must not become a false all-tests claim | Test Hardening and verify preflight contract tests |
| Documentation-only change | E2E and design verification may be not applicable with a concrete reason | Verify/design-verify report tests |

## Deferred Or Manual Coverage

| Gap | Reason Deferred | Safer Alternative / Follow-Up |
| --- | --- | --- |
| Real browser execution against every supported host | This repository distributes instruction templates and has no common runnable product UI across hosts | Test generated browser-evidence contract and run adapter/generation tests; validate live behavior in host integration testing later. |
| Native host code-review command invocation | Host capability discovery and invocation are runtime-agent behavior, not a portable CLI API | Test the explicit request/fallback contract and absence of a generated duplicate. |
| Pixel-level visual regression baselines | No design-image baseline system or browser dependency is introduced by this change | Require runtime screenshots/evidence and explicit DESIGN.md-rule references when an affected project supplies them. |

## Test Hardening Record

**Status:** passed — final-gate evidence remains pending below.

**Canonical non-visual suite authority:** `package.json` defines `build`, `lint`, and `test`; no visual-only validation script is declared.

| Command | Outcome | Evidence |
| --- | --- | --- |
| `pnpm run build` | passed | TypeScript compilation completed successfully after the review-driven contract fixes. |
| `pnpm run lint` | passed | ESLint completed without findings after the review-driven contract fixes. |
| `pnpm test` | passed | 1,408/1,408 tests passed after the review-driven contract fixes. |

The final verify preflight below must be a separate fresh run after Test Hardening passes.

## Final Quality Gates

| Gate | Outcome | Evidence |
| --- | --- | --- |
| Host-native code review | passed | Fresh distinct worker `final_gate_code_review_7` reviewed the integrated change, including delegated sequencing, hardening/gate separation, four-state E2E/simplify/design semantics, all-done recovery, docs, registry, and test contracts; no findings. Evidence: `git diff --check` and focused 8-file/317-test regression suite passed. |
| `/sp:simplify` | passed | Fresh distinct worker `final_gate_simplify_1` scoped the change-owned implementation/artifact diff, excluded unrelated `.vscode/settings.json`, and completed the four-angle review in disclosed single-pass fallback mode. No clearly behavior-preserving cleanup was found or applied. Evidence: resolved status/apply context, `git diff --check`, and parity test 7/7 passed. |
| `/sp:verify` | passed | Fresh distinct worker `final_gate_verify_1` ran `pnpm run build`, `pnpm run lint`, `pnpm test` (73 files/1,408 tests), `superpowers validate add-final-quality-gates --json`, and `git diff --check`, all passed. Requirement mapping found no issues. E2E is evidence-backed `not applicable`: the owned diff changes templates/CLI/docs/schema/tests, not a runnable browser/UI journey; the CLI E2E test is integration evidence, not browser E2E proof. |
| `/sp:design-verify` | not applicable | Fresh distinct worker `final_gate_design_verify_1` found no changed rendered route, component, interaction, responsive layout, or runtime UI state; the owned diff is CLI/template/registry/schema/docs/tests/artifacts. `rg --files -g DESIGN.md` found no repository visual source, which is non-blocking for this evidence-backed non-UI scope. No runtime visual pass is claimed; `git diff --check` passed. |
