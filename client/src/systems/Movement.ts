import { System } from './System';
import { EntityRegistry } from '../entities/EntityRegistry';
import { add, copy, mulByScalar } from '@shared/types/GameState';
import { EntityBuilder } from '../entities/EntityBuilder';

export class Movement implements System {
  update(registry: EntityRegistry): void {
    const elements = registry.findEntitiesByComponents(['position', 'acceleration']);

    const prevPositions = [];
    for (let element of elements) {
      prevPositions.push(EntityBuilder.fromEntity(element)
        .getOrDefault('prevPosition', copy(element.position))
      )
    }
    const time = registry.findSingle(['time']).time;
    for (let i = 0; i < elements.length; i++) {
      let element = elements[i];
      const prevPosition = prevPositions[i];
      const newPosition = [
        mulByScalar(element.position, 2),
        mulByScalar(prevPosition, -1),
        mulByScalar(element.acceleration, time.dt * time.dt)
      ].reduce(add);

      EntityBuilder.fromEntity(element)
        .applyComponent('prevPosition', element.position)
        .applyComponent('position', newPosition)

    }
  }

  init(registry: EntityRegistry): void {
  }
}
