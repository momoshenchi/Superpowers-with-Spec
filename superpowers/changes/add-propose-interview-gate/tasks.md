# 1. Propose interview contract

## Prompt integration

- [x] 1.1 Add one reusable adaptive-interview guidance fragment in `src/core/templates/workflows/propose.ts` and include the same semantics in both `getSpProposeSkillTemplate()` and `getSpProposeCommandTemplate()`.
- [x] 1.2 Define the read-only preflight boundary, fact-versus-decision distinction, zero-question path, and trigger list for unresolved product and high-impact technical decisions.
- [x] 1.3 Define the one-question-at-a-time format with known facts, impact, recommendation, two or three meaningful alternatives, free-form response, delegated-decision handling, and host-tool fallback.
- [x] 1.4 Define the decision-closed summary and three-state final gate, including the no-write outcomes for requested changes and stopping.

# 2. Confirmed-decision artifact handoff

## Artifact generation and documentation

- [x] 2.1 Update Propose artifact-writing guidance so confirmed product decisions flow into `proposal.md` and high-impact technical decisions, alternatives, rationale, and trade-offs flow into `design.md` without creating `interview.md`.
- [x] 2.2 Preserve the existing explicit artifact list, dependency-ordered generation loop, automatic proposal review, and post-confirmation status output.
- [x] 2.3 Update `docs/workflows.md` and `docs/opsx.md` to describe the proportional interview gate, zero-question fast path, final confirmation, and no-write stop behavior.

# 3. Template parity and cross-platform verification

## Automated coverage

- [x] 3.1 Extend `test/core/templates/skill-templates-parity.test.ts` to assert the interview contract appears in both skill and command projections, including the pre-confirmation boundary, zero-question path, one-at-a-time format, technical trigger list, artifact handoff, and three-state gate.
- [x] 3.2 Update intentional template-function and generated-skill content hashes and retain parity assertions that prevent skill/command drift.
- [x] 3.3 Add or extend generation/update coverage to verify the changed Propose content is emitted through representative host adapters without changing adapter-specific frontmatter or paths.
- [x] 3.4 Verify read-only discovery and explicit artifact paths remain platform-neutral on macOS, Linux, and Windows; include the Windows CI or equivalent cross-platform verification required for path-sensitive workflow guidance.
- [x] 3.5 Run focused template tests, `superpowers validate add-propose-interview-gate`, build, lint, and the full test suite; record the evidence in `test-plan.md` during Test Hardening.
