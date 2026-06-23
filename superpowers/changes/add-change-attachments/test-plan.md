## Testing Gap Analysis

Existing artifact workflow tests covered status, artifact instructions, apply readiness, context files, and Test Hardening state, but they did not cover change-local supporting files. That left gaps around explicit attachment references, safe path resolution, completion neutrality, unsupported or missing references, and whether apply instructions carry non-artifact context to implementation agents.

Test Hardening strengthened the implementation tests after the initial task work by adding coverage for existing supported attachments referenced from `execution-plan.md`, benign malformed Markdown links, non-attachment Markdown targets, no-reference output, generated workflow handoff text, and cross-platform path expectations. No hardening failures or unresolved product defects remain.

Verification completed:
- `pnpm exec vitest run test/commands/artifact-workflow.test.ts` passed with 64 tests.
- `pnpm exec vitest run test/core/templates/skill-templates-parity.test.ts` passed with 6 tests.
- `pnpm test` passed with 68 test files and 1369 tests.
- `pnpm run build` passed.
- `pnpm run lint` passed.

## Requirement And Scenario Coverage Matrix

| Requirement / Scenario | Planned Coverage | Status | Notes |
| --- | --- | --- | --- |
| Fixed Change Attachment Directory / Change includes attachment directory | integration | covered | `test/commands/artifact-workflow.test.ts` creates `attachments/` under temp changes and references files from completed artifacts |
| Fixed Change Attachment Directory / Change has no attachment directory | integration | covered | No-reference apply JSON/text tests verify behavior stays quiet and ready when `attachments/` is absent |
| Fixed Change Attachment Directory / Attachment directory is not an artifact | integration | covered | Status JSON assertion verifies `attachments` is not listed and `applyRequires` remains `['test-plan']` |
| Artifact Attachment References / Proposal references an attachment | integration | covered | Proposal Markdown image reference is discovered into `attachmentFiles` |
| Artifact Attachment References / Spec references an attachment | integration | covered | Spec Markdown link reference to nested attachment is discovered |
| Artifact Attachment References / Execution plan references an attachment | integration | covered | Hardening added an existing supported `execution-plan.md` attachment reference |
| Artifact Attachment References / Normative versus illustrative meaning is explicit | unit / instruction text | covered | Schema instruction/template and workflow parity tests assert explanation plus normative/illustrative guidance |
| Attachment File Types / Image attachment | integration | covered | `.png` fixture is surfaced by apply JSON/text without pixel inspection |
| Attachment File Types / Text attachment | integration | covered | `.md` and `.txt` fixtures are surfaced for agent-readable context |
| Attachment File Types / Supported image extensions | integration | covered | `.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`, and `.svg` references are surfaced |
| Attachment File Types / Supported text extensions | integration | covered | `.txt`, `.md`, and `.markdown` references are surfaced |
| Attachment File Types / CSV attachment | integration | covered | `.csv` reference is surfaced |
| Attachment File Types / PDF attachment unsupported | integration | covered | `.pdf` reference is omitted without changing readiness |
| Attachment File Types / Unknown extension unsupported | integration | covered | `.bin` reference is omitted without changing readiness |
| Attachment File Types / Missing referenced file ignored | integration | covered | Missing `.png` reference is omitted without warning, prompt, failure, or readiness change |
| Safe Attachment Path Resolution / Change-relative markdown target | unit / integration | covered | Production uses `path.resolve(changeDir, ...relativePath.split('/'))`; tests assert resolved paths with `path.join()` |
| Safe Attachment Path Resolution / Nested attachment path | integration | covered | `attachments/screens/mobile/home.png` resolves under nested attachment directories |
| Safe Attachment Path Resolution / Path traversal rejected | integration | covered | `attachments/../proposal.md` is excluded from `attachmentFiles` |
| Attachment References Are Explicit / Markdown image target discovered | integration | covered | `![Reference](attachments/reference.png)` style targets are discovered |
| Attachment References Are Explicit / Markdown link target discovered | integration | covered | `[Notes](attachments/notes.md)` style targets are discovered |
| Attachment References Are Explicit / Plain prose mention not required to be discovered | integration | covered | Prose `attachments/prose-only.png` and unreferenced existing files are ignored |
| Attachment References Are Explicit / Duplicate references deduplicated | integration | covered | Repeated references and references across multiple artifacts produce one sorted entry |
| Instructions Command / Attachment guidance for attachment-aware artifacts | integration | covered | Proposal, design, specs, and execution-plan instructions mention `attachments/` and explanation guidance |
| Apply Instructions Command / Apply JSON includes referenced attachments | integration | covered | `attachmentFiles` maps change-relative attachment paths to resolved filesystem paths |
| Apply Instructions Command / Apply text includes referenced attachments | integration | covered | Text output includes `### Attachment Files` only when references exist |
| Apply Instructions Command / No referenced attachments | integration | covered | `attachmentFiles` is omitted and apply readiness remains unchanged |
| Apply Instructions Command / Unsafe attachment references are excluded | integration | covered | Unsafe references never appear in apply JSON/text output |

