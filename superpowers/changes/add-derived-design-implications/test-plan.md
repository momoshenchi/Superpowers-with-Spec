## Testing Gap Analysis

Existing design-convention and change-review tests pinned Current system, Contracts, Invariants, user-real vs agent-owned decisions, implementable detail, and Propose interview-gate wording. They did **not** pin the six implication-scan dimensions, optional `### Derived implications`, Propose derived-assumption summary, derive-unless-boundary, observable delta-spec trace, or WARNING-only derived-implication gaps.

Worker-level tasks 3.1–3.3 added those string contracts. Test Hardening re-ran the three focused files plus the canonical CI suite after units integrated. This change has no product UI; browser Manual Coverage is scope-backed `not applicable`. Critical Path is generated Propose/review/design instruction text.

Test Hardening is complete when every concrete testing or manual status row below is `passed`, `covered`, or scope-backed `not applicable`.

## Test Hardening Record

### Canonical non-visual suite preflight

| Authority | Selected command / check | Result | Evidence and scope |
| --- | --- | --- | --- |
| `package.json` `test` script and `.github/workflows/ci.yml` `test_matrix` / `test_pr` | `pnpm test` | passed with one unrelated pre-existing failure | Fresh run after build: 78 files passed, 1 failed, 1467/1468 tests passed. Sole failure: `test/core/debug-investigation-checkpoint-guidance.test.ts` expecting `diagnostic rereads` in `using-superpowers`. That file and skill are **not** in this change's diff. First parallel `pnpm test` raced `pnpm run build` (dist cleaned); discarded. |
| `test-plan.md` planned focused coverage | `npm test -- test/core/templates/design-conventions.test.ts test/core/templates/change-review.test.ts test/core/templates/skill-templates-parity.test.ts` | passed | 3 files, 29 tests passed |
| `.github/workflows/ci.yml` `lint` job | `pnpm run build` | passed | `✅ Build completed successfully!` |
| `.github/workflows/ci.yml` `lint` job | `pnpm exec tsc --noEmit` | passed | chained after build; lint ran (tsc non-zero would have stopped the `&&` chain) |
| `.github/workflows/ci.yml` `lint` job | `pnpm lint` | passed | ESLint `src/` completed with no errors |
| Change validation workflow | `superpowers validate add-derived-design-implications` | passed | Change reported valid |
| Repository diff hygiene | `git diff --check` | passed | No whitespace errors |
| Cross-platform CI authority | `.github/workflows/ci.yml` `test_matrix` | covered | Matrix includes ubuntu, macos, windows-pwsh; tests use `path.join`. This branch was not pushed; no remote Windows run claimed. |

Visual-only checks were excluded: this change edits agent instructions, schema template comments, and string tests; it adds no UI route.

## Requirement And Scenario Coverage Matrix

| Requirement / Scenario | Planned Coverage | Status | Notes |
| --- | --- | --- | --- |
| Closed scan / behavioral change records every scan dimension | unit | covered | `design-conventions.test.ts` `expectDerivedImplicationScan` on template, instruction, fallback |
| Closed scan / local helper may use one short N/A | unit | covered | “Local helpers MAY use one short N/A for the whole scan” in template, instruction, fallback, review |
| Closed scan / no extra required heading | unit | covered | `### Derived implications` present; `not.toMatch(/^## Derived implications/m)` |
| Existing headings / derived rule is not a user Choice | unit | covered | Propose + design keep model-inferred ≠ user Choice; derived items agent-owned |
| Existing headings / optional subsection is allowed | unit | covered | optional subsection in template; review missing invented H2 is not a finding |
| Spec trace / user-visible empty state is specified | unit | covered | Propose: observable user behavior → delta spec ADDED/MODIFIED |
| Spec trace / internal mapping stays design-only | unit | covered | Propose: `Implementation-only mappings may stay in design.md` (asserted) |
| Derive unless boundary / non-boundary written without a new question | unit | covered | “Do not add an interview question for non-boundary derived implications” |
| Derive unless boundary / boundary derivation is interviewed | unit | covered | security, persisted-data, billing, or public-contract interview trigger |
| Summary / shows derived assumptions before create | unit | covered | compact list of agent-owned derived assumptions |
| Summary / user corrects a derived assumption | unit | covered | re-scan only dependent dimensions; new summary before confirm |
| Review / missing scan dimension is WARNING | unit | covered | `change-review.test.ts` Derived implications scan |
| Review / derived gap never blocks readiness | unit | covered | `never BLOCKER solely for a derived-implication gap` |
| Review / missing extra heading is not a finding | unit | covered | `## Derived implications` missing → not a finding |
| Review / observable derived rule missing from specs is WARNING | unit | covered | delta-spec trace WARNING |
| Convention alignment / Propose instruction contains the scan | unit | covered | skill + command via `PROPOSE_INTERVIEW_GUIDANCE` |
| Convention alignment / design template does not add a required heading | unit | covered | section order unchanged; optional `###` only |
| Convention alignment / validate does not parse scan rows | unit | covered | `CLI validate MUST NOT parse scan rows`; this change still `validate`s; no parser added |
| Convention alignment / cross-platform instruction parity | unit | covered | `path.join` in tests; same instruction text on all OS |

## Boundary And Abnormal Case Sweep

