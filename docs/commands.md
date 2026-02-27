# Commands

This is the reference for Superpowers's slash commands. These commands are invoked in your AI coding assistant's chat interface (e.g., Claude Code, Cursor, Windsurf).

For workflow patterns and when to use each command, see [Workflows](workflows.md). For CLI commands, see [CLI](cli.md).

## Quick Reference

### Default Quick Path (`core` profile)

| Command | Purpose |
|---------|---------|
| `/sp:propose` | Create a change and generate planning artifacts in one step |
| `/sp:explore` | Think through ideas before committing to a change |
| `/sp:apply` | Implement tasks from the change |
| `/sp:archive` | Archive a completed change |

### Expanded Workflow Commands (custom workflow selection)

| Command | Purpose |
|---------|---------|
| `/sp:new` | Start a new change scaffold |
| `/sp:continue` | Create the next artifact based on dependencies |
| `/sp:ff` | Fast-forward: create all planning artifacts at once |
| `/sp:verify` | Validate implementation matches artifacts |
| `/sp:sync` | Merge delta specs into main specs |
| `/sp:bulk-archive` | Archive multiple changes at once |
| `/sp:onboard` | Guided tutorial through the complete workflow |

The default global profile is `core`. To enable expanded workflow commands, run `superpowers config profile`, select workflows, then run `superpowers update` in your project.

---

## Command Reference

### `/sp:propose`

Create a new change and generate planning artifacts in one step. This is the default start command in the `core` profile.

**Syntax:**
```text
/sp:propose [change-name-or-description]
```

**Arguments:**
| Argument | Required | Description |
|----------|----------|-------------|
| `change-name-or-description` | No | Kebab-case name or plain-language change description |

**What it does:**
- Creates `superpowers/changes/<change-name>/`
- Generates artifacts needed before implementation (for `spec-driven`: proposal, specs, design, tasks)
- Stops when the change is ready for `/sp:apply`

**Example:**
```text
You: /sp:propose add-dark-mode

AI:  Created superpowers/changes/add-dark-mode/
     ✓ proposal.md
     ✓ specs/ui/spec.md
     ✓ design.md
     ✓ tasks.md
     Ready for implementation. Run /sp:apply.
```

**Tips:**
- Use this for the fastest end-to-end path
- If you want step-by-step artifact control, enable expanded workflows and use `/sp:new` + `/sp:continue`

---

### `/sp:explore`

Think through ideas, investigate problems, and clarify requirements before committing to a change.

**Syntax:**
```
/sp:explore [topic]
```

**Arguments:**
| Argument | Required | Description |
|----------|----------|-------------|
| `topic` | No | What you want to explore or investigate |

**What it does:**
- Opens an exploratory conversation with no structure required
- Investigates the codebase to answer questions
- Compares options and approaches
- Creates visual diagrams to clarify thinking
- Can transition to `/sp:propose` (default) or `/sp:new` (expanded workflow) when insights crystallize

**Example:**
```text
You: /sp:explore

AI:  What would you like to explore?

You: How should we handle authentication for the mobile app?

AI:  Let me investigate your current auth setup...
     [Analyzes codebase]

     I see you're using session-based auth for the web app.
     For mobile, we have three main options:

     1. JWT tokens (stateless, works offline)
     2. OAuth2 (if you need third-party login)
     3. Extend current sessions (simpler, but requires connectivity)

     Your API already has CORS configured. Which direction interests you?

You: Let's go with JWT. Can we start a change for that?

AI:  Ready when you are. Run /sp:propose add-jwt-auth to begin.
```

**Tips:**
- Use when requirements are unclear or you need to investigate
- No artifacts are created during exploration
- Good for comparing multiple approaches before deciding
- Can read files and search the codebase

---

### `/sp:new`

Start a new change scaffold. Creates the change folder and waits for you to generate artifacts with `/sp:continue` or `/sp:ff`.

This command is part of the expanded workflow set (not included in the default `core` profile).

**Syntax:**
```
/sp:new [change-name] [--schema <schema-name>]
```

**Arguments:**
| Argument | Required | Description |
|----------|----------|-------------|
| `change-name` | No | Name for the change folder (prompted if not provided) |
| `--schema` | No | Workflow schema to use (default: from config or `spec-driven`) |

**What it does:**
- Creates `superpowers/changes/<change-name>/` directory
- Creates `.superpowers.yaml` metadata file in the change folder
- Shows the first artifact template ready for creation
- Prompts for change name and schema if not provided

**What it creates:**
```
superpowers/changes/<change-name>/
└── .superpowers.yaml    # Change metadata (schema, created date)
```

**Example:**
```
You: /sp:new add-dark-mode

AI:  Created superpowers/changes/add-dark-mode/
     Schema: spec-driven

     Ready to create: proposal
     Use /sp:continue to create it, or /sp:ff to create all artifacts.
```

