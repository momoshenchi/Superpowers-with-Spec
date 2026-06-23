## File Structure

- Create:
  - `src/commands/workflow/attachments.ts` - Discover explicit Markdown attachment references in completed change artifacts and safely resolve them under the current change's `attachments/` directory.
- Modify:
  - `src/commands/workflow/shared.ts` - Add optional apply instruction attachment output typing.
  - `src/commands/workflow/instructions.ts` - Include referenced attachments in apply JSON/text output while preserving `contextFiles`.
  - `schemas/spec-driven/schema.yaml` - Add attachment reference guidance to proposal, specs, design, and execution-plan instructions.
  - `schemas/spec-driven/templates/proposal.md` - Add an optional attachment reference section or note.
  - `schemas/spec-driven/templates/design.md` - Add optional attachment reference guidance.
  - `schemas/spec-driven/templates/spec.md` - Add optional attachment reference guidance.
  - `schemas/spec-driven/templates/execution-plan.md` - Add optional attachment reference guidance.
  - `src/core/templates/workflows/propose.ts` - Teach artifact creation to preserve explicit attachment references.
  - `src/core/templates/workflows/continue-change.ts` - Teach continued artifact generation to preserve explicit attachment references.
  - `src/core/templates/workflows/apply-change.ts` - Teach apply to read `attachmentFiles` in addition to `contextFiles`.
  - `src/core/templates/workflows/verify-change.ts` - Teach verify to consider referenced attachments as supporting context.
  - `test/commands/artifact-workflow.test.ts` - Cover discovery, safe resolution, apply JSON/text output, and completion neutrality.
  - `test/core/templates/skill-templates-parity.test.ts` - Update assertions if generated workflow template text changes require it.
- Test:
  - `test/commands/artifact-workflow.test.ts` - CLI behavior for attachments and apply output.
  - `test/core/templates/skill-templates-parity.test.ts` - Generated workflow template expectations.

## Task Plan

Red tests in this file drive implementation one step at a time. Keep broad requirement/scenario coverage matrices, testing gap analysis, supplemental test coverage, and post-implementation Test Hardening records in `test-plan.md`. Passing the red/green task tests here does not replace the final Test Hardening pass after implementation tasks are complete.

### Task 1: Attachment Reference Discovery

**Files:**
- Create: `src/commands/workflow/attachments.ts`
- Modify: `test/commands/artifact-workflow.test.ts`
- Test: `test/commands/artifact-workflow.test.ts`

- [ ] **Step 1: Add failing tests for explicit Markdown attachment discovery**

Add a new `describe('attachment references')` block in `test/commands/artifact-workflow.test.ts`. Use the existing temp project helpers. Create a change with completed proposal, design, specs, tasks, execution-plan, and test-plan, then write artifact content containing:

```md
![Desktop target](attachments/desktop-target.png)
[Visual notes](attachments/visual-notes.md)
```

Create the referenced files with `fs.mkdir(path.join(changeDir, 'attachments'), { recursive: true })` and `fs.writeFile(path.join(changeDir, 'attachments', 'desktop-target.png'), 'png-bytes')`.
Also create `visual-notes.md` with text content so the test proves both image and text attachments are surfaced.

Expected assertions for `superpowers instructions apply --change attachment-change --json`:

```ts
expect(json.attachmentFiles).toBeDefined();
expect(normalizePaths(json.attachmentFiles['attachments/desktop-target.png'])).toContain(
  normalizePaths(path.join('superpowers', 'changes', 'attachment-change', 'attachments', 'desktop-target.png'))
);
expect(normalizePaths(json.attachmentFiles['attachments/visual-notes.md'])).toContain(
  normalizePaths(path.join('superpowers', 'changes', 'attachment-change', 'attachments', 'visual-notes.md'))
);
```

- [ ] **Step 2: Run tests to verify the discovery behavior fails**

Run: `pnpm exec vitest run test/commands/artifact-workflow.test.ts`

Expected: FAIL because `attachmentFiles` is absent and no discovery helper exists.

- [ ] **Step 3: Add failing tests for prose ignoring, deduplication, supported extensions, missing files, nested paths, and traversal rejection**

Extend the same test block with cases for:
- `see attachments/prose-only.png` in prose is not discovered.
- repeated `![A](attachments/shared.png)` references produce one `attachmentFiles['attachments/shared.png']` entry.
- existing supported extensions are surfaced: `.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`, `.svg`, `.txt`, `.md`, `.markdown`, and `.csv`.
- existing `.pdf` references are omitted without warnings, prompts, failures, or apply readiness changes.
- unknown extensions such as `.bin` are omitted without warnings, prompts, failures, or apply readiness changes.
- missing supported-extension references such as `attachments/missing.png` are omitted without warnings, prompts, failures, or apply readiness changes.
- `[Nested](attachments/screens/mobile/home.png)` resolves under nested directories.
- `[Unsafe](attachments/../proposal.md)` is excluded.

Use `path.join()` for all expected filesystem paths.

- [ ] **Step 4: Review discovery tests before production code**

