import { action, makeObservable } from 'mobx';
import { EntityRegistry } from '../entities/EntityRegistry';
import { EntityBuilder } from '../entities/EntityBuilder';
import { createGravityBehaviour, GravityTagName } from '../components/GravityBehaviourComponent';
import { Entity } from '../entities/Entity';
import { EquipmentName, Fact, makeSeconds, SpaceshipName } from '../types';
import { createGravityGun, GravityGunComponent } from '../components/GravityGunComponent';
import { RouterStore } from './RouterStore';
import { Spaceship } from './Spaceship';
import { ComponentsRegistry } from '../components/Components';
import { Weapon } from './Weapon';
import { TurretComponent } from '../components/TurretComponent';
import { QuestStore } from './QuestStore';

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

  private static createGravityGun(weapon: Weapon): { gravityGun: GravityGunComponent } {
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


function createEmptyStorm(speed: number): EntityBuilder {
  return new EntityBuilder()
    .applyComponents({
        player: true,
        cameraAt: true,
        rotation: 0,
        position: { x: 0, y: 0 },
        pullingForce: { x: 0, y: 0 },
        model: 'storm',
        mass: 1,
        boundaries: [
          {
            radius: 20,
            position: { x: 0, y: 20 }
          },
          {
            radius: 20,
            position: { x: 18, y: -14 }
          },
          {
            radius: 20,
            position: { x: -18, y: -14 }
          },
        ],
        gravityBehaviour: createGravityBehaviour(GravityTagName.Small),
        mapDependent: true,
        spaceship: {
          name: SpaceshipName.Storm,
          speed,
          engineSize: { x: 8, y: 40 },
          enginePosition: {
            x: 0,
            y: -60
          }
        }
      },
    )
}

function createEmptyValkiria(speed: number): EntityBuilder {
  return new EntityBuilder()
    .applyComponents({
        player: true,
        cameraAt: true,
        rotation: 0,
        position: { x: 0, y: 0 },
        pullingForce: { x: 0, y: 0 },
        model: 'valkiria',
        mass: 1,
        boundaries: [
          {
            radius: 20,
            position: { x: 0, y: 20 }
          },
          {
            radius: 30,
            position: { x: 18, y: -21 }
          },
          {
            radius: 30,
            position: { x: -18, y: -21 }
          },
        ],
        gravityBehaviour: createGravityBehaviour(GravityTagName.Small),
        mapDependent: true,
        // gravityGun: createGravityGun({
        //   consumption: 0.1,
        //   power: 100000,
        // }),
        spaceship: {
          name: SpaceshipName.Valkiria,
          speed,
          engineSize: { x: 20, y: 60 },
          enginePosition: {
            x: 0,
            y: -70
          }
        }
      },
    )
}

function createEmptyRabbit(speed: number): EntityBuilder {
  return new EntityBuilder()
    .applyComponents({
        player: true,
        cameraAt: true,
        rotation: 0,
        position: { x: 300, y: 300 },
        pullingForce: { x: 0, y: 0 },
        model: 'rabbit',
        mass: 1,
        boundaries: [
          {
            radius: 20,
            position: { x: 0, y: 20 }
          },
          {
            radius: 20,
            position: { x: 15, y: -22 }
          },
          {
            radius: 20,
            position: { x: -15, y: -22 }
          }
        ],
        gravityBehaviour: createGravityBehaviour(GravityTagName.Small),
        mapDependent: true,
        spaceship: {
          name: SpaceshipName.Rabbit,
          speed,
          engineSize: { x: 12, y: 60 },
          enginePosition: {
            x: 0,
            y: -69
          }
        },
        z: {
          index: 100
        }
      }
    )
}

function parseFloatFact(facts: Fact[], name: Fact['name'], defaultValue: number): number {
  const fact = facts.find(fact => fact.name === name);
  if (!fact) {
    return defaultValue;
  }
  return fact.value;
}
