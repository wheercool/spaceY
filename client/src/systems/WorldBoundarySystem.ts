import { System } from './System';
import { EntityRegistry } from '../entities/EntityRegistry';

const MAX_WIDTH = 4000;
const MAX_HEIGHT = 4000;

export class WorldBoundarySystem implements System {
  init(registry: EntityRegistry): void {
  }

  update(registry: EntityRegistry): void {
    const entities = registry.findEntitiesByComponents(['position', 'prevPosition']);
    for (const entity of entities) {
      if (entity.position.x < 0) {
        entity.position.x = MAX_WIDTH + entity.position.x;
        entity.prevPosition.x = entity.position.x;
      } else if (entity.position.x > MAX_WIDTH) {
        entity.position.x = entity.position.x - MAX_WIDTH;
        entity.prevPosition.x = entity.position.x;
      }
      if (entity.position.y < 0) {
        entity.position.y = (MAX_HEIGHT + entity.position.y) % MAX_HEIGHT;
        entity.prevPosition.y = entity.position.y;
      }
      else if (entity.position.y > MAX_HEIGHT) {
        entity.position.y = entity.position.y - MAX_HEIGHT;
        entity.prevPosition.y = entity.position.y;
      }
    }
  }

}
