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
import { EntityBuilder } from '../entities/EntityBuilder';
import { ChildrenSystem } from './ChildrenSystem';
import { ZSystem } from './ZSystem';


export class Game implements System {
  private compositor!: CompositorSystem;
  private registry: EntityRegistry = new EntityRegistry();
  private rafHandle: number = -1;

  constructor(
    private readonly renderer: System,
    private readonly uiNotificator: UiNotificationSystem) {
    this.compositor = new CompositorSystem([
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
      this.renderer,
      this.uiNotificator
    ]);
  }

  init(registry: EntityRegistry) {
    this.registry = registry;
    this.registry.addEntity(
      new EntityBuilder()
        .applyComponents({
          position: {
            x: 200,
            y: 200
          },
          gravityForce: {
            x: 200,
            y: 200
          }
        })
        .build()
    )
    return this;
  }

  startGame() {
    this.compositor.init(this.registry);
    this.update();
    return this;
  }

  stopGame() {
    cancelAnimationFrame(this.rafHandle);
  }

  update() {
    this.compositor.update(this.registry);
    this.rafHandle = requestAnimationFrame(() => this.update());
  }

  dispose() {
    this.compositor.dispose();
    this.stopGame();
  }
}


