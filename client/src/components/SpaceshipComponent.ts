import { SpaceshipName } from '../types';

export interface SpaceshipComponent {
  name: SpaceshipName;
  speed: number;
  // pullingForce: Point2D;  TODO: Add
}
