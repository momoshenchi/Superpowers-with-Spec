## Why

`/sp:propose` and `/sp:change-review` currently record what the user said, what the interview confirmed, and implementable detail for those decided items. They do not force the agent to derive the product and technical details that follow from the confirmed direction but were never mentioned—empty/deny paths, actor ownership, lifecycle, compatibility, contract shape—so implementers still guess during Apply.

## What Changes

- Add a closed implication scan to Propose, the design artifact instruction/template, and change-review: for a behavioral change, each dimension gets a derived rule or a short N/A.
- Write those derived details into existing `design.md` headings as agent-owned content (optional `Derived implications` subsection under Decisions). Do not add a required extra top-level heading.
- Sync derived details that change observable user behavior or acceptance into the change's delta specs.
- Keep the interview gate unchanged for non-boundary derivations: write them as assumptions; ask the user only when a derivation would reverse confirmed goal/scope/acceptance or cross a security/data/billing/public-contract boundary.
- Surface a compact list of those agent-owned derived assumptions in the pre-confirmation understanding summary so the user can correct them before create.
- Review missing scan coverage as WARNING only; never block proposal readiness solely for a derived-implication gap.
- Keep the work convention-only: no `validate` content parser, no new artifact, no `applyRequires` change, no onboard rewrite.

## Capabilities

### New Capabilities

- `change-design-derived-implications`: Normative rules for deriving unmentioned, implementation-critical product and technical details from a confirmed product/design direction, recording them in existing design headings, tracing observable ones into delta specs, and reviewing that scan without blocking readiness.

### Modified Capabilities

<!-- No master spec in `superpowers/specs/` currently encodes Propose or change-review content quality. Propose interview and design-convention deltas live in unarchived changes; this capability adds the derived-implication layer as a new spec rather than modifying a missing master. -->

## Attachments

None.

## Impact

- Propose workflow: `src/core/templates/workflows/propose.ts` (pre-confirmation summary + post-confirmation design/spec write rules) and generated Propose skill/command projections.
- Design sources: `schemas/spec-driven/templates/design.md`, `schemas/spec-driven/schema.yaml` design `instruction`, `src/commands/schema.ts` design fallback.
- Review sources: `src/core/templates/workflows/change-review.ts`, generated review skill/command, repo-local review skill projections (including `.vscode/important_skills/change-review/SKILL.md` parity).
- Tests that snapshot or assert those strings: `test/core/templates/design-conventions.test.ts`, `test/core/templates/change-review.test.ts`, `test/core/templates/skill-templates-parity.test.ts`.
- **Non-impact:** CLI `validate` parsers, artifact graph, `applyRequires`, archive merge mechanics, onboard long-form docs, extra interview questions for non-boundary derivations.
