import { describe, it, expect, vi } from 'vitest';
import {
  createEntityId,
  isEntityId,
  StepGuard,
  StepLimitExceededError,
  DEFAULT_STEP_LIMIT,
  createMulberry32,
  Tracer,
  TimelineCompiler,
  Player,
  createInitialSequenceState,
  sequenceReducer,
  traceBubbleSort,
  bubbleSortAlgorithm,
  DEFAULT_BUBBLE_SORT_INPUT,
  SequenceSceneState,
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

describe('Algorithm Engine - Tracer & Pure Reducer', () => {
  it('records events, markers, and transactions correctly', () => {
    const tracer = new Tracer();
    tracer.mark({ codeAnchor: 'START', variables: { count: 0 } });
    tracer.setPointer('i', 0);
    tracer.compare([0, 1]);
    tracer.mark({ codeAnchor: 'COMPARE', variables: { count: 1 } });
    tracer.swap([0, 1]);
    tracer.mark({ codeAnchor: 'SWAP', variables: { count: 2 } });

    const traceResult = tracer.toTraceResult([2, 1]);
    expect(traceResult.markers).toHaveLength(3);
    expect(traceResult.events.length).toBeGreaterThanOrEqual(3);
    expect(traceResult.transactions).toHaveLength(3);
    expect(traceResult.result).toEqual([2, 1]);
  });

  it('sequence reducer handles compare, swap, and mark_sorted with immutable copies', () => {
    const initial = createInitialSequenceState([4, 2]);
    const comparingState = sequenceReducer(initial, {
      id: 'e1',
      transactionId: 't1',
      sceneId: 'main',
      type: 'sequence:compare',
      payload: { indices: [0, 1] },
    });

    expect(comparingState.elements[0].state).toBe('comparing');
    expect(comparingState.elements[1].state).toBe('comparing');
    expect(initial.elements[0].state).toBe('idle'); // Immutability test

    const swappedState = sequenceReducer(comparingState, {
      id: 'e2',
      transactionId: 't2',
      sceneId: 'main',
      type: 'sequence:swap',
      payload: { indices: [0, 1] },
    });

    expect(swappedState.elements[0].value).toBe(2);
    expect(swappedState.elements[0].id).toBe('e_1'); // Preserves stable Entity ID
    expect(swappedState.elements[1].value).toBe(4);
    expect(swappedState.elements[1].id).toBe('e_0');
  });
});

describe('Algorithm Engine - Bubble Sort & TimelineCompiler', () => {
  it('correctly traces bubble sort and produces sorted array', () => {
    const input = [4, 1, 3, 1, 5, 2];
    const traceResult = traceBubbleSort(input);

    expect(traceResult.result).toEqual([1, 1, 2, 3, 4, 5]);
    expect(traceResult.markers.length).toBeGreaterThan(0);
    expect(traceResult.events.length).toBeGreaterThan(0);
  });

  it('respects StepGuard limit and throws on tight limit', () => {
    expect(() => {
      traceBubbleSort([5, 4, 3, 2, 1], { stepGuardLimit: 5 });
    }).toThrow(StepLimitExceededError);
  });

  it('maintains stability for duplicate values with stable Entity IDs', () => {
    const input = [4, 1, 3, 1, 5, 2];
    // Index 1 has value 1 (e_1), Index 3 has value 1 (e_3)
    const traceResult = traceBubbleSort(input);
    const initialScene = createInitialSequenceState(input);
    const timeline = TimelineCompiler.compile<number[], { main: SequenceSceneState<number> }>(
      traceResult,
      { initialScenes: { main: initialScene } }
    );

    const finalSnapshot = timeline.getSnapshot(timeline.totalMarkers - 1);
    const finalElements = finalSnapshot.scenes.main.elements;

    expect(finalElements.map((el) => el.value)).toEqual([1, 1, 2, 3, 4, 5]);
    // The two '1's must maintain their original relative order (e_1 before e_3)
    const ones = finalElements.filter((el) => el.value === 1);
    expect(ones).toHaveLength(2);
    expect(ones[0].id).toBe('e_1');
    expect(ones[1].id).toBe('e_3');
    // All elements in final snapshot must be in 'sorted' state
    expect(finalElements.every((el) => el.state === 'sorted')).toBe(true);
  });

  it('guarantees O(1) snapshot idempotency across forward N and backward K steps', () => {
    const input = DEFAULT_BUBBLE_SORT_INPUT;
    const traceResult = bubbleSortAlgorithm.trace(input, {
      random: Math.random,
    });
    const initialScene = createInitialSequenceState(input);
    const timeline = TimelineCompiler.compile(traceResult, {
      initialScenes: { main: initialScene },
    });

    const total = timeline.totalMarkers;
    expect(total).toBeGreaterThan(10);

    // Verify each snapshot is immutable and deterministic
    for (let step = 0; step < total; step++) {
      const directSnapshot = timeline.getSnapshot(step);
      expect(directSnapshot.markerIndex).toBe(step);

      // Repeated access produces equal state
      const reaccessed = timeline.getSnapshot(step);
      expect(reaccessed).toEqual(directSnapshot);
    }

    // Forward N steps, backward K steps check
    const step10 = timeline.getSnapshot(10);
    const step20 = timeline.getSnapshot(20);
    const backTo10 = timeline.getSnapshot(10);

    expect(backTo10).toEqual(step10);
    expect(backTo10).not.toEqual(step20);
  });

  it('handles edge case inputs (empty array and single element)', () => {
    const emptyResult = traceBubbleSort([]);
    expect(emptyResult.result).toEqual([]);

    const singleResult = traceBubbleSort([42]);
    expect(singleResult.result).toEqual([42]);
    expect(singleResult.markers.length).toBeGreaterThanOrEqual(1);
  });
});

describe('Algorithm Engine - Player Controller', () => {
  it('controls playback lifecycle (play, pause, stepForward, stepBackward, seek, reset)', () => {
    const traceResult = traceBubbleSort([3, 1, 2]);
    const timeline = TimelineCompiler.compile(traceResult, {
      initialScenes: { main: createInitialSequenceState([3, 1, 2]) },
    });

    const player = new Player(timeline, { initialSpeed: 2 });
    expect(player.getState().status).toBe('idle');
    expect(player.getState().currentIndex).toBe(0);

    player.stepForward();
    expect(player.getState().currentIndex).toBe(1);
    expect(player.getState().status).toBe('paused');

    player.stepForward();
    expect(player.getState().currentIndex).toBe(2);

    player.stepBackward();
    expect(player.getState().currentIndex).toBe(1);

    player.seek(5);
    expect(player.getState().currentIndex).toBe(5);

    player.setSpeed(1.5);
    expect(player.getState().speed).toBe(1.5);

    player.setLoop(true);
    expect(player.getState().isLooping).toBe(true);

    player.reset();
    expect(player.getState().currentIndex).toBe(0);
    expect(player.getState().status).toBe('idle');

    player.destroy();
  });

  it('notifies subscribers on state change', () => {
    const traceResult = traceBubbleSort([2, 1]);
    const timeline = TimelineCompiler.compile(traceResult, {
      initialScenes: { main: createInitialSequenceState([2, 1]) },
    });

    const player = new Player(timeline);
    const listener = vi.fn();
    const unsubscribe = player.subscribe(listener);

    expect(listener).toHaveBeenCalledTimes(1); // Called on subscription

    player.stepForward();
    expect(listener).toHaveBeenCalledTimes(2);

    unsubscribe();
    player.stepForward();
    expect(listener).toHaveBeenCalledTimes(2); // No new call after unsubscribe
    player.destroy();
  });
});
