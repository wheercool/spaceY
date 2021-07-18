import { System } from './System';
import { EntityRegistry } from '../entities/EntityRegistry';
import { EntityBuilder } from '../entities/EntityBuilder';
import { QuestStatus } from '../components/QuestComponent';
import { startTimer } from '../components/TimerComponent';
import { makeEntityId, makeSeconds } from '../types';
import { Point2D } from '@shared/types/Point2D';
import { createEffect, EffectName } from '../components/EffectsComponent';
import { soundManager } from '../services/SoundManager';

const FIRE_DURATION = makeSeconds(1.5);
const EXPLOSION_SIZE = { x: 100, y: 100 };

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
        let explosion = false;
        let explosionPosition: Point2D = { x: 0, y: 0 };

        let player: EntityBuilder | undefined,
            asteroid: EntityBuilder | undefined,
            crystal: EntityBuilder | undefined,
            bullet: EntityBuilder | undefined;
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
          if (entity.getOrDefault('bullet', false)) {
            bullet = entity;
          }
        }

        if (asteroid && player || asteroid && crystal) {
          explosion = true;
          explosionPosition = asteroid.getOrDefault('position', explosionPosition);
          registry.removeEntity(asteroid.build().id);

          registry.findEntitiesByComponents(['quest'])
            .forEach(questEntity => questEntity.quest.status = QuestStatus.Failed)
        }
        if (asteroid && bullet
        ) {
          registry.removeEntity(asteroid.build().id);
          registry.removeEntity(bullet.build().id);
          explosion = true;
          explosionPosition = asteroid.getOrDefault('position', explosionPosition);
        }
        if (explosion) {
          soundManager.play('explosion', { independent: true })
          registry.addEntity(
            new EntityBuilder()
              .applyComponents({
                position: explosionPosition,
                effects: [
                  createEffect(EffectName.Explosion, EXPLOSION_SIZE)
                ],
                timer: startTimer(makeEntityId(-1), FIRE_DURATION)
              })
              .build()
          )
        }
      } catch
        (e) {
        console.error(e);
      }
    }
  }
}
