## Context

Apply currently finishes Test Hardening, then serializes four Final Quality Gates: code review → Simplify → Verify → Design verify. Both Hardening and Verify embed `getCanonicalNonVisualSuiteInstructions`, so Verify always re-runs Git-aware even when Simplify was a no-op. Git-aware unavailable is recorded and must not fail-close to a complete suite (I2 from `slim-agent-instruction-ceremony`), but agents still waste a full suite pass as “being thorough,” and Hardening can run `--changed` before `full-qa-test` writes new tests.

This change keeps the four gates and the two test layers. It changes **when** they run and **when** Git-aware is allowed to execute.

## Current system

`/sp:apply` reads `src/core/templates/workflows/apply-change.ts`. After tasks complete, Test Hardening invokes `full-qa-test`, then interpolates `getCanonicalNonVisualSuiteInstructions('Test Hardening')` and `getManualCoverageInstructions('Test Hardening')`. `agent-browser` rows stay `planned` until Verify.

`getFinalQualityGateInstructions()` in `final-quality-gates.ts` requires gates **in exactly this order**, each a fresh worker, and forbids starting a later gate before the current worker finishes. Missing spawn uses labeled `same-context fallback` (not `blocked`). Code review and Verify retry on P0 up to four rounds; Simplify is one pass then Verify; Design verify retries only itself.

`/sp:verify` always runs the canonical preflight again, then completeness / correctness / coherence, including deferred `agent-browser` rows.

`using-superpowers` still advertises the sequential order `code review → Simplify → Verify → Design Verify`.

The gap: serialization and mandatory second preflight dominate wall-clock on instruction-only changes; Hardening Git-aware can miss tests that Hardening itself just added.

### Relationship to existing tech

| Existing capability | Relation | Pointer | Note |
|---|---|---|---|
| Final Quality Gates helper | extend | `src/core/templates/workflows/final-quality-gates.ts` `getFinalQualityGateInstructions` | Replace sequential must-order with parallel pre-Verify wave |
| Canonical suite preflight | extend | `getCanonicalNonVisualSuiteInstructions` | Order vs full-qa-test; unavailable default; exceptional complete suite |
| Apply Hardening | extend | `apply-change.ts` step 8 | full-qa-test then Git-aware; no layer dedup |
| Verify skill | extend | `verify-change.ts` correctness | Reuse Hardening suite evidence when diff/baseline unchanged |
| Work-mode router | extend | `skills/using-superpowers/SKILL.md`, `skills/subagent-driven-development/SKILL.md`, `docs/concepts.md` | Update advertised gate order |
| slim-agent sequential FQG SHALL | supersede after that change lands | slim-agent `propose-and-apply-autonomy` “in that order” / “integrate each report before starting the next gate” | This change’s parallel wave replaces that sequential four-gate chain. Sequential CR → Simplify → DV remains only as spawn-absent `same-context fallback`, then Verify. Do not ship a second `propose-and-apply-autonomy` delta (that capability is not on master until slim-agent archives). |
| slim-agent Verify always Git-aware | supersede for Apply-FQG only | slim-agent `sp-verify-skill` / `test-scope-selection` “SHALL run Git-aware” | Two-layer split and no-default-complete-suite stay. Apply-FQG Verify may reuse Hardening evidence on zero implementation diff; standalone `/sp:verify` still always preflights. |
| slim-agent I2 complete-suite ban | reuse | slim-agent `test-scope-selection` / I2 | Keep; this change’s I5 is the same ban plus exceptional `ran-complete-suite-optional`. This change’s I2 is a different invariant (Verify withheld while pre-Verify P0 remains). |

## Goals / Non-Goals

**Goals:**

- Cut Apply FQG wall-clock by overlapping code review, Simplify, and Design verify when spawn exists.
- Keep CR/DV P0 retries inside that wave, in parallel, until none of the three reports P0, then run Verify.
- Make Hardening Git-aware see tests that Hardening just added.
- Stop complete-suite default when Git-aware is unavailable.
- Avoid a second Git-aware run at Verify when nothing implementation-shaped changed.

**Non-Goals:**

- Deduplicating Git-aware execution with `test-plan` rows (user locked two layers, no dedup).
- Changing Manual Coverage split (`agent-browser` still Verify-only).
- Removing `full-qa-test` / 10→10→10 from Hardening.
- Editing `.cursor/skills/full-qa-test/SKILL.md`.
- New CLI flags, artifact graph membership, or a fifth FQG row.
- Making standalone `/sp:verify` depend on an Apply Hardening record.

## Decisions

### 1. Pre-Verify parallel wave and P0 retry

**Problem:** Sequential CR → Simplify → Verify → DV wastes time; P0 retry policy after a parallel wave needed an explicit product choice.

