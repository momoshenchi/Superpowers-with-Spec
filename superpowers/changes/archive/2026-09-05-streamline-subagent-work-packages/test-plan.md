## Testing Gap Analysis

Existing tests prove that `execution-plan.md` participates in the artifact graph and that schema init creates the selected templates, but they assert the prior micro-step/test-review wording rather than work-package coordination. Existing generated-workflow parity checks also still expect onboarding language about TDD steps and a test-review gate. This change must prove the replacement wording without weakening artifact dependencies, task progress tracking, or post-implementation Test Hardening.

Worker-local tests and self-review validate individual work packages during implementation. This plan records the final hardening and integrated verification after those packages are merged; passing focused tests alone is not sufficient for completion.

## Requirement And Scenario Coverage Matrix

| Requirement / Scenario | Planned Coverage | Status | Notes |
| --- | --- | --- | --- |
| Logical work-package execution: dispatching a whole work package | static contract test | passed | `test/core/subagent-work-package-guidance.test.ts` proves complete-block dispatch. |
| Flexible work-package allocation: main agent executes all blocks | static contract test | passed | Guidance contract proves inline sequential execution and logical labels. |
| Flexible work-package allocation: one subagent receives multiple blocks | static contract test | passed | Guidance contract proves compatible work packages may be combined. |
| Work-package syntax and legacy task lists | static contract and artifact-template tests | passed | Contract and schema/template assertions cover the exact grammar and safe one-package fallback. |
| Single final integration review: detailed task completion | static contract test | passed | Contract rejects per-checkbox/two-stage review wording. |
| Single final integration review: after integration and fixes | static contract test | passed | Contract and final diff review confirm one integrated review with targeted verification after findings. |
| Execution plan owns coordination and per-task execution: safe parallel work | unit/integration | passed | `test/core/artifact-graph/instruction-loader.test.ts` covers coordination, Step 1–5 detail, and final validation. |
| Work-package task-list convention: generated block | unit/integration | passed | Schema and scaffold tests cover numbered agent/work-package headings with detailed checkboxes. |
| Execution-plan coordination guidance: generated plan | unit/integration | passed | Instruction-loader and generated-template parity tests require Step 1–5 detail while rejecting the former per-step test-review gate and 2–5 minute delegation rule. |
| Schema init work-package templates: selected artifacts | CLI integration | passed | `test/commands/schema.test.ts` inspects scaffolded tasks and execution-plan templates. |

## Boundary And Abnormal Case Sweep

| Surface | Cases To Attack | Coverage Decision | Status |
| --- | --- | --- | --- |
| Task ownership | One block, several blocks to one worker, all blocks inline, overlapping files | Source/instruction assertions plus final review | passed |
| Dependencies | Independent blocks, a dependent validation block, an unplanned overlap | Template/instruction assertions and final review | passed |
| Progress tracking | Headings plus detailed `- [ ] X.Y` entries, partial work-package completion | Existing parser regression plus focused artifact assertions | passed |
| Review timing | Individual checkbox finishes before integration; all blocks integrated | Source assertions for removed per-task review and added final review | passed |
| Filesystem and paths | Project-local schema template creation on Windows separators | Existing and extended schema-init tests use `path.join()` | passed |
| Generated instructions | Schema template, fallback template, proposal text, and onboarding wording disagree | Targeted parity and instruction-loader tests | passed |

## Non-Critical Path Sweep

| Path | Why It Matters | Coverage / Rationale |
| --- | --- | --- |
| Existing change folders with flat task lists | The new convention must not make existing change folders unreadable | Checkbox parser behavior is unchanged; guidance preserves flat lists as one sequential work package. |
| No-subagent execution | The agent labels must not force delegation | Guidance contract and final review confirm inline execution. |
| `writing-plan/SKILL.md` | Deliberately out of scope and must not be changed incidentally | Final diff review confirms no modification. |

## Deferred Or Manual Coverage

| Gap | Reason Deferred | Safer Alternative / Follow-Up |
| --- | --- | --- |
| Real concurrent subagent execution | The repository test suite does not run multiple live agents or worktrees | Review the ownership/dependency guidance and verify integration behavior through isolated worker assignments when the workflow is next exercised. |
