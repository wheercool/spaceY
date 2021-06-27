import { action, makeObservable, observable } from 'mobx';

export class WalletStore {
  @observable money: number = 0;
  @observable ownedSpaceships = new Set<number>()

  constructor() {
    makeObservable(this);
    const params = new URLSearchParams(window.location.search);
    const moneyStr = params.get('money') ?? '0';
    this.money = parseInt(moneyStr, 10);
  }

  @action.bound buySpaceship(spaceshipIndex: number, cost: number) {
    this.money -= cost;
    this.ownedSpaceships.add(spaceshipIndex);
  }
}
