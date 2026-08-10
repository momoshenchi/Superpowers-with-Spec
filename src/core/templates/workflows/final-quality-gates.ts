/** Shared, host-neutral contracts used by apply and standalone quality workflows. */

export const QUALITY_GATE_OUTCOMES = '`passed`, `failed`, `blocked`, or `not applicable`';

export function getCanonicalNonVisualSuiteInstructions(stage: 'Test Hardening' | 'verify'): string {
  return `
**Canonical non-visual test-suite preflight (${stage})**

- Discover the complete canonical non-visual suite from repository test scripts, CI configuration, testing documentation, and the active \`test-plan.md\`.
- Record every selected command, its source of authority, and explicitly visual-only checks excluded. A convenient or partial test script is not full validation without repository evidence.
- Run every selected command and record fresh results. If the suite is ambiguous, unavailable, cannot run, or fails, report \`blocked\` or \`failed\`; do not complete ${stage} or continue to Manual Coverage.
`;
}

export function getManualCoverageInstructions(stage: 'Test Hardening' | 'verify'): string {
  const verifyRetryRule =
    stage === 'verify'
      ? `
- When this is final-quality Verify, a Manual Coverage \`BLOCKER\` is an immediate \`blocked\` outcome and does not consume the Verify retry round; a repairable manual failure retries from Verify under the existing four-round limit.`
      : '';

  return `
**Manual Coverage execution (${stage})**

- Read the active \`test-plan.md\` \`## Manual Coverage\` table separately from \`## Deferred Coverage\`. A Manual Coverage row is an executable check. Deferred Coverage is not execution evidence and must not be reported as passed or run.
- After the canonical non-visual preflight, execute every applicable Manual Coverage row through its stated normal entry point, method, and safe environment. Record the performed steps, method/environment, actions, observed outcome, and inspectable evidence in the row or report.
- Treat every concrete Manual Coverage status row as required coverage. Classify each concrete Manual Coverage row as \`passed\`, \`failed\`, \`blocked\`, or scope-backed \`not applicable\`. An unexecuted, blank, \`planned\`, or placeholder row is incomplete. Any unexecuted, failed, or blocked applicable manual row prevents ${stage} from passing; name remediation or the missing prerequisite rather than guessing.
- Do not move a required manual row into Deferred Coverage merely to avoid execution. Use \`not applicable\` only with concrete scope evidence and use Deferred Coverage only for intentionally postponed work with a specific reason and safer follow-up.
- Treat browser and other runnable end-to-end journeys as Manual Coverage methods, not as a separate Verify gate. Declare the method in the row's Execution Method and Environment field.
- Distinguish two browser-control modes and record which one each row uses:
  - \`programmatic-browser\`: repository E2E runners such as Playwright/Cypress — faster, scripted, CI-friendly; evidence is command output, assertions, traces, and useful screenshots.
  - \`agent-browser\`: agent-controlled real UI — slower, human-like clicks/keyboard/navigation; evidence is route/URL transitions, DOM or pane dumps, step actions, screenshots, and relevant console/failed-network signals. An API call or curl request is not a substitute for either interactive browser mode.
- Method selection: honor an explicit method declared in the Manual Coverage row. When undeclared, apply risk layering — prefer \`programmatic-browser\` for low-risk/happy paths when a stable script exists; require \`agent-browser\` for high-risk, interaction-heavy, permission, destructive, or state-transition paths. A change's Critical Path may require both modes; overlapping coverage of the same path is allowed and both rows must pass.
- Any \`agent-browser\` execution for a change that has a Critical Path MUST exercise that Critical Path; running only peripheral journeys does not satisfy agent-browser coverage.
- Drive destructive flows only against a documented safe target, fixture, dry run, or disposable environment. If none exists, report the affected row as \`blocked\` rather than risking real data or systems. Memory alone is not evidence. Source inspection, screenshots, and unaided human checks never substitute for executing an applicable Manual Coverage row.${verifyRetryRule}`;
}

