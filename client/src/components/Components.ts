import { Point2D } from '@shared/types/GameState';
import { Model } from '../services/AssetsManager';
import { InputComponent } from './InputComponent';
import { TimeComponent } from './TimeComponent';

export interface ComponentsRegistry {
  rotation: number;
  position: Point2D;
  prevPosition: Point2D;
  gravity: Point2D;
  pullingForce: Point2D;
  mass: number;
  acceleration: Point2D;
  iteration: number;
  input: InputComponent;
  player: boolean;
  model: Model;
  cameraAt: boolean;
  time: TimeComponent;
}

export type ComponentValue<Cmp extends keyof CmpRegistry, CmpRegistry> = CmpRegistry[Cmp];
