import { action, makeObservable, observable } from 'mobx';
import { Point2D } from '@shared/types/Point2D';
import { MinimapComponent } from '../components/MinimapComponent';

export class MinimapStore {
  @observable visible = true;
  @observable entities: MinimapEntity[] = []

  constructor() {
    makeObservable(this);
  }

  @action.bound show() {
    this.visible = true;
  }
  @action.bound hide() {
    this.visible = false;
  }
  @action.bound updateMinimap(mapEntities: MinimapEntity[]) {
    this.entities = mapEntities;
  }
}

export type MinimapEntity = {
  position: Point2D,
  rotation: number
} & MinimapComponent;
