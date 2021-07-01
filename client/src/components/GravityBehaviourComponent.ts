/***
 * Object that describes how entity behaves with other entities
 * when gravity force is calculated
 */
export interface GravityBehaviourComponent {
  gravityTag: GravityTagName; // the name of the tag,
  pulls: GravityTagOption[]; // * - anyone
  pullableBy: GravityTagOption[];
}


export enum GravityTagName {
  Enemy     = 'enemy',
  Small     = 'small',
  Big       = 'big',
  Free      = 'free',
  EnergyGun = 'energy_gun',
  Cargo     = 'cargo'
}

export type GravityTagOption = GravityTagName | '*';

export function createGravityBehaviour(tag: GravityTagName): GravityBehaviourComponent {
  switch (tag) {
    case GravityTagName.Small:
      return {
        gravityTag: tag,
        pulls: [GravityTagName.Small],
        pullableBy: [GravityTagName.Small, GravityTagName.Big]
      }
    case GravityTagName.Big:
      return {
        gravityTag: tag,
        pulls: [GravityTagName.Small],
        // pulls: [],
        pullableBy: []
      }

    case GravityTagName.Free:
      return {
        gravityTag: tag,
        pulls: [],
        pullableBy: []
      }
    case GravityTagName.EnergyGun:
      return {
        gravityTag: GravityTagName.EnergyGun,
        pullableBy: [],
        pulls: [GravityTagName.Enemy, GravityTagName.Cargo]
      }
    case GravityTagName.Enemy: {
      return {
        gravityTag: GravityTagName.Enemy,
        pulls: [GravityTagName.Small],
        pullableBy: [GravityTagName.EnergyGun, GravityTagName.Small, GravityTagName.Big]
      }
    }

    case GravityTagName.Cargo: {
      return {
        gravityTag: GravityTagName.Cargo,
        pulls: [],
        pullableBy: [GravityTagName.EnergyGun]
      }
    }
  }
}
