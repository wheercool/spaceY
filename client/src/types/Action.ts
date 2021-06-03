import { GameState } from './GameState';
import { access } from 'fs';

export interface BasicAction {
  frame: number
}

export interface GoUpAction extends BasicAction {
  type: 'GO_UP'
}

export interface GoDownAction extends BasicAction {
  type: 'GO_DOWN'
}

export interface GoLeftAction extends BasicAction {
  type: 'GO_LEFT'
}

export interface GoRightAction extends BasicAction {
  type: 'GO_RIGHT'
}

export interface ConnectedAction extends BasicAction {
  type: 'connected'
}

export interface GameFrame extends BasicAction {
  type: 'frame'
  state: GameState
  globalFrame: number
}

export function gameFrameTypeGuard(action: Action): action is GameFrame {
  return typeof (action as any)['globalFrame'] !== 'undefined';
}

export type Action = GoUpAction | GoDownAction | GoLeftAction | GoRightAction | ConnectedAction | GameFrame;
