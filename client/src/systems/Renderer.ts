import { System } from './System';
import { EntityRegistry } from '../entities/EntityRegistry';
import { Point2D } from '@shared/types/GameState';
import { SpriteComponent } from '../components/Components';
import { assertNotReachable } from '../utils';

export class Renderer implements System {
  private width: number;
  private height: number;
  private ctx: CanvasRenderingContext2D;
  private CLEAR_COLOR = '#cccccc';

  constructor(private canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;
    if (!ctx) {
      throw new Error(`Client doesnt support canvas`);
    }
    this.ctx = ctx;
  }

  update(registry: EntityRegistry): void {
    const shapes = registry.findEntitiesByComponents(['sprite', 'position'])
    this.clear();

    shapes.forEach(shape => this.renderShape(shape));
  }

  private clear() {
    this.ctx.fillStyle = this.CLEAR_COLOR
    this.ctx.clearRect(0, 0, this.width, this.height)
    this.ctx.beginPath()
  }

  private renderShape(shape: { sprite: SpriteComponent, position: Point2D }) {
    const position = shape.position;
    const sprite = shape.sprite;
    this.ctx.save();
    this.ctx.fillStyle = 'red';
    switch (sprite.kind) {
      case 'circle':
        this.ctx.arc(position.x, position.y, sprite.radius, 0, Math.PI * 2)
        this.ctx.fill();
        break;
      case 'rectangle':
        this.ctx.fillRect(position.x, position.y, sprite.width, sprite.height);
        break;
      case 'image':
        this.ctx.drawImage(sprite.src, position.x, position.y, sprite.width, sprite.height)
        break;

      default:
        assertNotReachable(sprite);
    }
    this.ctx.restore();
  }
}
