## Context

Propose is the default quick path from a user request to a complete Superpowers change. Its generated instructions currently clarify only missing input or artifact context, so the agent can create a change before resolving ambiguous scope, acceptance criteria, or high-impact technical choices. The requested behavior adds a proportional pre-confirmation conversation while preserving the existing artifact graph and post-confirmation review flow.

The change affects generated instructions rather than the Superpowers CLI's runtime state. The implementation must keep the skill and slash-command projections behaviorally aligned across supported tools, remain usable when a host does not expose the named question tool, and avoid creating a new artifact or persistent interview session.

## Current system

`src/core/templates/workflows/propose.ts` is the canonical workflow module for both `getSpProposeSkillTemplate()` and `getSpProposeCommandTemplate()`. Each projection currently contains the Propose instructions, including input clarification, change creation, dependency-ordered artifact generation, and automatic proposal review.

`src/core/shared/skill-generation.ts` registers the skill and command templates and converts them into generated files. `src/core/command-generation/` adapts the shared command body to each host; it does not own workflow semantics. The generated content is guarded by `test/core/templates/skill-templates-parity.test.ts`, including exact function and generated-content hashes, while `test/core/templates/change-review.test.ts` checks the Propose review contract. `docs/workflows.md` and `docs/opsx.md` describe Propose as the default quick path.

### Relationship to existing tech

| Existing capability | Relation | Pointer | Note |
|---|---|---|---|
| Propose workflow instructions | extend | `src/core/templates/workflows/propose.ts`, `getSpProposeSkillTemplate`, `getSpProposeCommandTemplate` | Add the preflight, adaptive interview, summary, and confirmation contract to both projections. |
| Skill and command generation | reuse | `src/core/shared/skill-generation.ts` and `src/core/command-generation/` | Keep registration and host formatting unchanged; the body remains shared. |
| Spec-driven artifact graph | boundary | `schemas/spec-driven/schema.yaml` | The interview is conversational preflight; it is not a schema artifact or dependency edge. |
| Proposal review | reuse | `src/core/templates/workflows/change-review.ts` and Propose step 5 | Start the existing review only after all artifacts are created and confirmed. |
| Workflow documentation | extend | `docs/workflows.md`, `docs/opsx.md` | Explain the proportional interview gate without removing the quick path. |
| Template parity tests | extend | `test/core/templates/skill-templates-parity.test.ts` and `test/core/templates/change-review.test.ts` | Assert both projections expose the same new behavior and update intentional hashes. |

## Goals / Non-Goals

**Goals:**

- Perform read-only discovery before user questioning and before any change write.
- Ask only about unresolved, user-owned product decisions and high-impact technical decisions.
- Permit zero questions for clear, low-risk requests while retaining the final summary confirmation.
- Ask one question at a time with known facts, decision impact, a recommendation, and meaningful alternatives.
- Block `superpowers new change` and writes to the explicit change artifact list until confirmation.
- Record confirmed product decisions in `proposal.md` and high-impact technical decisions in `design.md`.
- Provide a three-state final gate: confirm and create, request changes, or stop without creating.
- Preserve the current artifact-generation order, generated-tool parity, and automatic proposal review.

**Non-Goals:**

- No new CLI flag, interactive CLI questionnaire, runtime interview store, or `interview.md` artifact.
- No mandatory questionnaire or fixed number of questions for every request.
- No replacement of `/sp:explore`; Explore remains the open-ended thinking workflow.
- No change to the spec-driven schema, artifact dependencies, Apply behavior, or final quality gates.
- No requirement that the agent ask about routine local implementation details.

## Decisions

### 1. Interview integration boundary

**Problem:** Where should the new pre-confirmation behavior live so skill and command outputs stay aligned without adding a new workflow surface?

