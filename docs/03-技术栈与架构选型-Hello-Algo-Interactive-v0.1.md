**Hello Algo Interactive（暂定名）**

**技术栈与架构选型文档**

React + TypeScript、shadcn/ui、Motion 与多 Renderer 架构

| **文档版本** | v0.1                                            |
|--------------|-------------------------------------------------|
| **文档状态** | 内部讨论稿                                      |
| **编制日期** | 2026-08-17                                      |
| **适用对象** | 技术负责人、前端、算法内容、测试、设计与 DevOps |

**说明：**本文件用于项目内部讨论与评审。项目名称、范围和优先级可在评审后调整。

# 文档信息

| **文档目的** | 确定 MVP 的核心技术栈、分层架构、事件协议、Renderer 体系、状态边界和工程规范。        |
|--------------|---------------------------------------------------------------------------------------|
| **负责人**   | 待定                                                                                  |
| **评审角色** | 产品、设计、前端、算法内容负责人                                                      |
| **基线假设** | 以《Hello 算法》的内容与多语言代码作为主要内容资产；交互应用采用 React + TypeScript。 |

> **选型结论**
>
> 采用 React + TypeScript + Vite；shadcn/ui + Tailwind CSS 构建设计系统；Motion 作为统一 React 动画运行时；React Flow 负责图和树；DOM/SVG 负责序列与链式结构；CSS Grid 负责矩阵与棋盘；Zustand 只保存低频应用状态。算法核心以纯事件、reducer、checkpoint 和主时间轴实现。

# 1. 架构目标与约束

| **目标**     | **技术含义**                                                          |
|--------------|-----------------------------------------------------------------------|
| 动画自然     | 持久化实体、稳定 ID、空间连续性、统一 Motion Tokens，避免快照式重建。 |
| 支持不同算法 | 多 Renderer + Composite Scene + Custom Renderer，而非一个万能画布。   |
| 可回退与拖动 | 算法状态通过事件重放恢复；视觉倒放不是逻辑真相。                      |
| React 友好   | 动画生命周期可取消、可清理，兼容 StrictMode 和并发渲染。              |
| 降低 UI 成本 | shadcn/ui 提供可复制、可定制的美观组件；业务组件与基础组件分层。      |
| 性能可控     | 每帧值交给 MotionValue/浏览器动画，不逐帧写 Zustand 或 React state。  |
| 内容可复用   | 通过显式 manifest 适配《Hello 算法》Markdown 和多语言代码。           |

# 2. 核心技术栈

| **层级** | **选择**                              | **用途与理由**                                                  | **备注**                                                    |
|----------|---------------------------------------|-----------------------------------------------------------------|-------------------------------------------------------------|
| 应用     | React + TypeScript                    | 组件化 UI、强类型算法协议、成熟生态。                           | 启用 strict；保留 StrictMode。[R6]                        |
| 构建     | Vite                                  | 开发快、React/TS 模板成熟、按需加载简单。                       | Vite 仅转译 TS，CI 必须单独运行 tsc。[R7]                 |
| UI       | shadcn/ui                             | 美观默认值、源码进入项目、可形成自己的组件体系。                | 固定 new-york 风格、CSS Variables 与基础 primitives。[R2] |
| 样式     | Tailwind CSS                          | 与 shadcn 一致，适合 tokens、响应式和快速迭代。                 | 采用 v4 兼容路线与 OKLCH 变量。[R3]                       |
| 动画     | Motion                                | layout/layoutId、useAnimate、MotionValue、SVG、Reduced Motion。 | 仅依赖开源核心能力，不依赖付费 Motion+。[R4]              |
| 图/树    | React Flow                            | 节点、边、视口、自定义节点和边，显著减少图组件工作量。          | 仅使用开源 core；算法模式关闭编辑功能。[R5]               |
| 图布局   | Dagre / d3-hierarchy                  | 树与有向图的初始坐标。                                          | ELK 作为复杂图的按需依赖。                                  |
| 状态     | Zustand                               | 保存应用级低频状态；vanilla store 便于独立测试。                | 使用 selectors，避免订阅整个 store。[R8]                  |
| 代码     | CodeMirror 6                          | 只读代码、当前行 decoration、滚动和语言扩展。                   | 封装为内部 CodePanel 适配器。[R9]                         |
| 表单     | React Hook Form + Zod                 | 算法输入 schema、即时校验和类型推导。                           | 每个算法模块提供 inputSchema。                              |
| 测试     | Vitest + Testing Library + Playwright | 纯函数、组件、端到端和视觉回归。                                | 视觉基线固定在同一 CI 环境。[R10]                         |
| 包管理   | pnpm workspace                        | 管理 web、engine、renderers、content 和 ui。                    | MVP 不必引入 Turborepo。                                    |

