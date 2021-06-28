import { action, makeObservable, observable } from 'mobx';
import { assetsManager } from '../services/AssetsManager';
import { RouterStore } from './RouterStore';

export class RootStore {
  @observable assetsProgress = 0;

  constructor(
    private readonly router: RouterStore
  ) {
    makeObservable(this);
  }

  @action.bound
  async loadAssets() {
    await assetsManager.load(
      (progress) => this.assetsProgress = progress,
      () => {
        this.router.gotoStation();
      }
    )
  }
}
