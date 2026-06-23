## Context

The current spec-driven workflow treats each change directory as a set of Markdown artifacts. That works well for behavioral and implementation planning, but UI-heavy or reference-heavy changes often need screenshots, mockups, visual references, notes, or externally provided text files. Today those materials have no standard location and no workflow guidance, so agents can miss them or treat them as informal conversation context instead of change-local context.

This change adds a fixed `attachments/` convention without adding a new required artifact. Attachments remain supporting context; proposal, specs, design, and execution-plan artifacts carry the explanation and normative meaning.

## Goals / Non-Goals

**Goals:**
- Standardize `superpowers/changes/<change>/attachments/` as the per-change attachment directory.
- Let proposal, design, spec, and execution-plan artifacts reference attachments with explicit change-relative paths.
- Keep attachment semantics lightweight: referenced files provide context, while Markdown artifacts explain what the context means.
- Make apply instructions surface referenced attachments so implementation agents do not miss visual or supporting context.
- Preserve existing artifact completion behavior; attachments do not become workflow artifacts and do not block status or apply on their own.
- Keep path handling cross-platform by resolving attachment filesystem paths with Node path utilities.

**Non-Goals:**
- No dedicated `ui-brief.md` artifact.
- No required attachment manifest.
- No attachment upload/copy/import command.
- No binary content parsing or image interpretation inside the CLI.
- No PDF attachment support in the initial version.
- No warning, prompt, or validation error for missing referenced attachment files.
- No validation command that rejects missing or unused attachments in the initial version.
- No change to archive semantics beyond carrying whatever files already live under the change directory.

## Decisions

### 1. Use a fixed `attachments/` directory, not a new artifact

**Decision:** The standard location is `superpowers/changes/<change>/attachments/`. The directory is optional and may contain images or text files, but it is not listed in `schemas/spec-driven/schema.yaml` as an artifact.

**Rationale:** The user's goal is to provide a stable place for supporting materials, not to add another workflow gate. Completion should still be driven by proposal, specs, design, tasks, execution-plan, and test-plan.

**Alternatives considered:**
- Add `attachments` as a schema artifact: rejected because it would make every change look incomplete unless the directory exists.
- Add `ui-brief.md`: rejected for this change because the requested scope is the simpler attachment convention.

### 2. Make Markdown artifacts responsible for meaning

**Decision:** Attachments are supporting evidence. The artifact that references an attachment must explain the attachment's role: what it is, why it matters, whether it is normative or illustrative, and what requirement or task it supports.

**Rationale:** Images and notes are ambiguous by themselves. Requiring the referencing artifact to explain intent keeps the design lightweight while reducing UI drift.

**Alternatives considered:**
- Require `attachments/README.md`: rejected for the initial version because the user explicitly chose the simplest option.
- Infer normative meaning from filenames or image content: rejected because it is unreliable and tool-dependent.

### 3. Discover only explicit Markdown attachment references

**Decision:** The CLI should treat Markdown image/link targets beginning with `attachments/` as machine-discoverable references. Examples:

```md
![Target dashboard](attachments/target-dashboard.png)
[Reference notes](attachments/reference-notes.md)
```

Plain prose mentions may still be useful to humans, but they are not required to be machine-discovered.

**Rationale:** Markdown links are easy to author, easy to test, and do not require parsing arbitrary natural language. The CLI can resolve these paths safely against the change directory.

**Alternatives considered:**
- Scan all files under `attachments/`: rejected because unreferenced files may be drafts or irrelevant, and dumping all of them into apply context could add noise.
- Parse inline code references like `` `attachments/foo.png` ``: useful later, but markdown links/images are a cleaner first contract.

### 4. Surface referenced attachments in apply instructions

**Decision:** `superpowers instructions apply --change <id> --json` should include referenced attachments separately from `contextFiles`, for example as `attachmentFiles`, mapping change-relative `attachments/...` paths to resolved filesystem paths. Text output should include a short "Attachment Files" section when supported referenced files exist.

**Rationale:** `contextFiles` currently represents schema artifacts. Keeping attachments in a separate field preserves existing meaning while making the implementation agent aware of supporting files.

**Alternatives considered:**
- Add attachments to `contextFiles`: rejected because downstream code expects artifact IDs as keys.
- Only update workflow prompt text and not CLI output: rejected because apply should carry the actual machine-readable handoff.

### 5. Surface only existing supported file types

**Decision:** The initial implementation surfaces only existing files with supported attachment extensions:
- images: `.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`, `.svg`
- text: `.txt`, `.md`, `.markdown`
- tabular text: `.csv`

References to missing files, PDFs, or other unsupported extensions are silently omitted from `attachmentFiles` and do not produce warnings or prompts.

**Rationale:** The attachment directory is optional supporting context. Missing references should not interrupt the workflow, and unsupported files should not be handed to agents as consumable context before the workflow has explicit support for them.

**Alternatives considered:**
- Warn on missing attachments: rejected for the initial version because the user wants missing attachments to be ignored quietly.
- Surface every existing extension: rejected because PDF and arbitrary binary files need different consumption expectations.

### 6. Add guidance through templates and workflow text

**Decision:** Update schema instructions/templates and generated workflow prompts so agents know they may reference `attachments/` from proposal, design, specs, and execution-plan. The guidance should emphasize explicit explanation and should not require attachments for every change.

**Rationale:** The convention only works if agents learn to preserve and consume it in the normal propose, continue, and apply loops.

**Alternatives considered:**
- Rely on global AGENTS.md instructions: rejected because the convention belongs to the Superpowers workflow and should travel with generated skills/commands.

## Risks / Trade-offs

**Risk: Attachments become a junk drawer.** -> Mitigation: referencing artifacts must explain why each referenced attachment matters; apply only surfaces explicitly referenced attachments.

**Risk: Broken attachment links are missed.** -> Mitigation: this is intentional for the initial version; missing referenced files are silently omitted and do not block workflow progress.

**Risk: Agents overfit to illustrative screenshots.** -> Mitigation: template guidance asks artifact authors to mark whether an attachment is normative or illustrative.

**Risk: Path handling becomes platform-specific.** -> Mitigation: artifact references use change-relative Markdown targets, while CLI resolution uses Node path utilities and validates containment with `path.relative()` against the resolved `attachments/` directory.

**Risk: Apply JSON consumers break if the shape changes.** -> Mitigation: add an optional `attachmentFiles` field rather than changing `contextFiles`.

## Migration Plan

1. Add specs for `change-attachments` and delta specs for `cli-artifact-workflow`.
2. Add tests for attachment directory completion neutrality, markdown reference discovery, supported extension filtering, missing-reference omission, cross-platform path resolution, and apply JSON/text output.
3. Update workflow/shared types for optional apply attachment files.
4. Add attachment reference discovery helper scoped to change-local Markdown artifacts.
5. Update apply instruction generation and text rendering to include referenced attachments separately from artifact context files.
6. Update schema templates/instructions and workflow prompt text to describe attachment references.
7. Run targeted artifact workflow tests and generated-template parity tests.

Rollback is straightforward: remove attachment discovery/output changes and revert template/workflow guidance. Existing `attachments/` directories remain harmless ordinary files under change directories.

## Open Questions

None for the initial scoped version.
