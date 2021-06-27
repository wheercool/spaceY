import { System } from './System';
import { EntityRegistry } from '../entities/EntityRegistry';
import { add, copy, distanceBetween, divByScalar, length, mulByScalar, normalize, sub } from '@shared/types/Point2D';
import { EntityBuilder } from '../entities/EntityBuilder';

/***
 * Calculates the next position of the entity based on the stermer-verle formula (by means of position, prevPosition and acceleration)
 */
export class MovementSystem implements System {
  update(registry: EntityRegistry): void {
    const elements = registry.findEntitiesByComponents(['position']);

    const prevPositions = [];
    for (let element of elements) {
      prevPositions.push(EntityBuilder.fromEntity(element)
        .getOrDefault('prevPosition', copy(element.position))
      )
    }
    const time = registry.findSingle(['time']).time;
    for (let i = 0; i < elements.length; i++) {
      let element = elements[i];
      const acceleration = EntityBuilder.fromEntity(element).getOrDefault('acceleration', {x: 0, y: 0});
      const prevPosition = prevPositions[i];
      let newPosition = [
        mulByScalar(element.position, 2),
        mulByScalar(prevPosition, -1),
        mulByScalar(acceleration, time.dt * time.dt)
      ].reduce(add);

      EntityBuilder.fromEntity(element)
        .applyComponent('prevPosition', element.position)
        .applyComponent('position', newPosition)

    }
  }

  init(registry: EntityRegistry): void {
  }
}
