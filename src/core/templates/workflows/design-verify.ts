import type { CommandTemplate, SkillTemplate } from '../types.js';
import { QUALITY_GATE_OUTCOMES } from './final-quality-gates.js';

const instructions = `Verify an active Superpowers change's runtime UI with \`/sp:design-verify\` against the repository visual design source.

**Input:** Optional change name. Load its status, apply instructions, context artifacts, and implementation diff before deciding scope.

## Execution

1. **Establish scope.** Inspect the change artifacts and implementation diff to decide whether it affects a user-facing UI: a rendered route, component, interaction, or responsive/state behavior. If it does not, stop and report \`not applicable\` with concrete diff/artifact evidence; this is not a visual pass.
2. **Find the visual source.** For UI scope, discover repository visual \`DESIGN.md\` or \`design.md\` in the repository root, \`docs/\`, or relevant project context. Distinguish it from change-local \`design.md\`, and identify the rules that apply to each affected route or state.
3. **Prepare runtime inspection.** Start or use the documented application runtime and available browser automation or agent-controlled browser. If runtime, credentials, dependencies, or browser capability are missing, stop and report \`blocked\` with the missing prerequisite. Source inspection alone cannot pass.
4. **Inspect affected UI.** Exercise each affected route, changed interaction, and applicable responsive/state variant. Compare rendered output against explicit tokens, component rules, Do's/Don'ts, and accessibility/responsive rules. Capture inspectable runtime evidence and cite the precise rule for every finding.
5. **Handle a missing visual source.** If UI scope has no repository visual design source, report \`blocked\`: formal conformance is unassessable without the governing rules. Compare relevant existing components or CSS patterns when possible, but never claim a formal pass or proceed to archive until a visual source is supplied or the UI scope is removed.
6. **Classify and report.** Report ${QUALITY_GATE_OUTCOMES} separately from functional verification. A \`passed\` result requires a discovered visual source and identifies assessed rules and deliberately unassessed areas; \`failed\` identifies every nonconformance; \`blocked\` names the prerequisite; and \`not applicable\` includes scope evidence.

## Apply final-quality retries

When Design verify is delegated by \`/sp:apply\`, number every attempt
\`Design verify round 1\` through \`Design verify round 4\`; each attempt uses
a fresh subagent and retains distinct route, rule, and runtime evidence. Before
round four, repair a resolvable visual nonconformance and retry **only** Design
verify with a fresh worker. Do not restart code review, Simplify, or Verify
solely because of a design-verification retry. A missing runtime, credential,
browser capability, visual design source, or external decision is \`BLOCKER\`:
report \`blocked\`, name the prerequisite, pause immediately, and do not consume
an attempt. If round four still reports a visual nonconformance, report
\`failed\`; do not start a fifth attempt or recommend archive. A scope-backed
non-UI \`not applicable\` result is not a retry and remains non-blocking.

## Output format

\`\`\`markdown
## Design Verification: <change-name>

**Outcome:** passed | failed | blocked | not applicable
**Design verify round:** <1-4 when delegated by apply, otherwise standalone>
**Fresh worker:** <identity when delegated by apply, otherwise standalone>
**UI scope:** <affected routes/states, or concrete non-UI evidence>
**Visual source:** <DESIGN.md path and applicable rules | not found>
**Runtime evidence:** <commands, browser routes/states, screenshots/logs, or blocking prerequisite>

| Route / state | Rule | Evidence | Implementation location | Outcome / remediation |
| --- | --- | --- | --- | --- |
| <route/state> | <quoted rule or pattern> | <inspectable evidence> | <file:line> | <pass, failure and specific fix, or not assessed> |

**Deliberately unassessed:** <none or reason>
\`\`\``;

export function getDesignVerifySkillTemplate(): SkillTemplate {
  return { name: 'superpowers-design-verify', description: 'Verify runtime UI conformance to repository DESIGN.md guidance.', instructions, license: 'MIT', compatibility: 'Requires superpowers CLI.', metadata: { author: 'superpowers', version: '1.0' } };
}

export function getSpDesignVerifyCommandTemplate(): CommandTemplate {
  return { name: 'SP: Design Verify', description: 'Verify runtime UI conformance for a Superpowers change', category: 'Workflow', tags: ['workflow', 'design', 'quality'], content: instructions };
}
