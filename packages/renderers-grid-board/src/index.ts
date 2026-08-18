import type { GridCell, GridSceneState, BoardSceneState } from './types.js';

export * from './types.js';

export function createInitialGridState<T>(
  rows: number,
  cols: number,
  initialValue: T
): GridSceneState<T> {
  const cells: GridCell<T>[][] = [];
  for (let r = 0; r < rows; r++) {
    const rowCells: GridCell<T>[] = [];
    for (let c = 0; c < cols; c++) {
      rowCells.push({
        row: r,
        col: c,
        value: initialValue,
        state: 'idle',
      });
    }
    cells.push(rowCells);
  }

  return {
    rows,
    cols,
    cells,
    activeCell: null,
    dependencyCells: [],
  };
}

export function createInitialBoardState(size: number): BoardSceneState {
  return {
    size,
    pieces: [],
    conflictLines: [],
  };
}
