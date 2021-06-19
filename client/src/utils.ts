export function assertNotReachable(x: never): never {
  throw new Error('Not Reachable');
}

export const EPS = 0.000001;
