## Context

`add-final-quality-gates` established four sequential delegated quality gates, but its invalidation rule restarts the entire sequence after any edit. That gives stronger redundancy than needed for a narrow Verify or visual repair, makes completion time unpredictable, and lacks a bounded stopping condition for repeated P0 findings.

## Current system

Final-gate orchestration is centralized in `src/core/templates/workflows/final-quality-gates.ts` and injected into both `/sp:apply` template forms. Standalone `/sp:verify`, `/sp:simplify`, and `/sp:design-verify` define their own evidence and output contracts. The generated prose, rather than a new CLI state machine, controls retry behavior.

### Relationship to existing tech

| Existing capability | Relation | Pointer | Note |
|---|---|---|---|
| Final quality gates | extend | `src/core/templates/workflows/final-quality-gates.ts` | Replace global restart language with bounded gate-local retries. |
| Verify workflow | extend | `src/core/templates/workflows/verify-change.ts` | Add numbered attempt and fresh-preflight requirements. |
| Simplify workflow | extend | `src/core/templates/workflows/simplify.ts` | Preserve cleanup safety while defining the Verify handoff. |
| Design verification | extend | `src/core/templates/workflows/design-verify.ts` | Add numbered visual retry requirements. |
| Apply template parity | reuse | `test/core/templates/skill-templates-parity.test.ts` | Assert both generated forms carry the same retry contract. |

## Goals / Non-Goals

**Goals:**

- Make P0/CRITICAL and BLOCKER meanings explicit and non-overlapping.
- Bound code review, Verify, and design-verification attempts at four fresh workers.
- Retry from Verify after Simplify work, from Verify after functional repairs, and from design-verify after visual repairs.
- Preserve evidence and pause immediately for prerequisites that cannot be repaired by retrying.

**Non-Goals:**

- Add a Superpowers-native code-review command or a machine-enforced retry counter.
- Change standalone command availability, browser tooling, or severity semantics outside final-quality execution.
- Retry Simplify itself after its handoff to Verify.

## Decisions

### 1. Encode bounded retry policy in the shared final-gate contract

**Problem:** Retry behavior must remain identical across both generated apply forms and supported hosts.

| Option | Consistency | Host portability | Complexity |
|---|---|---|---|
| A. Shared final-gate instruction fragment | High | High | Low |
| B. Duplicate retry prose in apply templates | Low | High | Medium |
| C. Add persistent CLI retry state | High | Medium | High |

**Choice:** A. Extend the existing shared fragment with a four-round state description, fresh-worker rule, terminal failure, and gate-local entry points.

**Trade-offs / cost:** This is a behavioral contract interpreted by agents, not an enforced counter. Contract tests and durable per-round evidence mitigate drift.

### 2. Treat BLOCKER as a state, not P1

**Choice:** Map final-quality P0 to Verify `CRITICAL`; retain `BLOCKER` for unavailable prerequisites or decisions. A BLOCKER pauses immediately and does not consume one of the four attempts.

**Trade-offs / cost:** Hosts must report both severity and outcome clearly, rather than collapsing them into a single priority label.

### 3. Retry at the earliest affected verification boundary

**Choice:** Code review retries only after a P0 finding; Simplify hands off to Verify; Verify retries itself; design verification retries itself. Each retry starts a new worker and records distinct evidence.

**Trade-offs / cost:** Later repairs do not automatically repeat upstream review, so the contract requires scoped remediation and fresh validation at the affected boundary.

## Contracts

### API / CLI

N/A — no API/state/error surface change.

### States

| Term | Meaning |
|---|---|
| P0 | Equivalent to Verify `CRITICAL`; a defect requiring repair and, for code review, another review round. |
| BLOCKER | Missing prerequisite or external decision; pauses without consuming a round. |
| Round | One fresh delegated worker's gate execution and integrated report. |

### Errors

The fourth unsuccessful code-review, Verify, or design-verification round produces a terminal `failed` gate outcome. A BLOCKER produces `blocked`, never an exhausted-round failure.

## Attachments

None.

## Risks / Trade-offs

- [Risk] Agent hosts may interpret "round" inconsistently. → Mitigation: require numbered fresh-worker reports and explicit tests for round 1/4 behavior.
- [Risk] A visual repair can affect functional behavior. → Mitigation: retain the existing requirement to run relevant verification while retrying the affected gate.
- [Risk] P1/P2 wording varies across native review hosts. → Mitigation: only P0/CRITICAL and BLOCKER control the retry state machine; record other findings and repair them in the active round.

## Migration Plan

1. Update shared final-gate and standalone workflow instructions.
2. Add template contracts for retry limits, entry points, and blocker semantics.
3. Run full non-visual validation and record per-round final-gate evidence.

## Open Questions

None.
