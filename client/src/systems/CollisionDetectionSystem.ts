import { System } from './System';
import { EntityRegistry } from '../entities/EntityRegistry';
import { Entity } from '../entities/Entity';
import { BoundariesComponent, BoundingCircle, positionAbsolute } from '../components/BoundariesComponent';
import { PositionComponent } from '../components/PositionComponent';
import { RotationComponent } from '../components/RotationComponent';
import { distanceBetween } from '@shared/types/Point2D';

type CollisionEntity = Entity & { boundaries: BoundariesComponent, position: PositionComponent, rotation: RotationComponent };

/***
 * Detects collisions between entities with boundins
 */
export class CollisionDetectionSystem implements System {
  init(registry: EntityRegistry): void {
  }

  update(registry: EntityRegistry): void {
    const entities = registry.findEntitiesByComponents(['boundaries', 'position', 'rotation']);
    for (let i = 0; i < entities.length; i++) {
      for (let j = i + 1; j < entities.length; j++) {
        if (this.collides(entities[i], entities[j])) {
          console.log('Detected');
          // detected
        }
      }
    }
  }

  private collides(e1: CollisionEntity,
                   e2: CollisionEntity) {
    const firstCircles = positionAbsolute(e1.boundaries, e1.position, e1.rotation);
    const secondCircles = positionAbsolute(e2.boundaries, e2.position, e2.rotation);
    return firstCircles.some(bounding => secondCircles.some(
      bounding2 => CollisionDetectionSystem.isCirclesIntersected(bounding, bounding2))
    );
  }

  static isCirclesIntersected(a: BoundingCircle, b: BoundingCircle): boolean {
    return distanceBetween(a.position, b.position) <= (a.radius + b.radius);
  }


}