**User selection:** Code review, Simplify, and Design verify run in parallel when subagents can be spawned, then one Verify. After a Code review or Design verify P0 is repaired, continue that wave in parallel until none of the three gates reports P0; only then enter Verify. Options shown: (A) one-shot CR/DV then Verify with no CR/DV retry; (B) parallel first wave then sequential 1–4 retries per gate; (C) other. The user chose a parallel retry loop, not A or B as written.

| Option | Speed | CR/DV P0 coverage | Wall-clock risk |
|---|---|---|---|
| A. One-shot then Verify | Highest | Verify is the only re-inspection | Weaker CR/DV |
| B. Parallel first wave, then sequential 1–4 | Medium | Strong | Serial retries return |
| C. Repair P0 and keep retrying unresolved gates in parallel until three have no P0, then Verify | High when spawn works | CR/DV keep 1–4 | Coordinator must not re-run already-clear siblings without cause |

**Choice:** C (user).

**Trade-offs / cost:** Code review may inspect the pre-Simplify tree on wave 1; Simplify edits are caught by Verify and by Git-aware re-run when implementation changed. Already-passed Design verify is re-run if Simplify or a later repair changed UI-owned paths since DV’s last completed round; otherwise a passed/`not applicable` sibling is not re-run just because CR retried. Round-four P0 still fails that gate and blocks Verify. “Until none of the three reports P0” uses CR/DV defect P0 plus Simplify’s `passed`/`failed`/`blocked`/`not applicable` vocabulary — Simplify is not a P0-round gate.

**Mapping:** Spawn three workers on the post-Hardening snapshot. Integrate the wave. If Simplify changed UI-owned paths, re-run Design verify before treating DV as clear. If CR P0 and/or DV P0 remain, remediations for CR P0/P1, repair, spawn the next round(s) together. Simplify stays one pass from the first wave; `failed`/`blocked` Simplify pauses Apply. Verify starts only when CR has no P0, Simplify passed, DV passed or N/A. Verify rounds 1–4 unchanged except suite reuse.

**Worked example:** Wave 1 returns CR P0, Simplify passed (no edits), DV `not applicable`. Coordinator writes RM-1, repairs, spawns CR round 2 only. CR round 2 has no P0 and the repair did not change implementation → Verify round 1 reuses Hardening `ran-git-aware`; still runs deferred `agent-browser` if any. If that CR repair *did* change implementation, Verify re-runs Git-aware.

### 2. Two layers, no execution dedup

**Problem:** Git-aware and `test-plan` rows overlap in files.

**User selection:** Keep both layers; do not dedupe.

**Choice:** Both layers always execute when applicable. One command log cannot close the other layer.

**Rationale:** The user rejected evidence-reuse as a simplification. Dedup would hide an unexecuted `test-plan` row behind `--changed`. Cost is a second run of overlapping unit files; accepted.

### 3. Hardening order: full-qa-test then Git-aware

**Problem:** `--changed` before new tests land misses Hardening’s own cases.

**User selection:** Expand and land 10→10→10 first, then Git-aware.

**Choice:** Apply Hardening text orders: analyze gaps → invoke `full-qa-test` / fallback and write tests → then canonical Git-aware preflight → then Manual Coverage (except `agent-browser`).

### 4. Unavailable Git-aware: record, do not run complete suite

**Problem:** Agents treat unavailable/empty/ambiguous Git-aware as fail-closed complete suite.

**User selection:** Default is stop at the recording. Complete suite only if the user asks, CI already requires that complete command, or related selection is empty **and** emptiness is not expected **and** no focused command can be constructed. Optional complete-suite runs get a distinct identifier so they cannot masquerade as `ran-git-aware`.

**Choice:** Default `git-aware-unavailable-recorded` (or `empty-expected` when the owned diff has no runtime surface). Identifier `ran-complete-suite-optional` only for the listed exceptions. Never instruct “if unavailable, run the complete suite to pass.”

### 5. Verify Git-aware reuse

**Problem:** Verify always re-runs canonical preflight.

**User selection:** Zero subsequent implementation diff reuses Hardening `ran-git-aware` (or the recorded limitation) and still executes deferred `agent-browser`. The earlier shorthand “only Simplify or a Verify repair” is incomplete: any gate that changed implementation counts.

**Choice:** One closed rule. Apply-FQG Verify reads the Hardening suite-stage record, then `git diff` of implementation since that record, plus whether the Git baseline changed. **Reuse** when implementation and baseline are both unchanged. **Re-run** Git-aware (or record the limitation) when code review, Design verify, Simplify, or a Verify repair changed implementation, or the baseline changed. Reuse never skips Verify-owned `test-plan.md` rows or deferred `agent-browser`. Standalone `/sp:verify` always preflights (no Hardening dependency).

### 6. Spawn-absent fallback (agent-owned)

