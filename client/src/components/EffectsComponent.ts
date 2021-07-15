import { Point2D } from '@shared/types/Point2D';

export type EffectsComponent = Effect[];

export interface Effect {
  name: EffectName;
  id: number;
  size: Point2D;
  rotation: number;
  relativePosition: Point2D;
}

export enum EffectName {
  Explosion       = 'Explosion',
  Fire            = 'Fire',
  GravityWavePull = 'GravityWavePull',
  GravityWavePush = 'GravityWavePush'
}

let effectId = 1;

interface EffectOptions {
  relativePosition: Point2D,
  rotation: number
}

export function createEffect(name: EffectName,
                             size: Point2D,
                             config: Partial<EffectOptions> | undefined = undefined): Effect {
  const relativePosition = config?.relativePosition ?? { x: 0, y: 0 };
  const rotation = config?.rotation ?? 0;
  return {
    id: effectId++,
    name,
    size,
    relativePosition,
    rotation
  }
}

export function addEffectIfNotExist(effects: Effect[], effectToAdd: Effect) {
  if (!effects.some(effect => effect.name === effectToAdd.name)) {
    effects.push(effectToAdd);
  }
}

export function removeEffect(effects: Effect[], effectName: EffectName) {
  let i = 0;
  while (i < effects.length) {
    if (effects[i].name === effectName) {
      effects.splice(i, 1);
    } else {
      i++;
    }
  }
}