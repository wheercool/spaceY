export class Controller {
  top = false;
  bottom = false;
  left = false;
  right = false;
  space = false;
  g = false;
  f = false;

  constructor() {
    window.addEventListener('keydown', this.onKeyDown)
    window.addEventListener('keyup', this.onKeyUp)
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
