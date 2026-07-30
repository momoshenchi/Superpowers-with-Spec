## File Structure

- Modify:
  - `schemas/spec-driven/templates/design.md` — section skeleton
  - `schemas/spec-driven/schema.yaml` — design `instruction` prose
  - `src/commands/schema.ts` — `case 'design'` fallback markdown
  - `src/core/templates/workflows/explore.ts` — major ≥3 / converge handoff
  - `src/core/templates/workflows/change-review.ts` — review criteria
  - `skills/change-review/SKILL.md` — repo review skill parity
- Test:
  - `test/core/templates/change-review.test.ts` — criteria assertions
  - `test/core/templates/skill-templates-parity.test.ts` — hash updates if skill body changes
  - `test/commands/schema.test.ts` and/or focused new assertions for design fallback / template paths as needed
  - Any existing test that snapshots design instruction strings

## Dispatch Coordination

| Unit | Scope | Ownership | Dependencies | Assignee policy | Parallel | Handoff |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Schema template + instruction + fallback | `schemas/spec-driven/**`, `src/commands/schema.ts` | None | Prefer dedicated worker or execute inline | Yes vs unit 2 if no shared files | Updated skeleton; instruction text complete |
| 2 | Explore + review workflows + repo skill | `src/core/templates/workflows/explore.ts`, `change-review.ts`, `skills/change-review/SKILL.md` | None for start; integrate before 3 | Prefer dedicated worker or execute inline | Yes vs unit 1 | Review/explore strings match specs |
| 3 | Tests and parity | `test/core/templates/**`, related schema tests | Units 1–2 integrated | Execute inline after merge | No | Targeted tests green |

## Execution Boundaries

### 1. Schema design template and instruction

- Deliver tasks 1.1–1.3 only in schema/fallback files.
- Do not edit explore/review in this unit.
- Do not add CLI validate rules.

### 2. Explore and change-review conventions

- Deliver tasks 2.1–2.3.
- Keep propose/apply graph unchanged except via review skill text.
- Preserve ephemeral review (no review.md).

### 3. Verification

- Deliver 3.1–3.2 after 1–2 are on disk together.

## Dispatch Execution

### 1. Schema design template and instruction

#### Task 1.1: Update package design.md template

**Files:**
- Modify: `schemas/spec-driven/templates/design.md`

1. **Step 1: Write or extend focused tests** — Add/adjust a test (or extend schema template read assertions) that the design template file contains `## Current system`, `### Relationship to existing tech`, and `## Contracts`.
2. **Step 2: Run the focused tests** — Expect FAIL on missing headings before edit.
3. **Step 3: Implement Task 1.1** — Insert sections after Context; keep Goals/Non-Goals, Decisions (with major-comparison placeholder comment), Contracts, Risks; optional Migration/Open Questions/Attachments as today. Current system title is exact. Relationship comment should mention pointer column. Contracts comment should allow N/A.
4. **Step 4: Run focused verification** — Headings present; template still valid markdown.
5. **Step 5: Self-review and handoff** — Confirm no engineering-living-doc mandate text accidentally included.

#### Task 1.2: Update schema.yaml design instruction

**Files:**
- Modify: `schemas/spec-driven/schema.yaml` (design artifact instruction block)

1. **Step 1: Write or extend focused tests** — Assert instruction text mentions Current system, Contracts, pointers, major ≥3 / minor rationale, visual DESIGN.md discovery/citation (string contains checks in unit test loading schema or fixture).
2. **Step 2: Run focused tests** — FAIL until instruction updated.
3. **Step 3: Implement Task 1.2** — Replace/extend design `instruction:` sections list and rules per `specs/change-design-conventions` and design.md Decisions; keep attachment guidance; explicitly exclude bundling `@google/design.md`.
4. **Step 4: Run focused verification** — Tests pass; YAML still parses (`superpowers` schema load / existing schema tests).
5. **Step 5: Self-review and handoff** — Instruction does not require docs/onboard rewrites.

#### Task 1.3: Align schema.ts design fallback

**Files:**
- Modify: `src/commands/schema.ts` (`case 'design'` return string)

1. **Step 1: Write or extend focused tests** — If schema init fallback is tested, assert new headings; else add a small unit assertion on the fallback helper or snapshot fragment.
2. **Step 2: Run focused tests** — FAIL on old Context/Decisions-only stub if asserted.
3. **Step 3: Implement Task 1.3** — Mirror package template section order; keep Alternatives considered example under a sample major decision; include Contracts N/A example comment.
4. **Step 4: Run focused verification** — `test/commands/schema.test.ts` (and new asserts) pass.
5. **Step 5: Self-review and handoff** — Fallback and package template do not diverge on required headings.

