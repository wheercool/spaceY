import { GameState, Player } from '../types/GameState';

export class Renderer {
  private ctx: CanvasRenderingContext2D;
  private readonly width: number;
  private readonly height: number;
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

  render(gameState: GameState) {
    this.clear()
    this.drawPlayer(gameState.player)
  }

  private clear() {
    this.ctx.fillStyle = this.CLEAR_COLOR
    this.ctx.clearRect(0, 0, this.width, this.height)
    this.ctx.beginPath()
  }

  private drawPlayer(player: Player) {
    const playerPosition = player.position;

    this.ctx.save();
    this.ctx.fillStyle = '#ff0000';
    this.ctx.arc(playerPosition.x, playerPosition.y, 100, 0, 2 * Math.PI);
    this.ctx.stroke();
    this.ctx.fill();
    this.ctx.restore();
  }
}
