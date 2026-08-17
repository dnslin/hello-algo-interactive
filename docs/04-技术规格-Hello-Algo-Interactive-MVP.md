# Hello Algo Interactive MVP 技术规格说明书 (Technical Specification)

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

---

## User Stories

### 1. 算法目录与导航 (Catalog & Navigation)
1. As an algorithm learner, I want to browse all supported algorithms categorized by data structure and topic, so that I can systematically follow the *Hello Algo* curriculum.
2. As an algorithm learner, I want to search algorithms by Chinese and English keywords, so that I can quickly locate the specific algorithm I want to review.
3. As an algorithm learner, I want to filter algorithms by difficulty level and renderer type, so that I can focus on concepts matching my current learning stage.
4. As an algorithm learner, I want the URL to update when navigating between algorithms, so that I can use browser forward/backward buttons without breaking visual or application state.

### 2. 播放控制与时间旅行 (Playback & Time Travel)
5. As an algorithm learner, I want to play and pause the algorithm animation at any time, so that I can control the pace of visual demonstration.
6. As an algorithm learner, I want to step forward to the next Marker, so that I can carefully observe the atomic logical outcome of one step.
7. As an algorithm learner, I want to step backward to the previous Marker without visual glitch or state drift, so that I can re-examine a step I did not understand.
8. As an algorithm learner, I want to scrub the timeline slider to seek directly to any Marker, so that I can jump straight to a crucial algorithmic state.
9. As an algorithm learner, I want to adjust the playback speed (0.5x, 1x, 2x), so that I can speed through familiar loops and slow down on complex transformations.
10. As a keyboard-oriented user, I want to use standard keyboard shortcuts (`Space`, `Left/Right Arrow`, `J/K`, `Home/End`, `[`/`]`) to control playback, so that I can operate the platform smoothly during intensive study.

### 3. 数据可视化与动画体验 (Visual Scenes & Motion)
11. As an algorithm learner, I want array elements with identical values to maintain distinct, stable Entity IDs, so that swapping duplicate values shows continuous motion rather than element destruction and recreation.
12. As an algorithm learner, I want comparison steps to visually elevate and highlight elements before they move, so that the algorithmic causality is clear before values swap.
13. As an algorithm learner, I want binary search range exclusions and pointers (`left`, `mid`, `right`) to update smoothly in the Sequence Renderer, so that I can clearly understand the search space reduction.
14. As an algorithm learner, I want BFS to display a Graph scene alongside an auxiliary Queue scene, so that I can observe the synchronous relationship between node traversal and queue FIFO operations.
15. As an algorithm learner, I want Heap Sort to show an Array scene and a Binary Tree scene simultaneously, so that I can see the direct index-to-tree mapping during sift-down operations.
16. As an algorithm learner, I want 0-1 Knapsack to highlight dependency cells in the DP grid before writing the computed maximum value, so that I understand state transitions visually.
17. As an algorithm learner, I want N-Queens to show queen placement, conflict line warnings, cell resets, and call stack updates during backtracking, so that I understand recursive trial-and-error mechanics.

### 4. 代码高亮与变量追踪 (Code & Variables)
18. As a learner using TypeScript, Go, or Rust, I want the code viewer to highlight the active line range via Semantic Code Anchors, so that the code reflects the exact execution step across different languages.
19. As an algorithm learner, I want to inspect a curated list of teaching variables (e.g., loop indices, temporary values, flags), so that I can verify theoretical equations against live runtime numbers.
20. As a reader of *Hello Algo*, I want to read the structured chapter explanation alongside the interactive canvas, so that I don't need to jump between external documentation and the animation.

### 5. 自定义输入与无状态分享 (Custom Input & Stateless Sharing)
21. As an algorithm learner, I want to input custom parameters (arrays, target values, matrix sizes, board dimensions) with immediate schema validation, so that I can test edge cases.
22. As an algorithm learner, I want to trigger random input generation backed by a deterministic PRNG seed, so that I can explore multiple valid configurations.
23. As a student or teacher, I want to click "Share" to copy a Stateless Share URL containing the algorithm ID, inputs, and seed, so that anyone opening the link sees the exact same reproducible execution.
24. As an algorithm learner, I want the Step Guard to safely terminate execution if my custom input produces an infinite loop or exceeds 10,000 steps, so that my browser never freezes.

