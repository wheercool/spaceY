import { action, makeObservable } from 'mobx';
import { EntityRegistry } from '../entities/EntityRegistry';
import { EntityBuilder } from '../entities/EntityBuilder';
import { Entity } from '../entities/Entity';
import { EquipmentName, Fact, makeSeconds, SpaceshipName } from '../types';
import { createGravityGun, GravityGunComponent } from '../components/GravityGunComponent';
import { RouterStore } from './RouterStore';
import { Spaceship } from './Spaceship';
import { ComponentsRegistry } from '../components/Components';
import { Weapon } from './Weapon';
import { TurretComponent } from '../components/TurretComponent';
import { QuestStore } from './QuestStore';
import { createEmptyRabbit, createEmptyStorm, createEmptyValkiria } from '../entities/templates';

interface SpaceshipProvider {
  spaceshipInUse: Spaceship;
}

export class SpaceStore {
  private registry: EntityRegistry = new EntityRegistry();

  constructor(
    private routerStore: RouterStore,
    private spaceshipProvider: SpaceshipProvider,
    private questStore: QuestStore
  ) {
    makeObservable(this);
  }

  @action.bound getEntityRegistry(): EntityRegistry {
    this.registry = new EntityRegistry();
    const player = this.createPlayer();
    this.registry.addEntity(player);

    const mapEntities = this.questStore.getCurrentQuestMap(player.id);
    mapEntities.forEach(mapEntity => this.registry.addEntity(mapEntity));

    return this.registry;
  }

  @action.bound finishQuest() {
    this.routerStore.goToTavern();
  }

  @action.bound rejectQuest() {
    this.routerStore.gotoStation();
  }

  private createPlayer(): Entity {
    const spaceship = this.spaceshipProvider.spaceshipInUse;
    let spaceshipEntity: EntityBuilder;
    const speed = parseFloatFact(spaceship.info, 'speed', 1);
    switch (spaceship.name) {
      case SpaceshipName.Rabbit:
        spaceshipEntity = createEmptyRabbit(speed);
        break;
      case SpaceshipName.Storm:
        spaceshipEntity = createEmptyStorm(speed);
        break;
      case SpaceshipName.Valkiria:
        spaceshipEntity = createEmptyValkiria(speed);
        break;
    }
    const weapons = this.createWeapons();
    const mass = parseFloatFact(spaceship.info, 'weight', 1);
    const player = spaceshipEntity
      .applyComponents(weapons)
      .applyComponents({
        position: {
          x: 300,
          y: 300
        },
        mass,
        onMinimap: {
          shape: {
            type: 'player'
          }
        }
      })
      .build();
    return player;
  }

  private createWeapons(): Partial<ComponentsRegistry> {
    let result: Partial<ComponentsRegistry> = {};
    const spaceship = this.spaceshipProvider.spaceshipInUse;
    spaceship.weapons.forEach(weapon => {
      switch (weapon.name) {
        case EquipmentName.Rocket:
          // Object.assign(result, this.createRocket());
          break;
        case EquipmentName.Turret:
          Object.assign(result, SpaceStore.createTurret(weapon, spaceship.name))
          break;
        case EquipmentName.EnergyShield:
          break;
        case EquipmentName.GravityGun:
          Object.assign(result, SpaceStore.createGravityGun(weapon));
          break;
      }
    })
    return result;
  }

  private static createTurret(weapon: Weapon, spaceshipName: SpaceshipName): { turret: TurretComponent } {
    const cooldown = parseFloatFact(weapon.facts, 'cooldown', 1);
    const power = parseFloatFact(weapon.facts, 'power', 100000);
    return {
      turret: {
        direction: 0,
        power,
        cooldown: makeSeconds(cooldown),
        position: {
          x: 0,
          y: 60
        },
        triggered: false
      }
    }
  }

  static createGravityGun(weapon: Weapon): { gravityGun: GravityGunComponent } {
    const consumption = parseFloatFact(weapon.facts, 'consumption', 0.1);
    const power = parseFloatFact(weapon.facts, 'power', 100000);
    return {
      gravityGun: createGravityGun({
        consumption,
        power,
      })
    }
  }
}


function parseFloatFact(facts: Fact[], name: Fact['name'], defaultValue: number): number {
  const fact = facts.find(fact => fact.name === name);
  if (!fact) {
    return defaultValue;
  }
  return fact.value;
}
