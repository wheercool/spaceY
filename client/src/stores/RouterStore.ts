import { action, makeObservable, observable } from 'mobx';

export enum Route {
  Start   = 'start',
  Station = 'station',
  Tavern  = 'quest',
  Abount  = 'about',
  Dock    = 'dock',
  Play    = 'play'
}

export class RouterStore {
  @observable route: Route = Route.Start;

  constructor() {
    makeObservable(this);
    window.addEventListener('hashchange', this.onHashChanged)
  }

  dispose() {
    window.removeEventListener('hashchange', this.onHashChanged);
  }

  @action.bound gotoStation() {
    this.route = Route.Station;
    history.pushState(null, 'Station', this.getUrlFor('#station'));
  }

  @action.bound goToStart() {
    this.route = Route.Start;
  }

  @action.bound goToAbout() {
    this.route = Route.Abount;
    history.pushState(null, 'About', this.getUrlFor('#about'));
  }

  @action.bound goToTavern() {
    this.route = Route.Tavern;
    history.pushState(null, 'Tavern', this.getUrlFor('#tavern'));
  }

  @action.bound goToDock() {
    this.route = Route.Dock;
    history.pushState(null, 'Dock', this.getUrlFor('#dock'));
  }

  @action.bound goToPlay() {
    this.route = Route.Play;
  }

  private onHashChanged = () => {
    switch (location.hash) {
      case '#dock':
        this.goToDock();
        break;
      case '#tavern':
        this.goToTavern();
        break;
      case '#station':
        this.gotoStation();
        break;
      case '#about':
        this.goToAbout();
        break;
      default:
        this.goToStart();
        break;
    }
  }

  private getUrlFor(hash: string) {
    return document.location.pathname + document.location.search + hash;
  }
}
