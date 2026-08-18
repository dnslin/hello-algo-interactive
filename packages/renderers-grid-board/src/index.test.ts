import { describe, it, expect } from 'vitest';
import { createInitialGridState, createInitialBoardState } from './index.js';

describe('Renderers Grid & Board - Initial States', () => {
  it('creates a grid with correct dimensions and default cell states', () => {
    const grid = createInitialGridState(3, 4, 0);
    expect(grid.rows).toBe(3);
    expect(grid.cols).toBe(4);
    expect(grid.cells).toHaveLength(3);
    expect(grid.cells[0]).toHaveLength(4);
    expect(grid.cells[0][0]).toEqual({
      row: 0,
      col: 0,
      value: 0,
      state: 'idle',
    });
  });

  it('creates an empty board state for N-Queens', () => {
    const board = createInitialBoardState(8);
    expect(board.size).toBe(8);
    expect(board.pieces).toEqual([]);
    expect(board.conflictLines).toEqual([]);
  });
});
