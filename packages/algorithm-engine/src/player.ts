import type {
  CompiledTimeline,
  PlayerState,
  PlayerStatus,
} from './types.js';

export interface PlayerOptions {
  initialSpeed?: number;
  initialIndex?: number;
  loop?: boolean;
  autoPlay?: boolean;
  stepIntervalMs?: number;
}

export type PlayerListener<TScenes = Record<string, unknown>> = (
  state: PlayerState<TScenes>
) => void;

export type TimerId = ReturnType<typeof setTimeout>;
export class Player<TResult = unknown, TScenes = Record<string, unknown>> {
  private readonly timeline: CompiledTimeline<TResult, TScenes>;
  private currentIndex: number;
  private speed: number;
  private isLooping: boolean;
  private status: PlayerStatus = 'idle';
  private readonly stepIntervalMs: number;
  private timer: TimerId | null = null;
  private readonly listeners = new Set<PlayerListener<TScenes>>();

  constructor(
    timeline: CompiledTimeline<TResult, TScenes>,
    options: PlayerOptions = {}
  ) {
    this.timeline = timeline;
    this.speed = options.initialSpeed ?? 1;
    this.currentIndex = Math.max(
      0,
      Math.min(options.initialIndex ?? 0, Math.max(0, timeline.totalMarkers - 1))
    );
    this.isLooping = options.loop ?? false;
    this.stepIntervalMs = options.stepIntervalMs ?? 800;

    if (options.autoPlay && timeline.totalMarkers > 1) {
      this.play();
    }
  }

  public getState(): PlayerState<TScenes> {
    const currentMarker = this.timeline.getMarker(this.currentIndex);
    const currentSnapshot = this.timeline.getSnapshot(this.currentIndex);

    return {
      status: this.status,
      currentIndex: this.currentIndex,
      totalMarkers: this.timeline.totalMarkers,
      speed: this.speed,
      isLooping: this.isLooping,
      currentMarker,
      currentSnapshot,
    };
  }

  public subscribe(listener: PlayerListener<TScenes>): () => void {
    this.listeners.add(listener);
    // Emit current state immediately to the new listener
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    const state = this.getState();
    for (const listener of this.listeners) {
      try {
        listener(state);
      } catch (err) {
        console.error('Error in Player listener callback:', err);
      }
    }
  }

  private clearTimer(): void {
    if (this.timer !== null) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  private scheduleNextStep(): void {
    this.clearTimer();
    if (this.status !== 'playing') {
      return;
    }

    const interval = Math.max(
      30,
      Math.round(this.stepIntervalMs / Math.max(0.1, this.speed))
    );

    this.timer = setTimeout(() => {
      if (this.status !== 'playing') {
        return;
      }

      if (this.currentIndex < this.timeline.totalMarkers - 1) {
        this.currentIndex++;
        this.notify();
        this.scheduleNextStep();
      } else {
        // End reached
        if (this.isLooping) {
          this.currentIndex = 0;
          this.notify();
          this.scheduleNextStep();
        } else {
          this.status = 'ended';
          this.clearTimer();
          this.notify();
        }
      }
    }, interval);
  }

  public play(): void {
    if (this.timeline.totalMarkers <= 1) {
      return;
    }

    // If at the end, restart from 0
    if (this.currentIndex >= this.timeline.totalMarkers - 1) {
      this.currentIndex = 0;
    }

    this.status = 'playing';
    this.notify();
    this.scheduleNextStep();
  }

  public pause(): void {
    this.clearTimer();
    this.status = 'paused';
    this.notify();
  }

  public togglePlay(): void {
    if (this.status === 'playing') {
      this.pause();
    } else {
      this.play();
    }
  }

  public stepForward(): void {
    this.clearTimer();
    this.status = 'paused';
    if (this.currentIndex < this.timeline.totalMarkers - 1) {
      this.currentIndex++;
    }
    this.notify();
  }

  public stepBackward(): void {
    this.clearTimer();
    this.status = 'paused';
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
    this.notify();
  }

  public seek(markerIndex: number): void {
    this.clearTimer();
    const clamped = Math.max(
      0,
      Math.min(markerIndex, this.timeline.totalMarkers - 1)
    );
    this.currentIndex = clamped;
    if (this.status === 'ended' && clamped < this.timeline.totalMarkers - 1) {
      this.status = 'paused';
    }
    this.notify();
    if (this.status === 'playing') {
      this.scheduleNextStep();
    }
  }

  public setSpeed(speed: number): void {
    if (speed <= 0) {
      return;
    }
    this.speed = speed;
    this.notify();
    if (this.status === 'playing') {
      this.scheduleNextStep();
    }
  }

  public setLoop(loop: boolean): void {
    this.isLooping = loop;
    this.notify();
  }

  public reset(): void {
    this.clearTimer();
    this.currentIndex = 0;
    this.status = 'idle';
    this.notify();
  }

  public destroy(): void {
    this.clearTimer();
    this.listeners.clear();
    this.status = 'idle';
  }
}
