import { makeObservable } from "mobx";

export class SpaceshipPanelStore {
  constructor() {
    makeObservable(this);
  }
}
