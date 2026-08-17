# 02 — 冒泡排序端到端垂直贯穿演示 (P0 Tracer-Bullet)

**What to build:**
构建打通第一条垂直贯穿链路的“示踪弹（Tracer-bullet）”：算法学习者打开冒泡排序演示页面，能够看到平滑且保持稳定 Entity ID 的数组元素；点击播放、暂停、单步前进（Step Forward）、单步后退（Step Backward）以及调速时，元素换位动画与高亮比较自然流畅，右侧代码面板同步高亮对应的 TypeScript 代码行（基于 Semantic Code Anchor），变量看板同步更新循环索引与状态值。

**Blocked by:** 01 — Monorepo 脚手架与核心包骨架初始化

**Status:** ready-for-agent

- [ ] 在 `packages/algorithm-engine` 中实现 Tracer、Step Guard、纯语义事件（`compare`, `swap`, `mark`）、Timeline Compiler、Pure Reducer、State Snapshot 存储与 Player 控制器。
- [ ] 在 `packages/algorithm-engine` 中实现冒泡排序算法模块（默认输入 `[4, 1, 3, 1, 5, 2]`，生成稳定 Entity ID），并编写纯函数单元测试与 Replay 幂等性测试（前进 $N$ 步后退 $K$ 步状态一致）。
- [ ] 在 `packages/renderers-sequence` 中实现 `SequenceRenderer`，基于 Motion `layout` 与比较动效 Recipe 实现元素浮起、换位、已排序（sorted）状态展示。
- [ ] 在 `packages/content-adapter` 中提供冒泡排序 TypeScript 代码与 Semantic Code Anchor 映射配置。
- [ ] 在 `apps/web` 页面中完成播放器控制器（Play/Pause/Step/Speed/Seek/Reset）、画布与代码面板的集成联动，并在浏览器中验证端到端交互闭环。
