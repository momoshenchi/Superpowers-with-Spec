## File Structure

- Modify:
  - `schemas/spec-driven/templates/design.md` — Decisions comments + optional `### Derived implications` placeholder; keep top-level heading order
  - `schemas/spec-driven/schema.yaml` — design artifact `instruction` closed-scan paragraph
  - `src/commands/schema.ts` — `case 'design':` fallback skeleton comments aligned with the package template
  - `src/core/templates/workflows/propose.ts` — `PROPOSE_INTERVIEW_GUIDANCE` summary list + post-confirm write/spec-trace/derive-unless-boundary
  - `src/core/templates/workflows/change-review.ts` — Completeness table + Design convention checks for derived-implications scan
  - `.vscode/important_skills/change-review/SKILL.md` — repo-local review skill parity with generated scan contract
- Test:
  - `test/core/templates/design-conventions.test.ts` — template/instruction/fallback/Propose/review string anchors for the scan
  - `test/core/templates/change-review.test.ts` — generated review WARNING-only derived-gap checks
  - `test/core/templates/skill-templates-parity.test.ts` — Propose/review content asserts + exact-content hashes
- Do not create:
  - New schema artifacts, `validate` parsers, onboard chapters, or `## Derived implications` as a required heading

## Attachments

None.

## Dispatch Coordination

`tasks.md` is the source of detailed, checkbox-tracked work. Each top-level `# <number>. <scope>` heading is one **dispatch unit**: a logical allocation boundary the coordinator may assign to one worker/subagent, combine with compatible units, or execute inline. It is not a live subagent identity. Legacy `# <number>. agent<logical-id> — <scope>` headings remain acceptable.

| Unit | Scope | Ownership | Dependencies | Assignee policy | Parallel | Handoff |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Design template and instruction | `schemas/spec-driven/templates/design.md`, `schemas/spec-driven/schema.yaml` design instruction, `src/commands/schema.ts` `case 'design':` | None | Prefer dedicated worker; may execute inline | Yes vs unit 2 (no shared files) | Template still has exact `## Current system` / `## Contracts` / `## Invariants` order; optional `### Derived implications`; no required `## Derived implications`; grep shows six dimension names |
| 2 | Propose and change-review workflows | `src/core/templates/workflows/propose.ts`, `src/core/templates/workflows/change-review.ts`, `.vscode/important_skills/change-review/SKILL.md` | None | Prefer dedicated worker; may combine with unit 1 if one owner | Yes vs unit 1; 2.3 after 2.2 | Propose guidance lists derived assumptions and spec trace; review rubric is WARNING-only for derived gaps |
| 3 | Alignment tests | `test/core/templates/design-conventions.test.ts`, `test/core/templates/change-review.test.ts`, `test/core/templates/skill-templates-parity.test.ts` | Units 1 and 2 | Execute after 1+2 integrate; may combine with the coordinator | No | Focused vitest files pass; hashes updated; paths use `path.join` |

Integration order: 1 ∥ 2, then 3. One formal cross-unit review and full validation only after all three units integrate. Fixes get targeted verification without a second complete review unless requested.

When units 1 and 2 run in parallel, the coordinator serializes writes to this `execution-plan.md`. Workers must not overwrite another unit's Implementation Notes.

## Execution Boundaries

### 1. Design template and instruction

- Deliver tasks 1.1–1.3.
- Own only the three design-skeleton sources listed above. Do not edit Propose or change-review workflow files (unit 2).
- Verify with `rg` on those three files for the six dimension names and `Do not add required extra headings`, then self-review heading order before handoff.

### 2. Propose and change-review workflows

- Deliver tasks 2.1–2.3.
- Own Propose guidance, generated review rubric, and the `.vscode` review skill projection. Do not edit `schemas/spec-driven/templates/design.md` or `schema.yaml` (unit 1).
- Verify with `rg` on the three owned files for summary-list, derive-unless-boundary, WARNING-only, and “not a finding” for missing extra heading.

### 3. Alignment tests

- Deliver tasks 3.1–3.3.
- Own only the three test files. Do not restyle production instruction text except to fix a test that proves a spec gap (send that fix back to unit 1 or 2).
- Run the focused vitest command in task 3.3 and expect pass.

