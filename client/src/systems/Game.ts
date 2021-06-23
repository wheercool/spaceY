import { CompositorSystem } from './CompositorSystem';
import { EntityRegistry } from '../entities/EntityRegistry';
import { System } from './System';
import { EntityBuilder } from '../entities/EntityBuilder';
import { InputSystem } from './InputSystem';
import { PlayerSystem } from './PlayerSystem';
import { GravitySystem } from './GravitySystem';
import { MovementSystem } from './MovementSystem';
import { ClockSystem } from './ClockSystem';
import { AccelerationSystem } from './AccelerationSystem';
import { CollisionDetectionSystem } from './CollisionDetectionSystem';
import { CollisionResolutionSystem } from './CollisionResolutionSystem';
import { WorldBoundarySystem } from './WorldBoundarySystem';


export class Game implements System {
  private compositor!: CompositorSystem;
  private registry: EntityRegistry = new EntityRegistry();
  private rafHandle: number = -1;

  constructor(
    private readonly renderer: System
  ) {
    this.compositor = new CompositorSystem([
      new WorldBoundarySystem(),
      new ClockSystem(),
      new InputSystem(),
      new PlayerSystem(),
      new GravitySystem(),
      new AccelerationSystem(),
      new MovementSystem(),
      new CollisionDetectionSystem(),
      new CollisionResolutionSystem(),
      this.renderer,
    ]);
  }

  init(registry: EntityRegistry) {
    this.registry = registry;
  }

  startGame() {
    this.initEntities();
    this.compositor.init(this.registry);
    this.update();
  }

  update() {
    this.compositor.update(this.registry);
    this.rafHandle = requestAnimationFrame(() => this.update());
  }

  private initEntities() {
    const game = new EntityBuilder(-1)
      .applyComponent('iteration', 0)
      .build()

    const spaceship = new EntityBuilder()
      .applyComponents({
        player: true,
        cameraAt: true,
        rotation: 0,
        position: { x: 0, y: 0 },
        pullingForce: { x: 0, y: 0 },
        model: 'starship',
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
        ]
      })
      .build()

    const planet = new EntityBuilder()
      .applyComponents({
        position: { x: 300, y: 100 },
        model: 'planet',
        mass: 10000,
        static: true,
        boundaries: [{
          radius: 100,
          position: { x: 0, y: 0 }
        }]
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
        }]
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
        }]
      })
      .build()

    const kepler = new EntityBuilder()
      .applyComponents({
        position: { x: 200, y: 100 },
        model: 'kepler',
        boundaries: [
          {
            position: {x: 0, y: 0},
            radius: 33
          }
        ],
        mass: 10000
      })
      .build()

    const asteroid = new EntityBuilder()
      .applyComponents({
        position: { x: 0, y: 100 },
        model: 'asteroid',
        mass: 100,
        asteroid: true,
        boundaries: [
          {
            position: {x: 0, y: 2},
            radius: 19
          }
        ]
      })
      .build()

    this.registry.addEntity(game);
    this.registry.addEntity(spaceship)
    this.registry.addEntity(planet);
    this.registry.addEntity(planet2);
    this.registry.addEntity(planet3);
    this.registry.addEntity(kepler);
    this.registry.addEntity(asteroid);

  }
}
