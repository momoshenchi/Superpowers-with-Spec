## Context

Change validation currently has two different meanings in the codebase:

- `superpowers status` and artifact workflow commands resolve the change schema, build an `ArtifactGraph`, and detect completed artifacts from each artifact's `generates` path.
- `superpowers validate <change>` and deprecated `superpowers change validate <change>` validate only delta spec structure through `Validator.validateChangeDeltaSpecs(changeDir)`.

That split lets a change pass validation even when `status --json` says `isComplete: false`. The default `spec-driven` schema now includes `execution-plan` and `test-plan`, and users commonly run validate immediately before apply, so validation needs to mean "schema-complete and content-valid."

## Goals / Non-Goals

**Goals:**

- Make change validation fail when any artifact declared by the resolved schema is incomplete.
- Reuse the same schema resolution and artifact completion behavior as `status`.
- Preserve existing delta spec validation and error output.
- Keep top-level validate, deprecated change validate, and archive preflight consistent.
- Keep JSON output compatible while adding missing-artifact issues to the existing issue array shape.
- Support project-local, user, package, metadata-selected, and project-default schemas through existing resolver utilities.
- Allow direct validation of existing change directories even when `proposal.md` is missing, so the result is a missing-artifact validation error rather than an unknown-item error.

**Non-Goals:**

- Do not change standalone spec validation behavior.
- Do not add new blocking proposal content validation.
- Do not parse artifact contents beyond existing delta spec validation and archive's existing non-blocking proposal warning behavior.
- Do not make validate inspect Test Hardening table completion inside `test-plan.md`.
- Do not change `status` completion semantics.
- Do not remove deprecated `superpowers change validate`.

## Decisions

### 1. Add a shared schema-aware change validation helper

**Decision:** Introduce a shared helper that validates a change directory by combining:

1. Schema artifact completeness from `loadChangeContext()` / `formatChangeStatus()` or equivalent graph APIs.
2. Existing delta spec validation from `Validator.validateChangeDeltaSpecs(changeDir)`.

The helper should return the existing validation report shape:

```ts
{
  valid: boolean;
  issues: ValidationIssue[];
  summary: { errors: number; warnings: number; info: number };
}
```

Missing artifacts should be reported as `ERROR` issues using paths that identify the expected generated path or glob, for example:

```ts
{
  level: 'ERROR',
  path: 'artifact:test-plan',
  message: 'Missing required schema artifact "test-plan" at test-plan.md'
}
```

**Rationale:** A shared helper prevents three CLI surfaces from drifting. The existing report shape already works for JSON and human output.

### 2. Validate every schema artifact, not only `apply.requires`

**Decision:** A valid change requires every artifact in `schema.artifacts` to be complete.

**Rationale:** Users interpret validate as the final pre-apply readiness check. Checking only `apply.requires` would be correct for apply availability, but weaker than the desired validation contract. Requiring the full schema artifact set also keeps custom workflows honest when they add side artifacts that are not directly listed in `apply.requires`.

### 3. Preserve existing delta validation behavior

**Decision:** Schema completeness is an additional gate. It does not replace delta spec validation.

**Rationale:** Missing artifacts and malformed delta specs are different failure classes. A change with all files present can still be invalid if the delta specs are malformed, and a change with valid deltas can still be invalid if schema artifacts are missing.

### 3a. Do not add blocking proposal content validation

**Decision:** `proposal.md` participates in validation as a schema artifact when the resolved schema declares it. This change does not add new blocking markdown-content validation for proposals to top-level validate. Archive may keep its existing non-blocking proposal warnings.

**Rationale:** The requested behavior is artifact completeness. Adding blocking proposal content validation would change a separate contract and make top-level validate stricter than the scope requires.

### 4. Reuse artifact workflow completion semantics

**Decision:** Completion checks should use the same path/glob logic as `detectCompleted(graph, changeDir)`.

**Rationale:** `status`, `instructions`, validate, and archive preflight must agree. Reimplementing file/glob checks inside validate risks subtle differences, especially for custom schemas and glob patterns such as `specs/**/*.md`.

### 5. Archive should call the shared validation gate

**Decision:** Archive preflight should use the shared schema-aware change validation helper unless `--no-validate` is set.

**Rationale:** Archive is a stronger lifecycle transition than apply. It should not be possible to archive a schema-incomplete change by passing only old proposal/delta validation.

### 6. Keep schema metadata fallback aligned with status

**Decision:** If change metadata is unreadable or invalid, validation should use the same fallback schema behavior as artifact workflow status: project config if available, otherwise the default schema.

**Rationale:** The core goal is consistency between status and validate. Failing validation on metadata errors that status ignores would create a new disagreement. A stricter metadata policy can be handled by a separate change if desired.

### 7. Direct validation should discover existing change directories

**Decision:** Direct validation of `superpowers validate <item-name>` should treat an existing directory under `superpowers/changes/` as a change, even when `proposal.md` is missing. Ambiguity with specs still requires the existing `--type` disambiguation behavior.

**Rationale:** Once `proposal` is a schema artifact, missing `proposal.md` should be reported as a validation issue. Reporting "unknown item" hides the schema artifact error the user needs to fix.

## Attachments

None.

## Risks / Trade-offs

- [Risk] Existing in-progress changes that used to validate will now fail until they create newer artifacts such as `execution-plan.md` and `test-plan.md`. -> This is intentional and should be documented in error messages with exact missing artifact ids and paths.
- [Risk] Bulk validation may produce more failures after the change lands. -> The failures identify real workflow incompleteness; JSON consumers keep the same output shape.
- [Risk] Archive tests may need fixture updates because many tests create minimal changes. -> Tests should either create all schema artifacts when validation is in scope or pass `noValidate: true` when the test is specifically about archive mechanics.
- [Risk] Metadata read errors currently fall back in artifact workflow status. -> This change intentionally preserves that behavior for validation, and tests should pin the fallback so status and validate stay aligned.
- [Risk] Human next-step output may over-focus on delta spec debugging when the only issue is a missing artifact. -> Add schema-specific next-step guidance without removing existing delta guidance.
- [Risk] Broadening direct item detection to existing change directories may introduce ambiguity when a spec has the same name as a scaffolded change. -> Preserve existing ambiguity handling and require `--type change|spec` when both exist.
