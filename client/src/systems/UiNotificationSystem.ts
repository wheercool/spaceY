import { System } from './System';
import { EntityRegistry } from '../entities/EntityRegistry';
import { MinimapStore } from '../stores/MinimapStore';
import { Point2D } from '@shared/types/Point2D';
import { SpaceshipPanelStore } from '../stores/SpaceshipPanelStore/SpaceshipPanelStore';
import { EntityBuilder } from '../entities/EntityBuilder';
import { QuestStatus } from '../components/QuestComponent';
import { Entity } from '../entities/Entity';
import { ComponentsRegistry } from '../components/Components';
import { QuestManager } from '../stores/QuestStore';

export class UiNotificationSystem implements System {
  constructor(
    private miniMap: MinimapStore,
    private spaceshipPanel: SpaceshipPanelStore,
    private questManager: QuestManager
  ) {

  }

  init(registry: EntityRegistry): void {
  }

  update(registry: EntityRegistry): void {
    const playerEntity = registry.findSingle(['player', 'position', 'rotation']);
    const playerBuilder = EntityBuilder.fromEntity(playerEntity);


    // Minimap
    const worldEntity = registry.findSingle(['map']);
    const visibleOnMinimaps = registry.findEntitiesByComponents(['onMinimap', 'position']);
    const minimapEntities = visibleOnMinimaps.map(entity => {
      const position: Point2D = {
        x: entity.position.x / worldEntity.map.width,
        y: entity.position.y / worldEntity.map.height
      }
      const rotation = EntityBuilder.fromEntity(entity).getOrDefault('rotation', 0);
      return {
        position,
        rotation: rotation,
        shape: entity.onMinimap.shape
      }
    });
    this.miniMap.updateMinimap(minimapEntities);


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

    // Check quest
    const questEntities = registry.findEntitiesByComponents(['quest']);
    const goals = questEntities.map(quest => quest.quest.goal);
    this.questManager.updateGoals(goals);
    if (questEntities.length > 0 && questEntities.every(questEntity => questEntity.quest.status === QuestStatus.Completed)) {
      UiNotificationSystem.removeQuest(questEntities, registry);
      this.questManager.questCompleted();
    }
    if (questEntities.length > 0 && questEntities.some(questEntity => questEntity.quest.status === QuestStatus.Failed)) {
      UiNotificationSystem.removeQuest(questEntities, registry);
      this.questManager.questFailed();
    }
  }

  private static removeQuest(questEntities: (Entity & Pick<ComponentsRegistry, 'quest'>)[], registry: EntityRegistry) {
    questEntities.forEach(questEntity => registry.removeEntity(questEntity.id));
  }
}
