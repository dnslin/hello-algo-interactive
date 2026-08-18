import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  DEFAULT_BUBBLE_SORT_INPUT,
  traceBubbleSort,
  TimelineCompiler,
  Player,
  createMulberry32,
  type PlayerState,
} from '@hello-algo/algorithm-engine';
import {
  createInitialSequenceState,
  SequenceRenderer,
  type SequenceSceneState,
} from '@hello-algo/renderers-sequence';
import { Badge, Button, Card, CardHeader, CardTitle, CardContent } from '@hello-algo/ui';
import { Sparkles, Dna, Shuffle, HelpCircle } from 'lucide-react';
import { PlaybackControls } from './PlaybackControls.js';
import { CodePanel } from './CodePanel.js';
import { VariableInspector } from './VariableInspector.js';

const PRESET_INPUTS: { label: string; values: number[]; description: string }[] = [
  {
    label: '示踪弹基准 (含重复值)',
    values: DEFAULT_BUBBLE_SORT_INPUT,
    description: '演示稳定排序与稳定 Entity ID 保持',
  },
  {
    label: '逆序输入 (最差情况)',
    values: [6, 5, 4, 3, 2, 1],
    description: '最大比较与换位次数 O(n²)',
  },
  {
    label: '已序输入 (最佳情况)',
    values: [1, 2, 3, 4, 5, 6],
    description: '顺序正确，仅需遍历无需换位',
  },
  {
    label: '乱序序列',
    values: [8, 3, 5, 1, 9, 2],
    description: '常规随机序列排序演示',
  },
];