Check that the tests cover:
- Markdown image syntax.
- Markdown link syntax.
- non-Markdown prose mentions.
- duplicate references across multiple artifacts.
- supported extension allow-list behavior.
- unsupported PDF and unknown extension omission.
- missing referenced file omission.
- nested attachment paths.
- traversal attempts.
- cross-platform expected paths using `path.join()` plus `normalizePaths()`.

Expected: Tests are strong enough to fail if discovery scans all files, accepts prose mentions, surfaces unsupported or missing files, or allows traversal.

- [ ] **Step 5: Implement attachment discovery helper**

Create `src/commands/workflow/attachments.ts` with exported functions:

```ts
export interface AttachmentReference {
  relativePath: string;
  absolutePath: string;
}

export async function discoverAttachmentReferences(
  changeDir: string,
  artifactFiles: string[]
): Promise<Record<string, string>> {
  // Read artifact Markdown files, extract Markdown link/image targets that begin
  // with attachments/, resolve safely under changeDir/attachments, dedupe by relative path.
}
```

Implementation constraints:
- Extract Markdown targets from `![alt](target)` and `[text](target)`.
- Only accept targets where the raw target starts with `attachments/`.
- Decode neither URLs nor arbitrary Markdown extensions in the first version.
- Resolve with `path.resolve(changeDir, relativePath)`.
- Require the resolved path to be inside `path.resolve(changeDir, 'attachments')`.
- Validate containment with `path.relative(attachmentsDir, resolvedPath)`; reject the reference when the relative result starts with `..` or is absolute.
- Skip unsafe references.
- Surface only existing files. Missing referenced files are silently omitted and must not warn, prompt, fail, or affect apply readiness.
- Surface only supported extensions: `.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`, `.svg`, `.txt`, `.md`, `.markdown`, and `.csv`.
- Silently omit `.pdf` and all other unsupported extensions without warning, prompting, failing, or affecting apply readiness.
- Return a stable object sorted by relative path.

- [ ] **Step 6: Run targeted discovery tests**

Run: `pnpm exec vitest run test/commands/artifact-workflow.test.ts`

Expected: The new discovery tests pass or fail only because apply output has not yet been wired to the helper.

### Task 2: Apply Instruction Output

**Files:**
- Modify: `src/commands/workflow/shared.ts`
- Modify: `src/commands/workflow/instructions.ts`
- Modify: `test/commands/artifact-workflow.test.ts`
- Test: `test/commands/artifact-workflow.test.ts`

- [ ] **Step 1: Add failing apply JSON output tests**

In the apply instructions tests, assert that:

```ts
expect(json.contextFiles.proposal).toBeDefined();
expect(json.contextFiles['attachments/desktop-target.png']).toBeUndefined();
expect(json.attachmentFiles['attachments/desktop-target.png']).toBeDefined();
expect(json.applyRequires).toEqual(['test-plan']);
expect(json.state).toBe('ready');
```

This proves attachments do not alter artifact context keys or apply readiness.

- [ ] **Step 2: Add failing apply text output tests**

Run `superpowers instructions apply --change attachment-change` and assert the combined output contains:

```ts
expect(output).toContain('### Attachment Files');
expect(normalizePaths(output)).toContain('attachments/desktop-target.png');
```

Also assert that a change with no references omits the section.

- [ ] **Step 3: Run apply output tests to verify failures**

Run: `pnpm exec vitest run test/commands/artifact-workflow.test.ts`

Expected: FAIL because apply instructions do not expose `attachmentFiles` or render an attachment section yet.

- [ ] **Step 4: Review apply output tests before production code**

Check that tests prove:
- `contextFiles` remains keyed by artifact ID.
- attachments are separate from schema artifacts.
- attachments do not unblock or block apply.
- text and JSON output both carry referenced attachments.

- [ ] **Step 5: Extend apply instruction typing**

Modify `src/commands/workflow/shared.ts`:

```ts
export interface ApplyInstructions {
  ...
  attachmentFiles?: Record<string, string>;
}
```

Keep the field optional so existing consumers that ignore it continue to work.

- [ ] **Step 6: Wire discovery into apply instruction generation**

In `src/commands/workflow/instructions.ts`, after `contextFiles` is built:
- Convert `Object.values(contextFiles)` into the artifact file path list.
- Call `discoverAttachmentReferences(changeDir, Object.values(contextFiles))`.
- Include `attachmentFiles` in the returned apply instructions only when non-empty.

Do not add attachment paths to `contextFiles`.

- [ ] **Step 7: Render attachment files in text output**

In the apply text renderer in `src/commands/workflow/instructions.ts`, add:

```md
### Attachment Files

- attachments/desktop-target.png: /absolute/path/to/file
```

Render the section only when `attachmentFiles` has entries.

- [ ] **Step 8: Run targeted apply tests**

Run: `pnpm exec vitest run test/commands/artifact-workflow.test.ts`

Expected: PASS for discovery and apply output tests.

### Task 3: Artifact And Workflow Guidance

