import { action, makeObservable, observable, runInAction } from 'mobx';
import { assetsManager } from '../services/AssetsManager';
import { RouterStore } from './RouterStore';
import { soundManager } from '../services/SoundManager';
import { LoadingManager } from 'three';

export class RootStore {
  @observable assetsProgress = 0;

  constructor(
    private readonly router: RouterStore
  ) {
    makeObservable(this);
  }

  @action.bound
  loadAssets() {
    const manager = new LoadingManager();

    manager.onProgress = (url, itemsLoaded, itemsTotal) => {
      console.log(url);
      runInAction(() => this.assetsProgress = (Math.round(itemsLoaded / itemsTotal * 100)));
    };

    manager.onStart = ((url) => console.log('Started: ', url));
    manager.onLoad = () => this.router.gotoStation();
    manager.onError = ((url) => console.error('Error loading: ', url));

    manager.itemStart('token');
    soundManager.load(manager)
    assetsManager.load(manager)
    manager.itemEnd('token');
  }
}
