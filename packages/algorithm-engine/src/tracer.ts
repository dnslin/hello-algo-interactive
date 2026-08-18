import type {
  AlgorithmEvent,
  EntityId,
  Marker,
  NarrationPayload,
  TimelineTransaction,
  TraceResult,
  VisualizationState,
} from './types.js';
import { StepGuard, DEFAULT_STEP_LIMIT } from './guard.js';

export interface TracerOptions {
  sceneId?: string;
  stepLimit?: number;
}

export interface MarkOptions {
  codeAnchor?: string;
  narration?: NarrationPayload;
  variables?: Record<string, unknown>;
}

export class Tracer {
  private readonly defaultSceneId: string;
  private readonly stepGuard: StepGuard;
  private readonly allEvents: AlgorithmEvent[] = [];
  private readonly markers: Marker[] = [];
  private readonly transactions: TimelineTransaction[] = [];
  private currentTxEvents: AlgorithmEvent[] = [];
  private eventCounter = 0;
  private transactionCounter = 0;

  constructor(options: TracerOptions = {}) {
    this.defaultSceneId = options.sceneId ?? 'main';
    this.stepGuard = new StepGuard(options.stepLimit ?? DEFAULT_STEP_LIMIT);
  }

  public mark(options: MarkOptions = {}): Marker {
    this.stepGuard.increment();

    const markerIndex = this.markers.length;
    const txId = `tx_${this.transactionCounter++}`;
    const markerId = `m_${markerIndex}`;

    // Commit accumulated events into a transaction for this marker
    this.transactions.push({
      id: txId,
      markerIndex,
      events: [...this.currentTxEvents],
    });
    this.currentTxEvents = [];

    const marker: Marker = {
      id: markerId,
      index: markerIndex,
      transactionId: txId,
      codeAnchor: options.codeAnchor,
      narration: options.narration,
      variables: options.variables ? { ...options.variables } : undefined,
    };

    this.markers.push(marker);
    return marker;
  }

  public emit<TPayload = Record<string, unknown>>(
    type: string,
    payload: TPayload,
    sceneId?: string
  ): AlgorithmEvent<TPayload> {
    this.stepGuard.increment();

    const currentTxId =
      this.transactions.length > 0
        ? `tx_${this.transactionCounter}`
        : `tx_init`;

    const event: AlgorithmEvent<TPayload> = {
      id: `evt_${this.eventCounter++}`,
      transactionId: currentTxId,
      sceneId: sceneId ?? this.defaultSceneId,
      type,
      payload,
    };

    this.allEvents.push(event as AlgorithmEvent);
    this.currentTxEvents.push(event as AlgorithmEvent);
    return event;
  }

  // Sequence scene helpers
  public compare(
    indices: [number, number],
    entityIds?: [EntityId, EntityId],
    sceneId?: string
  ): AlgorithmEvent {
    return this.emit('sequence:compare', { indices, entityIds }, sceneId);
  }

  public swap(
    indices: [number, number],
    entityIds?: [EntityId, EntityId],
    sceneId?: string
  ): AlgorithmEvent {
    return this.emit('sequence:swap', { indices, entityIds }, sceneId);
  }

  public setElementState(
    indices: number | number[],
    state: VisualizationState,
    sceneId?: string
  ): AlgorithmEvent {
    const list = Array.isArray(indices) ? indices : [indices];
    return this.emit('sequence:set_state', { indices: list, state }, sceneId);
  }

  public setPointer(
    name: string,
    index: number,
    options?: { label?: string },
    sceneId?: string
  ): AlgorithmEvent {
    return this.emit(
      'sequence:set_pointer',
      { name, index, ...options },
      sceneId
    );
  }

  public removePointer(name: string, sceneId?: string): AlgorithmEvent {
    return this.emit('sequence:remove_pointer', { name }, sceneId);
  }

  public clearPointers(sceneId?: string): AlgorithmEvent {
    return this.emit('sequence:clear_pointers', {}, sceneId);
  }

  public markSorted(indices: number | number[], sceneId?: string): AlgorithmEvent {
    const list = Array.isArray(indices) ? indices : [indices];
    return this.emit('sequence:mark_sorted', { indices: list }, sceneId);
  }

  public resetElementStates(sceneId?: string): AlgorithmEvent {
    return this.emit('sequence:reset_element_states', {}, sceneId);
  }

  public toTraceResult<TResult>(result: TResult): TraceResult<TResult> {
    // If there are trailing events not attached to a transaction, commit them
    if (this.currentTxEvents.length > 0) {
      const txId = `tx_${this.transactionCounter++}`;
      this.transactions.push({
        id: txId,
        markerIndex: this.markers.length,
        events: [...this.currentTxEvents],
      });
      this.currentTxEvents = [];
    }

    return {
      result,
      events: [...this.allEvents],
      markers: [...this.markers],
      transactions: [...this.transactions],
    };
  }
}
