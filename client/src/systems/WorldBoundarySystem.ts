import { System } from './System';
import { EntityRegistry } from '../entities/EntityRegistry';


export const MIN_X = 0;
export const MAX_X = 4000;
export const MIN_Y = 0;
export const MAX_Y = 4000;

export class WorldBoundarySystem implements System {
  init(registry: EntityRegistry): void {
  }

  update(registry: EntityRegistry): void {
    const entities = registry.findEntitiesByComponents(['position', 'prevPosition']);
    for (const entity of entities) {
      if (entity.position.x < MIN_X) {
        entity.position.x = MAX_X + entity.position.x;
        entity.prevPosition.x = entity.position.x;
      } else if (entity.position.x > MAX_X) {
        entity.position.x = entity.position.x - MAX_X;
        entity.prevPosition.x = entity.position.x;
      }
      if (entity.position.y < MIN_Y) {
        entity.position.y = (MAX_Y + entity.position.y) % MAX_Y;
        entity.prevPosition.y = entity.position.y;
      }
      else if (entity.position.y > MAX_Y) {
        entity.position.y = entity.position.y - MAX_Y;
        entity.prevPosition.y = entity.position.y;
      }
    }
  }

}