**Tips:**
- Use descriptive names: `add-feature`, `fix-bug`, `refactor-module`
- Avoid generic names like `update`, `changes`, `wip`
- Schema can also be set in project config (`superpowers/config.yaml`)

---

### `/sp:continue`

Create the next artifact in the dependency chain. Creates one artifact at a time for incremental progress.

**Syntax:**
```
/sp:continue [change-name]
```

**Arguments:**
| Argument | Required | Description |
|----------|----------|-------------|
| `change-name` | No | Which change to continue (inferred from context if not provided) |

**What it does:**
- Queries the artifact dependency graph
- Shows which artifacts are ready vs blocked
- Creates the first ready artifact
- Reads dependency files for context
- Shows what becomes available after creation

**Example:**
```
You: /sp:continue

AI:  Change: add-dark-mode

     Artifact status:
     ✓ proposal    (done)
     ◆ specs       (ready)
     ◆ design      (ready)
     ○ tasks       (blocked - needs: specs)

     Creating specs...

     [Reads proposal.md, creates specs based on requirements]

     ✓ Created superpowers/changes/add-dark-mode/specs/ui/spec.md

     Now available: tasks
     Run /sp:continue to create the next artifact.
```

**Tips:**
- Use when you want to review each artifact before proceeding
- Good for complex changes where you want control
- Multiple artifacts may become ready simultaneously
- You can edit created artifacts before continuing

---

### `/sp:ff`

Fast-forward through artifact creation. Creates all planning artifacts at once.

**Syntax:**
```
/sp:ff [change-name]
```

**Arguments:**
| Argument | Required | Description |
|----------|----------|-------------|
| `change-name` | No | Which change to fast-forward (inferred from context if not provided) |

**What it does:**
- Creates all artifacts in dependency order
- Tracks progress via todo list
- Stops when all `apply-required` artifacts are complete
- Reads each dependency before creating the next artifact

**Example:**
```
You: /sp:ff add-dark-mode

AI:  Fast-forwarding add-dark-mode...

     ✓ Creating proposal.md
     ✓ Creating specs/ui/spec.md
     ✓ Creating design.md
     ✓ Creating tasks.md

     All planning artifacts complete!
     Ready for implementation. Run /sp:apply to begin.
```

**Tips:**
- Use when you have a clear picture of what you're building
- Faster than `/sp:continue` for straightforward changes
- You can still edit artifacts afterward
- Good for small to medium features

---

### `/sp:apply`

Implement tasks from the change. Works through the task list, writing code and checking off items.

**Syntax:**
```
/sp:apply [change-name]
```

**Arguments:**
| Argument | Required | Description |
|----------|----------|-------------|
| `change-name` | No | Which change to implement (inferred from context if not provided) |

**What it does:**
- Reads `tasks.md` and identifies incomplete tasks
- Works through tasks one by one
- Writes code, creates files, runs tests as needed
- Marks tasks complete with checkboxes `[x]`

**Example:**
```
You: /sp:apply

AI:  Implementing add-dark-mode...

     Reading tasks.md:
     - [ ] 1.1 Create ThemeContext
     - [ ] 1.2 Add CSS custom properties
     - [ ] 1.3 Implement localStorage persistence

     Working on 1.1: Create ThemeContext...
     [Creates src/context/ThemeContext.tsx]

     ✓ 1.1 Complete

     Working on 1.2: Add CSS custom properties...
     [Updates src/styles/globals.css]

     ✓ 1.2 Complete
     ...
```

**Tips:**
- Can resume where you left off if interrupted
- Use for parallel changes by specifying the change name
- Completion state is tracked in `tasks.md` checkboxes

---

### `/sp:verify`

Validate that implementation matches your change artifacts. Checks completeness, correctness, and coherence.

**Syntax:**
```
/sp:verify [change-name]
```

**Arguments:**
| Argument | Required | Description |
|----------|----------|-------------|
| `change-name` | No | Which change to verify (inferred from context if not provided) |

**What it does:**
- Checks three dimensions of implementation quality
- Searches codebase for implementation evidence
- Reports issues categorized as CRITICAL, WARNING, or SUGGESTION
- Does not block archive, but surfaces issues

**Verification dimensions:**

| Dimension | What it validates |
|-----------|-------------------|
| **Completeness** | All tasks done, all requirements implemented, scenarios covered |
| **Correctness** | Implementation matches spec intent, edge cases handled |
| **Coherence** | Design decisions reflected in code, patterns consistent |

