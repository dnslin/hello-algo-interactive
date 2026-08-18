import type { EntityId } from '@hello-algo/algorithm-engine';

export type SequenceElementState =
  | 'idle'
  | 'comparing'
  | 'active'
  | 'selected'
  | 'visited'
  | 'sorted'
  | 'conflict';

export interface SequenceElement<T = unknown> {
  id: EntityId;
  value: T;
  state: SequenceElementState;
  index: number;
  label?: string;
}

export interface SequencePointer {
  name: string;
  index: number;
  colorToken?: string;
  label?: string;
}

export interface SequenceSceneState<T = unknown> {
  elements: SequenceElement<T>[];
  pointers: SequencePointer[];
  sortedIndices: number[];
  activeRange?: [number, number];
}

export interface SequenceMotionRecipe {
  durationMs: number;
  type: 'lift-and-swap' | 'focus-pulse' | 'pointer-slide' | 'fade-in';
  easing?: string;
}
