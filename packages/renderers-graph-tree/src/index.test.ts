import { describe, it, expect } from 'vitest';
import { createInitialGraphState, createInitialTreeState } from './index.js';

describe('Renderers Graph & Tree - Initial States', () => {
  it('creates empty graph scene state', () => {
    const state = createInitialGraphState();
    expect(state.nodes).toEqual([]);
    expect(state.edges).toEqual([]);
    expect(state.selectedNodeId).toBeNull();
  });

  it('creates empty tree scene state', () => {
    const state = createInitialTreeState();
    expect(state.root).toBeNull();
    expect(state.highlightedPath).toEqual([]);
  });
});
