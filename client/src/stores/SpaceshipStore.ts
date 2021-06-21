import { action, computed, makeObservable, observable } from 'mobx';
import { Spaceship } from './Spaceship';
import { EquipmentName, SpaceshipName } from '../types';
import { Weapon } from './Weapon';


const rabbit = new Spaceship(SpaceshipName.Rabbit, [
  { name: 'Speed', value: 'very fast' },
  { name: 'Weight', value: 'light' },
]);
const storm = new Spaceship(SpaceshipName.Storm, [
  { name: 'Speed', value: 'fast' },
  { name: 'Weight', value: 'medium' },
]);
const valkiria = new Spaceship(SpaceshipName.Valkiria, [
  { name: 'Speed', value: 'medium' },
  { name: 'Weight', value: 'heavy' },
]);

valkiria.weapons = [
  new Weapon(EquipmentName.Rocket).update({
    cost: 1000
  }),
  new Weapon(EquipmentName.EnergyShield).update({
    cost: 300
  })
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