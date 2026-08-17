# Spec: Hello Algo Interactive MVP

Labels: `ready-for-agent`

## Problem Statement

学习者在阅读《Hello 算法》等优秀算法教材时，静态图解和独立代码块无法展现数据结构变化的连续空间轨迹、因果演进与多结构协同机制。
现有的算法可视化工具往往存在关键痛点：
1. **状态与动画耦合**：缺乏确定性状态模型，用户在点击“上一步”、拖拽时间轴（Seek）或调速时频繁发生状态丢失、错位或 DOM 节点闪烁；
2. **对象身份丢失**：未对数据实体分配稳定 ID，在处理重复值交换（如排序算法中的相同数字）时破坏 React 协调机制；
3. **代码与视觉割裂**：动画演示与实际多语言代码行号硬编码绑定，无法同步映射不同编程语言的执行进度；
4. **模型死板**：将所有算法强行套入单一的“一维数组变色”模型，无法自然表达树旋转、图松弛、DP 表格依赖与回溯撤销。

## Solution

构建一个兼具教材深度、视觉品质和可交互性的算法演示平台 **Hello Algo Interactive**。
平台基于 **纯语义事件（Semantic Events）**、**时间轴编译器（Timeline Compiler）**、**不可变状态快照（State Snapshots）** 与 **多渲染器插件体系（Multi-Renderer Plugins）**：
- 算法纯函数通过打点输出抽象语义事件并由 `Step Guard` 实施防死循环熔断；
- 引擎为每个逻辑步骤（`Marker`）构建 $O(1)$ 不可变状态快照，实现零延迟、绝对可靠的快进、后退与 Seek；
- 渲染层利用 Motion 的 `layout` 和特定 `Motion Recipe` 呈现流畅连续的空间运动；
- 代码面板通过抽象 `Semantic Code Anchor` 实时高亮映射多语言（TypeScript/Go/Rust）代码与教学变量；
- 布局支持三栏响应式结构、无状态 URL 参数分享、深浅主题 OKLCH 语义色和全局键盘快捷键。

## User Stories

1. As an algorithm learner, I want to browse all supported algorithms categorized by data structure and topic, so that I can systematically follow the *Hello Algo* curriculum.
2. As an algorithm learner, I want to search algorithms by Chinese and English keywords, so that I can quickly locate the specific algorithm I want to review.
3. As an algorithm learner, I want to filter algorithms by difficulty level and renderer type, so that I can focus on concepts matching my current learning stage.
4. As an algorithm learner, I want the URL to update when navigating between algorithms, so that I can use browser forward/backward buttons without breaking visual or application state.
5. As an algorithm learner, I want to play and pause the algorithm animation at any time, so that I can control the pace of visual demonstration.
6. As an algorithm learner, I want to step forward to the next Marker, so that I can carefully observe the atomic logical outcome of one step.
7. As an algorithm learner, I want to step backward to the previous Marker without visual glitch or state drift, so that I can re-examine a step I did not understand.
8. As an algorithm learner, I want to scrub the timeline slider to seek directly to any Marker, so that I can jump straight to a crucial algorithmic state.
9. As an algorithm learner, I want to adjust the playback speed (0.5x, 1x, 2x), so that I can speed through familiar loops and slow down on complex transformations.
10. As a keyboard-oriented user, I want to use standard keyboard shortcuts (`Space`, `Left/Right Arrow`, `J/K`, `Home/End`, `[`/`]`) to control playback, so that I can operate the platform smoothly during intensive study.
11. As an algorithm learner, I want array elements with identical values to maintain distinct, stable Entity IDs, so that swapping duplicate values shows continuous motion rather than element destruction and recreation.
12. As an algorithm learner, I want comparison steps to visually elevate and highlight elements before they move, so that the algorithmic causality is clear before values swap.
13. As an algorithm learner, I want binary search range exclusions and pointers (`left`, `mid`, `right`) to update smoothly in the Sequence Renderer, so that I can clearly understand the search space reduction.
14. As an algorithm learner, I want BFS to display a Graph scene alongside an auxiliary Queue scene, so that I can observe the synchronous relationship between node traversal and queue FIFO operations.
15. As an algorithm learner, I want Heap Sort to show an Array scene and a Binary Tree scene simultaneously, so that I can see the direct index-to-tree mapping during sift-down operations.
16. As an algorithm learner, I want 0-1 Knapsack to highlight dependency cells in the DP grid before writing the computed maximum value, so that I understand state transitions visually.
17. As an algorithm learner, I want N-Queens to show queen placement, conflict line warnings, cell resets, and call stack updates during backtracking, so that I understand recursive trial-and-error mechanics.
18. As a learner using TypeScript, Go, or Rust, I want the code viewer to highlight the active line range via Semantic Code Anchors, so that the code reflects the exact execution step across different languages.
19. As an algorithm learner, I want to inspect a curated list of teaching variables (e.g., loop indices, temporary values, flags), so that I can verify theoretical equations against live runtime numbers.
20. As a reader of *Hello Algo*, I want to read the structured chapter explanation alongside the interactive canvas, so that I don't need to jump between external documentation and the animation.
21. As an algorithm learner, I want to input custom parameters (arrays, target values, matrix sizes, board dimensions) with immediate schema validation, so that I can test edge cases.
22. As an algorithm learner, I want to trigger random input generation backed by a deterministic PRNG seed, so that I can explore multiple valid configurations.
23. As a student or teacher, I want to click "Share" to copy a Stateless Share URL containing the algorithm ID, inputs, and seed, so that anyone opening the link sees the exact same reproducible execution.
24. As an algorithm learner, I want the Step Guard to safely terminate execution if my custom input produces an infinite loop or exceeds 10,000 steps, so that my browser never freezes.
25. As a desktop user, I want a collapsible 3-column layout (Directory, Visual Canvas + Player, Code + Variables), so that I can optimize screen space according to my preferences.
26. As a mobile or tablet user, I want the visual canvas to span full width and the code/directory to open in sliding Sheets/Drawers, so that I can study effectively on touch devices.
27. As a dark mode user, I want all semantic state colors (Amber for comparing, Indigo for selecting, Emerald for sorted, Rose for conflict) to maintain high contrast and consistency.
28. As a user with color vision deficiencies, I want states to be distinguished by badges, icons, borders, and text labels in addition to color.
29. As a user with motion sensitivity, I want system Reduced Motion preferences to seamlessly replace spatial translations with lightweight fades while preserving full logical state transitions.
30. As an algorithm learner, I want local render errors to degrade gracefully into structured text steps, so that a canvas glitch never blocks me from reading the code and variables.