# 3. 总体架构

```text
Hello Algo 内容资产

├─ Markdown / 图片 / 算法说明

└─ 多语言代码

↓ Content Manifest / Adapter

┌──────────────── React Web Application ────────────────┐

│ UI Shell / Router / Algorithm Page / Code Panel │

│ ↓ │

│ Algorithm Module → Trace Events → Reducer / Checkpoint│

│ ↓ │

│ Timeline Compiler → Player → Transactions / Markers │

│ ↓ │

│ Sequence | Linked | Graph/Tree | Grid/Board | Custom │

└───────────────────────────────────────────────────────┘
```

## 3.1 分层职责

| **层**        | **职责**                                       | **禁止职责**                             |
|---------------|------------------------------------------------|------------------------------------------|
| Content       | 标题、正文、复杂度、代码实现、国际化文案。     | 不得包含像素坐标、动画时长或播放器状态。 |
| Algorithm     | 验证输入、生成语义事件、计算最终结果。         | 不得访问 DOM、Motion、React Flow。       |
| State/Replay  | 纯 reducer、checkpoint、恢复任意 Marker。      | 不得以动画回调作为状态来源。             |
| Timeline      | 把事务编译为 cue、节拍、Marker 和场景同步。    | 不得包含具体组件实现。                   |
| Renderer      | 把 SceneState 渲染为 DOM/SVG/React Flow/Grid。 | 不得重新实现算法。                       |
| Motion Recipe | 定义 compare、swap、visit、write 等如何运动。  | 不得直接修改算法状态。                   |
| UI Shell      | 导航、面板、主题、输入、代码与播放器控件。     | 不得掌握算法内部循环状态。               |

# 4. 推荐目录结构

```text
apps/

web/ # React + Vite 应用

packages/

algorithm-engine/ # event、reducer、checkpoint、player

algorithm-catalog/ # 算法元数据、模块注册、默认输入

renderers/

sequence/

linked/

graph-tree/

grid-board/

custom/

ui/ # shadcn 基础组件与产品组件

content-adapter/ # Hello Algo 内容 manifest 与构建脚本

testing/ # fixture、visual helpers

content/

hello-algo/ # 上游内容或子模块，保持授权边界清晰
```

MVP 使用 pnpm workspace 即可。只有在包数量和 CI 时间明显增加后，再评估 Turborepo 或 Nx。

# 5. 核心领域模型

## 5.1 Algorithm Module

```ts
type AlgorithmModule<Input, Result> = {

id: string

title: string

category: string

inputSchema: ZodType<Input>

defaultInput: Input

scenes: SceneSpec[]

trace(input: Input, ctx: TraceContext): TraceResult<Result>

codeAnchors: CodeAnchorMap

}
```

算法模块只产生确定性事件和结果，不直接生成 React 元素。随机算法通过 ctx.seed 获取可复现随机源。

## 5.2 语义事件

```ts
type AlgorithmEvent = {

id: string

transactionId: string

sceneId: string

type: string

payload: unknown

marker?: boolean

granularity?: "macro" | "micro"

codeAnchor?: string

narration?: { key: string; args?: Record<string, unknown> }

}
```

事件中不保存 Tailwind class、颜色、像素、duration、easing 或 spring 参数。不同 Renderer 可以处理不同 payload，但顶层字段保持一致。

