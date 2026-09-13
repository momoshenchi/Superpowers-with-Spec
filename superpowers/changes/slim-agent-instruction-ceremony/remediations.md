# Remediations

## RM-1 — SDD description is still an independent entry trigger

**Meta:** Verify round 1 · P1 · resolved

### Finding

`skills/subagent-driven-development/SKILL.md` YAML `description` still says “Use when executing implementation plans with independent tasks in the current session”. R8 forbids SDD as an independent implementation entry skill; R1 loads skills from descriptions, so hosts can still open SDD outside `/sp:apply`.

### Root cause

Task 1.5 shrank the body to Apply dispatch guidance and added “This skill is Apply dispatch guidance only”, but left the discovery `description` as a generic plan-execution trigger.

### Solutions (compare ≥2)

| Solution | Approach | Pros | Cons |
|---|---|---|---|
| A. Narrow YAML description to Apply `/sp:apply` dispatch only; keep in-skill Work Mode block | Fixes discovery trigger; existing Work Mode pins stay green | Does not remove coordinator reminder already inside Apply | Work Mode still restates using-superpowers for readers already in the skill |
| B. Narrow description **and** delete the Work Mode block | Stronger “only router is using-superpowers” | Breaks `subagent-work-package-guidance` pins that this change still owns; Task 1.5 did not require deleting Work Mode |

### Choice and rationale (重点)

**Choice:** A

The defect that makes SDD an independent **entry** is the YAML description, not the in-skill Work Mode reminder. B would fight owner tests that still require Work Mode and would exceed Task 1.5. A closes R8’s “not an independent implementation entry skill” at the load trigger.

### Fix

Rewrite `skills/subagent-driven-development/SKILL.md` `description` so it triggers on Apply dispatch-unit execution during `/sp:apply`, and pin that in `test/core/sdd-guidance.test.ts`. Sync the `.cursor/skills` copy.

### Guard and evidence

- **Guard:** `test/core/sdd-guidance.test.ts` asserts description mentions `/sp:apply` and no longer matches `independent tasks in the current session`
- **Evidence:** `pnpm exec vitest run test/core/sdd-guidance.test.ts test/core/subagent-work-package-guidance.test.ts` — 7 tests passed. `.cursor/skills/subagent-driven-development/SKILL.md` synced.
