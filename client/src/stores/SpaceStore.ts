import { action, makeObservable } from 'mobx';
import { EntityRegistry } from '../entities/EntityRegistry';
import { EntityBuilder } from '../entities/EntityBuilder';
import { createGravityBehaviour, GravityTagName } from '../components/GravityBehaviourComponent';
import { Point2D } from '@shared/types/Point2D';
import { Entity } from '../entities/Entity';
import { makeSeconds, SpaceshipName } from '../types';
import { createGravityGun } from '../components/GravityGunComponent';
import { RouterStore } from './RouterStore';

export class SpaceStore {
  private registry: EntityRegistry = new EntityRegistry();
  private player: Entity;

  constructor(private routerStore: RouterStore) {
    makeObservable(this);

    const params = new URLSearchParams(window.location.search);
    switch (params.get('spaceship')?.toLowerCase()) {
      case 'valkiria':
        this.player = createValkiria();
        break;
      case 'storm':
        this.player = createStorm();
        break;
      default:
        this.player = createRabbit();
        break;
    }
  }

  @action.bound getEntityRegistry(): EntityRegistry {
    this.registry = new EntityRegistry();

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
    this.registry.addEntity(this.player)
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

function createStorm(): Entity {
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
        turret: {
          direction: 0,
          cooldown: makeSeconds(0.1),
          position: {
            x: 0,
            y: 60
          },
          triggered: false
        },
        gravityBehaviour: createGravityBehaviour(GravityTagName.Small),
        mapDependent: true,
        spaceship: {
          name: SpaceshipName.Storm
        }
      },
    )
    .build()
}

function createValkiria(): Entity {
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
        turret: {
          direction: 0,
          cooldown: makeSeconds(0.5),
          position: {
            x: 0,
            y: 60
          },
          triggered: false
        },
        gravityBehaviour: createGravityBehaviour(GravityTagName.Small),
        mapDependent: true,
        gravityGun: createGravityGun({
          consumption: 0.1,
          power: 100000,
        }),
        spaceship: {
          name: SpaceshipName.Valkiria
        }
      },
    )
    .build()
}

function createRabbit(): Entity {
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
          // {
          //   radius: 40,
          //   position: { x: 18, y: -14 }
          // },
          // {
          //   radius: 40,
          //   position: { x: -18, y: -14 }
          // },
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
          name: SpaceshipName.Rabbit
        }
      },
    )
    .build()
}
