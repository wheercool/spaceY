import { System } from './System';
import { EntityRegistry } from '../entities/EntityRegistry';

export class CollisionCleaningSystem implements System {
  init(registry: EntityRegistry): void {
  }

  update(registry: EntityRegistry): void {
    registry.findEntitiesByComponents(['collision'])
      .forEach(entity => registry.removeEntity(entity.id));
  }

}