## 5.3 Scene 与 Renderer

```ts
type SceneSpec = {

id: string

renderer: "sequence" | "linked" | "graph" | "tree" |

"grid" | "board" | "custom"

area: "main" | "side" | "bottom" | "overlay"

options?: Record<string, unknown>

}
```

## 5.4 Transaction 与 Marker

```ts
type TimelineTransaction = {

id: string

marker: number

events: AlgorithmEvent[]

cues: Array<{

sceneId: string

offset: number

duration: number

recipe: string

}>

}
```

一个事务可以同时改变 Graph、Queue、Distance Table、Code 和 Variables。下一步/上一步以 Marker 为单位，不暴露内部 cue。

# 6. 播放器与回放模型

## 6.1 状态来源

```text
Input + Seed + SchemaVersion

↓

Trace Events

↓

Pure Reducer

↓

SceneState at Marker N

↓

Renderer + Motion Presentation
```

> **强制规则**
>
> 算法状态必须在动画开始前可计算；Motion 的 onComplete 只能通知视觉流程结束，不得承担 swap、write、visit 等逻辑提交。

## 6.2 回退与 Seek

“上一步”与拖动不依赖简单 reverse。播放器找到目标 Marker，从最近 checkpoint 恢复后重放事件，再由 Renderer 定位到目标表现。视觉连续倒放可以作为增强能力，但不作为逻辑正确性的基础。

- 事件较少时可从初始状态重放。

- 事件增长后每 20~50 个 Marker 保存 checkpoint；具体间隔以测量结果为准。

- 每次运行拥有 runId 或 AbortController；新操作立即使旧任务失效。

## 6.3 主时钟

所有 Scene 共享一个 Player 实例。Zustand 只保存 playing、activeMarker、speed 等低频状态；currentTime、x/y、opacity、pathLength 等高频值由 MotionValue 或浏览器动画控制。

# 7. Renderer 架构

| **Renderer** | **底层技术**                           | **主要算法**               | **关键注意点**                         |
|--------------|----------------------------------------|----------------------------|----------------------------------------|
| Sequence     | React DOM + Motion layout/useAnimate   | 排序、搜索、双指针、字符串 | 稳定 ID；重复值；换位不重建节点。      |
| Linked       | DOM 节点 + SVG edges + Motion          | 链表、栈、队列、Hash、LRU  | 先断边再退出；连接线随布局更新。       |
| Graph        | React Flow + Motion + Dagre/ELK        | BFS、DFS、最短路、MST      | 布局执行期间固定；自定义节点/边 memo。 |
| Tree         | React Flow 或 SVG + d3-hierarchy       | BST、AVL、Heap、Trie       | 结构变化才重排；旋转需整组节点同步。   |
| Grid         | CSS Grid + Motion                      | DP、背包、编辑距离、迷宫   | 依赖先于写入；控制单元格规模。         |
| Board        | CSS Grid + Motion                      | N 皇后、数独、棋盘回溯     | 尝试、冲突、放置和撤销必须分开。       |
| Custom       | 复用 Player 与 UI，专用 DOM/SVG/Canvas | 哈夫曼、压缩、网络流、几何 | 只在通用 Renderer 表达不自然时使用。   |

## 7.1 Renderer Plugin 接口

```ts
type RendererPlugin<S, E extends AlgorithmEvent> = {

kind: string

createInitialState(spec: SceneSpec): S

reduce(state: S, event: E): S

render(props: RendererProps<S>): ReactNode

getRecipe(event: E): MotionRecipe | null

validate?(spec: SceneSpec): ValidationIssue[]

}
```

Renderer 的 reduce 必须是纯函数。动画 recipe 可以查询元素 ref 和布局信息，但不能修改领域状态。

## 7.2 复合场景

复杂算法通过多个 Scene 组合，不为每个算法复制一整套页面。布局层负责桌面并排、移动端 Tabs 和面板折叠；Timeline 负责同步。

```ts
const dijkstraScenes = [

{ id: "graph", renderer: "graph", area: "main" },

{ id: "queue", renderer: "sequence", area: "side" },

{ id: "distance", renderer: "grid", area: "bottom" },

]
```

