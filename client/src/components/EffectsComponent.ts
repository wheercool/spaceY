export type EffectsComponent = Effect[];

export interface Effect {
  name: EffectName;
  id: number;
  size: number;
}

export enum EffectName {
  Explosion,
  Fire,
  GravityWavePull,
  GravityWavePush
}

let effectId = 1;

export function createEffect(name: EffectName, size: number): Effect {
  return {
    id: effectId++,
    name,
    size
  }
}