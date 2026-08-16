---
name: change-review
description: 用户在开始实现 Superpowers 变更前、希望审核变更提案完整性与可实施性时调用。
---

# Change Review

对 **Superpowers 变更提案**（`superpowers/changes/<name>/` 下的 artifacts）做实施前审查。目标是判断：提案是否完整、细节是否足够明晰、实现者能否 **无疑义** 开工。

## 角色

- **Coordinator**（运行 `/sp:propose` 或 `/sp:review` 的主 agent）：每轮 review 派遣 fresh subagent，**present the complete review report** 后再改 artifacts，**repair every resolvable BLOCKER**，仅在 BLOCKER 修复后 re-dispatch。宿主能 spawn subagent 时，不在 coordinator 上下文做维度审查。
- **Change reviewer**（fresh subagent）：只读审查 — 跑 CLI、读 artifacts、按四维度出报告。不改 proposal artifacts，不宣布 ready。

## 派遣

**每一轮 proposal review 必须派遣 one fresh subagent**（Task tool 或等价机制）。由 coordinator 自行决定 dispatch 的 subagent 类型与 prompt 内容；至少包含 change 名称与路径、只读 reviewer 角色、下方「Change reviewer procedure / 审查维度 / 输出格式」。

不得复用 review worker。宿主无法 spawn subagent 时，标记 proposal review `blocked` 并暂停；**不得**静默改为 coordinator 内联审查。

## 输入

1. 若用户未指定变更名，运行 `superpowers list --json`，列出可审查的 change，请用户选择。不要猜测。
2. 若用户给出变更名或路径，定位到 `superpowers/changes/<name>/`。
3. **识别 schema（必做）**：运行 `superpowers status --change "<name>" --json`，读取：
   - `schemaName`：当前 workflow（如 `spec-driven`、`test-harden`）
   - `applyRequires`：开工前必须完成的 artifact id 列表
   - `artifacts[]`：每个 artifact 的 `id`、`outputPath`、`status`
   - 也可从 `.superpowers.yaml` 的 `schema:` 字段交叉确认
4. **CLI 结构校验（必做）**：运行 `superpowers validate <name> --json`（或 `superpowers validate <name>`）。`validate` 按该 change 的 **schema 定义** 校验
   - `valid: true` → 结构层面通过，继续审内容质量
   - `valid: false` → 将 ERROR 级 issue 记为 BLOCKER；按 issue 修复，**不要**为无 `specs` 的 schema 补 delta
5. 只读取该 schema **要求或已生成** 的 artifacts，以及 `attachments/` 中被引用的附件。
6. 可选：对每个待审 artifact 运行 `superpowers instructions <artifact-id> --change "<name>" --json`，获取 `template`、`description` 作为章节完整性参考。
7. **仅当 schema 包含 `specs` artifact 时**，`Modified Capabilities` 才需对照 `superpowers/specs/<capability>/spec.md` 主 spec。

## 自动 Propose 审查与修复顺序（Coordinator loop）

当 `/sp:propose` 在所有 `applyRequires` artifact 完成后自动使用本 skill 时，严格执行：派遣 reviewer → **present the complete review report** → 按严重级别修复 → 仅在修复 BLOCKER 后 **re-dispatch a fresh reviewer** → 宣布 ready 或暂停。

- **正常最多两轮**（two rounds）：一轮 = 一次 fresh reviewer dispatch + 其报告。round 2 完成后仍有 unresolved BLOCKER 则暂停并报告，不得为继续修复 BLOCKER 开启第三轮或宣称 ready。
- **Infrastructure failure extension**（基础设施故障扩展）：若某轮因网络错误、子代理超时或未产出完整 review 报告而未能正常完成，可追加一轮 fresh reviewer，**绝对上限三轮**（three rounds total）。此扩展仅用于恢复未完成的 review，不得用于 round 2 完成后的额外 BLOCKER 修复循环。
- 每轮先 dispatch one fresh change reviewer subagent。
- 报告输出前不得修改因本次发现而需调整的 proposal artifacts。
- 报告后必须 **repair every resolvable BLOCKER**。WARNING 为建议修复：可在报告后修复，但本身不阻塞 ready。`SUGGESTION` findings are non-blocking，可保留在报告中。
- **re-run review only after repairing one or more BLOCKERs**（re-dispatch fresh reviewer，不得复用 worker）。不得仅因 WARNING/SUGGESTION 存在或已修复而重新跑完整 proposal review。
- 宣布 ready 的条件是 no unresolved BLOCKER；residual WARNING/SUGGESTION notes may remain visible。
- 若修复依赖用户、产品、安全、schema 或外部依赖决策，报告该 BLOCKER 并暂停；不得猜测或宣称 ready。
- Do not create `review.md`、approval metadata 或 review artifact。proposal review 是瞬态行为；`/sp:apply` does not automatically repeat proposal review。
- 本 skill 是实施前的 proposal review；实现完成后的全量验证由 `/sp:apply` 的 **Final Quality Gates** 负责

