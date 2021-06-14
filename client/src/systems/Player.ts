import { System } from './System';
import { EntityRegistry } from '../entities/EntityRegistry';
import { InputComponent } from '../components/Components';
import { Point2D } from '@shared/types/GameState';

const STEP = 2;

export class Player implements System {
  update(registry: EntityRegistry) {
    const players = registry.findEntitiesByComponents(['player', 'position']);
    const inputs = registry.findEntitiesByComponents(['input']);
    const player = players.find(entity => entity.player);
    if (!player || !inputs.length) {
      throw new Error('No player of input')
    }
    const input = inputs[0];
    this.handleInput(input.input, player);
  }

  private handleInput(input: InputComponent, player: { position: Point2D }) {
    const position = player.position;
    if (input.left) {
      position.x -= STEP;
    }
    if (input.right) {
      position.x += STEP;
    }
    if (input.top) {
      position.y -= STEP;
    }
    if (input.bottom) {
      position.y += STEP;
    }
  }
}
