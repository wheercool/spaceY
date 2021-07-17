import { System } from './System';
import { EntityRegistry } from '../entities/EntityRegistry';
import { EntityBuilder } from '../entities/EntityBuilder';
import { add, mulByScalar, rotate, sub } from '@shared/types/Point2D';
import { Entity } from '../entities/Entity';
import { ComponentsRegistry } from '../components/Components';
import { startTimer } from '../components/TimerComponent';
import { makeEntityId, makeSeconds } from '../types';
import { createGravityBehaviour, GravityTagName } from '../components/GravityBehaviourComponent';

export class TurretSystem implements System {
  init(registry: EntityRegistry): void {
  }

  update(registry: EntityRegistry): void {
    const entities = registry.findEntitiesByComponents(['turret', 'position']);
    for (const entity of entities) {
      if (!entity.turret.triggered) {
        continue;
      }
      const cooldowns = registry.findEntitiesByComponents(['timer'])
        .filter(timerEntity => timerEntity.timer.target === entity.id && timerEntity.timer.name === 'cooldown')

      if (!cooldowns.length) {
        this.fire(registry, entity);
        const cooldownEntity = this.createCooldown(entity);
        registry.addEntity(cooldownEntity);
      }
    }
  }

  private fire(registry: EntityRegistry, entity: Entity & Pick<ComponentsRegistry, 'turret' | 'position'>) {
    const entityBuilder = EntityBuilder.fromEntity(entity);
    const angle = entity.turret.direction + entityBuilder.getOrDefault('rotation', 0);

    const pullingForce = rotate({x: 0, y: 40}, angle);
    const laserPosition = add(entity.position, rotate(entity.turret.position, angle));
    const laser = new EntityBuilder()
      .applyComponents({
        model: 'laser',
        rotation: angle,
        prevPosition: sub(laserPosition, pullingForce),
        position: laserPosition,
        maxSpeed: 300,
        bullet: true,
        boundaries: [
          {
            position: {
              x: 0,
              y: 3
            },
            radius: 3,
          },
          {
            position: {
              x: 0,
              y: 9
            },
            radius: 3,
          },
          {
            position: {
              x: 0,
              y: -3
            },
            radius: 3,
          },
          {
            position: {
              x: 0,
              y: -9
            },
            radius: 3,
          },
        ],
        timer: startTimer(makeEntityId(-1), makeSeconds(3), { name: 'lifeTime' }),
      })
      .build();
    registry.addEntity(laser);
  }

  private createCooldown(turret: Entity & Pick<ComponentsRegistry, 'turret'>) {
    return new EntityBuilder()
      .applyComponents({
        timer: startTimer(turret.id, turret.turret.cooldown, {
          name: 'cooldown',
        })
      })
      .build();
  }
}
