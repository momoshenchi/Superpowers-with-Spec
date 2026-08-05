## Testing Gap Analysis

The current Propose coverage verifies generated template parity, exact content hashes, artifact-generation wording, and the automatic proposal-review contract. It does not yet assert the new pre-confirmation boundary, the ability to ask zero questions, the trigger distinction between facts and decisions, one-question-at-a-time presentation, delegated recommendations, the three final outcomes, or the routing of confirmed decisions into `proposal.md` and `design.md`. It also does not provide a manual smoke path for host question-tool fallback or a cross-platform check of the affected generation/update fixtures.

Worker-level verification for individual prompt, documentation, and test tasks remains in `tasks.md` and `execution-plan.md`. After those units are integrated, Test Hardening will strengthen semantic parity assertions, generation/update coverage, documentation consistency, and macOS/Linux/Windows path evidence here. Passing worker-level tests is necessary but not sufficient for final apply completion.

Test Hardening is complete only when every concrete testing or manual status row below is `passed`, `covered`, or scope-backed `not applicable`.

## Requirement And Scenario Coverage Matrix

| Requirement / Scenario | Planned Coverage | Status | Notes |
| --- | --- | --- | --- |
| Pre-confirmation boundary / read-only preflight precedes change creation | Template contract test plus manual walkthrough | planned | Assert the instruction order keeps `superpowers new change` and explicit artifact writes after confirmation. |
| Pre-confirmation boundary / user stops before confirmation | Template contract test plus manual host check | planned | Confirm stop outcome states that no change directory or artifact is created. |
| Pre-confirmation boundary / cross-platform preflight paths | Path-aware generation/update test and Windows run | planned | Use `path.join()`/`path.resolve()` in fixtures and record native-separator evidence. |
| Adaptive depth / clear low-risk request has no questions | Template contract test plus manual walkthrough | planned | Assert zero questions are allowed but final summary confirmation remains required. |
| Adaptive depth / ambiguous product scope | Template contract test and manual scenario | planned | Verify scope, non-goal, capability, and acceptance ambiguity triggers one focused question. |
| Adaptive depth / high-impact technical choice | Template contract test and manual scenario | planned | Verify listed architecture/data/contract/security/reliability/performance/compatibility/deployment/dependency categories trigger questions when unresolved. |
| One-at-a-time / structured decision question | Template contract test | planned | Check known facts, impact, recommendation, alternatives, free-form response, and wait-for-answer wording. |
| One-at-a-time / user delegates a decision | Template contract test and manual scenario | planned | Check recommendation adoption and dependent-decision re-evaluation. |
| Decision closure / decision-closed summary | Template contract test and manual walkthrough | planned | Verify confirmed decisions are separated from agent-owned assumptions before the gate. |
| Decision closure / user corrects the summary | Template contract test and manual scenario | planned | Verify correction returns to the affected branch and requires a new complete summary. |
| Three-state gate / confirm and create | Template ordering test and manual scenario | planned | Confirm existing artifact loop and review follow only the confirm outcome. |
| Three-state gate / request changes | Template contract test and manual scenario | planned | Verify writes remain closed while corrections are collected one at a time. |
| Three-state gate / stop without creating | Template contract test and manual scenario | planned | Verify clean no-write termination. |
| Artifact handoff / product decisions in proposal | Template contract test and generated-content inspection | planned | Check explicit routing to `proposal.md` sections and no transcript artifact. |
| Artifact handoff / technical decisions in design | Template contract test and generated-content inspection | planned | Check options, choice, rationale, trade-offs, and three-option rule for major decisions. |
| Artifact handoff / no separate interview artifact | Schema/status validation and template contract test | planned | Verify the artifact list remains proposal, specs, design, tasks, execution-plan, and test-plan. |

## Boundary And Abnormal Case Sweep

