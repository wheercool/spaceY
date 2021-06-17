import { Compositor } from './Compositor';
import { EntityRegistry } from '../entities/EntityRegistry';
import { System } from './System';
import { EntityBuilder } from '../entities/EntityBuilder';
import { Input } from './Input';
import { Player } from './Player';
import { Gravity } from './Gravity';
import { Movement } from './Movement';
import { Clock } from './Clock';
import { Acceleration } from './Acceleration';


export class Game implements System {
  private compositor!: Compositor;
  private registry: EntityRegistry = new EntityRegistry();
  private rafHandle: number = -1;

  constructor(
    private readonly renderer: System
  ) {
    this.compositor = new Compositor([
      new Clock(),
      new Input(),
      new Player(),
      new Gravity(),
      new Acceleration(),
      new Movement(),
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
        model: 'spaceships',
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
