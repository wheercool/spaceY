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
        { name: 'consumption', displayValue: '1', value: 1},
      ],
      [
        { name: 'consumption', displayValue: '1.5', value: 1.5},
      ]
    ]
  });
}

const rabbit = new Spaceship(SpaceshipName.Rabbit, [
  { name: 'speed', displayValue: 'very fast', value: 4},
  { name: 'weight', displayValue: 'light', value: 0.5},
]);

rabbit.cost = 0;

rabbit.weapons = [
  new Weapon(EquipmentName.GravityGun)
    .update({
      cost: 100,
      allFacts: [
        [{ name: 'consumption', displayValue: '1' , value: 1}, { name: 'power', displayValue: 'low', value: 100000}],
        [{ name: 'consumption', displayValue: '0.9', value: 0.9}, { name: 'power', displayValue: 'medium', value: 400000}],
        [{ name: 'consumption', displayValue: '0.8', value: 0.8}, { name: 'power', displayValue: 'high', value: 1000000}]
      ]
    }),
  createEnergyShield()
]

const storm = new Spaceship(SpaceshipName.Storm, [
  { name: 'speed', displayValue: 'fast', value: 4 },
  { name: 'weight', displayValue: 'medium', value: 1},
]);
storm.cost = 1000;
storm.weapons = [
  new Weapon(EquipmentName.Turret)
    .update({
      cost: 400,
      allFacts: [
        [
          { name: 'power', displayValue: '1', value: 1 },
          { name: 'cooldown', displayValue: '2', value: 2}
        ],
        [
          { name: 'power', displayValue: '1.5', value: 1.5},
          { name: 'cooldown', displayValue: '1.8', value: 1.8 }
        ],
        [
          { name: 'power', displayValue: '2', value: 2},
          { name: 'cooldown', displayValue: '1.5', value: 1.5}
        ]
      ]
    }),
  createEnergyShield()
]

const valkiria = new Spaceship(SpaceshipName.Valkiria, [
  { name: 'speed', displayValue: 'medium', value: 3 },
  { name: 'weight', displayValue: 'heavy', value: 1.5 },
]);
valkiria.cost = 10000;

valkiria.weapons = [
  new Weapon(EquipmentName.Rocket).update({
    cost: 1000,
    allFacts: [
      [
        { name: 'speed', displayValue: '1', value: 1},
        { name: 'power', displayValue: '1', value: 1},
        { name: 'cooldown', displayValue: '1', value: 1}
      ], [
        { name: 'speed', displayValue: '2', value: 2},
        { name: 'power', displayValue: '3', value: 3},
        { name: 'cooldown', displayValue: '4', value: 4},
      ]]
  }),
  createEnergyShield()
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
