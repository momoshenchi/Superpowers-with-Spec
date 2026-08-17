# Requirement key: R1 independent tracks, R2 evidence ledger, R3 visual evidence, R4 phase gates, R5 context recovery, R6 bounded rereads, R7 explore read-only handoff.

# 1. Checkpoint contract tests

## Red tests and pressure coverage

- [x] 1.1 Add focused guidance-contract tests that initially fail for the required Debug Checkpoint sections, per-track and hypothesis statuses, evidence ledger fields, code/test/runtime/log/image/diagram evidence, visual analysis, diagrams, compaction recovery, reread budget, and no-progress escalation. (R1–R7)
- [x] 1.2 Add a pressure scenario covering repeated context compaction, a confirmed sibling track, and a still-open track; assert that the agent closes the confirmed track and hands off only the open track instead of restarting broad reads. (R1, R3, R5, R6, R7)
- [x] 1.3 Run the focused tests and record that failures are caused by the missing checkpoint contract rather than by test setup or unrelated baseline failures. (R1–R7)

# 2. Guidance implementation

## Systematic debugging and explore mode

- [x] 2.1 Extend `skills/systematic-debugging/SKILL.md` with the per-track checkpoint format, separate track/hypothesis statuses, phase exit criteria, typed evidence ledger, visual/image/diagram evidence rules, reread budget, no-progress escalation, and fresh-context recovery instructions while preserving the root-cause and read-only boundaries. (R1, R2, R4, R5, R6)
- [x] 2.2 Extend `src/core/templates/workflows/explore.ts` in both the generated explore skill and `/sp:explore` command content with checkpoint creation/recovery, rich code/runtime/image evidence, Mermaid/ASCII flow and data-flow guidance, and the rule that confirmed fixes hand off instead of modifying application code in explore mode. (R2, R3, R5, R7)


# 3. Cross-tool parity and verification

## Distribution and platform safety

- [x] 3.1 Update generated skill parity expectations only after the source template contract tests pass, and verify the generated explore skill and command contain identical checkpoint requirements. (R2, R3, R5)
- [x] 3.2 Add or update path-oriented assertions to use `path.join()`/`path.resolve()` and verify checkpoint image/source references remain valid on POSIX and Windows-style paths without slash assumptions. (R2, R3, R5)
- [x] 3.3 Run focused guidance tests, build, lint, and the full test suite; record this change's results separately from the seven known pre-existing baseline failures involving missing or stale change-review/subagent guidance files. (R1–R7)
