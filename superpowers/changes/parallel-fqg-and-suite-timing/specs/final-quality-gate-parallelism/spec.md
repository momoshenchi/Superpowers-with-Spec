## ADDED Requirements

### Requirement: Apply SHALL run a parallel pre-Verify wave
After Test Hardening, when the host can spawn subagents, Apply SHALL dispatch code review, Simplify, and Design verify as one parallel wave against the same post-Hardening snapshot. Apply SHALL NOT start Verify until that wave is integrated and none of the three gates reports P0 (Simplify uses `passed` / `failed` / `blocked` / `not applicable`, not defect P0). Missing spawn SHALL use labeled `same-context fallback` and run the three gates sequentially in the listed order before Verify. Missing spawn is not by itself `blocked`. When spawn exists, Apply SHALL NOT require integrating each of code review, Simplify, Verify, and Design verify before starting the next; that sequential four-gate chain from in-flight `slim-agent-instruction-ceremony` `propose-and-apply-autonomy` is superseded. Sequential CR → Simplify → DV remains only as spawn-absent fallback, after which Verify still waits for a P0-clear pre-Verify wave.

#### Scenario: Host can spawn three gate workers
- **WHEN** Test Hardening is complete and the host can launch subagents
- **THEN** the coordinator SHALL spawn distinct fresh workers for code review, Simplify, and Design verify without waiting for any one of them to finish before starting the others
- **AND** it SHALL NOT start Verify until all three workers of the current wave have completed and their results are integrated

#### Scenario: Host cannot spawn
- **WHEN** the host cannot launch a subagent
- **THEN** the coordinator SHALL run code review, then Simplify, then Design verify in that listed order in the current context
- **AND** it SHALL label the review mode `same-context fallback`
- **AND** it SHALL still withhold Verify until those three gates are integrated with no CR/DV P0

### Requirement: Pre-Verify P0 retries stay in the parallel wave
When code review or Design verify reports P0, the coordinator SHALL repair accepted P0 findings (remediations.md for CR P0/P1) and retry only the unresolved P0 gates of the wave, in parallel when more than one remains, until none of the three gates reports P0 or a gate reaches round four still P0. Already-passed code review SHALL NOT be re-run because Simplify or Design verify later changed implementation; wave-1 code review may inspect the pre-Simplify tree, and those edits are caught by Verify plus Git-aware re-run. Design verify SHALL be re-run if Simplify or a later repair changed UI-owned paths since DV's last completed round. Other already-passed gates SHALL NOT be re-run solely because a sibling retried. Code review and Design verify remain capped at four rounds each. A round-four P0 SHALL fail that gate and SHALL NOT start Verify.

#### Scenario: Code review P0 while Design verify passed
- **WHEN** the first parallel wave returns code review P0 and Design verify `passed` or `not applicable`
- **THEN** the coordinator SHALL repair the accepted P0 and spawn the next code-review round
- **AND** it SHALL NOT re-run Design verify unless the repair changed UI-owned paths
- **AND** it SHALL NOT start Verify until code review reports no P0

#### Scenario: Code review and Design verify both P0
- **WHEN** the current wave returns P0 from both code review and Design verify
- **THEN** the coordinator SHALL repair accepted findings and spawn the next code-review and Design-verify rounds in parallel
- **AND** it SHALL wait for both retry workers before deciding whether another wave is required

#### Scenario: Round four still P0
- **WHEN** code review or Design verify round four still reports P0
- **THEN** that gate SHALL be `failed`
- **AND** Apply SHALL NOT start Verify or recommend archive

#### Scenario: Simplify edited UI after Design verify passed on the pre-Simplify snapshot
- **WHEN** the first parallel wave returns Design verify `passed` or `not applicable`
- **AND** Simplify changed UI-owned paths
- **THEN** the coordinator SHALL re-run Design verify against the post-Simplify tree
- **AND** it SHALL NOT re-run already-passed code review solely because Simplify edited
- **AND** it SHALL NOT start Verify until that Design verify round reports no P0

### Requirement: Verify runs only after the pre-Verify wave is clear
Apply SHALL start Verify only after code review has no P0, Simplify is `passed` (or a justified `not applicable`), and Design verify is `passed` or scope-backed `not applicable`. Verify keeps its existing rounds 1–4. A `blocked` or unresolvable `failed` Simplify SHALL pause Apply and SHALL NOT start Verify.

#### Scenario: Three gates clear
- **WHEN** code review has no P0, Simplify passed, and Design verify passed or is `not applicable` with scope evidence
- **THEN** the coordinator SHALL dispatch Verify round 1 as a fresh worker
- **AND** that Verify SHALL be the first Verify of the change unless a later Verify retry is required by Verify's own rules

#### Scenario: Simplify blocked
- **WHEN** Simplify reports `blocked` or unresolvable `failed`
- **THEN** Apply SHALL pause
- **AND** it SHALL NOT start Verify
