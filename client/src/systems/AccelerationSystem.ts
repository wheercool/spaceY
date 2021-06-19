import { System } from './System';
import { EntityRegistry } from '../entities/EntityRegistry';
import { EntityBuilder } from '../entities/EntityBuilder';
import { add, divByScalar } from '@shared/types/GameState';


// Entity with that mass or above will not move
const STARTING_MASS_IGNORING_FORCES = 100000;

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
      const acceleration = element.mass < STARTING_MASS_IGNORING_FORCES
        ? divByScalar(
          add(pullingForce, element.gravityForce),
          element.mass)
        : { x: 0, y: 0 };
      entity.applyComponent('acceleration', acceleration);
    }
  }

}
