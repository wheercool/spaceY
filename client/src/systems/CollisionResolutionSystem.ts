import { System } from './System';
import { EntityRegistry } from '../entities/EntityRegistry';
import { EntityBuilder } from '../entities/EntityBuilder';
import { negate } from '@shared/types/Point2D';
import { Entity, hasEntityComponent } from '../entities/Entity';

export class CollisionResolutionSystem implements System {
  init(registry: EntityRegistry): void {
  }

  update(registry: EntityRegistry): void {
    const entities = registry.findEntitiesByComponents(['collision']);

    for (const { collision, id: collisionId } of entities) {
      const first = registry.findById(collision.entity1);
      const second = registry.findById(collision.entity1);
      const collided = [first, second];
      let player: Entity | undefined,
          asteroid: Entity | undefined;
      for (let entity of collided) {
        if (hasEntityComponent(entity, 'player')) {
          player = entity;
        }
        if (hasEntityComponent(entity, 'asteroid')) {
          asteroid = entity;
        }
      }

      if (asteroid && player) {
        registry.removeEntity(asteroid.id);
      }
      registry.removeEntity(collisionId);
    }
  }
}
