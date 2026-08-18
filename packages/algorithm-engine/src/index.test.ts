import { describe, it, expect } from 'vitest';
import {
  createEntityId,
  isEntityId,
  StepGuard,
  StepLimitExceededError,
  DEFAULT_STEP_LIMIT,
  createMulberry32,
} from './index.js';

describe('Algorithm Engine - Entity IDs', () => {
  it('generates deterministic stable entity IDs', () => {
    expect(createEntityId(0)).toBe('e_0');
    expect(createEntityId(42)).toBe('e_42');
  });

  it('validates entity ID format', () => {
    expect(isEntityId('e_0')).toBe(true);
    expect(isEntityId('e_999')).toBe(true);
    expect(isEntityId('e_-1')).toBe(false);
    expect(isEntityId('element_1')).toBe(false);
    expect(isEntityId(123)).toBe(false);
  });

  it('throws for negative entity indices', () => {
    expect(() => createEntityId(-1)).toThrow('non-negative integer');
  });
});

describe('Algorithm Engine - Step Guard', () => {
  it('allows iterations within step limit', () => {
    const guard = new StepGuard(5);
    for (let i = 0; i < 5; i++) {
      expect(guard.increment()).toBe(i + 1);
    }
    expect(guard.current).toBe(5);
  });

  it('throws StepLimitExceededError when limit is exceeded', () => {
    const guard = new StepGuard(3);
    guard.increment();
    guard.increment();
    guard.increment();
    expect(() => guard.increment()).toThrow(StepLimitExceededError);
  });

  it('uses default limit of 10,000 steps', () => {
    const guard = new StepGuard();
    expect(guard.limit).toBe(DEFAULT_STEP_LIMIT);
  });
});

describe('Algorithm Engine - Deterministic PRNG', () => {
  it('generates identical sequence for the same seed', () => {
    const prngA = createMulberry32(42);
    const prngB = createMulberry32(42);

    const seqA = [prngA(), prngA(), prngA(), prngA()];
    const seqB = [prngB(), prngB(), prngB(), prngB()];

    expect(seqA).toEqual(seqB);
  });

  it('generates different sequence for different seeds', () => {
    const prngA = createMulberry32(42);
    const prngB = createMulberry32(999);

    expect(prngA()).not.toBe(prngB());
  });

  it('produces numbers strictly in [0, 1)', () => {
    const prng = createMulberry32(12345);
    for (let i = 0; i < 100; i++) {
      const val = prng();
      expect(val).toBeGreaterThanOrEqual(0);
      expect(val).toBeLessThan(1);
    }
  });
});
