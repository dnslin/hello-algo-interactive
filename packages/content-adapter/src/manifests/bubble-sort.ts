import type { AlgorithmContentManifest } from '../types.js';
import { createContentManifest } from '../index.js';

export const BUBBLE_SORT_TS_CODE = `function bubbleSort(nums: number[]): void {
  const n = nums.length;
  // 外层循环：遍历未排序区间
  for (let i = 0; i < n - 1; i++) {
    // 内层循环：相邻比较冒泡
    for (let j = 0; j < n - 1 - i; j++) {
      if (nums[j] > nums[j + 1]) {
        // 交换相邻两数
        const tmp = nums[j];
        nums[j] = nums[j + 1];
        nums[j + 1] = tmp;
      }
    }
  }
}`;

export const BUBBLE_SORT_PYTHON_CODE = `def bubble_sort(nums: list[int]) -> None:
    n = len(nums)
    # 外层循环：遍历未排序区间
    for i in range(n - 1):
        # 内层循环：相邻比较冒泡
        for j in range(n - 1 - i):
            if nums[j] > nums[j + 1]:
                # 交换相邻两数
                nums[j], nums[j + 1] = nums[j + 1], nums[j]`;

export const BUBBLE_SORT_GO_CODE = `func bubbleSort(nums []int) {
    n := len(nums)
    // 外层循环：遍历未排序区间
    for i := 0; i < n-1; i++ {
        // 内层循环：相邻比较冒泡
        for j := 0; j < n-1-i; j++ {
            if nums[j] > nums[j+1] {
                // 交换相邻两数
                nums[j], nums[j+1] = nums[j+1], nums[j]
            }
        }
    }
}`;

export const bubbleSortContentManifest: AlgorithmContentManifest = createContentManifest({
  algorithmId: 'bubble-sort',
  chapterTitle: '冒泡排序',
  summary:
    '冒泡排序通过相邻元素的连续比较和交换，使较大的元素逐步“浮”到数列的顶端（未排序区间的末尾），具有稳定性和就地排序的特性。',
  complexity: {
    time: 'O(n²)',
    space: 'O(1)',
  },
  codeManifests: {
    typescript: {
      language: 'typescript',
      code: BUBBLE_SORT_TS_CODE,
      anchors: {
        INITIAL: [1, 2],
        LOOP_OUTER: [3, 4],
        LOOP_INNER: [5, 6],
        COMPARE: [7, 7],
        SWAP: [8, 11],
        SORTED_MARK: [13, 14],
        COMPLETE: [14, 15],
      },
    },
    python: {
      language: 'python',
      code: BUBBLE_SORT_PYTHON_CODE,
      anchors: {
        INITIAL: [1, 2],
        LOOP_OUTER: [3, 4],
        LOOP_INNER: [5, 6],
        COMPARE: [7, 7],
        SWAP: [8, 9],
        SORTED_MARK: [6, 9],
        COMPLETE: [1, 9],
      },
    },
    go: {
      language: 'go',
      code: BUBBLE_SORT_GO_CODE,
      anchors: {
        INITIAL: [1, 2],
        LOOP_OUTER: [3, 4],
        LOOP_INNER: [5, 6],
        COMPARE: [7, 7],
        SWAP: [8, 9],
        SORTED_MARK: [11, 12],
        COMPLETE: [12, 13],
      },
    },
  },
  attribution: {
    source: 'Hello-Algo',
    license: 'CC BY-NC-SA 4.0',
    chapterUrl: 'https://www.hello-algo.com/chapter_sorting/bubble_sort/',
  },
});
