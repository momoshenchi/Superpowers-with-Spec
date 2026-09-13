## Why

Apply's Final Quality Gates still serialize code review → Simplify → Verify → Design verify, and both Hardening and Verify always re-run the canonical non-visual preflight. That costs a full extra suite pass on instruction-only diffs and blocks three independent gates behind each other. Agents also still treat Git-aware failure modes as a reason to run the complete canonical suite, which reopens complete-suite theater.

## What Changes

- After Test Hardening, when the host can spawn subagents, run **code review**, **Simplify**, and **Design verify** as one parallel wave. After a Code review or Design verify P0 is repaired, retry the still-unresolved gates of that wave in parallel until none of the three reports P0 (each of CR/DV still capped at four rounds). Only then run **one Verify sequence** (Verify keeps rounds 1–4).
- Keep the two evidence layers (Git-aware non-`test-plan` stage **and** registered `test-plan.md` rows) and **do not dedupe** their execution.
- In Test Hardening, expand and land `full-qa-test` / 10→10→10 cases **before** Git-aware selection so `--changed` sees the new tests.
- If Git-aware is unsupported, baseline-unclear, or selection empty/ambiguous: record the limitation and **do not** run the complete suite. Complete suite is allowed only when the user explicitly asks, CI already requires it, or related selection is empty **and** that emptiness is not expected **and** no focused command can be constructed.
- Verify **reuses** Hardening Git-aware evidence (or the recorded limitation) when **implementation and Git baseline are both unchanged** since that Hardening suite-stage record. Any code-review, Design-verify, Simplify, or Verify repair that changed implementation, or a baseline change, **re-runs** Git-aware (or records the limitation). Reuse never skips Verify-owned `test-plan` rows or deferred `agent-browser`.

## Capabilities

### New Capabilities

- `final-quality-gate-parallelism`: Apply Final Quality Gate wave (code review ∥ Simplify ∥ Design verify, then Verify) including P0-parallel retry and spawn fallback.
- `test-hardening-suite-stage`: Hardening order, two-layer no-dedup execution, Git-aware unavailable recording, and complete-suite exceptions.

### Modified Capabilities

- `sp-verify-skill`: Apply-FQG Correctness suite preflight SHALL reuse Hardening Git-aware evidence only on zero implementation diff and unchanged baseline since that record; CR/DV/Simplify/Verify repairs that change implementation, or a baseline change, re-run preflight; deferred `agent-browser` rows still execute. Standalone `/sp:verify` always preflights.

## Attachments

None.

## Impact

- `src/core/templates/workflows/final-quality-gates.ts`, `apply-change.ts`, `verify-change.ts`, and generated `.cursor` command/skill projections for apply/verify/simplify/design-verify.
- `skills/using-superpowers/SKILL.md` and `skills/subagent-driven-development/SKILL.md` (and their Cursor copies) gate-order sentence.
- `docs/workflows.md`, `docs/commands.md`, `docs/concepts.md`.
- Guidance/parity tests that pin sequential FQG order, “run the canonical preflight again”, or complete-suite fail-closed.
- Out of scope: `.cursor/skills/full-qa-test/SKILL.md`; CLI flags; artifact graph; `continue-change.ts`.
