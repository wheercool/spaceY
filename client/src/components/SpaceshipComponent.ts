import { SpaceshipName } from '../types';
import { Point2D } from '@shared/types/Point2D';

export interface SpaceshipComponent {
  name: SpaceshipName;
  // pullingForce: Point2D;  TODO: Add
}
