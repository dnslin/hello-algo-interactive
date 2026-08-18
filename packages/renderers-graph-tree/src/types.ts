import type { EntityId } from '@hello-algo/algorithm-engine';

export type NodeVisualState =
  | 'idle'
  | 'active'
  | 'visited'
  | 'selected'
  | 'conflict';

export type EdgeVisualState =
  | 'idle'
  | 'active'
  | 'visited'
  | 'highlighted';

export interface GraphNode<T = unknown> {
  id: EntityId;
  label: string;
  value?: T;
  state: NodeVisualState;
  x?: number;
  y?: number;
}

export interface GraphEdge {
  id: string;
  source: EntityId;
  target: EntityId;
  weight?: number;
  directed?: boolean;
  state: EdgeVisualState;
}

export interface GraphSceneState<T = unknown> {
  nodes: GraphNode<T>[];
  edges: GraphEdge[];
  selectedNodeId?: EntityId | null;
}

export interface TreeNode<T = unknown> {
  id: EntityId;
  value: T;
  left?: TreeNode<T> | null;
  right?: TreeNode<T> | null;
  state: NodeVisualState;
  isLeaf?: boolean;
}

export interface TreeSceneState<T = unknown> {
  root: TreeNode<T> | null;
  highlightedPath?: EntityId[];
}
