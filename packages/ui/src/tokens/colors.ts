export type VisualizationState =
  | 'idle'
  | 'comparing'
  | 'active'
  | 'selected'
  | 'visited'
  | 'sorted'
  | 'conflict';

export interface StateColorDefinition {
  name: VisualizationState;
  label: string;
  light: {
    bg: string;
    fg: string;
    border: string;
  };
  dark: {
    bg: string;
    fg: string;
    border: string;
  };
}

/**
 * OKLCH Semantic Color Tokens for Algorithm States.
 * Maintains accessible contrast in both light and dark modes.
 */
export const STATE_COLORS: Record<VisualizationState, StateColorDefinition> = {
  idle: {
    name: 'idle',
    label: '未访问 / 默认',
    light: {
      bg: 'oklch(0.94 0.01 240)',
      fg: 'oklch(0.25 0.02 240)',
      border: 'oklch(0.85 0.02 240)',
    },
    dark: {
      bg: 'oklch(0.28 0.02 240)',
      fg: 'oklch(0.92 0.01 240)',
      border: 'oklch(0.40 0.03 240)',
    },
  },
  comparing: {
    name: 'comparing',
    label: '比较中 / 因果触发',
    light: {
      bg: 'oklch(0.88 0.16 85)',
      fg: 'oklch(0.25 0.08 85)',
      border: 'oklch(0.75 0.18 85)',
    },
    dark: {
      bg: 'oklch(0.72 0.18 85)',
      fg: 'oklch(0.12 0.05 85)',
      border: 'oklch(0.82 0.19 85)',
    },
  },
  active: {
    name: 'active',
    label: '当前焦点 / 操作中',
    light: {
      bg: 'oklch(0.78 0.18 220)',
      fg: 'oklch(0.15 0.05 220)',
      border: 'oklch(0.65 0.20 220)',
    },
    dark: {
      bg: 'oklch(0.68 0.20 220)',
      fg: 'oklch(0.10 0.04 220)',
      border: 'oklch(0.78 0.22 220)',
    },
  },
  selected: {
    name: 'selected',
    label: '选中 / 基准点 / 极值',
    light: {
      bg: 'oklch(0.68 0.22 280)',
      fg: 'oklch(0.98 0.01 280)',
      border: 'oklch(0.55 0.24 280)',
    },
    dark: {
      bg: 'oklch(0.62 0.24 280)',
      fg: 'oklch(0.98 0.01 280)',
      border: 'oklch(0.72 0.26 280)',
    },
  },
  visited: {
    name: 'visited',
    label: '已访问 / 已扫描',
    light: {
      bg: 'oklch(0.84 0.12 175)',
      fg: 'oklch(0.20 0.05 175)',
      border: 'oklch(0.70 0.14 175)',
    },
    dark: {
      bg: 'oklch(0.65 0.14 175)',
      fg: 'oklch(0.12 0.04 175)',
      border: 'oklch(0.75 0.16 175)',
    },
  },
  sorted: {
    name: 'sorted',
    label: '已就绪 / 最终位置',
    light: {
      bg: 'oklch(0.80 0.18 145)',
      fg: 'oklch(0.18 0.06 145)',
      border: 'oklch(0.68 0.20 145)',
    },
    dark: {
      bg: 'oklch(0.70 0.20 145)',
      fg: 'oklch(0.12 0.05 145)',
      border: 'oklch(0.80 0.22 145)',
    },
  },
  conflict: {
    name: 'conflict',
    label: '冲突 / 错误 / 回溯点',
    light: {
      bg: 'oklch(0.65 0.24 25)',
      fg: 'oklch(0.98 0.01 25)',
      border: 'oklch(0.52 0.26 25)',
    },
    dark: {
      bg: 'oklch(0.60 0.26 25)',
      fg: 'oklch(0.98 0.01 25)',
      border: 'oklch(0.70 0.28 25)',
    },
  },
};
