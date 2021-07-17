import { System } from '../System';
import { CompositorSystem } from '../CompositorSystem';
import { EntityRegistry } from '../../entities/EntityRegistry';
import { UiNotificationSystem } from '../UiNotificationSystem';
import { ClockSystem } from '../ClockSystem';
import { InputSystem } from '../InputSystem';
import { PlayerSystem } from '../PlayerSystem';
import { GravitySystem } from '../GravitySystem';
import { AccelerationSystem } from '../AccelerationSystem';
import { MovementSystem } from '../MovementSystem';
import { MaxSpeedSystem } from '../MaxSpeedSystem';
import { ChildrenSystem } from '../ChildrenSystem';
import { WorldBoundarySystem } from '../WorldBoundarySystem';
import { InputFilterSystem } from './InputFilterSystem';
import { Key } from '../../services/key';
import { steps } from './Step';
import { EntityBuilder } from '../../entities/EntityBuilder';
import { Entity } from '../../entities/Entity';
import { StepResolutionSystem } from './StepResolutionSystem';
import { add, length, mulByScalar, sub } from '@shared/types/Point2D';
import { CollisionDetectionSystem } from '../CollisionDetectionSystem';
import { CollisionCleaningSystem } from '../CollisionCleaningSystem';
import { createEffect, EffectName } from '../../components/EffectsComponent';
import { createAsteroid, createEmptyRabbit, createPlanet } from '../../entities/templates';
import { createGravityGun } from '../../components/GravityGunComponent';
import { GravityGunSystem } from '../GravityGunSystem';


export class Tutorial implements System {
  private compositor!: CompositorSystem;
  private registry: EntityRegistry = new EntityRegistry();
  private rafHandle: number = -1;
  private currentStep = 0;
  private steps = steps;
  private inputFilterSystem!: InputFilterSystem;
  private stepResolutionSystem = new StepResolutionSystem(
    registry => this.isCurrentStepCompleted(registry),
    () => this.goToNextStep())
  private target: Entity;
  private player: Entity;
  private planet: Entity;
  private asteroid: Entity;

  constructor(
    private readonly renderer: System,
    private readonly uiNotificator: UiNotificationSystem) {
    this.target = this.createTarget();
    this.player = this.createPlayer();
    this.planet = createPlanet({ x: 500, y: 500 });
    this.asteroid = createAsteroid({ x: 500, y: 500 });
  }

