import type { CommandTemplate, SkillTemplate } from '../types.js';

const REVIEW_INSTRUCTIONS = `Review a complete Superpowers change before implementation.

**Input**: Optionally specify a change name. If omitted, infer it only from clear conversation context; otherwise run \`superpowers list --json\` and ask the user to choose.

## Review procedure

1. Run \`superpowers status --change "<name>" --json\`. Use \`schemaName\`, \`applyRequires\`, and the declared artifacts to determine the review scope. Do not assume every schema has delta specs.
2. Run \`superpowers validate <name>\`. Treat every validation error as a BLOCKER.
3. Read only completed artifacts declared by the selected schema and attachments referenced from those artifacts. For spec-driven changes, review proposal, specs, design, tasks, execution-plan, and test-plan.
4. Assess completeness, clarity, coherence, and implementability. Report findings as BLOCKER, WARNING, or SUGGESTION with an artifact location and a concrete repair.
5. For spec-driven tasks, treat \`# <number>. agent<logical-id> — <scope>\` as a logical work-package label. Verify every detailed task has concrete Step 1–5 execution guidance. Do not require per-checkbox delegation, per-checkbox formal review, or 2–5 minute work units.

## Automatic proposal-review loop

When this procedure runs automatically from \`/sp:propose\` after every \`applyRequires\` artifact is complete:

1. Inspect the complete proposal artifacts and **present the complete review report** before editing any of them.
2. Then **repair every resolvable BLOCKER and WARNING**. SUGGESTION findings are non-blocking and may remain visible in the report.
3. **re-run review** after repair. Announce readiness only when no unresolved BLOCKER or WARNING remains.
4. If a repair needs a product, security, schema, or external-dependency decision, report the blocker and pause; do not guess or claim readiness.

Do not create \`review.md\`, approval metadata, or a review artifact. Proposal review is ephemeral. \`/sp:apply\` does not automatically repeat proposal review; users may invoke \`/sp:review <change>\` voluntarily.

## Keep review contracts separate

- **Proposal review** happens before implementation and judges whether artifacts can be implemented without ambiguity.
- The **final integration review** happens after work packages integrate and judges cross-package behavior, the integrated diff, code quality, and full validation. It is not a rerun of proposal review.

## Output

\`\`\`markdown
## Change Review: <change-name>

### Summary
| Dimension | Result |
| --- | --- |
| Completeness | ... |
| Clarity | ... |
| Coherence | ... |
| Implementability | ... |

**Readiness:** ready / needs repair / blocked for a decision

### BLOCKER
1. ...

### WARNING
1. ...

### SUGGESTION
1. ...
\`\`\`
`;

export function getChangeReviewSkillTemplate(): SkillTemplate {
  return {
    name: 'superpowers-change-review',
    description: 'Review a complete Superpowers proposal before implementation. Use manually with /sp:review or automatically after /sp:propose creates all required artifacts.',
    instructions: REVIEW_INSTRUCTIONS,
    license: 'MIT',
    compatibility: 'Requires superpowers CLI.',
    metadata: { author: 'superpowers', version: '1.0' },
  };
}

export function getSpReviewCommandTemplate(): CommandTemplate {
  return {
    name: 'SP: Review',
    description: 'Review a complete Superpowers proposal before implementation',
    category: 'Workflow',
    tags: ['workflow', 'review', 'artifacts'],
    content: `Use this command as \`/sp:review <change>\` to manually review a complete Superpowers proposal.\n\n${REVIEW_INSTRUCTIONS}`,
  };
}
