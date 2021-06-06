import { Controller } from './Controller';
import { Renderer } from './Renderer';
import { Transport } from './Transport';
import { Action, GameFrame, gameFrameTypeGuard } from '@shared/types/Action';
import { GameState } from '@shared/types/GameState';
import { Logic } from '@shared/Logic';
import { Clock } from '@shared/utils';
import { SIMULATION_UPDATE_RATE } from '@shared/constants';

export class ClientGame {
  private loading = true;
  private clientPredictionEnabled = true;
  private reconciliationEnabled = true;
  private frame = 0;
  private pendingActions: Action[] = [];
  private state!: GameState;
  private logic: Logic = new Logic();
  private serverActions: Action[] = [];
  private clock!: Clock;
  private currentCF = -1;

  constructor(
    private controller: Controller,
    private transport: Transport,
    private renderer: Renderer) {
    const params = new URLSearchParams(window.location.search);
    this.clientPredictionEnabled = params.get('prediction') !== '0';
    this.reconciliationEnabled = params.get('reconciliation') !== '0';
  }

  startGame() {
    this.clock = new Clock(SIMULATION_UPDATE_RATE);
    this.clock.start();
    this.connect();
    this.startLoop();
  }

  private update() {
    this.processServerActions();
    const commandFrame = this.clock.currentFrame();
    if (this.currentCF < commandFrame) {
      this.currentCF = commandFrame;
      this.processActions();
    }
    if (this.loading) {
      return;
    }
    this.renderer.render(this.state);
    this.updateInfo();
    this.frame++;
  }

  private startLoop() {
    this.update();
    requestAnimationFrame(() => this.startLoop());
  }

  private processActions() {
    let actions: Action[] = [];
    if (this.controller.upPressed) {
      actions.push({
        type: 'GO_UP',
        frame: this.frame
      });
    }
    if (this.controller.downPressed) {
      actions.push({
        type: 'GO_DOWN',
        frame: this.frame
      });
    }
    if (this.controller.leftPressed) {
      actions.push({
        type: 'GO_LEFT',
        frame: this.frame
      })
    }
    if (this.controller.rightPressed) {
      actions.push({
        type: 'GO_RIGHT',
        frame: this.frame
      })
    }

    if (actions.length) {
      this.sendActions(actions);
      if (this.clientPredictionEnabled) {
        actions.forEach(action => this.logic.handleMessage(this.state, action));
      }
    }
  }

  private async connect() {
    await this.transport.connect();
    this.transport.subscribe(this.handleServerMessages);

  }

  private sendActions(actions: Action[]) {
    this.pendingActions = this.pendingActions.concat(actions);
    actions.forEach(action => this.transport.send(action));
  }

  private processServerActions() {
    let lastAction: Action | undefined = undefined;
    let maxFrame = -1;
    let maxGlobalFrame = -1;

    for (const action of this.serverActions) {
      if (action.frame > maxFrame) {
        lastAction = action;
        maxFrame = action.frame;
      } else if (action.frame === maxFrame && gameFrameTypeGuard(action) && action.globalFrame > maxGlobalFrame) {
        lastAction = action;
        maxGlobalFrame = action.globalFrame;
      }
    }
    if (lastAction && lastAction.type === 'frame') {
      this.loading = false;

      if (!this.reconciliationEnabled) {
        this.state = lastAction.state;
      } else {
        this.reconcile(lastAction)
      }

    }
    this.serverActions = [];
  }

  private handleServerMessages = (action: Action) => {
    this.serverActions.push(action);
  }

  private reconcile(action: GameFrame) {
    let i = 0;
    while (i < this.pendingActions.length) {
      let pendingAction = this.pendingActions[i];
      if (pendingAction.frame <= action.frame) {
        this.pendingActions.splice(i, 1);
      } else {
        i++;
      }
    }
    this.state = action.state;
    this.pendingActions.forEach(pendingAction => this.logic.handleMessage(this.state, pendingAction));
  }

  private updateInfo() {
    const info = document.getElementById('info')!;
    info.innerHTML = `
      Frame: ${this.frame}<br/>
      CF: ${this.clock.currentFrame()} <br/>
      Pending actions: ${this.pendingActions.length}<br/>
      prediction: ${this.clientPredictionEnabled ? 'enabled' : 'disabled'}<br/>
      reconciliation: ${this.reconciliationEnabled ? 'enabled' : 'disabled'}<br/>
      RTT: ${this.transport.rtt} ms<br/>
      Position: ${this.state.player.position.x}x${this.state.player.position.y}<br/>
    `;
  }
}
