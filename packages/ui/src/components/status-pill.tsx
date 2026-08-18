import * as React from 'react';
import { cn } from '../lib/utils.js';
import type { VisualizationState } from '../tokens/colors.js';
import { STATE_COLORS } from '../tokens/colors.js';

export interface StatusPillProps extends React.HTMLAttributes<HTMLSpanElement> {
  state: VisualizationState;
  showIcon?: boolean;
}

const STATE_ICONS: Record<VisualizationState, string> = {
  idle: '○',
  comparing: '⇄',
  active: '▶',
  selected: '★',
  visited: '✓',
  sorted: '✓✓',
  conflict: '✕',
};

const STATE_CLASSES: Record<VisualizationState, string> = {
  idle: 'bg-[var(--viz-idle)] text-[var(--viz-idle-fg)] border-[var(--viz-idle-border)]',
  comparing: 'bg-[var(--viz-comparing)] text-[var(--viz-comparing-fg)] border-[var(--viz-comparing-border)] font-semibold',
  active: 'bg-[var(--viz-active)] text-[var(--viz-active-fg)] border-[var(--viz-active-border)] font-semibold',
  selected: 'bg-[var(--viz-selected)] text-[var(--viz-selected-fg)] border-[var(--viz-selected-border)] font-bold',
  visited: 'bg-[var(--viz-visited)] text-[var(--viz-visited-fg)] border-[var(--viz-visited-border)]',
  sorted: 'bg-[var(--viz-sorted)] text-[var(--viz-sorted-fg)] border-[var(--viz-sorted-border)] font-bold',
  conflict: 'bg-[var(--viz-conflict)] text-[var(--viz-conflict-fg)] border-[var(--viz-conflict-border)] font-bold animate-pulse',
};

export function StatusPill({
  state,
  showIcon = true,
  children,
  className,
  ...props
}: StatusPillProps) {
  const definition = STATE_COLORS[state];
  const icon = STATE_ICONS[state];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border tracking-tight transition-colors duration-compare',
        STATE_CLASSES[state],
        className
      )}
      {...props}
    >
      {showIcon && <span className="text-[10px] select-none" aria-hidden="true">{icon}</span>}
      {children || definition.label}
    </span>
  );
}
