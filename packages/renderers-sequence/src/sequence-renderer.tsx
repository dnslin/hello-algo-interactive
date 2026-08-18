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
  showStatusHeader?: boolean;
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
  showStatusHeader = true,
  maxValue,
  onElementClick,
}: SequenceRendererProps<T>): ReactElement {
  const { elements, pointers, sortedIndices } = state;

  // Calculate maximum numeric value for height fill
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

  // Identify comparing element pair
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

  return (
    <div
      role="region"
      aria-label="数组序列可视化画布"
      className={`w-full flex flex-col items-center justify-center p-3 select-none ${className}`}
    >
      {/* 1. Fixed-Height Top Status HUD (Zero vertical jump) */}
      {showStatusHeader && (
        <div className="h-8 flex items-center justify-center mb-1 w-full max-w-2xl px-2">
          {comparingPair ? (
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold border transition-all duration-200 ${
                comparingPair.isReverse
                  ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-400/40 shadow-xs'
                  : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-400/40 shadow-xs'
              }`}
            >
              <span>
                nums[{comparingPair.idxA}]({comparingPair.valA}){' '}
                <strong className="text-foreground">{comparingPair.isReverse ? '>' : '≤'}</strong>{' '}
                nums[{comparingPair.idxB}]({comparingPair.valB})
              </span>
              <span className="text-[11px] px-1.5 py-0.2 rounded bg-background/80 border border-border/50 font-sans">
                {comparingPair.isReverse ? '逆序换位 ⇄' : '顺序正确 ✓'}
              </span>
            </div>
          ) : (
            <div className="text-xs font-mono text-muted-foreground/70 flex items-center gap-1.5">
              <span>数组序列 (长度 {elements.length})</span>
              {sortedIndices.length > 0 && (
                <span>• 已就位 {sortedIndices.length}/{elements.length} 项</span>
              )}
            </div>
          )}
        </div>
      )}

      {/* 2. Fixed-Height Pointer Track (Zero layout shifting) */}
      {showPointers && (
        <div className="w-full flex justify-center items-end h-8 gap-3 sm:gap-4 mb-2 px-2 overflow-x-auto">
          {elements.map((el, idx) => {
            const ptrs = pointersByIndex.get(idx) ?? [];
            return (
              <div
                key={`ptr-slot-${el.id}`}
                className="w-16 sm:w-20 h-8 flex flex-col items-center justify-end shrink-0"
              >
                {ptrs.map((p) => {
                  const isIPointer = p.name === 'i';
                  const badgeColor = isIPointer
                    ? 'bg-blue-600 dark:bg-blue-500 text-white'
                    : 'bg-purple-600 dark:bg-purple-500 text-white';

                  return (
                    <span
                      key={`${p.name}-${p.index}`}
                      style={{
                        transition: `all ${moveDuration}ms ${MOTION_TOKENS.move.easing}`,
                      }}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-mono font-bold rounded-full shadow-xs ${badgeColor}`}
                    >
                      <span>↓</span>
                      <span>{p.label ?? p.name}</span>
                    </span>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}

      {/* 3. Main Deck Container (Strictly Uniform Card Geometry, No Scale Jumps) */}
      <div
        role="list"
        aria-label="数组序列元素列表"
        className="flex items-center justify-center gap-3 sm:gap-4 p-4 sm:p-5 bg-muted/20 dark:bg-muted/10 rounded-2xl border border-border/50 max-w-full overflow-x-auto min-h-[190px]"
      >
        {elements.map((element, index) => {
          const isSorted = sortedIndices.includes(index) || element.state === 'sorted';
          const isComparing = element.state === 'comparing';
          const isActive = element.state === 'active';

          // Proportional Level Fill (18% min to 90% max)
          const numericVal = typeof element.value === 'number' ? element.value : 1;
          const fillPercent = showHeightBars
            ? Math.max(18, Math.min(90, Math.round((numericVal / computedMax) * 72 + 18)))
            : 0;

          // Pure color shifts & subtle translation (NO scale transformation)
          let cardBorderClass = 'border-border/80 bg-card shadow-xs';
          let fillClass = 'bg-primary/10 dark:bg-primary/15';
          let translateY = 'translate-y-0';

          if (isComparing) {
            cardBorderClass =
              'border-amber-400 dark:border-amber-400 bg-amber-500/10 ring-2 ring-amber-400/40 shadow-md';
            fillClass = 'bg-amber-500/25 dark:bg-amber-500/30';
            translateY = '-translate-y-1.5';
          } else if (isActive) {
            cardBorderClass =
              'border-primary bg-primary/10 ring-2 ring-primary/40 shadow-sm';
            fillClass = 'bg-primary/20 dark:bg-primary/25';
            translateY = '-translate-y-1';
          } else if (isSorted) {
            cardBorderClass =
              'border-emerald-500/40 dark:border-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-500/10';
            fillClass = 'bg-emerald-500/20 dark:bg-emerald-500/20';
          }

          return (
            <div
              key={element.id}
              role="listitem"
              data-entity-id={element.id}
              data-state={element.state}
              data-index={index}
              onClick={() => onElementClick?.(element, index)}
              style={{
                transition: `transform ${compareDuration}ms ${MOTION_TOKENS.compare.easing}, background-color ${compareDuration}ms ease, border-color ${compareDuration}ms ease, box-shadow ${compareDuration}ms ease`,
              }}
              className={`relative w-16 sm:w-20 h-40 rounded-xl border flex flex-col justify-between items-center p-2 cursor-pointer select-none shrink-0 overflow-hidden ${cardBorderClass} ${translateY}`}
            >
              {/* Proportional Level Fill Bar (Rising from Bottom, Quiet & Non-distracting) */}
              {showHeightBars && (
                <div
                  style={{
                    height: `${fillPercent}%`,
                    transition: `height ${moveDuration}ms ${MOTION_TOKENS.move.easing}, background-color ${compareDuration}ms ease`,
                  }}
                  className={`absolute bottom-0 inset-x-0 rounded-b-[10px] pointer-events-none transition-all ${fillClass}`}
                />
              )}

              {/* Top Row: Entity ID Badge (Left) & State Tag (Right) */}
              <div className="w-full h-5 flex items-center justify-between z-10 text-[10px] font-mono leading-none">
                {showEntityIds ? (
                  <span
                    title={`Entity ID: ${element.id} (稳定空间标识)`}
                    className="px-1.5 py-0.5 rounded bg-background/80 text-muted-foreground border border-border/50 font-semibold"
                  >
                    #{element.id.replace('e_', '')}
                  </span>
                ) : (
                  <span />
                )}

                {/* State Micro-Badges */}
                {isSorted && (
                  <span
                    title="已排序就位"
                    className="flex items-center gap-0.5 px-1 py-0.5 rounded text-emerald-600 dark:text-emerald-400 font-bold text-[10px]"
                  >
                    <span>✓</span>
                    <span>就位</span>
                  </span>
                )}
                {isComparing && (
                  <span
                    title="正在比较"
                    className="flex items-center gap-0.5 px-1 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold text-[10px]"
                  >
                    <span>⇄</span>
                    <span>比较</span>
                  </span>
                )}
              </div>

              {/* Center: Hero Numerical Value (Crisp, Stable, Vertical Middle) */}
              <div className="flex-1 flex flex-col items-center justify-center z-10 my-auto">
                <span className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight text-foreground">
                  {String(element.value)}
                </span>
                {element.label && (
                  <span className="text-[10px] text-muted-foreground mt-0.5">
                    {element.label}
                  </span>
                )}
              </div>

              {/* Bottom Row: Stable Index Chip */}
              {showIndices && (
                <div className="w-full h-5 flex justify-center items-center z-10">
                  <span className="px-1.5 py-0.2 rounded bg-background/80 text-[10px] font-mono text-muted-foreground font-medium border border-border/40">
                    [{index}]
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
