import { action, computed, makeObservable, observable } from 'mobx';
import { Spaceship } from './Spaceship';
import { EquipmentName, SpaceshipName } from '../types';
import { Weapon } from './Weapon';
import { WalletStore } from './WalletStore';

const createEnergyShield = () => {
  return new Weapon(EquipmentName.EnergyShield).update({
    cost: 300,
    allFacts: [
      [
        { name: 'consumption', displayValue: '1', value: 1 },
      ],
      [
        { name: 'consumption', displayValue: '1.5', value: 1.5 },
      ]
    ]
  });
}

const rabbit = new Spaceship(SpaceshipName.Rabbit, [
  { name: 'speed', displayValue: 'very fast', value: 4 },
  { name: 'weight', displayValue: 'light', value: 1.5 },
]);

rabbit.cost = 0;

const createGravityGun = () => new Weapon(EquipmentName.GravityGun)
  .update({
    cost: 100,
    allFacts: [
      [{ name: 'consumption', displayValue: '1', value: 1 }, { name: 'power', displayValue: 'low', value: 100000 }],
      [{ name: 'consumption', displayValue: '0.9', value: 0.9 }, { name: 'power', displayValue: 'medium', value: 400000 }],
      [{ name: 'consumption', displayValue: '0.8', value: 0.8 }, { name: 'power', displayValue: 'high', value: 1000000 }]
    ]
  });

const createTurret = () => new Weapon(EquipmentName.Turret)
  .update({
    cost: 100,
    allFacts: [
      [
        { name: 'power', displayValue: '1', value: 1 },
        { name: 'cooldown', displayValue: '0.7', value: 0.7 }
      ],
      [
        { name: 'power', displayValue: '1.5', value: 1.5 },
        { name: 'cooldown', displayValue: '0.5', value: 0.5 }
      ],
      [
        { name: 'power', displayValue: '2', value: 2 },
        { name: 'cooldown', displayValue: '0.2', value: 0.2 }
      ]
    ]
  });

rabbit.weapons = [
  createGravityGun()
]

const storm = new Spaceship(SpaceshipName.Storm, [
  { name: 'speed', displayValue: 'fast', value: 4 },
  { name: 'weight', displayValue: 'medium', value: 1 },
]);
storm.cost = 400;
storm.weapons = [
  createTurret()
]

const valkiria = new Spaceship(SpaceshipName.Valkiria, [
  { name: 'speed', displayValue: 'medium', value: 3 },
  { name: 'weight', displayValue: 'heavy', value: 1.5 },
]);
valkiria.cost = 600;

valkiria.weapons = [
  createTurret(),
  createGravityGun()
]

export class DockStore {
  @observable spaceships = [rabbit, storm, valkiria];
  @observable spaceshipInUseIndex = 0;
  @observable currentSpaceshipIndex = 0;

  @computed get spaceshipInUse() {
    return this.spaceships[this.spaceshipInUseIndex];
  }

  @computed get currentSpaceship(): Spaceship {
    return this.spaceships[this.currentSpaceshipIndex];
  }

  @computed get hasNextSpaceship() {
    return (this.currentSpaceshipIndex + 1) < this.spaceships.length;
  }

  @computed get hasPrevSpaceship() {
    return this.currentSpaceshipIndex >= 1;
  }

  @computed get isCurrentSpaceshipBought(): boolean {
    return this.walletStore.ownedSpaceships.has(this.currentSpaceshipIndex)
  }

  @computed get isCurrentSpaceshipInUse(): boolean {
    return this.spaceshipInUseIndex === this.currentSpaceshipIndex
  }

  @computed get hasMoneyToBuyCurrentSpaceship(): boolean {
    return this.currentSpaceship.cost <= this.walletStore.money;
  }

  constructor(private walletStore: WalletStore) {
    makeObservable(this);
  }

  hasMoney(money: number): boolean {
    return this.walletStore.money >= money;
  }
  @action.bound nextSpaceship() {
    this.currentSpaceshipIndex++;
  }

  @action.bound prevSpaceship() {
    this.currentSpaceshipIndex--;
  }

  @action.bound buyCurrentSpaceship() {
    this.walletStore.buySpaceship(this.currentSpaceshipIndex, this.currentSpaceship.cost);
  }

  @action.bound useCurrentSpaceship() {
    if (this.isCurrentSpaceshipBought) {
      this.spaceshipInUseIndex = this.currentSpaceshipIndex;
    }
  }

  @action.bound upgradeWeapon(weapon: Weapon) {
    if (this.walletStore.money - weapon.cost >= 0) {
      this.walletStore.money -= weapon.cost;
      weapon.upgrade();
    }
  }
}
