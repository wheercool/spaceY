import { System } from './System';
import { EntityRegistry } from '../entities/EntityRegistry';
import { EntityBuilder } from '../entities/EntityBuilder';
import { OnTimerFinished, startTimer } from '../components/TimerComponent';
import { makeSeconds, makeTicks } from '../types';
import { SIMULATION_UPDATE_RATE } from '@shared/constants';

/***
 * Counts game time
 */
export class ClockSystem implements System {
  init(registry: EntityRegistry): void {
    const clock = new EntityBuilder()
      .applyComponent('time', {
        current: 0,
        dt: makeSeconds(1 / SIMULATION_UPDATE_RATE)
      })
      .build();
    registry.addEntity(clock);
  }

  update(registry: EntityRegistry): void {
    const time = registry.findSingle(['time']).time;
    time.dt = makeSeconds(1 / SIMULATION_UPDATE_RATE);
    time.current += time.dt;
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
