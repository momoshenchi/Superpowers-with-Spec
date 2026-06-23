## 1. Attachment Reference Discovery

- [x] 1.1 Add tests for discovering Markdown image and link targets that begin with `attachments/`
- [x] 1.2 Add tests for ignoring plain prose mentions and deduplicating repeated attachment references
- [x] 1.3 Add tests for supported extension filtering, missing-file omission, safe nested path resolution, and traversal rejection
- [x] 1.4 Implement a small attachment reference discovery helper scoped to completed change artifacts

## 2. Apply Instruction Output

- [x] 2.1 Add apply JSON tests for `attachmentFiles` while preserving `contextFiles` artifact-key semantics
- [x] 2.2 Add apply text-output tests for an `Attachment Files` section when referenced attachments exist
- [x] 2.3 Extend apply instruction types and generation to include referenced attachment files
- [x] 2.4 Render referenced attachments in apply text output without changing apply readiness

## 3. Artifact And Workflow Guidance

- [x] 3.1 Add tests that proposal, design, specs, and execution-plan instructions mention `attachments/` reference guidance
- [x] 3.2 Update spec-driven schema instructions/templates with attachment reference guidance
- [x] 3.3 Update propose, continue, apply, and verify workflow template text to preserve and consume attachment context
- [x] 3.4 Update generated template parity expectations if intentional workflow text changes affect snapshots or hashes

## 4. Validation And Regression

- [x] 4.1 Run targeted artifact workflow tests for attachment discovery and apply instruction output
- [x] 4.2 Run generated workflow/template tests affected by instruction text changes
- [x] 4.3 Run the full test suite
- [x] 4.4 Run build and lint checks
- [x] 4.5 Verify path-related tests use `path.join()` or path utilities for cross-platform behavior
