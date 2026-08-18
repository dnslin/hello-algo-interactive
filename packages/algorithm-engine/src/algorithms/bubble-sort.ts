import type {
  AlgorithmModule,
  EntityId,
  TraceContext,
  TraceResult,
} from '../types.js';
import { createEntityId } from '../entity.js';
import { Tracer } from '../tracer.js';

export interface BubbleSortItem {
  id: EntityId;
  value: number;
}

export const DEFAULT_BUBBLE_SORT_INPUT = [4, 1, 3, 1, 5, 2];

export function traceBubbleSort(
  input: number[] = DEFAULT_BUBBLE_SORT_INPUT,
  ctx?: Partial<TraceContext>
): TraceResult<number[]> {
  const tracer = new Tracer({
    sceneId: 'main',
    stepLimit: ctx?.stepGuardLimit,
  });

  const arr: BubbleSortItem[] = input.map((value, idx) => ({
    id: createEntityId(idx),
    value,
  }));
  const n = arr.length;

  // Initial Marker 0
  tracer.mark({
    codeAnchor: 'INITIAL',
    narration: {
      key: 'bubble_sort_init',
      args: { size: n, array: input },
    },
    variables: {
      i: 0,
      j: 0,
      swapped: false,
      sortedCount: 0,
    },
  });

  if (n <= 1) {
    if (n === 1) {
      tracer.markSorted(0);
    }
    tracer.mark({
      codeAnchor: 'COMPLETE',
      narration: { key: 'bubble_sort_complete', args: {} },
      variables: { sortedCount: n },
    });
    return tracer.toTraceResult(arr.map((item) => item.value));
  }

  for (let i = 0; i < n - 1; i++) {
    let swappedInPass = false;

    tracer.setPointer('i', i, { label: `i=${i}` });
    tracer.mark({
      codeAnchor: 'LOOP_OUTER',
      narration: {
        key: 'bubble_sort_outer',
        args: { i, passNumber: i + 1, totalPasses: n - 1 },
      },
      variables: {
        i,
        j: 0,
        swapped: false,
        sortedCount: i,
      },
    });

    for (let j = 0; j < n - 1 - i; j++) {
      tracer.setPointer('j', j, { label: `j=${j}` });
      tracer.mark({
        codeAnchor: 'LOOP_INNER',
        narration: {
          key: 'bubble_sort_inner',
          args: { j, maxIndex: n - 1 - i },
        },
        variables: {
          i,
          j,
          'nums[j]': arr[j].value,
          'nums[j+1]': arr[j + 1].value,
          swapped: swappedInPass,
        },
      });

      // Highlight compare
      tracer.compare([j, j + 1], [arr[j].id, arr[j + 1].id]);
      const shouldSwap = arr[j].value > arr[j + 1].value;

      tracer.mark({
        codeAnchor: 'COMPARE',
        narration: {
          key: 'bubble_sort_compare',
          args: {
            valA: arr[j].value,
            valB: arr[j + 1].value,
            shouldSwap,
          },
        },
        variables: {
          i,
          j,
          'nums[j]': arr[j].value,
          'nums[j+1]': arr[j + 1].value,
          compareResult: shouldSwap,
          swapped: swappedInPass,
        },
      });

      if (shouldSwap) {
        tracer.swap([j, j + 1], [arr[j].id, arr[j + 1].id]);
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        swappedInPass = true;

        tracer.mark({
          codeAnchor: 'SWAP',
          narration: {
            key: 'bubble_sort_swap',
            args: {
              valA: arr[j].value,
              valB: arr[j + 1].value,
            },
          },
          variables: {
            i,
            j,
            'nums[j]': arr[j].value,
            'nums[j+1]': arr[j + 1].value,
            swapped: true,
          },
        });
      }

      // Reset comparing highlights back to idle (except sorted elements)
      tracer.resetElementStates();
    }

    // Element at n - 1 - i is now settled in its sorted position
    const sortedIndex = n - 1 - i;
    tracer.markSorted(sortedIndex);
    tracer.mark({
      codeAnchor: 'SORTED_MARK',
      narration: {
        key: 'bubble_sort_sorted_pass',
        args: {
          index: sortedIndex,
          value: arr[sortedIndex].value,
        },
      },
      variables: {
        i,
        sortedIndex,
        sortedCount: i + 1,
      },
    });
  }

  // The remaining first element (index 0) is guaranteed to be sorted
  tracer.markSorted(0);
  tracer.clearPointers();
  tracer.mark({
    codeAnchor: 'COMPLETE',
    narration: {
      key: 'bubble_sort_complete',
      args: {},
    },
    variables: {
      sortedCount: n,
    },
  });

  return tracer.toTraceResult(arr.map((item) => item.value));
}

export const bubbleSortAlgorithm: AlgorithmModule<number[], number[]> = {
  id: 'bubble-sort',
  title: '冒泡排序',
  category: 'sorting',
  defaultInput: DEFAULT_BUBBLE_SORT_INPUT,
  scenes: [
    {
      id: 'main',
      renderer: 'sequence',
      area: 'main',
      options: {
        title: '数组序列',
      },
    },
  ],
  trace(input, ctx) {
    return traceBubbleSort(input, ctx);
  },
};
