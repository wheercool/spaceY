/***
 *
 */
import { Point2D } from '@shared/types/Point2D';

export interface TurretComponent {
  /**
   * Angle of the turret
   */
  direction: number;
  position: Point2D;
  triggered: boolean;
  cooldown: number;
}
