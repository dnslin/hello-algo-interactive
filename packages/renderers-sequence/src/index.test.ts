import { describe, it, expect } from 'vitest';
import { createInitialSequenceState } from './index.js';

describe('Renderers Sequence - Initial State', () => {
  it('creates initial sequence elements with stable entity IDs', () => {
    const raw = [5, 1, 4, 2, 8];
    const state = createInitialSequenceState(raw);

    expect(state.elements).toHaveLength(5);
    expect(state.elements[0]).toEqual({
      id: 'e_0',
      value: 5,
      state: 'idle',
      index: 0,
    });
    expect(state.elements[4]).toEqual({
      id: 'e_4',
      value: 8,
      state: 'idle',
      index: 4,
    });
    expect(state.pointers).toEqual([]);
    expect(state.sortedIndices).toEqual([]);
  });

  it('handles empty input arrays', () => {
    const state = createInitialSequenceState([]);
    expect(state.elements).toEqual([]);
    expect(state.pointers).toEqual([]);
  });
});
