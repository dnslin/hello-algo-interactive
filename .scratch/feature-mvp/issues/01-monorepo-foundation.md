# 01 — Monorepo 脚手架与核心包骨架初始化

**Parent:** Part of #1

**What to build:**
搭建基于 pnpm workspace 的 Monorepo 项目结构与工程基建。开发者和构建系统能够一键安装依赖、执行 TypeScript 类型检查、运行 Vitest 测试套件，并在本地启动包含 Tailwind CSS 与基础 Design Tokens 的 Vite 开发服务器，在浏览器中查看基础 Web Shell 骨架。

**Blocked by:** None — can start immediately

**GitHub Issue:** #2

**Status:** complete

- [x] 配置 `pnpm-workspace.yaml` 与根目录 `package.json`，创建 `apps/web` 与 `packages/*`（`algorithm-engine`, `renderers-sequence`, `renderers-graph-tree`, `renderers-grid-board`, `renderers-linked`, `ui`, `content-adapter`）的基础 `package.json` 和 `tsconfig.json`。
- [x] 在 `packages/ui` 中初始化基于 Tailwind CSS 的 OKLCH 语义色盘（idle, comparing, active, selected, visited, sorted, conflict）与基础 Motion Tokens。
- [x] 在 `apps/web` 中配置 React 18+ 与 Vite，能正常渲染带有基础主题样式的欢迎外壳。
- [x] 在根目录配置全局 `pnpm test` (Vitest) 与 `pnpm typecheck` (tsc --noEmit)，在 CI/命令行中全部通过。
