import { PositionComponent } from './PositionComponent';
import { RotationComponent } from './RotationComponent';
import { add, Point2D, rotate } from '@shared/types/Point2D';

export type BoundariesComponent = BoundingCircle[];

export type BoundingCircle = {
  radius: number;
  position: Point2D;
}

export function positionAbsolute(
  bounding: BoundariesComponent,
  position: PositionComponent,
  rotation: RotationComponent
): BoundariesComponent {
  return bounding.map(circle => {
    let circlePosition = circle.position // rotate(circle.position, rotation);
    circlePosition = rotate(circlePosition, rotation)
    circlePosition = add(circlePosition, position);
    return { ...circle, position: circlePosition };
  });
}
