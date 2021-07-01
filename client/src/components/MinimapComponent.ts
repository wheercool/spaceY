/***
 * Display entity with this component on the minimap
 */
export interface MinimapComponent {
  shape: MinimapShape
}

export interface PlayerMinimapShape {
  type: 'player';
}

export interface RectangleMinimapShape {
  type: 'rectangle';
  color: string;
  width: number;
  height: number;
}

export interface CircleMinimapShape {
  type: 'circle';
  color: string;
  radius: number;
}

export type MinimapShape = PlayerMinimapShape | RectangleMinimapShape | CircleMinimapShape;
