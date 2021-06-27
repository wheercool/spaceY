import { action, makeObservable, observable } from 'mobx';

export class RootStore {
  constructor() {
    makeObservable(this);
  }

  @action.bound onNext() {
  }
}
