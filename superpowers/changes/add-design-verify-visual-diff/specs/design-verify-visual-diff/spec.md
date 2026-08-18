## ADDED Requirements

### Requirement: Apply Captures Runtime Before Before UI Edits
When `/sp:apply` is implementing a change with predicted user-facing UI scope, the agent SHALL capture runtime Before screenshots only while the capture window is `open`. The window is `open` only when predicted UI scope is true, this invocation has not yet made an implementation edit, and **UI-baseline evidence** holds: the union of `git diff --name-only <merge-base> HEAD`, `git diff --name-only`, and `git diff --name-only --cached` contains **no paths at all**, and `git status --porcelain` is empty. Any dirty or committed implementation change SHALL close the window, including template-driven or other non-suffix UI, so a resumed After is never stored as runtime Before. Reusing an existing worktree SHALL default to `closed` unless that UI-baseline evidence holds. If this invocation created the worktree and UI-baseline evidence holds, the window is `open`. If merge-base cannot be determined or those evidence commands cannot be run, the window is `closed`. If `attachments/visual-diff/before/` already contains files from this change, the agent SHALL NOT overwrite them. Predicted UI scope SHALL be determined by explicit lookup of change artifacts (proposal, design, specs, tasks, test-plan Manual Coverage routes) and of owned path suffixes from that same explicit list; it SHALL NOT use open-ended filename regex. Routes and states SHALL be the union of those named in design, proposal, specs, and `test-plan.md` Manual Coverage; if none are named, capture the smallest documented app entry route once (for example `/`) and record that limitation. It SHALL write Before files under the change-local attachments directory using `path.join` (or the host equivalent) so Markdown targets begin with `attachments/visual-diff/before/`, labeled `runtime`. If UI scope is not predicted, or the window is `closed`, the agent SHALL NOT capture Before.

#### Scenario: Capture window is open for predicted UI
- **WHEN** `/sp:apply` has predicted UI scope, this invocation has not edited implementation yet, and UI-baseline evidence holds (those diffs list no paths and `git status --porcelain` is empty)
- **THEN** the agent SHALL start or use the documented application runtime and available browser automation or agent-controlled browser
- **AND** it SHALL capture screenshots for each predicted route and applicable state (union of named routes, or the documented entry route once with a recorded limitation)
- **AND** it SHALL write them under the change attachments directory with Markdown targets beginning `attachments/visual-diff/before/`
- **AND** it SHALL record each file as Before kind `runtime`

#### Scenario: Reused worktree with UI already changed is closed
- **WHEN** `/sp:apply` reuses an existing worktree and UI-baseline evidence fails (any path appears in `git diff --name-only <merge-base> HEAD`, unstaged/staged diffs, or `git status --porcelain` is non-empty), including template-driven UI such as `.go` templates already edited
- **THEN** the agent SHALL treat the capture window as `closed`
- **AND** it SHALL NOT write runtime Before files
- **AND** it SHALL proceed with implementation so Design Verify can use After-only unless an illustrative Before exists

#### Scenario: Capture window is fail-closed when evidence is ambiguous
- **WHEN** merge-base cannot be determined or the UI-baseline evidence commands cannot be run
- **THEN** the agent SHALL treat the capture window as `closed`
- **AND** it SHALL NOT capture runtime Before

#### Scenario: Non-UI change skips Before capture
- **WHEN** artifacts and owned paths from the explicit suffix list show no user-facing UI
- **THEN** the agent SHALL NOT capture Before screenshots
- **AND** it SHALL proceed with implementation

#### Scenario: Before runtime is unavailable at apply start
- **WHEN** predicted UI scope exists but the application runtime, credentials, or browser capability is missing
- **THEN** the agent SHALL continue implementation without Before files
- **AND** it SHALL NOT block apply
- **AND** later Design Verify SHALL treat Before as missing unless an illustrative Before attachment exists

#### Scenario: Capture uses platform-neutral attachment paths
- **WHEN** the agent writes a Before screenshot on Windows, macOS, or Linux
- **THEN** it SHALL join directory segments with `path.join` or the host equivalent rather than hardcoded slash concatenation
- **AND** Markdown references in artifacts and reports SHALL still use targets beginning `attachments/visual-diff/before/` (forward-slash Markdown targets, as in existing attachment discovery)

#### Scenario: Named routes are the capture set
- **WHEN** design, proposal, specs, or Manual Coverage name one or more routes or states
- **THEN** Before capture (and later After capture) SHALL use the union of those named routes and states
- **AND** it SHALL NOT invent additional routes beyond that union and Design Verify's affected-route inspection

#### Scenario: No named routes uses documented entry
- **WHEN** predicted UI exists but no completed artifact names a route
- **THEN** the agent SHALL capture the smallest documented application entry route once
- **AND** it SHALL record that limitation in the capture evidence or Design Verify report

### Requirement: Human Attachment Images Count As Illustrative Before
Image files under the change `attachments/` directory that artifacts identify as current-product / status-quo screenshots SHALL count as Before kind `illustrative`. The referencing artifact SHALL explain source, route or state, and that the file is illustrative. An illustrative Before SHALL NOT be treated as `runtime` unless it was captured by apply in this change's capture window.

#### Scenario: Proposal references a status-quo screenshot
- **WHEN** a completed artifact contains a Markdown image target beginning `attachments/` that the artifact text identifies as a current-product screenshot for a named route or state
- **THEN** Design Verify SHALL treat that file as Before kind `illustrative` for that route or state

#### Scenario: Unexplained attachment is not Before
- **WHEN** an image exists under `attachments/` but no completed artifact explains it as a current-product / status-quo screenshot
- **THEN** the agent SHALL NOT treat it as Before

