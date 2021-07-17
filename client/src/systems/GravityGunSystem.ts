import { System } from './System';
import { EntityRegistry } from '../entities/EntityRegistry';
import { EntityBuilder } from '../entities/EntityBuilder';
import { GravityGunTrigger } from '../components/GravityGunComponent';
import { createGravityBehaviour, GravityTagName } from '../components/GravityBehaviourComponent';
import { makeEntityId } from '../types';
import { createEffect, EffectName } from '../components/EffectsComponent';
import { soundManager } from '../services/SoundManager';

export class GravityGunSystem implements System {
  init(registry: EntityRegistry): void {
  }

  update(registry: EntityRegistry): void {
    const entities = registry.findEntitiesByComponents(['gravityGun', 'position']);

    for (const entity of entities) {
      const gun = entity.gravityGun;
      if (gun.trigger === GravityGunTrigger.Off) {
        registry.removeEntity(makeEntityId(1111));
        soundManager.stop('gravity');
        gun.active = false;
        continue;
      }
      gun.active = true;
      const playerId = registry.findSingle(['player']).id;

      if (!registry.existEntityWithId(makeEntityId(1111))) {
        soundManager.play('gravity', {loop: true});
        const gravityGunEnergy = new EntityBuilder(1111)
          .applyComponents({
            child: {
              parentId: playerId,
              relativePosition: {
                x: 0,
                y: 0
              }
            },
            effects: [createEffect(gun.trigger === GravityGunTrigger.Pull
              ? EffectName.GravityWavePull
              : EffectName.GravityWavePush,
              {x: 450, y: 450}
            )],
            mass: gun.trigger === GravityGunTrigger.Pull ? gun.power : -gun.power,
            gravityBehaviour: createGravityBehaviour(GravityTagName.EnergyGun),
          })
          .build()
        registry.addEntity(gravityGunEnergy);
      }

    }
  }
}
