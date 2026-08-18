import type { EntityId } from '@hello-algo/algorithm-engine';

export type LinkedNodeState =
  | 'idle'
  | 'active'
  | 'visited'
  | 'selected'
  | 'conflict';

export interface LinkedNode<T = unknown> {
  id: EntityId;
  value: T;
  state: LinkedNodeState;
  nextId?: EntityId | null;
  prevId?: EntityId | null;
}

export interface LinkedSceneState<T = unknown> {
  nodes: Record<EntityId, LinkedNode<T>>;
  headId: EntityId | null;
  tailId?: EntityId | null;
  pointers: Record<string, EntityId | null>;
}
