import { System } from './System';
import { EntityRegistry } from '../entities/EntityRegistry';
import { add, divByScalar, length, mulByScalar, Point2D, sub } from '@shared/types/GameState';
import { EntityBuilder } from '../entities/EntityBuilder';

// Gravity constant
const G = 1;
const eps = 0.000001;

export class Gravity implements System {
  update(registry: EntityRegistry): void {
    const elements = registry.findEntitiesByComponents(['mass', 'position']);

    const forces: Point2D[] = [];
    for (let i = 0; i < elements.length; i++) {
      forces.push({ x: 0, y: 0 });
    }
    for (let i = 0; i < elements.length; i++) {
      for (let j = i + 1; j < elements.length; j++) {
        const e1 = elements[i];
        const e2 = elements[j];
        const distVector = sub(e1.position, e2.position);
        const distance = length(distVector);
        const F = Math.abs(distance) > eps
          ? G * e1.mass * e2.mass / (distance * distance)
          : 0;
        console.log('distance: ', distance, 'F: ', F);
        const distNormalized = divByScalar(distVector, distance);
        forces[i] = add(forces[i], mulByScalar(distNormalized, -F));
        forces[j] = add(forces[j], mulByScalar(distNormalized, F));
      }
    }

    for (let i = 0; i < elements.length; i++) {
      EntityBuilder.fromEntity(elements[i])
        .applyComponent('gravity', forces[i])
        .build();
    }
  }

  init(registry: EntityRegistry): void {
  }
}
