# Dispatch units

Load this file when executing Apply dispatch units. The Apply root names this path; it does not inline the assignment loop.

Treat a heading `# <number>. <scope>` as a logical dispatch-unit boundary, not a live subagent identity. Detailed checkboxes track progress; a complete dispatch unit is the unit of dispatch, handoff, and integration.

Give each worker that unit's ownership, task text, and the spec/design slices it cites. Do not require reading every change artifact before the first unit. Use `execution-plan.md` for ownership, dependencies, and safe parallelism. Read existing `Implementation Notes` as non-normative context. Keep `tasks.md` as the only progress source.

The coordinator may assign one unit to one subagent, combine compatible units, or execute all units sequentially. Inline execution is valid when the host cannot spawn a worker; do not block the unit on missing spawn.

The worker implements every detailed checkbox in the block, runs the planned checks, self-reviews, and reports changed files, verification, and concerns. After each Step 1–5, the worker may append concise `Implementation Notes` directly below the step. The coordinator reviews those notes against the diff and planned verification before marking detailed checkboxes.

Dispatch in parallel only when the execution plan declares disjoint ownership and no unmet dependency. Serialize writes to shared `execution-plan.md`. Workers may return notes to the coordinator for append after handoff.

After units integrate, continue Apply at Test Hardening using `reference/test-hardening.md`. Do not dispatch a separate complete review before or after Apply's code-review gate.

Notes are non-normative. Do not overwrite another dispatch unit's notes. Capture Findings, Reasoning, Viewpoints / Trade-offs, and Summary / Takeaway when useful. The coordinator reviews notes against the diff before marking detailed checkboxes.
