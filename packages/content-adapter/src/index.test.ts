import { describe, it, expect } from 'vitest';
import {
  getAnchorLineSpan,
  validateCodeAnchorMap,
  createContentManifest,
  LanguageCodeManifest,
} from './index.js';
const sampleCode = `function bubbleSort(nums: number[]): void {
  const n = nums.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - 1 - i; j++) {
      if (nums[j] > nums[j + 1]) {
        [nums[j], nums[j + 1]] = [nums[j + 1], nums[j]];
      }
    }
  }
}`;

const sampleManifest: LanguageCodeManifest = {
  language: 'typescript',
  code: sampleCode,
  anchors: {
    LOOP_OUTER: [3, 9],
    COMPARE: [5, 5],
    SWAP: [6, 6],
  },
};

describe('Content Adapter - Semantic Code Anchors', () => {
  it('retrieves line spans for semantic anchors', () => {
    expect(getAnchorLineSpan(sampleManifest, 'COMPARE')).toEqual([5, 5]);
    expect(getAnchorLineSpan(sampleManifest, 'SWAP')).toEqual([6, 6]);
    expect(getAnchorLineSpan(sampleManifest, 'NON_EXISTENT')).toBeUndefined();
  });

  it('validates anchor bounds within line count', () => {
    expect(validateCodeAnchorMap(sampleManifest.anchors, sampleCode)).toBe(true);

    const invalidAnchors = {
      OUT_OF_BOUNDS: [1, 50] as [number, number],
    };
    expect(validateCodeAnchorMap(invalidAnchors, sampleCode)).toBe(false);

    const invertedSpan = {
      INVERTED: [5, 2] as [number, number],
    };
    expect(validateCodeAnchorMap(invertedSpan, sampleCode)).toBe(false);
  });
});

describe('Content Adapter - Content Manifest Factory', () => {
  it('validates and creates a valid content manifest', () => {
    const manifest = createContentManifest({
      algorithmId: 'bubble-sort',
      chapterTitle: 'Bubble Sort',
      summary: 'Comparison sorting algorithm',
      complexity: { time: 'O(n^2)', space: 'O(1)' },
      codeManifests: {
        typescript: sampleManifest,
      },
      attribution: {
        source: 'Hello-Algo',
        license: 'CC BY-NC-SA 4.0',
      },
    });
    expect(manifest.algorithmId).toBe('bubble-sort');
  });

  it('throws an error when manifest code manifests have invalid anchor spans', () => {
    expect(() =>
      createContentManifest({
        algorithmId: 'bubble-sort',
        chapterTitle: 'Bubble Sort',
        summary: 'Comparison sorting algorithm',
        complexity: { time: 'O(n^2)', space: 'O(1)' },
        codeManifests: {
          typescript: {
            language: 'typescript',
            code: sampleCode,
            anchors: {
              OUT_OF_BOUNDS: [1, 999],
            },
          },
        },
        attribution: {
          source: 'Hello-Algo',
          license: 'CC BY-NC-SA 4.0',
        },
      })
    ).toThrow('Invalid semantic code anchor spans');
  });
});
