import { EntityBuilder } from './EntityBuilder';
import { createGravityBehaviour, GravityTagName } from '../components/GravityBehaviourComponent';
import { SpaceshipName } from '../types';
import { Point2D } from '@shared/types/Point2D';
import { createEffect, EffectName } from '../components/EffectsComponent';

export function createEmptyStorm(speed: number): EntityBuilder {
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

export function createEmptyValkiria(speed: number): EntityBuilder {
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

export function createEmptyRabbit(speed: number): EntityBuilder {
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

export function createPlanet(position: Point2D) {
  return new EntityBuilder()
    .applyComponents({
      position,
      model: 'planet',
      mass: 50000,
      static: true,
      effects: [
        createEffect(EffectName.GravityWavePull, { x: 400, y: 400 }, { z: 0 })
      ],
      boundaries: [{
        radius: 100,
        position: {
          x: 0,
          y: 0
        }
      }],
      z: {
        index: -80
      },
      gravityBehaviour: createGravityBehaviour(GravityTagName.Big),
    })
    .build()
}

export function createEarth(position: Point2D) {
  return new EntityBuilder()
    .applyComponents({
      position,
      model: 'earth',
      boundaries: [
        {
          position: { x: 0, y: 0 },
          radius: 110
        }
      ],
      mapDependent: true,
    })
    .build()
}

export function createAsteroid(position: Point2D) {
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