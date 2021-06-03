export class Controller {
  upPressed = false;
  downPressed = false;
  leftPressed = false;
  rightPressed = false;

  constructor() {
    window.addEventListener('keydown', this.onKeyDown)
    window.addEventListener('keyup', this.onKeyUp)
  }

  private onKeyDown = (event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    if (key == 'arrowleft') {
      this.leftPressed = true;
    }
    if (key == 'arrowright') {
      this.rightPressed = true;
    }
    if (key == 'arrowup') {
      this.upPressed = true;
    }
    if (key === 'arrowdown') {
      this.downPressed = true;
    }
  }

  private onKeyUp = (event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    if (key == 'arrowleft') {
      this.leftPressed = false;
    }
    if (key == 'arrowright') {
      this.rightPressed = false;
    }
    if (key == 'arrowup') {
      this.upPressed = false;
    }
    if (key === 'arrowdown') {
      this.downPressed = false;
    }
  }
}