# 8. React 与 Motion 集成规则

- **稳定 key：**实体 ID 来自 trace 初始化，不使用数组下标、值或 render 时生成的随机数。React 官方说明重排、插入和删除依赖稳定 key。[R6]

- **StrictMode 保留：**开发环境的重复 render 与 Effect cleanup 用于暴露生命周期问题，不以关闭 StrictMode 解决双动画。

- **动画可取消：**路由切换、算法切换、输入变化、seek、Resize 和快速步进都必须停止旧动画。

- **避免每帧 setState：**高频插值使用 MotionValue；React state 只在 Marker 或结构变化时更新。

- **layout 有边界：**普通重排使用 layout；教学意义明显的弧线、访问方向、树旋转和回溯使用显式 sequence/SVG path。

- **Resize 策略：**动画中 Resize 时停到最近 settled Marker，重新测量并恢复，不沿用旧坐标继续播放。

# 9. UI 与设计系统

## 9.1 shadcn/ui 使用方式

- 初始化时固定 new-york 风格、基础色、圆角、图标库和 primitives；后续避免随意重置。

- components/ui 仅保存接近上游的基础组件；components/algorithm-ui 保存播放器、SceneFrame、VariablePanel 等产品组件。

- 第三方 registry 组件安装前审查源码、依赖和许可。shadcn 官方同样提示社区 registry 需要代码审查。[R2]

- Animate UI 等 registry 只用于导航、Tabs、Dialog 等微交互，不作为算法时间轴核心。

## 9.2 Design Tokens

```css
/* 语义色示意 */

--viz-idle

--viz-active

--viz-comparing

--viz-selected

--viz-visited

--viz-success

--viz-danger

--viz-muted

/* 运动 token 示意 */

focus: 160–220ms

compare: 200–280ms

move: 360–520ms

structural: 480–680ms
```

具体时长需由设计和原型测试调整；Renderer 只能引用 token，不在算法模块中硬编码。

# 10. 状态管理策略

| **状态**                                     | **存放位置**                          | **更新频率**     |
|----------------------------------------------|---------------------------------------|------------------|
| 当前算法、输入、主题、面板布局               | Zustand app store                     | 低频             |
| playing、speed、activeMarker                 | Zustand player store 或 vanilla store | Marker/控制操作  |
| 完整 events、checkpoints、scene states       | Player/engine 实例                    | 运行生成与 seek  |
| currentTime、x/y、opacity、scale、pathLength | MotionValue / animation controls      | 每帧             |
| 输入表单临时值与校验                         | React Hook Form                       | 用户输入         |
| React Flow nodes/edges 结构                  | Scene local store                     | 结构变化；非每帧 |

Zustand 支持 vanilla store、selector 和非 React 订阅，适合把 Player 与组件解耦；组件必须订阅最小切片。[R8]

# 11. 内容适配方案

## 11.1 MVP 方案：显式 Manifest

```ts
type ContentManifest = {

algorithmId: string

chapterPath: string

summaryPath?: string

code: Record<Language, { file: string; anchors: CodeAnchorMap }>

attribution: AttributionInfo

}
```

MVP 不开发“自动理解全部 Markdown 和代码”的复杂生成器。每个基准算法提供一份显式 manifest，把章节、代码文件、语义锚点和授权信息关联起来。

## 11.2 后续自动化

- 构建阶段抽取标题、段落、复杂度和代码片段，生成规范化 JSON。

- 用语义 anchor 映射不同语言代码，而不是以 TypeScript 行号为唯一基准。

- 上游同步时运行内容差异检查，提示 manifest 失效。

# 12. 性能策略

