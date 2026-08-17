# 07 — CSS Grid 渲染器与 0-1 背包动态规划

**What to build:**
算法学习者打开 0-1 背包问题（0-1 Knapsack）页面时，能够直观看到物品清单（重量/价值）与二维 DP 状态表格；在计算每一个状态转移时，系统先聚焦高亮所依赖的上方单元格与左上方单元格（因果因数），再淡入写入当前单元格的最大价值计算结果，彻底揭示动态规划的状态转移方程推导过程。

**Blocked by:** 04 — 自定义输入表单、PRNG 随机数与无状态 URL 分享

**Status:** ready-for-agent

- [ ] 在 `packages/renderers-grid-board` 中基于 CSS Grid + Motion 实现 `GridRenderer`，支持单元格聚焦、依赖单元格连线/高亮、数值写入与已完成状态。
- [ ] 在 `packages/algorithm-engine` 中实现 0-1 背包算法模块（物品列表 + 背包容量），发出 `highlight_deps`, `calculate_cell`, `select_item` 语义事件。
- [ ] 在 `apps/web` 页面中集成 Items List + DP Grid 复合场景，验证依赖高亮先于写入展示的教学节奏。
- [ ] 编写 0-1 背包 DP 状态转移 Reducer 测试与 Replay 验证。
