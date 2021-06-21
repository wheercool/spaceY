import { action, makeObservable, observable } from 'mobx';

export class RootStore {
  @observable quest = 'Hello, world';

  constructor() {
    makeObservable(this);
  }

  @action.bound onNext() {
    this.quest = 'Next';
  }
}