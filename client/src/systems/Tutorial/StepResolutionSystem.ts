import { System } from '../System';
import { EntityRegistry } from '../../entities/EntityRegistry';

export type StepCompletionPredicate = (registry: EntityRegistry) => boolean;
export type StepCompletionResolver = () => void;

export class StepResolutionSystem implements System {
  constructor(
    private isStepCompleted: StepCompletionPredicate,
    private resolver: StepCompletionResolver) {
  }

  init(registry: EntityRegistry): void {
  }

  update(registry: EntityRegistry): void {
    if (this.isStepCompleted(registry)) {
      this.resolver();
    }
  }
}