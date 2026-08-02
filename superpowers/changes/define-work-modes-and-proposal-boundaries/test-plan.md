## Testing Gap Analysis

The current repository has guidance tests for Dispatch Unit wording and generated workflow parity, but it does not test the root `using-superpowers` decision rules, workload-first Proposal partitioning, or the distinction between a Proposal context budget and an internal Dispatch Unit. It also does not assert that the generic code-review dispatch skill avoids the obsolete `/sp:apply` batch cadence, that final-gate repair ownership is explicit, or that the existing `sp-verify-skill` contract is represented by the new Verify delta.

Implementation workers will run focused guidance and parity tests in their task blocks. Test Hardening must add or strengthen coverage for the integrated root skill, renamed static skill, generated instructions, live references, Windows-safe path handling, and the full project validation commands after all units are integrated. Passing worker-level tests is necessary but not sufficient for final apply completion.

## Requirement And Scenario Coverage Matrix

| Requirement / Scenario | Planned Coverage | Status | Notes |
| --- | --- | --- | --- |
| Two proportional work modes: small local edit; user asks for a plan; Proposal-required request | Guidance contract | covered | 10/10 `test/core/using-superpowers-guidance.test.ts` passed |
| Direct Modification promotion: schema discovery; multiple large surfaces/context churn | Guidance contract | covered | Root-skill promotion assertions passed |
| Proposal Apply gates: Proposal reaches implementation; direct UI completion | Guidance + generated parity | covered | Root skill and parity assertions passed |
| Work-mode choice ignores prompt length: short high-risk; long local request | Guidance contract | covered | Explicit risk/length assertions passed |
| Six-dimension workload estimate: bounded capability; large capability | Guidance contract | covered | Six 0–3 dimensions and score bands asserted |
| Multiple small features share one Proposal: cross-domain small fixes; high-risk small fix | Guidance contract | covered | Combined budget and risk override guidance asserted |
| Multiple large capabilities split before Dispatch Units: canvas + messaging; large + small companion | Guidance contract | covered | Canvas/notification and large-capability calibration examples asserted |
| Very large capability: stable milestones; no coherent milestone | Guidance contract | covered | Staged Proposal and single-Change exception assertions passed |
| Change versus Dispatch Unit: multi-layer capability; non-archivable unit | Guidance + schema terminology | covered | Root guidance and schema terminology assertions passed |
| Long-running Proposal dependencies: contract consumer; disjoint parallel Proposals | Guidance contract | covered | Prerequisite, unblocks, stable-interface cases asserted |
| Timing-oriented code-review identity: renamed live path; Windows refresh | Static guidance + path tests | covered | Dispatch, init, and update tests passed; path construction uses `path.join()` |
| Mode-aware duplicate-safe dispatch: Apply final gate; standalone SDD; direct delivery boundary | Guidance + SDD contract | covered | No per-batch review and one integrated final review assertions passed |
| Repair ownership: valid P0/important finding; unclear feedback | Guidance + generated parity | covered | Read-only workers, coordinator repairs, and Simplify safe-edit assertions passed |
| Verify capability delta: report-first worker, coordinator repair, fresh Verify retry | Delta spec + generated parity | covered | Verify delta and parity assertions passed |
| Verify unclear feedback and clean completion | Delta spec + generated parity | covered | Ambiguity investigation and clean-advance contract asserted |
| Retry policy remains in Apply: no-P0 round; blocked prerequisite | Generated parity | covered | P0/P1/P2/BLOCKER and fresh-worker retry contracts passed |

## Boundary And Abnormal Case Sweep

| Surface | Cases To Attack | Coverage Decision | Status |
| --- | --- | --- | --- |
| Inputs and classification | Empty/ambiguous request, explicit Proposal request, user-requested plan, prompt length misleading risk | Guidance tests | covered |
| Workload scoring | Boundary scores 5/6, 10/11, 14/15; shared foundation counted once; file count alone insufficient | Guidance tests | covered |
| Split decisions | Two small features, two large features, one large + small, one very large with/without stable milestones | Guidance tests | covered |
| Change/Unit semantics | Unit headings, combined units, inline execution, non-archivable unit, no live-agent identity assumption | Guidance + schema-reference assertions | covered |
| State and repeat actions | Direct work promoted after scope grows; Apply does not trigger duplicate per-batch review; standalone SDD does not double-review | Guidance/parity tests | covered |
| Permissions and ownership | Read-only code-review/Verify/Design Verify; Simplify safe self-edit; coordinator repair | Generated parity | covered |
| Filesystem and paths | Renamed static skill path on macOS/Linux/Windows; no hardcoded separators; no duplicate alias | Init/update and guidance tests | covered |
| Static skill upgrade migration | Existing configured tool has old directory; update removes it and installs only the new directory | Init/update tests | covered |
| External and integration points | Host-native review availability, Apply final gate boundary, static bundled asset refresh | Guidance and existing distribution tests | covered |

## Non-Critical Path Sweep

| Path | Why It Matters | Coverage / Rationale |
| --- | --- | --- |
| Long request that remains local | Prevents prompt length from forcing a Proposal | Automated guidance assertion |
| Multiple tiny fixes across feature names | Prevents over-fragmentation and unnecessary artifact overhead | Automated workload example |
| Historical archived reference | Avoids rewriting history while removing stale live references | `rg`-based live-reference check |
| No visual/runtime scope | This guidance-only change has no product UI journey | Design Verify is scope-backed `not applicable` |
| Worker cannot self-repair a product finding | Keeps reviewer independence and coordinator ownership explicit | Generated workflow contract |