## Dispatch Execution

Expand every detailed task from `tasks.md` beneath its dispatch unit. These steps explain how to execute a feature-scale task; they are not separate subagent assignments or required 2–5 minute units. Keep checkbox completion only in `tasks.md`. Use clean `### <number>. <scope>` headings — do not nest code-wrapped `# ...` heading text.

## Implementation Notes

After any Step 1–5, a worker MAY append a concise `#### Implementation Notes` subsection directly below that step when the implementation produces useful knowledge. These notes are non-normative narrative context, not an execution status tracker, and do not replace `tasks.md` progress or verification evidence. Do not use task checkboxes or status fields in the notes. Prefer observations that help a later worker or the main agent understand:

- **Findings** — facts discovered in the code, tests, runtime, or tooling
- **Reasoning** — the thought process behind an implementation choice
- **Viewpoints / Trade-offs** — alternatives considered and why one was preferred
- **Summary / Takeaway** — a concise conclusion or reusable tip

Keep planned Step 1–5 instructions intact. Append notes rather than rewriting the plan, and distinguish observed facts from inferences or decisions. When multiple dispatch units execute in parallel, the coordinator SHALL serialize writes to this shared file or append worker-provided notes after handoff; a worker must not overwrite another unit's notes.

### 1. Design template and instruction

#### Task 1.1: Extend package design.md template

**Files:**
- Modify: `schemas/spec-driven/templates/design.md` — Decisions HTML comment + optional subsection after the agent-owned decision stub
- Test: `test/core/templates/design-conventions.test.ts` — will fail on missing anchors until 3.1; for 1.1 use `rg` as the focused check

1. **Step 1: Write or extend focused tests** — In 3.1 the test will require: six dimension phrases, `### Derived implications`, and absence of a required `## Derived implications` heading. For 1.1, treat current `expectSectionOrder` in `design-conventions.test.ts` as the regression baseline that must still pass.
2. **Step 2: Run the focused tests** — `npm test -- test/core/templates/design-conventions.test.ts` should still pass on heading order before the new asserts land. Expected: pass (no new asserts yet).
3. **Step 3: Implement Task 1.1** — In the `## Decisions` comment, list the six scan dimensions from design.md Decision 6. State that each dimension needs a derived rule or short N/A, that items are agent-owned / derived from confirmed direction, and that `**User selection:**` is forbidden for them. After `### 2. <!-- Agent-owned implementation decision -->` block, add an optional `### Derived implications` placeholder with one bullet per dimension (`rule or N/A`). Do not add `## Derived implications`. Do not reorder Context → Current system → Relationship → Goals → Decisions → Contracts → Invariants.
4. **Step 4: Run focused verification** — `rg -n "Derived implications|Actor, permission|Empty, deny|Lifecycle: create|Compatibility and migration|Data shape and contracts|product-direction forks" schemas/spec-driven/templates/design.md` expected: matches in comments/placeholder. `rg -n "^## Derived implications" schemas/spec-driven/templates/design.md` expected: no match. `npm test -- test/core/templates/design-conventions.test.ts` expected: existing tests still pass.
5. **Step 5: Self-review and handoff** — Confirm the file is UTF-8 Markdown, no required extra H2, and pointers in Relationship table elsewhere in this change remain valid. Handoff: template path + `rg` evidence.

#### Task 1.2: Extend schema design instruction

**Files:**
- Modify: `schemas/spec-driven/schema.yaml` — only the `- id: design` `instruction: |` block (before `- id: tasks`)
- Test: same design-conventions file in unit 3

