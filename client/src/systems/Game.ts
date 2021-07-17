import { CompositorSystem } from './CompositorSystem';
import { EntityRegistry } from '../entities/EntityRegistry';
import { System } from './System';
import { InputSystem } from './InputSystem';
import { PlayerSystem } from './PlayerSystem';
import { GravitySystem } from './GravitySystem';
import { MovementSystem } from './MovementSystem';
import { ClockSystem } from './ClockSystem';
import { AccelerationSystem } from './AccelerationSystem';
import { CollisionDetectionSystem } from './CollisionDetectionSystem';
import { CollisionResolutionSystem } from './CollisionResolutionSystem';
import { WorldBoundarySystem } from './WorldBoundarySystem';
import { TurretSystem } from './TurretSystem';
import { MaxSpeedSystem } from './MaxSpeedSystem';
import { UiNotificationSystem } from './UiNotificationSystem';
import { GravityGunSystem } from './GravityGunSystem';
import { CollisionCleaningSystem } from './CollisionCleaningSystem';
import { CollisionQuestSystem } from './CollisionQuestSystem';
import { DebuggerSystem } from './DebuggerSystem';
import { ChildrenSystem } from './ChildrenSystem';
import { Clock } from '@shared/utils';
import { SIMULATION_UPDATE_RATE } from '@shared/constants';

export class Game implements System {
  private simulation: CompositorSystem;
  private registry: EntityRegistry = new EntityRegistry();
  private rafHandle: number = -1;
  private clock: Clock;
  private currentCF = 0;

  constructor(
    private readonly renderer: System,
    private readonly uiNotificator: UiNotificationSystem) {
    this.clock = new Clock(SIMULATION_UPDATE_RATE);
    this.simulation = new CompositorSystem([
      new WorldBoundarySystem(),
      new ClockSystem(),
      new InputSystem(),
      new PlayerSystem(),
      new TurretSystem(),
      new GravityGunSystem(),
      new GravitySystem(),
      new AccelerationSystem(),
      new MovementSystem(),
      new MaxSpeedSystem(),
      new ChildrenSystem(),
      new CollisionDetectionSystem(),
      new CollisionResolutionSystem(),
      new CollisionQuestSystem(),
      new CollisionCleaningSystem(),
      new DebuggerSystem()
      // .log('Cooldown: ', ['model'], e => e.find((en: any) => en.model === 'laser'))
      ,
      this.uiNotificator
    ]);
  }

  init(registry: EntityRegistry) {
    this.registry = registry;
    return this;
  }

  startGame() {
    this.simulation.init(this.registry);
    this.renderer.init(this.registry);
    this.clock.start();
    this.update();
    return this;
  }

  stopGame() {
    cancelAnimationFrame(this.rafHandle);
  }

  update() {
    let needRedraw = false;
    const commandFrame = this.clock.currentFrame();
    while (this.currentCF < commandFrame) {
      needRedraw = true;
      this.currentCF++;
      this.simulation.update(this.registry);
    }
    if (needRedraw) {
      this.renderer.update(this.registry);
    }
    this.rafHandle = requestAnimationFrame(() => this.update());
  }

  dispose() {
    this.simulation.dispose();
    this.stopGame();
  }
}