| **问题**   | **策略**                                                                                         |
|------------|--------------------------------------------------------------------------------------------------|
| DOM 重建   | 持久化实体节点；只更新状态、transform 和少量结构。                                               |
| 全局重渲染 | Zustand selector、React.memo、稳定 nodeTypes/edgeTypes 与回调。                                  |
| 大图性能   | 固定布局、简化阴影/渐变、折叠深层节点；遵循 React Flow 性能建议。[R5]                          |
| 事件数量   | TracePolicy 限制 maxEvents/maxEntities，支持宏步骤和事件合并。                                   |
| 包体积     | 算法模块、Renderer、CodeMirror 语言和 ELK 按路由/算法懒加载。Motion 可按使用方式控制体积。[R4] |
| Canvas     | MVP 默认 DOM/Grid；只有性能分析证明必要时才引入 Konva。                                          |
| 类型检查   | Vite 构建之外运行 tsc --noEmit，因为 Vite 本身不做完整类型检查。[R7]                           |

# 13. 测试策略

| **测试层**   | **内容**                                               | **工具**                             |
|--------------|--------------------------------------------------------|--------------------------------------|
| 算法单元测试 | 输入校验、最终结果、事件顺序、边界条件。               | Vitest                               |
| Reducer 测试 | 每种事件生成正确 SceneState，保持纯函数。              | Vitest                               |
| Replay 测试  | 前进 → 回退 → 再前进后状态完全一致。                   | Vitest + fixtures                    |
| 协议校验     | sceneId、transaction、marker、anchor 和 payload 合法。 | Zod + Vitest                         |
| 组件测试     | 播放器、输入、键盘、主题和错误状态。                   | Testing Library                      |
| 端到端       | 目录 → 算法页 → 播放 → 修改输入 → 分享。               | Playwright                           |
| 视觉回归     | 固定 Marker 和固定环境截图。                           | Playwright toHaveScreenshot。[R10] |
| 性能基准     | 基准输入下帧率、提交次数、trace 时间和内存。           | Playwright + Performance API         |

# 14. 可访问性与浏览器

- 顶层使用 MotionConfig reducedMotion="user"，并为关键 Renderer 提供 useReducedMotion 分支。[R4]

- 动画状态始终有文本说明；颜色之外提供边框、图标、标签或形状差异。

- 播放器、Tabs、Drawer、Slider 和面板遵循键盘和焦点规范。

- 算法场景提供摘要性的 aria-label，避免每个动画帧持续播报。

- Tailwind v4 面向现代浏览器；MVP 明确浏览器基线，旧浏览器需求单独评估。[R3]

# 15. 构建、发布与 CI

```bash
pnpm lint

pnpm typecheck # tsc --noEmit

pnpm test # Vitest

pnpm test:e2e # Playwright

pnpm test:visual # 固定环境视觉基线

pnpm build # Vite production build
```

- 算法与 Renderer 通过 dynamic import 按需加载。

- 生成静态资源后可部署到 CDN、对象存储或现有站点子路径。

- 分享 URL 的 schemaVersion 必须版本化；旧版本无法解析时给出迁移提示。

- Source map 与错误上报区分开发、预发布和生产环境。

- 依赖版本使用 pnpm lockfile 固定；文档不硬编码具体版本，升级通过独立 PR 完成。

# 16. 授权与开源边界

> **高优先级风险**
>
> 《Hello 算法》仓库声明文本、代码、图片、照片和视频使用 CC BY-NC-SA 4.0。[R1] 如果产品可能商业化，不能仅因为仓库公开就默认可商用。应在编码前确认授权策略。本段不是法律意见。

- 交互引擎、UI 和 Renderer 与内容资产分目录管理，分别保留许可证和 NOTICE。

- 引用或改编内容时记录来源、链接、修改说明和许可证。

- 第三方库和 shadcn registry 组件进入项目时更新依赖/许可清单。

- 如需闭源商业产品，优先考虑获得内容授权，或重新编写独立内容与视觉资产。

# 17. 主要技术风险与应对

