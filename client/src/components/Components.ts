import { InputComponent } from './InputComponent';
import { TimeComponent } from './TimeComponent';
import { PositionComponent } from './PositionComponent';
import { RotationComponent } from './RotationComponent';
import { PrevPositionComponent } from './PrevPositionComponent';
import { GravityForceComponent } from './GravityForceComponent';
import { PullingForceComponent } from './PullingForceComponent';
import { MassComponent } from './MassComponent';
import { AccelerationComponent } from './AccelerationComponent';
import { IterationComponent } from './IterationComponent';
import { PlayerComponent } from './PlayerComponent';
import { ModelComponent } from './ModelComponent';
import { CameraAtComponent } from './CameraAtComponent';
import { BoundariesComponent } from './BoundariesComponent';
import { CollisionComponent } from './CollisionComponent';
import { StaticComponent } from './StaticComponent';
import { AsteroidComponent } from './AsteroidComponent';
import { JumpComponent } from './JumpComponent';
import { TurretComponent } from './TurretComponent';
import { TimerComponent } from './TimerComponent';
import { GravityBehaviourComponent } from './GravityBehaviourComponent';
import { MaxSpeedComponent } from './MaxSpeedComponent';

export interface ComponentsRegistry {
  rotation: RotationComponent;
  position: PositionComponent;
  prevPosition: PrevPositionComponent;
  gravityForce: GravityForceComponent;
  pullingForce: PullingForceComponent;
  mass: MassComponent;
  acceleration: AccelerationComponent;
  iteration: IterationComponent;
  input: InputComponent;
  player: PlayerComponent;
  model: ModelComponent;
  cameraAt: CameraAtComponent;
  time: TimeComponent;
  boundaries: BoundariesComponent;
  collision: CollisionComponent;
  static: StaticComponent;
  asteroid: AsteroidComponent;
  jump: JumpComponent;
  turret: TurretComponent;
  timer: TimerComponent;
  gravityBehaviour: GravityBehaviourComponent;
  maxSpeed: MaxSpeedComponent;
}

export type ComponentValue<Cmp extends keyof CmpRegistry, CmpRegistry> = CmpRegistry[Cmp];
