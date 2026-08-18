import { useMemo, type ReactElement } from 'react';
import {
  STATE_COLORS,
  MOTION_TOKENS,
  getScaledDuration,
  type VisualizationState,
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

  // Calculate dynamic maximum value for proportional height bars
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
      className={`w-full flex flex-col items-center justify-center p-6 select-none ${className}`}
    >
      {/* Pointers row (top) */}
      {showPointers && (
        <div className="w-full flex justify-center items-end h-10 gap-3 mb-2 px-2 overflow-x-auto">
          {elements.map((el, idx) => {
            const ptrs = pointersByIndex.get(idx) ?? [];
            return (
              <div
                key={`ptr-col-${el.id}`}
                className="w-16 sm:w-20 flex flex-col items-center justify-end shrink-0"
              >
                {ptrs.map((p) => (
                  <span
                    key={`${p.name}-${p.index}`}
                    style={{
                      transition: `all ${moveDuration}ms ${MOTION_TOKENS.move.easing}`,
                    }}
                    className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-mono font-semibold rounded-full shadow-sm bg-primary text-primary-foreground animate-in fade-in"
                  >
                    <span>↓</span>
                    <span>{p.label ?? p.name}</span>
                  </span>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {/* Main Elements Track */}
      <div
        role="list"
        aria-label="数组序列元素列表"
        className="flex items-end justify-center gap-3 p-4 bg-muted/30 dark:bg-muted/15 rounded-2xl border border-border/50 shadow-inner max-w-full overflow-x-auto min-h-[220px]"
      >
        {elements.map((element, index) => {
          const isSorted = sortedIndices.includes(index) || element.state === 'sorted';
          const isComparing = element.state === 'comparing';
          const isActive = element.state === 'active';

          // Color token definition
          const colorDef = STATE_COLORS[element.state as VisualizationState] ?? STATE_COLORS.idle;

          // Height bar calculation (minimum 25% height, maximum 95% height)
          const numericVal = typeof element.value === 'number' ? element.value : 1;
          const heightPercent = showHeightBars
            ? Math.max(28, Math.min(96, Math.round((numericVal / computedMax) * 85 + 15)))
            : 60;

          // Dynamic elevation and styling
          const elevationClass = isComparing
            ? '-translate-y-4 scale-105 shadow-xl ring-4 ring-amber-400/50 z-10'
            : isActive
            ? '-translate-y-2 shadow-lg ring-2 ring-primary/50'
            : isSorted
            ? 'shadow-sm opacity-95'
            : 'hover:-translate-y-1 shadow-md';

          return (
            <div
              key={element.id}
              role="listitem"
              data-entity-id={element.id}
              data-state={element.state}
              data-index={index}
              onClick={() => onElementClick?.(element, index)}
              style={{
                height: `${heightPercent * 1.8}px`,
                minHeight: '80px',
                maxHeight: '190px',
                transition: `transform ${compareDuration}ms ${MOTION_TOKENS.compare.easing}, background-color ${compareDuration}ms ease, border-color ${compareDuration}ms ease, box-shadow ${compareDuration}ms ease, height ${moveDuration}ms ease`,
              }}
              className={`relative w-16 sm:w-20 rounded-xl border flex flex-col justify-between items-center p-2.5 cursor-pointer transition-all duration-300 ${elevationClass}`}
            >
              {/* Background gradient / state color layer */}
              <div
                className="absolute inset-0 rounded-xl transition-colors duration-300 opacity-20 pointer-events-none"
                style={{
                  backgroundColor: colorDef.light.fg,
                }}
              />

              {/* Top: Entity ID Badge & State Tag */}
              <div className="w-full flex items-center justify-between z-10 text-[10px] font-mono leading-none">
                {showEntityIds ? (
                  <span
                    title={`Entity ID: ${element.id} (稳定唯一标识)`}
                    className="px-1 py-0.5 rounded bg-background/80 dark:bg-background/80 text-muted-foreground border border-border/40 font-semibold"
                  >
                    #{element.id.replace('e_', '')}
                  </span>
                ) : (
                  <span />
                )}

                {isSorted && (
                  <span
                    title="已排序就位"
                    className="px-1 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold"
                  >
                    ✓
                  </span>
                )}
                {isComparing && (
                  <span
                    title="比较中"
                    className="px-1 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold animate-pulse"
                  >
                    cmp
                  </span>
                )}
              </div>

              {/* Center: Main Value Display */}
              <div className="flex flex-col items-center justify-center my-auto z-10">
                <span className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-foreground">
                  {String(element.value)}
                </span>
                {element.label && (
                  <span className="text-[10px] text-muted-foreground mt-0.5">
                    {element.label}
                  </span>
                )}
              </div>

              {/* Bottom: State Indicator Pill */}
              <div className="w-full text-center z-10">
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-background/60 dark:bg-background/60 text-muted-foreground font-medium truncate block">
                  {colorDef.label.split(' / ')[0]}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Index Labels row (bottom) */}
      {showIndices && (
        <div className="flex justify-center items-center gap-3 mt-3 px-2">
          {elements.map((el, idx) => (
            <div
              key={`idx-${el.id}`}
              className="w-16 sm:w-20 text-center text-xs font-mono text-muted-foreground font-medium"
            >
              <span className="px-1.5 py-0.5 rounded bg-muted/60 dark:bg-muted/40">
                [{idx}]
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
