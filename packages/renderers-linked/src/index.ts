import type { LinkedSceneState } from './types.js';

export * from './types.js';

export function createInitialLinkedState<T = unknown>(): LinkedSceneState<T> {
  return {
    nodes: {},
    headId: null,
    tailId: null,
    pointers: {},
  };
}
