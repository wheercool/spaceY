import { WS } from './ws';
import { Action } from '../../shared/types/Action';

export class Game {
  private FREQUENCY = 10;
  private clientActions = new Map<WS, Action[]>();

  startGame() {
    setInterval(() => this.update(), 1000 / this.FREQUENCY)
  }

  addPlayer(ws: WS) {
    this.clientActions.set(ws, []);
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
  }

  private handleClientMessages() {

  }

  private updateLogic() {

  }

  private notifyClients() {

  }
}
