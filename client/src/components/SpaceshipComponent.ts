import { SpaceshipName } from '../types';
import { Point2D } from '@shared/types/Point2D';

export interface SpaceshipComponent {
  name: SpaceshipName;
  speed: number;
  engineSize: Point2D;
  enginePosition: Point2D;
  // pullingForce: Point2D;  TODO: Add
}
