import { System } from './System';
import { EntityRegistry } from '../entities/EntityRegistry';
import { EntityBuilder } from '../entities/EntityBuilder';
import { InputComponent } from '../components/InputComponent';
import { Key } from '../utils';

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
    if (key == Key.ARROW_LEFT) {
      this.left = true;
    }
    if (key == Key.ARROW_RIGHT) {
      this.right = true;
    }
    if (key == Key.ARROW_UP) {
      this.top = true;
    }
    if (key === Key.ARROW_DOWN) {
      this.bottom = true;
    }
    if (key === Key.Q) {
      this.q = true;
    }
    if (key === Key.W) {
      this.w = true;
    }
    if (key == Key.E) {
      this.e = true;
    }
    if (key == Key.R) {
      this.r = true;
    }
    if (key == Key.T) {
      this.r = true;
    }
  }

  private onKeyUp = (event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    if (key == Key.ARROW_LEFT) {
      this.left = false;
    }
    if (key == Key.ARROW_RIGHT) {
      this.right = false;
    }
    if (key == Key.ARROW_UP) {
      this.top = false;
    }
    if (key === Key.ARROW_DOWN) {
      this.bottom = false;
    }
    if (key === Key.Q) {
      this.q = false;
    }
    if (key === Key.W) {
      this.w = false;
    }
    if (key == Key.E) {
      this.e = false;
    }
    if (key == Key.R) {
      this.r = false;
    }
    if (key == Key.T) {
      this.t = false;
    }
  }
}