1. **Step 1: Write or extend focused tests** — Unit 3 will slice `schema.yaml` from `- id: design` to `- id: tasks` and assert scan + “Do not add required extra headings”. Baseline: existing instruction tests in `design-conventions.test.ts` must remain green.
2. **Step 2: Run the focused tests** — `npm test -- test/core/templates/design-conventions.test.ts` expected: pass before new asserts.
3. **Step 3: Implement Task 1.2** — After the implementable-detail / Decisions guidance, add a paragraph that SHALL: name the six dimensions; require rule or short N/A on behavioral changes; allow one short N/A for local helpers; place content in existing headings; allow `### Derived implications`; forbid a required extra heading; label agent-owned; forbid presenting derived items as user Choice; trace observable rules into delta specs; interview only on direction reversal or security/data/billing/public-contract; note that change-review treats missing scan coverage as WARNING and never as a BLOCKER solely for a derived-implication gap. Keep YAML indentation of the `instruction: |` block valid.
4. **Step 4: Run focused verification** — `rg -n "derived-implication|closed scan|WARNING" schemas/spec-driven/schema.yaml` expected: hits inside the design instruction, not in unrelated artifacts. `npx js-yaml schemas/spec-driven/schema.yaml >/dev/null` or `node -e "import {readFileSync} from 'node:fs'; import {parse} from 'yaml'"` if yaml is available; otherwise `npm test -- test/commands/schema.test.ts` expected: pass (schema still loads).
5. **Step 5: Self-review and handoff** — Confirm you did not add `id: review` or a validate parser. Handoff: instruction paragraph location.

#### Task 1.3: Mirror schema-init design fallback

**Files:**
- Modify: `src/commands/schema.ts` — `case 'design':` template string only
- Test: `design-conventions.test.ts` schema-init fallback section-order test

1. **Step 1: Write or extend focused tests** — Existing test slices `case 'design':` to `case 'tasks':` and checks heading order. New asserts in 3.1 will look for scan comments and `### Derived implications` inside that slice.
2. **Step 2: Run the focused tests** — `npm test -- test/core/templates/design-conventions.test.ts` expected: pass on current fallback.
3. **Step 3: Implement Task 1.3** — Copy the same Decisions comment intent and optional `### Derived implications` placeholder as the package template. Keep the fallback’s existing heading order including Migration Plan and Open Questions. Do not change other `case` branches.
4. **Step 4: Run focused verification** — `npm test -- test/core/templates/design-conventions.test.ts` expected: pass. `rg -n "### Derived implications" src/commands/schema.ts` expected: match inside `case 'design':` only.
5. **Step 5: Self-review and handoff** — Confirm TypeScript template string quotes still compile (`npx tsc --noEmit` if cheap, or rely on the vitest import of schema.ts). Unit 1 complete when 1.1–1.3 `rg` evidence is attached.

### 2. Propose and change-review workflows

#### Task 2.1: Update Propose interview guidance

**Files:**
- Modify: `src/core/templates/workflows/propose.ts` — `PROPOSE_INTERVIEW_GUIDANCE` constant (both skill and command interpolate it)
- Test: `test/core/templates/design-conventions.test.ts` Propose it-block; `test/core/templates/skill-templates-parity.test.ts` Propose content + hashes

1. **Step 1: Write or extend focused tests** — Unit 3 will assert new strings. For 2.1, note current asserts: `confirmed decisions from agent-owned implementation assumptions`, `Route each high-impact technical decision into design.md`, `Do not present a model-inferred result as a user Choice`. Those lines MUST remain.
2. **Step 2: Run the focused tests** — `npm test -- test/core/templates/design-conventions.test.ts test/core/templates/skill-templates-parity.test.ts` expected: pass before edits; hashes still match.
3. **Step 3: Implement Task 2.1** — In the summary sentence, require a compact list of agent-owned derived assumptions covering the six dimensions, separate from confirmed decisions, never labeled as user Choices. After confirmation routing: run the closed scan; write into existing design headings (optional `### Derived implications`); ADDED/MODIFIED delta spec when the derived rule is observable; do not add interview questions for non-boundary derivations; interview when a derivation would reverse goal/scope/acceptance or cross security, persisted-data, billing, or public-contract; if the user corrects a derived assumption, re-scan dependents and re-summarize before create. Keep the three-state final gate and “do not create interview.md”.
4. **Step 4: Run focused verification** — `rg -n "derived assumptions|derive-unless-boundary|observable" src/core/templates/workflows/propose.ts` expected: matches in `PROPOSE_INTERVIEW_GUIDANCE`. Existing Propose interview tests will still pass; hash test in parity will FAIL until 3.3 — that failure is expected and owned by unit 3.
5. **Step 5: Self-review and handoff** — Confirm skill and command both use `PROPOSE_INTERVIEW_GUIDANCE` so one edit covers both. Do not edit `docs/workflows.md` (Non-Goal: no onboard/docs rewrite; existing one-liner remains true).

