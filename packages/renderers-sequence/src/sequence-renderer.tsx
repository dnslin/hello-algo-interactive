import { useMemo, type ReactElement } from 'react';
import {
  MOTION_TOKENS,
  getScaledDuration,
} from '@hello-algo/ui';
import type { SequenceElement, SequencePointer, SequenceSceneState } from './types.js';

export interface SequenceRendererProps<T = number> {
  state: SequenceSceneState<T>;
  speed?: number;
  className?: string;
  showIndices?: boolean;
  showEntityIds?: boolean;
  showPointers?: boolean;
  showHeightBars?: boolean;
  showConnectingArcs?: boolean;
  maxValue?: number;
  onElementClick?: (element: SequenceElement<T>, index: number) => void;
}

export function SequenceRenderer<T = number>({
  state,
  speed = 1,
  className = '',
  showIndices = true,
  showEntityIds = true,
  showPointers = true,
  showHeightBars = true,
  showConnectingArcs = true,
  maxValue,
  onElementClick,
}: SequenceRendererProps<T>): ReactElement {
  const { elements, pointers, sortedIndices } = state;

  // Calculate dynamic maximum value for proportional height fill
  const numericValues = elements
    .map((el) => (typeof el.value === 'number' ? el.value : 0))
    .filter((v) => !isNaN(v));
  const computedMax = maxValue ?? (numericValues.length > 0 ? Math.max(...numericValues, 1) : 1);

  const moveDuration = getScaledDuration(MOTION_TOKENS.move.durationMs, speed);
  const compareDuration = getScaledDuration(MOTION_TOKENS.compare.durationMs, speed);

  // Group pointers by element index
  const pointersByIndex = useMemo(() => {
    const map = new Map<number, SequencePointer[]>();
    for (const ptr of pointers) {
      if (ptr.index >= 0) {
        const existing = map.get(ptr.index) ?? [];
        existing.push(ptr);
        map.set(ptr.index, existing);
      }
    }
    return map;
  }, [pointers]);

  // Identify actively comparing element pair
  const comparingPair = useMemo(() => {
    const indices: number[] = [];
    elements.forEach((el, idx) => {
      if (el.state === 'comparing') {
        indices.push(idx);
      }
    });
    if (indices.length === 2) {
      const [a, b] = indices.sort((x, y) => x - y);
      const valA = Number(elements[a]?.value);
      const valB = Number(elements[b]?.value);
      const isReverse = !isNaN(valA) && !isNaN(valB) && valA > valB;
      return { idxA: a, idxB: b, valA, valB, isReverse };
    }
    return null;
  }, [elements]);

  // Determine boundary between unsorted and sorted partitions
  const sortedBoundary = useMemo(() => {
    if (sortedIndices.length === 0 || sortedIndices.length === elements.length) {
      return null;
    }
    // In bubble sort, sorted indices form a suffix [minSorted ... n-1]
    const minSorted = Math.min(...sortedIndices);
    return minSorted > 0 ? minSorted : null;
  }, [sortedIndices, elements.length]);

  return (
    <div
      role="region"
      aria-label="数组序列可视化画布"
      className={`w-full flex flex-col items-center justify-center p-2 sm:p-4 select-none ${className}`}
    >
      {/* SVG Definitions for Arrows & Glow Filters */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <linearGradient id="amber-glow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#fbbf24" stopOpacity="1" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="emerald-glow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#059669" stopOpacity="0.9" />
          </linearGradient>
          <filter id="glow-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#f59e0b" floodOpacity="0.5" />
          </filter>
          <marker
            id="arrow-amber-right"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#f59e0b" />
          </marker>
          <marker
            id="arrow-amber-left"
            viewBox="0 0 10 10"
            refX="4"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 10 1 L 0 5 L 10 9 z" fill="#f59e0b" />
          </marker>
        </defs>
      </svg>

      {/* Floating Comparison Arch & Status Pill Layer */}
      {showConnectingArcs && comparingPair && (
        <div className="w-full flex justify-center items-center h-8 mb-1 animate-in fade-in zoom-in-95 duration-200">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold shadow-lg border transition-all ${
              comparingPair.isReverse
                ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-amber-500/25 ring-2 ring-amber-400/40 animate-pulse'
                : 'bg-emerald-600 text-white border-emerald-400 shadow-emerald-500/20'
            }`}
          >
            <span className="flex items-center gap-1">
              <span>{comparingPair.valA}</span>
              <span className="text-sm font-extrabold">
                {comparingPair.isReverse ? '>' : '≤'}
              </span>
              <span>{comparingPair.valB}</span>
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-black/15 font-sans font-semibold">
              {comparingPair.isReverse ? '逆序 需换位 ⇄' : '顺序正确 无需换位 ✓'}
            </span>
          </div>
        </div>
      )}

      {/* Pointers row */}
      {showPointers && (
        <div className="w-full flex justify-center items-end h-9 gap-2 sm:gap-3.5 mb-2 px-2 overflow-x-auto min-w-0">
          {elements.map((el, idx) => {
            const ptrs = pointersByIndex.get(idx) ?? [];
            return (
              <div
                key={`ptr-col-${el.id}`}
                className="w-16 sm:w-20 flex flex-col items-center justify-end shrink-0"
              >
                {ptrs.map((p) => {
                  const isIPointer = p.name === 'i';
                  const isJPointer = p.name === 'j';
                  const badgeColorClass = isIPointer
                    ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-blue-500/25 ring-1 ring-blue-400/40'
                    : isJPointer
                    ? 'bg-purple-600 dark:bg-purple-500 text-white shadow-purple-500/25 ring-1 ring-purple-400/40'
                    : 'bg-primary text-primary-foreground';

                  return (
                    <span
                      key={`${p.name}-${p.index}`}
                      style={{
                        transition: `all ${moveDuration}ms ${MOTION_TOKENS.move.easing}`,
                      }}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-mono font-bold rounded-full shadow-md ${badgeColorClass} animate-in fade-in zoom-in-95`}
                    >
                      <span className="text-[10px] leading-none">↓</span>
                      <span>{p.label ?? p.name}</span>
                    </span>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}

      {/* Main Elements Deck / Track with Connecting Arcs Overlay */}
      <div className="relative flex flex-col items-center max-w-full">
        {/* Partition Legend Eyebrows (if partition boundary exists) */}
        {sortedBoundary !== null && (
          <div className="w-full flex justify-between items-center text-[10px] font-mono text-muted-foreground px-4 mb-1.5">
            <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span>未排序区间 [0..{sortedBoundary - 1}]</span>
            </span>
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>已就位已排序区间 [{sortedBoundary}..{elements.length - 1}]</span>
            </span>
          </div>
        )}

        {/* The Card Deck Container */}
        <div
          role="list"
          aria-label="数组序列元素列表"
          className="relative flex items-center justify-center gap-2 sm:gap-3.5 p-4 sm:p-6 bg-muted/25 dark:bg-muted/10 rounded-2xl border border-border/60 shadow-xs max-w-full overflow-x-auto"
        >
          {elements.map((element, index) => {
            const isSorted = sortedIndices.includes(index) || element.state === 'sorted';
            const isComparing = element.state === 'comparing';
            const isActive = element.state === 'active';
            const isAtSortedBoundary = sortedBoundary === index;

            // Proportional Level Fill (16% min to 94% max)
            const numericVal = typeof element.value === 'number' ? element.value : 1;
            const fillPercent = showHeightBars
              ? Math.max(16, Math.min(94, Math.round((numericVal / computedMax) * 80 + 14)))
              : 0;

            // State-specific card styling, borders, and ambient glow
            let cardStyleClass = 'border-border/70 bg-card hover:border-primary/40 shadow-xs hover:shadow-md';
            let fillBackground = 'bg-primary/10 dark:bg-primary/15';

            if (isComparing) {
              cardStyleClass =
                '-translate-y-4 scale-105 border-amber-500 dark:border-amber-400 bg-amber-500/10 dark:bg-amber-500/15 ring-3 ring-amber-400/80 dark:ring-amber-400/60 shadow-[0_20px_35px_-8px_rgba(245,158,11,0.4)] z-20';
              fillBackground = 'bg-amber-500/25 dark:bg-amber-500/35';
            } else if (isActive) {
              cardStyleClass =
                '-translate-y-2 border-primary bg-primary/10 ring-2 ring-primary/60 shadow-lg z-10';
              fillBackground = 'bg-primary/25 dark:bg-primary/35';
            } else if (isSorted) {
              cardStyleClass =
                'border-emerald-500/50 dark:border-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-500/10 shadow-xs';
              fillBackground = 'bg-emerald-500/20 dark:bg-emerald-500/25';
            }

            return (
              <div key={element.id} className="relative flex items-center shrink-0">
                {/* Partition Divider Line between Unsorted & Sorted */}
                {isAtSortedBoundary && (
                  <div
                    title="已排序区域分界线"
                    className="absolute -left-1.5 sm:-left-2 top-2 bottom-2 w-0.5 bg-emerald-500/60 border-l border-dashed border-emerald-500 z-10 flex flex-col items-center justify-center"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm -ml-[3px]" />
                  </div>
                )}

                <div
                  role="listitem"
                  data-entity-id={element.id}
                  data-state={element.state}
                  data-index={index}
                  onClick={() => onElementClick?.(element, index)}
                  style={{
                    transition: `transform ${compareDuration}ms ${MOTION_TOKENS.compare.easing}, background-color ${compareDuration}ms ease, border-color ${compareDuration}ms ease, box-shadow ${compareDuration}ms ease`,
                  }}
                  className={`relative w-16 sm:w-20 h-44 sm:h-48 rounded-2xl border flex flex-col justify-between items-center p-2 sm:p-2.5 cursor-pointer select-none transition-all duration-300 overflow-hidden ${cardStyleClass}`}
                >
                  {/* Proportional Level Fill Bar (Rising from Bottom) */}
                  {showHeightBars && (
                    <div
                      style={{
                        height: `${fillPercent}%`,
                        transition: `height ${moveDuration}ms ${MOTION_TOKENS.move.easing}, background-color ${compareDuration}ms ease`,
                      }}
                      className={`absolute bottom-0 inset-x-0 rounded-b-[14px] pointer-events-none transition-all ${fillBackground}`}
                    />
                  )}

                  {/* Top Header: Entity ID & Contextual State Badge */}
                  <div className="w-full flex items-center justify-between z-10 text-[10px] font-mono leading-none">
                    {showEntityIds ? (
                      <span
                        title={`Entity ID: ${element.id} (稳定空间唯一标识)`}
                        className="px-1.5 py-0.5 rounded-md bg-background/85 dark:bg-background/85 text-muted-foreground border border-border/50 font-semibold shadow-2xs"
                      >
                        #{element.id.replace('e_', '')}
                      </span>
                    ) : (
                      <span />
                    )}

                    {/* Contextual State Badges */}
                    {isSorted && (
                      <span
                        title="已排序就位"
                        className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/30"
                      >
                        <span>✓</span>
                        <span className="text-[9px]">已就位</span>
                      </span>
                    )}
                    {isComparing && (
                      <span
                        title="正在比较"
                        className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-amber-500/25 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/40 animate-pulse"
                      >
                        <span>⇄</span>
                        <span className="text-[9px]">比较中</span>
                      </span>
                    )}
                    {isActive && !isComparing && !isSorted && (
                      <span
                        title="当前活动"
                        className="px-1.5 py-0.5 rounded-full bg-primary/20 text-primary font-bold border border-primary/30 text-[9px]"
                      >
                        活动
                      </span>
                    )}
                  </div>

                  {/* Center: Hero Number Display */}
                  <div className="flex flex-col items-center justify-center my-auto z-10">
                    <span className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight text-foreground drop-shadow-xs">
                      {String(element.value)}
                    </span>
                    {element.label && (
                      <span className="text-[10px] text-muted-foreground mt-0.5 font-medium">
                        {element.label}
                      </span>
                    )}
                  </div>

                  {/* Bottom: Integrated Slot Index */}
                  {showIndices && (
                    <div className="w-full flex justify-center items-center z-10">
                      <span className="px-2 py-0.5 rounded-md bg-background/80 dark:bg-background/80 border border-border/50 text-[11px] font-mono text-muted-foreground font-semibold shadow-2xs">
                        [{index}]
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Connecting Swap Trajectory Track */}
        {showConnectingArcs && comparingPair && (
          <div className="w-full flex justify-center items-center mt-2 text-xs font-mono text-muted-foreground gap-2 animate-in fade-in duration-150">
            {comparingPair.isReverse ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                <span>🔀 触发换位轨道:</span>
                <span className="font-bold">[{comparingPair.idxA}] ⟷ [{comparingPair.idxB}]</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-muted/60 text-muted-foreground border border-border/50">
                <span>✓ 维持原位:</span>
                <span>[{comparingPair.idxA}] &lt;= [{comparingPair.idxB}]</span>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
