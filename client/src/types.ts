import { EquipmentImage } from './ui/components/SpaceshipEquipment/SpaceshipEquipment';

export enum Brand {
  EntityId,
  TimeSpan,
  GravityTag
}

export type EntityId = number & { brand: Brand.EntityId };
export type TimeSpan = number & { brand: Brand.TimeSpan };

//1 tick - 0.1 s
export function makeTicks(value: number): TimeSpan {
  return value as TimeSpan;
}

export function makeSeconds(value: number): TimeSpan {
  return value * 10 as TimeSpan;
}

export function makeEntityId(value: number): EntityId {
  return value as EntityId;
}

export function brandWith<T, V extends Brand>(value: T, brand: V): T & { brand: V } {
  return value as T & { brand: V };
}

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
  Rocket       = 'Rocket',
  Turret       = 'Turret',
  EnergyShield = 'Energy shield',
  GravityGun   = 'Gravity Gun'
}

export enum FactId {
  Consumption,
  Power,
  Text,
  Cooldown,
  Speed,
}
export type SpaceshipFacts = Fact[];

// export interface Fact {
//   id: FactId,
//   name: string;
//   displayValue: string;
// }

export interface ConsumptionFact {
  name: 'consumption';
  displayValue: string;
  value: number;
}

export interface PowerFact {
  name: 'power';
  displayValue: string;
  value: number;
}
export interface CooldownFact {
  name: 'cooldown';
  displayValue: string;
  value: number;
}

export interface SpeedFact {
  name: 'speed';
  displayValue: string;
  value: number;
}

export interface WeightFact {
  name: 'weight';
  displayValue: string;
  value: number;
}
export type Fact = ConsumptionFact | PowerFact | CooldownFact | SpeedFact | WeightFact;

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
  name: Fact['name'];
  value: string;
  newValue: string;
}

export function mergeFacts(facts: Fact[], upgradedFacts: Fact[]): MergedFact[] {
  const map = new Map<string, MergedFact>();
  for (const fact of facts) {
    map.set(fact.name, { name: fact.name, value: fact.displayValue, newValue: '' });
  }
  for (const fact of upgradedFacts) {
    const mappedFact: MergedFact = map.get(fact.name) ?? { name: fact.name, value: '', newValue: fact.displayValue };
    mappedFact.newValue = fact.displayValue;
    map.set(fact.name, mappedFact);
  }
  return Array.from(map.values());
}
