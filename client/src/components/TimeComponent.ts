/***
 * Describe game time.
 * @current - current time
 * @dt - time delta between game iterations
 */
export interface TimeComponent {
  dt: number;
  current: number;
}
