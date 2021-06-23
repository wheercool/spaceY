import { EquipmentImage } from './ui/components/SpaceshipEquipment/SpaceshipEquipment';

export interface QuestRequirement {
  met: boolean;
  name: string;
}

export enum SpaceshipName {
  Rabbit   = 'Rabbit',
  Storm    = 'Storm',
  Valkiria = 'Valkiria'
}
export enum EquipmentName {
  Rocket = 'Rocket',
  Turret = 'Turret',
  EnergyShield = 'Energy shield',
  GravityGun = 'Gravity Gun'
}
export type SpaceshipFacts = Fact[];
export interface Fact {
  name: string;
  value: string;
}

export type Equipment = EquipmentItem[];

export interface EquipmentItem {
  name: string;
  image: EquipmentImage;
  level: number;
  cost: number;
  canUpgrade: boolean;
  canBuy: boolean;
  facts: Fact[];
  upgradedFacts: Fact[];
  bought: boolean;
}

export interface MergedFact {
  name: string;
  value: string;
  newValue: string;
}

export function mergeFacts(facts: Fact[], upgradedFacts: Fact[]): MergedFact[] {
  const map = new Map<string, MergedFact>();
  for (const fact of facts) {
    map.set(fact.name, { name: fact.name, value: fact.value, newValue: '' });
  }
  for (const fact of upgradedFacts) {
    const mappedFact: MergedFact = map.get(fact.name) ?? { name: fact.name, value: '', newValue: fact.value };
    mappedFact.newValue = fact.value;
    map.set(fact.name, mappedFact);
  }
  return Array.from(map.values());
}
