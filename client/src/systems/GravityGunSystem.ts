import { System } from './System';
import { EntityRegistry } from '../entities/EntityRegistry';
import { EntityBuilder } from '../entities/EntityBuilder';
import { GravityGunTrigger } from '../components/GravityGunComponent';
import { createGravityBehaviour, GravityTagName } from '../components/GravityBehaviourComponent';
import { startTimer } from '../components/TimerComponent';
import { makeEntityId, makeSeconds } from '../types';

export class GravityGunSystem implements System {
  init(registry: EntityRegistry): void {
  }

  update(registry: EntityRegistry): void {
    const entities = registry.findEntitiesByComponents(['gravityGun', 'position']);

    for (const entity of entities) {
      const gun = entity.gravityGun;
      if (gun.trigger === GravityGunTrigger.Off) {
        gun.active = false;
        continue;
      }
      gun.active = true;
      const gravityGunEnergy = new EntityBuilder()
        .applyComponents({
          mass: gun.trigger === GravityGunTrigger.Pull ? gun.power : -gun.power,
          gravityBehaviour: createGravityBehaviour(GravityTagName.EnergyGun),
          position: entity.position,
          timer: startTimer(makeEntityId(-1), makeSeconds(0), { name: 'lifeTime' })
        })
        .build()
      registry.addEntity(gravityGunEnergy);
    }
  }
}
