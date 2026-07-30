# 1. Shared final-gate retry contract

## Orchestration

- [x] 1.1 Extend the shared final-quality-gate instructions with explicit P0/CRITICAL, P1/P2, and BLOCKER meanings plus durable numbered-round evidence.
- [x] 1.2 Implement fresh code-review rounds that repair resolvable findings, retry only after P0, and fail when round four still finds P0.
- [x] 1.3 Replace the global restart-from-code-review rule with bounded Verify and design-verify retry entry points, immediate BLOCKER pause, and four-round terminal failure.

# 2. Standalone gate contracts

## Verify, simplify, and visual verification

- [x] 2.1 Extend Verify instructions and output to number fresh retry attempts, rerun canonical preflight/E2E for each Verify round, and expose terminal failure at round four.
- [x] 2.2 Extend Simplify instructions and output to record its Verify handoff without creating a separate Simplify retry loop.
- [x] 2.3 Extend design-verify instructions and output to number fresh visual retries, preserve rule/runtime evidence per round, and fail after round four.

# 3. Regression coverage and documentation

## Contract verification

- [x] 3.1 Add focused template-contract tests for P0/BLOCKER separation, round limits, retry entry points, fresh workers, and terminal outcomes across skill and command forms.
- [x] 3.2 Update workflow and command documentation to explain bounded retries and the distinct P0, P1/P2, and BLOCKER semantics.
- [x] 3.3 Run focused tests, build, lint, full non-visual suite, validation, and final delegated quality gates; record Test Hardening evidence.
