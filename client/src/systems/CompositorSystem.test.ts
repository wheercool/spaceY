import { System } from './System';
import { CompositorSystem } from './CompositorSystem';
import { EntityRegistry } from '../entities/EntityRegistry';
import Mock = jest.Mock;

describe('Compositor', () => {
  let systems: System[] = [];
  let updateMock: Mock;
  let initMock: Mock;
  beforeEach(() => {
    jest.resetAllMocks();
    updateMock = jest.fn();
    initMock = jest.fn();
    const system1: System = {
      init: (...args) => initMock('system1', ...args),
      update: (...args) => updateMock('system1', ...args)
    };

    const system2: System = {
      init: (...args) => initMock('system2', ...args),
      update: (...args) => updateMock('system2', ...args)
    };

    const system3: System = {
      init: (...args) => initMock('system3', ...args),
      update: (...args) => updateMock('system3', ...args)
    };
    systems = [system1, system2, system3];
  })
  it('should init each system in order', () => {
    const compositor = new CompositorSystem(systems);
    const registry = new EntityRegistry();
    compositor.init(registry);
    expect(initMock).toHaveBeenNthCalledWith(1, 'system1', registry);
    expect(initMock).toHaveBeenNthCalledWith(2, 'system2', registry);
    expect(initMock).toHaveBeenNthCalledWith(3, 'system3', registry);
  })
  it('should update all registered system in order', () => {
    const compositor = new CompositorSystem(systems);
    const registry = new EntityRegistry();
    compositor.init(registry);
    compositor.update(registry);
    expect(updateMock).toHaveBeenNthCalledWith(1, 'system1', registry);
    expect(updateMock).toHaveBeenNthCalledWith(2, 'system2', registry);
    expect(updateMock).toHaveBeenNthCalledWith(3, 'system3', registry);
  })
})
