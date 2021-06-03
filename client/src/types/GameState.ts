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
