# 04 — 自定义输入表单、PRNG 随机数与无状态 URL 分享

**What to build:**
算法学习者可以点击“修改输入”打开参数配置表单，输入自定义数据或点击“随机生成”；系统通过 Zod 即时校验输入合法性；点击“运行”后基于确定性 PRNG（Mulberry32）生成全新的演示轨迹并重置时间轴；用户可一键“复制分享链接”，他人打开链接能 100% 精确复现相同数据与运行轨迹；若输入导致死循环或超限，由 Step Guard 友好熔断并给出提示。

**Blocked by:** 03 — 算法详情三栏外壳、全局快捷键与二分查找

**Status:** ready-for-agent

- [ ] 集成 React Hook Form + Zod，为冒泡排序与二分查找建立 `inputSchema`（数组长度限制 $\le 30$、数值范围、有序校验等）及表单组件。
- [ ] 在 `packages/algorithm-engine` 中集成 Mulberry32 确定性 PRNG，算法中的随机操作与“随机示例”按钮生成带 Seed 的可复现数据。
- [ ] 实现 Stateless Share URL 解析与编码（将算法 ID、自定义输入和 Seed 编码至 URL Query），页面加载时优先从 URL 还原状态。
- [ ] 验证 Step Guard 熔断保护：构造触发死循环或超大步数的测试用例，验证引擎正确抛出 `StepLimitExceededError` 并在 UI 展现友好错误提示。