## Boundary And Abnormal Case Sweep

| Surface | Cases Attacked | Coverage Decision | Status |
| --- | --- | --- | --- |
| Inputs and validation | Empty/no-reference artifacts, malformed Markdown links, links with non-attachment targets, missing `attachments/` directory | Integration tests cover no-reference apply output, malformed link omission, non-attachment target omission, and absent directory behavior | covered |
| State and repeat actions | Same attachment referenced from multiple artifacts, repeated references in one artifact, stable output order | Deduplication and sorted-key assertions added in artifact workflow tests | covered |
| Permissions and ownership | Attachment file exists but cannot be read | Initial implementation surfaces paths and does not read attachment contents; permission-read behavior is outside current scope | not applicable |
| Filesystem and paths | Nested paths, platform separators, traversal, current-change scoping | Tests use `path.join()` and `normalizePaths()`; production uses `path.resolve()` and `path.relative()` containment checks | covered |
| External and integration points | Generated workflow prompts, schema instructions, apply JSON consumers | Instruction output tests and generated-template parity tests cover attachment handoff text and `attachmentFiles` separation | covered |

## Non-Critical Path Sweep

| Path | Why It Matters | Coverage / Rationale |
| --- | --- | --- |
| No `attachments/` directory | Most changes will not need attachments; workflow must remain quiet | Automated apply tests verify no section, omitted `attachmentFiles`, and unchanged readiness |
| Unreferenced files under `attachments/` | Draft or irrelevant files should not add noise to apply context | Automated tests create unreferenced/prose-only files and assert they are not surfaced |
| Missing referenced file | Broken links can happen while drafting | Automated tests verify missing supported references are omitted silently |
| Existing `contextFiles` consumers | Downstream agents and tests rely on artifact IDs as keys | Automated JSON tests prove attachments remain separate in `attachmentFiles` |
| Workflow text only changes | Prompt changes can drift from schema behavior | Parity/guidance tests check generated workflow text contains attachment preservation and handoff |

## Deferred Or Manual Coverage

| Gap | Reason Deferred | Safer Alternative / Follow-Up |
| --- | --- | --- |
| Pixel-level image validation | The scoped change does not require CLI image interpretation | Referencing artifacts explain normative visual meaning; future UI-specific artifact can add visual checks |
| Required attachment manifest | User selected simple fixed directory convention | A later change can add `attachments/README.md` or manifest validation if attachment drift persists |
| Archive-specific attachment behavior | Existing archive should move the full change directory; no new archive semantics are planned | Full regression suite covers existing archive behavior; no archive code changed |
| Windows native CI execution | Local development may not run on Windows | Implementation uses Node path utilities and tests build filesystem expectations with `path.join()` plus normalized comparisons |
