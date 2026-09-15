# Remediations

## RM-1 — OpenCode companions skip hyphen command transform

**Meta:** code review wave-1 / CR round 1 · P1 · resolved

### Finding

`writeGeneratedSkill` applies `transformInstructions` only to `SKILL.md`. Stage companions (`reference/*.md`) are written as raw `ref.content`, so OpenCode still sees `/sp:simplify` / `/sp:verify` / `/sp:design-verify` in Hardening/FQG/Verify companions after those recipes moved out of the root.

### Root cause

Companions used to live inside the skill/command root string, which OpenCode already transformed. Stage-file disclosure split them into `template.references` without threading the same transformer through `writeFile` for those paths.

### Solutions (compare ≥2)

| Solution | Approach | Pros | Cons |
|---|---|---|---|
| A. Transform each `ref.content` with the same `transformInstructions` callback before write | One code path; OpenCode hyphen rules stay identical to the root | Small, matches existing adapter contract | Every tool that passes a transformer also rewrites companions (desired) |
| B. Keep colon slash in companions and tell OpenCode agents to read generated commands instead | No write-path change | Breaks OpenCode when the companion is the stage recipe; reintroduces host-specific wording in TS | |

### Choice and rationale (重点)

**Choice:** A

A preserves the dual-projection rule: the same TypeScript recipe is emitted, then host-adapted. B would make companions a second, unadapted contract after the split, which is the defect. Cloning the OpenCode adapter into each reference getter would duplicate `/sp:` replacement and drift from `transformToHyphenCommands`.

### Fix

`src/core/shared/skill-generation.ts` `writeGeneratedSkill` runs `transformInstructions` on each reference body. Guard: unit write plus OpenCode init fixture asserting companions contain `/sp-` and not `/sp:`.

### Guard and evidence

- **Guard:** `writeGeneratedSkill` transforms companion content (`stage-file-disclosure` `applies the host transformer to companion files`); OpenCode init companion has no `/sp:` (`init` `transforms OpenCode apply companions`)
- **Evidence:** `pnpm exec vitest run test/core/stage-file-disclosure.test.ts test/core/init.test.ts test/core/update.test.ts test/core/instruction-ownership-collapse.test.ts test/core/using-superpowers-guidance.test.ts` — passed after the fix

## RM-2 — Update leaves dest-only host-map and debug debris

**Meta:** code review wave-1 / CR round 1 · P2 · resolved

P2-only findings do not require a remediations entry; this one is recorded because the coordinator accepted the repair in the same round as RM-1.

### Finding

`removeObsoleteBundledSkillDirs` only deletes retired skill directories. `copyDir` / `fs.cp` do not delete extra files already installed under live skill dirs, so `codex-tools.md` / `CREATION-LOG.md` / `test-pressure-*.md` can survive `superpowers update`.

### Root cause

R13 cleanup targeted the source tree and whole-dir retirement, not dest-only files inside still-shipped skills.

### Solutions (compare ≥2)

| Solution | Approach | Pros | Cons |
|---|---|---|---|
| A. Named obsolete-file list removed after copy | Precise, testable, matches the known debris | Must be kept in sync if more debris appears | |
| B. Delete every dest file not present in the bundled source skill tree | Fully general dest sync | Risk of wiping user-added files under skill dirs | |

### Choice and rationale (重点)

**Choice:** A

A matches the change's explicit debris set. B is a broader product decision about user overlays and is out of this change's A/B/C scope.

### Fix

`OBSOLETE_BUNDLED_SKILL_FILES` plus `removeObsoleteBundledSkillFiles` after bundled copy in init and update.

### Guard and evidence

- **Guard:** update test plants leftover host-map/debug files and asserts they are gone (`removes leftover host-map and debug debris from installed live skills`)
- **Evidence:** same focused vitest run as RM-1, passed

## RM-3 — Commands-only delivery omitted stage companions

**Meta:** Verify round 1 · P1 · resolved

### Finding

After the Apply/Propose/Verify split, command files are indexes that point at `reference/*.md`. `delivery: 'commands'` skipped `writeGeneratedSkills` and deleted generated skill dirs, so Hardening/FQG companions never exist and Apply reports `blocked`.

### Root cause

Commands-only previously relied on self-contained command files. Stage-file disclosure moved recipes into skill companions without a commands-only emit path.

### Solutions (compare ≥2)

| Solution | Approach | Pros | Cons |
|---|---|---|---|
| A. Still write templates that have `references` after commands-only skill removal | Keeps slash commands as indexes; honors R6 emit; explore/other catalog skills stay gone | Leaves three skill dirs in commands-only installs | |
| B. Inline recipes back into command files when delivery is commands | No skill dirs | Forks skill vs command contracts; fights Decision 3 | |

### Choice and rationale (重点)

**Choice:** A

A keeps one recipe tree and still emits companions. B would re-dump FQG into command files for one delivery mode and drift from the skill projection.

### Fix

`companionSkillTemplates` filters apply/propose/verify; init/update write those after removing other generated skills when delivery is commands.

### Guard and evidence

- **Guard:** init/update `delivery: 'commands'` fixtures assert explore skill is absent and Apply `reference/test-hardening.md` exists with `full-qa-test`
- **Evidence:** `pnpm exec vitest run test/core/stage-file-disclosure.test.ts test/core/init.test.ts test/core/update.test.ts` passed after the fix

## RM-4 — Commands-only drift treats required companions as leftovers

**Meta:** Verify round 2 · P1 · resolved

### Finding

`hasToolProfileOrDeliveryDrift` treated any generated skill directory as drift when `delivery === 'commands'`. After RM-3 those apply/propose/verify companion dirs are required, so a correct install never reaches the up-to-date early return.

### Root cause

Drift detection still encoded the pre-split contract “commands-only means zero workflow skill dirs.”

### Solutions (compare ≥2)

| Solution | Approach | Pros | Cons |
|---|---|---|---|
| A. Allow `companionSkillTemplates` dirs; still flag other catalog skills and missing companions | Aligns emit + drift | Drift code knows companion names | |
| B. Stop using skill-dir existence for commands-only drift | Avoids false positives | Would miss leftover explore/review skills | |

### Choice and rationale (重点)

**Choice:** A

A is the dual of RM-3. B would leave dest-only catalog skills undetected.

### Fix

`profile-sync-drift.ts` commands-only branch uses allowed companion dirs from `companionSkillTemplates(getSkillTemplates(desiredWorkflows))`.

### Guard and evidence

- **Guard:** `does not treat Apply/Propose/Verify companions as commands-only drift`; missing companions still drift; leftover explore still drift
- **Evidence:** `pnpm exec vitest run test/core/profile-sync-drift.test.ts test/core/init.test.ts test/core/update.test.ts test/core/stage-file-disclosure.test.ts` passed after the fix