## 审查维度

从四个维度审查，每个问题标注严重级别：

| 级别 | 含义 |
|------|------|
| **BLOCKER** | 不解决就无法无疑义实现，或会直接导致实现偏离产品/架构约束 |
| **WARNING** | 可开工但高概率返工、遗漏或多人理解不一致 |
| **SUGGESTION** | 表述、结构或可维护性改进，不阻塞实现 |

## 1. 完整性（Completeness）

完整性分两层：**结构完整性**（CLI validate，按 schema）与**内容完整性**（本 skill 人工审查）。

**先按 schema 界定“什么是齐全”，再检查内容是否填满。** 不属于当前 schema 的 artifact（例如 `test-harden` 缺少 `proposal.md`）**不得**标为缺失或 BLOCKER。

validate 通过是完整性的**必要条件**，但不是充分条件——章节空壳、决策含糊、矩阵缺行等仍需本 skill 检出。

### Schema 边界（先判定，再审查）

| Schema | 含 `specs` | `applyRequires` 典型值 | validate 额外要求 |
|--------|------------|------------------------|-------------------|
| `spec-driven` | 是 | 通常含 `test-plan`；完整 change 还有 `proposal`、`design`、`specs`、`tasks`、`execution-plan` | 合法 delta specs |
| `test-harden` | 否 | `design`、`test-plan` | 无 delta；不要求 `proposal.md`、`tasks.md`、`execution-plan.md` |

**未知或未来 schema**：以 `superpowers status --json` 的 `artifacts` / `applyRequires`，以及 schema 定义中是否含 `specs` artifact 为准；上表仅作快速参考。


### 按 artifact 的内容检查（仅审查当前 schema 涉及的文件）

| Artifact | 适用 schema | 必须包含 | 常见缺口 |
|----------|-------------|----------|----------|
| `proposal.md` | `spec-driven` | Why、What Changes、Capabilities（New/Modified）、Impact | 只写动机不写范围；Impact 缺关键模块 |
| `design.md` | 全部 | Context、**Current system**（给新工程师的行为说明，不是文件路径表）、Relationship 指针、Goals/Non-Goals、Decisions（用户真实选择才写 User selection；agent-owned 可列 A/B/C 但选择理由必须严格、详细，并含可实施细节）、**Contracts**（无表面变更可写 N/A）、Risks | 缺 Current system/Contracts；Current system 只有路径表；把模型推导写成用户 Choice；agent-owned 选择理由空泛；只有原则没有映射/工作实例；“复用现有”无指针；只有方案罗列、没有 Non-Goals |
| `specs/<capability>/spec.md` | `spec-driven` | ADDED/MODIFIED/REMOVED Requirements；每个 Requirement 至少一个 Scenario | Requirement 无 Scenario；delta 与主 spec 关系不清 |
| `tasks.md` | `spec-driven` | 可勾选任务清单，带具体文件路径 | 任务过大、缺验证步骤 |
| `execution-plan.md` | `spec-driven` | File Structure、分步 Task Plan（红测→实现→验证） | 与 tasks.md 脱节；缺命令与预期结果 |
| `test-plan.md` | 全部 | Testing Gap Analysis；Requirement/Scenario 覆盖矩阵（对齐 delta spec）；边界/异常扫描；实现后 Test Hardening 记录（如适用） | 只有 happy path；矩阵缺关键场景 |


## 2. 明晰性（Clarity）

检查实现者能否从文档直接推导“做什么、在哪做、怎么验”。

### 必须无歧义的要素

