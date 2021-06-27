import { System } from './System';
import { EntityRegistry } from '../entities/EntityRegistry';
import { add, distanceBetween, mulByScalar, normalize, sub } from '@shared/types/Point2D';
import { EntityBuilder } from '../entities/EntityBuilder';


const MAX_SPEED = 20;

export class MaxSpeedSystem implements System {
  init(registry: EntityRegistry): void {
  }

  update(registry: EntityRegistry): void {
    const elements = registry.findEntitiesByComponents(['position', 'prevPosition']);

    for (let element of elements) {
      const entityBuilder = EntityBuilder.fromEntity(element);
      let newPosition = element.position;
      const prevPosition = element.prevPosition;
      const maxSpeed = entityBuilder.getOrDefault('maxSpeed', MAX_SPEED)

      let speed = distanceBetween(newPosition, prevPosition);
      const speedVector = sub(newPosition, prevPosition);
      if (speed > maxSpeed) {
        console.log('MAX_SPEED', speed)
        newPosition = add(prevPosition, mulByScalar(normalize(speedVector), maxSpeed));
        EntityBuilder.fromEntity(element)
          .applyComponent('position', newPosition)
      }
    }
  }
}
