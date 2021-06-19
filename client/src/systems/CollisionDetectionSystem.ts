import { System } from './System';
import { EntityRegistry } from '../entities/EntityRegistry';
import { Entity } from '../entities/Entity';
import { BoundariesComponent, BoundingCircle, positionAbsolute } from '../components/BoundariesComponent';
import { PositionComponent } from '../components/PositionComponent';
import { distanceBetween } from '@shared/types/Point2D';
import { EntityBuilder } from '../entities/EntityBuilder';

type CollisionEntity = Entity & { boundaries: BoundariesComponent, position: PositionComponent };

/***
 * Detects collisions between entities with boundins
 */
export class CollisionDetectionSystem implements System {
  init(registry: EntityRegistry): void {
  }

  update(registry: EntityRegistry): void {
    const entities = registry.findEntitiesByComponents(['boundaries', 'position']);
    for (let i = 0; i < entities.length; i++) {
      for (let j = i + 1; j < entities.length; j++) {
        if (this.collides(entities[i], entities[j])) {
          const collisionEntity = new EntityBuilder()
            .applyComponent('collision', {
              entity1: entities[i].id,
              entity2: entities[j].id
            })
            .build();
          registry.addEntity(collisionEntity);
        }
      }
    }
  }

  private collides(e1: CollisionEntity,
                   e2: CollisionEntity) {
    const firstAngle = EntityBuilder.fromEntity(e1).getOrDefault('rotation', 0);
    const secondAngle = EntityBuilder.fromEntity(e2).getOrDefault('rotation', 0);
    const firstCircles = positionAbsolute(e1.boundaries, e1.position, firstAngle);
    const secondCircles = positionAbsolute(e2.boundaries, e2.position, secondAngle);
    return firstCircles.some(bounding => secondCircles.some(
      bounding2 => CollisionDetectionSystem.isCirclesIntersected(bounding, bounding2))
    );
  }

  static isCirclesIntersected(a: BoundingCircle, b: BoundingCircle): boolean {
    return distanceBetween(a.position, b.position) <= (a.radius + b.radius);
  }


}

