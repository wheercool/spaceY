export class Clock {
  private startedAt: number = -1;
  private started = false;

  constructor(private updateRate: number) {
  }

  start() {
    this.started = true;
    this.startedAt = Date.now();
  }

  currentFrame(): number {
    if (!this.started) {
      return -1;
    }
    const now = Date.now();
    const dt = now - this.startedAt;
    return Math.floor(dt * this.updateRate / 1000);
  }
}
