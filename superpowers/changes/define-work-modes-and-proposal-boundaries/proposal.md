## Why

`skills/using-superpowers` currently describes proposal creation only in terms of vague task size and has no actionable rule for choosing direct modification versus a Proposal, estimating Proposal workload, or splitting a very large request. This causes two opposite failures: small fixes are fragmented into unnecessary changes, while large multi-feature requests force one agent to repeatedly reread and rewrite too much context, leading to context drift and lower implementation quality. The code-review dispatch skill also describes an outdated `/sp:apply` cadence and overlaps with the final quality-gate contract.

## What Changes

- Define two work modes: low-risk Direct Modification and high-risk `Proposal → Review → Apply`; remove the independent Plan Mode concept. A user-requested plan is an execution aid and follows Direct Modification handling unless the work crosses Proposal boundaries.
- Replace prompt-length and file-count intuition with a workload-first Proposal decision. Estimate implementation surface, layer breadth, behavior complexity, verification cost, orchestration cost, and context churn.
- Define concrete workload bands and splitting rules so multiple small features can share one Proposal, while multiple genuinely large features or an over-budget single feature are split into several bounded Proposals.
- Make the boundary between a Change Proposal and its internal Dispatch Units explicit. Proposal boundaries protect agent context and long-running execution quality; Dispatch Units divide ownership and safe parallelism inside one Proposal and are not independently archivable.
- Define decomposition guidance for very large and long-running requests, including stable milestone boundaries, dependencies between Proposals, shared-foundation handling, and promotion from direct work to a Proposal when scope grows.
- Rename `skills/requesting-code-review/` to a `when-to-dispatch-code-review` skill and reorganize it around dispatch timing, mode-specific integration, duplicate-review prevention, and the read-only reviewer/main-controller repair boundary.
- Keep `receiving-code-review` as the feedback-evaluation skill, keep `verification-before-completion` as the evidence-before-claims rule, and preserve the agreed repair ownership for code review, Simplify, Verify, and Design Verify.
- Extend bundled static-skill refresh so the renamed dispatch skill reaches existing configured tools and the obsolete installed directory is removed rather than left as a duplicate alias.
- Preserve the existing final-quality gate order and retry semantics; this change clarifies when those gates apply rather than creating another code-review workflow or a third planning lifecycle.

## Capabilities

### New Capabilities

- `work-mode-selection`: Select proportional Direct Modification or Proposal → Review → Apply handling, with explicit promotion rules and universal verification obligations.
- `proposal-workload-decomposition`: Estimate Proposal workload, split multiple large capabilities or over-budget work, and distinguish Change Proposals from internal Dispatch Units for long-running agent execution.
- `code-review-dispatch-guidance`: Provide a reusable, correctly named code-review dispatch skill that does not duplicate `/sp:apply` orchestration and makes repair ownership explicit.

### Modified Capabilities

- `sp-verify-skill`: extend the existing Verify contract with report-first findings, coordinator-owned repair, and fresh Verify retries at the existing gate boundary.

## Attachments

None.

## Impact

- `skills/using-superpowers/SKILL.md` — primary work-mode, Proposal sizing, multi-Proposal decomposition, and Change/Dispatch Unit guidance.
- `skills/requesting-code-review/**` → `skills/when-to-dispatch-code-review/**` — rename and reorganize into the new dispatch-focused skill; update its reviewer prompt and references.
- `skills/subagent-driven-development/**`, `skills/receiving-code-review/SKILL.md`, `skills/verification-before-completion/SKILL.md`, and `CLAUDE.md` — align references and clarify boundaries without changing their core responsibilities.
- `src/core/init.ts`, `src/core/update.ts`, `test/core/init.test.ts`, and `test/core/update.test.ts` — synchronize the renamed bundled static skill and remove the obsolete installed directory during refresh.
- Guidance and parity tests that assert skill names, review timing, generated/static paths, and workflow contracts.
- No product application runtime, API, schema, or user data behavior changes are intended; CLI skill distribution and generated workflow guidance are intentionally updated.
