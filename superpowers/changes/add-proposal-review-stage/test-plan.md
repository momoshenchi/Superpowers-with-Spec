## Testing Gap Analysis

Existing tests cover the generated workflow registry, profiles, init/update delivery, and template parity, but no test proves a generated pre-implementation review workflow or the required proposal lifecycle order. The new coverage must distinguish the review of proposal artifacts from the existing final integration review, while preventing accidental persistence in the schema artifact graph or re-review at apply time.

Worker-level tests validate each work package during implementation. This plan records integrated verification and Test Hardening after packages merge.

## Requirement And Scenario Coverage Matrix

| Requirement / Scenario | Planned Coverage | Status | Notes |
| --- | --- | --- | --- |
| Generated manual review skill and command | Template unit/contract test | passed | `pnpm exec vitest run test/core/templates/change-review.test.ts` |
| Review an alternate schema without delta specs | Template unit test | passed | Contract asserts schema status/declared artifact scoping rather than a fixed spec list. |
| Propose automatically reviews only after apply-required artifacts complete | Generated-template parity test | passed | `pnpm exec vitest run test/core/templates/change-review.test.ts test/core/templates/skill-templates-parity.test.ts` |
| Report appears before planning-artifact repair | Generated-template parity/contract test | passed | Ordering assertions require report → repair → re-review. |
| Resolvable BLOCKER/WARNING repair and decision pause | Generated-template test | passed | Contract covers mandatory repair, non-blocking SUGGESTION, and decision pause. |
| No review artifact or persisted approval | Static schema/workflow regression test | passed | Schema regression asserts no `review` artifact or `review.md`. |
| Apply does not auto-repeat proposal review | Apply template test | passed | Contract asserts apply is voluntary `/sp:review` only. |
| Separate final integration review | Review/apply template contract test | passed | Contract asserts the distinct cross-package/diff/full-validation review. |
| Work-package-aware review criteria | `test/core/change-review-guidance.test.ts` | passed | Root and generated guidance assert logical packages and Step 1–5 detail. |
| Core profile generation | Profile, init, update, command-generation, and drift tests | passed | Focused suite plus full `pnpm test` passed. |
| Onboarding explains both reviews | Onboarding/template parity test | passed | `test/core/templates/skill-templates-parity.test.ts` passed. |

## Boundary And Abnormal Case Sweep

| Surface | Cases To Attack | Coverage Decision | Status |
| --- | --- | --- | --- |
| Proposal lifecycle | Missing artifact, all artifacts complete, review with blocker, repair succeeds, decision remains unresolved | Template/contract tests | passed |
| Schema scope | `spec-driven`, no-spec schema, future schema with different `applyRequires` | Template guidance plus existing status fixtures | passed |
| Repair sequencing | Silent edit before report, readiness before re-review, unresolved blocker treated as approval | Ordering assertions | passed |
| Persistence boundary | `review.md`, artifact id, metadata, `applyRequires`, or approval parser added accidentally | Static regression assertions and final review | passed |
| Workflow selection | Core profile, custom includes review, custom excludes review, skills-only, commands-only, both | Existing init/update/profile test patterns | passed |
| Cross-platform files | Generated command paths on Windows-style separators and tool adapter output | Existing path-safe adapter tests extended as needed | passed |

## Non-Critical Path Sweep

| Path | Why It Matters | Coverage / Rationale |
| --- | --- | --- |
| Manual `/sp:review` after proposal edits | Users can review an existing or externally created change | Generated command contract and schema-aware scope tests |
| `/sp:continue` reaches a complete change | Automatic review must remain limited to `/sp:propose` | Lifecycle wording test; no automatic continue behavior |
| Partial implementation resumes | Apply must not add proposal-review overhead | Apply template regression test |
| Existing final integration reviewer | Proposal review must not remove or rename it | Subagent/apply guidance regression test |

## Deferred Or Manual Coverage

| Gap | Reason Deferred | Safer Alternative / Follow-Up |
| --- | --- | --- |
| Actual LLM execution of report-before-repair across all supported assistants | Repository tests validate generated instructions rather than live model behavior | Verify generated skill/command content and run a manual smoke walkthrough in a configured tool after release. |
| Quality of subjective findings | Completeness/clarity judgment is model-mediated | Keep concrete criteria and output structure in the review workflow; exercise representative real changes manually. |
