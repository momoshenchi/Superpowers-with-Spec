## Why

Design currently anchors Contracts and Risks but not cross-path invariants, so implementations can pass local checks while breaking “always true” properties. Separately, when Final Quality Gates (code review / Verify) accept P0/P1 findings, coordinators often patch and retry without a durable record of alternative fixes, the chosen repair, or a regression guard—reintroducing bugs across gate rounds.

## What Changes

- Add a formal required `## Invariants` section to the default change-local `design.md` template and design artifact instruction (explicit `N/A` allowed when none apply).
- Introduce change-local `remediations.md` for accepted code-review / Verify P0 and P1 repairs: each entry MUST document multiple candidate fixes, select one optimal fix with rationale, and record root cause, concrete change, guard, and evidence.
- Update `/sp:apply` Final Quality Gates repair ownership so the coordinator creates or appends `remediations.md` before editing implementation for an accepted P0/P1; zero accepted P0/P1 repairs MAY omit the file or record a single N/A line.
- Update change-review, Verify, and related SDD/apply guidance so reviewers and next-round gate workers treat Invariants and remediations as first-class context; optionally link Final Quality Gates rows to remediation IDs (`R#`).
- Keep `remediations.md` out of `applyRequires` (not a propose-time blocker).

## Capabilities

### New Capabilities

- `change-design-invariants`: Normative rules for the required `## Invariants` section in change-local `design.md` (content, N/A, falsifiability, and review expectations).
- `change-remediations`: Normative rules for `remediations.md` lifecycle, multi-option repair selection, guards, evidence, and Apply/Verify integration.

### Modified Capabilities

- `sp-verify-skill`: Coherence/correctness verification MUST consider design Invariants when present (non-N/A) and MUST read existing `remediations.md` on retry rounds; report missing guards or unresolved remediations when accepted P0 repairs lack them.

## Attachments

None.

## Impact

- Schema sources: `schemas/spec-driven/templates/design.md`, new `schemas/spec-driven/templates/remediations.md`, `schemas/spec-driven/schema.yaml` design instruction (and fallback strings in `src/commands/schema.ts` as needed).
- Workflow templates: `src/core/templates/workflows/final-quality-gates.ts` (Final Quality Gates + Repair ownership source), `apply-change.ts` (interpolation/host wiring), `change-review.ts`, `verify-change.ts`, and parity projections under skills/commands.
- Related guidance: `skills/subagent-driven-development/SKILL.md` / when-to-dispatch-code-review only if repair-ownership wording must mention remediations.
- Tests asserting design template sections, remediations template presence, and Apply/Verify/Review instruction strings.
- **Non-impact:** `applyRequires` membership, archive merge semantics for master specs beyond the new/modified capabilities listed, Manual Coverage execution (`execute-manual-coverage`), runtime product CLI behavior beyond workflow text generation.
