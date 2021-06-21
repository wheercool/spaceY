import { action, makeObservable, observable } from 'mobx';

export enum Route {
  Start   = 'start',
  Station = 'station',
  Tavern  = 'quest',
  Abount  = 'about',
  Dock    = 'dock'
}

export class RouterStore {
  @observable route: Route = Route.Start;

  constructor() {
    makeObservable(this);
    const params = new URLSearchParams(window.location.search);
    const page = params.get('page');
    if (page) {
      this.route = page as Route;
    }
  }

  @action.bound gotoStation() {
    this.route = Route.Station;
  }
  @action.bound goToStart() {
    this.route = Route.Start;
  }
  @action.bound goToAbout() {
    this.route = Route.Abount;
  }
  @action.bound goToTavern() {
    this.route = Route.Tavern;
  }
  @action.bound goToDock() {
    this.route = Route.Dock;
  }
}