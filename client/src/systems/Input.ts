import { System } from './System';
import { EntityRegistry } from '../entities/EntityRegistry';
import { Controller } from '../services/Controller';
import { EntityBuilder } from '../entities/EntityBuilder';
import { InputComponent } from '../components/Components';

export class Input implements System {
  private controller: Controller;

  constructor() {
    this.controller = new Controller()
  }

  update(registry: EntityRegistry): void {
    const inputs = registry.findEntitiesByComponents(['input']);
    if (!inputs.length) {
      const input = new EntityBuilder()
        .applyComponent('input', this.getInputComponent())
        .build();
      registry.addEntity(input);
    } else {
      const input = inputs[0];
      input.input = this.getInputComponent();
    }
  }

  private getInputComponent(): InputComponent {
    return {
      bottom: this.controller.bottom,
      left: this.controller.left,
      right: this.controller.right,
      top: this.controller.top
    };
  }
}