#### Task 2.2: Update change-review rubric

**Files:**
- Modify: `src/core/templates/workflows/change-review.ts` — Completeness per-artifact `design.md` row + Design convention checks + Coherence spec-trace note
- Test: `test/core/templates/change-review.test.ts`

1. **Step 1: Write or extend focused tests** — Existing it-block already requires `Design convention checks`, `principle-only`, `not a finding`. New 3.2 asserts will require derived-scan WARNING-only language.
2. **Step 2: Run the focused tests** — `npm test -- test/core/templates/change-review.test.ts` expected: pass before edits.
3. **Step 3: Implement Task 2.2** — Add common gap: behavioral change missing a scan dimension (neither rule nor N/A). Add a Design convention check **Derived implications scan**: six dimensions; rule or N/A; optional `### Derived implications`; missing extra heading is **not a finding**; missing dimension → **WARNING**; **never BLOCKER solely for a derived-implication gap**; user-visible derived rule without delta-spec trace → **WARNING**. Keep Invariants missing-heading BLOCKER unchanged. Do not tell reviewers to re-run proposal review solely because these WARNINGs exist (already true for WARNINGs generally).
4. **Step 4: Run focused verification** — `rg -n "derived-implication gap|Derived implications scan" src/core/templates/workflows/change-review.ts` expected: matches. `npm test -- test/core/templates/change-review.test.ts` expected: existing tests pass; new asserts wait for 3.2.
5. **Step 5: Self-review and handoff** — Confirm BLOCKER still means “cannot implement / violates constraints”, and derived gaps cannot be the sole blocker. Pass the exact English phrases to task 2.3 for Chinese paraphrase.

#### Task 2.3: Align repo change-review skill

**Files:**
- Modify: `.vscode/important_skills/change-review/SKILL.md` — design convention section (Chinese file; keep equivalent contract)
- Test: `design-conventions.test.ts` repo-skill parity it-block

1. **Step 1: Write or extend focused tests** — Current test requires Chinese paraphrases plus shared anchors (`Pointer`, `视觉 DESIGN.md`). 3.1 will add scan-related Chinese or shared English anchors as needed without requiring word-for-word English.
2. **Step 2: Run the focused tests** — `npm test -- test/core/templates/design-conventions.test.ts` expected: pass before edit.
3. **Step 3: Implement Task 2.3** — After 2.2 lands, add the same severity contract: 闭集扫描、缺维度 WARNING、不得仅因推导缺口升 BLOCKER、缺少发明的一级标题不成问题、可观测推导未进 delta spec 为 WARNING. Keep existing Invariants BLOCKER wording. Do not translate in a way that makes derived gaps sound like blockers.
4. **Step 4: Run focused verification** — `rg -n "推导|WARNING|BLOCKER" .vscode/important_skills/change-review/SKILL.md` expected: scan section present; derived gap tied to WARNING. Existing parity test still pass.
5. **Step 5: Self-review and handoff** — Unit 2 complete. Note generated `.cursor/skills/superpowers-change-review` and `.codex/skills/...` are init projections; do not hand-edit them here (generation tests cover source templates).

### 3. Alignment tests

#### Task 3.1: Extend design-conventions tests

**Files:**
- Modify: `test/core/templates/design-conventions.test.ts`
- Test: this file

1. **Step 1: Write or extend focused tests** — Add asserts (this IS the test task):
   - Package template, schema design instruction, and schema.ts fallback contain all six dimension phrases and `### Derived implications`.
   - None of those sources contain a required `## Derived implications` as a top-level heading (`expect(content).not.toMatch(/^## Derived implications/m)` on the template; instruction says not to require it).
   - Propose templates contain derived-assumption summary, observable delta spec, and do-not-present-derived-as-user-Choice language.
   - Generated review templates contain WARNING-only derived-gap wording.
   - Keep `path.join(ROOT, 'schemas', 'spec-driven', 'templates', 'design.md')` and `path.join(ROOT, 'src', 'commands', 'schema.ts')` — never `'schemas/spec-driven/templates/design.md'` hardcoded as the only expected path string on Windows.
