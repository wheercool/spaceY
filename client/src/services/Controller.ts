import { Key } from './key';

export class Controller {
  top = false;
  bottom = false;
  left = false;
  right = false;
  space = false;
  g = false;
  f = false;

  private pressedKeys = new Set<string>();

  constructor() {
    window.addEventListener('keydown', this.onKeyDown)
    window.addEventListener('keyup', this.onKeyUp)
  }

  dispose() {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
  }
  isKeyPressed(key: string): boolean {
   return this.pressedKeys.has(key)
  }

  private onKeyDown = (event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    this.pressedKeys.add(key);
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
    if (key === ' ') {
      this.space = true;
    }
    if (key == 'g') {
      this.g = true;
    }
    if (key == 'f') {
      this.f = true;
    }
  }

  private onKeyUp = (event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    this.pressedKeys.delete(key);
    if (key == 'arrowleft') {
      this.left = false;
    }
    if (key == 'arrowright') {
      this.right = false;
    }
    if (key == Key.ARROW_UP) {
      this.top = false;
    }
    if (key === Key.ARROW_DOWN) {
      this.bottom = false;
    }
    if (key === ' ') {
      this.space = false;
    }
    if (key == 'g') {
      this.g = false;
    }
    if (key == 'f') {
      this.f = false;
    }
  }
}
