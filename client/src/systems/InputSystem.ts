import { System } from './System';
import { EntityRegistry } from '../entities/EntityRegistry';
import { EntityBuilder } from '../entities/EntityBuilder';
import { InputComponent } from '../components/InputComponent';

/***
 * Updates inputs based on the user interaction
 */
export class InputSystem implements System {
  private top = false;
  private bottom = false;
  private left = false;
  private right = false;
  private q = false;
  private w = false;
  private e = false;
  private r = false;
  private t = false;

  constructor() {
    window.addEventListener('keydown', this.onKeyDown)
    window.addEventListener('keyup', this.onKeyUp)
  }

  init(registry: EntityRegistry) {
    const input = new EntityBuilder()
      .applyComponent('input', this.getInputComponent())
      .build();
    registry.addEntity(input);
  }
  dispose() {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
  }

  update(registry: EntityRegistry): void {
    const inputEntity = registry.findSingle(['input']);
    inputEntity.input = this.getInputComponent();
  }

  private getInputComponent(): InputComponent {
    return {
      bottom: this.bottom,
      left: this.left,
      right: this.right,
      top: this.top,
      q: this.q,
      w: this.w,
      e: this.e,
      r: this.r,
      t: this.t
    };
  }

  private onKeyDown = (event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    if (key == 'arrowleft') {
      this.left = true;
    }
    if (key == 'arrowright') {
      this.right = true;
    }
    if (key == 'arrowup') {
      this.top = true;
    }
    if (key === 'arrowdown') {
      this.bottom = true;
    }
    if (key === 'q') {
      this.q = true;
    }
    if (key === 'w') {
      this.w = true;
    }
    if (key == 'e') {
      this.e = true;
    }
    if (key == 'r') {
      this.r = true;
    }
    if (key == 't') {
      this.r = true;
    }
  }

  private onKeyUp = (event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    if (key == 'arrowleft') {
      this.left = false;
    }
    if (key == 'arrowright') {
      this.right = false;
    }
    if (key == 'arrowup') {
      this.top = false;
    }
    if (key === 'arrowdown') {
      this.bottom = false;
    }
    if (key === 'q') {
      this.q = false;
    }
    if (key === 'w') {
      this.w = false;
    }
    if (key == 'e') {
      this.e = false;
    }
    if (key == 'r') {
      this.r = false;
    }
    if (key == 't') {
      this.r = false;
    }
  }
}
