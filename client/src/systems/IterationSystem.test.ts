import { EntityRegistry } from '../entities/EntityRegistry';
import { EntityBuilder } from '../entities/EntityBuilder';
import { IterationSystem } from './IterationSystem';

describe('IterationSystem', () => {
  it('should update entities iterations', () => {
    const registry: EntityRegistry = new EntityRegistry()
    const e1 = new EntityBuilder()
      .applyComponent('iteration', 10)
      .build();
    const e2 = new EntityBuilder()
      .applyComponent('iteration', 42)
      .build();
    const e3 = new EntityBuilder()
      .applyComponent('iteration', 0)
      .build();

    registry.addEntity(e1)
    registry.addEntity(e2)
    registry.addEntity(e3)
    const iterationSystem = new IterationSystem();
    iterationSystem.init(registry);
    iterationSystem.update(registry);
    expect(registry.entities.length).toEqual(3);
    expect(registry.entities).toEqual(expect.arrayContaining([
      { id: e1.id, iteration: 11 },
      { id: e2.id, iteration: 43 },
      { id: e3.id, iteration: 1 }
    ]))
  })
})
