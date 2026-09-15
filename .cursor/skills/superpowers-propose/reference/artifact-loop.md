# Artifact generation loop

Read this file after authorized create, once the change directory exists and `superpowers status` has returned the artifact build order. If this file is missing, report the stage `blocked` with the missing path; do not skip.

4. **Create artifacts in sequence until apply-ready**

   A host todo or progress tool is optional bookkeeping, not a required loop. Missing TodoWrite is not a reason to stop or wait.

   Loop through artifacts in dependency order (artifacts with no pending dependencies first):

   a. **For each artifact that is `ready` (dependencies satisfied)**:
      - Get instructions:
        ```bash
        superpowers instructions <artifact-id> --change "<name>" --json
        ```
      - The instructions JSON includes:
        - `context`: Project background (constraints for you - do NOT include in output)
        - `rules`: Artifact-specific rules (constraints for you - do NOT include in output)
        - `template`: The structure to use for your output file
        - `instruction`: Schema-specific guidance for this artifact type
        - `outputPath`: Where to write the artifact
        - `dependencies`: Completed artifacts to read for context
      - Read any completed dependency files for context
      - Create the artifact file using `template` as the structure
      - Apply `context` and `rules` as constraints - but do NOT copy them into the file
      - Show brief progress: "Created <artifact-id>"

   b. **Continue until all `applyRequires` artifacts are complete**
      - After creating each artifact, re-run `superpowers status --change "<name>" --json`
      - Check if every artifact ID in `applyRequires` has `status: "done"` in the artifacts array
      - Stop when all `applyRequires` artifacts are done

   c. **If an artifact requires user input** (unclear context):
      - Use AskUserQuestion to clarify when available. If AskUserQuestion is unavailable, ask the clarification in ordinary conversation and wait for the answer.
      - Then continue with creation
