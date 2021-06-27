import { action, makeObservable, observable } from 'mobx';
import { Point2D } from '@shared/types/Point2D';

export class MinimapStore {
  @observable player: Point2D = {
    x: 0,
    y: 0
  }

  @observable rotation: number = 0;

  constructor() {
    makeObservable(this);
  }

  @action.bound updateMinimap(player: Point2D, rotation: number) {
    this.player = player;
    this.rotation = rotation;
  }
}
