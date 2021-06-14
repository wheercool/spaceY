import { Renderer } from './Renderer';
import { Compositor } from './Compositor';
import { EntityRegistry } from '../entities/EntityRegistry';
import { System } from './System';
import { EntityBuilder } from '../entities/EntityBuilder';
import spaceShipImage from '../images/spaceship.png';
import { Input } from './Input';
import { Player } from './Player';


export class Game implements System {
  private compositor!: Compositor;
  private registry: EntityRegistry = new EntityRegistry();
  private rafHandle: number = -1;

  constructor(
    private readonly renderer: Renderer
  ) {
    this.compositor = new Compositor([
      new Input(),
      new Player(),
      this.renderer,
    ]);
  }

  startGame() {
    const circle = new EntityBuilder()
      .applyComponents({ position: { x: 300, y: 100 }, sprite: { kind: 'circle', radius: 50 } })
      .build();

    const rectangle = new EntityBuilder()
      .applyComponents({ position: { x: 150, y: 200 }, sprite: { kind: 'rectangle', width: 100, height: 50 } })
      .build();

    const htmlImage = new Image();
    htmlImage.src = spaceShipImage;
    const spaceship = new EntityBuilder()
      .applyComponents({
        player: true,
        position: { x: 300, y: 150 },
        sprite: {
          kind: 'image',
          src: htmlImage,
          height: 200,
          width: 120
        }
      })
      .build()

    this.registry.addEntity(circle)
    this.registry.addEntity(rectangle)
    this.registry.addEntity(spaceship)

    this.update();
  }

  update() {
    this.compositor.update(this.registry);
    this.rafHandle = requestAnimationFrame(() => this.update());
  }
}
