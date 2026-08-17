# 05 — React Flow 图论渲染器与 BFS 复合场景

**What to build:**
算法学习者打开广度优先搜索（BFS）演示页面时，系统按需动态加载 React Flow 图渲染引擎；页面同时呈现主图结构画布、辅助队列（Queue）和已访问集合（Visited）；用户点击播放或步进时，节点变亮、边高亮遍历、队列元素进出与代码变量在同一个事务（Transaction）中完全同步联动。

**Blocked by:** 04 — 自定义输入表单、PRNG 随机数与无状态 URL 分享

**Status:** ready-for-agent

- [ ] 在 `packages/renderers-graph-tree` 中集成 React Flow 与 Dagre 布局计算，实现 `GraphRenderer`（支持节点高亮、边检查、访问次序动画，演示模式禁用自由拖拽编辑）。
- [ ] 在 `packages/renderers-linked` 中实现 `Linked/QueueRenderer`，展现辅助队列的 Push/Pop 动作。
- [ ] 在 `packages/algorithm-engine` 中实现 BFS 算法模块（无向图 + 起点参数），发出 `visit_node`, `traverse_edge`, `queue_push`, `queue_pop` 复合事件。
- [ ] 在 `apps/web` 中通过 `React.lazy()` 实现图渲染器的按需懒加载，并完成 Graph + Queue 复合场景在同一个 Timeline 下的同步验证与 Replay 测试。