| Surface | Cases To Attack | Coverage Decision | Status |
| --- | --- | --- | --- |
| Inputs and validation | Missing input, clear request, ambiguous scope, conflicting requirement, user correction | Template assertions plus manual conversation matrix | planned |
| State and repeat actions | Zero-question summary, repeated confirmation, changed decision with dependent branch, stop after several questions | Static state-flow assertions plus manual walkthrough | planned |
| Permissions and ownership | User-owned product decision, agent-owned routine implementation detail, delegated decision, unresolved high-impact choice | Template contract and manual scenario | planned |
| Filesystem and paths | Existing specs discovery, nested project path, change artifact names, macOS/Linux/Windows separators | `path.join()`/`path.resolve()` fixture tests plus Windows run | planned |
| External and integration points | Structured question tool available, tool unavailable, existing `superpowers` commands, generated skill/command adapters | Generation tests plus host fallback manual check | planned |

## Non-Critical Path Sweep

| Path | Why It Matters | Coverage / Rationale |
| --- | --- | --- |
| Zero-question fast path | Preserves Propose's quick-path promise while retaining explicit confirmation | Planned semantic parity assertion and manual clear-request walkthrough |
| User delegates a decision | Prevents unnecessary friction when the user accepts the agent's recommendation | Planned template assertion and manual scenario |
| Host lacks structured question tool | Generated instructions must remain usable across supported hosts | Planned fallback wording assertion and manual natural-language walkthrough |
| User stops before change creation | Ensures the new gate does not leave partial change directories or artifacts | Planned manual no-write check in a disposable project |
| Existing proposal review flow | Prevents the new preflight from duplicating or moving the established post-artifact review | Planned `change-review.test.ts` regression coverage |
| Documentation-only quick-path examples | Contradictory docs can cause agents to skip the gate or over-question | Planned `git diff --check`, anchor review, and documentation search |

## Manual Coverage

| Check / Scenario | Execution Method and Environment | Status | Evidence |
| --- | --- | --- | --- |
| Clear request with zero interview questions | Run generated `/sp:propose` in a disposable repository with a complete low-risk request; inspect that only the final summary confirmation is shown before creation | planned | Record host, request, visible prompts, and whether the change appears only after confirmation |
| Ambiguous scope asks one question at a time | Run generated Propose with two plausible product scopes; answer one question, then inspect the next prompt | planned | Record each prompt, recommendation, answer, and absence of batched unrelated questions |
| High-impact technical decision is surfaced | Use a request with two viable architecture or data choices; verify the agent presents options and a recommendation before confirmation | planned | Record the options, selected decision, and resulting `design.md` content |
| Summary correction loops safely | Select the semantic request-changes outcome (the localized label may vary), correct one summary item, and verify no change directory exists before the revised summary is confirmed | planned | Record filesystem listing, revised summary, and final gate outcome |
| Confirm-and-create handoff | Select the semantic confirm-and-create outcome after a decision-closed summary; inspect `proposal.md`, `design.md`, and subsequent artifact progress | planned | Record change path, artifact list, and status output |
| Stop without creating | Select the semantic stop-without-creating outcome from the final gate in a disposable repository | planned | Record that no change directory or explicit artifact path was created |
| Structured question tool fallback | Run in a host without the named question tool or simulate unavailable tool behavior; answer using ordinary conversation | planned | Record fallback prompt and confirm one-at-a-time behavior remains intact |
| Generated host parity | Generate the Propose skill and command for representative supported hosts and inspect body content plus host-specific frontmatter/path | planned | Record tool names, generated paths, and semantic body comparison |
| Windows path behavior | Run focused generation/update tests and one clear-request walkthrough on Windows | planned | Record OS, Node/pnpm versions, commands, native paths, and results |

## Deferred Coverage

| Gap | Reason Deferred | Safer Alternative / Follow-Up |
| --- | --- | --- |
| Fully automated end-to-end validation of interactive agent answers across every host | Propose is generated instruction content; host question tools and conversational state are outside this repository's runtime test surface | Cover semantic instructions statically, run representative host smoke checks, and add host-specific automation only when a stable harness exists |
| Cross-session interview resume | The agreed design intentionally has no persistent interview state or `interview.md` artifact | Confirm stop is no-write and rely on a new conversation/request rather than risking stale decision state |
