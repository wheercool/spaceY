import { Entity } from '../entities/Entity';

export type CollisionComponent = {
  entity1: Entity['id'];
  entity2: Entity['id'];
}
