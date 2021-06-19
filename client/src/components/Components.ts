import { Point2D } from '@shared/types/GameState';
import { Model } from '../services/AssetsManager';
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
import { BoundingComponent } from './BoundingComponent';

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
  bounding: BoundingComponent;
}

export type ComponentValue<Cmp extends keyof CmpRegistry, CmpRegistry> = CmpRegistry[Cmp];
