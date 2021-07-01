import { EntityId } from '../types';

export type CollisionComponent = {
  entity1: EntityId;
  entity2: EntityId;
}


export function collisionEquals(first: CollisionComponent, second: CollisionComponent) {
  return first.entity1 == second.entity1 && first.entity2 === second.entity2
      || first.entity1 == second.entity2 && first.entity2 == second.entity1;
}
