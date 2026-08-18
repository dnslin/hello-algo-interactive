import type { EntityId } from '@hello-algo/algorithm-engine';

export type GridCellState =
  | 'idle'
  | 'active'
  | 'comparing'
  | 'visited'
  | 'selected'
  | 'conflict'
  | 'disabled';

export interface GridCell<T = unknown> {
  row: number;
  col: number;
  value: T;
  state: GridCellState;
  isDependency?: boolean;
  label?: string;
}

export interface GridSceneState<T = unknown> {
  rows: number;
  cols: number;
  cells: GridCell<T>[][];
  activeCell?: [number, number] | null;
  dependencyCells?: Array<[number, number]>;
}

export interface BoardPiece {
  id: EntityId;
  row: number;
  col: number;
  type: string;
  hasConflict?: boolean;
}

export interface BoardSceneState {
  size: number;
  pieces: BoardPiece[];
  conflictLines?: Array<{
    from: [number, number];
    to: [number, number];
  }>;
}
