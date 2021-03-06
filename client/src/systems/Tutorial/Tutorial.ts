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
import { steps } from './Step';
import { EntityBuilder } from '../../entities/EntityBuilder';
import { Entity } from '../../entities/Entity';
import { StepResolutionSystem } from './StepResolutionSystem';
import { add, length, mulByScalar, sub } from '@shared/types/Point2D';
import { CollisionDetectionSystem } from '../CollisionDetectionSystem';
import { CollisionCleaningSystem } from '../CollisionCleaningSystem';
import { createAsteroid, createEmptyRabbit, createPlanet } from '../../entities/templates';
import { createGravityGun } from '../../components/GravityGunComponent';
import { GravityGunSystem } from '../GravityGunSystem';
import { DisableSystemDecorator } from './DisableSystemDecorator';
import { Clock } from '@shared/utils';
import { SIMULATION_UPDATE_RATE } from '@shared/constants';
import { soundManager } from '../../services/SoundManager';
import { Key } from '../../utils';

export class Tutorial implements System {
  private simulation: CompositorSystem;
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
  private gravityGunSystem: DisableSystemDecorator;
  private collisionSystem: DisableSystemDecorator;
  private map: Entity;
  private clock: Clock;
  private currentCF = 0;

  constructor(
    private readonly renderer: System,
    private readonly uiNotificator: UiNotificationSystem) {
    this.clock = new Clock(SIMULATION_UPDATE_RATE);
    this.inputFilterSystem = new InputFilterSystem([Key.ARROW_UP]);
    this.gravityGunSystem = new DisableSystemDecorator(new GravityGunSystem());
    this.collisionSystem = new DisableSystemDecorator(new CollisionDetectionSystem());

    this.simulation = new CompositorSystem([
      new WorldBoundarySystem(),
      new ClockSystem(),
      new InputSystem(),
      this.inputFilterSystem,
      new PlayerSystem(),
      this.gravityGunSystem,
      new GravitySystem(300),
      new AccelerationSystem(),
      new MovementSystem(),
      new MaxSpeedSystem(),
      new ChildrenSystem(),
      this.collisionSystem,
      this.stepResolutionSystem,
      this.uiNotificator,
      new CollisionCleaningSystem()
    ])

    const mapWidth = 2000;
    const mapHeight = 200000;
    this.map = new EntityBuilder()
      .applyComponent('map', { width: mapWidth, height: mapHeight })
      .build();
    this.target = this.createTarget();
    this.player = this.createPlayer();
    this.planet = EntityBuilder.fromEntity(createPlanet({ x: 500, y: 500 }))
      .applyComponents({
        onMinimap: {
          shape: {
            type: 'circle',
            radius: 8,
            color: 'white'
          }
        }
      })
      .build();
    this.asteroid = EntityBuilder.fromEntity(createAsteroid({ x: 500, y: 500 }))
      .applyComponents({
        onMinimap: {
          shape: {
            type: 'circle',
            radius: 0.1,
            color: 'red'
          }
        }
      })
      .build();
  }

  init(registry: EntityRegistry) {
    this.uiNotificator.spaceshipPanel.hide();
    this.uiNotificator.miniMap.hide();
    return this;
  }

  startGame() {
    this.currentStep = 0;
    this.clock.start();
    this.startStep(this.currentStep);
    return this;
  }

  stopGame() {
    cancelAnimationFrame(this.rafHandle);
    this.rafHandle = 0;
  }

  update() {
    const commandFrame = this.clock.currentFrame();
    while (this.currentCF < commandFrame) {
      this.currentCF++;
      this.simulation.update(this.registry);
      this.renderer.update(this.registry);
    }
    if (this.rafHandle !== 0) {
      this.rafHandle = requestAnimationFrame(() => this.update());
    }
  }

  dispose() {
    this.simulation.dispose();
    if (this.renderer.dispose) {
      this.renderer.dispose();
    }
    this.stopGame();
  }

  private isCurrentStepCompleted(registry: EntityRegistry) {
    const player = registry.findSingle(['player']);
    const playerBuilder = EntityBuilder.fromEntity(player);

    const input = registry.findEntitiesByComponents(['input']);

    if (this.currentStep === 0) {
      return input.some(inputEntity => inputEntity.input.top);
    }
    if (this.currentStep === 1) {
      const pressedTop = input.some(inputEntity => inputEntity.input.top);
      return !pressedTop;
    }
    if (this.currentStep === 2) {
      return input.some(inputEntity => inputEntity.input.bottom);
    }
    if (this.currentStep === 3) {
      const position = playerBuilder.getOrDefault('position', { x: 0, y: 0 });
      const prevPosition = playerBuilder.getOrDefault('prevPosition', { x: 0, y: 0 });
      const speed = add(position, mulByScalar(prevPosition, -1));
      const speedValue = length(speed);
      return speedValue < 0.1;
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
        soundManager.play('failed');
        if (this.currentStep === 8) {
          this.startStep9();
        } else {
          this.startStep10();
        }
      }
      return speed > 1;
    }
    return false;
  }

  private goToNextStep() {
    this.currentStep++;
    if (this.currentStep === this.steps.length) {
      this.finisTutorial();
    } else {
      soundManager.play('step_done');
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
    this.gravityGunSystem.disable();
    this.collisionSystem.disable();

    this.registry = new EntityRegistry()
    this.registry.addEntity(this.map);
    this.registry.addEntity(this.player);
    this.simulation.init(this.registry);
    this.renderer.init(this.registry);
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
    this.gravityGunSystem.enable();
    this.collisionSystem.enable();

    EntityBuilder.fromEntity(this.map)
      .applyComponent('map', {
        width: 2000,
        height: 2000
      });

    EntityBuilder.fromEntity(this.player)
      .applyComponents({
        position: { x: 200, y: 200 },
        prevPosition: { x: 200, y: 200 },
        rotation: 0
      });

    this.registry.addEntity(this.target);
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
