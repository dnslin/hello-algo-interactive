export interface MotionTokenDefinition {
  durationMs: number;
  easing: string;
  description: string;
}

/**
 * Standard Motion Tokens for Algorithm Visualizations.
 */
export const MOTION_TOKENS = {
  focus: {
    durationMs: 180,
    easing: 'cubic-bezier(0.2, 0, 0, 1)',
    description: 'Element focus, badge appear, pointer hover',
  },
  compare: {
    durationMs: 240,
    easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    description: 'Comparison pulse, scale elevation',
  },
  move: {
    durationMs: 420,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    description: 'Spatial translation, swap, bar reorder',
  },
  structural: {
    durationMs: 560,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    description: 'Tree rotation, graph layout change, board reset',
  },
  fade: {
    durationMs: 150,
    easing: 'linear',
    description: 'Opacity transitions and reduced-motion fallback',
  },
} as const;

export function getScaledDuration(
  baseDurationMs: number,
  speedFactor = 1,
  prefersReducedMotion = false
): number {
  if (prefersReducedMotion) {
    return 0;
  }
  if (speedFactor <= 0) {
    return baseDurationMs;
  }
  return Math.round(baseDurationMs / speedFactor);
}
