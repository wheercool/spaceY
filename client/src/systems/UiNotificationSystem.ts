import { System } from './System';
import { EntityRegistry } from '../entities/EntityRegistry';
import { MinimapStore } from '../stores/MinimapStore';
import { Point2D } from '@shared/types/Point2D';

export class UiNotificationSystem implements System {
  constructor(private miniMap: MinimapStore) {

  }

  init(registry: EntityRegistry): void {
  }

  update(registry: EntityRegistry): void {
    const entity = registry.findSingle(['player', 'position', 'rotation']);
    const worldEntity = registry.findSingle(['map']);
    const position: Point2D = {
      x: entity.position.x / worldEntity.map.width,
      y: entity.position.y / worldEntity.map.height
    }
    this.miniMap.updateMinimap(position, entity.rotation)
  }
}
