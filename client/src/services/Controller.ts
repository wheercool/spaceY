export class Controller {
  top = false;
  bottom = false;
  left = false;
  right = false;

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
  }
}