2. **Step 2: Run the focused tests** — `npm test -- test/core/templates/design-conventions.test.ts` expected: FAIL on new asserts until units 1–2 exist; after 1–2, expected PASS. If run after 1–2: pass.
3. **Step 3: Implement Task 3.1** — Insert the asserts into the existing it-blocks rather than duplicating file reads. Do not weaken Current system / Invariants / user-choice asserts.
4. **Step 4: Run focused verification** — `npm test -- test/core/templates/design-conventions.test.ts` expected: pass.
5. **Step 5: Self-review and handoff** — Confirm no `path.split('/')` assumptions.

#### Task 3.2: Extend change-review tests

**Files:**
- Modify: `test/core/templates/change-review.test.ts`
- Test: this file

1. **Step 1: Write or extend focused tests** — In the design-convention it-block, assert `Derived implications scan`, `derived-implication gap`, `WARNING`, and that the rubric contains a phrase equivalent to never BLOCKER solely for that gap (exact substring from 2.2). Assert `not a finding` still covers missing extra heading. Assert schema.yaml still has no `id: review` (existing test).
2. **Step 2: Run the focused tests** — `npm test -- test/core/templates/change-review.test.ts` expected: fail before 2.2, pass after.
3. **Step 3: Implement Task 3.2** — Add the expects next to the existing `principle-only` asserts so one it-block remains the design-convention contract.
4. **Step 4: Run focused verification** — `npm test -- test/core/templates/change-review.test.ts` expected: pass.
5. **Step 5: Self-review and handoff** — Confirm you did not require BLOCKER for derived gaps.

#### Task 3.3: Update skill-templates parity hashes

**Files:**
- Modify: `test/core/templates/skill-templates-parity.test.ts` — Propose content expects + `EXPECTED_FUNCTION_HASHES` / generated skill content hashes for propose and review templates
- Test: this file

1. **Step 1: Write or extend focused tests** — Add Propose expects: derived assumptions list, closed scan / six dimensions (or a stable shared phrase from 2.1), observable spec trace, derive-unless-boundary. Keep existing interview-gate expects. Hash objects will be updated in Step 3 after content is stable.
2. **Step 2: Run the focused tests** — `npm test -- test/core/templates/skill-templates-parity.test.ts` expected: FAIL on content expects until 2.1, then FAIL on hashes until this step updates them.
3. **Step 3: Implement Task 3.3** — After 2.1/2.2 strings are final, run the parity test once, copy the reported actual hashes into `EXPECTED_FUNCTION_HASHES` for `getSpProposeSkillTemplate`, `getSpProposeCommandTemplate`, `getChangeReviewSkillTemplate`, `getSpReviewCommandTemplate`, and into `EXPECTED_GENERATED_SKILL_CONTENT_HASHES` for `superpowers-propose` and `superpowers-change-review` (plus any generated command hashes the failure names). Do not change unrelated hashes.
4. **Step 4: Run focused verification** — `npm test -- test/core/templates/design-conventions.test.ts test/core/templates/change-review.test.ts test/core/templates/skill-templates-parity.test.ts` expected: pass on macOS, Linux, and Windows because paths in these tests already use `path.join`.
5. **Step 5: Self-review and handoff** — Report pass output. Unit 3 complete. Coordinator then runs full `npm test` once after integration (evidence belongs in `test-plan.md` Test Hardening, not as a fourth dispatch unit).

## Spec coverage check

| Requirement | Dispatch unit |
| --- | --- |
| Closed implication scan (six dimensions, rule or N/A, no extra required heading) | 1.1–1.3, 2.1–2.2, 3.1 |
| Existing headings + agent-owned labeling, never user Choice | 1.1, 1.2, 2.1, 3.1 |
| Observable derived rules trace to delta specs | 2.1, 2.2, 3.1–3.2 |
| Derive unless boundary; interview on trust/public-contract | 2.1, 3.1, 3.3 |
| Pre-confirmation summary lists derived assumptions | 2.1, 3.1, 3.3 |
| Change-review WARNING only; never BLOCKER solely for derived gap | 2.2, 2.3, 3.2 |
| Convention sources aligned; no validate parser; platform-neutral tests | 1.3, 3.1–3.3 |

No TBD/TODO placeholders. No orphan tasks. No new CLI types. `docs/workflows.md` is intentionally untouched (Non-Goal).
