import { WS } from './ws';
import { Action, GameFrame } from '@shared/types/Action';
import { GameState } from '@shared/types/GameState';
import { Logic } from '@shared/Logic';

export class ServerGame {
  private FREQUENCY = 1;
  private clientActions = new Map<WS, Action[]>();
  private state: GameState = {
    player: {
      speed: 4,
      position: {
        x: 400,
        y: 400,
      }
    }
  };
  private globalFrame = 0;
  private logic: Logic;

  constructor() {
    this.logic = new Logic();
  }

  startGame() {
    setInterval(() => this.update(), 1000 / this.FREQUENCY)
  }

  addPlayer(ws: WS) {
    this.clientActions.set(ws, []);
    const action: GameFrame = {
      type: 'frame',
      state: this.state,
      globalFrame: this.globalFrame,
      frame: -1
    };

    this.send(ws, action);
    ws.on('message', (message: string) => {
      const action: Action = JSON.parse(message);
      console.log(action);
      this.clientActions.get(ws).push(action);
    });

    ws.on('error', (e) => ws.send(e));
  }

  private update() {
    this.handleClientMessages();
    this.updateLogic();
    this.notifyClients();
    this.globalFrame++;
  }

  private handleClientMessages() {

  }

  private updateLogic() {
    this.clientActions.forEach((actions, ws) => {
      actions.forEach(action => this.logic.handleMessage(this.state, action));
    })
  }

  private notifyClients() {
    for (const [client, actions] of Array.from(this.clientActions.entries())) {
      const frame = Math.max(...actions.map(action => action.frame), -1);
      this.send(client, ({ type: 'frame', state: this.state, globalFrame: this.globalFrame, frame: frame }));
      this.clientActions.get(client).splice(0, actions.length);
    }
  }

  private send(ws: WS, action: GameFrame) {
    setTimeout(() => {
      ws.send(JSON.stringify(action));
    }, 240)
  }
}
