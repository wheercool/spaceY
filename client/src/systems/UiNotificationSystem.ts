import { System } from './System';
import { EntityRegistry } from '../entities/EntityRegistry';
import { MinimapStore } from '../stores/MinimapStore';
import { Point2D } from '@shared/types/Point2D';
import { SpaceshipPanelStore } from '../stores/SpaceshipPanelStore/SpaceshipPanelStore';
import { EntityBuilder } from '../entities/EntityBuilder';

export class UiNotificationSystem implements System {
  constructor(private miniMap: MinimapStore, private spaceshipPanel: SpaceshipPanelStore) {

  }

  init(registry: EntityRegistry): void {
  }

  update(registry: EntityRegistry): void {
    const playerEntity = registry.findSingle(['player', 'position', 'rotation']);
    const playerBuilder = EntityBuilder.fromEntity(playerEntity);


    // Minimap
    const worldEntity = registry.findSingle(['map']);
    const position: Point2D = {
      x: playerEntity.position.x / worldEntity.map.width,
      y: playerEntity.position.y / worldEntity.map.height
    }
    this.miniMap.updateMinimap(position, playerEntity.rotation)

    // Spaceship
    const spaceship = playerBuilder.getOrDefault('spaceship', false);
    if (spaceship) {
      this.spaceshipPanel.updateSpaceship(spaceship.name);
    } else {
      this.spaceshipPanel.updateSpaceship('');
    }

    // Turret cooldown
    const turret = playerBuilder.getOrDefault('turret', false);
    if (turret) {
      this.spaceshipPanel.hasTurret(true);
      const turretTimer = registry.findEntitiesByComponents(['timer'])
        .filter(entity => entity.timer.target === playerEntity.id);
      if (turretTimer.length) {
        const timer = turretTimer[0].timer;
        const percent = Math.floor((1 - timer.elapsed / timer.duration) * 100);
        this.spaceshipPanel.updateTurretCooldown(percent);
      } else {
        this.spaceshipPanel.updateTurretCooldown(0);
      }
    } else {
     this.spaceshipPanel.hasTurret(false);
    }

    //Gravity gun activity
    const gravityGun = playerBuilder.getOrDefault('gravityGun', false);
    if (gravityGun) {
     this.spaceshipPanel.hasGravityGun(true, gravityGun.active);
    } else {
      this.spaceshipPanel.hasGravityGun(false);
    }
  }
}
