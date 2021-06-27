import { CompositorSystem } from './CompositorSystem';
import { EntityRegistry } from '../entities/EntityRegistry';
import { System } from './System';
import { EntityBuilder } from '../entities/EntityBuilder';
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
import { makeSeconds, SpaceshipName } from '../types';
import { createGravityBehaviour, GravityTagName } from '../components/GravityBehaviourComponent';
import { MaxSpeedSystem } from './MaxSpeedSystem';
import { Point2D } from '@shared/types/Point2D';
import { UiNotificationSystem } from './UiNotificationSystem';
import { createGravityGun } from '../components/GravityGunComponent';
import { GravityGunSystem } from './GravityGunSystem';
import { Entity } from '../entities/Entity';


export class Game implements System {
  private compositor!: CompositorSystem;
  private registry: EntityRegistry = new EntityRegistry();
  private rafHandle: number = -1;
  private player: Entity;

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
      new CollisionDetectionSystem(),
      new CollisionResolutionSystem(),
      // new DebuggerSystem('Cooldown: ', ['model'], e => e.find((en: any) => en.model === 'laser')),
      this.renderer,
      this.uiNotificator
    ]);


  }

  init(registry: EntityRegistry) {
    this.registry = registry;
    return this;
  }

  startGame() {
    // this.initEntities();
    this.compositor.init(this.registry);
    this.update();
  }

  update() {
    this.compositor.update(this.registry);
    this.rafHandle = requestAnimationFrame(() => this.update());
  }
}


