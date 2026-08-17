# ADR 0003: 渲染器插件化按需加载与局部错误边界降级

## 状态
已接受 (Accepted)

## 上下文 (Context)
项目需要覆盖多种视觉模型（Sequence、Linked、Graph、Tree、Grid、Board 等），其中 Graph 和 Tree 依赖较重型的第三方图布局库与画布库（如 React Flow、Dagre、ELK）。如果将所有渲染器和算法全量打包进主入口，会导致首屏包体积过大。
同时，复杂算法在渲染极端边界数据时，如果出现 DOM/SVG 渲染异常，不能导致整站崩溃。

## 决策 (Decision)
1. **路由与算法级动态加载（Dynamic Import / Lazy Load）**：
   - 基础 Sequence 和 Grid 渲染器轻量内置；
   - 重型渲染器（Graph / Tree / React Flow）采用 Vite `React.lazy()` 进行按需拆包加载。
2. **复合场景插件化（Renderer Plugin Interface）**：
   - 渲染器实现统一的纯函数 `reduce(state, event)`、`render(props)` 和 `getRecipe(event)` 接口，多个场景由 Timeline Transaction 统一驱动。
3. **局部错误边界（Local Error Boundary）**：
   - 主画布区域设置独立 Error Boundary。动效渲染抛出异常时仅将主画布降级为“步骤说明与文字状态”，右侧代码面板和变量面板不受影响，保障学习闭环可用。

## 影响 (Consequences)
- **正面影响**：
  - 首屏秒开，网络负载极低。
  - 单个渲染器故障不会导致整页白屏，具备良好的容灾与容错体验。
- **负面影响/权衡**：
  - 首次打开图论算法时会有一次轻微的异步模块加载过渡。
