import type { Marker } from '@hello-algo/algorithm-engine';
import { Info, Terminal } from 'lucide-react';

export interface VariableInspectorProps {
  currentMarker?: Marker;
  className?: string;
}

function formatNarration(marker?: Marker): string {
  if (!marker || !marker.narration) {
    return '准备就绪，点击“播放”或“单步前进”开始执行冒泡排序。';
  }

  const { key, args = {} } = marker.narration;

  switch (key) {
    case 'bubble_sort_init':
      return `初始化冒泡排序：输入数组长度为 ${args.size ?? 0}，所有元素初始状态就绪。`;
    case 'bubble_sort_outer':
      return `【第 ${args.passNumber ?? (Number(args.i) + 1)} 轮外层循环】i = ${args.i}，剩余未排序元素逐步向右冒泡。`;
    case 'bubble_sort_inner':
      return `内层指针移动到 j = ${args.j}，准备比较相邻元素。`;
    case 'bubble_sort_compare': {
      const { valA, valB, shouldSwap } = args;
      if (shouldSwap) {
        return `比较 nums[j]=${valA} 与 nums[j+1]=${valB}：由于 ${valA} > ${valB}（逆序），需要进行换位！`;
      }
      return `比较 nums[j]=${valA} 与 nums[j+1]=${valB}：由于 ${valA} ≤ ${valB}（顺序已正确），保持原位无需换位。`;
    }
    case 'bubble_sort_swap':
      return `执行相邻换位：交换 nums[j] 与 nums[j+1]，较大值 ${args.valA} 成功右移。`;
    case 'bubble_sort_sorted_pass':
      return `本轮元素沉底就位：索引 [${args.index}] 处的元素 ${args.value} 已确认排好序！`;
    case 'bubble_sort_complete':
      return '🎉 冒泡排序执行完毕！所有元素已按升序排列，并保持稳定相对顺序。';
    default:
      return `步骤 ${marker.index + 1}: ${marker.codeAnchor ?? '执行中'}`;
  }
}

export function VariableInspector({
  currentMarker,
  className = '',
}: VariableInspectorProps) {
  const variables = currentMarker?.variables ?? {};
  const entries = Object.entries(variables);
  const narrationText = formatNarration(currentMarker);

  return (
    <div
      className={`flex flex-col gap-3 p-4 rounded-xl border border-border bg-card text-card-foreground shadow-sm ${className}`}
    >
      {/* Narration Box */}
      <div className="flex items-start gap-2.5 p-3 rounded-lg bg-primary/5 border border-primary/20 text-xs sm:text-sm">
        <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <div className="flex flex-col gap-0.5">
          <span className="font-semibold text-primary text-xs">执行讲解 (Narration)</span>
          <p className="text-foreground/90 leading-relaxed font-sans">{narrationText}</p>
        </div>
      </div>

      {/* Variables Inspector */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
          <span className="flex items-center gap-1">
            <Terminal className="w-3.5 h-3.5" />
            <span>实时变量观察 (State & Variables)</span>
          </span>
          {currentMarker?.codeAnchor && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted font-mono font-medium">
              Anchor: @{currentMarker.codeAnchor}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          {entries.length > 0 ? (
            entries.map(([key, val]) => (
              <div
                key={key}
                className="flex flex-col p-2 rounded-lg bg-muted/40 border border-border/50 font-mono text-xs"
              >
                <span className="text-[11px] text-muted-foreground truncate">{key}</span>
                <span className="text-sm font-bold text-foreground mt-0.5">
                  {typeof val === 'boolean'
                    ? val
                      ? 'true'
                      : 'false'
                    : String(val ?? '-')}
                </span>
              </div>
            ))
          ) : (
            <div className="col-span-4 py-2 text-center text-xs text-muted-foreground font-mono">
              初始变量未设定
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
