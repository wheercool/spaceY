import { System } from '../System';
import { CompositorSystem } from '../CompositorSystem';
import { EntityRegistry } from '../../entities/EntityRegistry';
import { UiNotificationSystem } from '../UiNotificationSystem';
import { ClockSystem } from '../ClockSystem';
import { InputSystem } from '../InputSystem';
import { PlayerSystem } from '../PlayerSystem';
import { TurretSystem } from '../TurretSystem';
import { GravityGunSystem } from '../GravityGunSystem';
import { GravitySystem } from '../GravitySystem';
import { AccelerationSystem } from '../AccelerationSystem';
import { MovementSystem } from '../MovementSystem';
import { MaxSpeedSystem } from '../MaxSpeedSystem';
import { ChildrenSystem } from '../ChildrenSystem';
import { CollisionDetectionSystem } from '../CollisionDetectionSystem';
import { CollisionResolutionSystem } from '../CollisionResolutionSystem';
import { CollisionQuestSystem } from '../CollisionQuestSystem';
import { CollisionCleaningSystem } from '../CollisionCleaningSystem';
import { DebuggerSystem } from '../DebuggerSystem';
import { WorldBoundarySystem } from '../WorldBoundarySystem';
import { InputFilterSystem } from './InputFilterSystem';
import { Key } from '../../services/key';
import { steps } from './Step';
import { EntityBuilder } from '../../entities/EntityBuilder';
import { Entity } from '../../entities/Entity';
import { makeEntityId } from '../../types';
import { createEmptyRabbit } from '../../stores/SpaceStore';


export class Tutorial implements System {
  private compositor!: CompositorSystem;
  private registry: EntityRegistry = new EntityRegistry();
  private rafHandle: number = -1;
  private currentStep = 0;
  private steps = steps;

  constructor(
    private readonly renderer: System,
    private readonly uiNotificator: UiNotificationSystem) {
  }

  init(registry: EntityRegistry) {
    return this;
  }

  startGame() {
    this.currentStep = 0;
    this.startStep(this.currentStep);
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

  private startStep(currentStep: number) {
    switch (currentStep) {
      case 0:
        this.startStep1();
        break;
    }
    this.update();
  }

  private startStep1() {
    this.compositor = new CompositorSystem([
      new WorldBoundarySystem(),
      new ClockSystem(),
      new InputSystem(),
      new InputFilterSystem([Key.ARROW_UP]),
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
      this.renderer,
      this.uiNotificator])
    const mapWidth = 2000;
    const mapHeight = 2000;

    this.registry = new EntityRegistry()

    const map = new EntityBuilder()
      .applyComponent('map', { width: mapWidth, height: mapHeight })
      .build();

    const player = this.createPlayer();
    this.registry.addEntity(map);
    this.registry.addEntity(player);

    this.compositor.init(this.registry);
  }

  private createPlayer(): Entity {
    const rabbit = createEmptyRabbit(3);
    return rabbit.build()
  }
}