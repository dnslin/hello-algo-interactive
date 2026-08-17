# 03 — 算法详情三栏外壳、全局快捷键与二分查找

**What to build:**
为算法学习者提供更完善的三栏可折叠学习界面（左侧目录可折叠、中间主动画与悬浮播放器、右侧 Tab 切换代码与变量），支持键盘常用快捷键操作；同时在 `SequenceRenderer` 基础上交付第二个基准算法——**二分查找（Binary Search）**，直观呈现左右指针区间收缩与未命中目标的情况。

**Blocked by:** 02 — 冒泡排序端到端垂直贯穿演示 (P0 Tracer-Bullet)

**Status:** ready-for-agent

- [ ] 实现桌面端响应式三栏布局（侧边栏目录收起/展开、代码与变量 Tab 切换），移动端支持 Drawer/Sheet 抽屉模式。
- [ ] 实现全局键盘快捷键监听（`Space` 播放暂停、`Left/Right Arrow` 与 `J/K` 步进、`Home/End` 跳端、`[`/`]` 调速），在表单输入聚焦时自动屏蔽快捷键。
- [ ] 支持无障碍 `Reduced Motion`（检测到系统开启时自动将位置补间时长降为 0ms，替换为 150ms 淡入淡出）。
- [ ] 在 `packages/algorithm-engine` 中实现二分查找算法（有序数组 + 目标值），支持 `pointer_move`、`range_exclude`、`target_found` / `target_not_found` 语义事件。
- [ ] 在 `SequenceRenderer` 中支持左右指针（`left`, `mid`, `right`）徽标与排除暗化区间渲染，并通过单元测试与 UI 验收。
