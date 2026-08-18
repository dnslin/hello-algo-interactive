import { describe, it, expect } from 'vitest';
import { createInitialLinkedState } from './index.js';

describe('Renderers Linked - Initial State', () => {
  it('creates empty linked list scene state', () => {
    const state = createInitialLinkedState();
    expect(state.nodes).toEqual({});
    expect(state.headId).toBeNull();
    expect(state.tailId).toBeNull();
    expect(state.pointers).toEqual({});
  });
});
