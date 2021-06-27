import { System } from './System';
import { EntityRegistry } from '../entities/EntityRegistry';
import { InputComponent } from '../components/InputComponent';
import { PullingForceComponent } from '../components/PullingForceComponent';
import { Entity } from '../entities/Entity';
import { EntityBuilder } from '../entities/EntityBuilder';
import { TurretComponent } from '../components/TurretComponent';
import { startTimer } from '../components/TimerComponent';
import { makeEntityId, makeSeconds } from '../types';
import { createGravityBehaviour, GravityTagName } from '../components/GravityBehaviourComponent';
import { GravityGunTrigger } from '../components/GravityGunComponent';

const STEP = Math.PI / 100;
const PULLING_FORCE_VALUE = 3;
const BACK_FORCE_VALUE = PULLING_FORCE_VALUE;

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
    this.handleInput(inputEntity.input, player);
    const turret = EntityBuilder.fromEntity(player).getOrDefault('turret', null);
    if (turret) {
      this.handleFire(turret, inputEntity.input);
    }
    this.handleGravityGun(inputEntity.input, player, registry);
  }

  private handleInput(input: InputComponent, player: { rotation: number, pullingForce: PullingForceComponent }) {
    if (input.left) {
      player.rotation += STEP;
    }
    if (input.right) {
      player.rotation -= STEP;
    }
    if (input.top) {
      const angle = player.rotation + Math.PI / 2;
      player.pullingForce.x = Math.cos(angle) * PULLING_FORCE_VALUE;
      player.pullingForce.y = Math.sin(angle) * PULLING_FORCE_VALUE;
    }
    if (input.bottom) {
      const angle = player.rotation + Math.PI / 2 + Math.PI;
      player.pullingForce.x = Math.cos(angle) * BACK_FORCE_VALUE;
      player.pullingForce.y = Math.sin(angle) * BACK_FORCE_VALUE;
    }
    if (!input.top && !input.bottom) {
      player.pullingForce.x = 0;
      player.pullingForce.y = 0;
    }
  }

  private handleFire(turret: TurretComponent, input: InputComponent) {
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
    if (input.q) {
      gravityGun.trigger = GravityGunTrigger.Push;
    }
    if (input.w) {
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
