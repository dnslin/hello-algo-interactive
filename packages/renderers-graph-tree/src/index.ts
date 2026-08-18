import type { GraphSceneState, TreeSceneState } from './types.js';

export * from './types.js';

export function createInitialGraphState<T = unknown>(): GraphSceneState<T> {
  return {
    nodes: [],
    edges: [],
    selectedNodeId: null,
  };
}

export function createInitialTreeState<T = unknown>(): TreeSceneState<T> {
  return {
    root: null,
    highlightedPath: [],
  };
}
