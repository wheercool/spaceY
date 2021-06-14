import { System } from './System';
import { EntityRegistry } from '../entities/EntityRegistry';
import { EntityBuilder } from '../entities/EntityBuilder';

export class Compositor implements System {
  constructor(public readonly systems: System[]) {
  }

  update(registry: EntityRegistry): void {
    let iterations = registry.findEntitiesByComponents(['iteration']);
    if (!iterations.length) {
      const iterationEntity = new EntityBuilder()
        .applyComponent('iteration', 1)
        .build();
      registry.addEntity(iterationEntity);
    } else {
      const iterationEntity = iterations[0];
      iterationEntity.iteration++;
    }

    for (const system of this.systems) {
      system.update(registry);
    }
  }
}
