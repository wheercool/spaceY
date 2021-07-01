import { computed, makeObservable } from 'mobx';
import { DockStore } from './DockStore';
import { Achievement, EquipmentName } from '../types';

export class PlayerAchievementsStore {
  @computed get achievements(): Achievement[] {
    const result: Achievement[] = [];
    if (this.dock.spaceshipInUse.weapons.some(weapon => weapon.name === EquipmentName.GravityGun)) {
      result.push(Achievement.GravityGun);
    }
    return result;
  }

  constructor(private readonly dock: DockStore) {
    makeObservable(this);
  }
}
