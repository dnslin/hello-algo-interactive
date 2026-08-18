import { createEntityId } from '@hello-algo/algorithm-engine';
import type { SequenceElement, SequenceSceneState } from './types.js';

export * from './types.js';

export function createInitialSequenceState<T>(values: T[]): SequenceSceneState<T> {
  const elements: SequenceElement<T>[] = values.map((val, idx) => ({
    id: createEntityId(idx),
    value: val,
    state: 'idle',
    index: idx,
  }));

  return {
    elements,
    pointers: [],
    sortedIndices: [],
  };
}
