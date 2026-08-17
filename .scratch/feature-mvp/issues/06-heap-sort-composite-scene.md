# 06 — 堆排序双场景联动演示 (Array + Binary Tree)

**What to build:**
算法学习者打开堆排序（Heap Sort）页面时，主画布同时呈现一维数组序列场景与二叉堆树形场景；当算法执行建堆与下沉（Sift-down）换位时，数组中的方格与树上的节点同时高亮，并以相同的实体 ID 同步完成换位动画，直观揭示数组下标与完全二叉树的映射规律。

**Blocked by:** 05 — React Flow 图论渲染器与 BFS 复合场景

**Status:** ready-for-agent

- [ ] 在 `packages/renderers-graph-tree` 中实现基于树形分层布局的 `TreeRenderer`（或增强 React Flow 树形拓扑支持）。
- [ ] 在 `packages/algorithm-engine` 中实现堆排序算法模块（默认 7~10 个整数），发出带有 `array` 与 `tree` 双场景目标 ID 的 `compare`, `swap`, `heap_size_change` 语义事件。
- [ ] 在 `apps/web` 页面中完成 Sequence + Tree 复合场景的并排/上下协同展示，验证换位时数组节点与二叉树节点动画完全同步。
- [ ] 编写堆排序单元测试与快照回溯测试，验证反向步进与快速 Seek 时的状态准确性。
