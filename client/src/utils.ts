export function assertNotReachable(x: never): never {
  throw new Error('Not Reachable');
}

export const EPS = 0.000001;

export enum Key {
  ARROW_UP    = 'arrowup',
  ARROW_DOWN  = 'arrowdown',
  ARROW_LEFT  = 'arrowleft',
  ARROW_RIGHT = 'arrowright',
  Q           = 'q',
  W           = 'w',
  E           = 'e',
  R           = 'r',
  T           = 't'
}
