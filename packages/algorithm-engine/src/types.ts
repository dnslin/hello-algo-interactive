export type EntityId = `e_${number}`;

export interface NarrationPayload {
  key: string;
  args?: Record<string, unknown>;
}

export interface AlgorithmEvent<TPayload = unknown> {
  id: string;
  transactionId: string;
  sceneId: string;
  type: string;
  payload: TPayload;
}

export type SceneArea = 'main' | 'side' | 'bottom' | 'overlay';
export type RendererKind =
  | 'sequence'
  | 'linked'
  | 'graph'
  | 'tree'
  | 'grid'
  | 'board'
  | 'custom';

export interface SceneSpec {
  id: string;
  renderer: RendererKind;
  area: SceneArea;
  options?: Record<string, unknown>;
}

export interface Marker {
  id: string;
  index: number;
  transactionId: string;
  codeAnchor?: string;
  narration?: NarrationPayload;
  variables?: Record<string, unknown>;
}

export interface TimelineTransaction {
  id: string;
  markerIndex: number;
  events: AlgorithmEvent[];
}

export type VisualizationState =
  | 'idle'
  | 'comparing'
  | 'active'
  | 'selected'
  | 'visited'
  | 'sorted'
  | 'conflict';

export interface StateSnapshot<TScenes = Record<string, unknown>> {
  markerIndex: number;
  scenes: TScenes;
  variables: Record<string, unknown>;
  timestamp?: number;
}

export type CodeAnchorMap = Record<string, [number, number]>;

export interface TraceContext {
  seed?: number;
  stepGuardLimit?: number;
  random: () => number;
}

export interface TraceResult<TResult = unknown> {
  result: TResult;
  events: AlgorithmEvent[];
  markers: Marker[];
  transactions: TimelineTransaction[];
}

export type SceneReducer<TState = unknown> = (
  prevState: TState,
  event: AlgorithmEvent
) => TState;

export interface CompiledTimeline<TResult = unknown, TScenes = Record<string, unknown>> {
  traceResult: TraceResult<TResult>;
  snapshots: StateSnapshot<TScenes>[];
  markers: Marker[];
  transactions: TimelineTransaction[];
  totalMarkers: number;
  getSnapshot(markerIndex: number): StateSnapshot<TScenes>;
  getMarker(markerIndex: number): Marker;
}

export type PlayerStatus = 'idle' | 'playing' | 'paused' | 'ended';

export interface PlayerState<TScenes = Record<string, unknown>> {
  status: PlayerStatus;
  currentIndex: number;
  totalMarkers: number;
  speed: number;
  isLooping: boolean;
  currentMarker: Marker;
  currentSnapshot: StateSnapshot<TScenes>;
}

export interface AlgorithmModule<TInput, TResult> {
  id: string;
  title: string;
  category: string;
  defaultInput: TInput;
  scenes: SceneSpec[];
  trace(input: TInput, ctx: TraceContext): TraceResult<TResult>;
  codeAnchors?: Record<string, CodeAnchorMap>;
}