### 2. Explore and change-review conventions

#### Task 2.1: Explore major-option handoff

**Files:**
- Modify: `src/core/templates/workflows/explore.ts`

1. **Step 1: Write or extend focused tests** — String assertions that explore template distinguishes major ≥3 diverge vs minor, and design as converge/record (both skill and command template copies inside file if duplicated).
2. **Step 2: Run focused tests** — FAIL on old “always 2-3” only wording if tests require scale-aware language.
3. **Step 3: Implement Task 2.1** — Update both instruction copies in `explore.ts` consistently: major features ≥3 approaches before propose; design records comparison table + choice; minor local work does not need triple options; optional note to load visual DESIGN.md for UI exploration.
4. **Step 4: Run focused verification** — Template export tests / grep assertions pass; no propose graph edits.
5. **Step 5: Self-review and handoff** — Duplicated skill/command bodies stay in sync.

#### Task 2.2: Generated change-review criteria

**Files:**
- Modify: `src/core/templates/workflows/change-review.ts`

1. **Step 1: Write or extend focused tests** — Extend `test/core/templates/change-review.test.ts` to expect Current system, Contracts, pointer, major comparison, visual DESIGN.md criteria phrases and severity guidance.
2. **Step 2: Run focused tests** — FAIL until template updated.
3. **Step 3: Implement Task 2.2** — Add checklist rows matching `specs/sp-change-review-skill`; keep schema-aware scope; do not add review.md; scale-aware severities per design Decision 5.
4. **Step 4: Run focused verification** — `change-review.test.ts` passes.
5. **Step 5: Self-review and handoff** — No applyRequires or propose loop redesign beyond criteria text.

#### Task 2.3: Repo skills/change-review parity

**Files:**
- Modify: `skills/change-review/SKILL.md`

1. **Step 1: Write or extend focused tests** — Rely on skill-templates parity and/or explicit shared-criteria test; expect FAIL on hash/content drift after 2.2 until 2.3 done.
2. **Step 2: Run focused tests** — Confirm failure mode.
3. **Step 3: Implement Task 2.3** — Port the same design-section and visual DESIGN.md rules into the Chinese/repo skill tables and clarity checks; keep existing completeness dimensions.
4. **Step 4: Run focused verification** — Parity/hash tests updated and green.
5. **Step 5: Self-review and handoff** — Repo skill and generated skill do not disagree on BLOCKER/WARNING policy for these rules.

### 3. Verification

#### Task 3.1: Parity and content tests

**Files:**
- Modify/Create: `test/core/templates/change-review.test.ts`, `test/core/templates/skill-templates-parity.test.ts`, schema/template tests as needed

1. **Step 1: Write or extend focused tests** — Complete assertions listed in 1.x/2.x; update expected hashes for `superpowers-change-review` when body changes.
2. **Step 2: Run the focused tests** — FAIL on stale hashes or missing strings.
3. **Step 3: Implement Task 3.1** — Fix test expectations; add any minimal fixture reads of `schemas/spec-driven/templates/design.md`.
4. **Step 4: Run focused verification** — Targeted vitest paths pass.
5. **Step 5: Self-review and handoff** — No production logic changes beyond test fixes.

#### Task 3.2: Targeted regression run

**Files:**
- Test only

1. **Step 1: Write or extend focused tests** — N/A (execution of suite).
2. **Step 2: Run the focused tests** — `pnpm exec vitest run test/core/templates/change-review.test.ts test/core/templates/skill-templates-parity.test.ts test/commands/schema.test.ts` (adjust if paths differ); record expected PASS.
3. **Step 3: Implement Task 3.2** — Fix any residual string drift in onboard only if a test forces it; **prefer not** expanding onboard (Non-Goal)—skip onboard unless a failing test requires a one-line design skeleton touch, then note in handoff.
4. **Step 4: Run focused verification** — Full targeted set PASS.
5. **Step 5: Self-review and handoff** — List commands run and outcomes for Test Hardening.

## Final Integration Review and Validation

- Integrate units 1–2 before formal review; run unit 3.
- Confirm specs `change-design-conventions` and `sp-change-review-skill` are fully reflected in shipped strings.
- Confirm Non-Goals: no artifact graph / validate parser / docs chapter / @google/design.md dependency.
- Record hardening evidence in `test-plan.md`.
