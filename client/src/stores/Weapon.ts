import { action, computed, makeObservable, observable } from 'mobx';
import { EquipmentName, Fact } from '../types';

export class Weapon {
  @observable bought: boolean = false;
  @observable level: number = 1;

  @computed get canUpgrade(): boolean {
    return false;
  }

  @computed get canBuy(): false {
    return false;
  }

  @observable cost: number = 0;

  @observable facts: Fact[] = []

  @observable upgradedFacts: Fact[] = []

  constructor(
    public readonly name: EquipmentName
  ) {
    makeObservable(this);
  }

  @action.bound upgrade() {

  }

  update(config: Partial<Weapon>) {
    Object.assign(this, config);
    return this;
  }
}