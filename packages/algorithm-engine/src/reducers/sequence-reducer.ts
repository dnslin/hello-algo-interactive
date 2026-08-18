import type { EntityId, VisualizationState, AlgorithmEvent } from '../types.js';
import { createEntityId } from '../entity.js';

export interface SequenceElement<T = unknown> {
  id: EntityId;
  value: T;
  state: VisualizationState;
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

export function cloneSequenceState<T>(state: SequenceSceneState<T>): SequenceSceneState<T> {
  return {
    elements: state.elements.map((el) => ({ ...el })),
    pointers: state.pointers.map((p) => ({ ...p })),
    sortedIndices: [...state.sortedIndices],
    activeRange: state.activeRange ? [...state.activeRange] : undefined,
  };
}

export function sequenceReducer<T = unknown>(
  state: SequenceSceneState<T>,
  event: AlgorithmEvent
): SequenceSceneState<T> {
  const { type, payload } = event;
  const p = payload as Record<string, unknown>;

  switch (type) {
    case 'sequence:compare': {
      const indices = (p?.indices as [number, number]) ?? [];
      const next = cloneSequenceState(state);
      next.elements = next.elements.map((el, i) => {
        if (indices.includes(i) && !next.sortedIndices.includes(i)) {
          return { ...el, state: 'comparing' };
        }
        return el;
      });
      return next;
    }

    case 'sequence:swap': {
      const [i, j] = (p?.indices as [number, number]) ?? [-1, -1];
      if (i < 0 || j < 0 || i >= state.elements.length || j >= state.elements.length) {
        return state;
      }
      const next = cloneSequenceState(state);
      const temp = next.elements[i];
      next.elements[i] = { ...next.elements[j], index: i };
      next.elements[j] = { ...temp, index: j };
      return next;
    }

    case 'sequence:set_state': {
      const indices = Array.isArray(p?.indices) ? (p.indices as number[]) : [p?.index as number];
      const targetState = (p?.state as VisualizationState) ?? 'idle';
      const next = cloneSequenceState(state);
      next.elements = next.elements.map((el, idx) => {
        if (indices.includes(idx)) {
          return { ...el, state: targetState };
        }
        return el;
      });
      return next;
    }

    case 'sequence:set_pointer': {
      const name = p?.name as string;
      const index = p?.index as number;
      const label = p?.label as string | undefined;
      const colorToken = p?.colorToken as string | undefined;

      const next = cloneSequenceState(state);
      const existingIdx = next.pointers.findIndex((ptr) => ptr.name === name);
      const newPointer: SequencePointer = { name, index, label, colorToken };

      if (existingIdx >= 0) {
        next.pointers[existingIdx] = newPointer;
      } else {
        next.pointers.push(newPointer);
      }
      return next;
    }

    case 'sequence:remove_pointer': {
      const name = p?.name as string;
      const next = cloneSequenceState(state);
      next.pointers = next.pointers.filter((ptr) => ptr.name !== name);
      return next;
    }

    case 'sequence:clear_pointers': {
      const next = cloneSequenceState(state);
      next.pointers = [];
      return next;
    }

    case 'sequence:mark_sorted': {
      const rawIndices = Array.isArray(p?.indices)
        ? (p.indices as number[])
        : [p?.index as number];
      const next = cloneSequenceState(state);
      for (const idx of rawIndices) {
        if (typeof idx === 'number' && !next.sortedIndices.includes(idx)) {
          next.sortedIndices.push(idx);
        }
      }
      next.elements = next.elements.map((el, idx) => {
        if (next.sortedIndices.includes(idx)) {
          return { ...el, state: 'sorted' };
        }
        return el;
      });
      return next;
    }

    case 'sequence:reset_element_states': {
      const next = cloneSequenceState(state);
      next.elements = next.elements.map((el, idx) => {
        if (next.sortedIndices.includes(idx)) {
          return { ...el, state: 'sorted' };
        }
        return { ...el, state: 'idle' };
      });
      return next;
    }

    case 'sequence:set_active_range': {
      const range = p?.range as [number, number] | undefined;
      const next = cloneSequenceState(state);
      next.activeRange = range;
      return next;
    }

    default:
      return state;
  }
}
