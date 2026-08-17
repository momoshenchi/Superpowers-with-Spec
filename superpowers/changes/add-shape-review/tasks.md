# 1. Shape-review workflow surface and registries

## Templates and explicit ID maps

- [ ] 1.1 Add `src/core/templates/workflows/shape-review.ts` with the `/sp:shape-review` skill and command plus two exports: the full review contract (scope, four always-run angles, read-only review, `simplify`/`structural`/`skip` classification, fail-closed session routing, report schema) and a short apply invitation-plus-handoff fragment. Do not copy the four-angle checklists into apply.
- [ ] 1.2 Export the new templates from `src/core/templates/skill-templates.ts` and register workflow ID `shape-review`, skill dir `superpowers-shape-review`, and command id `shape-review` by explicit lookup in skill generation, `ALL_WORKFLOWS`, `SKILL_NAMES`, `COMMAND_IDS`, `WORKFLOW_TO_SKILL_DIR`, init/update/migration maps, and config prompt metadata. Do not add it to `CORE_WORKFLOWS`.
- [ ] 1.3 Add focused generation, profile, drift, and adapter tests proving core omits the command, custom selection emits `/sp:shape-review` across supported tools using `path.join`, and deselection removes the named skill and command files.

# 2. Apply invitation and embedded contract

## Completion path

- [ ] 2.1 Update both `/sp:apply` template variants so successful final-quality completion invites `/sp:archive` and optional `/sp:shape-review`, states that saying you want a shape review in this conversation is enough if the command is not installed, states that shape-review does not block archive, and does not add a fifth Final Quality Gates row.
- [ ] 2.2 Import the Unit 1 apply fragment into apply so a same-session invitation can run without the standalone workflow installed, including fail-closed session routing, slash-after-apply remaining same-session, in-place expansion that withdraws archive, `/sp:review` before implementing spec/design expansion, and new-session change creation.
- [ ] 2.3 Add template-parity tests for the invitation copy (including host-neutral acceptance language), non-gate behavior, pause/failure omitting the invitation, core-profile embedded-contract availability, slash-after-apply staying in-session, and in-place expansion withdrawing archive until gates re-run.

# 3. Documentation and integration

## User-facing behavior and regression safety

- [ ] 3.1 Update `docs/commands.md`, `docs/workflows.md`, and `docs/supported-tools.md` to describe `/sp:shape-review`, distinguish it from `/sp:review` / `/sp:simplify` / `/sp:design-verify`, add `shape-review` / `superpowers-shape-review` to custom lists only, and document the apply invitation plus session routing.
- [ ] 3.2 Refresh parity hashes/snapshots and registry tests after Units 1–2 integrate; confirm no core-profile install and no generated `code-review` identifier.
- [ ] 3.3 Run focused workflow/registry/docs tests, then `pnpm run build`, `pnpm run lint`, and the full test suite, including cross-platform path assertions; record quality-gate evidence in `test-plan.md`.