| Option | Behavior fidelity | Maintenance / drift | User-facing complexity |
|---|---|---|---|
| A. Edit both generated instruction strings independently | High initially | High; duplicated guidance can diverge | Low |
| B. Add a shared interview guidance fragment and interpolate it into both Propose projections | High | Low; one semantic source while preserving both projections | Low |
| C. Add a separate interview workflow/skill that Propose invokes | Variable; host invocation differs | Medium | High; adds another entry point and lifecycle |

**Choice:** B. Keep the two existing Propose projections, but centralize the substantial interview contract in a local reusable template fragment (or equivalent single source) and include it in both outputs. This matches the repository's shared-content model without adding a CLI or skill surface.

**Trade-offs / cost:** The template module becomes slightly more structured, and exact-content hashes must be updated. The choice preserves current generation APIs and keeps host adapters unaware of workflow semantics.

### 2. Interview state and persistence

**Problem:** How should Propose track the conversation before confirmation?

| Option | Resume/auditability | Scope and complexity | Risk of stale state |
|---|---|---|---|
| A. Conversation-only state with a final normalized summary | Sufficient within the active task; confirmed decisions are archived in artifacts | Low | Low |
| B. Add `interview.md` or another change-local transcript artifact | High raw auditability | Medium; expands schema and artifact review | Medium |
| C. Add CLI flags and persistent session state | High across sessions | High; new commands, storage, and recovery rules | High |

**Choice:** A. Keep pre-confirmation state in the active conversation, then normalize only confirmed conclusions into the existing proposal and design artifacts. A user who stops creates nothing, and no stale interview state survives outside the conversation.

**Trade-offs / cost:** An interrupted conversation cannot be resumed by a new session from a dedicated file. This is acceptable because adding persistence would violate YAGNI and introduce a second source of truth.

### 3. Interview depth policy

**Problem:** How can Propose remain a quick path without allowing consequential ambiguity through?

| Option | Clarity coverage | Friction for clear requests | Alignment with current workflow |
|---|---|---|---|
| A. Always run a strict questionnaire | High | High | Low; changes the quick path into a mandatory ceremony |
| B. Trigger questions only for unresolved consequential decisions, then require summary confirmation | High where risk exists | Low; may ask zero questions | High |
| C. Never ask; rely on proposal review to discover ambiguity | Low before artifact creation | Minimal | Medium, but rework arrives too late |

**Choice:** B. Trigger questions from missing or conflicting goal/scope/capability/impact/acceptance information and from unresolved architecture, data/migration, public contract, security, reliability/recovery, performance, compatibility, deployment, or important-dependency choices. If none apply, skip questions and move directly to the summary gate.

**Trade-offs / cost:** The trigger is judgment-based rather than a numeric score. Explicit criteria, examples, and tests will constrain over-questioning without pretending that all requests can be classified mechanically.

### 4. Structured question capability and host compatibility

**Problem:** How should generated Propose instructions express structured questions across hosts without coupling the workflow to one runtime tool?

| Option | Cross-host behavior | User guidance | Integration cost |
|---|---|---|---|
| A. Use the host's `AskUserQuestion` capability or documented equivalent, with a plain-conversation fallback | High; host mappings can translate the semantic contract | Structured options where available, readable prose everywhere | Low; prompt-only change |
| B. Use plain natural-language questions for every host | High | Consistent but less selectable and less explicit about options | Low |
| C. Add a Superpowers runtime questionnaire abstraction or CLI command | Potentially high after adoption | Consistent structured UI | High; new runtime, state, and compatibility surface |

**Choice:** A. The semantic contract is one question at a time with known facts, decision impact, recommendation, meaningful alternatives, and free-form response. Hosts may expose it through `AskUserQuestion` or their equivalent; when no structured question capability exists, the generated instructions fall back to ordinary natural-language conversation. Delegated decisions adopt the stated recommendation and trigger dependent-decision checks.

**Trade-offs / cost:** Host UIs may differ in labels and rendering, so tests assert semantic content rather than a universal visual layout. A prompt fallback is less structured but avoids a new dependency and keeps all supported tools usable.

