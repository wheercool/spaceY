import { action, computed, makeObservable, observable } from 'mobx';
import { EquipmentButtonModel } from './EquipmentButtonModel';

import gravityGunImg from '/public/assets/images/gravity_gun_small.png';
import turretImg from '/public/assets/images/turret.png';
import shieldImg from '/public/assets/images/energy_shield.png';
import rocketsImg from '/public/assets/images/rocket.png';
import rabbitImg from '/public/assets/images/rabbit.png';
import stormImg from '/public/assets/images/storm.png';
import valkiriaImg from '/public/assets/images/valkiria.png';
import { SpaceshipName } from '../../types';


export class SpaceshipPanelStore {
  @observable visible = true;

  @observable gravityGun: EquipmentButtonModel = {
    title: 'Gravity gun',
    button: 'Q | W',
    spendable: false,
    count: 0,
    maxCount: 0,
    image: gravityGunImg,
    cooldownPercent: 0,
    active: false,
    exist: false
  };
  @observable turret: EquipmentButtonModel = {
    title: 'Turret',
    button: 'E',
    spendable: false,
    count: 0,
    maxCount: 0,
    image: turretImg,
    cooldownPercent: 10,
    active: false,
    exist: false
  };
  @observable shield: EquipmentButtonModel = {
    title: 'Shield',
    button: 'R',
    spendable: false,
    count: 0,
    maxCount: 0,
    image: shieldImg,
    cooldownPercent: 100,
    active: false,
    exist: false
  };
  @observable rockets: EquipmentButtonModel = {
    title: 'Rockets',
    button: 'T',
    spendable: true,
    count: 5,
    maxCount: 10,
    image: rocketsImg,
    cooldownPercent: 50,
    active: false,
    exist: false
  }

  @observable spaceshipName = '';

  @computed get spaceshipImage(): string {
    switch (this.spaceshipName) {
      case SpaceshipName.Rabbit:
        return rabbitImg;
      case SpaceshipName.Storm:
        return stormImg;
      case SpaceshipName.Valkiria:
        return valkiriaImg;
      default:
        return '';
    }
  }

  constructor() {
    makeObservable(this);
  }

  @action.bound hide() {
    this.visible = false;
  }
  @action.bound show() {
    this.visible = true;
  }
  @action.bound updateGravityGunCooldown(percent: number) {
    this.gravityGun.cooldownPercent = percent;
  }

  @action.bound updateTurretCooldown(percent: number) {
    this.turret.cooldownPercent = percent;
  }

  @action.bound hasTurret(value: boolean) {
    this.turret.exist = value;
  }

  @action.bound hasGravityGun(value: boolean, isActive: boolean | undefined = undefined) {
    this.gravityGun.exist = value;
    if (isActive !== undefined) {
      this.gravityGun.active = isActive;
    }
  }

  @action.bound updateSpaceship(name: string) {
    this.spaceshipName = name;
  }
}
