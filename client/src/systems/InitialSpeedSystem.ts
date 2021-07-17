import { System } from './System';
import { EntityRegistry } from '../entities/EntityRegistry';
import { EntityBuilder } from '../entities/EntityBuilder';
import { sub } from '@shared/types/Point2D';

export class InitialSpeedSystem implements System {
  init(registry: EntityRegistry): void {
  }

  update(registry: EntityRegistry): void {
    registry.findEntitiesByComponents(['position', 'initialSpeed']).forEach(entity => {
      const entityBuilder = EntityBuilder.fromEntity(entity)
      if (entityBuilder.getOrDefault('prevPosition', false)) {
        return;
      }
      const prevPosition = sub(entity.position, entity.initialSpeed);
      entityBuilder.applyComponent('prevPosition', prevPosition)
    })
  }
}