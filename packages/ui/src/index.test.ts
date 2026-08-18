import { describe, it, expect } from 'vitest';
import {
  STATE_COLORS,
  MOTION_TOKENS,
  getScaledDuration,
  helloAlgoTailwindPreset,
  cn,
} from './index.js';

describe('UI Design Tokens - Color Palette', () => {
  const requiredStates = [
    'idle',
    'comparing',
    'active',
    'selected',
    'visited',
    'sorted',
    'conflict',
  ] as const;

  it('defines all 7 required visualization states', () => {
    for (const state of requiredStates) {
      expect(STATE_COLORS[state]).toBeDefined();
      expect(STATE_COLORS[state].name).toBe(state);
      expect(STATE_COLORS[state].light.bg).toMatch(/^oklch\(/);
      expect(STATE_COLORS[state].dark.bg).toMatch(/^oklch\(/);
    }
  });
});

describe('UI Design Tokens - Motion', () => {
  it('defines standard motion durations and easings', () => {
    expect(MOTION_TOKENS.focus.durationMs).toBe(180);
    expect(MOTION_TOKENS.compare.durationMs).toBe(240);
    expect(MOTION_TOKENS.move.durationMs).toBe(420);
    expect(MOTION_TOKENS.structural.durationMs).toBe(560);
  });

  it('scales duration with speed factor', () => {
    expect(getScaledDuration(400, 2)).toBe(200);
    expect(getScaledDuration(400, 0.5)).toBe(800);
    expect(getScaledDuration(400, 1)).toBe(400);
  });

  it('collapses duration to 0ms when reduced motion is preferred', () => {
    expect(getScaledDuration(400, 1, true)).toBe(0);
    expect(getScaledDuration(600, 2, true)).toBe(0);
  });
});

describe('UI Tailwind Preset & Utils', () => {
  it('includes viz color definitions in preset', () => {
    const extendColors = helloAlgoTailwindPreset.theme?.extend?.colors as Record<string, unknown>;
    expect(extendColors).toBeDefined();
    expect(extendColors.viz).toBeDefined();
  });

  it('merges class names cleanly with cn utility', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
    expect(cn('bg-red-500', undefined, false && 'hidden', 'bg-blue-500')).toBe('bg-blue-500');
  });
});
