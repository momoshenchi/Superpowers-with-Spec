## Context

The repository already contains `skills/change-review/SKILL.md`, a schema-aware pre-implementation review guide, but generated Superpowers workflows do not expose it as a `/sp:review` command and `/sp:propose` does not call it. The existing default flow therefore produces all artifacts and immediately presents `/sp:apply` as the next step.

The preceding work-package change deliberately reduced implementation-time review overhead: detailed checkbox tasks are grouped into logical work packages and receive one final cross-package integration review after implementation. This change adds a different review at a different time: it assesses whether the complete plan can be implemented without ambiguity before code changes begin.

## Goals / Non-Goals

**Goals:**

- Make proposal review available as a generated `review` workflow and `/sp:review` command.
- Automatically run proposal review after `/sp:propose` has completed all selected-schema implementation prerequisites.
- Enforce the conversational order report → repair → re-review → readiness, including an explicit pause for decisions that cannot be inferred.
- Preserve manual review at any later point without making it a persistent workflow artifact.
- Keep proposal review and implementation integration review semantically and operationally separate.
- Update review criteria for logical work packages and per-task Step 1–5 execution detail.

**Non-Goals:**

- Create `review.md`, persist approval state, or add review to the schema artifact graph or `applyRequires`.
- Re-run proposal review automatically at the start of `/sp:apply`, `/sp:continue`, or every resumed implementation session.
- Change how the CLI determines artifact completion or apply readiness.
- Replace the final post-implementation cross-package integration review or Test Hardening.
- Require an actual subagent for a logical `agent<id>` work package.

## Decisions

### Promote review to a generated workflow without making it an artifact

Add `review` to the core workflow registry and generate both a skill and a slash command from a shared TypeScript workflow template. That template is the source of truth for distributed Superpowers review behavior and allows a user to invoke `/sp:review <change>` independently of proposal creation.

The existing root `skills/change-review/SKILL.md` remains an in-repository entry point for this repository. It is maintained as a separate Markdown rendering of the generated workflow's normative behavior; it does not import TypeScript at runtime. A focused contract test asserts their shared schema-aware scope, severity policy, work-package criteria, report-before-repair sequence, lack of persistent state, and separation from final integration review.

An artifact such as `review.md` was rejected because the requested flow does not need a durable approval trail, and a file-presence artifact could not represent unresolved findings without extending the artifact-completion model.

### Make review a proposal postcondition, not an apply preflight

`/sp:propose` already loops until every `applyRequires` artifact is `done`. Immediately after that loop it will execute the proposal-review procedure. The final summary is emitted only after the procedure has either passed or paused on a decision that requires user input.

`/sp:apply` will deliberately not call the review workflow. This is a pseudo-mandatory convention for the normal proposal path, not a persisted or CLI-enforced gate. Users who create or alter a change through another path can invoke `/sp:review` manually.

### Separate reporting from repair

The automatic review sequence is explicit:

```text
complete apply-required artifacts
  → inspect and emit full review report
  → repair resolvable planning findings
  → run review again
  → ready for apply OR pause for a user/external decision
```

The workflow must not silently edit artifacts while reviewing or announce readiness before the repaired review passes. Every resolvable `BLOCKER` and `WARNING` is repaired; `SUGGESTION` findings remain visible but do not block readiness. A repair that needs an unprovided product, security, schema, or external-dependency choice pauses after reporting the decision; it may not invent one.

### Preserve two review contracts

| Review | Timing | Input | Outcome |
| --- | --- | --- | --- |
| Proposal review | After complete proposal artifacts, before implementation | requirements, design, tasks, execution plan, test plan, schema status | plan is implementable or needs artifact repair/decision |
| Final integration review | After all work packages integrate | implemented diff, requirements, test results, package interactions | implementation is ready after full validation |

The proposal reviewer checks `tasks.md` work-package ownership and the Step 1–5 detail for every task in `execution-plan.md`. It does not mandate per-checkbox delegation, formal review, or a 2–5-minute work unit.

## Risks / Trade-offs

- [Risk] An agent can bypass `/sp:propose` and begin implementation without a prior automatic review. → Mitigation: document the pseudo-mandatory boundary clearly and keep `/sp:review` easy to invoke manually; no false persistent approval is claimed.
- [Risk] The automatic repair loop may conceal important choices. → Mitigation: report before repair and pause for product, security, schema, or external-dependency decisions that cannot be inferred safely.
- [Risk] Root and generated review instructions drift. → Mitigation: treat the generated TypeScript template as distributed-workflow source of truth and add a contract test for the repository-local rendering.
- [Risk] Proposal review is mistaken for code review. → Mitigation: use distinct names, timing, inputs, and output criteria in proposal, apply, onboarding, and reviewer prompts.
- [Risk] Adding a core workflow changes generated file counts and profile sync behavior. → Mitigation: update init, update, profile, command-generation, and drift tests together.

## Migration Plan

1. Add review workflow templates and register `review` in profile, skill, command, detection, and synchronization registries.
2. Align the root `change-review` guidance with the shared proposal-review contract.
3. Update `/sp:propose` to report, repair, and re-review after its artifact loop; update `/sp:apply` to state it does not repeat proposal review.
4. Update onboarding and configuration guidance, then run focused generation/profile tests and the full suite.

Rollback removes the review workflow from generated registries and restores the prior propose final summary. No change artifacts require migration because no review state is stored.

## Open Questions

None. The automatic review is limited to `/sp:propose`; other entry points retain an optional manual `/sp:review` action.
