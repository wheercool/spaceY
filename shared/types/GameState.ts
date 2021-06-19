import { Point2D } from './Point2D';

export interface GameState {
  player: Player;
}

export interface Player {
  speed: number;
  position: Point2D;
}

