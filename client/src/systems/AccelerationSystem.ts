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
    const withMass = registry.findEntitiesByComponents(['mass']);
    for (let element of withMass) {
      const entity = EntityBuilder.fromEntity(element);
      const pullingForce = entity.getOrDefault('pullingForce', { x: 0, y: 0 });
      const gravityForce = entity.getOrDefault('gravityForce', { x: 0, y: 0 });
      const isStatic = entity.getOrDefault('static', false);
      const force = add(pullingForce, gravityForce);
      const acceleration = isStatic
        ? { x: 0, y: 0 }
        : divByScalar(
          force,
          element.mass === 0 ? 1 : element.mass);

      entity.applyComponent('acceleration', acceleration);
    }
  }

}
