import { System } from './System';
import { Compositor } from './Compositor';
import { EntityRegistry } from '../entities/EntityRegistry';

describe('Compositor', () => {
  it('should update all registered system in order', () => {
    const mockFn = jest.fn();
    const system1: System = {
      update: (...args) => mockFn('system1', ...args)
    };

    const system2: System = {
      update: (...args) => mockFn('system2', ...args)
    };

    const system3: System = {
      update: (...args) => mockFn('system3', ...args)
    };

    const compositor = new Compositor([system1, system2, system3]);
    const registry = new EntityRegistry();
    compositor.update(registry);
    expect(mockFn).toHaveBeenNthCalledWith(1, 'system1', registry);
    expect(mockFn).toHaveBeenNthCalledWith(2, 'system2', registry);
    expect(mockFn).toHaveBeenNthCalledWith(3, 'system3', registry);
  })

  it('should count iterations', () => {
    const registry = new EntityRegistry();
    const compositor = new Compositor([]);
    compositor.update(registry);

    const iterations = registry.findEntitiesByComponents(['iteration']);
    expect(iterations.length).toEqual(1);
    const iteration = iterations[0];
    expect(iteration.iteration).toEqual(1);

    compositor.update(registry);
    expect(iteration.iteration).toEqual(2);
  })
})