| **风险**              | **症状**                       | **应对**                                              |
|-----------------------|--------------------------------|-------------------------------------------------------|
| Motion 与状态耦合     | 取消动画后状态不完整。         | 纯 reducer；动画只读取前后状态。                      |
| React key 不稳定      | 重复值闪烁、节点重建。         | trace 初始化稳定 entityId；测试重复值。               |
| 复合场景不同步        | Graph 已前进而 Queue 未更新。  | 单 Player、Transaction 和统一 Marker。                |
| Graph 频繁重排        | 节点跳动、性能差。             | 算法执行时固定坐标；仅结构事件重新布局。              |
| Renderer 协议过度通用 | 类型复杂、开发变慢。           | 顶层事件统一，payload 按 Renderer 区分，允许 custom。 |
| 事件过多              | 内存和时间轴卡顿。             | 输入限制、宏步骤、事件合并、checkpoint。              |
| shadcn 源码漂移       | 覆盖本地修改、升级困难。       | 基础组件少改；升级前提交并审查 diff。[R2]           |
| 内容同步失败          | 章节或代码更新后 anchor 失效。 | manifest 校验与 CI 检查。                             |

# 18. 实施顺序

1.  初始化 React + TypeScript + Vite、shadcn/ui、Tailwind 和基础 Design Tokens。

2.  实现 algorithm-engine：event、reducer、Marker、checkpoint、run cancellation。

3.  实现 Sequence Renderer 和冒泡排序，完成重复值、换位、回退和 Resize 测试。

4.  实现统一播放器、代码面板和变量面板。

5.  实现 Graph Renderer + BFS。

6.  实现 Grid/Board Renderer + 0-1 背包与 N 皇后。

7.  实现 Tree/Composite + 堆排序。

8.  接入内容 manifest、响应式布局、可访问性与视觉回归。

9.  MVP 性能与授权评审通过后，再扩展算法目录。

# 19. 技术决策摘要

| **决策**   | **结论**                                                 |
|------------|----------------------------------------------------------|
| UI 基础    | shadcn/ui，优先视觉品质和可定制性。                      |
| 动画核心   | Motion；不同时维护 Anime.js 作为第二核心时间轴。         |
| 算法兼容   | 统一事件 + 多 Renderer + Composite + Custom。            |
| 状态正确性 | 事件重放与 checkpoint；不依赖动画倒放。                  |
| 图/树      | React Flow 负责结构和视口，Motion 负责节点内部视觉动画。 |
| 矩阵/棋盘  | 先 CSS Grid，性能证据充分后再引入 Canvas。               |
| 全局状态   | Zustand 低频状态；MotionValue 高频状态。                 |
| 内容接入   | MVP 显式 manifest，避免一开始开发通用解析器。            |
| 版本策略   | 实施时选择稳定兼容版本并锁定，不在架构文档中硬编码。     |

# 参考资料

本文件中的技术事实与开源项目信息主要依据以下公开仓库和官方文档。版本号不在本文件中硬编码，实施时应重新确认稳定版本。

| **编号**    | **资料**                                                                                               |
|-------------|--------------------------------------------------------------------------------------------------------|
| **[R1]**  | [<u>Hello Algo GitHub repository and CC BY-NC-SA statement</u>](https://github.com/krahets/hello-algo) |
| **[R2]**  | [<u>shadcn/ui documentation and registry guidance</u>](https://ui.shadcn.com/docs)                     |
| **[R3]**  | [<u>Tailwind CSS v4 compatibility documentation</u>](https://tailwindcss.com/docs/compatibility)       |
| **[R4]**  | [<u>Motion for React documentation</u>](https://motion.dev/docs/react)                                 |
| **[R5]**  | [<u>React Flow custom nodes, layouting and performance</u>](https://reactflow.dev/learn)               |
| **[R6]**  | [<u>React list keys and StrictMode documentation</u>](https://react.dev/learn/rendering-lists)         |
| **[R7]**  | [<u>Vite official guide and TypeScript behavior</u>](https://vite.dev/guide/)                          |
| **[R8]**  | [<u>Zustand TypeScript and store reference</u>](https://zustand.docs.pmnd.rs/)                         |
| **[R9]**  | [<u>CodeMirror 6 documentation</u>](https://codemirror.net/docs/)                                      |
| **[R10]** | [<u>Playwright visual comparisons</u>](https://playwright.dev/docs/test-snapshots)                     |
