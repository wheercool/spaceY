import { SpaceshipFacts, SpaceshipName } from '../types';
import { observable } from 'mobx';
import { Weapon } from './Weapon';

export class Spaceship {
  @observable weapons: Weapon[] = [];
  @observable cost = 0;

  constructor(
    public readonly name: SpaceshipName,
    public readonly info: SpaceshipFacts
  ) {
  }
}
