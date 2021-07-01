import { System } from './System';
import { EntityRegistry } from '../entities/EntityRegistry';
import { EntityBuilder } from '../entities/EntityBuilder';
import { OnTimerFinished, startTimer } from '../components/TimerComponent';
import { makeTicks } from '../types';

/***
 * Counts game time
 */
export class ClockSystem implements System {
  init(registry: EntityRegistry): void {
    const clock = new EntityBuilder()
      .applyComponent('time', {
        current: makeTicks(0),
        dt: makeTicks(0.1)
      })
      .build();
    registry.addEntity(clock);
  }

  update(registry: EntityRegistry): void {
    const time = registry.findSingle(['time']).time;
    time.current = makeTicks(time.current + time.dt);
    this.handleTimers(registry, time.dt);
  }

  private handleTimers(registry: EntityRegistry, dt: number) {
    const timerEntities = registry.findEntitiesByComponents(['timer']);
    for (const timerEntity of timerEntities) {
      const timer = timerEntity.timer;
      timer.elapsed -= dt;
      if (timer.elapsed <= 0) {
        switch (timer.onFinish) {
          case OnTimerFinished.Destroy:
            registry.removeEntity(timerEntity.id);
            break;
          case OnTimerFinished.Keep:
            timer.elapsed = 0;
            break;
          case OnTimerFinished.Restart:
            const newTimer = new EntityBuilder()
              .applyComponents({
                timer: startTimer(timer.target, timer.duration, { name: timer.name, onFinish: timer.onFinish })
              }).build()
            registry.addEntity(newTimer)
            break;
        }
      }
    }
  }
}
