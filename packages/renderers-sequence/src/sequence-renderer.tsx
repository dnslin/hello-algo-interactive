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

  return (
    <div
      role="region"
      aria-label="数组序列可视化画布"
      className={`w-full flex flex-col items-center justify-center p-2 sm:p-4 select-none ${className}`}
    >
      {/* Pointers row (top) */}
      {showPointers && (
        <div className="w-full flex justify-center items-end h-10 gap-2 sm:gap-3.5 mb-2 px-2 overflow-x-auto min-w-0">
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
                    ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-blue-500/20'
                    : isJPointer
                    ? 'bg-purple-600 dark:bg-purple-500 text-white shadow-purple-500/20'
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

      {/* Main Elements Deck / Track */}
      <div
        role="list"
        aria-label="数组序列元素列表"
        className="relative flex items-center justify-center gap-2 sm:gap-3.5 p-4 sm:p-6 bg-muted/25 dark:bg-muted/10 rounded-2xl border border-border/60 shadow-xs max-w-full overflow-x-auto"
      >
        {elements.map((element, index) => {
          const isSorted = sortedIndices.includes(index) || element.state === 'sorted';
          const isComparing = element.state === 'comparing';
          const isActive = element.state === 'active';

          // Proportional Level Fill (15% min to 92% max)
          const numericVal = typeof element.value === 'number' ? element.value : 1;
          const fillPercent = showHeightBars
            ? Math.max(16, Math.min(94, Math.round((numericVal / computedMax) * 80 + 14)))
            : 0;

          // State-specific card styling, borders, and ambient glow
          let cardStyleClass = 'border-border/70 bg-card hover:border-primary/40 shadow-xs hover:shadow-md';
          let fillBackground = 'bg-primary/10 dark:bg-primary/15';

          if (isComparing) {
            cardStyleClass =
              '-translate-y-4 scale-105 border-amber-500 dark:border-amber-400 bg-amber-500/10 dark:bg-amber-500/15 ring-2 ring-amber-400/80 dark:ring-amber-400/60 shadow-[0_16px_32px_-8px_rgba(245,158,11,0.35)] z-20';
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
              className={`relative w-16 sm:w-20 h-44 sm:h-48 rounded-2xl border flex flex-col justify-between items-center p-2 sm:p-2.5 cursor-pointer select-none transition-all duration-300 shrink-0 overflow-hidden ${cardStyleClass}`}
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

                {/* State Badges (Only shown when not idle) */}
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
          );
        })}
      </div>
    </div>
  );
}
