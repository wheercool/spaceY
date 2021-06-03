export interface GoUpAction {
  type: 'GO_UP'
}

export interface GoDownAction {
  type: 'GO_DOWN'
}

export interface GoLeftAction {
  type: 'GO_LEFT'
}

export interface GoRightAction {
  type: 'GO_RIGHT'
}

export interface ConnectedAction {
  type: 'connected'
}
export type Action = GoUpAction | GoDownAction | GoLeftAction | GoRightAction | ConnectedAction;
