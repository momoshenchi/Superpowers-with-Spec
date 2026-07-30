## Testing Gap Analysis

Existing final-gate tests prove initial sequencing and global restart behavior, but do not distinguish P0/CRITICAL from a BLOCKER, count fresh attempts, prove the fourth-round terminal condition, or prove the three requested retry entry points. They also do not ensure that a Simplify cleanup transitions into Verify instead of a new Simplify or code-review cycle.

Workers run task-local template and registry tests from `tasks.md`. Test Hardening supplements them after integration by checking both generated forms, retry wording, terminal outcomes, documentation, and full repository validation. Test Hardening rows below exclude `## Final Quality Gates`, whose `Outcome` records are evaluated separately.

## Requirement And Scenario Coverage Matrix

| Requirement / Scenario | Planned Coverage | Status | Notes |
| --- | --- | --- | --- |
| P0 equals Verify CRITICAL; BLOCKER is an orthogonal state | template/unit | passed | Both generated apply forms and Verify assertions distinguish P0/CRITICAL from the non-priority BLOCKER state. |
| BLOCKER pauses without consuming a round | template/unit | passed | Shared, Verify, and Design Verify contracts assert immediate pause/no consumed round. |
| Code review passes after first non-P0 round | template/unit | passed | Shared contract asserts in-round repair and a no-P0 pass without a second review. |
| P0 code review receives fresh retry and fourth-round terminal failure | template/unit | passed | Shared contract asserts fresh worker, round evidence, no fifth review, and archive prohibition. |
| Simplify repair/completion hands off to Verify round one | template/unit | passed | Simplify and apply contracts assert no global review restart or independent Simplify loop. |
| Verify retry reruns full preflight and applicable E2E | template/unit | passed | Verify and apply contracts assert fresh rounds, canonical suite/E2E repetition, and round-four terminal failure. |
| Design retry stays at design-verify and fails at round four | template/unit | passed | Design Verify and apply contracts assert distinct rule/runtime evidence, local retry, and no fifth attempt. |
| Skill/command parity and generated content | template/unit + generation integration | passed | Template parity test verifies both forms and deliberate payload/generated-content hashes. |
| Documentation matches retry behavior | documentation review | passed | Reviewed `docs/workflows.md` and `docs/commands.md` against the shared contract. |

## Boundary And Abnormal Case Sweep

| Surface | Cases To Attack | Coverage Decision | Status |
| --- | --- | --- | --- |
| Retry count | First, second, third, fourth, and prohibited fifth attempt | template/unit | passed |
| Severity/state | P0/CRITICAL, P1/P2, unresolved P0, and BLOCKER | template/unit | passed |
| Verify evidence | Failed canonical suite, failed E2E, blocked browser/runtime, non-runnable scope | template/unit | passed |
| Design evidence | Failed rule, missing DESIGN.md/runtime, non-UI scope | template/unit | passed |
| Simplify safety | Safe cleanup, uncertain cleanup revert, unresolved cleanup, no eligible implementation | template/unit | passed |
| Worker isolation | Fresh retry worker, integrated report before next attempt, unavailable delegation | template/unit | passed |
| Filesystem/paths | Explicit change-owned scope and unrelated dirty worktree | template/unit | passed |

## Non-Critical Path Sweep

| Path | Why It Matters | Coverage / Rationale |
| --- | --- | --- |
| P1/P2-only code review | Must repair issues without spending a second review round | Shared-contract assertion and manual prose review |
| Simplify has no cleanup | Verify still begins once and receives its own four-round budget | Simplify/Verify contract assertion |
| Verify is not applicable for E2E | Evidence-backed N/A must not consume or fail a retry | Verify template assertion |
| Design is not applicable | Non-UI scope remains separate from visual pass/failure | Design template assertion |
| Profile lacks standalone commands | Apply retains embedded retry contracts | Existing profile integration suite plus template assertion |

## Deferred Or Manual Coverage

| Gap | Reason Deferred | Safer Alternative / Follow-Up |
| --- | --- | --- |
| Live native code-review severity normalization on every supported host | Native review output is host-agent behavior, not a portable CLI API | Assert the host-neutral P0/BLOCKER reporting contract and validate integrations manually per host. |
| Real browser retry against every supported host | This repository has no shared product UI or browser runtime | Test generated E2E/design retry contracts; validate a consuming project's runtime later. |

## Test Hardening Record

**Status:** complete

**Canonical non-visual suite authority:** Discover from `package.json`, CI, testing documentation, and this test plan after implementation.

| Command | Outcome | Evidence |
| --- | --- | --- |
| Focused workflow/template tests | passed | `pnpm exec vitest run test/core/templates/skill-templates-parity.test.ts test/commands/artifact-workflow.test.ts` — 71 passed; review added `change-review.test.ts`, 76 passed. |
| `pnpm run build` | passed | `node build.js` completed successfully. |
| `pnpm run lint` | passed | `eslint src/` completed without findings. |
| `pnpm test` | passed | Canonical non-visual suite from `package.json`: 73 files / 1,408 tests passed. |
| `superpowers validate bound-quality-gate-retries --json` | passed | Change validation passed: 1 item, 0 failed. |
| `git diff --check` | passed | No whitespace errors. |

## Final Quality Gates

| Gate | Outcome | Evidence |
| --- | --- | --- |
| Host-native code review | passed | Round 1, fresh worker `/root/quality_code_review_round_1`: no P0/CRITICAL, P1/P2, or BLOCKER; focused template/CLI/review tests 76 passed and `git diff --check` passed. |
| `/sp:simplify` | passed | Fresh worker `/root/quality_simplify`: no safe cleanup found; scoped four-angle review and focused tests 71 passed; handoff to Verify round 1. |
| `/sp:verify` | passed | Verify round 1, fresh worker `/root/quality_verify_round_1`: `pnpm test` (73 files/1,408 tests), build, `tsc --noEmit`, lint, validation, and diff check passed; browser E2E is scope-backed `not applicable` because no runnable UI journey changed. |
| `/sp:design-verify` | not applicable | Design verify round 1, fresh worker `/root/quality_design_verify_round_1`: non-UI workflow/template/docs/test scope; no repository visual source or changed UI runtime is required; no P0/CRITICAL or BLOCKER. |