  init(registry: EntityRegistry) {
    this.uiNotificator.spaceshipPanel.hide();
    this.uiNotificator.miniMap.hide();
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

  private isCurrentStepCompleted(registry: EntityRegistry) {
    const player = registry.findSingle(['player']);
    const playerBuilder = EntityBuilder.fromEntity(player);

    const input = registry.findEntitiesByComponents(['input']);

    if (this.currentStep === 0) {
      const pressedTop = input.some(inputEntity => inputEntity.input.top);
      return pressedTop;
    }
    if (this.currentStep === 1) {
      const pressedTop = input.some(inputEntity => inputEntity.input.top);
      return !pressedTop;
    }
    if (this.currentStep === 2) {
      const pressedBottom = input.some(inputEntity => inputEntity.input.bottom);
      return pressedBottom;
    }
    if (this.currentStep === 3) {
      const position = playerBuilder.getOrDefault('position', { x: 0, y: 0 });
      const prevPosition = playerBuilder.getOrDefault('prevPosition', { x: 0, y: 0 });
      const speed = add(position, mulByScalar(prevPosition, -1));
      const speedValue = length(speed);
      return speedValue < 0.5;
    }
    if (this.currentStep === 4) {
      const rotation = playerBuilder.getOrDefault('rotation', 0) * 360 / (2 * Math.PI);
      const angle = rotation % 360;
      return Math.abs(Math.abs(angle) - 180) < 10;
    }
    if (this.currentStep === 5) {
      const collisions = registry.findEntitiesByComponents(['collision']);
      return collisions.length > 0;
    }
    if (this.currentStep === 6) {
      const planetPosition = EntityBuilder.fromEntity(this.planet).getOrDefault('position', { x: 0, y: 0 });
      const playerPosition = playerBuilder.getOrDefault('position', { x: 0, y: 0 });
      const distance = length(sub(playerPosition, planetPosition));
      return distance < 100;
    }
    if (this.currentStep === 7) {
      const collisions = registry.findEntitiesByComponents(['collision']);
      return collisions.length > 0;
    }
    if (this.currentStep === 8 || this.currentStep === 9) {
      const asteroidBuilder = EntityBuilder.fromEntity(this.asteroid);
      const position = asteroidBuilder.getOrDefault('position', { x: 0, y: 0 });
      const prevPosition = asteroidBuilder.getOrDefault('prevPosition', { x: 0, y: 0 });
      const speed = length(sub(position, prevPosition));

      const collisions = registry.findEntitiesByComponents(['collision']);
      if (collisions.length > 0) {
        if (this.currentStep === 8) {
          this.startStep9();
        } else {
          this.startStep10();
        }
      }
      return speed > 0.1;
    }
    return false;
  }

  private goToNextStep() {
    this.currentStep++;
    if (this.currentStep === this.steps.length) {
      this.finisTutorial();
    } else {
      this.startStep(this.currentStep);
    }
  }

  private finisTutorial() {
    this.uiNotificator.questManager.questCompleted();
  }

  private startStep(currentStep: number) {
    switch (currentStep) {
      case 0:
        this.startStep1();
        break;
      case 1:
        this.startStep2();
        break;
      case 4:
        this.startStep4();
        break;
      case 5:
        this.startStep6();
        break;
      case 6:
        this.startStep7();
        break;
      case 7:
        this.startStep8();
        break;
      case 8:
        this.startStep9();
        break;
      case 9:
        this.startStep10();
        break;
    }
    const step = this.steps[this.currentStep];
    if (step) {
      this.uiNotificator.questManager.setCurrentQuestInfo(step);
    }
    this.update();
  }

  private startStep1() {
    this.inputFilterSystem = new InputFilterSystem([Key.ARROW_UP]);
    this.compositor = new CompositorSystem([
      new WorldBoundarySystem(),
      new ClockSystem(),
      new InputSystem(),
      this.inputFilterSystem,
      new PlayerSystem(),
      new GravitySystem(),
      new AccelerationSystem(),
      new MovementSystem(),
      new MaxSpeedSystem(),
      new ChildrenSystem(),
      this.stepResolutionSystem,
      this.renderer,
    ])
    const mapWidth = 2000;
    const mapHeight = 200000;

    this.registry = new EntityRegistry()

    const map = new EntityBuilder()
      .applyComponent('map', { width: mapWidth, height: mapHeight })
      .build();

    this.registry.addEntity(map);
    this.registry.addEntity(this.player);

    this.compositor.init(this.registry);
  }

  private startStep2() {
    this.inputFilterSystem.addAllowedKey(Key.ARROW_DOWN);
  }

  private startStep4() {
    this.inputFilterSystem.addAllowedKey(Key.ARROW_LEFT);
    this.inputFilterSystem.addAllowedKey(Key.ARROW_RIGHT);
  }

  private startStep6() {
    this.uiNotificator.miniMap.show();
    this.compositor.dispose();
    this.compositor = new CompositorSystem([
      new WorldBoundarySystem(),
      new ClockSystem(),
      new InputSystem(),
      this.inputFilterSystem,
      new PlayerSystem(),
      new GravityGunSystem(),
      new GravitySystem(),
      new AccelerationSystem(),
      new MovementSystem(),
      new MaxSpeedSystem(),
      new ChildrenSystem(),
      new CollisionDetectionSystem(),
      this.stepResolutionSystem,
      this.renderer,
      this.uiNotificator,
      new CollisionCleaningSystem()
    ])

    const
      mapWidth = 2000;
    const
      mapHeight = 2000;

    this.registry = new EntityRegistry()
    const map = new EntityBuilder()
      .applyComponent('map', { width: mapWidth, height: mapHeight })
      .build();

    EntityBuilder.fromEntity(this.player)
      .applyComponents({
        position: { x: 200, y: 200 },
        prevPosition: { x: 200, y: 200 },
        rotation: 0
      });

    this.registry.addEntity(map);

    this.registry.addEntity(this.player);

    this.registry.addEntity(this.target);

    this.compositor.init(this.registry);
  }

  private startStep7() {
    this.registry.removeEntity(this.target.id);
    this.registry.addEntity(this.planet);
    EntityBuilder.fromEntity(this.player)
      .applyComponents({
        position: { x: 200, y: 200 },
        prevPosition: { x: 200, y: 200 },
        rotation: 0
      });
  }

  private startStep8() {
    this.registry.removeEntity(this.planet.id);
    EntityBuilder.fromEntity(this.player)
      .applyComponents({
        position: { x: 200, y: 200 },
        prevPosition: { x: 200, y: 200 },
        rotation: 0
      });
    this.registry.addEntity(this.asteroid);
  }


  private startStep9() {
    this.uiNotificator.spaceshipPanel.show();
    this.inputFilterSystem.addAllowedKey(Key.Q);
    EntityBuilder.fromEntity(this.player)
      .applyComponents({
        position: { x: 200, y: 200 },
        prevPosition: { x: 200, y: 200 },
        rotation: 0,
        gravityGun: createGravityGun({
          consumption: 0,
          power: 100000
        })
      });
  }


  private startStep10() {
    this.inputFilterSystem.removeAllowedKey(Key.Q);
    this.inputFilterSystem.addAllowedKey(Key.W);

    EntityBuilder.fromEntity(this.asteroid)
      .applyComponents({
        position: { x: 500, y: 500 },
        prevPosition: { x: 500, y: 500 }
      });

    EntityBuilder.fromEntity(this.player)
      .applyComponents({
        position: { x: 200, y: 200 },
        prevPosition: { x: 200, y: 200 },
        rotation: 0,
        gravityGun: createGravityGun({
          consumption: 0,
          power: 100000
        })
      });
  }

  private createTarget(): Entity {
    return new EntityBuilder()
      .applyComponents({
        model: 'target',
        onMinimap: {
          shape: {
            type: 'circle',
            radius: 20,
            color: '#eee'
          }
        },
        boundaries: [{
          radius: 200,
          position: {
            x: 0,
            y: 0
          }
        }],
        position: {
          x: 1000,
          y: 1000
        }
      })
      .build()
  }

  private createPlayer(): Entity {
    const rabbit = createEmptyRabbit(1.5)
      .applyComponents({
        onMinimap: {
          shape: {
            type: 'player'
          }
        }
      })
    return rabbit.build()
  }
}