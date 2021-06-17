import { System } from './System';
import { EntityRegistry } from '../entities/EntityRegistry';
import { EntityBuilder } from '../entities/EntityBuilder';
import { add, divByScalar } from '@shared/types/GameState';

export class Acceleration implements System {
  init(registry: EntityRegistry): void {
  }

  update(registry: EntityRegistry): void {
    const withGravity = registry.findEntitiesByComponents(['gravity', 'mass']);
    for (let element of withGravity) {
      const entity = EntityBuilder.fromEntity(element);
      const pullingForce = entity.getOrDefault('pullingForce', { x: 0, y: 0 });
      entity.applyComponent('acceleration', divByScalar(
        add(pullingForce, element.gravity),
        element.mass));
    }
  }

}
