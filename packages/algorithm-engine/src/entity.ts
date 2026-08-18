import type { EntityId } from './types.js';

export function createEntityId(index: number): EntityId {
  if (index < 0 || !Number.isInteger(index)) {
    throw new Error(`Entity ID index must be a non-negative integer, received: ${index}`);
  }
  return `e_${index}`;
}

export function isEntityId(value: unknown): value is EntityId {
  return typeof value === 'string' && /^e_\d+$/.test(value);
}
