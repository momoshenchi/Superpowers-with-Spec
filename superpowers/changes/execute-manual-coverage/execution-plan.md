## File Structure

- Modify:
  - `schemas/spec-driven/templates/test-plan.md`
  - `schemas/spec-driven/schema.yaml`
  - `src/core/templates/workflows/apply-change.ts`
  - `src/core/templates/workflows/verify-change.ts`
  - `docs/workflows.md`
  - `docs/commands.md`
- Test:
  - `test/core/artifact-graph/instruction-loader.test.ts`
  - `test/commands/artifact-workflow.test.ts`
  - `test/core/templates/skill-templates-parity.test.ts`

## Implementation Order

1. Add failing schema/template and generated-workflow assertions for the two tables, Manual Coverage status/evidence fields, and incomplete/blocked semantics.
2. Update schema/template and apply hardening instructions so manual rows are first-class completion rows while deferred rows remain explanatory only.
3. Update Verify skill and command text to execute each applicable manual row, capture evidence, and propagate failed/blocked outcomes.
4. Update documentation, deliberate template hashes, and focused tests.
5. Run integration validation; record actual evidence in `test-plan.md` and do not mark manual rows complete without execution evidence.

## Final Integration Review

Review the generated schema, apply skill/command, standalone Verify skill/command, and docs together. Confirm no wording allows a deferred item to be claimed as run, no required manual item can remain `planned` or `blocked` at completion, and `not applicable` requires scope evidence.
