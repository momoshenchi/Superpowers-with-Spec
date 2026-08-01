# 1. Separate test-plan coverage semantics

- [x] 1.1 Update the spec-driven test-plan template and schema instructions to replace the combined deferred/manual table with status-and-evidence-backed Manual Coverage plus Deferred Coverage.
- [x] 1.2 Update Test Hardening/apply instructions so concrete Manual Coverage statuses participate in completion and applicable blocked/failed rows stop apply.

# 2. Require Verify execution and evidence

- [x] 2.1 Extend `/sp:verify` skill and command contracts to execute each applicable Manual Coverage row after preflight, record actions/evidence, and classify passed, failed, blocked, or not applicable.
- [x] 2.2 Integrate Manual Coverage behavior with final-quality Verify retry/`BLOCKER` semantics without treating deferred rows as executed checks.

# 3. Regression coverage and documentation

- [x] 3.1 Add focused template, schema, and apply-state tests for split tables, unfinished manual statuses, blocking behavior, evidence fields, and Verify skill/command parity.
- [x] 3.2 Update user-facing workflow and command documentation with the manual-versus-deferred distinction and Verify's required execution behavior.
- [x] 3.3 Run focused checks, build, lint, canonical non-visual suite, change validation, and record Test Hardening evidence.
