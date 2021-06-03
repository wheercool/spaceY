import { GameState } from './types/GameState';
import { Action } from './types/Action';

export class Logic {
  constructor(private state: GameState) {
  }

  setState(gameState: GameState) {
    this.state = gameState;
  }

  playerGoUp() {
    this.state.player.position.y -= this.state.player.speed;
  }

  playerGoDown() {
    this.state.player.position.y += this.state.player.speed;
  }

  playerGoLeft() {
    this.state.player.position.x -= this.state.player.speed;
  }

  playerGoRight() {
    this.state.player.position.x += this.state.player.speed;
  }

  handleMessage(action: Action) {
    switch (action.type) {
      case 'GO_UP':
        this.playerGoUp();
        break;
      case 'GO_DOWN':
        this.playerGoDown();
        break;
      case 'GO_LEFT':
        this.playerGoLeft();
        break;
      case 'GO_RIGHT':
        this.playerGoRight();
        break;
    }
  }
}
