import { System } from './System';
import { EntityRegistry } from '../entities/EntityRegistry';
import { InputComponent } from '../components/InputComponent';
import { PullingForceComponent } from '../components/PullingForceComponent';
import { Entity } from '../entities/Entity';
import { EntityBuilder } from '../entities/EntityBuilder';
import { TurretComponent } from '../components/TurretComponent';
import { GravityGunTrigger } from '../components/GravityGunComponent';
import { addEffectIfNotExist, createEffect, Effect, EffectName, removeEffect } from '../components/EffectsComponent';
import { soundManager } from '../services/SoundManager';

const STEP = Math.PI / 50;
const FIRE_SIZE = 200;

/***
 * Handles inputs.
 * Changes player's rotation, pullingForce
 */
export class PlayerSystem implements System {
  init(registry: EntityRegistry) {

  }

  update(registry: EntityRegistry) {
    const players = registry.findEntitiesByComponents(['player', 'rotation', 'pullingForce']);
    const inputEntity = registry.findSingle(['input']);
    const player = players.find(entity => entity.player);
    if (!player) {
      throw new Error('No player of input')
    }
    this.handleMoving(inputEntity.input, player, registry);
    const turret = EntityBuilder.fromEntity(player).getOrDefault('turret', null);
    if (turret) {
      this.handleTurretFire(turret, inputEntity.input);
    }
    this.handleGravityGun(inputEntity.input, player, registry);
  }

  private handleMoving(input: InputComponent, player: Entity & { rotation: number, pullingForce: PullingForceComponent }, registry: EntityRegistry) {
    const spaceship = EntityBuilder.fromEntity(player)
      .getOrDefault('spaceship', { speed: 0, engineSize: { x: 0, y: 0 }, enginePosition: { x: 0, y: 0 } })

    const { speed, engineSize, enginePosition } = spaceship;
    if (input.left) {
      player.rotation += STEP;
    }
    if (input.right) {
      player.rotation -= STEP;
    }
    const playerBuilder = EntityBuilder.fromEntity(player);
    const effects: Effect[] = playerBuilder.getOrDefault('effects', []);
    playerBuilder.applyComponent('effects', effects);

    if (input.top) {
      soundManager.play('engine', {loop: true});
      const angle = player.rotation + Math.PI / 2;
      player.pullingForce.x = Math.cos(angle) * speed;
      player.pullingForce.y = Math.sin(angle) * speed;
      addEffectIfNotExist(effects, createEffect(EffectName.Fire, engineSize, { relativePosition: enginePosition }));
    }
    if (input.bottom) {
      soundManager.play('engine', {loop: true});
      const angle = player.rotation + Math.PI / 2 + Math.PI;
      player.pullingForce.x = Math.cos(angle) * speed;
      player.pullingForce.y = Math.sin(angle) * speed;
      addEffectIfNotExist(effects, createEffect(EffectName.Fire, {
          x: engineSize.x,
          y: 0.3 * engineSize.y
        },
        {
          relativePosition: {
            x: enginePosition.x,
            y: (1.0 - 0.3 ) * enginePosition.y
          }
        }));
    }
    if (!input.top && !input.bottom) {
      soundManager.stop('engine');
      player.pullingForce.x = 0;
      player.pullingForce.y = 0;
      removeEffect(effects, EffectName.Fire);
    }
  }

  private handleTurretFire(turret: TurretComponent, input: InputComponent) {
    if (input.e) {
      turret.triggered = true;
    } else {
      turret.triggered = false;
    }
  }

  private handleGravityGun(input: InputComponent, player: Entity, registry: EntityRegistry) {
    const builder = EntityBuilder.fromEntity(player);
    const gravityGun = builder.getOrDefault('gravityGun', false);
    if (!gravityGun) {
      return;
    }

    const FORCE = gravityGun.power;
    if (input.w) {
      gravityGun.trigger = GravityGunTrigger.Push;
    }
    if (input.q) {
      gravityGun.trigger = GravityGunTrigger.Pull;
    }
    if (!input.q && !input.w) {
      gravityGun.trigger = GravityGunTrigger.Off;
    }
    // move to system
    // const position = builder.getOrDefault('position', false);
    // if (position) {
    //   const gravityGun = new EntityBuilder()
    //     .applyComponents({
    //       mass: -FORCE,
    //       gravityBehaviour: createGravityBehaviour(GravityTagName.EnergyGun),
    //       position: position,
    //       timer: startTimer(makeEntityId(-1), makeSeconds(0), { name: 'lifeTime' })
    //     })
    //     .build()
    //   registry.addEntity(gravityGun);
    // }
  }
}