### 6. 响应式布局、设计系统与无障碍 (Design, Responsive & Accessibility)
25. As a desktop user, I want a collapsible 3-column layout (Directory, Visual Canvas + Player, Code + Variables), so that I can optimize screen space according to my preferences.
26. As a mobile or tablet user, I want the visual canvas to span full width and the code/directory to open in sliding Sheets/Drawers, so that I can study effectively on touch devices.
27. As a dark mode user, I want all semantic state colors (Amber for comparing, Indigo for selecting, Emerald for sorted, Rose for conflict) to maintain high contrast and consistency.
28. As a user with color vision deficiencies, I want states to be distinguished by badges, icons, borders, and text labels in addition to color.
29. As a user with motion sensitivity, I want system Reduced Motion preferences to seamlessly replace spatial translations with lightweight fades while preserving full logical state transitions.
30. As an algorithm learner, I want local render errors to degrade gracefully into structured text steps, so that a canvas glitch never blocks me from reading the code and variables.

---

## Implementation Decisions

### 1. Monorepo & Package Architecture
- **Workspace layout**: Managed via `pnpm workspace`:
  - `apps/web`: React 18+ / TypeScript / Vite application shell, router, responsive layouts, page views.
  - `packages/algorithm-engine`: Pure algorithms, Tracer, Step Guard, Event types, Timeline Compiler, Reducers, Snapshot Store, Player controller, PRNG.
  - `packages/renderers-sequence`: Sequence / Array / Pointer / Bar renderer with Motion layout & recipes.
  - `packages/renderers-graph-tree`: React Flow + Dagre / d3-hierarchy integration for Graph and Tree scenes (lazy loaded).
  - `packages/renderers-grid-board`: CSS Grid / Matrix / Board renderer with dependency highlight recipes.
  - `packages/renderers-linked`: Linked list / Stack / Queue renderer with SVG edge overlays.
  - `packages/ui`: shadcn/ui components, OKLCH design tokens, Speed Context, theme providers.
  - `packages/content-adapter`: Hello Algo Markdown parser, Semantic Code Anchor maps, CodeMirror 6 read-only integration.

### 2. Pure Semantic Event & Snapshot Engine
- **Tracer Protocol**: Algorithms do not manipulate UI or animation timing directly. They call `tracer.emit(type, payload)` and `tracer.mark({ anchor, vars, narration })`.
- **Step Guard**: Tracer increments an internal counter per run. If the counter exceeds 10,000 steps, it throws a caught `StepLimitExceededError` with human-readable remediation suggestions.
- **Snapshot Storage**: For every `Marker`, the engine computes and retains an immutable `StateSnapshot` of all registered scenes. Seeking to marker $N$ is an instantaneous $O(1)$ state assignment.
- **Timeline Compiler**: Translates sequence of transactions into visual timeline cues, injecting duration scaled by current playback speed (`duration = baseDuration / speedFactor`).

### 3. Rendering & Motion Integration
- **Stable Entity IDs**: Data elements are assigned `e_0`, `e_1`, ... on trace initialization. These IDs serve as persistent React `key`s across all reorders.
- **Motion Recipes**: Normal transitions use CSS / Flex / Grid + Motion `layout`. Instructional emphasis (lift, pulse, highlight, path draw) uses declarative recipes.
- **Decoupled Lifecycle**: Motion `onComplete` is only used to orchestrate internal cue sequencing. It never mutates or commits algorithmic domain state.
- **Dynamic Import (Code Splitting)**: Graph and Tree scenes (`packages/renderers-graph-tree`) containing React Flow and layout libraries are loaded dynamically using `React.lazy()` upon navigating to corresponding algorithms.

### 4. Code & Variable Synchronization
- **Semantic Code Anchors**: Marker events specify semantic string anchors (e.g., `INIT_POINTERS`, `COMPARE_ADJACENT`, `SWAP_ELEMENTS`).
- **Language Manifest**: `packages/content-adapter` supplies code source strings for TypeScript, Go, and Rust, mapping anchors to 1-indexed line spans.
- **CodeMirror Integration**: Code is rendered in a lightweight read-only CodeMirror 6 editor with line decorations following active anchor ranges.

