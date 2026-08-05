# 1. Propose interview contract

## Prompt integration

- [ ] 1.1 Add one reusable adaptive-interview guidance fragment in `src/core/templates/workflows/propose.ts` and include the same semantics in both `getSpProposeSkillTemplate()` and `getSpProposeCommandTemplate()`.
- [ ] 1.2 Define the read-only preflight boundary, fact-versus-decision distinction, zero-question path, and trigger list for unresolved product and high-impact technical decisions.
- [ ] 1.3 Define the one-question-at-a-time format with known facts, impact, recommendation, two or three meaningful alternatives, free-form response, delegated-decision handling, and host-tool fallback.
- [ ] 1.4 Define the decision-closed summary and three-state final gate, including the no-write outcomes for requested changes and stopping.

# 2. Confirmed-decision artifact handoff

## Artifact generation and documentation

- [ ] 2.1 Update Propose artifact-writing guidance so confirmed product decisions flow into `proposal.md` and high-impact technical decisions, alternatives, rationale, and trade-offs flow into `design.md` without creating `interview.md`.
- [ ] 2.2 Preserve the existing explicit artifact list, dependency-ordered generation loop, automatic proposal review, and post-confirmation status output.
- [ ] 2.3 Update `docs/workflows.md` and `docs/opsx.md` to describe the proportional interview gate, zero-question fast path, final confirmation, and no-write stop behavior.

# 3. Template parity and cross-platform verification

## Automated coverage

- [ ] 3.1 Extend `test/core/templates/skill-templates-parity.test.ts` to assert the interview contract appears in both skill and command projections, including the pre-confirmation boundary, zero-question path, one-at-a-time format, technical trigger list, artifact handoff, and three-state gate.
- [ ] 3.2 Update intentional template-function and generated-skill content hashes and retain parity assertions that prevent skill/command drift.
- [ ] 3.3 Add or extend generation/update coverage to verify the changed Propose content is emitted through representative host adapters without changing adapter-specific frontmatter or paths.
- [ ] 3.4 Verify read-only discovery and explicit artifact paths remain platform-neutral on macOS, Linux, and Windows; include the Windows CI or equivalent cross-platform verification required for path-sensitive workflow guidance.
- [ ] 3.5 Run focused template tests, `superpowers validate add-propose-interview-gate`, build, lint, and the full test suite; record the evidence in `test-plan.md` during Test Hardening.
