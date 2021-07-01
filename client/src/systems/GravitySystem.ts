import { System } from './System';
import { EntityRegistry } from '../entities/EntityRegistry';
import { add, divByScalar, length, mulByScalar, sub } from '@shared/types/Point2D';
import { EntityBuilder } from '../entities/EntityBuilder';
import { EPS } from '../utils';
import { GravityForceComponent } from '../components/GravityForceComponent';
import { Entity } from '../entities/Entity';
import { ComponentsRegistry } from '../components/Components';

// Gravity constant
const G = 1;
const DISTANCE_TO_CHANGE_FORCE_DIRECTION = 250;

/***
 * Calculates gravity forces between entities with mass
 */
export class GravitySystem implements System {
  private inverseGravityWhenClose: boolean;

  constructor() {
    const params = new URLSearchParams(window.location.search);
    this.inverseGravityWhenClose = params.get('inverse_gravity') !== null;
  }

  update(registry: EntityRegistry): void {
    const elements = registry.findEntitiesByComponents(['mass', 'position', 'gravityBehaviour']);

    const forces: GravityForceComponent[] = [];
    for (let i = 0; i < elements.length; i++) {
      forces.push({ x: 0, y: 0 });
    }
    for (let i = 0; i < elements.length; i++) {
      for (let j = i + 1; j < elements.length; j++) {
        const e1 = elements[i];
        const e2 = elements[j];
        // Direction in which e1 pulls e2
        const distVector = sub(e1.position, e2.position);
        let distance = length(distVector);
        if (distance === 0) {
          distance = EPS;
        }
        let F = Math.abs(distance) > EPS
          ? G * e1.mass * e2.mass / (distance * distance)
          : 0;

        if (this.inverseGravityWhenClose && distance < DISTANCE_TO_CHANGE_FORCE_DIRECTION) {
          F *= -1;
        }
        const distNormalized = divByScalar(distVector, distance);
        if (this.isPulling(e1, e2)) {
          forces[j] = add(forces[j], mulByScalar(distNormalized, F));
        }
        if (this.isPulling(e2, e1)) {
          forces[i] = add(forces[i], mulByScalar(distNormalized, -F));
        }
      }
    }

    for (let i = 0; i < elements.length; i++) {

      EntityBuilder.fromEntity(elements[i])
        .applyComponent('gravityForce', forces[i])
    }
  }

  init(registry: EntityRegistry): void {
  }

  private isPulling(pullingEntity: Entity & Pick<ComponentsRegistry, 'gravityBehaviour'>, pullableEntity: Entity & Pick<ComponentsRegistry, 'gravityBehaviour'>) {
    return this.isPullingEntityCanPull(pullingEntity, pullableEntity) && this.isPullableEntityCanBePulled(pullingEntity, pullableEntity);
  }

  private isPullingEntityCanPull(pullingEntity: Entity & Pick<ComponentsRegistry, 'gravityBehaviour'>, pullableEntity: Entity & Pick<ComponentsRegistry, 'gravityBehaviour'>) {
    const pullableEntityTag = pullableEntity.gravityBehaviour.gravityTag;
    return pullingEntity.gravityBehaviour.pulls.some(tag => tag === '*' || tag === pullableEntityTag);
  }

  private isPullableEntityCanBePulled(pullingEntity: Entity & Pick<ComponentsRegistry, 'gravityBehaviour'>, pullableEntity: Entity & Pick<ComponentsRegistry, 'gravityBehaviour'>) {
    const pullingEntityTag = pullingEntity.gravityBehaviour.gravityTag;
    return pullableEntity.gravityBehaviour.pullableBy.some(tag => tag === '*' || tag === pullingEntityTag);
  }
}