### 5. UI Layout & Accessibility
- **Three-Column Desktop Layout**: Left sidebar (Algorithms catalog, collapsible), Center main viewport (Canvas + Floating bottom player), Right sidebar (Tabbed CodeViewer and Live Variables).
- **Mobile Adaptations**: Center canvas displayed prominently; sidebars accessible via slide-over Drawers (`Sheet`).
- **Semantic Color Tokens**: Defined in Tailwind / CSS variables using OKLCH color space for accessible contrast in both light and dark themes.
- **Reduced Motion**: If `prefers-reduced-motion: reduce` is active, position translation durations collapse to 0ms with a 150ms opacity fade.
- **Local Error Boundary**: Visual canvas is wrapped in an isolated React Error Boundary. Canvas failures fallback to structured text step logs without crashing code or page navigation.

### 6. URL & Sharing Model
- **Stateless Query Model**: URLs encode algorithm parameters and seeds compactly (e.g. `?input=[4,1,3,1,5,2]&seed=42`).
- **Deterministic PRNG**: Implemented via 32-bit Mulberry32 algorithm ensuring seed-to-output consistency.

---

## Testing Decisions

### 1. What Makes a Good Test
- Tests must verify **external behavior and observable state**, not private implementation details or transient CSS classes.
- Algorithm tests must verify that given an input, the emitted events and final state snapshots match mathematical correctness.
- Replay tests must prove that stepping forward $N$ steps, seeking back to step $K$, and stepping forward again produces bit-for-bit identical state snapshots.

### 2. Module Test Seams
- **Algorithm & Tracer Seam (Highest Logic Seam)**:
  - Unit tests run pure algorithm functions against fixture inputs.
  - Assert that `trace(input)` completes within the step budget and produces valid sorted/traversed states.
- **Engine Reducer & Snapshot Seam**:
  - Feed emitted events into scene reducers; assert that snapshots at each marker accurately reflect domain changes (e.g. array order, visited sets, pointer coordinates).
  - Run bidirectional seek stress tests (forward, backward, random jump).
- **Input Schema & PRNG Seam**:
  - Validate Zod schema boundaries (e.g., reject arrays $>30$ elements, negative weights in Dijkstra).
  - Verify deterministic PRNG reproducibility across same seeds.
- **Component & Keyboard Seam**:
  - Using React Testing Library, verify playback controls, speed changes, keyboard shortcut bindings, and input form validations.
- **End-to-End & Visual Regression (Playwright)**:
  - Test core navigation flow across all 6 benchmark algorithms.
  - Capture visual snapshots of key Markers in Chromium/Firefox across Light/Dark modes to catch regression in motion layouts or element overlapping.

### 3. Prior Art & Tools
- Vitest for lightning-fast unit and reducer testing.
- Playwright for multi-browser E2E and visual snapshot assertions.

---

## Out of Scope (MVP)

- User authentication, cloud account synchronization, personal bookmarking, and progress tracking.
- Arbitrary user-submitted code compilation, sandboxed execution, or online judge (OJ) features.
- Multi-user collaborative classroom or live presentation broadcasting.
- High-performance Canvas/WebGL renderers for massive graphs ($>1,000$ nodes) or 3D visualizations.
- Automatic extraction and semantic mapping of arbitrary external Markdown articles without an explicit manifest.

---

## Further Notes

- **Upstream Asset Licensing**: *Hello Algo* text and media assets are governed by CC BY-NC-SA 4.0. The interactive engine code in `packages/*` and `apps/*` is structured independently to maintain clear intellectual property boundaries.
- **Benchmark Algorithm Suite**:
  1. Bubble Sort (`SequenceRenderer`)
  2. Binary Search (`SequenceRenderer`)
  3. Breadth-First Search (`GraphRenderer` + `QueueRenderer`)
  4. Heap Sort (`SequenceRenderer` + `TreeRenderer`)
  5. 0-1 Knapsack (`GridRenderer` + `ItemsList`)
  6. N-Queens (`BoardRenderer` + `CallStack`)
