import { action, makeObservable, observable } from 'mobx';
import { Point2D } from '@shared/types/Point2D';
import { MinimapComponent } from '../components/MinimapComponent';

export class MinimapStore {
  @observable entities: MinimapEntity[] = []
  // @observable player: Point2D = {
  //   x: 0,
  //   y: 0
  // }

  // @observable rotation: number = 0;

  constructor() {
    makeObservable(this);
  }

  @action.bound updateMinimap(mapEntities: MinimapEntity[]) {
    this.entities = mapEntities;
    // this.player = player;
    // this.rotation = rotation;
  }
}

export type MinimapEntity = {
  position: Point2D,
  rotation: number
} & MinimapComponent;
