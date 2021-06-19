import { System } from './System';
import { EntityRegistry } from '../entities/EntityRegistry';
import { EntityBuilder } from '../entities/EntityBuilder';
import { add, divByScalar } from '@shared/types/Point2D';

/***
 * Calculates acceleration based on the result of forces applied to the entity and its mass
 */
export class AccelerationSystem implements System {
  init(registry: EntityRegistry): void {
  }

  update(registry: EntityRegistry): void {
    const withGravity = registry.findEntitiesByComponents(['gravityForce', 'mass']);
    for (let element of withGravity) {
      const entity = EntityBuilder.fromEntity(element);
      const pullingForce = entity.getOrDefault('pullingForce', { x: 0, y: 0 });
      const isStatic = entity.getOrDefault('static', false);
      const acceleration = isStatic
        ? { x: 0, y: 0 }
        : divByScalar(
          add(pullingForce, element.gravityForce),
          element.mass);
      entity.applyComponent('acceleration', acceleration);
    }
  }

}