- **范围边界**：Goals 与 Non-Goals 互斥、可判定；不出现“视情况”“酌情”“后续再定”而无明确 defer 说明。
- **决策结论**：每个 Decision 有明确选用方案。`**User selection:**` 比较表 **仅** 在用户真实选择过这些选项时出现（explore / 访谈 / 显式确认，含用户在看过选项后采纳推荐）。**agent-owned** 实现决策可以列出 A/B/C，但最终选择理由必须严格、详细：写清为何胜出、其他选项为何不满足约束、接受什么代价，并在现有标题下写出映射规则和工作实例。**不得**把模型推导结果写成用户 Choice，**不得**因缺少三方案表或缺少自创一级标题而判缺陷。
- **Current system / Contracts**：`design.md` 含精确的 `## Current system` 标题（给新工程师的行为说明，不是文件路径表）与 `## Contracts`。无 API/状态/错误表面变更时，Contracts 可写 `N/A — no API/state/error surface change`。
- **复用指针**：凡 reuse/extend/keep-current 类依赖，须有可导航 Pointer（路径、符号、命令或文档章节）。
- **文件落点**：Create/Modify/Test 使用仓库内真实路径，不用“相关模块”“适当位置”等模糊指代。
- **任务粒度**：`tasks.md` 的顶层 `# <number>. <scope>` 是逻辑 **dispatch unit**（可分派边界，不是 live subagent 身份）。也接受遗留的 `# <number>. agent<logical-id> — <scope>` 作为等价 dispatch unit。每个细分 checkbox 都应在 `execution-plan.md` 中有可执行的 Step 1–5 说明，包含具体测试文件、实现文件、运行命令与**预期通过/失败信号**；分配策略写在 Dispatch Coordination 表的 Assignee policy 列，而不是 heading 里。（`test-harden` 看 test-plan 矩阵与 harness；`spec-driven` 看 tasks/execution-plan）
- **需求可测性**：`spec-driven` 的 Requirement 使用 SHALL/MUST；Scenario 使用 WHEN/THEN/AND，THEN 断言可观察、可写测试。`test-harden` 的矩阵行须写清主要断言与推荐测试层。
- **数据与契约**：若涉及 API 字段、错误码、状态机、枚举、i18n key，文档中给出稳定命名与示例，而非仅描述意图。
- **边界与异常**：至少覆盖空值/未知输入、失败中途、重复操作、权限/所有权、超时/取消、历史数据兼容（如适用）。

### 常见歧义信号（出现即标 WARNING 或 BLOCKER）

- 同一概念在 proposal/design/spec 中使用不同名称且无映射说明。
- “复用现有逻辑”“保持现有行为”但未指明现有入口函数/文件（至少 WARNING；跨信任边界可升 BLOCKER）。
- 表格/映射表写“等”“etc.”但未定义闭合规则。
- tasks 写“添加校验”“优化错误处理”但无具体规则或测试断言。

## 2.1 设计约定专项（`design.md` 存在时）

在通用完整性/明晰性之外，按以下规则审查。默认 **WARNING**；仅当跨切变更缺少可实施的技术图景或契约、足以阻塞开工时升为 **BLOCKER**。

### Current system 与 Contracts
- 期望精确的 `## Current system` 标题：让接触不久的开发工程师能看懂相关当前设计（职责、入口、控制/数据流、本变更触及的现有行为、缺口/缺陷）。**文件路径表**（只有路径的表格或列表、没有行为说明）至少 WARNING；跨切变更可升 BLOCKER。短文可接受，但散文仍须解释行为。
- 期望 `## Contracts` 始终存在。specs/tasks 无 API/CLI/状态/错误变更时，接受明确的 N/A 声明。Contracts 写 N/A 但 specs 新增 API/状态/错误 → 升级。
- 有 `design.md` 却缺 Current system 或 Contracts 标题 → WARNING（跨切且全文无技术图景 → 可 BLOCKER）。

### Relationship / 复用指针
- 优先 Relationship 表（或等价列表），关系取 `reuse | extend | replace | boundary | retire`，并含 **Pointer** 列。该表补充 Current system 散文，不能替代它。
- 裸复用表述无指针 → WARNING；跨模块/信任边界 → 可 BLOCKER。

### 用户真实选择 vs 模型推导
- `**User selection:**` 表仅记录用户真实选择过的选项。把模型推导结果标成用户 Choice → WARNING（misattributed user Choice）。
- agent-owned 可以列出 A/B/C；最终选择理由必须严格、详细。一行「选 C」或仪式化 Choice → WARNING（shallow rationale）。
- agent-owned 有严格详细分析的 A/B/C → **不成问题**。
- 缺少三方案表 → **不成问题**。不得因重大决策没有 ≥3 方案表判缺陷。

### 可实施细节（不新增必填标题）
- 行为变更的 design 若只有原则、没有目标流程、映射或工作实例 → WARNING；足以阻塞开工时升 BLOCKER。
- 允许在现有 `##` 下自由加 `###`、表格、mermaid、例子。
- 缺少自创的 Target flow 一级标题 → **不成问题**。

### 视觉 DESIGN.md（UI 身份文件；不是 change design.md）
- 英文规范名：**visual DESIGN.md**；指 google-labs design.md 思路（YAML tokens + 散文身份），**不是** change-local `design.md`、不是工程 living doc、不是 ADR。
- 发现路径：仓库根 `DESIGN.md`/`design.md`、`docs/DESIGN.md`、或项目上下文声明路径。
- UI 变更且存在视觉 DESIGN.md 但 design 未引用 → 至少 WARNING。
- 外观 token/规则变更 → 期望 tasks（或已完成计划）更新该视觉 DESIGN.md；**不要**要求把整套视觉系统粘进 change design。
- 非 UI 变更缺少视觉 DESIGN.md → **不成问题**。
- UI 变更未找到视觉 DESIGN.md → 注明以现有组件/CSS 为准即可，不自动成缺陷。

