export interface GravityGunComponent {
  consumption: number; // how much energy consumes
  power: number; // mass
  trigger: GravityGunTrigger;
  active: boolean;
}
export enum GravityGunTrigger {
 Off,
 Pull,
 Push
}

export interface GravityGunOptions {
  consumption: number,
  power: number
}

export function createGravityGun(options: GravityGunOptions): GravityGunComponent {
  return {
    consumption: options.consumption,
    power: options.power,
    trigger: GravityGunTrigger.Off,
    active: false
  };
}
