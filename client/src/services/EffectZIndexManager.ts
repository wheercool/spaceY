import { Effect } from '../components/EffectsComponent';

const deltaZ = 1;
export class EffectZIndexManager {
  private lastCoordinate = new Map<number, number>();
  getZCoordinate(effect: Effect): number {
    const z = effect.z;
    if (z.coordinate) {
      return z.coordinate;
    }

    let coordinate = this.lastCoordinate.get(z.index);
    if (!coordinate) {
      coordinate = z.index;
    }
    coordinate += deltaZ;
    this.lastCoordinate.set(z.index, coordinate);
    effect.z.coordinate = coordinate;
    return coordinate;
  }
}