import { System } from './System';
import { EntityRegistry } from '../entities/EntityRegistry';
import { Point2D } from '@shared/types/GameState';
import { InputComponent } from '../components/InputComponent';

const STEP = Math.PI / 100;
const PULLING_FORCE_VALUE = 3;
const BACK_FORCE_VALUE = PULLING_FORCE_VALUE;

export class Player implements System {
  init(registry: EntityRegistry) {

  }

  update(registry: EntityRegistry) {
    const players = registry.findEntitiesByComponents(['player', 'rotation', 'pullingForce']);
    const inputEntity = registry.findSingle(['input']);
    const player = players.find(entity => entity.player);
    if (!player) {
      throw new Error('No player of input')
    }
    this.handleInput(inputEntity.input, player);
  }

  private handleInput(input: InputComponent, player: { rotation: number, pullingForce: Point2D }) {
    if (input.left) {
      player.rotation += STEP;
    }
    if (input.right) {
      player.rotation -= STEP;
    }
    if (input.top) {
      const angle = player.rotation + Math.PI / 2;
      player.pullingForce.x = Math.cos(angle) * PULLING_FORCE_VALUE;
      player.pullingForce.y = Math.sin(angle) * PULLING_FORCE_VALUE;
    }
    if (input.bottom) {
      const angle = player.rotation + Math.PI / 2 + Math.PI;
      player.pullingForce.x = Math.cos(angle) * BACK_FORCE_VALUE;
      player.pullingForce.y = Math.sin(angle) * BACK_FORCE_VALUE;
    }
    if (!input.top && !input.bottom) {
      player.pullingForce.x = 0;
      player.pullingForce.y = 0;
    }
  }
}
