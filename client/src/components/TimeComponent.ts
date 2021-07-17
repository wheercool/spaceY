/***
 * Describe time.
 * @current - current time
 * @dt - time delta between game iterations
 */
import { TimeSpan } from '../types';

export interface TimeComponent {
  dt: TimeSpan;
  current: number;
}

