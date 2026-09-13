# Remediations

## RM-1 — Number Verify after the pre-Verify wave

**Meta:** code review / round 1 · P1 · resolved

### Finding

Numbered gate contracts listed Verify as item 3 and Design verify as item 4, which recreated the serial four-gate order the preamble forbids.

### Root cause

The parallel-wave preamble was added without reordering the existing 1–4 contracts, so a coordinator following numbers would start Verify before Design verify finished.

### Solutions (compare ≥2)

| Solution | Approach | Pros | Cons |
|---|---|---|---|
| A. Keep 1–4 numbers but add “numbers are not spawn order” | Minimal text | Easy to miss; numbers still look sequential | Weak |
| B. Renumber wave as 1 CR, 2 Simplify, 3 Design verify, then 4 Verify only after the wave is clear | Matches spawn order | Longer heading shuffle | Tests/parity must follow |

### Choice and rationale (重点)

**Choice:** B

A still invites numbered sequential dispatch. B makes the executable list match I1/I2.

### Fix

`final-quality-gates.ts` numbered contracts: 3 = Design verify, 4 = Verify after the wave. Generated apply projections refreshed.

### Guard and evidence

- **Guard:** `final-quality-gates.test.ts` asserts `3. **Design verify` appears before `4. **Verify`
- **Evidence:** focused vitest after repair

## RM-2 — Apply-FQG Verify Correctness must cite Hardening before Git-aware

**Meta:** code review / round 1 · P1 · resolved

### Finding

`/sp:verify` Correctness still interpolated the canonical Git-aware preflight unconditionally, so an Apply-FQG worker following Steps 1–7 would re-run Git-aware even on zero implementation diff.

### Root cause

Reuse language lived in Apply FQG Verify paragraph and later retry notes, not at the Correctness preflight that standalone and Apply workers both execute first.

### Solutions (compare ≥2)

| Solution | Approach | Pros | Cons |
|---|---|---|---|
| A. Duplicate the entire preflight helper for Apply-FQG only | Isolated | Two helpers drift | Maintenance |
| B. Prefix Correctness with the Apply-FQG closed reuse rule, keep standalone always-preflight | One helper | Workers read the guard before “Run the selected Git-aware command” | Prefix must not use the forbidden standalone phrase |

### Choice and rationale (重点)

**Choice:** B

A is extra architecture. B puts the closed rule on the path Apply workers actually run.

### Fix

`verify-change.ts` Correctness step: Apply-FQG cites unchanged Hardening evidence first; standalone still always runs the preflight block.

### Guard and evidence

- **Guard:** `final-quality-gates.test.ts` Apply instructions keep reuse; standalone `/sp:verify` still always preflights and does not contain `reuse Hardening suite-stage`
- **Evidence:** focused vitest after repair
