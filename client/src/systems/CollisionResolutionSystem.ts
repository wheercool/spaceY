import { System } from './System';
import { EntityRegistry } from '../entities/EntityRegistry';
import { EntityBuilder } from '../entities/EntityBuilder';
import { JumpComponent } from '../components/JumpComponent';
import { QuestStatus } from '../components/QuestComponent';

export class CollisionResolutionSystem implements System {
  init(registry: EntityRegistry): void {
  }

  update(registry: EntityRegistry): void {
    const entities = registry.findEntitiesByComponents(['collision']);

    for (const { collision, id: collisionId } of entities) {
      try {
        const first = EntityBuilder.fromEntity(registry.findById(collision.entity1));
        const second = EntityBuilder.fromEntity(registry.findById(collision.entity2));
        const collided = [first, second];
        let player: EntityBuilder | undefined,
            asteroid: EntityBuilder | undefined,
            crystal: EntityBuilder | undefined;
        for (let entity of collided) {
          if (entity.getOrDefault('player', false)) {
            player = entity;
          }
          if (entity.getOrDefault('model', '') === 'crystal') {
            crystal = entity;
          }
          if (entity.getOrDefault('asteroid', false)) {
            asteroid = entity;
          }
        }

        if (asteroid && player || asteroid && crystal) {
          registry.findEntitiesByComponents(['quest'])
            .forEach(questEntity => questEntity.quest.status = QuestStatus.Failed)
        } else {
          if (player) {
            player.applyComponent('jump', JumpComponent.Up);
          }
        }
        //TODO: Sometimes causes visual glitches
        // if (!player) {
        //   first.applyComponent('jump', JumpComponent.Down);
        // }
      } catch (e) {
        console.error(e);
      }
    }
  }
}
