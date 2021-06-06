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
    switch (action.type) {
      case 'GO_UP':
        this.playerGoUp(state);
        break;
      case 'GO_DOWN':
        this.playerGoDown(state);
        break;
      case 'GO_LEFT':
        this.playerGoLeft(state);
        break;
      case 'GO_RIGHT':
        this.playerGoRight(state);
        break;
    }
  }
}
