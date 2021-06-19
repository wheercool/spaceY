import { System } from './System';
import { EntityRegistry } from '../entities/EntityRegistry';
import { EntityBuilder } from '../entities/EntityBuilder';

/***
 * Combines multiple systems together and controls the order
 */
export class CompositorSystem implements System {
  constructor(public readonly systems: System[]) {
  }

  init(registry: EntityRegistry): void {
    const iterationEntity = new EntityBuilder()
      .applyComponent('iteration', 0)
      .build();
    registry.addEntity(iterationEntity);
    this.systems.forEach(system => system.init(registry));
  }

  update(registry: EntityRegistry): void {
    registry.findSingle(['iteration']).iteration++;
    for (const system of this.systems) {
      system.update(registry);
    }
  }
}
