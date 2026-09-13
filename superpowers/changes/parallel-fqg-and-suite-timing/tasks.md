# 1. Hardening suite timing

## Apply Hardening and canonical suite helper

- [x] 1.1 Reorder Test Hardening so `full-qa-test` / 10→10→10 expansion and landing automated cases happen before Git-aware selection.
- [x] 1.2 Pin two-layer no-dedup: Git-aware and registered `test-plan.md` rows both execute; one command log cannot close the other layer.
- [x] 1.3 Default Git-aware unavailable/empty/ambiguous to `git-aware-unavailable-recorded` (or `git-aware-empty-expected` on instruction-only diffs) without running a complete suite; allow `ran-complete-suite-optional` only for the listed exceptions.

# 2. Parallel pre-Verify wave

## Final Quality Gates and Verify reuse

- [x] 2.1 Replace sequential CR → Simplify → Verify → DV with spawn-parallel CR ∥ Simplify ∥ DV, then Verify after the wave is clear of P0.
- [x] 2.2 Implement P0 retry inside the wave: repair, re-spawn only unresolved CR/DV rounds in parallel until none of the three reports P0 or round four fails; do not start Verify on Simplify `failed`/`blocked`.
- [x] 2.3 Apply-FQG Verify SHALL reuse Hardening Git-aware evidence when implementation and baseline are unchanged; still runs Verify-owned `test-plan` rows and deferred `agent-browser`; re-preflights when CR, DV, Simplify, or a Verify repair changed implementation, or the baseline changed.
- [x] 2.4 Update `using-superpowers`, `subagent-driven-development`, `docs/workflows.md`, `docs/commands.md`, and `docs/concepts.md` gate-order copy; refresh existing Cursor apply/verify/using-superpowers projections via the TS path. Do not edit `.cursor/skills/full-qa-test/SKILL.md`.
