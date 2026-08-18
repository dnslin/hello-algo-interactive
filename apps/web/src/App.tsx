import { useState, useEffect } from 'react';
import {
  Button,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  StatusPill,
  STATE_COLORS,
  MOTION_TOKENS,
  type VisualizationState,
} from '@hello-algo/ui';

const BENCHMARK_ALGORITHMS = [
  {
    id: 'bubble-sort',
    title: '冒泡排序 (Bubble Sort)',
    category: '排序算法',
    renderers: 'SequenceRenderer',
    status: 'Tracer Bullet #02',
  },
  {
    id: 'binary-search',
    title: '二分查找 (Binary Search)',
    category: '搜索算法',
    renderers: 'SequenceRenderer',
    status: 'Sprint 03',
  },
  {
    id: 'bfs',
    title: '广度优先遍历 (BFS)',
    category: '图算法',
    renderers: 'GraphRenderer + QueueRenderer',
    status: 'Sprint 05',
  },
  {
    id: 'heap-sort',
    title: '堆排序 (Heap Sort)',
    category: '树/堆算法',
    renderers: 'SequenceRenderer + TreeRenderer',
    status: 'Sprint 06',
  },
  {
    id: '01-knapsack',
    title: '0-1 背包问题 (0-1 Knapsack)',
    category: '动态规划',
    renderers: 'GridRenderer + ItemsList',
    status: 'Sprint 07',
  },
  {
    id: 'n-queens',
    title: 'N 皇后问题 (N-Queens)',
    category: '回溯算法',
    renderers: 'BoardRenderer + CallStack',
    status: 'Sprint 08',
  },
];

const PACKAGES = [
  { name: '@hello-algo/algorithm-engine', desc: '纯语义事件、Step Guard、时间轴与快照引擎' },
  { name: '@hello-algo/renderers-sequence', desc: '序列 / 数组 / 双指针场景渲染器' },
  { name: '@hello-algo/renderers-graph-tree', desc: '图与树场景渲染器' },
  { name: '@hello-algo/renderers-grid-board', desc: '网格、DP 矩阵与棋盘场景渲染器' },
  { name: '@hello-algo/renderers-linked', desc: '链表、栈与队列场景渲染器' },
  { name: '@hello-algo/ui', desc: 'OKLCH 语义设计 Tokens 与通用组件' },
  { name: '@hello-algo/content-adapter', desc: '《Hello 算法》内容资产与语义代码锚点适配器' },
];

export function App() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  const states: VisualizationState[] = [
    'idle',
    'comparing',
    'active',
    'selected',
    'visited',
    'sorted',
    'conflict',
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20">
      {/* Top Navigation */}
      <header className="border-b border-border bg-card/60 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg shadow-sm">
              H
            </div>
            <div>
              <h1 className="font-bold text-base leading-tight">
                Hello Algo Interactive
              </h1>
              <p className="text-xs text-muted-foreground">
                基于《Hello 算法》的交互式演示平台
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="hidden sm:inline-flex">
              v0.1.0 MVP
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              aria-label="Toggle Theme"
            >
              {isDark ? '☀️ 浅色模式' : '🌙 深色模式'}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 space-y-10 w-full">
        {/* Hero Section */}
        <section className="space-y-4 text-center max-w-3xl mx-auto pt-4">
          <Badge variant="secondary" className="px-3 py-1 text-sm font-medium">
            🚀 01 — Monorepo 脚手架与核心包骨架已就绪
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            高品质、可推演、连续空间的算法交互体验
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed">
            基于纯语义事件（Semantic Events）、不可变状态快照（State Snapshots）与多场景渲染器（Multi-Renderer Plugins），彻底解耦算法逻辑与动画表现。
          </p>
        </section>

        {/* OKLCH Semantic State Tokens Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold tracking-tight">
                OKLCH 算法状态语义色盘 (Design Tokens)
              </h3>
              <p className="text-sm text-muted-foreground">
                在深浅双色模式下均符合 WCAG 无障碍对比度标准，双重编码保证视觉可达性
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {states.map((state) => {
              const def = STATE_COLORS[state];
              return (
                <Card key={state} className="p-3 text-center space-y-2">
                  <div className="flex justify-center">
                    <StatusPill state={state} />
                  </div>
                  <div className="text-xs text-muted-foreground font-mono">
                    {def.name}
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Motion Tokens Section */}
        <section className="space-y-4">
          <div>
            <h3 className="text-xl font-bold tracking-tight">
              Motion 运动规范 (Motion Tokens)
            </h3>
            <p className="text-sm text-muted-foreground">
              统一的物理运动节拍，支持无障碍减少动画（Reduced Motion）与倍速伸缩
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(MOTION_TOKENS).map(([key, token]) => (
              <Card key={key}>
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold">{key}</CardTitle>
                    <Badge variant="secondary">{token.durationMs}ms</Badge>
                  </div>
                  <CardDescription className="text-xs">{token.description}</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0 font-mono text-[11px] text-muted-foreground truncate">
                  {token.easing}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Monorepo Packages Grid */}
        <section className="space-y-4">
          <div>
            <h3 className="text-xl font-bold tracking-tight">
              Monorepo 核心包架构
            </h3>
            <p className="text-sm text-muted-foreground">
              严格分层的单一职责包结构
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PACKAGES.map((pkg) => (
              <Card key={pkg.name} className="hover:border-primary/50 transition-colors">
                <CardHeader className="p-4">
                  <CardTitle className="text-sm font-mono text-primary font-medium">
                    {pkg.name}
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">
                    {pkg.desc}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* Benchmark Algorithms Suite */}
        <section className="space-y-4">
          <div>
            <h3 className="text-xl font-bold tracking-tight">
              基准算法套件 (Benchmark Algorithm Suite)
            </h3>
            <p className="text-sm text-muted-foreground">
              覆盖序列、二分查找、图、堆、动态规划与回溯的完整 MVP 算法清单
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {BENCHMARK_ALGORITHMS.map((algo) => (
              <Card key={algo.id} className="flex flex-col justify-between">
                <CardHeader className="p-4">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="outline" className="text-xs">
                      {algo.category}
                    </Badge>
                    <span className="text-[11px] text-muted-foreground font-mono">
                      {algo.status}
                    </span>
                  </div>
                  <CardTitle className="text-base font-bold mt-2">
                    {algo.title}
                  </CardTitle>
                  <CardDescription className="text-xs font-mono text-muted-foreground mt-1">
                    {algo.renderers}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 bg-card text-center text-xs text-muted-foreground mt-12">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p>
            Hello Algo Interactive — 知识内容遵循 CC BY-NC-SA 4.0 协议
          </p>
          <p className="text-[11px]">
            基于 React 18+, TypeScript, Vite, Tailwind CSS 与 Motion 构建
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
