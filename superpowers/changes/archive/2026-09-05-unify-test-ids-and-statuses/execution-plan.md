## Dependent Files Analysis

**Files to modify:**
- `schemas/spec-driven/templates/test-plan.md`
- `schemas/spec-driven/templates/remediations.md`
- `schemas/spec-driven/schema.yaml`
- `src/commands/schema.ts`
- `src/core/templates/workflows/apply-change.ts`
- `src/commands/workflow/instructions.ts` (strings only)
- `skills/full-qa-test/SKILL.md`
- `test/commands/schema.test.ts`
- `test/core/artifact-graph/instruction-loader.test.ts`
- `test/core/templates/invariants-remediations.test.ts`
- `test/core/templates/skill-templates-parity.test.ts`
- Optionally assert alias set in an existing instructions/apply test

## Dispatch Coordination

| Unit | Scope | Ownership | Dependencies | Assignee policy | Parallel | Handoff |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Templates + schema | `schemas/`, `src/commands/schema.ts` | None | execute inline | No | Updated writer contract |
| 2 | Guidance + skill | `src/core/templates/`, `instructions.ts`, `skills/full-qa-test` | Unit 1 | execute inline | No | Matching apply/skill text |
| 3 | Tests | `test/` | Units 1–2 | execute inline | No | Green suite |

## Dispatch Execution

### 1. Templates and schema contract

#### Task 1.1–1.4: Template alignment

1. **Step 1: Write or extend focused tests** — Update pins that expect `planned / covered / passed / failing` to the new placeholder string; expect Manual `ID` and `RM-1`.
2. **Step 2: Run focused tests** — Expect red on old strings.
3. **Step 3: Implement** — Rewrite test-plan template/scaffold/schema instructions; remediations `## RM-1`.
4. **Step 4: Run focused verification** — Schema + instruction-loader + remediations tests pass.
5. **Step 5: Self-review** — Confirm no normative `covered`/`failing` in new placeholders.

### 2. Workflow guidance and skill notes

#### Task 2.1–2.3: Guidance

1. **Step 1:** Parity test expects `failed` (and optionally `blocked`) instead of requiring `failing` as incomplete marker; assert alias set still contains `covered`.
2. **Step 2:** Red/green on parity.
3. **Step 3:** Update apply-change + instructions strings; add short full-qa-test note for MC IDs and status.
4. **Step 4:** Parity passes; `COMPLETE_TEST_PLAN_STATUSES` unchanged.
5. **Step 5:** Handoff to Unit 3.

### 3. Tests

#### Task 3.1–3.3: Verification

1. **Step 1:** Ensure tests cover I1–I4 and alias compatibility.
2. **Step 2:** `npm test` focused paths.
3. **Step 3:** Fix any remaining pins / hash parity.
4. **Step 4:** `npm run build`, `npm run lint`, `npm test`.
5. **Step 5:** Record evidence in test-plan.