#### Scenario: Runtime and illustrative Before both exist
- **WHEN** a route has both a `runtime` Before from apply capture and an `illustrative` Before attachment
- **THEN** Design Verify SHALL use the `runtime` Before as the default comparison
- **AND** it SHALL still present the `illustrative` file as supplemental evidence
- **AND** if a completed artifact explicitly states that the human image is the comparison source of truth, Design Verify SHALL use the `illustrative` Before as the default comparison instead

### Requirement: Design Verify Captures After And Stores Visual Diff Attachments
For UI scope, `/sp:design-verify` SHALL capture After screenshots of each affected route and applicable state while inspecting the running UI. It SHALL write them under the change-local attachments directory using `path.join` (or the host equivalent) so Markdown targets begin with `attachments/visual-diff/after/`. Non-UI scope SHALL remain `not applicable` without capturing After.

#### Scenario: UI scope captures After
- **WHEN** design verification determines the change affects a user-facing UI and the runtime can be inspected
- **THEN** the agent SHALL capture After screenshots for each affected route and applicable state
- **AND** it SHALL write them under the change attachments directory with Markdown targets beginning `attachments/visual-diff/after/`
- **AND** it SHALL include those paths in the design-verification report

#### Scenario: Non-UI scope does not capture After
- **WHEN** artifacts and implementation diff show no user-facing UI
- **THEN** the agent SHALL report `not applicable` with scope evidence
- **AND** it SHALL NOT capture After screenshots

#### Scenario: After capture uses platform-neutral paths
- **WHEN** After screenshots are written on Windows, macOS, or Linux
- **THEN** the agent SHALL join directory segments with `path.join` or the host equivalent
- **AND** Markdown references SHALL use targets beginning `attachments/visual-diff/after/`

### Requirement: Design Verify Presents Before And After When Before Exists
When at least one Before (runtime or illustrative) exists for an affected route, `/sp:design-verify` SHALL present that Before beside the After screenshot in its report. Presentation is diagnostic evidence for deciding whether to continue editing or merge; it SHALL NOT by itself determine `passed` or `failed`. Formal pass/fail SHALL remain repository visual `DESIGN.md` conformance as already specified for Design Verify.

#### Scenario: Before exists and After is captured
- **WHEN** UI scope has a Before for a route and After capture succeeds
- **THEN** the report SHALL include a per-route/state visual-diff table row with Before kind, Before path, After path, and default comparison
- **AND** the agent SHALL still cite applicable `DESIGN.md` rules against the running After UI

#### Scenario: Mixed routes some with Before and some without
- **WHEN** one affected route has a Before and another affected route does not
- **THEN** the report SHALL emit one visual-diff table row per route or state
- **AND** rows with Before SHALL show the pair
- **AND** rows without Before SHALL record `missing` or `route did not exist` and still include After

#### Scenario: New route has no prior UI
- **WHEN** the affected route did not exist in the Before capture window and no illustrative Before covers it
- **THEN** the report SHALL record Before as `missing` or `route did not exist`
- **AND** it SHALL still capture After
- **AND** this SHALL NOT by itself fail or block design verification

### Requirement: Missing Before Is After-Only And Non-Blocking
When UI scope has no `runtime` Before and no qualifying `illustrative` Before, `/sp:design-verify` SHALL capture After only, record `Before: missing` in the report, and SHALL NOT fail or block for that omission. The agent SHALL NOT reconstruct Before by adding a second git worktree, checking out the merge-base in the apply worktree, or treating source inspection as a Before screenshot. Missing Before SHALL NOT prevent `/sp:apply` from recommending archive when every applicable final quality gate otherwise passes.

#### Scenario: Apply resumed after UI edits with no Before attachments
- **WHEN** design verification runs for UI scope, no `attachments/visual-diff/before/` runtime files exist, and no artifact-explained illustrative Before exists
- **THEN** the agent SHALL capture After only
- **AND** the report SHALL record `Before: missing`
- **AND** the outcome SHALL NOT be `failed` or `blocked` solely because Before is missing

#### Scenario: Missing Before does not reconstruct old code
- **WHEN** Before is missing
- **THEN** the agent SHALL NOT create a second worktree at merge-base to screenshot old UI
- **AND** it SHALL NOT `git checkout` an older commit in the apply worktree for that purpose

#### Scenario: Missing Before does not block archive
- **WHEN** Design Verify otherwise passes or is scope-backed `not applicable`, and Before was missing
- **THEN** `/sp:apply` MAY recommend archive
- **AND** it SHALL NOT treat `Before: missing` as a failed or blocked gate

### Requirement: Existing Design Verify Blockers Remain Unchanged
Missing application runtime, credentials, browser capability, or repository visual `DESIGN.md` for UI scope SHALL still report `blocked` as in the existing Design Verify contract. After-only fallback applies only to a missing Before image, not to those prerequisites. Screenshots SHALL NOT substitute for executing an applicable Manual Coverage row.

#### Scenario: UI change cannot run at Design Verify
- **WHEN** UI scope exists but the runtime or browser capability is unavailable during design verification
- **THEN** the agent SHALL report `blocked` and name the prerequisite
- **AND** After-only fallback SHALL NOT produce a pass from source inspection

#### Scenario: UI change lacks visual DESIGN.md
- **WHEN** UI scope has no discovered repository visual `DESIGN.md`
- **THEN** the agent SHALL report `blocked` because formal conformance is unassessable
- **AND** captured After screenshots SHALL NOT by themselves produce a pass

#### Scenario: Screenshots are not Manual Coverage proof
- **WHEN** a Manual Coverage row requires programmatic-browser or agent-browser execution
- **THEN** Before/After attachment images SHALL NOT be treated as completing that row

## Attachments

None.