**Files:**
- Modify: `schemas/spec-driven/schema.yaml`
- Modify: `schemas/spec-driven/templates/proposal.md`
- Modify: `schemas/spec-driven/templates/design.md`
- Modify: `schemas/spec-driven/templates/spec.md`
- Modify: `schemas/spec-driven/templates/execution-plan.md`
- Modify: `src/core/templates/workflows/propose.ts`
- Modify: `src/core/templates/workflows/continue-change.ts`
- Modify: `src/core/templates/workflows/apply-change.ts`
- Modify: `src/core/templates/workflows/verify-change.ts`
- Modify: `test/commands/artifact-workflow.test.ts`
- Modify: `test/core/templates/skill-templates-parity.test.ts`
- Test: `test/commands/artifact-workflow.test.ts`
- Test: `test/core/templates/skill-templates-parity.test.ts`

- [ ] **Step 1: Add failing instruction guidance tests**

In `test/commands/artifact-workflow.test.ts`, call:
- `superpowers instructions proposal --change guidance-change --json`
- `superpowers instructions design --change guidance-change --json`
- `superpowers instructions specs --change guidance-change --json`
- `superpowers instructions execution-plan --change guidance-change --json`

Assert each relevant response includes `attachments/` in either `instruction` or `template`, and includes guidance to explain referenced attachments.

- [ ] **Step 2: Run guidance tests to verify failures**

Run: `pnpm exec vitest run test/commands/artifact-workflow.test.ts`

Expected: FAIL until schema instructions/templates mention attachments.

- [ ] **Step 3: Review guidance tests before production code**

Check that tests enforce the real convention:
- attachment references are optional,
- references use `attachments/...`,
- referenced artifacts explain purpose and normative versus illustrative meaning.

- [ ] **Step 4: Update schema instructions and templates**

Modify `schemas/spec-driven/schema.yaml` for `proposal`, `specs`, `design`, and `execution-plan` instructions:
- Say artifacts may reference supporting files in `attachments/`.
- Require each reference to explain what the file is, why it matters, and whether it is normative, illustrative, or background context.

Modify the four templates with a concise optional note. Example:

```md
## Attachments

<!-- Optional. Reference change-local files such as ![Mockup](attachments/mockup.png).
Explain what each file is, why it matters, and whether it is normative, illustrative, or background context. -->
```

Keep this optional and do not add it to `tasks.md` or `test-plan.md`.

- [ ] **Step 5: Update workflow prompt text**

Modify propose/continue guidance so agents preserve attachment references when creating artifacts. Modify apply/verify guidance so agents read `attachmentFiles` from apply instructions in addition to `contextFiles`.

Expected apply wording:
- Read `contextFiles` for artifacts.
- Read or inspect `attachmentFiles` when present.
- Treat artifacts as the source of normative meaning for each attachment.

- [ ] **Step 6: Update generated-template parity assertions if required**

Run: `pnpm exec vitest run test/core/templates/skill-templates-parity.test.ts`

Expected: If assertions fail because expected generated text changed, update the assertions to include attachment guidance. Do not weaken parity checks.

- [ ] **Step 7: Run guidance and parity tests**

Run:
- `pnpm exec vitest run test/commands/artifact-workflow.test.ts`
- `pnpm exec vitest run test/core/templates/skill-templates-parity.test.ts`

Expected: PASS.

### Task 4: Validation And Regression

**Files:**
- Modify: files touched by Tasks 1-3 if final fixes are needed.
- Test: all affected test files.

- [ ] **Step 1: Run targeted artifact workflow tests**

Run: `pnpm exec vitest run test/commands/artifact-workflow.test.ts`

Expected: PASS, including attachment discovery, apply JSON/text output, completion neutrality, and guidance tests.

- [ ] **Step 2: Run generated workflow/template tests**

Run: `pnpm exec vitest run test/core/templates/skill-templates-parity.test.ts`

Expected: PASS with intentional attachment guidance covered.

- [ ] **Step 3: Run full test suite**

Run: `pnpm test`

Expected: PASS.

- [ ] **Step 4: Run build**

Run: `pnpm run build`

Expected: PASS with no TypeScript or bundling errors.

- [ ] **Step 5: Run lint**

Run: `pnpm run lint`

Expected: PASS or only pre-existing unrelated lint failures. If lint fails in files changed for this task, fix those failures before completing the task.

- [ ] **Step 6: Cross-platform path review**

Review new tests and implementation:
- Expected filesystem paths use `path.join()` or `path.resolve()`.
- Assertions normalize separators only for string comparison.
- Markdown reference examples use change-relative `attachments/...`.
- Production code does not hardcode OS-specific absolute path separators.

Expected: All path-sensitive behavior is portable across macOS, Linux, and Windows.

## Self-Review

- Spec coverage: The plan maps fixed directory behavior, artifact references, file types, safe resolution, explicit markdown discovery, instructions guidance, apply JSON output, apply text output, no-reference behavior, and unsafe reference exclusion to concrete test and implementation steps.
- Placeholder scan: The plan contains no unresolved placeholder markers.
- Type consistency: The planned optional field is consistently named `attachmentFiles`, and the helper returns a `Record<string, string>` keyed by change-relative `attachments/...` paths.
