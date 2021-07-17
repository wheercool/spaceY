import { System } from '../System';
import { EntityRegistry } from '../../entities/EntityRegistry';

export class DisableSystemDecorator implements System {
  private disabled = false;

  constructor(
    private system: System
  ) {
  }

  disable() {
    this.disabled = true;
  }

  enable() {
    this.disabled = false;
  }

  init(registry: EntityRegistry): void {
    this.system.init(registry);
  }

  update(registry: EntityRegistry): void {
    if (!this.disabled) {
      this.system.update(registry);
    }
  }

}