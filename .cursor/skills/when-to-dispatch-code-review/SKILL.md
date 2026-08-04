---
name: when-to-dispatch-code-review
description: Decide when to dispatch host-native code review across Direct Modification, standalone Subagent-Driven Development, and Proposal → Review → Apply. Use at meaningful delivery boundaries, for risky or merge-ready work, or when a user requests review, while avoiding duplicate per-task, per-batch, or Apply reviews.
---

# When to Dispatch Code Review

Dispatch code review at a meaningful delivery boundary where a reviewer can assess the complete integrated risk. Use the host's native reviewer or code-review capability; this skill does not define a `/sp:code-review` workflow.

## Select the Timing by Work Mode

### Direct Modification

Dispatch review when one or more of these conditions apply:

- The user explicitly requests review.
- A major feature or high-risk fix reaches a coherent delivery boundary.
- The change is ready to merge or hand off.
- A complex bug or refactor needs independent scrutiny after the direct scope remains within its allowed boundary.

If investigation reveals a security boundary, migration, public contract, new capability, or other Proposal trigger, stop direct edits and promote the work to **Proposal → Review → Apply** before dispatching its final review. Those boundaries are not direct-delivery exceptions.

Small, local, low-risk edits do not require automatic review unless the user asks for it or repository policy requires it.

### Subagent-Driven Development

Workers verify and self-review their own complete Dispatch Units. SDD does not own a separate complete review after unit integration. When SDD runs through `/sp:apply`, hand off to Apply's Test Hardening and ordered Final Quality Gates; Apply's Host-native code review is the single integrated code-review boundary. Do not dispatch complete reviews per task, per unit, or around the Apply gate.

### Proposal → Review → Apply

Proposal review checks the artifacts before implementation; it is not implementation code review. During `/sp:apply`, Apply owns the mandatory host-native code-review gate after Test Hardening and before Simplify, Verify, and Design Verify. Do not add a generic per-task, per-unit, or per-batch review on top of Apply's final gate, and do not duplicate Apply's severity or retry policy here.

## Dispatch an Integrated Target

Provide the reviewer:

- What was implemented and the behavior that should result.
- The applicable requirements, Proposal artifacts, or direct-work acceptance criteria.
- The complete integrated diff or explicit owned paths; include base/head SHAs when available.
- Reports from integrated Dispatch Units and relevant interaction boundaries.
- Fresh test, build, lint, E2E, or manual evidence already collected.
- Known constraints, intentional deferrals, and the active workflow's severity scale.

Do not ask a final reviewer to assess an isolated checkbox when the readiness claim covers a broader integrated change.

Use [code-reviewer.md](code-reviewer.md) as a portable prompt when the host does not already provide an equivalent structured review request.

## Ownership and Feedback

The reviewer is read-only by default: it inspects and reports strengths, evidence, severity-classified findings, and readiness. The coordinator evaluates the findings against codebase reality and the requirements, then repairs every accepted resolvable issue and runs relevant verification. A host-native reviewer may self-repair only when the active workflow explicitly authorizes that capability.

Use `receiving-code-review` behavior when feedback is unclear, technically unsupported, or conflicts with the requirements. Clarify or reject it with evidence instead of applying it blindly.

## Avoid Duplicate Review

- Do not create or expect a Superpowers `/sp:code-review` command.
- Do not schedule reviews by a fixed task count.
- Do not add a standalone SDD complete final review around the Apply gate.
- Do not add another generic review before or after Apply's mandatory final code-review gate.
- Do not confuse worker self-review or Proposal review with the independent integrated code review.
