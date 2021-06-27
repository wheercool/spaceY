import { action, makeObservable } from 'mobx';
import { EntityRegistry } from '../entities/EntityRegistry';
import { EntityBuilder } from '../entities/EntityBuilder';
import { createGravityBehaviour, GravityTagName } from '../components/GravityBehaviourComponent';
import { Point2D } from '@shared/types/Point2D';
import { Entity } from '../entities/Entity';
import { EquipmentName, Fact, FactId, makeSeconds, SpaceshipName } from '../types';
import { createGravityGun, GravityGunComponent } from '../components/GravityGunComponent';
import { RouterStore } from './RouterStore';
import { Spaceship } from './Spaceship';
import { ComponentsRegistry } from '../components/Components';
import { Weapon } from './Weapon';
import { TurretComponent } from '../components/TurretComponent';


interface SpaceshipProvider {
  spaceshipInUse: Spaceship;
}

export class SpaceStore {
  private registry: EntityRegistry = new EntityRegistry();

  constructor(
    private routerStore: RouterStore,
    private spaceshipProvider: SpaceshipProvider
  ) {
    makeObservable(this);

    // const params = new URLSearchParams(window.location.search);
    // switch (params.get('spaceship')?.toLowerCase()) {
    //   case 'valkiria':
    //     this.player = createValkiria();
    //     break;
    //   case 'storm':
    //     this.player = createStorm();
    //     break;
    //   default:
    //     this.player = createRabbit();
    //     break;
    // }
  }

  @action.bound getEntityRegistry(): EntityRegistry {
    this.registry = new EntityRegistry();
    this.registry.addEntity(this.createPlayer());

    const planet = new EntityBuilder()
      .applyComponents({
        position: { x: 300, y: 100 },
        model: 'planet',
        mass: 10000,
        static: true,
        boundaries: [{
          radius: 100,
          position: { x: 0, y: 0 }
        }],
        gravityBehaviour: createGravityBehaviour(GravityTagName.Big),

      })
      .build()


    const planet2 = new EntityBuilder()
      .applyComponents({
        position: { x: 450, y: 200 },
        model: 'planet',
        mass: 10000,
        static: true,
        boundaries: [{
          radius: 100,
          position: { x: 0, y: 0 }
        }],
        gravityBehaviour: createGravityBehaviour(GravityTagName.Big)

      })
      .build()

    const planet3 = new EntityBuilder()
      .applyComponents({
        position: { x: 300, y: 500 },
        model: 'planet',
        mass: 10000,
        static: true,
        boundaries: [{
          radius: 100,
          position: { x: 0, y: 0 }
        }],
        gravityBehaviour: createGravityBehaviour(GravityTagName.Big)
      })
      .build()

    const kepler = new EntityBuilder()
      .applyComponents({
        position: { x: 200, y: 100 },
        model: 'kepler',
        boundaries: [
          {
            position: { x: 0, y: 0 },
            radius: 33
          }
        ],
        mass: 10000,
        gravityBehaviour: createGravityBehaviour(GravityTagName.Big)
      })
      .build()

    const map = new EntityBuilder()
      .applyComponent('map', { width: 1000, height: 1000 })
      .build();

    this.registry.addEntity(map);
    this.registry.addEntity(planet);
    this.registry.addEntity(planet2);
    this.registry.addEntity(planet3);
    this.registry.addEntity(kepler);
    this.registry.addEntity(createAsteroid({ x: 0, y: 200 }));
    this.registry.addEntity(createAsteroid({ x: 10, y: 200 }));
    this.registry.addEntity(createAsteroid({ x: 20, y: 200 }));
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
    return spaceshipEntity
      .applyComponents(weapons)
      .applyComponents({
        mass,
      })
      .build();
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

function createAsteroid(position: Point2D) {
  return new EntityBuilder()
    .applyComponents({
      position,
      model: 'asteroid',
      mass: 100,
      maxSpeed: 10,
      asteroid: true,
      boundaries: [
        {
          position: { x: 0, y: 2 },
          radius: 19
        }
      ],
      mapDependent: true,
      gravityBehaviour: createGravityBehaviour(GravityTagName.Enemy)
    })
    .build();
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
          speed
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
          speed
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
        position: { x: 0, y: 0 },
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
          speed
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
