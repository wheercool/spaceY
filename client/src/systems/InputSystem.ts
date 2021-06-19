import { System } from './System';
import { EntityRegistry } from '../entities/EntityRegistry';
import { Controller } from '../services/Controller';
import { EntityBuilder } from '../entities/EntityBuilder';
import { InputComponent } from '../components/InputComponent';

/***
 * Updates inputs based on the user interaction
 */
export class InputSystem implements System {
  private controller: Controller;

  constructor() {
    this.controller = new Controller()
  }

  init(registry: EntityRegistry) {
    const input = new EntityBuilder()
      .applyComponent('input', this.getInputComponent())
      .build();
    registry.addEntity(input);
  }

  update(registry: EntityRegistry): void {
    const inputEntity = registry.findSingle(['input']);
    inputEntity.input = this.getInputComponent();
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
