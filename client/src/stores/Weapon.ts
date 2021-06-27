import { action, computed, makeObservable, observable } from 'mobx';
import { EquipmentName, Fact } from '../types';

export class Weapon {
  @observable bought: boolean = false;
  @observable level: number = 1;

  private get index() {
    return this.level - 1;
  }

  @computed get hasUpgrade(): boolean {
    return (this.index + 1) < this.allFacts.length;
  }

  @computed get canBuy(): boolean {
    return false;
  }

  @observable cost: number = 0;

  @computed get facts(): Fact[] {
    return this.index < this.allFacts.length
      ? this.allFacts[this.index]
      : [];
  }

  @computed get upgradedFacts(): Fact[] {
    return (this.index + 1) < this.allFacts.length
      ? this.allFacts[this.index + 1]
      : [];
  }

  @observable allFacts: Fact[][] = [];

  constructor(
    public readonly name: EquipmentName
  ) {
    makeObservable(this);
  }

  @action.bound upgrade() {
    this.level++;
  }

  update(config: Partial<Weapon>) {
    Object.assign(this, config);
    return this;
  }
}