## Implementation Decisions

- **Monorepo Structure (`pnpm workspace`)**:
  - `apps/web`: React 18+ / TypeScript / Vite application shell.
  - `packages/algorithm-engine`: Tracer, Step Guard, Timeline Compiler, Reducers, Snapshot Store, Player controller, PRNG.
  - `packages/renderers-sequence`: Sequence Renderer with Motion layout & recipes.
  - `packages/renderers-graph-tree`: React Flow + layout integration for Graph and Tree scenes (lazy loaded).
  - `packages/renderers-grid-board`: CSS Grid for Matrix and Board scenes.
  - `packages/renderers-linked`: Linked structure renderer with SVG overlay edges.
  - `packages/ui`: shadcn/ui components, OKLCH design tokens, Speed Context, theme provider.
  - `packages/content-adapter`: Hello Algo Markdown parser, Semantic Code Anchor maps, CodeMirror 6 read-only integration.
- **Pure Semantic Event & Snapshot Engine**: Tracer emits abstract events; Step Guard prevents runaway execution (>10,000 steps); immutable StateSnapshots are cached per Marker for $O(1)$ seek.
- **Stable Entity IDs & Motion Recipes**: Persistent keys ensure DOM continuity; Motion `layout` handles positioning; declarative recipes handle educational highlights.
- **Code & Variable Synchronization**: Semantic Code Anchors map Marker steps to language-specific lines in TypeScript, Go, and Rust.
- **UI Layout & Accessibility**: Collapsible 3-column desktop layout, mobile Sheet drawers, OKLCH theme tokens, Reduced Motion fallback (0ms translation + fade), Local Error Boundary fallback.
- **Stateless Sharing & PRNG**: Query parameters encode inputs and seed; Mulberry32 deterministic PRNG ensures reproducible randomness.

## Testing Decisions

- **Good Test Criteria**: Test observable external behavior and state transitions, not internal CSS classes or private helper variables.
- **Seams**:
  - Algorithm & Tracer Seam (Unit tests verifying correctness of emitted events and final snapshots under fixture inputs).
  - Engine Reducer & Snapshot Seam (Bidirectional seek, replay idempotency, snapshot consistency).
  - Input Schema & PRNG Seam (Zod boundaries and Mulberry32 reproducibility).
  - Component & Keyboard Seam (React Testing Library for player controls, shortcuts, forms).
  - E2E & Visual Regression (Playwright for navigation flows and visual snapshot stability across themes).

## Out of Scope

- User authentication, cloud sync, bookmarks, and learning progression tracking.
- User code compilation or sandboxed online judge execution.
- Multi-user classroom collaboration.
- Massive graph (>1,000 nodes) WebGL renderers.
- Arbitrary unmapped Markdown extraction without explicit manifests.

## Further Notes

- Benchmark Algorithm Suite: Bubble Sort, Binary Search, BFS, Heap Sort, 0-1 Knapsack, N-Queens.
- Clear licensing boundary maintained between CC BY-NC-SA 4.0 upstream content and interactive engine code.
