## Testing Gap Analysis

Prior coverage proves change-review loop mechanics, skill parity hashes, and schema artifact wiring, but it does **not** lock design skeleton quality (Current system, Contracts, pointers), scale-aware option comparison, or visual DESIGN.md citation rules. This change is almost entirely markdown/instruction surface area: tests should pin **normative strings and section headings** and review criteria, not invent E2E propose runs.

Worker-level tests in the execution plan cover red/green for each file touch. Test Hardening below is the integrated contract after units merge.

## Requirement And Scenario Coverage Matrix

| Requirement / Scenario | Planned Coverage | Status | Notes |
| --- | --- | --- | --- |
| Design template exposes Current system and Contracts / Template skeleton lists the new sections | unit | covered | `test/core/templates/design-conventions.test.ts` reads package template |
| Design template / Small change may use short Current system | unit | covered | Template + instruction allow short; no runtime enforce (by design) |
| Design instruction defines Current system / Relationship pointer | unit | covered | schema.yaml instruction string asserts |
| Forbidden bare reuse language | unit (review criteria) | covered | change-review template + design-conventions + change-review.test.ts |
| Design instruction defines Contracts / API field change | unit | covered | instruction + template Contracts |
| Contracts / No contract surface N/A | unit | covered | `N/A — no API/state/error surface change` in template/instruction/review |
| Scale-aware decision comparisons / Major three-option | unit | covered | schema instruction + explore + review |
| Scale-aware / Minor skips triple | unit | covered | review criteria: Minor / not a finding for triple options |
| Explore hands off major options | unit | covered | explore skill + command templates; no remaining `2-3 approaches` |
| Visual DESIGN.md distinct / UI cites | unit | covered | instruction + review WARNING language |
| Visual rules change updates DESIGN.md | unit | covered | instruction/tasks expectation in review text |
| Non-UI ignores missing DESIGN.md | unit | covered | review criteria `not a finding` / skill `不成问题` |
| No visual DESIGN.md on UI change | unit | covered | instruction note de facto CSS/components |
| Schema fallback aligned | unit | covered | schema.ts `case 'design'` string asserts |
| Review enforces Current system and Contracts | unit | covered | change-review.test.ts + design-conventions |
| Review Contracts N/A accepted | unit | covered | criteria text |
| Review enforces reuse pointers | unit | covered | criteria text + Pointer / relation set |
| Review major without comparison | unit | covered | ≥3 options criteria |
| Review minor without comparison passes | unit | covered | Minor not forced through triple tables |
| Review UI omits DESIGN.md WARNING | unit | covered | criteria text |
| Review non-UI without DESIGN.md | unit | covered | not a finding |
| Skill parity repo vs generated | unit | covered | skill-templates-parity hashes updated for explore + change-review |

## Boundary And Abnormal Case Sweep

| Surface | Cases To Attack | Coverage Decision | Status |
| --- | --- | --- | --- |
| Inputs and validation | N/A — no new CLI parsers | not applicable | not applicable |
| State and repeat actions | Review still ephemeral; no review.md | unit assert existing lines remain | covered |
| Permissions and ownership | N/A | not applicable | not applicable |
| Filesystem and paths | Template paths portable; no hardcoded slash logic added | not applicable for new code | not applicable |
| External and integration points | No @google/design.md dependency introduced | unit/grep Non-Goal; package.json unchanged | covered |

## Non-Critical Path Sweep

| Path | Why It Matters | Coverage / Rationale |
| --- | --- | --- |
| Onboard design skeleton still old | Slight doc drift vs schema | Deferred (Non-Goal docs/onboard) |
| continue-change one-liner about design.md | Soft guidance only | Deferred; not normative vs schema instruction |
| Case-insensitive DESIGN.md vs design.md | FS ambiguity | Instruction wording lists both casings; review criteria note identity file |

## Deferred Or Manual Coverage

| Gap | Reason Deferred | Safer Alternative / Follow-Up |
| --- | --- | --- |
| Full `/sp:propose` E2E producing a compliant design.md | Heavy; nondeterministic agent | Unit string contracts + human propose smoke later |
| Real google-labs lint in CI | Out of scope dependency | Optional project-level follow-up |
| Engineering living-doc bridge | Explicit Non-Goal | Future change |

## Test Hardening Record

| Item | Result |
| --- | --- |
| Earlier test gaps | No unit pins for Current system / Contracts / Relationship pointers, major≥3 explore handoff, visual DESIGN.md review rules, or schema-init design fallback skeleton |
| Tests added/strengthened | Added `test/core/templates/design-conventions.test.ts` (6 cases). Extended `change-review.test.ts` with design-convention criteria. Updated explore/review parity hashes in `skill-templates-parity.test.ts` |
| Targeted vitest after implementation | `npx vitest run test/core/templates/design-conventions.test.ts test/core/templates/change-review.test.ts test/core/templates/skill-templates-parity.test.ts test/commands/schema.test.ts test/core/artifact-graph/schema.test.ts` → **54 passed** |
| Parity hash updated | Yes — `getExploreSkillTemplate`, `getSpExploreCommandTemplate`, `getChangeReviewSkillTemplate`, `getSpReviewCommandTemplate`, `superpowers-explore`, `superpowers-change-review` |
| package.json dependency scan for @google/design.md | **Absent** (no `@google/design` in package manifests) |
| Deferrals | Onboard/continue soft docs; full propose E2E; google-labs CI lint; living-doc bridge — all documented Non-Goals or heavy/nondeterministic |
| Code-review follow-up | Strengthened explore command major≥3 Ending; fallback + Attachments/Migration/Open Questions + minor decision placeholder; template minor section; dual-source review anchors; section-order asserts |
