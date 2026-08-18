import type {
  SequenceElement,
  SequencePointer,
  SequenceSceneState,
  VisualizationState,
} from '@hello-algo/algorithm-engine';

export type SequenceElementState = VisualizationState;

export type { SequenceElement, SequencePointer, SequenceSceneState };

export interface SequenceMotionRecipe {
  durationMs: number;
  type: 'lift-and-swap' | 'focus-pulse' | 'pointer-slide' | 'fade-in';
  easing?: string;
}
