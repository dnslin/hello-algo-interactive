# ADR 0002: 基于语义锚点的多语言代码高亮与变量同步

## 状态
已接受 (Accepted)

## 上下文 (Context)
《Hello 算法》拥有丰富的多语言代码资产（TypeScript、Go、Rust、Java、C++、Python 等）。
如果算法打点时直接硬编码行号（例如 `line: 14`），会面临两个致命问题：
1. 任何代码格式化、增删注释都会导致硬编码行号失效；
2. 不同编程语言的语法结构差异大，同一逻辑动作在不同语言中的行号和行数范围完全不同，无法使用单一数值复用。

## 决策 (Decision)
1. **抽象语义锚点（Semantic Code Anchors）**：算法生成事件时不绑定具体行号，而是发出抽象语义标识（例如 `LOOP_COMPARE`、`SWAP_ELEMENTS`、`PARTITION_PIVOT`）。
2. **语言代码 Manifest 映射**：每种语言的代码文件独立维护一份 Anchor 映射表（或使用轻量代码注释标签），将语义标识映射到该语言的行号区间。
3. **显式声明教学变量**：在 Marker 打点处显式传入当前需要展示的局部变量字典（`vars: { i, j, isSwapped }`），CodeMirror / VariablePanel 仅在 Marker 处于 settled 状态时更新。

## 影响 (Consequences)
- **正面影响**：
  - 一套算法交互动画运行时，可无缝无损地驱动多语言教材代码的高亮与同步。
  - 代码增删排版改动只需维护局部映射配置，算法核心 Trace 零修改。
- **负面影响/权衡**：
  - 每引入一门新的编程语言代码，需要配置该语言的 Anchor 映射文件。