export function BubbleSortVisualizer() {
  const [inputArray, setInputArray] = useState<number[]>(DEFAULT_BUBBLE_SORT_INPUT);
  const [customInputText, setCustomInputText] = useState('4, 1, 3, 1, 5, 2');
  const [inputError, setInputError] = useState<string | null>(null);
  const [seed, setSeed] = useState(42);

  // Compile timeline from algorithm trace
  const timeline = useMemo(() => {
    const traceResult = traceBubbleSort(inputArray);
    const initialScene = createInitialSequenceState(inputArray);
    return TimelineCompiler.compile<number[], { main: SequenceSceneState<number> }>(
      traceResult,
      { initialScenes: { main: initialScene } }
    );
  }, [inputArray]);

  // Create persistent Player instance
  const [player, setPlayer] = useState<Player<number[], { main: SequenceSceneState<number> }> | null>(null);
  const [playerState, setPlayerState] = useState<PlayerState<{ main: SequenceSceneState<number> }>>(() => {
    const p = new Player<number[], { main: SequenceSceneState<number> }>(timeline, {
      initialSpeed: 1,
      stepIntervalMs: 700,
    });
    return p.getState();
  });

  // Re-instantiate player whenever timeline changes
  useEffect(() => {
    const newPlayer = new Player<number[], { main: SequenceSceneState<number> }>(timeline, {
      initialSpeed: playerState.speed,
      loop: playerState.isLooping,
      stepIntervalMs: 700,
    });

    setPlayer(newPlayer);
    const unsubscribe = newPlayer.subscribe((state) => {
      setPlayerState(state);
    });

    return () => {
      unsubscribe();
      newPlayer.destroy();
    };
  }, [timeline]);

  // Keyboard shortcut controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore key events when user is typing in input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        player?.togglePlay();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        player?.stepForward();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        player?.stepBackward();
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        player?.reset();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [player]);

  const handleApplyPreset = (values: number[]) => {
    setInputError(null);
    setInputArray(values);
    setCustomInputText(values.join(', '));
  };

  const handleApplyCustomInput = () => {
    try {
      const parts = customInputText
        .split(/[,，\s]+/)
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => {
          const num = Number(s);
          if (isNaN(num)) {
            throw new Error(`"${s}" 不是合法的数字`);
          }
          return num;
        });

      if (parts.length < 2) {
        throw new Error('请输入至少 2 个数字');
      }
      if (parts.length > 12) {
        throw new Error('为了最佳视觉演示效果，建议输入 2 ~ 12 个数字');
      }

      setInputError(null);
      setInputArray(parts);
    } catch (err) {
      setInputError(err instanceof Error ? err.message : '输入格式错误');
    }
  };

  const handleRandomize = useCallback(() => {
    const nextSeed = seed + 1;
    setSeed(nextSeed);
    const prng = createMulberry32(nextSeed);
    const len = 6;
    const randomized = Array.from({ length: len }, () => Math.floor(prng() * 9) + 1);
    setInputError(null);
    setInputArray(randomized);
    setCustomInputText(randomized.join(', '));
  }, [seed]);

  const currentSceneState = playerState.currentSnapshot.scenes.main;
  const currentMarker = playerState.currentMarker;

  return (
    <div className="w-full flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Algorithm Header & Complexity Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-card border border-border shadow-sm">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <span>冒泡排序</span>
              <span className="text-base font-normal text-muted-foreground font-mono">
                (Bubble Sort)
              </span>
            </h2>
            <Badge variant="default" className="bg-primary/90 text-xs font-mono">
              P0 Tracer-Bullet
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            通过连续比较相邻元素并在逆序时进行换位，让较大元素像气泡一样逐步“浮”到未排序区间的顶端。
          </p>
        </div>

        {/* Complexity & Property Badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono shrink-0">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted/60 border border-border/60">
            <span className="text-muted-foreground">时间:</span>
            <span className="font-semibold text-foreground">O(n²)</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted/60 border border-border/60">
            <span className="text-muted-foreground">空间:</span>
            <span className="font-semibold text-foreground">O(1)</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <span>稳定性: 稳定</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <span>原地排序: 是</span>
          </div>
        </div>
      </div>

      {/* Input Presets & Custom Configuration */}
      <Card>
        <CardHeader className="py-3 px-4 flex flex-row items-center justify-between border-b border-border/60">
          <div className="flex items-center gap-2">
            <Dna className="w-4 h-4 text-primary" />
            <CardTitle className="text-sm font-semibold">输入数据与场景预设</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRandomize}
            className="h-7 text-xs text-muted-foreground gap-1 hover:text-foreground"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>确定性随机 (Mulberry32)</span>
          </Button>
        </CardHeader>
        <CardContent className="p-4 flex flex-col gap-3">
          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground mr-1">预设模式:</span>
            {PRESET_INPUTS.map((preset) => {
              const isSelected =
                JSON.stringify(inputArray) === JSON.stringify(preset.values);
              return (
                <button
                  key={preset.label}
                  onClick={() => handleApplyPreset(preset.values)}
                  className={`px-3 py-1 text-xs rounded-lg border font-mono transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-primary text-primary-foreground border-primary font-semibold shadow-xs'
                      : 'bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground border-border/60'
                  }`}
                  title={preset.description}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>

          {/* Custom Input */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-medium text-muted-foreground mr-1">自定义数组:</span>
            <input
              type="text"
              value={customInputText}
              onChange={(e) => setCustomInputText(e.target.value)}
              placeholder="例如: 4, 1, 3, 1, 5, 2"
              className="flex-1 min-w-[200px] h-8 px-3 text-xs font-mono rounded-lg border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <Button
              variant="secondary"
              size="sm"
              onClick={handleApplyCustomInput}
              className="h-8 text-xs px-3"
            >
              应用输入
            </Button>
          </div>
          {inputError && (
            <p className="text-xs text-destructive font-medium">{inputError}</p>
          )}
        </CardContent>
      </Card>

      {/* Main Two-Column Layout: Visualizer & Code Sync */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Visualizer Canvas + Playback Controls + Variables */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* Visual Canvas Card */}
          <Card className="overflow-hidden border-border shadow-md">
            <CardHeader className="py-3 px-4 border-b border-border/60 bg-muted/20 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <CardTitle className="text-sm font-semibold">可视化动画视口 (Sequence Scene)</CardTitle>
              </div>
              <span className="text-xs font-mono text-muted-foreground">
                Entity Continuity: Active
              </span>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 bg-background flex flex-col items-center justify-center min-h-[300px]">
              <SequenceRenderer
                state={currentSceneState}
                speed={playerState.speed}
                showEntityIds={true}
                showIndices={true}
                showPointers={true}
                showHeightBars={true}
              />
            </CardContent>
          </Card>

          {/* Playback Controls */}
          <PlaybackControls
            status={playerState.status}
            currentIndex={playerState.currentIndex}
            totalMarkers={playerState.totalMarkers}
            speed={playerState.speed}
            isLooping={playerState.isLooping}
            onPlay={() => player?.play()}
            onPause={() => player?.pause()}
            onTogglePlay={() => player?.togglePlay()}
            onStepForward={() => player?.stepForward()}
            onStepBackward={() => player?.stepBackward()}
            onSeek={(idx) => player?.seek(idx)}
            onSetSpeed={(s) => player?.setSpeed(s)}
            onToggleLoop={() => player?.setLoop(!playerState.isLooping)}
            onReset={() => player?.reset()}
          />

          {/* Narration & Live Variables */}
          <VariableInspector currentMarker={currentMarker} />
        </div>

        {/* Right Column: Multilingual Code Panel & Architecture Notes */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* Synchronized Code Panel */}
          <CodePanel currentAnchor={currentMarker?.codeAnchor} />

          {/* Tracer-Bullet Architecture Note */}
          <Card className="border-border/60 bg-muted/20 text-xs">
            <CardHeader className="py-3 px-4 border-b border-border/40 flex flex-row items-center gap-2">
              <HelpCircle className="w-4 h-4 text-primary" />
              <CardTitle className="text-xs font-semibold">示踪弹设计与技术不变量</CardTitle>
            </CardHeader>
            <CardContent className="p-4 text-muted-foreground leading-relaxed flex flex-col gap-2 font-sans">
              <p>
                • <strong>稳定 Entity ID</strong>：数组元素由稳定标识符（如 <code>#0</code>, <code>#1</code>）承载，在换位与移动时保持 DOM/React 空间连续性，防止重复数值键冲突。
              </p>
              <p>
                • <strong>O(1) 状态快照与回退</strong>：所有时间步均由 TimelineCompiler 计算为不可变状态快照，单步后退与进度条拖拽零延迟且无状态漂移。
              </p>
              <p>
                • <strong>语义代码锚点</strong>：算法核心通过抽象锚点（如 <code>@COMPARE</code>, <code>@SWAP</code>）跨语言精准高亮，解耦物理代码行号。
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
