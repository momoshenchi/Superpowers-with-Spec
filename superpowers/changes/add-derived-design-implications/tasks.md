# 1. Design template and instruction

## Skeleton

- [x] 1.1 Extend `schemas/spec-driven/templates/design.md` Decisions comments with the six implication-scan dimensions, agent-owned labeling, and an optional `### Derived implications` placeholder; do not add a required `## Derived implications` heading or change existing top-level heading order
- [x] 1.2 Extend `schemas/spec-driven/schema.yaml` design `instruction` with the closed scan, derive-unless-boundary, observable delta-spec trace, WARNING-only review expectation, and “no extra required headings”
- [x] 1.3 Mirror the same scan comments and optional subsection in `src/commands/schema.ts` `case 'design':` fallback while preserving Current system / Contracts / Invariants / section order

# 2. Propose and change-review workflows

## Instruction text

- [x] 2.1 Update `src/core/templates/workflows/propose.ts` `PROPOSE_INTERVIEW_GUIDANCE` so the pre-confirmation summary lists compact agent-owned derived assumptions, non-boundary derivations are written without new questions, boundary derivations are interviewed, and post-confirm writes land in existing design headings plus observable delta specs
- [x] 2.2 Update `src/core/templates/workflows/change-review.ts` Completeness table and Design convention checks for the derived-implications scan: missing dimension is WARNING, never BLOCKER solely for a derived-implication gap, missing extra heading is not a finding, observable rule without spec trace is WARNING
- [x] 2.3 Align `.vscode/important_skills/change-review/SKILL.md` with the generated review scan wording so repo-skill parity still holds (Chinese review skill may paraphrase; keep the same severity and dimension contract)

# 3. Alignment tests

## String contracts

- [x] 3.1 Extend `test/core/templates/design-conventions.test.ts` to lock scan dimension names, optional `### Derived implications`, forbidden required `## Derived implications`, Propose summary/write rules, and review WARNING-only wording; keep `path.join` for file paths
- [x] 3.2 Extend `test/core/templates/change-review.test.ts` so generated review skill/command assert the scan, WARNING-only derived-gap severity, and “not a finding” for missing extra heading
- [x] 3.3 Update `test/core/templates/skill-templates-parity.test.ts` Propose/review content asserts and exact-content hashes after the workflow string changes; run `npm test -- test/core/templates/design-conventions.test.ts test/core/templates/change-review.test.ts test/core/templates/skill-templates-parity.test.ts` and expect pass on the developer OS (macOS/Linux/Windows via `path.join`, no hardcoded separators)
