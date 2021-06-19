import { System } from './System';
import { EntityRegistry } from '../entities/EntityRegistry';

/***
 * Updates iterations of the entities
 */
export class IterationSystem implements System {
  init(registry: EntityRegistry): void {
  }

  update(registry: EntityRegistry): void {
    const entities = registry.findEntitiesByComponents(['iteration']);
    for (const entity of entities) {
      entity.iteration++;
    }
  }
}
