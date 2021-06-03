import { GameState } from '@shared/types/GameState';
import { Controller } from './Controller';
import { Renderer } from './Renderer';
import { Action } from '@shared/types/Action';
import { Transport } from './Transport';
import { Logic } from '@shared/Logic';


export class Game {
  private clientPredictions = false;
  private reconciliation = false;
  private frame = 0;
  private pendingActions: Action[] = [];
  private logic: Logic;

  constructor(
    private controller: Controller,
    private transport: Transport,
    private renderer: Renderer) {
    this.logic = new Logic(this.state);
  }

  state: GameState = {
    player: {
      speed: 2,
      position: {
        x: 400,
        y: 400,
      }
    }
  };

  startGame() {
    this.connect();
    this.startLoop();
  }

  private update() {
    this.processServerActions();
    this.processActions();
    this.renderer.render(this.state);
  }

  private startLoop() {
    this.update();
    requestAnimationFrame(() => this.startLoop());
  }

  private processActions() {
    let action: Action | undefined = undefined;
    if (this.controller.upPressed) {
      action = {
        type: 'GO_UP'
      };
    }
    if (this.controller.downPressed) {
      action = {
        type: 'GO_DOWN'
      }
    }
    if (this.controller.leftPressed) {
      action = {
        type: 'GO_LEFT'
      }
    }
    if (this.controller.rightPressed) {
      action = {
        type: 'GO_LEFT'
      }
    }

    if (action) {
      this.sendAction(action);
      if (this.clientPredictions) {
        this.logic.handleMessage(action);
      }
    }
  }

  private connect() {
    this.transport.connect();
  }

  private sendAction(action: Action) {
    const actionToSend = { ...action, frame: this.frame++ };
    this.pendingActions.push(actionToSend);
    this.transport.send(actionToSend);
  }

  private processServerActions() {

  }
}
