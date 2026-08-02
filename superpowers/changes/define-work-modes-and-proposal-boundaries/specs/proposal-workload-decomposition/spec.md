## ADDED Requirements

### Requirement: Proposal Workload SHALL Be Estimated Across Six Dimensions
Before deciding how many Proposals to create for a large request, the agent SHALL estimate each logical capability across implementation surface, layer breadth, behavior complexity, verification cost, orchestration cost, and context churn. Each dimension SHALL use a 0–3 qualitative score, and the resulting bands SHALL be treated as calibration guidance rather than a file-count-only rule: `0–5` small, `6–10` medium, `11–14` large, and `15+` very large.

#### Scenario: A capability has a bounded workload
- **WHEN** a capability scores within the small or medium band and its combined request remains within a practical Proposal budget
- **THEN** the agent SHALL normally keep it in one Proposal with other compatible small or medium capabilities
- **AND** it SHALL record the relevant Dispatch Units inside that Proposal instead of creating one Proposal per capability or file

#### Scenario: A capability has a large workload
- **WHEN** a capability scores in the large band
- **THEN** the agent SHALL assess whether it can fit within a Proposal budget of roughly 14 points, 3–5 Dispatch Units, and 2–3 dependency waves
- **AND** it SHALL not add another large capability merely because both could theoretically ship together

### Requirement: Multiple Small Features MAY Share One Proposal
The agent SHALL keep multiple small or medium fixes/features in one Proposal when their combined workload fits the budget, they can share a coherent acceptance narrative, and no high-risk contract or lifecycle boundary requires separation.

#### Scenario: Small fixes touch different domains
- **WHEN** a canvas-generation bug and a notification-stall bug are both small, together fit the workload budget, and need no separate release or environment coordination
- **THEN** the agent SHALL create one Proposal for the combined work
- **AND** it SHALL divide the implementation into Dispatch Units only if ownership or dependency boundaries require it

#### Scenario: Small fixes have a high-risk boundary
- **WHEN** a small-looking fix changes authentication, authorization, persistence, migration, billing, or data recovery behavior
- **THEN** the agent SHALL use a Proposal even if the score is small
- **AND** it MAY still combine other small compatible fixes in the same Proposal when the combined workload remains bounded

### Requirement: Multiple Large Capabilities SHALL Be Split Before Dispatch-Unit Planning
When a request contains two or more genuinely large capabilities, the agent SHALL normally create separate bounded Proposals before dividing each Proposal into Dispatch Units. The split SHALL be based primarily on workload/context protection, while preserving explicit dependency and stable-interface information between Proposals.

#### Scenario: Two new capabilities are both large
- **WHEN** a new project contains a large canvas-management capability and a large message-notification capability
- **THEN** the agent SHALL normally create one Proposal per large capability
- **AND** it SHALL not create a single giant Proposal merely because the capabilities belong to the same project

#### Scenario: A large capability has a small companion fix
- **WHEN** one capability is large but an adjacent fix is small and does not add a separate coordination or verification burden
- **THEN** the agent MAY keep the companion fix in the large capability's Proposal
- **AND** it SHALL not split solely because the companion touches a different feature name

### Requirement: A Very Large Capability SHALL Use Stable Milestones or an Explicit Single-Change Exception
When one capability scores very large, the agent SHALL look for independently testable, coherent milestones. It SHALL create staged Proposals when those milestones are stable; if no stable boundary exists, it SHALL keep one Proposal with explicit staged Dispatch Units and SHALL not add other large capabilities to it.

#### Scenario: A large feature has stable foundations
- **WHEN** a feature can be divided into a testable foundation contract, a core flow, and later UI/integration work
- **THEN** the agent SHALL create ordered Proposals for those milestones
- **AND** each Proposal SHALL state its prerequisite and the stable handoff it provides

#### Scenario: A large feature cannot be made coherent in stages
- **WHEN** splitting the feature would leave every intermediate state untestable or misleading
- **THEN** the agent SHALL keep one Proposal
- **AND** it SHALL use Dispatch Units and dependency waves inside that Proposal while documenting the exception

### Requirement: Change Proposals and Dispatch Units SHALL Have Different Boundaries
A Change Proposal SHALL represent an agent context/workload and archive boundary. A Dispatch Unit SHALL represent a logical ownership, dependency, and safe-parallelism boundary inside a Proposal. Dispatch Units SHALL not be treated as live agent identities, checkbox-sized timeboxes, or independently archivable changes.

#### Scenario: One capability spans several technical layers
- **WHEN** one capability requires schema, backend, frontend, and integration work
- **THEN** the agent SHALL keep one Proposal when the capability fits its workload budget
- **AND** it MAY create several Dispatch Units for ownership and dependency control

#### Scenario: A Dispatch Unit cannot be independently accepted
- **WHEN** a unit only provides an implementation slice with no independent user outcome, release, rollback, or acceptance criteria
- **THEN** it SHALL remain inside its parent Proposal
- **AND** it SHALL not become a separate Proposal solely to assign it to a different worker

### Requirement: Long-Running Proposal Sets SHALL Preserve Explicit Dependencies
When a large request is split into multiple Proposals, each Proposal SHALL record its relationship to the others using explicit dependency, prerequisite, unblocks, and stable-interface information. Shared foundation work SHALL become its own Proposal only when it is substantial and independently testable; otherwise it SHALL belong to the first dependent Proposal.

#### Scenario: A consumer depends on a contract Proposal
- **WHEN** a UI Proposal depends on a stable API Proposal
- **THEN** the UI Proposal SHALL identify the API Proposal as a prerequisite and name the consumed contract
- **AND** the agent SHALL not start parallel implementation against an unstable or unintegrated contract

#### Scenario: Two Proposals have disjoint ownership
- **WHEN** two bounded Proposals have no unmet dependency and no shared mutable ownership
- **THEN** the coordinator MAY execute them in parallel
- **AND** it SHALL serialize them when integration or shared files create a new dependency