**Example:**
```
You: /sp:verify

AI:  Verifying add-dark-mode...

     COMPLETENESS
     ✓ All 8 tasks in tasks.md are checked
     ✓ All requirements in specs have corresponding code
     ⚠ Scenario "System preference detection" has no test coverage

     CORRECTNESS
     ✓ Implementation matches spec intent
     ✓ Edge cases from scenarios are handled
     ✓ Error states match spec definitions

     COHERENCE
     ✓ Design decisions reflected in code structure
     ✓ Naming conventions consistent with design.md
     ⚠ Design mentions "CSS variables" but implementation uses Tailwind classes

     SUMMARY
     ─────────────────────────────
     Critical issues: 0
     Warnings: 2
     Ready to archive: Yes (with warnings)

     Recommendations:
     1. Add test for system preference detection
     2. Update design.md to reflect Tailwind usage, or refactor to use CSS variables
```

**Tips:**
- Run before archiving to catch mismatches early
- Warnings don't block archive but indicate potential issues
- Good for reviewing AI's work before committing
- Can reveal drift between artifacts and implementation

---

### `/sp:sync`

**Optional command.** Merge delta specs from a change into main specs. Archive will prompt to sync if needed, so you typically don't need to run this manually.

**Syntax:**
```
/sp:sync [change-name]
```

**Arguments:**
| Argument | Required | Description |
|----------|----------|-------------|
| `change-name` | No | Which change to sync (inferred from context if not provided) |

**What it does:**
- Reads delta specs from change folder
- Parses ADDED/MODIFIED/REMOVED/RENAMED sections
- Merges changes into main `superpowers/specs/` directory
- Preserves existing content not mentioned in delta
- Does not archive the change (remains active)

**Example:**
```text
You: /sp:sync

AI:  Syncing add-dark-mode delta specs...

     Reading: superpowers/changes/add-dark-mode/specs/ui/spec.md
     Target:  superpowers/specs/ui/spec.md

     Changes to apply:
     ✓ ADDED: Theme Selection requirement (2 scenarios)
     ✓ ADDED: Accessibility requirement (1 scenario)

     Merging...
     ✓ superpowers/specs/ui/spec.md updated

     Change remains active. Run /sp:archive when ready to complete.
```

**When to use manually:**

| Scenario | Use sync? |
|----------|-----------|
| Long-running change, want specs in main before archiving | Yes |
| Multiple parallel changes need the updated base specs | Yes |
| Want to preview/review the merge separately | Yes |
| Quick change, going straight to archive | No (archive handles it) |

**Tips:**
- Sync is intelligent, not copy-paste
- Can add scenarios to existing requirements without duplicating
- Change stays active after sync (not archived)
- Most users will never need to call this directly—archive prompts if needed

---

### `/sp:archive`

Archive a completed change. Finalizes the change and moves it to the archive folder.

**Syntax:**
```
/sp:archive [change-name]
```

**Arguments:**
| Argument | Required | Description |
|----------|----------|-------------|
| `change-name` | No | Which change to archive (inferred from context if not provided) |

**What it does:**
- Checks artifact completion status
- Checks task completion (warns if incomplete)
- Offers to sync delta specs if not already synced
- Moves change folder to `superpowers/changes/archive/YYYY-MM-DD-<name>/`
- Preserves all artifacts for audit trail

**Example:**
```text
You: /sp:archive

AI:  Archiving add-dark-mode...

     Artifact status:
     ✓ proposal.md exists
     ✓ specs/ exists
     ✓ design.md exists
     ✓ tasks.md exists (8/8 tasks complete)

     Delta specs: Not yet synced
     → Sync now? (recommended)

You: Yes

AI:  ✓ Synced specs to superpowers/specs/ui/spec.md
     ✓ Moved to superpowers/changes/archive/2025-01-24-add-dark-mode/

     Change archived successfully.
```

**Tips:**
- Archive won't block on incomplete tasks, but will warn
- Delta specs can be synced during archive or beforehand
- Archived changes are preserved for history
- Use `/sp:verify` first to catch issues

---

### `/sp:bulk-archive`

Archive multiple completed changes at once. Handles spec conflicts between changes.

**Syntax:**
```
/sp:bulk-archive [change-names...]
```

**Arguments:**
| Argument | Required | Description |
|----------|----------|-------------|
| `change-names` | No | Specific changes to archive (prompts to select if not provided) |

**What it does:**
- Lists all completed changes
- Validates each change before archiving
- Detects spec conflicts across changes
- Resolves conflicts by checking what's actually implemented
- Archives in chronological order

**Example:**
```
You: /sp:bulk-archive

AI:  Found 3 completed changes:
     - add-dark-mode (8/8 tasks complete)
     - fix-login-bug (3/3 tasks complete)
     - update-footer (2/2 tasks complete)

     Checking for spec conflicts...
     ⚠ add-dark-mode and update-footer both touch specs/ui/

     Inspecting codebase to resolve...
     Both changes are implemented. Will merge in chronological order:
     1. add-dark-mode (created Jan 20)
     2. update-footer (created Jan 22)

     Archive all 3 changes?

You: Yes

AI:  ✓ Archived add-dark-mode
     ✓ Archived fix-login-bug
     ✓ Archived update-footer
     Specs merged: add-dark-mode → update-footer
```

