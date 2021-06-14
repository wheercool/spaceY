import { GameState } from './GameState';

export type FrameId = number;
export type TimeStamp = number;

export interface BasicAction {
  frame: FrameId
}

export interface InputAction extends BasicAction {
  type: 'input',
  left: boolean;
  right: boolean;
  top: boolean;
  bottom: boolean;
}

export interface ConnectedAction extends BasicAction {
  type: 'connected'
}

export interface GameFrame extends BasicAction {
  type: 'frame'
  state: GameState
}

export function createGameFrame(frame: FrameId, state: GameState): GameFrame {
  return {
    type: 'frame',
    frame,
    state
  }
}

export function gameFrameTypeGuard(action: Action): action is GameFrame {
  return typeof (action as any)['globalFrame'] !== 'undefined';
}

export type Action = InputAction | ConnectedAction | GameFrame;