**Problem:** Parallel is impossible without spawn.

| Option | Faithfulness | Speed |
|---|---|---|
| A. Sequential CR, Simplify, DV, then Verify, labeled `same-context fallback` | Preserves listed order | Slow |
| B. Fake parallel in one context | Misleading | None |

**Choice:** A. User said parallel **if** subagents can be dispatched. Sequential listed order preserves determinism and I3. Do not mark `blocked` for missing spawn.

**Rationale:** B would claim `fresh-worker` falsely. A loses wall-clock but keeps the same gate set and P0 retry rules (retry CR/DV until no P0, then Verify).

## Contracts

### API / CLI

N/A — no CLI flag or JSON field change. Instruction-string contracts only.

### States

Suite-stage identifiers (non-`test-plan` layer):

| State | Meaning |
|---|---|
| `ran-git-aware` | Related tests ran; selection non-empty |
| `git-aware-unavailable-recorded` | Unsupported, baseline unclear, or empty/ambiguous; not a Hardening failure by itself |
| `git-aware-empty-expected` | Supported Git-aware; empty selection; owned diff has no runtime surface |
| `ran-complete-suite-optional` | Exceptional complete suite; never the default unavailable path |

FQG table still has four rows. Pre-Verify evidence MUST record `wave` / `round` and `fresh-worker` vs `same-context fallback`. Verify rows still record suite-stage state and whether evidence was reused.

Gate lifecycle: `planned` → parallel/sequential pre-Verify integration → Verify 1–4 → archive-ready when CR passed (no P0), Simplify passed, Verify passed, DV passed or N/A.

### Errors

- Missing spawn → `same-context fallback`, not `blocked`.
- Empty Git-aware on runtime-bearing diff, no focused command, user did not ask for complete suite → record unavailable; `test-plan` rows still required; do not pass the Git-aware layer.
- Complete suite used as default unavailable fallback → defect against this change.
- Starting Verify while CR/DV still reports P0 → defect.
- Deduping Git-aware and `test-plan` execution → defect.

## Invariants

| ID | Invariant | How to falsify | Owner test / check |
|---|---|---|---|
| I1 | When spawn exists, Apply MUST NOT require code review, Simplify, and Design verify to finish one-after-another before the next of those three starts. | Instructions still say “exactly this order” for those three, or “do not start a later gate before the current worker has completed” applying to CR vs Simplify vs DV. | `final-quality-gates` / apply-autonomy pin |
| I2 | Verify MUST NOT start while code review or Design verify still reports P0, or while Simplify is `failed`/`blocked`. (FQG withhold — not slim-agent’s complete-suite I2; that ban is this change’s I5.) | Instructions start Verify immediately after Hardening or after only one of the three. | same |
| I3 | Hardening MUST run `full-qa-test` expansion before Git-aware. | Git-aware paragraph still precedes full-qa-test invoke. | apply Hardening pin |
| I4 | Git-aware and registered `test-plan` rows both remain required; one run does not close the other layer. | Instructions say Git-aware evidence may satisfy `TC-*` rows. | suite-stage pin |
| I5 | Unavailable/empty/ambiguous Git-aware MUST NOT default to a complete canonical suite. | “Run the complete suite as a pass” or fail-closed complete suite remains. | `getCanonicalNonVisualSuiteInstructions` pin |
| I6 | Apply-FQG Verify MUST reuse Hardening suite-stage evidence (`ran-git-aware`, recorded limitation, or `ran-complete-suite-optional`) when implementation and baseline are unchanged, MUST re-run preflight when CR/DV/Simplify/Verify-repair changed implementation or the baseline changed, and MUST still run Verify-owned `test-plan` rows and deferred `agent-browser` rows. | Verify still always “runs the canonical preflight again” with no reuse clause, or reuses after an implementation/baseline change. | verify-change pin |

## Attachments

None.

## Risks / Trade-offs

- [CR wave-1 sees pre-Simplify code] → Verify is the integrated correctness gate; Git-aware re-runs if Simplify edited.
- [P0 repair races with in-flight siblings] → Integrate the wave before repairs; do not repair while workers still running.
- [Optional complete-suite identifier tempts fail-closed] → Default copy MUST say do not run complete suite; identifier only for listed exceptions.
- [Standalone verify vs Apply FQG drift] → Standalone always preflights; reuse is Apply-FQG-only.

## Migration Plan

Instruction and generated-projection update via the existing TS → Cursor path. No data migration. In-flight applies that already started a sequential FQG continue that run; new Apply invocations use the parallel wave.

## Open Questions

None — remaining product forks were closed by the user (no layer dedup; parallel wave; P0 retries stay parallel until three have no P0; then Verify; Git-aware reuse; full-qa then Git-aware; no default complete suite).
