# 08 — 棋盘回溯渲染器与 N 皇后算法

**What to build:**
算法学习者打开 N 皇后（N-Queens）算法页面时，能够看到 $N \times N$ 棋盘画布与递归调用栈（Call Stack）辅助视图；当算法放置皇后时显示落子动画，检测到同行/同列/对角线冲突时高亮红色警示线，回溯时平滑撤销棋子并退出调用栈层级，完整展示回溯搜索树的遍历与剪枝过程。

**Blocked by:** 07 — CSS Grid 渲染器与 0-1 背包动态规划

**Status:** ready-for-agent

- [ ] 在 `packages/renderers-grid-board` 中扩展 `BoardRenderer`，支持棋盘单元格渲染、皇后棋子图标放置、攻击冲突线（行、列、两条对角线）高亮与撤销退回（Backtrack）动效。
- [ ] 在 `packages/algorithm-engine` 中实现 N 皇后算法模块（支持 $N=4 \sim 8$），发出 `place_queen`, `conflict_detected`, `remove_queen`, `solution_found`, `call_stack_push`, `call_stack_pop` 语义事件。
- [ ] 在 `apps/web` 中集成 Board + Call Stack 复合场景，验证回溯撤销与递归深度同步。
- [ ] 编写 N 皇后多解搜索、冲突检测逻辑单元测试与回溯 Replay 测试。
