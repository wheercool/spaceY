import { action, computed, makeObservable, observable } from 'mobx';
import { Spaceship } from './Spaceship';
import { EquipmentName, SpaceshipName } from '../types';
import { Weapon } from './Weapon';

const createEnergyShield = () => {
  return new Weapon(EquipmentName.EnergyShield).update({
    cost: 300,
    allFacts: [
      [
        { name: 'consumption', value: '1' },
      ],
      [
        { name: 'consumption', value: '1.5' },
      ]
    ]
  });
}

const rabbit = new Spaceship(SpaceshipName.Rabbit, [
  { name: 'Speed', value: 'very fast' },
  { name: 'Weight', value: 'light' },
]);
rabbit.cost = 0;

rabbit.weapons = [
  new Weapon(EquipmentName.GravityGun)
    .update({
      cost: 100,
      allFacts: [
        [{ name: 'consumption', value: '1' }],
        [{ name: 'consumption', value: '0.9' }],
        [{ name: 'consumption', value: '0.8' }]
      ]
    }),
  createEnergyShield()
]

const storm = new Spaceship(SpaceshipName.Storm, [
  { name: 'Speed', value: 'fast' },
  { name: 'Weight', value: 'medium' },
]);
storm.cost = 1000;
storm.weapons = [
  new Weapon(EquipmentName.Turret)
    .update({
      cost: 400,
      allFacts: [
        [
          { name: 'power', value: '1' },
          { name: 'coldown', value: '2' }
        ],
        [
          { name: 'power', value: '1.5' },
          { name: 'coldown', value: '1.8' }
        ],
        [
          { name: 'power', value: '2' },
          { name: 'coldown', value: '1.5' }
        ]
      ]
    }),
  createEnergyShield()
]

const valkiria = new Spaceship(SpaceshipName.Valkiria, [
  { name: 'Speed', value: 'medium' },
  { name: 'Weight', value: 'heavy' },
]);
valkiria.cost = 10000;

valkiria.weapons = [
  new Weapon(EquipmentName.Rocket).update({
    cost: 1000,
    allFacts: [
      [
        { name: 'speed', value: '1' },
        { name: 'power', value: '1' },
        { name: 'coldown', value: '1' },
      ], [
        { name: 'speed', value: '2' },
        { name: 'power', value: '3' },
        { name: 'coldown', value: '4' },
      ]]
  }),
  createEnergyShield()
]

export class SpaceshipStore {
  @observable spaceships = [rabbit, storm, valkiria];
  @observable spaceshipInUseIndex = 0;
  @observable currentSpaceshipIndex = 0;

  @computed get spaceshipInUse() {
    return this.spaceships[this.spaceshipInUseIndex];
  }

  @computed get currentSpaceship() {
    return this.spaceships[this.currentSpaceshipIndex];
  }

  @computed get hasNextSpaceship() {
    return (this.currentSpaceshipIndex + 1) < this.spaceships.length;
  }

  @computed get hasPrevSpaceship() {
    return this.currentSpaceshipIndex >= 1;
  }

  constructor() {
    makeObservable(this);
  }

  @action.bound nextSpaceship() {
    this.currentSpaceshipIndex++;
  }

  @action.bound prevSpaceship() {
    this.currentSpaceshipIndex--;
  }
}
