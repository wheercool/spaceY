import { System } from './System';
import { EntityRegistry } from '../entities/EntityRegistry';
/***
 * Combines multiple systems together and controls the update order
 */
export class CompositorSystem implements System {
  constructor(public readonly systems: System[]) {
  }

  init(registry: EntityRegistry): void {
    this.systems.forEach(system => system.init(registry));
  }

  update(registry: EntityRegistry): void {
    for (const system of this.systems) {
      system.update(registry);
    }
  }
}