### 5. Confirmation and artifact handoff

**Problem:** What must happen between a decision-closed summary and the existing artifact workflow?

| Option | Write safety | Auditability | Workflow complexity |
|---|---|---|---|
| A. Use a three-state conversational gate, then route confirmed conclusions into existing proposal/design artifacts | Highest; no writes before explicit confirmation | High for confirmed decisions | Low; no new schema state |
| B. Create an empty change scaffold before confirmation and fill artifacts later | Lower; a declined session leaves state behind | Medium | Low initially, but requires cleanup semantics |
| C. Persist a dedicated interview artifact/session before generating proposal and design | High | Highest raw transcript history | High; adds schema, recovery, and archive rules |

**Choice:** A. The final summary will use three semantic outcomes:

1. **Confirm and create** — create the change and run the existing artifact loop.
2. **Request changes** — keep the write boundary closed, resolve corrections one at a time, and present a new summary.
3. **Stop without creating** — end without creating the change or any explicit artifact.

Confirmation is required even when the interview contains zero questions. After confirmation, product decisions are routed into `proposal.md`; high-impact technical decisions are routed into `design.md`, where major choices retain at least three meaningful options, the selected choice, rationale, and trade-offs. The implementation does not add a separate interview transcript.

**Trade-offs / cost:** The user must confirm before even a clear request creates a change, adding one lightweight turn to the fast path. In return, request-changes and stop outcomes cannot leave partial directories or artifacts, and the existing schema remains unchanged.

## Contracts

### API / CLI

- No new CLI flags or runtime APIs.
- The generated `/sp:propose` skill and command contract gains a pre-confirmation phase, a three-state final gate, and an explicit no-write boundary.
- After confirmation, the existing commands remain authoritative: `superpowers new change`, `superpowers status --change "<name>" --json`, `superpowers instructions <artifact-id> --change "<name>" --json`, and the existing proposal-review workflow.

### States

```text
preflight (read-only)
    ↓
interview (zero or more one-question turns)
    ↓
summary awaiting confirmation
    ├── confirm → create change → generate artifacts → review
    ├── request changes → interview affected branch
    └── stop → no writes
```

The state is conversational only. It is not represented as a schema artifact or persisted CLI state.

### Errors

- No new error codes are introduced.
- If the host lacks the named structured question tool, the instructions SHALL fall back to one-at-a-time natural-language questions.
- If the user stops or declines confirmation, the outcome is a clean no-write stop rather than a validation error.
- If a decision changes, dependent questions and the final summary are recomputed before any write.

## Attachments

<!-- No supporting attachments are required. -->

## Risks / Trade-offs

- [Prompt length] → Keep the reusable interview fragment concise, state the zero-question path explicitly, and test generated content for the core contract.
- [Over-questioning] → Use the documented trigger list, require environment facts to be discovered rather than asked, and permit delegated recommendations and zero questions.
- [Projection drift] → Render the same guidance into both skill and command templates and retain parity/hash tests.
- [Host tool differences] → Name the structured question capability for hosts that provide it and include a plain-conversation fallback.
- [Changed quick-path timing] → Defer all writes only until a lightweight summary confirmation; clear requests can pass with zero interview questions.
- [Generated artifact churn] → Update source templates and intentional expected hashes together, then verify generated output through existing tests.

## Migration Plan

1. Update the canonical Propose workflow template and its tests/documentation.
2. Run the existing generation/update flow so installed Propose skill and command files receive the new instructions.
3. Existing change directories and artifacts require no migration because no schema or persisted state changes.
4. If a user stops before confirmation, no cleanup or rollback is required because no change was created.

## Open Questions

No product or workflow decisions remain open from exploration. Exact wording of the reusable prompt fragment and test assertions may be refined during implementation without changing the agreed behavior contract.