export function getFinalQualityGateInstructions(): string {
  return `
## Final Quality Gates

After Test Hardening is complete, run these gates in exactly this order. **Delegate each gate to one fresh, distinct subagent through the host's agent-spawning or delegation mechanism.** Do not reuse a gate worker, perform a gate in the coordinator context, or start a later gate before the current worker has completed and its result is integrated. Give every worker the change name, scoped owned diff/paths, relevant context artifacts, and fresh earlier-gate/Test Hardening evidence. Require a structured report with its outcome (${QUALITY_GATE_OUTCOMES}), commands/runtime evidence, files/routes/states reviewed, findings and resolution, every \`not applicable\` reason, and whether it changed implementation.

**Severity, availability, and round rules:** \`P0\` is equivalent to Verify's \`CRITICAL\` severity. \`P1\` and \`P2\` are non-P0 findings: record and repair every resolvable one in the active round, but they do not by themselves request another round. \`BLOCKER\` is not a priority level: it means a missing prerequisite or external decision, immediately pauses the affected gate, and does not consume a round. A **round** is one fresh delegated worker's complete execution plus its integrated, numbered report. Preserve the report and remediation/validation evidence for every round in \`test-plan.md\`.

**Repair ownership:** Code review, Verify, and Design Verify workers are read-only by default: each worker reports evidence-backed findings and readiness before implementation changes. The coordinator evaluates and repairs accepted findings, then runs targeted validation and starts the gate's next fresh round when its retry rule requires one. A host-native worker may self-repair only when that capability is explicitly available and the active workflow explicitly authorizes it. Simplify is the only gate authorized to edit by default, and only within its behavior-preserving cleanup boundary.

If the host cannot launch a subagent, mark the applicable final-quality stage \`blocked\`, name the missing host capability, and pause; do not silently substitute a same-context review. In a host where workers are isolated from the coordinator workspace, integrate the worker's report before coordinator repair; merge a worker patch only for Simplify or another explicitly authorized self-repair before counting that gate as integrated.

1. **code review (rounds 1–4).** Delegate a fresh code-review worker to request or run the code-review skill. If no named skill is discoverable, that worker performs and labels an equivalent independent final review of the integrated diff, requirement mapping, regressions, and validation evidence. Never silently skip this gate and never generate a Superpowers \`code-review\` workflow. In every round, the worker reports first; the coordinator repairs every accepted resolvable P1/P2 finding in that active round, repairs every accepted resolvable P0 finding before retrying, and runs relevant validation. If the integrated report has no P0, this gate passes and continues to Simplify after those repairs; P1/P2-only findings do not require a second review. If a round reports a P0, the coordinator repairs it and starts the next fresh code-review round. If round four still reports a P0, report this gate \`failed\`; do not start a fifth review or recommend archive.
2. **Simplify (one pass, then Verify).** Delegate a fresh simplify worker to execute the \`/sp:simplify\` contract. Its internal four-angle fan-out remains permitted. The worker may apply only behavior-preserving cleanup: reuse existing helpers, remove dead/duplicate code or unnecessary abstraction, improve local clarity, or make demonstrable efficiency improvements. Do not change requirements, public contracts, error behavior, or user-visible behavior. After every edit, run fresh affected verification. Repair, revert, or skip an uncertain or failing cleanup. A safely completed Simplify result, including a repaired cleanup, transitions directly to Verify round one; it does not start a Simplify retry loop or restart code review. A \`blocked\` or unresolvable \`failed\` Simplify result pauses apply.
3. **Verify (rounds 1–4).** Delegate a fresh, read-only-by-default verify worker to run the canonical non-visual test-suite preflight again, then verify requirements and scenarios and execute every applicable \`## Manual Coverage\` row with evidence-backed findings. Browser and other runnable end-to-end journeys are Manual Coverage methods (\`programmatic-browser\` such as Playwright/Cypress, or \`agent-browser\` human-like control); honor declared methods, apply risk-layering defaults when undeclared, allow Critical Path overlap across both modes, and require any \`agent-browser\` run to cover the change's Critical Path. Source inspection, screenshots, and unaided human checks are not Manual Coverage proof. The first Verify worker after Simplify is round one. For each accepted repairable failed verification, applicable Manual Coverage failure, or P0/\`CRITICAL\` finding, the coordinator repairs the issue and starts the next fresh Verify round, including the full canonical preflight and applicable Manual Coverage again. A \`BLOCKER\` pauses immediately. If round four still fails, report Verify \`failed\`; do not start round five or recommend archive.
4. **Design verify (rounds 1–4).** Delegate a fresh, read-only-by-default design-verification worker to discover repository visual \`DESIGN.md\`/\`design.md\` (not the change-local design artifact) for UI scope, inspect the running UI route, interaction and applicable responsive/state variants, cite each applicable rule, and report any nonconformance. A non-UI change is \`not applicable\` with scope evidence. Missing runtime prerequisites are \`blocked\`; for UI scope, no visual design source is also \`blocked\` because formal conformance is unassessable and cannot pass. For an accepted repairable visual nonconformance, the coordinator repairs it and starts the next fresh, numbered design-verification round with new rule and runtime evidence. Retry only Design verify: do not restart earlier gates solely for that retry. A \`BLOCKER\` pauses immediately. If round four still fails, report Design verify \`failed\`; do not start round five or recommend archive.

Await and integrate each worker sequentially before spawning the next, and record each numbered report in a \`## Final Quality Gates\` section of \`test-plan.md\`: round, fresh-worker identity, outcome (${QUALITY_GATE_OUTCOMES}), commands/runtime evidence, affected files/routes, findings and resolution, remediation/validation evidence, and every justified \`not applicable\` reason.

Repairs stay at the earliest affected verification boundary described above: code-review P0 returns to code review, Simplify hands off to Verify, Verify returns to Verify, and Design verify returns to Design verify. Rerun relevant verification after every repair and retain its evidence, but do not impose a global restart from code review. A \`failed\` or applicable \`blocked\` gate prevents archive recommendation.
`;
}
