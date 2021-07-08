import { System } from './System';
import { EntityRegistry } from '../entities/EntityRegistry';

export class WorldBoundarySystem implements System {
  init(registry: EntityRegistry): void {
  }

  update(registry: EntityRegistry): void {
    const mapEntity = registry.findSingle(['map']);
    const width = mapEntity.map.width;
    const height = mapEntity.map.height;

    const entities = registry.findEntitiesByComponents(['position', 'mapDependent']);
    for (const entity of entities) {
      if (entity.position.x < 0) {
        entity.position.x = 0;
        // entity.position.x = width + entity.position.x;
        // entity.prevPosition.x = entity.position.x;
      } else if (entity.position.x > width) {
        entity.position.x = width;
        // entity.position.x = entity.position.x - MAX_X;
        // entity.prevPosition.x = entity.position.x;
      }
      if (entity.position.y < 0) {
        entity.position.y = 0;
        // entity.position.y = (MAX_Y + entity.position.y) % MAX_Y;
        // entity.prevPosition.y = entity.position.y;
      }
      else if (entity.position.y > height) {
        entity.position.y = height;
        // entity.position.y = entity.position.y - MAX_Y;
        // entity.prevPosition.y = entity.position.y;
      }
    }
  }

}