**Tips:**
- Good for parallel work streams
- Conflict resolution is agentic (checks codebase)
- Changes are archived in order of creation
- Prompts before overwriting spec content

---

### `/sp:onboard`

Guided onboarding through the complete Superpowers workflow. An interactive tutorial using your actual codebase.

**Syntax:**
```
/sp:onboard
```

**What it does:**
- Walks through a complete workflow cycle with narration
- Scans your codebase for real improvement opportunities
- Creates an actual change with real artifacts
- Implements actual work (small, safe changes)
- Archives the completed change
- Explains each step as it happens

**Phases:**
1. Welcome and codebase analysis
2. Finding an improvement opportunity
3. Creating a change (`/sp:new`)
4. Writing the proposal
5. Creating specs
6. Writing the design
7. Creating tasks
8. Implementing tasks (`/sp:apply`)
9. Verifying implementation
10. Archiving the change
11. Summary and next steps

**Example:**
```
You: /sp:onboard

AI:  Welcome to Superpowers!

     I'll walk you through the complete workflow using your actual codebase.
     We'll find something small to improve, create a proper change for it,
     implement it, and archive it.

     Let me scan your codebase for opportunities...

     [Analyzes codebase]

     I found a few things we could work on:
     1. Add input validation to the contact form
     2. Improve error messages in the auth flow
     3. Add loading states to async buttons

     Which interests you? (or suggest something else)
```

**Tips:**
- Best for new users learning the workflow
- Uses real code, not toy examples
- Creates a real change you can keep or discard
- Takes 15-30 minutes to complete

---

## Command Syntax by AI Tool

Different AI tools use slightly different command syntax. Use the format that matches your tool:

| Tool | Syntax Example |
|------|----------------|
| Claude Code | `/sp:propose`, `/sp:apply` |
| Cursor | `/sp-propose`, `/sp-apply` |
| Windsurf | `/sp-propose`, `/sp-apply` |
| Copilot (IDE) | `/sp-propose`, `/sp-apply` |
| Trae | Skill-based invocations such as `/superpowers-propose`, `/superpowers-apply-change` (no generated `sp-*` command files) |

The intent is the same across tools, but how commands are surfaced can differ by integration.

> **Note:** GitHub Copilot commands (`.github/prompts/*.prompt.md`) are only available in IDE extensions (VS Code, JetBrains, Visual Studio). GitHub Copilot CLI does not currently support custom prompt files — see [Supported Tools](supported-tools.md) for details and workarounds.

---

## Legacy Commands

These commands use the older "all-at-once" workflow. They still work but OPSX commands are recommended.

| Command | What it does |
|---------|--------------|
| `/superpowers:proposal` | Create all artifacts at once (proposal, specs, design, tasks) |
| `/superpowers:apply` | Implement the change |
| `/superpowers:archive` | Archive the change |

**When to use legacy commands:**
- Existing projects using the old workflow
- Simple changes where you don't need incremental artifact creation
- Preference for the all-or-nothing approach

**Migrating to OPSX:**
Legacy changes can be continued with OPSX commands. The artifact structure is compatible.

---

## Troubleshooting

### "Change not found"

The command couldn't identify which change to work on.

**Solutions:**
- Specify the change name explicitly: `/sp:apply add-dark-mode`
- Check that the change folder exists: `superpowers list`
- Verify you're in the right project directory

### "No artifacts ready"

All artifacts are either complete or blocked by missing dependencies.

**Solutions:**
- Run `superpowers status --change <name>` to see what's blocking
- Check if required artifacts exist
- Create missing dependency artifacts first

### "Schema not found"

The specified schema doesn't exist.

**Solutions:**
- List available schemas: `superpowers schemas`
- Check spelling of schema name
- Create the schema if it's custom: `superpowers schema init <name>`

### Commands not recognized

The AI tool doesn't recognize Superpowers commands.

**Solutions:**
- Ensure Superpowers is initialized: `superpowers init`
- Regenerate skills: `superpowers update`
- Check that `.claude/skills/` directory exists (for Claude Code)
- Restart your AI tool to pick up new skills

### Artifacts not generating properly

The AI creates incomplete or incorrect artifacts.

**Solutions:**
- Add project context in `superpowers/config.yaml`
- Add per-artifact rules for specific guidance
- Provide more detail in your change description
- Use `/sp:continue` instead of `/sp:ff` for more control

---

## Next Steps

- [Workflows](workflows.md) - Common patterns and when to use each command
- [CLI](cli.md) - Terminal commands for management and validation
- [Customization](customization.md) - Create custom schemas and workflows
