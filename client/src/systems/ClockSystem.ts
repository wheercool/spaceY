import { System } from './System';
import { EntityRegistry } from '../entities/EntityRegistry';
import { EntityBuilder } from '../entities/EntityBuilder';

/***
 * Counts game time
 */
export class ClockSystem implements System {
  init(registry: EntityRegistry): void {
    const clock = new EntityBuilder()
      .applyComponent('time', {
        current: 0,
        dt: 0.16
      })
      .build();
    registry.addEntity(clock);
  }

  update(registry: EntityRegistry): void {
    const time = registry.findSingle(['time']).time;
    time.current += time.dt;
  }
}
