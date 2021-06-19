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


export class Game implements System {
  private compositor!: CompositorSystem;
  private registry: EntityRegistry = new EntityRegistry();
  private rafHandle: number = -1;

  constructor(
    private readonly renderer: System
  ) {
    this.compositor = new CompositorSystem([
      new ClockSystem(),
      new InputSystem(),
      new PlayerSystem(),
      new GravitySystem(),
      new AccelerationSystem(),
      new MovementSystem(),
      this.renderer,
    ]);
  }

  init(registry: EntityRegistry) {
    this.registry = registry;
  }

  startGame() {
    const spaceship = new EntityBuilder()
      .applyComponents({
        player: true,
        cameraAt: true,
        rotation: 0,
        position: { x: 0, y: 0 },
        pullingForce: { x: 0, y: 0 },
        model: 'starship',
        mass: 1
      })
      .build()

    const planet = new EntityBuilder()
      .applyComponents({
        position: { x: 300, y: 100 },
        model: 'planet',
        mass: 100000
      })
      .build()

    const kepler = new EntityBuilder()
      .applyComponents({
        position: { x: -100, y: 100 },
        model: 'kepler',
        mass: 10000
      })
      .build()

    const asteroid = new EntityBuilder()
      .applyComponents({
        position: { x: 200, y: -200 },
        model: 'asteroid',
        mass: 100
      })
      .build()

    this.registry.addEntity(spaceship)
    this.registry.addEntity(planet);
    this.registry.addEntity(kepler);
    this.registry.addEntity(asteroid);

    this.compositor.init(this.registry);
    this.update();
  }

  update() {
    this.compositor.update(this.registry);
    this.rafHandle = requestAnimationFrame(() => this.update());
  }
}