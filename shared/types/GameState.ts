export interface GameState {
  player: Player;
}

export interface Player {
  speed: number;
  position: Point2D;
}

export interface Point2D {
  x: number;
  y: number;
}

export function length(vector: Point2D) {
  return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
}

export function add(a: Point2D, b: Point2D) {
  return { x: a.x + b.x, y: a.y + b.y };
}

export function sub(a: Point2D, b: Point2D) {
  return { x: a.x - b.x, y: a.y - b.y };
}

export function distanceBetween(a: Point2D, b: Point2D) {
  return length(sub(a, b));
}

export function mulByScalar(a: Point2D, scalar: number) {
  return { x: a.x * scalar, y: a.y * scalar };
}

export function divByScalar(a: Point2D, scalar: number) {
  return { x: a.x / scalar, y: a.y / scalar };
}

export function copy(a: Point2D): Point2D {
  return { x: a.x, y: a.y };
}
