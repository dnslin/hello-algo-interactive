import type {
  CompiledTimeline,
  Marker,
  SceneReducer,
  StateSnapshot,
  TimelineTransaction,
  TraceResult,
} from './types.js';
import { sequenceReducer } from './reducers/sequence-reducer.js';

export interface TimelineCompilerOptions<TScenes = Record<string, unknown>> {
  initialScenes: TScenes;
  sceneReducers?: Record<string, SceneReducer<any>>;
}

function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item)) as unknown as T;
  }
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    result[key] = deepClone(value);
  }
  return result as T;
}

export class TimelineCompiler {
  private static defaultReducers: Record<string, SceneReducer<any>> = {
    main: sequenceReducer,
    sequence: sequenceReducer,
  };

  public static compile<TResult = unknown, TScenes = Record<string, unknown>>(
    traceResult: TraceResult<TResult>,
    options: TimelineCompilerOptions<TScenes>
  ): CompiledTimeline<TResult, TScenes> {
    const { initialScenes, sceneReducers = {} } = options;
    const activeReducers = { ...this.defaultReducers, ...sceneReducers };

    const snapshots: StateSnapshot<TScenes>[] = [];
    let currentScenes = deepClone(initialScenes);

    const markers = traceResult.markers;
    const transactions = traceResult.transactions;

    // Transaction lookup map by markerIndex
    const txByMarkerIndex = new Map<number, TimelineTransaction>();
    for (const tx of transactions) {
      txByMarkerIndex.set(tx.markerIndex, tx);
    }

    // Step 0 / Marker 0: Initial state before any transaction events
    if (markers.length === 0) {
      snapshots.push({
        markerIndex: 0,
        scenes: deepClone(currentScenes),
        variables: {},
      });
    } else {
      for (let i = 0; i < markers.length; i++) {
        const marker = markers[i];
        const tx = txByMarkerIndex.get(i);

        if (tx && tx.events.length > 0) {
          for (const event of tx.events) {
            const sceneId = event.sceneId;
            const reducer = activeReducers[sceneId] ?? activeReducers['main'] ?? sequenceReducer;
            const prevSceneState = (currentScenes as Record<string, unknown>)[sceneId];
            if (prevSceneState !== undefined) {
              (currentScenes as Record<string, unknown>)[sceneId] = reducer(
                prevSceneState,
                event
              );
            }
          }
        }

        snapshots.push({
          markerIndex: i,
          scenes: deepClone(currentScenes),
          variables: marker.variables ? deepClone(marker.variables) : {},
        });
      }
    }

    return {
      traceResult,
      snapshots,
      markers,
      transactions,
      totalMarkers: markers.length,
      getSnapshot(index: number): StateSnapshot<TScenes> {
        const clamped = Math.max(0, Math.min(index, snapshots.length - 1));
        return snapshots[clamped];
      },
      getMarker(index: number): Marker {
        const clamped = Math.max(0, Math.min(index, markers.length - 1));
        return markers[clamped];
      },
    };
  }
}
