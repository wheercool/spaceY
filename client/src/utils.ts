export function assertNotReachable(x: never): never {
  throw new Error('Not Reachable');
}
