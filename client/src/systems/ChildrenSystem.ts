import { System } from './System';
import { EntityRegistry } from '../entities/EntityRegistry';
import { EntityId } from '../types';
import { EntityBuilder } from '../entities/EntityBuilder';
import { add } from '@shared/types/Point2D';

export class ChildrenSystem implements System {
  init(registry: EntityRegistry): void {
  }

  update(registry: EntityRegistry): void {
    const childrenEntities = registry.findEntitiesByComponents(['child']);
    for (const childEntity of childrenEntities) {
      try {
        const parent = registry.findById(childEntity.child.parentId);
        const position = EntityBuilder.fromEntity(parent)
          .getOrDefault('position', false)
        if (!position) {
          continue;
        }
        EntityBuilder.fromEntity(childEntity)
          .applyComponents({
            position: add(position, childEntity.child.relativePosition)
          })
      } catch (e) {
        // remove child if no parent
        registry.removeEntity(childEntity.id);
      }
    }
  }
}