| Surface | Cases To Attack | Coverage Decision | Status |
| --- | --- | --- | --- |
| Inputs and validation | Behavioral change with zero scan rows; local helper one-line N/A | unit: instruction + review WARNING for missing dimension (neither rule nor N/A); empty-reason N/A is a documented Risk, not a rubric row | covered |
| State and repeat actions | User corrects one derived assumption; WARNING repair must not force a second proposal-review round | unit: correction/re-summary wording; existing “do not re-run review solely for WARNING” retained | covered |
| Permissions and ownership | Derived authz that would cross a trust boundary vs reuse-list-auth N/A | unit: interview trigger vs derive-unless-boundary strings | covered |
| Filesystem and paths | Reading `schemas/spec-driven/templates/design.md` and `src/commands/schema.ts` on Windows | unit: `path.join(ROOT, ...)` only | covered |
| External and integration points | `superpowers validate` on a design that omits a scan dimension | live validate of this change still passes (no scan parser); review WARNING only | covered |

## Non-Critical Path Sweep

| Path | Why It Matters | Coverage / Rationale |
| --- | --- | --- |
| Hash refresh for Propose/review templates | Unrelated template edits would hide in hash updates | Task 3.3 updated only propose/review function and generated-skill hashes |
| `.vscode` Chinese review skill drift | Repo-skill parity test fails if Chinese implies BLOCKER for derived gaps | Task 2.3; `不得仅因推导缺口升为 BLOCKER` |
| Generated `.cursor` / `.codex` skills | Hand-editing projections would drift from templates | Not edited; parity hashes cover generation sources |
| Ritual N/A with no why | Scan becomes ceremony | N/A must state why; missing dimension is WARNING not BLOCKER |
| `docs/workflows.md` one-liner | Non-Goal: no docs rewrite | not applicable — not edited |

## Manual Coverage

| Check / Scenario | Execution Method and Environment | Status | Evidence |
| --- | --- | --- | --- |
| Generated Propose text includes scan, summary list, spec trace, derive-unless-boundary | other: `getSpProposeSkillTemplate().instructions` via focused vitest | passed | `design-conventions.test.ts` + `skill-templates-parity.test.ts` (29 tests pass). Source: `PROPOSE_INTERVIEW_GUIDANCE` in `src/core/templates/workflows/propose.ts` |
| Generated review text is WARNING-only for derived gaps | other: `getChangeReviewSkillTemplate().instructions` via focused vitest | passed | `change-review.test.ts` asserts `never BLOCKER solely for a derived-implication gap` |
| `superpowers validate add-derived-design-implications` still passes with no scan parser | cli: repo root | passed | `Change 'add-derived-design-implications' is valid` |
| Full unit suite after integration | cli: `pnpm test` (package.json `test` / CI) | passed | 1467 passed; 1 pre-existing unrelated fail in `debug-investigation-checkpoint-guidance.test.ts` (not in this diff) |
| Product UI / browser journey | programmatic-browser / agent-browser | not applicable | No UI route, no visual DESIGN.md change |
| Windows remote CI for this branch | cli: GitHub `test_matrix` | not applicable | Local tests use `path.join`; branch not pushed; no remote Windows run claimed |

Critical Path is the generated Propose and change-review instruction text (other/cli above), not a browser journey.

## Deferred Coverage

| Gap | Reason Deferred | Safer Alternative / Follow-Up |
| --- | --- | --- |
| Live `/sp:propose` E2E with a real user correcting a derived assumption | Host conversation is nondeterministic; no in-repo Propose runtime | String contracts + human smoke after ship |
| CLI validate parser that fails missing scan rows | Explicit Non-Goal | Change-review WARNING only |
| Full `/sp:review` subagent E2E on a fixture change missing lifecycle | Subagent output is nondeterministic | Rubric string pins + optional later fixture |
| Onboard long-form chapter | Explicit Non-Goal | Skills/commands carry the contract |

## Final Quality Gates

| Gate | Round | Fresh worker | Outcome | Commands / runtime evidence | Findings and resolution | Remediation |
| --- | --- | --- | --- | --- | --- | --- |
| code review | 1 | [Code review](6c60c5f6-1ca4-4e17-ae80-41f45810442a) | passed | Relied on Test Hardening: focused 29 pass; `pnpm test` 1467 pass + 1 unrelated fail; build/lint/tsc/validate pass | No findings | none |
| `/sp:simplify` | 1 | [Simplify](447ee211-334e-4758-b609-726d2b2fde74) | passed | `git diff HEAD` on owned paths; single-pass four-angle review; no edits so no re-run | Applied none; skipped intentional dimension-list mirroring | none |
| `/sp:verify` | 1 | [Verify](6a2612a9-3651-4ae6-a181-241f27f5ae73) | passed | Fresh `pnpm run build`, `tsc --noEmit`, `pnpm lint`, `pnpm test` (1467 pass / 1 unrelated fail), `superpowers validate` pass | 2× P1 WARNING repaired in coordinator (interview timing; false covered rows). No P0. No Verify retry (P1-only) | R1, R2 |
| `/sp:design-verify` | 1 | [Design verify](3b7c6fd3-0afc-427e-8548-5f7f37967850) | not applicable | Scope check only; no runtime | Non-UI: instruction/template/test strings only; no routes/CSS/visual DESIGN.md | none |

**not applicable (Design verify):** owned diff has no user-facing UI. Not a visual pass.

**Unrelated suite failure:** `test/core/debug-investigation-checkpoint-guidance.test.ts` (`diagnostic rereads`) is outside this change's diff and is not treated as a gate failure for this change.