## Test Hardening Record

### Canonical non-visual suite preflight

Authority was discovered from `package.json`, `.github/workflows/ci.yml`, and `README.md`:

| Command | Authority | Fresh result |
| --- | --- | --- |
| `pnpm run build` | `package.json` `build`; CI Build project step | passed — build completed successfully |
| `pnpm test` | `package.json` `test`; CI Run tests step | passed — 75 files, 1,431 tests at Test Hardening; latest Verify preflight passed with 1,435 tests after gate remediation coverage |
| `pnpm exec tsc --noEmit` | CI Lint & Type Check job | passed — exit 0 |
| `pnpm lint` | `package.json` `lint`; CI Lint step | passed — exit 0 |

Visual-only or interactive checks excluded from this non-visual preflight: `pnpm run test:ui` (interactive Vitest UI) and product browser/design journeys. No product UI/runtime route is in scope for this guidance/CLI change; the Manual Coverage row below records that scope-backed disposition. The CI matrix's Linux/macOS/Windows reruns are not locally reproducible in one workspace and are retained as repository-level follow-up rather than misreported as local evidence.

### Hardening additions and gap disposition

- Added root work-mode, workload-boundary, concrete decomposition, and Dispatch Unit regression assertions.
- Added repair-matrix parity assertions for final gates and feedback/evidence boundaries.
- Added renamed static-skill clean-install, upgrade, multi-tool, and platform-safe path coverage.
- Re-ran focused guidance/parity suites plus build, lint, type check, full test, structural validation, and `git diff --check` after integration.
- No scoped hardening gap remains. Empirical calibration across repositories remains intentionally deferred below.

## Manual Coverage

| Check / Scenario | Execution Method and Environment | Status | Evidence |
| --- | --- | --- | --- |
| Confirm the change only modifies workflow guidance, static-skill distribution, templates, references, and tests; no product UI or runtime journey is introduced | Inspect the integrated diff and change artifacts in the repository workspace; no product browser/runtime entry point exists for this workflow/CLI scope | not applicable | Scope evidence: proposal Impact and execution-plan File Structure contain only `skills/`, `src/core/templates/workflows/`, `src/core/init.ts`, `src/core/update.ts`, change-local specs, `docs/`, `CLAUDE.md`, and tests; no product route/component/data surface |

## Deferred Coverage

| Gap | Reason Deferred | Safer Alternative / Follow-Up |
| --- | --- | --- |
| Empirical calibration of workload score bands across many repositories and models | This change defines an initial guidance rubric; production telemetry and broad field data are outside scope | Collect examples during later large-task proposals and adjust prose bands in a separate guidance change without changing artifact schemas |

## Final Quality Gates

Final-gate rows are evaluated separately after Test Hardening and do not make the pre-implementation coverage draft appear complete.

| Gate | Round | Outcome | Fresh worker | Evidence / Resolution |
| --- | --- | --- | --- | --- |
| Host-native code review | 1 | passed | `/root/final_code_review_round1` | Worker changed implementation: no. Worker reviewed the integrated tracked/untracked diff; P0=0, BLOCKER=0, P1=2, P2=1. Coordinator repaired the up-to-date/commands-only/multi-tool static refresh path in `src/core/update.ts` and tests, clarified Direct→Proposal promotion in `skills/when-to-dispatch-code-review/SKILL.md`, and removed routine post-Apply Verify duplication from active docs. Targeted guidance/parity/update tests: 4 files, 83 tests passed after the mixed-version regression; no second review required. |
| `/sp:simplify` | one pass | passed | `/root/final_simplify_pass` | Worker changed implementation: no. Fresh worker used single-pass fallback for all four cleanup angles; no safe behavior-preserving cleanup identified or applied. Scope stayed unchanged; 6 target files/137 tests, validate, diff-check evidence passed. Handoff: Verify round 1. |
| `/sp:verify` | 1 | passed | `/root/final_verify_round1` | Worker changed implementation: no. Fresh worker reran build, test (75 files/1,435 tests), typecheck, and lint; all passed. Manual Coverage is scope-backed `not applicable`; no runnable product/browser journey exists, so E2E is scope-backed `not applicable`. P0/CRITICAL=0, BLOCKER=0, P1=1 documentation inconsistency repaired by coordinator in `docs/concepts.md` and `docs/commands.md`; no Verify retry required. |
| `/sp:design-verify` | 1 | not applicable | `/root/final_design_verify_round1` | Worker changed implementation: no. Fresh worker inspected 23 tracked + 14 untracked files and found no route, component, style, asset, interaction, or responsive/state implementation. Proposal/design/execution-plan/test-plan scope evidence excludes product UI; no repository visual source or browser runtime was required. No retry. |

## Final Integrated Validation

After all gate reports and coordinator repairs, the complete canonical suite was rerun: `pnpm run build` passed, `pnpm test` passed (75 files / 1,435 tests), `pnpm exec tsc --noEmit` passed, and `pnpm lint` passed. `superpowers validate define-work-modes-and-proposal-boundaries --json` returned `valid: true` with zero issues; `git diff --check` passed. A live-reference scan found no active obsolete review path or fixed-batch review cadence; remaining `requesting-code-review` mentions are migration cleanup constants and negative-path tests. No UI/runtime journey was introduced, so Design Verify remains scope-backed `not applicable`.
