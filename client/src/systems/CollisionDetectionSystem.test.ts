import { CollisionDetectionSystem } from './CollisionDetectionSystem';

describe('CollisionSystem', () => {
  describe('#isCirclesIntersected', () => {
    it('assert true if 2 circles intersected', () => {
      const actual = CollisionDetectionSystem.isCirclesIntersected(
        { radius: 10.5, position: { x: 0, y: 0 } },
        { radius: 12, position: { x: 10.5, y: 0 } },
      );

      expect(actual).toEqual(true);
    })
    it('assert false if circles lies outside each other', () => {
      const actual = CollisionDetectionSystem.isCirclesIntersected(
        { radius: 10.5, position: { x: 0, y: 0 } },
        { radius: 12, position: { x: 100, y: 100 } },
      );

      expect(actual).toEqual(false);
    })
    it('assert true if the touch with 1 point', () => {
      const actual = CollisionDetectionSystem.isCirclesIntersected(
        { radius: 10, position: { x: 0, y: 0 } },
        { radius: 20, position: { x: 30, y: 0 } },
      );

      expect(actual).toEqual(true);
    })
    it('assert true if one circle is inside other', () => {
      const actual = CollisionDetectionSystem.isCirclesIntersected(
        { radius: 10, position: { x: 0, y: 0 } },
        { radius: 8, position: { x: 0, y: 0 } },
      );
      expect(actual).toEqual(true);
    })
  })
})
