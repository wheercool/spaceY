import { WS } from './ws';
import { Action, createGameFrame, FrameId, GameFrame } from '@shared/types/Action';
import { GameState } from '@shared/types/GameState';
import { Logic } from '@shared/Logic';
import { Clock } from '@shared/utils';
import { SIMULATION_UPDATE_RATE } from '@shared/constants';

export class ServerGame {
  private FREQUENCY = 10;
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
  private frame = 0;
  private logic: Logic;
  private lastCF: FrameId = -1;
  private clock = new Clock(SIMULATION_UPDATE_RATE);

  constructor() {
    this.logic = new Logic();
  }

  startGame() {
    this.clock.start();
    setInterval(() => this.update(), 1000 / this.FREQUENCY)
  }

  addPlayer(ws: WS) {
    this.clientActions.set(ws, []);
    this.send(ws, createGameFrame(this.lastCF, this.state));

    ws.on('message', (message: string) => {
      const action = JSON.parse(message);
      console.log(action);
      if (action === 'ping') {
        ws.send(JSON.stringify('pong'));
      } else {
        this.clientActions.get(ws).push(action);
      }
    });

    ws.on('error', (e) => ws.send(e));
  }

  private update() {
    this.handleInputs();
    this.notifyClients();
  }

  private handleInputs() {
    this.clientActions.forEach((actions, ws) => {
      actions.forEach(action => this.logic.handleMessage(this.state, action));
      this.clientActions.set(ws, []);
    })
  }

  private notifyClients() {
    const commandFrame = this.clock.currentFrame();
    console.log(commandFrame);
    if (this.lastCF < commandFrame) {
      this.lastCF = commandFrame;
      for (const client of Array.from(this.clientActions.keys())) {
        this.send(client, (createGameFrame(this.lastCF, this.state)));
      }
    }
  }

  private send(ws: WS, action: GameFrame) {
    ws.send(JSON.stringify(action));
  }
}
