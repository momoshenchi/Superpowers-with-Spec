/** Shared, host-neutral contracts used by apply and standalone quality workflows. */

export const QUALITY_GATE_OUTCOMES = '`passed`, `failed`, `blocked`, or `not applicable`';

export function getCanonicalNonVisualSuiteInstructions(stage: 'Test Hardening' | 'verify'): string {
  return `
**Canonical non-visual test-suite preflight (${stage})**

- Discover the complete canonical non-visual suite from repository test scripts, CI configuration, testing documentation, and the active \`test-plan.md\`.
- Record every selected command, its source of authority, and explicitly visual-only checks excluded. A convenient or partial test script is not full validation without repository evidence.
- Run every selected command and record fresh results. If the suite is ambiguous, unavailable, cannot run, or fails, report \`blocked\` or \`failed\`; do not complete ${stage} or continue to E2E.
`;
}

export function getManualCoverageInstructions(stage: 'Test Hardening' | 'verify'): string {
  return `
**Manual Coverage execution (${stage})**

- Read the active \`test-plan.md\` \`## Manual Coverage\` table separately from \`## Deferred Coverage\`. A Manual Coverage row is an executable check. Deferred Coverage is not execution evidence and must not be reported as passed or run.
- After the canonical non-visual preflight, execute every applicable Manual Coverage row through its stated normal entry point, method, and safe environment. Record the performed steps, method/environment, actions, observed outcome, and inspectable evidence in the row or report.
- Treat every concrete Manual Coverage status row as required coverage. Classify each concrete Manual Coverage row as \`passed\`, \`failed\`, \`blocked\`, or scope-backed \`not applicable\`. An unexecuted, blank, \`planned\`, or placeholder row is incomplete. Any unexecuted, failed, or blocked applicable manual row prevents ${stage} from passing; name remediation or the missing prerequisite rather than guessing.
- Do not move a required manual row into Deferred Coverage merely to avoid execution. Use \`not applicable\` only with concrete scope evidence and use Deferred Coverage only for intentionally postponed work with a specific reason and safer follow-up.
- When this is final-quality Verify, a Manual Coverage \`BLOCKER\` is an immediate \`blocked\` outcome and does not consume the Verify retry round; a repairable manual failure retries from Verify under the existing four-round limit.`;
}

export function getFinalQualityGateInstructions(): string {
  return `
## Final Quality Gates

After Test Hardening is complete, run these gates in exactly this order. **Delegate each gate to one fresh, distinct subagent through the host's agent-spawning or delegation mechanism.** Do not reuse a gate worker, perform a gate in the coordinator context, or start a later gate before the current worker has completed and its result is integrated. Give every worker the change name, scoped owned diff/paths, relevant context artifacts, and fresh earlier-gate/Test Hardening evidence. Require a structured report with its outcome (${QUALITY_GATE_OUTCOMES}), commands/runtime evidence, files/routes/states reviewed, findings and resolution, every \`not applicable\` reason, and whether it changed implementation.

**Severity, availability, and round rules:** \`P0\` is equivalent to Verify's \`CRITICAL\` severity. \`P1\` and \`P2\` are non-P0 findings: record and repair every resolvable one in the active round, but they do not by themselves request another round. \`BLOCKER\` is not a priority level: it means a missing prerequisite or external decision, immediately pauses the affected gate, and does not consume a round. A **round** is one fresh delegated worker's complete execution plus its integrated, numbered report. Preserve the report and remediation/validation evidence for every round in \`test-plan.md\`.

If the host cannot launch a subagent, mark the applicable final-quality stage \`blocked\`, name the missing host capability, and pause; do not silently substitute a same-context review. In a host where workers are isolated from the coordinator workspace, obtain and apply or merge the worker's concrete patch or resolution before counting that gate as integrated.

1. **Host-native code review (rounds 1–4).** Delegate a fresh code-review worker to request or run the host's native code-review capability. If no named capability is discoverable, that worker performs and labels an equivalent independent final review of the integrated diff, requirement mapping, regressions, and validation evidence. Never silently skip this gate and never generate a Superpowers \`code-review\` workflow. In every round, repair all resolvable findings and run relevant validation before reporting. If the report has no P0, this gate passes and continues to Simplify; P1/P2-only findings do not require a second review. If a round reports a P0, repair it and start the next fresh code-review round. If round four still reports a P0, report this gate \`failed\`; do not start a fifth review or recommend archive.
2. **Simplify (one pass, then Verify).** Delegate a fresh simplify worker to execute the \`/sp:simplify\` contract. Its internal four-angle fan-out remains permitted. Apply only behavior-preserving cleanup: reuse existing helpers, remove dead/duplicate code or unnecessary abstraction, improve local clarity, or make demonstrable efficiency improvements. Do not change requirements, public contracts, error behavior, or user-visible behavior. After every edit, run fresh affected verification. Repair or revert an uncertain or failing cleanup. A safely completed Simplify result, including a repaired cleanup, transitions directly to Verify round one; it does not start a Simplify retry loop or restart code review. A \`blocked\` or unresolvable \`failed\` Simplify result pauses apply.
3. **Verify (rounds 1–4).** Delegate a fresh verify worker to run the canonical non-visual test-suite preflight again, then verify requirements and scenarios. For each changed runnable user/browser journey, exercise its normal entry point with repository E2E automation or an agent-controlled browser, verify an observable success outcome plus an applicable risk path, and inspect relevant console and failed-network signals. Source inspection, screenshots, and unaided human checks are not E2E proof. The first Verify worker after Simplify is round one. For each repairable failed verification, applicable E2E failure, or P0/\`CRITICAL\` finding, repair the issue and run the next fresh Verify round, including the full canonical preflight and applicable E2E again. A \`BLOCKER\` pauses immediately. If round four still fails, report Verify \`failed\`; do not start round five or recommend archive.
4. **Design verify (rounds 1–4).** Delegate a fresh design-verification worker to discover repository visual \`DESIGN.md\`/\`design.md\` (not the change-local design artifact) for UI scope, inspect the running UI route, interaction and applicable responsive/state variants, and cite each applicable rule. A non-UI change is \`not applicable\` with scope evidence. Missing runtime prerequisites are \`blocked\`; for UI scope, no visual design source is also \`blocked\` because formal conformance is unassessable and cannot pass. For a repairable visual nonconformance, repair it and run the next fresh, numbered design-verification round with new rule and runtime evidence. Retry only Design verify: do not restart earlier gates solely for that retry. A \`BLOCKER\` pauses immediately. If round four still fails, report Design verify \`failed\`; do not start round five or recommend archive.

Await and integrate each worker sequentially before spawning the next, and record each numbered report in a \`## Final Quality Gates\` section of \`test-plan.md\`: round, fresh-worker identity, outcome (${QUALITY_GATE_OUTCOMES}), commands/runtime evidence, affected files/routes, findings and resolution, remediation/validation evidence, and every justified \`not applicable\` reason.

Repairs stay at the earliest affected verification boundary described above: code-review P0 returns to code review, Simplify hands off to Verify, Verify returns to Verify, and Design verify returns to Design verify. Rerun relevant verification after every repair and retain its evidence, but do not impose a global restart from code review. A \`failed\` or applicable \`blocked\` gate prevents archive recommendation.
`;
}