## 3. 一致性（Coherence）


检查 artifacts 之间、与项目约束之间是否自洽。

### 跨文档一致性（按 schema 选用）

**`spec-driven`：**

- `proposal.Capabilities` 中每一项，在 `specs/` 中都有对应 delta spec。
- `design.Decisions` 中每一项，在 spec Requirements 或 tasks 中都有落地痕迹。
- `proposal.Impact` 列出的模块/文件，在 `execution-plan.md` File Structure 中基本覆盖。
- 若变更影响用户可见行为、路由、AI 工具、auth/billing，tasks 中应包含 living docs 更新项（`docs/REQUIREMENTS.md` 等）。

**`test-harden`：**

- `design.Decisions` 中每一项，在 `test-plan.md` 矩阵或 Implementation Record 中都有对应用例行/编号。
- `design.Non-Goals`（如“不修改产品代码/schema”）在 test-plan Scope 中有呼应。
- 每个 `missing` / `planned` 矩阵行，有推荐测试层、目标测试文件或 harness 说明。
- 不要求 `proposal → specs → tasks` 链路；

### 项目约束一致性（TapCanvas）

对照 `AGENTS.md` 与相关 living docs，重点检查：

| 约束 | 适用 schema | BLOCKER 条件 |
|------|-------------|--------------|
| 数据模型 | 全部 | 提案引入新表/列/所有权语义变更，但未标明需用户确认 |
| Superpowers 主 spec | `spec-driven` | delta spec 与 `superpowers/specs/` 冲突，或修改 capability 未在 proposal 列出 |
| Auth / billing / ownership | 全部（若变更触及） | 行为变更未在 design Goals/Non-Goals（及 `spec-driven` 的 proposal Impact）中明确声明 |
| 安全边界 | 全部（若变更触及） | 涉及用户可见错误、权限、敏感信息展示，但 spec 或 design 未区分 surface（如普通用户 vs Admin） |
| 文档义务 | `spec-driven` | 产品面变更缺 living docs 同步任务 |
| 测试-only 边界 | `test-harden` | design 声明不改产品，但 test-plan 含生产功能或 schema 变更步骤 |

## 4. 可实施性（Implementability）

检查“现在能否开工”，而非“方案是否完美”。

### 开工就绪判定

**共用条件：**

1. 无 BLOCKER（含 `superpowers validate` 的 ERROR）。WARNING / SUGGESTION 不单独阻塞 ready；可保留为 residual notes。
2. `applyRequires` 中每个 artifact 均 `status: done`，且内容通过本 skill 的明晰性/一致性检查。
3. 关键决策无未决分叉；若存在外部依赖（未合并前置 change、共享 harness 未就绪），已写明阻塞关系与降级策略。

**`spec-driven` 额外条件：**

4. 每个 New/Modified Capability 有完整 delta spec + 对应 tasks。
5. `execution-plan` 中至少第一条红测路径可执行（命令、文件、预期失败点明确）。
6. `test-plan` 对核心 Requirement 有完整覆盖计划，不仅停留在“补测试”。

**`test-harden` 额外条件：**

4. `test-plan` 中每个待实施（`missing` / `planned`）矩阵行，具备：目标测试文件或新建路径、测试层（unit/component/E2E）、可观察断言、建议运行命令。
5. `design` 已明确测试范围边界（测什么 / 不测什么），且与现有测试不重复的理由清楚。
6. 不要求 `execution-plan` 红测路径；若 design 将用例步骤写在 Decision 中，test-plan 须能据此直接写测试。

### 故意 defer 的合法情形

以下不算 BLOCKER，但必须在文档中**显式标注**并给出 follow-up 任务或引用：

- 明确写入 Non-Goals 的后续迭代项。
- 依赖另一 in-progress change，且互相引用名称与接口边界清楚。
- 需用户确认的 schema/auth/billing 决策，已暂停实现并标明等待确认。


## 输出格式

使用简体中文输出，技术术语、文件路径、命令保持英文。结构如下：

```markdown
## 变更审查报告：<change-name>

### 摘要
| 维度 | 结论 |
|------|------|
| 完整性 | … |
| 明晰性 | … |
| 一致性 | … |
| 可实施性 | … |

**总体判定**：可无疑义实现 / 有条件可开工 / 不可开工

### 问题清单

#### BLOCKER（必须先修）
1. …
   - **位置**：`design.md` Decision 3 / `specs/foo/spec.md` Requirement: …
   - **问题**：…
   - **建议**：…

#### WARNING（建议开工前修）
…

#### SUGGESTION（可选）
…

### 开工前最小修复清单（可选）
按优先级列出 3–7 条具体修改建议（指向文件与章节）。

```
