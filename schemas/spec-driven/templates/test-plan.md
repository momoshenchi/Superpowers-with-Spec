## Testing Gap Analysis

Analyze which earlier tests were still insufficient or not broad enough. Then describe which tests this Test Hardening stage added or strengthened, especially for boundary cases, abnormal/error cases, non-critical paths, empty/missing/invalid states, permissions/ownership, repeated actions, integration points, E2E workflows, and cross-platform path behavior where relevant.

Red tests in `execution-plan.md` drive the next implementation step before production code. Test Hardening in this `test-plan.md` supplements that earlier testing after implementation tasks are done. Passing task-level red tests is necessary but not sufficient for final apply completion.

Test Hardening is complete when every concrete test/status row in the tables below is complete. Use statuses such as `covered`, `passed`, or `not applicable` for completed rows. Leave rows as `planned`, `failing`, or blank until the coverage is actually complete.

## Requirement And Scenario Coverage Matrix

| Requirement / Scenario | Planned Coverage | Status | Notes |
| --- | --- | --- | --- |
| <!-- Requirement: Scenario --> | <!-- unit / integration / E2E / manual / not applicable --> | <!-- planned / covered / passed / failing / not applicable --> | <!-- test file, command, or rationale --> |

## Boundary And Abnormal Case Sweep

| Surface | Cases To Attack | Coverage Decision | Status |
| --- | --- | --- | --- |
| Inputs and validation | Empty, missing, invalid, min/max, malformed | <!-- planned coverage --> | <!-- planned / covered / passed / failing / not applicable --> |
| State and repeat actions | Repeated calls, idempotency, stale state, races | <!-- planned coverage --> | <!-- planned / covered / passed / failing / not applicable --> |
| Permissions and ownership | Unauthorized, denied, ambiguous ownership | <!-- planned coverage --> | <!-- planned / covered / passed / failing / not applicable --> |
| Filesystem and paths | Relative paths, nested paths, platform separators | <!-- planned coverage --> | <!-- planned / covered / passed / failing / not applicable --> |
| External and integration points | Network, storage, CLI, browser, service failures | <!-- planned coverage --> | <!-- planned / covered / passed / failing / not applicable --> |

## Non-Critical Path Sweep

| Path | Why It Matters | Coverage / Rationale |
| --- | --- | --- |
| <!-- fallback, warning, empty result, cleanup, logging, docs-only path --> | <!-- risk or user impact --> | <!-- automated test, manual check, or defer reason --> |

## Deferred Or Manual Coverage

| Gap | Reason Deferred | Safer Alternative / Follow-Up |
| --- | --- | --- |
| <!-- coverage gap --> | <!-- specific technical or scope reason --> | <!-- manual verification, narrower automated check, or follow-up --> |
