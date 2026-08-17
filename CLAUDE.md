# Project Guide: Hello Algo Interactive

基于《Hello 算法》内容资产的高质量交互式算法演示平台。

## Agent skills

### Issue tracker

Issues and specs for this repo live as GitHub issues. See `docs/agents/issue-tracker.md`.

### Domain docs

Single-context layout: root `CONTEXT.md` and `docs/adr/`. See `docs/agents/domain.md`.

## Engineering Workflow

- **Monorepo Structure**: `apps/web` (React+Vite) and `packages/*` (`algorithm-engine`, `renderers-*`, `ui`, `content-adapter`).
- **Package Manager**: `pnpm` (Workspace).
- **Core Principles**:
  - Pure semantic events with immutable state snapshots per marker.
  - Decoupled state and animation (Motion layout & recipes).
  - Stable Entity IDs for DOM/React reconciliation.
  - Multi-language synchronization via Semantic Code Anchors.

## Key Commands

- `pnpm install` — Install all dependencies across workspace
- `pnpm dev` — Start Vite development server
- `pnpm test` — Run Vitest suite across all packages
- `pnpm typecheck` — Run TypeScript type checking (`tsc --noEmit`)
- `pnpm build` — Build production bundles
