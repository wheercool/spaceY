import { Point2D } from '@shared/types/GameState';

export interface ComponentsRegistry {
  position: Point2D
  mass: number
  acceleration: number;
  iteration: number;
  sprite: SpriteComponent;
  input: InputComponent;
  player: boolean;
}

export interface InputComponent {
  left: boolean;
  right: boolean;
  top: boolean;
  bottom: boolean;
}

export type SpriteComponent = Circle | Rectangle | Image;

export interface Image {
  kind: 'image';
  src: CanvasImageSource;
  width: number;
  height: number;
}

export interface Circle {
  kind: 'circle';
  radius: number;
}

export interface Rectangle {
  kind: 'rectangle';
  width: number;
  height: number;
}

export type ComponentValue<Cmp extends keyof CmpRegistry, CmpRegistry> = CmpRegistry[Cmp];
