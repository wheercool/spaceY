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
    history.pushState(null,  'Station', document.location.pathname + '#station');
  }

  @action.bound goToStart() {
    this.route = Route.Start;
  }

  @action.bound goToAbout() {
    this.route = Route.Abount;
    history.pushState(null,  'About', document.location.pathname + '#about');
  }

  @action.bound goToTavern() {
    this.route = Route.Tavern;
    history.pushState(null,  'Tavern', document.location.pathname + '#tavern');
  }

  @action.bound goToDock() {
    this.route = Route.Dock;
    history.pushState(null,  'Dock', document.location.pathname + '#dock');
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
}
