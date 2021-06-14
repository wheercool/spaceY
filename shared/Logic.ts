import { GameState } from './types/GameState';
import { Action } from './types/Action';

export class Logic {
  constructor() {
  }

  playerGoUp(state: GameState) {
    state.player.position.y -= state.player.speed;
  }

  playerGoDown(state: GameState) {
    state.player.position.y += state.player.speed;
  }

  playerGoLeft(state: GameState) {
    state.player.position.x -= state.player.speed;
  }

  playerGoRight(state: GameState) {
    state.player.position.x += state.player.speed;
  }

  handleMessage(state: GameState, action: Action) {
    if (action.type === 'input') {
      if (action.top) {
        this.playerGoUp(state);
      }
      if (action.bottom) {
        this.playerGoDown(state);
      }
      if (action.left) {
        this.playerGoLeft(state);
      }
      if (action.right) {
        this.playerGoRight(state);
      }
    }
  }
}
