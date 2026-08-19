# Remediations

## R1 — Move boundary interview before confirmation

**Meta:** Verify round 1 · P1 · resolved

### Finding

Propose put “ask the user when a derived implication crosses a trust/public-contract boundary” in the After confirmation write paragraph, while the spec scenario **Boundary derivation is interviewed** requires the question before final confirmation.

### Root cause

The closed-scan write rules were appended to the existing post-confirmation routing paragraph, so interview timing was copied into the write path instead of the pre-summary interview path.

### Solutions (compare ≥2)

| Solution | Approach | Pros | Cons |
|---|---|---|---|
| A. Move derive-unless-boundary interview sentences to before the final summary / three-state gate; keep write/spec-trace after confirmation | Matches spec timing; small string move | Agents who only skim “After confirmation” lose the interview sentence there |
| B. Duplicate the interview sentence in both pre-summary and post-confirmation | Harder to miss | Two sources of truth; post-confirm interview contradicts the write boundary |
| C. Leave timing; treat as documentation only | Zero diff | Spec scenario stays wrong |

### Choice and rationale (重点)

**Choice:** A.

B still invites a post-confirm question after artifacts may be created. C leaves the spec fail-closed path unenforced. A keeps a single interview moment before confirm-and-create.

### Fix

- `src/core/templates/workflows/propose.ts` `PROPOSE_INTERVIEW_GUIDANCE`: interview sentences before the three-state gate; post-confirm paragraph keeps write/spec-trace only.

### Guard and evidence

- **Guard:** `expectProposeDerivedImplicationRules` plus ordering: interview trigger index < `1. Confirm and create`
- **Evidence:** `npm test -- test/core/templates/design-conventions.test.ts test/core/templates/change-review.test.ts test/core/templates/skill-templates-parity.test.ts` — 3 files, 29 tests passed

## R2 — Pin implementation-only mapping; drop false empty-reason coverage claim

**Meta:** Verify round 1 · P1 · resolved

### Finding

test-plan marked “Implementation-only mappings may stay in design.md” and “empty N/A with no reason → WARNING” as covered, but tests did not assert the mapping sentence, and the review rubric does not warn on empty-reason N/A (spec also does not require that).

### Root cause

Hardening rows were filled from nearby instruction prose without a matching `toContain` / rubric line.

### Solutions (compare ≥2)

| Solution | Approach | Pros | Cons |
|---|---|---|---|
| A. Add the mapping `toContain`; change the empty-reason boundary row to match the actual missing-dimension WARNING | Honest coverage; no extra review ceremony | Empty-reason ritual N/A stays a documented Risk, not a rubric finding |
| B. Add empty-reason WARNING to change-review plus tests | Matches design Risks | Spec does not require it; extra ceremony |
| C. Only rewrite test-plan, add no mapping assert | Fast | Mapping sentence can regress |

### Choice and rationale (重点)

**Choice:** A.

Spec review clauses cover missing dimension (no rule and no N/A), not empty-reason N/A. Pinning the mapping sentence closes the real hole; inventing an empty-reason BLOCKER/WARNING would expand scope.

### Fix

- `test/core/templates/design-conventions.test.ts`: assert `Implementation-only mappings may stay in design.md`
- `superpowers/changes/add-derived-design-implications/test-plan.md`: boundary row matches missing-dimension WARNING only

### Guard and evidence

- **Guard:** new `toContain` in `expectProposeDerivedImplicationRules`
- **Evidence:** same focused 29-test run passed after the mapping assert and hash update
