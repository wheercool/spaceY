import { EntityId } from '../types';
import { Point2D } from '@shared/types/Point2D';

export type ChildComponent = {
  parentId: EntityId,
  relativePosition: Point2D;
};