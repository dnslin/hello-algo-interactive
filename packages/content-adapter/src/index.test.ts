import { describe, it, expect } from 'vitest';
import {
  getAnchorLineSpan,
  validateCodeAnchorMap,
  LanguageCodeManifest,
} from './index.js';

describe('Content Adapter - Semantic Code Anchors', () => {
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
